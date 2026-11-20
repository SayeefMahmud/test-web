import type { ReactNode } from "react";
import type { Link } from "@/content/types";
import { TextLink } from "./ui";

// Layout primitives. Every section uses `Section`; its `spacing` picks the top/bottom
// padding from the design (`docs/handoff/design/A-Home.dc.html`).

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** 1280px max content width, side padding outside it (content-box, as in the design). */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("mx-auto max-w-[var(--container)] px-[var(--page-pad)]", className)}>
      {children}
    </div>
  );
}

const sectionSpacing = {
  /** Most sections: clamp(80px, 10vw, 144px) top. */
  default: "pt-[var(--section-gap)]",
  hero: "pt-[clamp(56px,10vw,144px)] pb-[clamp(56px,7vw,104px)]",
  /** Selected projects: tighter top padding and a 1px top rule. */
  projects: "pt-[clamp(56px,8vw,112px)] border-t border-border",
  /** Follows the projects list (More projects). */
  compact: "pt-[clamp(64px,8vw,112px)]",
  contact: "pt-[clamp(96px,12vw,176px)] pb-[clamp(64px,8vw,96px)]",
  /** Case-study hero. */
  caseStudy: "pt-[clamp(40px,6vw,80px)]",
  caseStudyMedia: "pt-[clamp(40px,5vw,72px)]",
  caseStudyBody: "pt-[clamp(64px,8vw,112px)]",
  /** Case-study "Next project" + footer. */
  caseStudyEnd: "pt-[var(--section-gap)] pb-[clamp(48px,6vw,80px)]",
  none: "",
} as const;

export type SectionSpacing = keyof typeof sectionSpacing;

type SectionProps = {
  id?: string;
  spacing?: SectionSpacing;
  /** Accessible name when the section has no visible heading. */
  label?: string;
  className?: string;
  children: ReactNode;
};

/** Shared shell for every home and case-study section. Anchored sections clear the 64px sticky header. */
export function Section({ id, spacing = "default", label, className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cx(
        "mx-auto max-w-[var(--container)] scroll-mt-16 px-[var(--page-pad)]",
        sectionSpacing[spacing],
        className,
      )}
    >
      {children}
    </section>
  );
}

const headerGap = {
  /** Selected projects: clamp(40px, 5vw, 72px). */
  lg: "mb-[clamp(40px,5vw,72px)]",
  /** Experience: clamp(32px, 4vw, 56px). */
  md: "mb-[clamp(32px,4vw,56px)]",
  /** Stack, achievements: clamp(28px, 3vw, 40px). */
  sm: "mb-[clamp(28px,3vw,40px)]",
  none: "",
} as const;

type SectionHeaderProps = {
  title: string;
  /** Link on the right, e.g. "All projects →". Hidden without `href`. */
  action?: Link;
  gap?: keyof typeof headerGap;
  /** `contact` is the large closing headline. */
  size?: "h1" | "contact";
  className?: string;
};

/** Section title (an H2 in the markup, styled with the h1 token) with an optional action link. */
export function SectionHeader({
  title,
  action,
  gap = "none",
  size = "h1",
  className,
}: SectionHeaderProps) {
  const heading = (
    <h2
      className={cx(
        "font-serif font-normal",
        size === "h1"
          ? "text-h1"
          : "max-w-[14em] text-[clamp(38px,5vw,72px)] leading-[1.06] tracking-[-0.02em] text-balance",
      )}
    >
      {title}
    </h2>
  );

  if (!action?.href) {
    return <div className={cx(headerGap[gap], className)}>{heading}</div>;
  }
  return (
    <div
      className={cx(
        "flex flex-wrap items-baseline justify-between gap-4",
        headerGap[gap],
        className,
      )}
    >
      {heading}
      <TextLink href={action.href} variant="accent" arrow="→" className="text-ui font-medium">
        {action.label}
      </TextLink>
    </div>
  );
}
