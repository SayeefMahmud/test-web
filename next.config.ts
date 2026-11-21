import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 75: photos (default). 90: project screenshots, whose small UI text blurs at 75.
    qualities: [75, 90],
  },
  turbopack: {
    // Pin the root: a stray lockfile in a parent folder would otherwise be picked up.
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Case studies are imported from `content/projects/*.mdx` (not routed as pages).
// YAML frontmatter is exported as `frontmatter`. Plugins are named by string
// so Turbopack can load them.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-mdx-frontmatter"],
  },
});

export default withMDX(nextConfig);
