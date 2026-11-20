import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getCaseStudySlugs } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/projects", ...getCaseStudySlugs().map((slug) => `/projects/${slug}`)];
  return paths.map((p) => ({ url: new URL(p, site.url).toString() }));
}
