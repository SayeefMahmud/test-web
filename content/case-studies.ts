// Case-study registry: project slug → its MDX file.
// To add a case study: write `content/projects/<slug>.mdx` (frontmatter shape:
// `CaseStudyFrontmatter` in `content/types.ts`) and add one line here.
// Projects without an entry hide their "Case study →" link and get no page.

import type { MDXModule } from "mdx/types";

export const caseStudies: Record<string, () => Promise<MDXModule>> = {
  watchlist: () => import("./projects/watchlist.mdx"),
};
