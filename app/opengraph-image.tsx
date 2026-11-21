import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { hero, site } from "@/content/site";
import { ogFonts, ogColors } from "@/lib/og";

export const alt = `${site.name}: ${hero.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Site-wide share card: the hero (eyebrow, headline, portrait) on the light background. */
const portrait = site.portrait
  ? `data:image/jpeg;base64,${await readFile(path.join(process.cwd(), "public", site.portrait), "base64")}`
  : undefined;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          gap: 64,
          padding: 72,
          background: ogColors.bg,
          color: ogColors.fg,
          fontFamily: "Public Sans",
        }}
      >
        <div style={{ flex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 22, color: ogColors.muted }}>
            {hero.eyebrow.join(" · ")}
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: "Newsreader",
              fontSize: 58,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            {hero.headline}
          </div>
          <div
            style={{
              marginTop: "auto",
              paddingTop: 20,
              borderTop: `1px solid ${ogColors.border}`,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 22,
            }}
          >
            <span>{site.name}</span>
            <span style={{ color: ogColors.accent }}>{new URL(site.url).host}</span>
          </div>
        </div>
        {portrait && (
          // eslint-disable-next-line jsx-a11y/alt-text -- decorative; Satori renders plain <img>
          <img
            src={portrait}
            width={344}
            height={430}
            style={{ borderRadius: 4, objectFit: "cover" }}
          />
        )}
      </div>
    ),
    { ...size, fonts: ogFonts },
  );
}
