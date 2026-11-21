// Accessibility QA against a running build:
//   npx next start -p 3100
//   node scripts/a11y.mjs [baseUrl]
//
// Per page, at 1440 and 390, light and dark:
//   - axe-core (WCAG 2.2 A/AA rules, incl. colour contrast)
//   - exactly one H1; no skipped heading levels
//   - every link / button has an accessible name; no vague link text
//   - interactive targets ≥ 44×44px at 390 (inline links inside running text are exempt, WCAG 2.5.8)
// Exits non-zero when anything fails.
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const pages = ["/", "/projects", "/projects/watchlist", "/projects/does-not-exist"];

const browser = await chromium.launch();
let failures = 0;
const fail = (where, msg) => {
  failures++;
  console.log(`  ✗ ${where}: ${msg}`);
};

for (const path of pages) {
  for (const width of [1440, 390]) {
    for (const theme of ["light", "dark"]) {
      const where = `${path} @${width} ${theme}`;
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", colorScheme: theme });
      await ctx.addInitScript((t) => localStorage.setItem("theme", t), theme);
      const page = await ctx.newPage();
      await page.goto(base + path, { waitUntil: "networkidle" });

      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      for (const v of axe.violations) {
        fail(where, `axe ${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
      }

      // Structure + names + target sizes run once per width (theme doesn't change them).
      if (theme === "light") {
        const report = await page.evaluate((mobile) => {
          const out = [];
          const visible = (el) => {
            const r = el.getBoundingClientRect();
            const s = getComputedStyle(el);
            return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && !el.closest("[inert],[aria-hidden=true]");
          };
          const h1s = [...document.querySelectorAll("h1")].filter(visible);
          if (h1s.length !== 1) out.push(`expected one H1, found ${h1s.length}`);
          let prev = 0;
          for (const h of [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].filter(visible)) {
            const lvl = Number(h.tagName[1]);
            if (prev && lvl > prev + 1) out.push(`heading jumps H${prev}→H${lvl}: "${h.textContent.trim().slice(0, 40)}"`);
            prev = lvl;
          }
          for (const el of document.querySelectorAll("a[href],button")) {
            if (!visible(el)) continue;
            const name = (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim();
            if (!name) out.push(`unnamed ${el.tagName.toLowerCase()} ${el.outerHTML.slice(0, 80)}`);
            else if (/^(click here|here|read more|more|link|learn more)$/i.test(name)) out.push(`vague link text "${name}"`);
            if (mobile) {
              // Inline links within a paragraph of text are exempt (WCAG 2.5.8 "inline").
              const block = el.parentElement.closest("p,li,dd");
              const inline = getComputedStyle(el).display === "inline" && block && block.textContent.trim() !== el.textContent.trim();
              if (inline) continue;
              // Probe the real hit area (incl. the `hit-area` pseudo-element): points 21px
              // from the centre in each direction must still hit this element.
              el.scrollIntoView({ block: "center", inline: "center" });
              const r = el.getBoundingClientRect();
              const cx = r.left + r.width / 2;
              const cy = r.top + r.height / 2;
              const misses = [[0, -21], [0, 21], [-21, 0], [21, 0]].filter(([dx, dy]) => {
                const hit = document.elementFromPoint(cx + dx, cy + dy);
                return !hit || !(hit === el || el.contains(hit));
              });
              if (misses.length) {
                out.push(`target < 44px (${Math.round(r.width)}×${Math.round(r.height)} box, misses ${misses.map((m) => m.join(",")).join(" ")}): ${el.tagName.toLowerCase()} "${name.slice(0, 40)}"`);
              }
            }
          }
          return out;
        }, width === 390);
        for (const msg of report) fail(where, msg);
      }
      await ctx.close();
    }
  }
}

await browser.close();
console.log(failures ? `\n${failures} problem(s)` : "all checks passed");
process.exit(failures ? 1 : 0);
