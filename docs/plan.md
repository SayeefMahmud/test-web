# sayeefmahmud.com — Implementation Plan

Source of truth: the design handoff in `portfolio handoff.zip` (`design_handoff_portfolio/`).
Inline styles in `design/*.dc.html` win over the handoff README when they disagree.
Target: pixel-identical to the reference screenshots at 1440px and 390px, light + dark.

## Decisions

| Topic | Decision |
|---|---|
| Framework | Next.js (App Router) + TypeScript, fully static |
| Styling | Tailwind CSS v4, design tokens as CSS variables (`tokens.css` + `tailwind-theme.css`) |
| Fonts | `next/font/google`: Newsreader (opsz axis, normal + italic 400), Public Sans 400/500/600, IBM Plex Mono 400/500 |
| Theme | Light default, `.dark` on `<html>`, no-flash inline init script (localStorage → `prefers-color-scheme`) |
| Case studies | MDX per project in `content/projects/<slug>.mdx` |
| Code highlighting | Shiki at build time, theme matched to `--code` / `--code-fg` |
| Hosting | Vercel (Hobby plan), custom domain `sayeefmahmud.com` + `www` |
| Visual QA | Playwright screenshots vs. reference PNGs |

## Extensibility principle (applies to every phase)

Adding, removing or reordering anything should be a content/config edit, not a layout rewrite.

1. **Home page is a section registry.** `content/home.ts` exports an ordered array:
   ```ts
   export const homeSections: HomeSection[] = [
     { id: 'hero', component: 'Hero' },
     { id: 'projects', component: 'SelectedProjects', title: 'Selected projects' },
     { id: 'more-projects', component: 'MoreProjects' },
     { id: 'experience', component: 'Experience', title: 'Experience' },
     // ...
   ];
   ```
   `app/page.tsx` maps over it. Add a section = write one component + add one entry. Remove = delete the entry. Nav links derive from entries flagged `nav: true`.
2. **Sections are composed of blocks.** Every section uses the same shell:
   `<Section id title action? spacing="default|projects|contact">` + children. Inside, sections render a list of
   typed blocks (e.g. `ProjectRow`, `ExperienceEntry`, `DefinitionRows`, `RuleList`, `StepList`, `Prose`), so a
   section can gain or drop a block (e.g. add a "Talks" list under Achievements) without touching the shell.
3. **All lists are data-driven.** Projects, experience, steps, tools, skills, achievements, facts, footer links all
   come from typed arrays in `content/`. Components never hard-code copy.
4. **Optional fields degrade gracefully.** Missing screenshot → striped placeholder. Missing case study → the
   "Case study →" link is hidden. Missing resume → resume buttons hidden (single `site.resumeUrl` flag).
5. **Case-study sections are MDX components.** `<Problem>`, `<FeatureList>`, `<Decision>`, `<Results>`, `<Figure>`,
   `<Gallery>` etc. can be added/removed/reordered per project; the TOC is generated from the H2s.

## Current state (updated 2026-11-20) — read this first in a new session

**Done:** Phase 1. **Next:** Phase 2 (content layer).

- Stack as installed: Next.js **16.4.6** (Turbopack, `cacheComponents` + `partialPrefetching` on), React 19.3, Tailwind **4.3**, TypeScript, ESLint 9, npm.
- Next 16 differs from older versions — read `node_modules/next/dist/docs/` before using an API (see `AGENTS.md`). `LayoutProps<"/">` / `PageProps` are generated global types (run `next build` or `next dev` once before `tsc`).
- Design reference lives in `docs/handoff/` (README, `design/*.dc.html`, `design/content.js`, `screenshots/`, tokens, fonts). Inline styles in the `.dc.html` files are the source of truth.
- Files so far:
  - `app/globals.css` — tokens (light `:root`, dark `.dark`), `@theme inline` mapping (`bg-bg`, `text-muted`, `border-border2`, `rounded-control`, `shadow-shot`, `ease-lift`, type scale `text-display|h1|project|cs-title|cs-summary|h2|h3|lead|body|ui|small|meta|label`), base styles, focus ring, `bg-stripes` utility, reduced-motion rules.
  - `lib/fonts.ts` — Newsreader (opsz, normal+italic), Public Sans (variable), IBM Plex Mono 400/500; `fontVariables` applied on `<html>`. Use `font-serif` / `font-sans` / `font-mono`.
  - `lib/theme.ts` — `themeInitScript` (localStorage `theme` → OS preference) injected in `<head>` by `app/layout.tsx`.
  - `components/theme-toggle.tsx` — client toggle; sizing/border passed via `className` (desktop `size-9 rounded-control border border-border`, mobile `size-11`).
  - `app/layout.tsx` — metadata (`metadataBase` https://sayeefmahmud.com), viewport theme colours.
  - `app/page.tsx` — **temporary** token/type check page; replace in Phase 4.
  - `public/images/portrait.jpg` — 4:5 portrait, 1856×2320.
- Verified: build/lint/tsc pass; fonts load; theme follows OS, toggles, persists across reload, no flash, no console errors.
- Not yet set up: Vercel project + DNS (Phase 6), resume PDF, project screenshots, case-study content (all pending from owner).

## Phase 1 — Foundation ✅ (done 2026-11-20)
- Scaffold with `create-next-app` (TS, Tailwind, App Router, ESLint) in the repo root; remove the old `index.html` and `CNAME`.
- `app/globals.css`: Tailwind import, tokens, Tailwind theme mapping, `@custom-variant dark`, focus ring, reduced-motion rules.
- Fonts via `next/font/google` exposed as `--font-newsreader`, `--font-public-sans`, `--font-plex-mono`.
- Theme: inline `<head>` script + `ThemeToggle` client component (`aria-label`, `aria-pressed`, 200ms cross-fade).

## Phase 2 — Content layer
- Port `design/content.js` → typed `content/site.ts` (identity, email, links, facts, more projects, experience, earlier, steps, tools, skills, achievements, about, contact) and `content/projects.ts`.
- `content/home.ts` — section registry (see above).
- `content/projects/<slug>.mdx` with frontmatter (role, timeline, platform, status, stack, links, frame, gallery).
- `lib/projects.ts`: `getProjects`, `getProject(slug)`, `getNextProject(slug)`, `hasCaseStudy(slug)`.

## Phase 3 — Components
- Layout primitives: `Container`, `Section`, `SectionHeader`.
- UI: `Button` (primary / secondary / text, sizes 48/44/36), `TextLink` (underline styles, ↗ / → / ↓ arrows), `StatusBadge`, `MetaList` (facts `<dl>` grid), `RuleList` (rows with 1px top rule), `VisuallyHidden`.
- Chrome: `Header` (sticky 64px, border after 8px scroll, current-link state), `MobileMenu` (full-screen sheet, scroll lock, Esc, focus trap, closes on link click, 200ms fade), `Footer`.
- Media: `DeviceFrame` (`browser` | `window` | `phone` | `land`), `Placeholder` (stripes + mono label), `Portrait` (`next/image`, 4:5, `priority` in hero).
- Blocks: `ProjectRow` (alternating direction via index, 4px hover lift), `ExperienceEntry`, `EarlierRow`, `StepList`, `ToolList`, `StackRows`, `AchievementItem`, `CodeBlock`, `Toc` (sticky, IntersectionObserver active state).

## Phase 4 — Pages
- `/` — rendered from the section registry: Hero (load fade-in, 60ms stagger; portrait above meta on < md), Selected projects, More projects, Experience, How I work, Stack, Achievements & certifications, About, Contact + footer.
- `/projects/[slug]` — case study template, `generateStaticParams` only for projects that have MDX; "Next project" link.
- `/projects` — all projects, reusing `ProjectRow`.
- Metadata: titles/descriptions, Open Graph image, `sitemap.ts`, `robots.ts`, favicon. `/resume.pdf` served from `public/` once provided.

## Phase 5 — Fidelity, accessibility, performance
- Playwright script capturing `/` and a case study at 1440 and 390, light + dark, and mobile menu open; compare to screenshots 01–07 and fix deltas.
- Accessibility: one H1 per page, section titles are H2 (styled as h1 token), project names H3, ≥ 44px mobile hit targets, descriptive link text, AA contrast in both themes.
- Lighthouse pass (performance, a11y, SEO).

## Phase 6 — Deploy (Vercel)
- Import the GitHub repo into Vercel (Hobby plan); every push to `main` deploys, PRs get preview URLs.
- Add `sayeefmahmud.com` and `www.sayeefmahmud.com` in Vercel → set DNS at the registrar (A record `76.76.21.21` for apex, CNAME `cname.vercel-dns.com` for `www`, or switch nameservers to Vercel). HTTPS is automatic.

## Assets

| Asset | Status | Notes |
|---|---|---|
| Portrait | Provided, already 4:5 (`IMG_7969.jpg`, 1856×2320, 650 KB) | Copy to `public/images/portrait.jpg` in Phase 1; `next/image` handles responsive sizes. Used in Hero and About (until a second photo is provided). The original 2:3 `Sayeef Mahmud.jpg` is not needed. |
| Resume PDF | Pending | Goes to `public/resume.pdf`; buttons hidden until present. |
| Project screenshots | Pending | Browser/window 1600×1000, phone 1080×2280, landscape 2280×1080 → `public/images/projects/<slug>/`. Placeholders until then. |
| Case studies | Pending (Watchlist draft in handoff) | One MDX per project; link hidden for projects without one. |
| Copy placeholders | Pending | Real email, experience dates/summaries, second About paragraph, Watchlist timeline/challenges/what's next. |
