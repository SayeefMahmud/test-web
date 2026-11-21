import { readFileSync } from "node:fs";
import path from "node:path";
import type { MDXContent } from "mdx/types";
import { caseStudies, caseStudiesEnabled } from "@/content/case-studies";
import { projects } from "@/content/projects";
import type { CaseStudyFrontmatter, Fact, Project, Shot, TocEntry } from "@/content/types";
import { slugify } from "./slug";

export function getProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** True when the project has a registered case study and case studies are switched on. */
export function hasCaseStudy(slug: string): boolean {
  return caseStudiesEnabled && Object.hasOwn(caseStudies, slug);
}

/** `/projects/<slug>` when the project has a case study, otherwise `undefined` (link hidden). */
export function getCaseStudyHref(slug: string): string | undefined {
  return hasCaseStudy(slug) ? `/projects/${slug}` : undefined;
}

/** Slugs that get a `/projects/[slug]` page (empty while case studies are switched off). */
export function getCaseStudySlugs(): string[] {
  return projects.map((p) => p.slug).filter(hasCaseStudy);
}

/**
 * Params for `generateStaticParams`. Cache Components fails the build on an
 * empty list, so while case studies are switched off this still returns the
 * registered slugs — those pages prerender as the 404 page.
 */
export function getCaseStudyStaticSlugs(): string[] {
  const slugs = getCaseStudySlugs();
  return slugs.length > 0 ? slugs : Object.keys(caseStudies);
}

export type NextProject = {
  project: Project;
  /** Short line under the name: `tagline`, else `platform`. */
  summary: string;
  /** Its case study, or its row on `/projects` while it has none. */
  href: string;
};

/** The project after `slug` in display order, wrapping to the first. */
export function getNextProject(slug: string): NextProject | undefined {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1 || projects.length < 2) return undefined;
  const project = projects[(i + 1) % projects.length];
  return {
    project,
    summary: project.tagline ?? project.platform,
    href: getCaseStudyHref(project.slug) ?? `/projects#${project.slug}`,
  };
}

export type CaseStudy = {
  project: Project;
  meta: CaseStudyFrontmatter;
  toc: TocEntry[];
  Content: MDXContent;
};

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const project = getProject(slug);
  const load = hasCaseStudy(slug) ? caseStudies[slug] : undefined;
  if (!project || !load) return undefined;

  const mod = await load();
  const meta = parseFrontmatter(slug, mod.frontmatter);
  return {
    project,
    meta,
    toc: getToc(slug, meta.tocLabels),
    Content: mod.default,
  };
}

/**
 * TOC from the H2s (`## Heading`) of the MDX source, outside code fences.
 * Ids match the ones the MDX `h2` component sets (`slugify` of the text).
 * Read synchronously: this only runs while pages are prerendered.
 */
function getToc(slug: string, labels: Record<string, string> = {}): TocEntry[] {
  const file = path.join(process.cwd(), "content", "projects", `${slug}.mdx`);
  const toc: TocEntry[] = [];
  let inFence = false;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const m = !inFence && /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (m) toc.push({ id: slugify(m[1]), label: labels[m[1]] ?? m[1] });
  }
  return toc;
}

// --- Frontmatter validation: fail the build with a clear message, not a broken page.

function parseFrontmatter(slug: string, data: unknown): CaseStudyFrontmatter {
  const where = `content/projects/${slug}.mdx frontmatter`;
  const fail = (msg: string): never => {
    throw new Error(`${where}: ${msg}`);
  };
  const obj = isRecord(data) ? data : fail("missing (add a --- YAML block at the top)");

  const str = (v: unknown, field: string) =>
    typeof v === "string" && v.trim() ? v : fail(`"${field}" must be a non-empty string`);
  const list = (v: unknown, field: string) =>
    Array.isArray(v) ? v : fail(`"${field}" must be a list`);
  const shot = (v: unknown, field: string): Shot => {
    const s = isRecord(v) ? v : fail(`"${field}" must have a "label"`);
    return {
      label: str(s.label, `${field}.label`),
      ...(s.src === undefined ? {} : { src: str(s.src, `${field}.src`) }),
    };
  };

  const facts: Fact[] = list(obj.facts, "facts").map((f, i) => {
    const r = isRecord(f) ? f : fail(`"facts[${i}]" must have "label" and "value"`);
    return { label: str(r.label, `facts[${i}].label`), value: str(r.value, `facts[${i}].value`) };
  });

  let tocLabels: Record<string, string> | undefined;
  if (obj.tocLabels !== undefined) {
    const t = isRecord(obj.tocLabels) ? obj.tocLabels : fail(`"tocLabels" must be a map`);
    tocLabels = Object.fromEntries(
      Object.entries(t).map(([k, v]) => [k, str(v, `tocLabels.${k}`)]),
    );
  }

  return {
    summary: str(obj.summary, "summary"),
    facts,
    stack: list(obj.stack, "stack").map((s, i) => str(s, `stack[${i}]`)),
    hero: shot(obj.hero, "hero"),
    gallery:
      obj.gallery === undefined
        ? undefined
        : list(obj.gallery, "gallery").map((g, i) => shot(g, `gallery[${i}]`)),
    tocLabels,
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
