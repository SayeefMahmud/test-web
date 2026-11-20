import { readFile } from "node:fs/promises";
import path from "node:path";

// Shared by the generated Open Graph image and icons (`app/opengraph-image.tsx`, `app/icon.tsx`,
// `app/apple-icon.tsx`). They render outside the page CSS, so the light-theme token values from
// `app/globals.css` are repeated here. Satori can't read woff2: static woff copies of the site
// fonts (Fontsource, OFL) live in `assets/og/`.

export const ogColors = {
  bg: "#FAFAF8",
  fg: "#17181B",
  muted: "#5E6169",
  border: "#E4E4DF",
  accent: "#2A55C9",
} as const;

const font = (file: string) => readFile(path.join(process.cwd(), "assets", "og", file));

/** Read once at module scope so the image routes prerender at build time. */
const [serif, sans, mono] = await Promise.all([
  font("newsreader-latin-400-normal.woff"),
  font("public-sans-latin-500-normal.woff"),
  font("ibm-plex-mono-latin-400-normal.woff"),
]);

export const ogFonts = [
  { name: "Newsreader", data: serif, weight: 400 as const, style: "normal" as const },
  { name: "Public Sans", data: sans, weight: 500 as const, style: "normal" as const },
  { name: "IBM Plex Mono", data: mono, weight: 400 as const, style: "normal" as const },
];

/** Square "S" monogram: bg-coloured Newsreader on fg, used for the favicon and Apple touch icon. */
export function Monogram({ size, radius }: { size: number; radius: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: ogColors.fg,
        color: ogColors.bg,
        borderRadius: radius,
        fontFamily: "Newsreader",
        fontSize: size * 0.78,
        lineHeight: 1,
        paddingBottom: size * 0.06,
      }}
    >
      S
    </div>
  );
}
