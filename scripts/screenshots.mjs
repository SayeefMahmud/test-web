// Visual QA: captures the views shown in docs/handoff/screenshots/ (01–07) at
// the same width and pixel ratio, so they can be compared side by side.
//
//   npm run build && npx next start -p 3100
//   node scripts/screenshots.mjs [baseUrl]        → qa/current/*.png
//
// Theme is forced through localStorage (read by the init script in <head>);
// motion is reduced so the hero fade-in doesn't catch mid-animation.
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3100";
const outDir = new URL("../qa/current/", import.meta.url);

const caseStudy = "/projects/watchlist";

/** One entry per reference screenshot. `clipHeight` = CSS px shown in the reference. */
const shots = [
  { name: "01-home-desktop-light", path: "/", width: 1440, dpr: 1, theme: "light" },
  { name: "02-home-mobile-light", path: "/", width: 390, dpr: 1, theme: "light" },
  { name: "03-mobile-menu-open", path: "/", width: 390, height: 844, dpr: 2, theme: "light", menu: true },
  { name: "04-hero-projects-desktop-dark", path: "/", width: 1440, dpr: 1, theme: "dark", clipHeight: 4374 },
  { name: "05-hero-projects-mobile-dark", path: "/", width: 390, dpr: 2, theme: "dark", clipHeight: 5300 },
  { name: "06-case-study-desktop", path: caseStudy, width: 1440, dpr: 1, theme: "light" },
  { name: "07-case-study-mobile", path: caseStudy, width: 390, dpr: 2, theme: "light" },
];

const only = process.env.ONLY?.split(",");

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const shot of shots) {
  if (only && !only.some((o) => shot.name.startsWith(o))) continue;
  const context = await browser.newContext({
    viewport: { width: shot.width, height: shot.height ?? 900 },
    deviceScaleFactor: shot.dpr,
    reducedMotion: "reduce",
    colorScheme: shot.theme,
  });
  await context.addInitScript((theme) => localStorage.setItem("theme", theme), shot.theme);
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  await page.goto(base + shot.path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  if (shot.menu) {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog", { name: "Menu" }).waitFor();
    await page.waitForTimeout(300);
  }

  const file = new URL(`${shot.name}.png`, outDir).pathname;
  if (shot.menu) {
    await page.screenshot({ path: file });
  } else {
    // Let lazy images load before a full-page capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    const full = await page.evaluate(() => document.documentElement.scrollHeight);
    const height = Math.min(shot.clipHeight ?? full, full);
    await page.screenshot({
      path: file,
      fullPage: true,
      clip: { x: 0, y: 0, width: shot.width, height },
    });
  }
  console.log(`${shot.name}${errors.length ? `  ⚠ ${errors.length} console error(s): ${errors.join(" | ")}` : ""}`);
  await context.close();
}

await browser.close();
