# Competitive programming section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** One home section that gathers all competitive-programming content.

**Architecture:** New `CompetitiveProgramming` entry in the `content/home.ts` registry, rendered in `components/home-sections.tsx` from existing blocks only (`MetaList`, `Subheading`, `AchievementList`, `EarlierList`). Copy lives in a new `competitiveProgramming` export in `content/site.ts`.

**Tech Stack:** Next.js 16, TypeScript, Tailwind v4 tokens.

**Spec:** `docs/superpowers/specs/2026-11-21-competitive-programming-section-design.md`

## Global Constraints

- No new visual styles: only existing components/classes.
- No copy in components; all copy in `content/site.ts`.
- Do not commit until the owner approves the look.

## Review Focus

- Rating links must have descriptive accessible names (platform + value) — `npm run qa:a11y` must pass.
- No CP item may appear twice on the page (Achievements / Earlier must lose the moved items).
- Section has one H2; group labels are H3 (no skipped heading levels).
- Mobile 390: groups stack cleanly; link hit areas ≥ 44px (`hit-area`).
- Dark mode uses tokens only.

---

### Task 1: Competitive programming section

**Files:**
- Modify: `content/types.ts` (`Fact` gains optional `href?: string`)
- Modify: `components/ui.tsx` (`MetaList`: when `href`, render value as `TextLink variant="underline"` with `aria-label="{label}: {value}"`)
- Modify: `content/site.ts` (new `competitiveProgramming = { facts, resultsTitle, results, problemSettingTitle, problemSetting, teachingTitle, teaching }`; `achievements` keeps Claude + ML only; `experience.earlier` becomes empty)
- Modify: `content/home.ts` (`"CompetitiveProgramming"` component after `stack`, title/nav "Competitive programming"; achievements title → "Certifications")
- Modify: `components/home-sections.tsx` (`CompetitiveProgramming` component: `MetaList` facts, then per group `Subheading mt-10 mb-1` + list, as Experience does with "Earlier")

- [ ] Step 1: Content + types edits above.
- [ ] Step 2: Component + registry.
- [ ] Step 3: `npx tsc --noEmit`, `npm run lint`, `npm run build` — all pass.
- [ ] Step 4: `npm run qa:serve` + `npm run qa:a11y` — passes.
- [ ] Step 5: Browser check at 1440 and 390, light and dark; show owner. No commit until approved.
