import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sayeefmahmud.com"),
  title: {
    default: "Sayeef Mahmud — Software engineer",
    template: "%s — Sayeef Mahmud",
  },
  description:
    "Sayeef Mahmud is a full-stack engineer in Dhaka building production web, mobile and AI-assisted systems.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Sayeef Mahmud",
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#111214" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
