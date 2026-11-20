import { ImageResponse } from "next/og";
import { Monogram, ogFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS rounds the corners itself, so the square is full-bleed. */
export default function AppleIcon() {
  return new ImageResponse(<Monogram size={180} radius={0} />, {
    ...size,
    fonts: ogFonts,
  });
}
