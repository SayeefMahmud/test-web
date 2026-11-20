import { IBM_Plex_Mono, Newsreader, Public_Sans } from "next/font/google";

/** Headings, display, wordmark. Variable font with optical sizes (opsz 6–72). */
export const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-newsreader",
});

/** Body and UI. Variable font covers 400 / 500 / 600. */
export const sans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

/** Meta, dates, code. */
export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
});

export const fontVariables = `${serif.variable} ${sans.variable} ${mono.variable}`;
