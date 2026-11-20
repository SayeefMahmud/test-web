// Shared content types. Every list on the site is one of these arrays, so
// adding, removing or reordering an item is an edit in `content/`, never in a
// component. Optional fields degrade gracefully (see `docs/plan.md`).

/** A link that may not have a URL yet. Components hide links without `href`. */
export type Link = {
  label: string;
  href?: string;
};

/** Label/value pair rendered in a `<dl>` (hero facts, About facts, case-study meta). */
export type Fact = {
  label: string;
  value: string;
};

/** A titled line with a muted description (tools, features, decisions, challenges). */
export type Item = {
  title: string;
  description: string;
};

/** Screenshot slot: striped placeholder with `label` until `src` is provided. */
export type Shot = {
  /** Placeholder text and image alt text, e.g. "Screenshot: Stash popup, macOS". */
  label: string;
  /** Path under `public/`, e.g. `/images/projects/stash/popup.png`. */
  src?: string;
};

/** Device frame drawn around a project screenshot. */
export type Frame = "browser" | "window" | "phone" | "land";

/** Drives the status dot colour: ok, info, warn, muted. */
export type StatusKind = "live" | "beta" | "progress" | "dev";

export type ProjectLinkKind = "live" | "github" | "store";

export type ProjectLink = Link & {
  kind: ProjectLinkKind;
  /** Longer label used on the case-study hero buttons, e.g. "Visit live site". */
  ctaLabel?: string;
};

export type Project = {
  slug: string;
  name: string;
  /** One-sentence summary shown on the project row. */
  summary: string;
  /** Short line used on the "Next project" link. Falls back to `platform`. */
  tagline?: string;
  /** e.g. "Web app", "Desktop app". */
  platform: string;
  /** "Runs on" row. */
  devices: string;
  tech: string[];
  status: string;
  statusKind: StatusKind;
  /** "Notes" row. */
  notes: string;
  /** External links, in display order. The "Case study →" link is added automatically when an MDX case study exists. */
  links: ProjectLink[];
  frame: Frame;
  shot: Shot;
  /** Brand colour of the project (not a design token; used for project-specific art only). */
  accent: string;
};

export type MoreProject = {
  name: string;
  type: string;
  href?: string;
};

export type ExperienceEntry = {
  time: string;
  role: string;
  org: string;
  /** Muted line under the role, e.g. "Enterprise web platform · Nordic client". */
  context: string;
  summary: string;
  tech: string[];
};

export type EarlierEntry = {
  time: string;
  role: string;
  org: string;
  description: string;
};

export type Step = {
  title: string;
  description: string;
};

export type Tool = Item & {
  /** Renders the title in the accent colour (the "Certified." row). */
  highlight?: boolean;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type Achievement = {
  title: string;
  detail: string;
  year?: string;
};

export type Paragraph = {
  text: string;
  /** Muted secondary paragraph. */
  muted?: boolean;
};

export type Action = Link & {
  variant: "primary" | "secondary" | "text";
  /** Trailing glyph: ↗ external, → internal, ↓ download. */
  arrow?: "↗" | "→" | "↓";
};

// ---------------------------------------------------------------------------
// Case studies (`content/projects/<slug>.mdx`)

/** YAML frontmatter at the top of a case-study MDX file. Validated by `lib/projects.ts`. */
export type CaseStudyFrontmatter = {
  /** Lead under the H1. Usually longer than the project row summary. */
  summary: string;
  /** Hero `<dl>`: Role, Timeline, Platform, Status, … */
  facts: Fact[];
  stack: string[];
  /** Large screenshot under the hero (browser frame, 16:9). */
  hero: Shot;
  /** Smaller screenshots under the hero. */
  gallery?: Shot[];
  /**
   * Shorter TOC labels, keyed by the full H2 text,
   * e.g. `"Architecture & technical decisions": "Architecture"`.
   */
  tocLabels?: Record<string, string>;
};

export type TocEntry = { id: string; label: string };

/** `<Results>` in MDX: big numbers in the "Results & status" section. */
export type Result = { value: string; label: string };

/** `<ArchitectureDiagram>` in MDX. */
export type ArchitectureDiagramProps = {
  /** Main request path, left to right, joined with →. */
  flow: string[];
  /** Index in `flow` drawn with the strong (fg) outline. */
  primary?: number;
  /** External services / jobs, drawn dashed below the flow. */
  services?: string[];
  caption?: string;
};
