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
      'Track movies, TV shows and sports teams in one place. Search titles and leagues live, mark episodes as watched, browse 56 curated "best of" lists, and get reminders in the app and by email when a new episode airs or a fixture is coming up. Covered by 980+ tests and deployed on Vercel.',
    platform: "Web app",
    devices: "Web, responsive",
    tech: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "PostgreSQL (Neon)",
      "Auth.js",
      "Vitest",
    ],
    status: "Live",
    statusKind: "live",
    links: [
      { kind: "live", label: "Live site", ctaLabel: "Visit live site" },
      { kind: "github", label: "GitHub", ctaLabel: "Source on GitHub" },
    ],
    frame: "browser",
    shot: {
      label: "Screenshot: Watchlist dashboard, desktop browser",
      src: "/images/projects/watchlist/home-trending.png",
    },
    accent: "#B3352B",
  },
  {
    slug: "stash",
    name: "Stash",
    summary:
      "Clipboard history for macOS and Windows. A global hotkey opens a searchable popup at the cursor and pastes straight into the app you were using. It keeps your recent text, images and files across restarts, and pinned items paste with a single shortcut, without opening the popup.",
    tagline: "Cross-platform clipboard manager",
    platform: "Desktop app",
    devices: "macOS · Windows",
    tech: ["Flutter", "Dart", "SQLite", "Swift platform channels"],
    status: "macOS & Windows ready",
    statusKind: "live",
    links: [{ kind: "github", label: "GitHub" }],
    frame: "app",
    shot: {
      label: "Screenshot: Stash popup, macOS",
      src: "/images/projects/stash/popup.png",
      aspect: 810 / 910,
    },
    accent: "#1D6B66",
  },
  {
    slug: "nebula-dash",
    name: "Nebula Dash",
    summary:
      "A 3D space racer for phones: fly through rings in order, collect coins and dodge debris across 18 levels in six skies, then spend coins on 16 ships in the hangar. Two new chapters are on the way, growing the game to 54 levels plus 18 trials with new hazards like crushers, lasers and mines. It plays fully offline, and every scene is generated from code.",
    platform: "Mobile game",
    devices: "Android · iOS",
    tech: ["Unity", "C#", "Procedural generation"],
    status: "Google Play · closed testing",
    statusKind: "beta",
    links: [
      { kind: "store", label: "Google Play" },
      { kind: "github", label: "GitHub" },
    ],
    frame: "land",
    shot: {
      label: "Screenshot: Nebula Dash gameplay, landscape phone",
      src: "/images/projects/nebula-dash/aurum-hud.png",
    },
    // Aurum is the ship in the screenshot. Re-export after changing the game's meshes:
    // `npm run models:export` (see scripts/export-ship.mjs).
    model: {
      src: "/models/aurum.glb",
      // Ion Storm, the sky in the screenshot, with its next ring, coins and two asteroids.
      sky: "/models/ion-storm-sky.webp",
      props: "/models/ion-storm-props.glb",
      label: "Aurum, the ship in the screenshot, as a 3D model",
    },
    accent: "#2E3480",
  },
  {
    slug: "dreamwall",
    name: "DreamWall",
    summary:
      'Generates a new AI wallpaper every day and sets it on your desktop automatically. An LLM writes a prompt from your chosen topics and an image model paints it, both on Cloudflare Workers AI. Past wallpapers stay in a gallery, and you can suggest a theme or press "Generate now" at any time.',
    platform: "Desktop app",
    devices: "macOS · Windows",
    tech: [
      "Flutter",
      "Cloudflare Workers AI",
      "SQLite",
      "Swift / C++ channels",
      "GitHub Actions",
    ],
    status: "macOS & Windows ready",
    statusKind: "live",
    links: [{ kind: "github", label: "GitHub" }],
    frame: "app",
    shot: {
      label: "Screenshot: DreamWall gallery, macOS",
      src: "/images/projects/dreamwall/gallery.png",
      aspect: 2202 / 1316,
    },
    accent: "#6A4291",
  },
  {
    slug: "doom-scroll",
    name: "Doom Scroll",
    summary:
      "Turns doom-scrolling into learning. Add the topics you want to learn, and the app sends short, LLM-written learning cards as notifications at set times of day and keeps them in a scrollable feed. It tracks what you've read, so each card builds on the last.",
    platform: "Mobile app",
    devices: "iOS · Android",
    tech: [
      "React Native (Expo)",
      "TypeScript",
      "ASP.NET Core",
      "EF Core",
      "OpenAPI",
    ],
    status: "In development",
    statusKind: "dev",
    links: [{ kind: "github", label: "GitHub" }],
    frame: "phone",
    shot: {
      label: "Screenshot: Doom Scroll card feed, phone",
      src: "/images/projects/doom-scroll/feed-light.png",
    },
    accent: "#8A520C",
  },
];
