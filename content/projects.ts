// Selected projects, in display order (row direction alternates by index).
// Case studies live in `content/projects/<slug>.mdx` and are registered in
// `content/case-studies.ts`; without one, the "Case study →" link is hidden.
//
// Pending from the owner: link URLs (links without `href` are hidden) and
// screenshots (`shot.src`; striped placeholder until then).

import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "watchlist",
    name: "Watchlist",
    summary:
      "Track movies, TV shows and sports in one place, with reminders for new episodes and upcoming fixtures.",
    platform: "Web app",
    devices: "Web, responsive",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL (Neon)", "Auth.js", "Vitest"],
    status: "Live",
    statusKind: "live",
    notes: "980+ tests · security-reviewed API · deployed on Vercel",
    links: [
      { kind: "live", label: "Live site", ctaLabel: "Visit live site" },
      { kind: "github", label: "GitHub", ctaLabel: "Source on GitHub" },
    ],
    frame: "browser",
    shot: { label: "Screenshot: Watchlist dashboard, desktop browser" },
    accent: "#B3352B",
  },
  {
    slug: "stash",
    name: "Stash",
    summary:
      "Clipboard history for macOS, Windows and Ubuntu. A global hotkey opens a searchable popup at the cursor and pastes straight into the app you were using.",
    tagline: "Cross-platform clipboard manager",
    platform: "Desktop app",
    devices: "macOS · Windows · Ubuntu",
    tech: ["Flutter", "Dart", "SQLite", "Swift platform channels"],
    status: "macOS ready · Windows & Linux in progress",
    statusKind: "progress",
    notes: "480+ tests · built from a full spec and design handoff",
    links: [{ kind: "github", label: "GitHub" }],
    frame: "window",
    shot: { label: "Screenshot: Stash popup, macOS" },
    accent: "#1D6B66",
  },
  {
    slug: "nebula-dash",
    name: "Nebula Dash",
    summary:
      "A 3D space racer: fly through rings and dodge debris across 18 levels in six skies, then spend coins on 16 ships. Every scene is generated from code.",
    platform: "Mobile game",
    devices: "Android · iOS",
    tech: ["Unity", "C#", "Procedural generation"],
    status: "Google Play · closed testing",
    statusKind: "beta",
    notes: "Fully offline · landscape touch controls",
    links: [
      { kind: "store", label: "Google Play" },
      { kind: "github", label: "GitHub" },
    ],
    frame: "land",
    shot: { label: "Screenshot: Nebula Dash gameplay, landscape phone" },
    accent: "#2E3480",
  },
  {
    slug: "dreamwall",
    name: "DreamWall",
    summary:
      'Generates a new AI wallpaper every day and sets it automatically, with a gallery of past wallpapers, theme suggestions and a "Generate now" button.',
    platform: "Desktop app",
    devices: "macOS · Windows",
    tech: ["Flutter", "Cloudflare Workers AI", "SQLite", "Swift / C++ channels", "GitHub Actions"],
    status: "macOS ready · Windows via CI",
    statusKind: "progress",
    notes: "An LLM writes the prompt, an image model paints it",
    links: [{ kind: "github", label: "GitHub" }],
    frame: "window",
    shot: { label: "Screenshot: DreamWall gallery, macOS" },
    accent: "#6A4291",
  },
  {
    slug: "doom-scroll",
    name: "Doom Scroll",
    summary:
      "Turns doom-scrolling into learning. Pick topics and get short, LLM-written learning cards as notifications and in a feed.",
    platform: "Mobile app",
    devices: "iOS · Android",
    tech: ["React Native (Expo)", "TypeScript", "ASP.NET Core", "EF Core", "OpenAPI"],
    status: "In development",
    statusKind: "dev",
    notes: "Typed client generated from the OpenAPI spec",
    links: [{ kind: "github", label: "GitHub" }],
    frame: "phone",
    shot: { label: "Screenshot: Doom Scroll card feed, phone" },
    accent: "#8A520C",
  },
];
