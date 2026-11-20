# Handoff: sayeefmahmud.com portfolio (Direction A, "Clean & Minimal")

## Overview
Personal portfolio for Sayeef Mahmud, software engineer (Dhaka, Bangladesh). Two templates:
1. **Home** — one long page: Header, Hero (with portrait), Selected projects (5), More projects, Experience, How I work, Stack, Achievements & certifications, About, Contact + footer.
2. **Project case study** — template, shown filled with Watchlist.

Target stack: **Next.js (App Router) + TypeScript + Tailwind CSS**, mostly static, deployed on Vercel. Light is the primary theme, with a full dark theme.

## About the design files
Everything in `design/` is a **design reference built in HTML**. It is not production code to copy. Rebuild the UI in Next.js + Tailwind with proper components, keeping it **pixel-identical** to the screenshots at 1440px and 390px.

- Open `design/Direction-A.dc.html` in a browser (serve the folder, e.g. `npx serve design`). It is the presentation board with every view side by side plus the style sheet. `A-Home.dc.html` and `A-CaseStudy.dc.html` open on their own too, but they need the CSS variables from `tokens/tokens.css` (the board supplies them).
- Inline styles in those files are the **source of truth** for exact values. When this README and the HTML disagree, the HTML wins.
- `design/content.js` holds all the copy (projects, experience, skills, achievements, case study). Port it to `content/*.ts` with types; the components must stay data-driven.
- Ignore `support.js`; it is the HTML preview runtime only.

## Fidelity
**High fidelity.** Final colours, type, spacing, layout and copy. The image areas are placeholders: striped boxes labelled with the screenshot that goes there.

## Screenshots (`screenshots/`)
| File | View |
|---|---|
| 01-home-desktop-light.png | Home, 1440, light (full page) |
| 02-home-mobile-light.png | Home, 390, light (full page) |
| 03-mobile-menu-open.png | Mobile menu sheet, 390×844 |
| 04-hero-projects-desktop-dark.png | Hero + projects, 1440, dark |
| 05-hero-projects-mobile-dark.png | Hero + projects, 390, dark |
| 06-case-study-desktop.png | Case study (Watchlist), 1440 |
| 07-case-study-mobile.png | Case study, 390 |
| 08-style-sheet.png | Type, colour, spacing, components & states, motion |

The portrait shows as a striped placeholder in the screenshots because no photo had been uploaded yet.

## Fonts (`fonts/`)
| Role | Family | Weights | Why |
|---|---|---|---|
| Headings, display, wordmark | **Newsreader** (variable, opsz 6–72) | 400 (+ italic 400) | A text serif made for screens; optical sizes keep big headlines crisp and calm |
| Body / UI | **Public Sans** (variable) | 400, 500, 600 | Neutral, open and very legible; less overused than Inter |
| Meta, dates, code | **IBM Plex Mono** | 400, 500 | Used sparingly for metadata and code only |

All three are Google Fonts under the SIL Open Font License. The bundled `.woff2` files are Latin subsets; Newsreader and Public Sans are variable files, so one file covers every weight. In Next.js, prefer `next/font/google`, which self-hosts them:
```ts
import { Newsreader, Public_Sans, IBM_Plex_Mono } from 'next/font/google';
export const serif = Newsreader({ subsets: ['latin'], style: ['normal','italic'], axes: ['opsz'], variable: '--font-newsreader' });
export const sans  = Public_Sans({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-public-sans' });
export const mono  = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-plex-mono' });
```
Alternatively use the bundled files through `next/font/local` or `fonts/fonts.css`.

**Type scale** (desktop → mobile; `clamp()` values scale with the viewport):
| Token | Font | Size / line-height / tracking |
|---|---|---|
| display (hero H1) | Newsreader 400 | clamp(38px, 5.4vw, 76px) / 1.06 / −0.02em, max-width 17em, `text-wrap: balance` |
| h1 (section titles) | Newsreader 400 | clamp(32px, 3.4vw, 48px) / 1.1 / −0.015em |
| project name | Newsreader 400 | clamp(30px, 2.8vw, 40px) / 1.1 / −0.015em |
| case-study H1 | Newsreader 400 | clamp(48px, 7vw, 104px) / 1 / −0.025em |
| case-study summary | Newsreader 400 | clamp(21px, 2vw, 28px) / 1.35, muted |
| h2 (case study sections) | Newsreader 400 | 34px / 1.15 |
| h3 | Public Sans 600 | 19px / 1.4 (case-study challenge titles 18px) |
| lead | Public Sans 400 | clamp(17px, 1.35vw, 19px) / 1.6, muted, max 36em |
| body | Public Sans 400 | 16px / 1.6; project summary 17px; about and case-study text 18px |
| ui / small | Public Sans 400–500 | 15px, 14px |
| meta / code | IBM Plex Mono 400 | 13px (labels 12px); code 13.5px / 1.65 |

## Design tokens
`tokens/tokens.css` contains the CSS variables for both themes. `tokens/tailwind-theme.css` maps them into a Tailwind v4 `@theme`, so `bg-bg`, `text-muted`, `border-border` and so on work. Toggle the theme with `.dark` on `<html>`, and set it before first paint (an inline script reading localStorage, falling back to `prefers-color-scheme`) so there is no flash.

| Token | Light | Dark | Role |
|---|---|---|---|
| bg | #FAFAF8 | #111214 | Page background, header |
| surface | #FFFFFF | #1A1B1E | Screenshot frames, diagrams |
| sunk | #F0F0EC | #1C1D21 | Media panels behind frames, pressed state |
| fg | #17181B | #ECECE9 | Text |
| muted | #5E6169 | #A1A4AB | Secondary text, meta (AA: 6.1:1 / 7.4:1) |
| border | #E4E4DF | #2A2C30 | 1px rules |
| border2 | #C9C9C3 | #45474D | Button outlines, link underlines |
| accent | #2A55C9 | #93ADF7 | Primary button, email link, focus ring |
| accent-hover | #2148AE | #B0C3FA | Primary hover |
| accent-fg | #FFFFFF | #0E1222 | Text on accent |
| ok | #1E7A4C | #6CCB94 | Status: Live |
| info | #2A55C9 | #93ADF7 | Status: testing / store beta |
| warn | #A86500 | #E3B45E | Status: partly shipped / in progress |
| (muted) | — | — | Status: in development |
| device | #1D1E21 | #3A3C42 | Phone bezel |
| code / code-fg | #17181B / #E7E7E3 | #1A1B1E / #DADAD6 | Code blocks |
| ph1 / ph2 | #E9E9E4 / #F1F1ED | #1F2024 / #25262B | Placeholder stripes: `repeating-linear-gradient(135deg, ph1 0 10px, ph2 10px 20px)` |

**Spacing & layout**
- Spacing scale: Tailwind default 4px base. Values used: 4, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 48, 64, 96, 128.
- Container: `max-width: 1280px; margin: 0 auto; padding-inline: clamp(20px, 5.5vw, 80px)` → 1120px content at 1440px.
- Long text measure: 680px (case-study article, about text 640px, experience content 680px).
- Section top padding: `clamp(80px, 10vw, 144px)`. Projects section: `clamp(56px, 8vw, 112px)` with a 1px top rule. Contact: `clamp(96px, 12vw, 176px)`.
- Hero padding: `clamp(56px, 10vw, 144px)` top, `clamp(56px, 7vw, 104px)` bottom.
- Radius: 4px portrait · 8px buttons/inputs/toggles · 10px gallery tiles · 12px code block and diagram · 14px media panels · 28px/24px phone bezels.
- Shadows only on mock frames (see tokens). Nowhere else.
- Responsive approach: no hard breakpoints are needed for most sections; every row uses `flex-wrap` with flex-basis values (listed below), so columns stack naturally. Mobile-only differences (nav, hero portrait) switch at **md (768px)**.

## Screens

### Header (both templates)
- Sticky, `top:0`, height 64px, bg = `--bg`, 1px bottom border `--border`, z-index above content.
- Left: wordmark "Sayeef Mahmud", Newsreader 21px, −0.01em, links to `/`.
- Desktop right: nav links (Projects, Experience, About, Contact) 15px, muted → fg on hover, 28px gap. Then a 36px gap, then the theme toggle (36×36, 1px border, radius 8, icon = 14px circle with 1.5px fg border, left half filled) and the Resume button (36px tall, 14px horizontal padding, 1px fg border, radius 8, 14px/500, "Resume ↓"; hover inverts to fg background with bg text). On the case study page, "Projects" is the current link (fg colour).
- Mobile (<768): theme toggle + menu button, each 44×44, no border. The menu icon is two 20×1.5px bars, 6px apart.
- **Mobile menu sheet** (screenshot 03): full screen, bg. Top bar the same as the header, with a "×" close button (26px). Links stacked: Newsreader 36px / 1.2, 14px vertical padding, 1px bottom rule, 24px from the top bar. Pinned to the bottom: a full-width accent button "Download resume (PDF)", 52px tall, radius 8. Below it, a 14px muted row with the email on the left and "LinkedIn · GitHub" on the right. 20px side padding, 32px bottom padding. Lock body scroll while open; close on Esc and on link click; trap focus.

### Hero (Home)
- Flex row, wrapping, gap `clamp(32px, 5vw, 80px)`, `align-items:flex-end`.
- **Text column** (`flex: 1 1 600px`):
  - Meta line: Plex Mono 13px muted, "Dhaka, Bangladesh · Software engineer at Cefalo".
  - H1 (display), margin-top 20px: "I'm Sayeef Mahmud, a full-stack engineer building production web, mobile and AI-assisted systems."
  - Lead, margin-top 28px (copy in the HTML).
  - Actions, margin-top 36px, 12px gap: **View projects** (primary: 48px tall, 22px horizontal padding, radius 8, accent background, 500 weight), **Contact** (secondary: 1px border2 outline, fg border on hover), **Resume (PDF) ↓** (text link: underline with border2 colour, 4px offset, 10px horizontal padding).
- **Portrait** (desktop, `flex: 0 1 340px; min-width:260px`): 4:5, radius 4px, `object-fit: cover`, bottom-aligned with the buttons. Use `next/image` with `priority`, sized about 340×425 (provide 2× sources).
- **Portrait on mobile:** 148px wide, 4:5, placed above the meta line (it comes first in the stacked column).
- **Facts row** (`<dl>`), margin-top `clamp(48px, 6vw, 88px)`: grid `repeat(auto-fit, minmax(200px, 1fr))`, 32px column gap. Each item has a 1px top rule, 14px top padding and 16px bottom margin. Label: Plex Mono 12px muted. Value: 15px/500 with a 4px top margin. Items: Work: Associate Software Engineer, Cefalo · ICPC: World Finalist · Anthropic: Claude Certified Architect · Codeforces: Master, max 2183.

### Selected projects (the most important section)
- Header row: H1 "Selected projects" and an "All projects →" link (accent, 15px/500, underline on hover), spaced apart and baseline-aligned, with a `clamp(40px, 5vw, 72px)` bottom margin.
- Rows stacked with a `clamp(64px, 8vw, 128px)` gap. **One reusable `ProjectRow` component**; even rows use `flex-direction: row`, odd rows `row-reverse` (media alternates left and right).
- Row: flex, wrapping, `align-items:center`, gap `clamp(28px, 5vw, 72px)`.
  - **Media** (`flex: 1 1 520px`): a link to the case study. Panel bg `--sunk`, radius 14, aspect 4:3, 7% padding, content centred. Hover: `translateY(-4px)` over 400ms with `cubic-bezier(.2,.7,.2,1)`. One of four frame types, chosen per project by `frame`:
    - `browser` (web): full-size white `surface` card, radius 8, shadow-shot, a 30px top bar with three 8px dots (border2) and a 1px bottom rule.
    - `window` (desktop app): 86% height, radius 10, a 28px top bar with three 9px dots, no rule.
    - `phone` (portrait mobile): full height, aspect 9:19, a 7px `--device` border, radius 28, shadow-device.
    - `land` (landscape mobile/game): full width, aspect 19:9, a 7px device border, radius 24.
    - Inside each frame goes the screenshot (`object-fit: cover`). Placeholder = stripes plus a Plex Mono 12px label.
  - **Text** (`flex: 1 1 340px`):
    - Meta: Plex Mono 13px muted, e.g. "01 · Web app".
    - Name: project-name style, 10px top margin.
    - Summary: 17px, 14px top margin.
    - Definition list, 24px top margin: grid `88px 1fr`, gaps 10px/16px, 14px. Rows: Status (a 7px status dot plus a 500-weight label), Runs on, Stack (tech joined by " · "), Notes.
    - Links, 24px top margin: 15px/500, gaps 8px/24px, underlined with border2 colour and a 5px offset; the underline turns fg on hover. Arrows: ↗ for external links, → for the case study.
- Order and data are in `content.js`: Watchlist (browser), Stash (window), Nebula Dash (land), DreamWall (window), Doom Scroll (phone).

### More projects
- Small 15px/600 heading. Rows have a 1px top rule and 14px vertical padding: name on the left, type muted on the right.

### Experience — reusable `ExperienceEntry`
- Each entry: flex, wrapping, with a 1px top rule and 28px vertical padding. Left column (`flex: 0 0 220px`): dates in Plex Mono 13px muted, employer 500 below. Right column (`flex: 1 1 420px`, max 680px): role h3, project type 15px muted, summary 12px below, tech line in Plex Mono 13px muted.
- "Earlier" subheading 15px/600, then compact rows: dates (mono) | **role**, org · muted description.
- The work entries are placeholders by design (no client names).

### How I work
- H1, then an intro (18px muted, max 38em).
- A three-column `<ol>` (`auto-fit, minmax(240px, 1fr)`, 32px gap): each step has a 1px **fg** top rule, a mono number, a 26px Newsreader title and a 15px muted description.
- Below, a 2-column list (`minmax(300px, 1fr)`, 48px gap) of tools: "**Custom skills.** muted description", with 1px top rules. The last item, "Certified.", is accent-coloured and states the Claude Certified Architect credential.

### Stack
- Rows: 1px top rule, 14px padding. Category (600, 220px column) | items as a muted comma-separated list. **No chips, logos or bars.**

### Achievements & certifications
- 2-column list (`minmax(320px, 1fr)`): title 600, detail muted below, year right-aligned in mono 13px.

### About
- Portrait (4:5, `flex: 0 1 320px`) + text (max 640px): H1 "About", 18px paragraphs and a definition list (Based in, Work, Education). This repeats the hero photo; a different photo is fine here.

### Contact / footer
- H2 at `clamp(38px, 5vw, 72px)`, max 14em: "Hiring, or building something? I'd like to hear about it."
- The email as a large Newsreader link `clamp(24px, 2.4vw, 34px)`, accent, 1px underline at an 8px offset (2px on hover), `overflow-wrap: anywhere`.
- Three secondary buttons, 44px tall: LinkedIn ↗, GitHub ↗, Resume (PDF) ↓.
- Footer: a 1px top rule, 14px muted: "© 2026 Sayeef Mahmud · Dhaka" on the left; Codeforces, CodeChef, LinkedIn, GitHub links on the right.

### Case study template (`/projects/[slug]`)
- "← All projects" (14px muted).
- Meta: "Case study · Web app" (mono 13px).
- H1 (case-study H1), summary (Newsreader), then actions: **Visit live site ↗** (primary, 44px) and **Source on GitHub ↗** (secondary).
- Meta `<dl>` grid (Role, Timeline, Platform, Status), styled like the hero facts row. Then a Stack line: a mono label followed by items separated by a border2 "/".
- **Media:** a sunk panel (radius 14, padding `clamp(16px, 4vw, 56px)`) holding a browser frame at 16:9. Below it, a 3-tile gallery (`minmax(220px, 1fr)`, 16px gap, aspect 4:3, radius 10). Swap the frame type for non-web projects (window / phone / land, as on Home).
- **Body:** a sticky "On this page" TOC (desktop only, 200px, `top: 96px`, 1px left rule, the active item has an fg left border) next to an article (max 680px, 18px). Sections, each an H2 with a 64px top margin: The problem · What I built · Key features (2-column list) · Architecture & technical decisions (diagram figure + decision paragraphs + code block) · Challenges · Results & status (3 big figures in Newsreader `clamp(28px, 3vw, 40px)` above muted labels, each with a 1px fg top rule) · What's next.
- Code block: bg `--code`, text `--code-fg`, radius 12, padding 20px/22px, horizontal scroll. Use Shiki at build time with a theme that matches these colours.
- **Next project:** a full-width link with a 1px fg top rule: a mono label, the next project name in Newsreader `clamp(40px, 5vw, 72px)` with its summary below, and a 32px "→" on the right. Hover colours it accent.
- Case-study content should live in MDX per project (`content/projects/<slug>.mdx` with frontmatter for the hero meta).

## Interactions & motion
- **Page load:** the hero meta, headline, lead and actions fade in once (opacity 0→1, translateY 8px→0, 500ms ease-out, 60ms stagger). Nothing else animates on scroll.
- **Project media hover:** lift 4px over 400ms with `cubic-bezier(.2,.7,.2,1)`. No image zoom.
- **Links and buttons:** colour and underline transitions over 150ms ease-out. Buttons translate 1px down on `:active`.
- **Header:** height fixed at 64px. Optionally show the bottom border only after 8px of scroll.
- **Theme switch:** background and text colours cross-fade over 200ms.
- **Mobile menu:** fades in over 200ms; the links do not stagger.
- **Reduced motion:** remove all transforms and keep only colour/opacity changes of 100ms or less.
- **States:** focus = a 2px accent outline at a 2px offset (never removed); disabled = 40% opacity with `pointer-events: none`. Primary: default accent → hover accent-hover → active accent-active. Secondary: border2 → fg border → sunk background. See screenshot 08 for every state.
- **Status badge:** a 7px dot plus a text label; colour is never the only signal. Map: Live → ok; closed testing → info; partly shipped → warn; in development → muted.

## Accessibility
Semantic order: one H1 per page; section titles are H2 in the markup (styled with the h1 token on Home), and project names are H3. All text pairs meet WCAG AA. Links describe their target ("Watchlist case study", not just "Case study"; use visually hidden text). Every hit target on mobile is at least 44px. The theme toggle has `aria-label` and `aria-pressed`.

## Assets
- `portrait.jpg` — the owner's photo (add it; 4:5 crop, at least 800×1000).
- Project screenshots — not yet made. Each placeholder label names the shot needed, e.g. "Screenshot: Stash popup, macOS". Recommended export sizes: browser and window shots 1600×1000; phone 1080×2280; landscape 2280×1080. Serve them through `next/image`.
- Resume PDF at `/resume.pdf`.
- No icon library: the only glyphs used are the text arrows ↗ → ← ↓ and ×.

## Placeholders to replace
The email (`hello@sayeefmahmud.com`), the experience dates and summaries, the second About paragraph, and the Watchlist timeline, challenges and "What's next". All of these are in `content.js`.

## Files
- `design/Direction-A.dc.html` — the board: all views plus the style sheet
- `design/A-Home.dc.html` — Home template (props: `mobile`, `menuOpen`, `heroPhoto`)
- `design/A-CaseStudy.dc.html` — case study template
- `design/content.js` — all copy and data
- `tokens/tokens.css`, `tokens/tailwind-theme.css`
- `fonts/` — woff2 files plus `fonts.css`
- `screenshots/` — 8 reference PNGs

## Suggested build order for Claude Code
1. Set up tokens, fonts and the theme toggle with no-flash init.
2. Build the layout primitives: Container, Section, SectionTitle.
3. Build the components: Header, MobileMenu, Button (primary / secondary / text), StatusBadge, DeviceFrame (browser / window / phone / land), ProjectRow, ExperienceEntry, AchievementItem, Footer.
4. Assemble the Home page from typed content.
5. Build the case study template with MDX, then add an "All projects" page reusing ProjectRow.
6. Compare each page against the screenshots at 1440 and 390 (Playwright screenshots work well for side-by-side checks).
