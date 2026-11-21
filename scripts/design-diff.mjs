// Visual QA: compares the geometry and type of every text element on our pages
// with the design board (docs/handoff/design/Direction-A.dc.html), matched by text.
//
//   npx next start -p 3100                                   (production build)
//   python3 -m http.server 3200 --bind 127.0.0.1 -d docs/handoff
//   node scripts/design-diff.mjs [artboard-id…]
//
// Reports per artboard:
//   - "jump": an element whose vertical offset from the design changed compared
//     with the previous element — i.e. the spacing above it differs. Constant
//     offsets (e.g. from a hidden resume button higher up) are not repeated.
//   - x / width / height / type differences beyond a 1px tolerance.
//   - design text we don't render (hidden or missing) and text we add.
import { chromium } from "playwright";

const site = process.env.SITE ?? "http://localhost:3100";
const board = process.env.BOARD ?? "http://127.0.0.1:3200/design/Direction-A.dc.html";

const artboards = {
  "home-desktop-light": { path: "/", width: 1440, theme: "light" },
  "home-mobile-light": { path: "/", width: 390, theme: "light" },
  "mobile-menu-open": { path: "/", width: 390, height: 844, theme: "light", menu: true },
  "hero-projects-desktop-dark": { path: "/", width: 1440, theme: "dark", only: "top" },
  "hero-projects-mobile-dark": { path: "/", width: 390, theme: "dark", only: "top" },
  "case-study-desktop": { path: "/projects/watchlist", width: 1440, theme: "light" },
  "case-study-mobile": { path: "/projects/watchlist", width: 390, theme: "light" },
};

/** Runs in the page: the rendered box of every visible text node under `root`. */
function collect(rootSelector) {
  const root = rootSelector ? document.querySelector(rootSelector) : document.body;
  const origin = root.getBoundingClientRect();
  const out = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent.replace(/\s+/g, " ").trim();
    const el = n.parentElement;
    if (!text || el.closest("script,style,template")) continue;
    range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden") continue;
    out.push({
      text: text.slice(0, 70),
      tag: el.tagName.toLowerCase(),
      x: Math.round(r.left - origin.left),
      y: Math.round(r.top - origin.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
      font: `${s.fontFamily.split(",")[0].replace(/["']/g, "").replace(/^__|_Fallback.*|_[0-9a-f]+$/g, "")} ${s.fontSize} ${s.fontWeight}${s.fontStyle === "italic" ? " italic" : ""} ls=${s.letterSpacing}`,
      lh: s.lineHeight,
      color: s.color,
    });
  }
  return out;
}

const norm = (f) => f.toLowerCase().replace(/\s+/g, "");
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(artboards);
const browser = await chromium.launch();

// Design board: one page, wide enough for every artboard at its native size.
const boardPage = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await boardPage.goto(board, { waitUntil: "networkidle" });
await boardPage.waitForFunction(() => document.querySelector("#case-study-mobile")?.innerText.length > 500, null, { timeout: 30000 });
await boardPage.evaluate(() => document.fonts.ready);

for (const id of ids) {
  const cfg = artboards[id];
  const design = await boardPage.evaluate(collect, `#${id}`);

  const ctx = await browser.newContext({
    viewport: { width: cfg.width, height: cfg.height ?? 900 },
    reducedMotion: "reduce",
    colorScheme: cfg.theme,
  });
  await ctx.addInitScript((t) => localStorage.setItem("theme", t), cfg.theme);
  const page = await ctx.newPage();
  await page.goto(site + cfg.path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (cfg.menu) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).waitFor();
    await page.waitForTimeout(300);
  }
  let ours = await page.evaluate(collect, cfg.menu ? "[role=dialog]" : null);
  await ctx.close();

  let designList = design;
  if (cfg.menu) designList = design.filter((d) => d.y < 844);
  if (cfg.only === "top") {
    // The design artboard stops after Selected projects; compare that range only.
    const end = Math.max(...design.map((d) => d.y + d.h));
    ours = ours.filter((o) => o.y < end + 400);
  }

  // Greedy in-order match by text.
  const used = new Set();
  const pairs = [];
  const missing = [];
  let offset = 0;
  for (const d of designList) {
    // Same text, closest to where the running offset predicts it.
    let j = -1;
    let best = Infinity;
    ours.forEach((o, i) => {
      if (used.has(i) || o.text !== d.text) return;
      const cost = Math.abs(o.y - d.y - offset) + Math.abs(o.x - d.x);
      if (cost < best) [best, j] = [cost, i];
    });
    if (j < 0) {
      missing.push(d);
      continue;
    }
    used.add(j);
    offset = ours[j].y - d.y;
    pairs.push([d, ours[j]]);
  }
  const extra = ours.filter((_, i) => !used.has(i));

  const lines = [];
  let prevDy = 0;
  for (const [d, o] of pairs) {
    const dy = o.y - d.y;
    const issues = [];
    if (Math.abs(dy - prevDy) > 1) issues.push(`jump ${dy - prevDy > 0 ? "+" : ""}${dy - prevDy} (dy ${dy})`);
    if (Math.abs(o.x - d.x) > 1) issues.push(`x ${d.x}→${o.x}`);
    if (Math.abs(o.w - d.w) > 1) issues.push(`w ${d.w}→${o.w}`);
    if (Math.abs(o.h - d.h) > 1) issues.push(`h ${d.h}→${o.h}`);
    if (norm(o.font) !== norm(d.font)) issues.push(`font "${d.font}" → "${o.font}"`);
    if (o.color !== d.color) issues.push(`color ${d.color}→${o.color}`);
    if (issues.length) lines.push(`  ${d.tag}>${o.tag} "${d.text.slice(0, 40)}"  ${issues.join("; ")}`);
    prevDy = dy;
  }
  console.log(`\n## ${id}  (${pairs.length} matched, ${missing.length} design-only, ${extra.length} extra)`);
  console.log(lines.join("\n") || "  no differences");
  if (missing.length) console.log("  design-only: " + missing.map((m) => JSON.stringify(m.text.slice(0, 40))).join(", "));
  if (extra.length) console.log("  extra: " + extra.map((m) => JSON.stringify(m.text.slice(0, 40))).join(", "));
}

await browser.close();
