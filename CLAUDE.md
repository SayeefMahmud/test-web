# sayeefmahmud.com — personal portfolio

@AGENTS.md

Next.js (App Router) + TypeScript + Tailwind v4 portfolio for Sayeef Mahmud, deployed to Vercel at sayeefmahmud.com.

**Start every session by reading `docs/plan.md`** — its "Current state" section says what is done and what is next. Update that section (and tick the phase) when you finish a phase.

## Decisions (from the owner)

- **Follow the design exactly.** The handoff in `docs/handoff/` is the spec: fonts, colours, spacing, assets, light + dark modes, desktop (1440) and mobile (390) layouts must match the screenshots in `docs/handoff/screenshots/`. Inline styles in `docs/handoff/design/*.dc.html` win over the handoff README when they disagree. Don't "improve" or reinterpret the design.
- **Hosting: Vercel** (Hobby plan, free). Not GitHub Pages — no `CNAME`, no static export. `next/image` optimisation is available.
- **Every section must be easy to extend.** Adding, removing or reordering a section — or a component inside a section — should be a content/config edit, not a layout rewrite:
  - The home page renders from an ordered section registry (`content/home.ts`).
  - Sections share one `Section` shell and are composed of reusable blocks.
  - All copy and lists live in typed files under `content/`; components never hard-code copy.
  - Missing optional data degrades gracefully (placeholder image, hidden link/button) instead of breaking.
- **Assets the owner will provide later:** resume PDF, project screenshots and the case studies. Until then, use the striped placeholders, hide resume buttons and hide "Case study →" links for projects without one. Don't invent content for them.
- **Portrait:** `public/images/portrait.jpg` (4:5, 1856×2320) is final; use it in Hero and About.

## Conventions

- Design tokens are CSS variables in `app/globals.css`, mapped to Tailwind (`bg-bg`, `text-muted`, `border-border2`, `text-display`, `rounded-control`, `shadow-shot`, …). Use tokens, never raw hex values in components.
- Fonts come from `lib/fonts.ts` (`font-serif` Newsreader, `font-sans` Public Sans, `font-mono` IBM Plex Mono).
- Dark mode is the `.dark` class on `<html>` (`dark:` variant); set before paint by `lib/theme.ts`.
- No icon library: only the text glyphs ↗ → ← ↓ ×.
- Accessibility is part of the spec: one H1 per page, section titles are H2, ≥44px touch targets on mobile, visible focus ring, descriptive link text.
- Next.js 16 APIs differ from older versions — check `node_modules/next/dist/docs/` before using one.

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (also generates the `LayoutProps`/`PageProps` types `tsc` needs)
- `npm run lint`, `npx tsc --noEmit`

Verify UI changes in a browser at 1440 and 390, in light and dark, against the handoff screenshots before calling them done.
