// The home page, top to bottom. `app/page.tsx` maps over this array.
//
// - Reorder: move an entry.  Remove: delete it.
// - Add: write a section component, add its name to `HomeSectionComponent`,
//   register it in the page's component map, then add an entry here.
// - Header and mobile-menu links come from entries with a `nav` label, in this order.
// - The section copy itself lives in `content/site.ts` / `content/projects.ts`.

import type { Link } from "./types";
import { labels } from "./site";

export type HomeSectionComponent =
  | "Hero"
  | "SelectedProjects"
  | "MoreProjects"
  | "Experience"
  | "Stack"
  | "Achievements"
  | "About"
  | "Contact";

export type HomeSection = {
  /** Anchor id (`#projects`). Must be unique. */
  id: string;
  component: HomeSectionComponent;
  /** Section heading (H2). Sections without one render no header. */
  title?: string;
  /** Label in the header / mobile menu. Omit to keep the section out of the nav. */
  nav?: string;
  /** Link on the right of the section header, e.g. "All projects →". */
  action?: Link;
};

export const homeSections: HomeSection[] = [
  { id: "top", component: "Hero" },
  {
    id: "projects",
    component: "SelectedProjects",
    title: "Selected projects",
    nav: "Projects",
    action: { label: labels.allProjects, href: "/projects" },
  },
  { id: "more-projects", component: "MoreProjects" },
  { id: "experience", component: "Experience", title: "Experience", nav: "Experience" },
  { id: "stack", component: "Stack", title: "Stack" },
  { id: "achievements", component: "Achievements", title: "Achievements & certifications" },
  { id: "about", component: "About", title: "About", nav: "About" },
  {
    id: "contact",
    component: "Contact",
    title: "Building something interesting? I'd like to hear about it.",
    nav: "Contact",
  },
];

export type NavLink = { label: string; id: string; href: string };

/** Header / mobile-menu links. Hrefs are absolute (`/#projects`) so they also work from other pages. */
export const navLinks: NavLink[] = homeSections.flatMap((s) =>
  s.nav ? [{ label: s.nav, id: s.id, href: `/#${s.id}` }] : [],
);
