# sayeefmahmud.com — Implementation Plan

Source of truth: the design handoff in `portfolio handoff.zip` (`design_handoff_portfolio/`).
Inline styles in `design/*.dc.html` win over the handoff README when they disagree.
Target: pixel-identical to the reference screenshots at 1440px and 390px, light + dark.

## Decisions

| Topic             | Decision                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework         | Next.js (App Router) + TypeScript, fully static                                                                                            |
| Styling           | Tailwind CSS v4, design tokens as CSS variables (`tokens.css` + `tailwind-theme.css`)                                                      |
| Fonts             | `next/font/google`: Newsreader (opsz axis, normal 400; italic dropped in Phase 5 — unused), Public Sans 400/500/600, IBM Plex Mono 400/500 |
| Theme             | Light default, `.dark` on `<html>`, no-flash inline init script (localStorage → `prefers-color-scheme`)                                    |
| Case studies      | MDX per project in `content/projects/<slug>.mdx`                                                                                           |
| Code highlighting | Shiki at build time, theme matched to `--code` / `--code-fg`                                                                               |
| Hosting           | Vercel (Hobby plan), custom domain `sayeefmahmud.com` + `www`                                                                              |
| Visual QA         | Playwright screenshots vs. reference PNGs                                                                                                  |

## Extensibility principle (applies to every phase)

Adding, removing or reordering anything should be a content/config edit, not a layout rewrite.

1. **Home page is a section registry.** `content/home.ts` exports an ordered array:
   ```ts
   export const homeSections: HomeSection[] = [
     { id: "hero", component: "Hero" },
     {
       id: "projects",
       component: "SelectedProjects",
       title: "Selected projects",
     },
     { id: "more-projects", component: "MoreProjects" },
     { id: "experience", component: "Experience", title: "Experience" },
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

## Current state (updated 2026-11-21) — read this first in a new session

**Done:** Phases 1–5. **Next:** Phase 6 (deploy to Vercel).

- Owner revisions after Phase 5 (2026-11-21) — deliberate departures from the handoff, don't revert:
  - Hero: smaller headline (`--text-display` max 56px), less space above it, new second sentence in the lead; the lead now opens with "I've spent more than five years in competitive programming. Now I build…".
  - "How I work" section removed (with `StepList`, `ToolList`, `Step`, `Tool`).
  - One vertical rhythm: every gap between home sections is `--section-gap` (144 / 80); hero bottom + projects top split it around the rule. Every section heading → content gap is one value, `clamp(28px,3vw,40px)` (`SectionHeader` has no `gap` prop any more).
  - Resume download turned off by the owner (2026-11-21): the four resume buttons (header, mobile menu, hero, contact) are commented out in `components/header.tsx`, `components/mobile-menu.tsx` and the `hero`/`contact` actions in `content/site.ts`. To bring them back, uncomment those lines and set `site.resumeUrl`.
  - Case-study pages turned off by the owner (2026-11-21) until the home page design is finished: `caseStudiesEnabled = false` in `content/case-studies.ts` hides every "Case study →" link (and the project media link), makes `/projects/<slug>` render the 404 page (noindex) and drops case studies from the sitemap. `generateStaticParams` still returns the registered slugs (Cache Components fails the build on an empty list); they prerender as the 404. Set the flag to `true` to bring them back.
  - "All projects" link in the Selected projects header (2026-11-21, option D of the owner's review): no accent colour, no arrow, not medium weight — it now uses the default `TextLink` underline style (fg text, `border2` underline → fg on hover), like the project links. The `accent` TextLink variant was removed (it had no other use).
  - Contact heading reworded to "Building something interesting? I'd like to hear about it." (owner isn't job-hunting; no hiring copy). About's second paragraph is the owner's own (table tennis, running).
  - Experience, stack and achievements rewritten from the owner's Cefalo CV and contest resume. Experience entries take an optional `projects` list (one Cefalo entry, role shown once, a project per row); the content column is full width (no 680px cap).
  - Stack rows regrouped (2026-11-21, owner's review): "Architecture & observability" → "Architecture & DevOps", which now holds Docker, the CI tools (GitHub Actions, CircleCI, Jenkins as separate items, moved out of Testing & practices) and Multi-tenancy (moved out of Cloud & Identity).
  - Removed from Stack by the owner (2026-11-21): Dart, REST & OpenAPI, Cloudflare Workers, OIDC, Authorization, Code review, Production debugging.
  - Added "Test-driven development" after "Spec-driven development" in Testing & practices (owner, 2026-11-21).
  - Competitive programming section (2026-11-21, spec `docs/superpowers/specs/2026-11-21-competitive-programming-section-design.md`): after Stack, nav label "CP" (the full label wrapped the header at 768). Built from existing blocks only: `MetaList` (problems solved + Codeforces/CodeChef ratings linking to profiles; `Fact.href`), then `Subheading` + `AchievementList` for Best results and Problem setting (each authored problem links to its Toph/CodeChef page; `Achievement.href` links the title), `EarlierList` for Teaching. Copy in `competitiveProgramming` (`content/site.ts`). CP items moved out of Achievements (now "Certifications": Claude, two Coursera ML courses, each linked) and out of Experience → Earlier (now empty, hidden). "3000+ problems solved" is unlinked on purpose: StopStalk shut down in Aug 2025.

- Phase 5 status (2026-11-21):
  - QA tooling (all run against a production build on :3100 — `npm run build && npm run qa:serve`):
    - `npm run qa:screenshots` → `qa/current/01…07.png` (gitignored), same widths / pixel ratios as `docs/handoff/screenshots/` (1440@1x; 390@2x for 03/05/07; 04/05 clipped to the reference height).
    - `npm run qa:design` (needs `npm run qa:design-board` on :3200) — renders the design board `Direction-A.dc.html`, matches every text node on our pages to the design by text and reports position jumps, x/size, font and colour differences per artboard. Far more precise than pixel diffs, which hidden links throw off. Current output: only intended differences (below).
    - `npm run qa:a11y` — axe-core (WCAG 2.2 AA incl. contrast) on /, /projects, case study, 404 at 1440/390 × light/dark; one H1, no skipped heading levels, named links, no vague link text, and a real hit-area probe (`elementFromPoint` 21px from the centre) for ≥44px mobile targets. Passes.
  - Fixes: phone/landscape frame placeholder was 24px larger than its frame (global content-box + `size-full` + padding; `p-4` beat `p-3`) → `box-border` + `p-3!` (also the portrait fallback); TOC starts with no active item (as in the design) until an H2 passes the line; project media link is now `aria-hidden` + `tabIndex={-1}` (duplicate of the "Case study" link; fixed axe label-content-name-mismatch); `hit-area` utility (globals.css, invisible ::after ≥44×44) on TextLink, header wordmark, contact email, footer email; `turbopack.root` pinned (a stray lockfile in the home folder was being detected).
  - Performance: dropped Newsreader italic (unused anywhere in the design; was ~140 KB preloaded on every page) → fonts 318 → 174 KB, mobile LCP ~3.9 s → ~3.0 s (Lighthouse simulated slow 4G). Lighthouse: accessibility, best practices, SEO 100 on every page; performance mobile 80–94, desktop 78–100. Local TBT is noisy (an "Unattributable" browser task from machine load, 0–9 s between identical runs) — re-measure on the Vercel deployment.
  - Intended differences from the screenshots: hidden resume buttons and project links (no URLs yet — content below shifts up by their height and project text re-centres), the real portrait, the owner's email, and the → ↗ ← fallback glyph.
  - Open design question for the owner: the case-study header wordmark has no `letter-spacing:-0.01em` in `A-CaseStudy.dc.html` while Home has it; kept one shared header (otherwise the name shifts 3px between pages). The design's mobile-menu × renders in Arial only because the button sets no font; we use Public Sans.

- Phase 4 status (2026-11-21):
  - `/` (`app/page.tsx`) maps `homeSections` → `homeSectionComponents` in `components/home-sections.tsx` (one component per registry name; each gets its entry and reads copy from `content/`). Hero: one `Portrait` element for both layouts (`order-first` 148px below md, 340px column from md, `preload`), page-load `animate-rise-in` with 60ms stagger on meta / H1 / lead / actions.
  - `/projects/[slug]` — case-study template (moved from the deleted preview route), `generateStaticParams` = projects with MDX, `generateMetadata` (title, summary, canonical). Unknown slugs render the 404 page with `noindex`; status is 200 because Cache Components streams the page (`dynamicParams` is unavailable with it).
  - `/projects` — H1 "All projects", `ProjectList` with names as H2, then More projects (`Subheading level="h2"`) and the home footer. Copy in `projectsPage` (`content/site.ts`).
  - Metadata: root OG/Twitter defaults + canonical; `app/opengraph-image.tsx` (hero eyebrow, headline, portrait; 1200×630), `app/icon.tsx` (32px) + `app/apple-icon.tsx` (180px) "S" monogram, all prerendered static; shared code + light token values in `lib/og.tsx`; static woff fonts for Satori in `assets/og/` (Fontsource, OFL — Satori can't read woff2). Default Next `favicon.ico` removed. `app/sitemap.ts` (/, /projects, case studies), `app/robots.ts`.
  - Resume: still hidden via `site.resumeUrl`; drop `public/resume.pdf` in and set it to `"/resume.pdf"`.
  - Verified: tsc, lint, `next build` (every route static / PPR); in the browser: home 1440 light vs 01/04, 390 dark vs 05 (portrait above meta), `/projects` 1440, case study loads with no console errors; one H1 per page; titles per page; sitemap, robots, icons, OG image render.

- Phase 3 status (2026-11-21):
  - Written: `components/layout.tsx` (Container, Section with `spacing` variants, SectionHeader, `cx`), `ui.tsx` (SmartLink, TextLink, Button primary/secondary/outline/text × lg/md/sm/block, ActionButton/ActionRow hide actions without `href`, StatusBadge, MetaList, DefinitionRows, RuleList/RuleItem, VisuallyHidden), `header.tsx` + `mobile-menu.tsx` (scroll lock, Esc, focus trap, closes on link click / resize to md), `footer.tsx`, `media.tsx` (Placeholder, DeviceFrame row/hero, GalleryTile, Portrait via next/image `preload`), `project-row.tsx`, `blocks.tsx` (MoreProjectRows, Experience, Earlier, StepList, ToolList, StackRows, Achievements, Prose, EmailLink, Subheading), `case-study.tsx` (StackLine, CaseStudyMedia, Article, FeatureList, ArchitectureDiagram, Results, Shiki CodeBlock with css-variables theme, NextProjectLink), `toc.tsx`; `mdx-components.tsx` now styled.
  - Design-fidelity findings: the design HTML is **content-box** (no border-box reset) → global `box-sizing: content-box` in globals.css, `box-border` only where the design says so; content is 1280px wide at 1440 (not 1120). `text-ui`/`text-small` line-height 1.6 (inherited in the HTML). Header border is always visible (as in screenshots). Code blocks are monochrome (all Shiki vars → `--code-fg`).
  - The Phase 3 preview routes were replaced in Phase 4.
  - Verified: tsc, lint and `next build` pass (all routes static). Home matches 01 (1440 light), 05 (390 dark) and 02 (390 light); case study matches 06/07; mobile menu matches 03 (Esc, focus trap, focus return, scroll lock, link click all work). Only intended differences: hidden resume buttons and project links/CTAs (no URLs yet).
  - Mobile-menu links on `/` scroll manually (close sheet → `scrollIntoView` → `pushState`); a `next/link` hash navigation is dropped when the sheet unmounts mid-click.
  - Shiki runs inside a `"use cache"` + `cacheLife("max")` function (it reads the clock, which Cache Components forbids during prerender).
  - Known, not fixable in CSS: → ↗ ← are not in the Latin subset of Public Sans, so they render in the OS fallback font (the reference renderer had a different fallback). ↓ is in the subset.
  - Phase 4 notes: hero portrait above the meta on < md (148px) + load fade-in (`animate-rise-in` exists); case-study mobile header shows no theme toggle in the design (`<Header mobileThemeToggle={false}>`).

- Phase 2 content layer:
  - `content/types.ts` — all content types (`Project`, `Action`, `Fact`, `Shot`, `CaseStudyFrontmatter`, `TocEntry`, MDX block props, …). Optional `href`/`src` = hidden link / striped placeholder.
  - `content/site.ts` — identity (`site.resumeUrl` is `undefined` → all resume buttons hidden), `social` profile links (URLs set), UI `labels`, and copy for header, mobile menu, hero, more projects, experience, how I work, stack, achievements, about, contact, footer.
  - `content/projects.ts` — the 5 selected projects in order. No public project URLs yet (owner confirmed) → project links hidden; no screenshots yet. `tagline` (Next-project line) only on Stash.
  - `content/home.ts` — `homeSections` registry (`id`, `component`, `title?`, `nav?`, `action?`) and derived `navLinks` (`/#id`). Section components are named by string; Phase 4's `app/page.tsx` maps names → components.
  - Case studies: `content/projects/<slug>.mdx` (YAML frontmatter via `remark-frontmatter` + `remark-mdx-frontmatter`, configured in `next.config.ts`) registered in `content/case-studies.ts`. Only `watchlist.mdx` exists (the handoff draft). Body is markdown (`##` sections, `###` challenges, `**Title.**` decisions, fenced code, lists) plus `<FeatureList>`, `<ArchitectureDiagram>`, `<Results>`.
  - `mdx-components.tsx` — **unstyled** stand-ins for those MDX blocks + `h2` with slug id. Phase 3 replaces them with the styled blocks (keep names/props); also add `h3`, `p`, `strong`, `ul`, `pre` (Shiki) styling.
  - `lib/projects.ts` — `getProjects`, `getProject`, `hasCaseStudy`, `getCaseStudyHref`, `getCaseStudySlugs`, `getNextProject` (next in order, wraps; href = its case study or `/projects#slug`), `getCaseStudy` (validated frontmatter + TOC from the MDX `##` headings, short labels via `tocLabels`). `lib/slug.ts` — `slugify` shared by TOC and `h2` ids.
  - Verified with a throwaway route (removed): case study prerenders fully static under `cacheComponents`, TOC ids match heading ids, frontmatter not rendered.

- Stack as installed: Next.js **16.4.6** (Turbopack, `cacheComponents` + `partialPrefetching` on), React 19.3, Tailwind **4.3**, TypeScript, ESLint 9, npm.
- Next 16 differs from older versions — read `node_modules/next/dist/docs/` before using an API (see `AGENTS.md`). `LayoutProps<"/">` / `PageProps` are generated global types (run `next build` or `next dev` once before `tsc`).
- Design reference lives in `docs/handoff/` (README, `design/*.dc.html`, `design/content.js`, `screenshots/`, tokens, fonts). Inline styles in the `.dc.html` files are the source of truth.
- Files so far:
  - `app/globals.css` — tokens (light `:root`, dark `.dark`), `@theme inline` mapping (`bg-bg`, `text-muted`, `border-border2`, `rounded-control`, `shadow-shot`, `ease-lift`, type scale `text-display|h1|project|cs-title|cs-summary|h2|h3|lead|body|ui|small|meta|label`), base styles, focus ring, `bg-stripes` utility, reduced-motion rules.
  - `lib/fonts.ts` — Newsreader (opsz, normal+italic), Public Sans (variable), IBM Plex Mono 400/500; `fontVariables` applied on `<html>`. Use `font-serif` / `font-sans` / `font-mono`.
  - `lib/theme.ts` — `themeInitScript` (localStorage `theme` → OS preference) injected in `<head>` by `app/layout.tsx`.
  - `components/theme-toggle.tsx` — client toggle; sizing/border passed via `className` (desktop `size-9 rounded-control border border-border`, mobile `size-11`).
  - `app/layout.tsx` — metadata (`metadataBase` https://sayeefmahmud.com), viewport theme colours.
  - `public/images/portrait.jpg` — 4:5 portrait, 1856×2320.
- Verified: build/lint/tsc pass; fonts load; theme follows OS, toggles, persists across reload, no flash, no console errors.
- Not yet set up: Vercel project + DNS (Phase 6), resume PDF, project screenshots, case-study content (all pending from owner).

## Phase 1 — Foundation ✅ (done 2026-11-20)

- Scaffold with `create-next-app` (TS, Tailwind, App Router, ESLint) in the repo root; remove the old `index.html` and `CNAME`.
- `app/globals.css`: Tailwind import, tokens, Tailwind theme mapping, `@custom-variant dark`, focus ring, reduced-motion rules.
- Fonts via `next/font/google` exposed as `--font-newsreader`, `--font-public-sans`, `--font-plex-mono`.
- Theme: inline `<head>` script + `ThemeToggle` client component (`aria-label`, `aria-pressed`, 200ms cross-fade).

## Phase 2 — Content layer ✅ (done 2026-11-21)

- Port `design/content.js` → typed `content/site.ts` (identity, email, links, facts, more projects, experience, earlier, steps, tools, skills, achievements, about, contact) and `content/projects.ts`.
- `content/home.ts` — section registry (see above).
- `content/projects/<slug>.mdx` with frontmatter (role, timeline, platform, status, stack, links, frame, gallery).
- `lib/projects.ts`: `getProjects`, `getProject(slug)`, `getNextProject(slug)`, `hasCaseStudy(slug)`.

## Phase 3 — Components ✅ (done 2026-11-21)

- Layout primitives: `Container`, `Section`, `SectionHeader`.
- UI: `Button` (primary / secondary / text, sizes 48/44/36), `TextLink` (underline styles, ↗ / → / ↓ arrows), `StatusBadge`, `MetaList` (facts `<dl>` grid), `RuleList` (rows with 1px top rule), `VisuallyHidden`.
- Chrome: `Header` (sticky 64px, border after 8px scroll, current-link state), `MobileMenu` (full-screen sheet, scroll lock, Esc, focus trap, closes on link click, 200ms fade), `Footer`.
- Media: `DeviceFrame` (`browser` | `window` | `phone` | `land`), `Placeholder` (stripes + mono label), `Portrait` (`next/image`, 4:5, `priority` in hero).
- Blocks: `ProjectRow` (alternating direction via index, 4px hover lift), `ExperienceEntry`, `EarlierRow`, `StepList`, `ToolList`, `StackRows`, `AchievementItem`, `CodeBlock`, `Toc` (sticky, IntersectionObserver active state).

## Phase 4 — Pages ✅ (done 2026-11-21)

- `/` — rendered from the section registry: Hero (load fade-in, 60ms stagger; portrait above meta on < md), Selected projects, More projects, Experience, How I work, Stack, Achievements & certifications, About, Contact + footer.
- `/projects/[slug]` — case study template, `generateStaticParams` only for projects that have MDX; "Next project" link.
- `/projects` — all projects, reusing `ProjectRow`.
- Metadata: titles/descriptions, Open Graph image, `sitemap.ts`, `robots.ts`, favicon. `/resume.pdf` served from `public/` once provided.

## Phase 5 — Fidelity, accessibility, performance ✅ (done 2026-11-21)

- Playwright script capturing `/` and a case study at 1440 and 390, light + dark, and mobile menu open; compare to screenshots 01–07 and fix deltas.
- Accessibility: one H1 per page, section titles are H2 (styled as h1 token), project names H3, ≥ 44px mobile hit targets, descriptive link text, AA contrast in both themes.
- Lighthouse pass (performance, a11y, SEO).

## Phase 6 — Deploy (Vercel)

- Import the GitHub repo into Vercel (Hobby plan); every push to `main` deploys, PRs get preview URLs.
- Add `sayeefmahmud.com` and `www.sayeefmahmud.com` in Vercel → set DNS at the registrar (A record `76.76.21.21` for apex, CNAME `cname.vercel-dns.com` for `www`, or switch nameservers to Vercel). HTTPS is automatic.

## Assets

| Asset               | Status                                                    | Notes                                                                                                                                                                                                  |
| ------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Portrait            | Provided, already 4:5 (`IMG_7969.jpg`, 1856×2320, 650 KB) | Copy to `public/images/portrait.jpg` in Phase 1; `next/image` handles responsive sizes. Used in Hero and About (until a second photo is provided). The original 2:3 `Sayeef Mahmud.jpg` is not needed. |
| Resume PDF          | Not wanted for now                                        | Buttons commented out; see Current state.                                                                                                                                                              |
| Project screenshots | Pending                                                   | Browser/window 1600×1000, phone 1080×2280, landscape 2280×1080 → `public/images/projects/<slug>/`. Placeholders until then.                                                                            |
| Case studies        | Pending (Watchlist draft in handoff)                      | One MDX per project; link hidden for projects without one.                                                                                                                                             |
| Profile URLs        | Provided (2026-11-21)                                     | LinkedIn, GitHub, Codeforces, CodeChef in `content/site.ts` (`social`).                                                                                                                                |
| Project URLs        | None public yet (owner, 2026-11-21)                       | Live site / GitHub / Google Play per project. Set `href` in `content/projects.ts`; project links stay hidden until then.                                                                               |
| Copy placeholders   | Pending                                                   | Experience dates/summaries, Watchlist timeline/challenges/what's next.                                                                                                                                 |
