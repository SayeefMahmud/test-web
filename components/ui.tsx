import NextLink from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { Action, Fact, StatusKind } from "@/content/types";
import { cx } from "./layout";

// Small UI primitives: links, buttons, status badge, definition lists, rule lists.
// States follow screenshot 08: hover / focus ring (global :focus-visible) / active / disabled.

export type Arrow = "↗" | "→" | "←" | "↓";

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);
const isFile = (href: string) => /\.(pdf|zip)$/i.test(href);

type AnchorProps = Omit<ComponentProps<"a">, "href"> & { href: string };

/** `next/link` for in-site routes, a plain `<a>` for external URLs, mailto and files. */
export function SmartLink({ href, children, ...rest }: AnchorProps) {
  if (isExternal(href) || isFile(href)) {
    return (
      <a
        href={href}
        {...(href.startsWith("http") ? { rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} {...rest}>
      {children}
    </NextLink>
  );
}

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/** Arrow glyph, hidden from screen readers (link text carries the meaning). */
function Glyph({ arrow }: { arrow: Arrow }) {
  return <span aria-hidden="true">{arrow}</span>;
}

// ── TextLink ────────────────────────────────────────────────────────────────

const textLinkVariants = {
  /** Project links: border2 underline at 5px, turns fg on hover. */
  underline:
    "underline decoration-border2 underline-offset-[5px] hover:decoration-fg active:text-accent active:decoration-accent",
  /** Nav, footer, "← All projects": muted, fg on hover. */
  muted: "text-muted no-underline hover:text-fg",
  /** Inherit colour, no underline (footer links on muted rows). */
  plain: "no-underline hover:text-fg",
} as const;

type TextLinkProps = Omit<AnchorProps, "children"> & {
  variant?: keyof typeof textLinkVariants;
  /** ←, placed before the text; others go after it. */
  arrow?: Arrow;
  children: ReactNode;
};

export function TextLink({
  variant = "underline",
  arrow,
  className,
  children,
  ...rest
}: TextLinkProps) {
  return (
    <SmartLink
      className={cx(
        "hit-area transition-[color,text-decoration-color] duration-150 ease-out",
        textLinkVariants[variant],
        className,
      )}
      {...rest}
    >
      {arrow === "←" && (
        <>
          <Glyph arrow={arrow} />{" "}
        </>
      )}
      {children}
      {arrow && arrow !== "←" && (
        <>
          {" "}
          <Glyph arrow={arrow} />
        </>
      )}
    </SmartLink>
  );
}

// ── Button ──────────────────────────────────────────────────────────────────

const buttonVariants = {
  primary: "bg-accent text-accent-fg hover:bg-accent-hover active:bg-accent-active",
  secondary: "border border-border2 hover:border-fg active:border-fg active:bg-sunk",
  /** Header "Resume ↓": fg outline, inverts on hover. */
  outline: "border border-fg hover:bg-fg hover:text-bg",
  /** Underlined text action ("Resume (PDF) ↓"). */
  text: "px-2.5! underline decoration-border2 underline-offset-4 hover:decoration-fg active:text-accent",
} as const;

const buttonSizes = {
  /** Hero: 48px, 22px padding, 16px. */
  lg: "h-12 px-[22px] gap-2 text-body",
  /** Contact, case-study hero: 44px, 18px padding, 15px. */
  md: "h-11 px-[18px] gap-1 text-ui",
  /** Header resume: 36px, 14px padding, 14px. */
  sm: "h-9 px-3.5 gap-2 text-small",
  /** Mobile-menu resume: 52px, full width, centred. */
  block: "h-[52px] w-full justify-center gap-2 text-body",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

type ButtonProps = Omit<AnchorProps, "children"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: Arrow;
  disabled?: boolean;
  children: ReactNode;
};

/** Link styled as a button (every button on the site navigates). */
export function Button({
  variant = "primary",
  size = "lg",
  arrow,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <SmartLink
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      className={cx(
        "inline-flex shrink-0 items-center rounded-control font-medium whitespace-nowrap no-underline",
        "transition-[background-color,border-color,color,text-decoration-color,translate] duration-150 ease-out active:translate-y-px",
        "aria-disabled:pointer-events-none aria-disabled:opacity-40",
        buttonSizes[size],
        buttonVariants[variant],
        className,
      )}
      {...rest}
    >
      {children}
      {arrow && <Glyph arrow={arrow} />}
    </SmartLink>
  );
}

/** Content `Action` → `Button`. Actions without `href` (e.g. resume before the PDF exists) render nothing. */
export function ActionButton({
  action,
  size,
  className,
}: {
  action: Action;
  size?: ButtonSize;
  className?: string;
}) {
  if (!action.href) return null;
  return (
    <Button
      href={action.href}
      variant={action.variant}
      size={size}
      arrow={action.arrow}
      className={className}
    >
      {action.label}
    </Button>
  );
}

/** Row of actions, 12px gap, wrapping. Renders nothing when every action is hidden. */
export function ActionRow({
  actions,
  size,
  className,
}: {
  actions: Action[];
  size?: ButtonSize;
  className?: string;
}) {
  const visible = actions.filter((a) => a.href);
  if (visible.length === 0) return null;
  return (
    <div className={cx("flex flex-wrap items-center gap-3", className)}>
      {visible.map((a) => (
        <ActionButton key={a.label} action={a} size={size} />
      ))}
    </div>
  );
}

// ── StatusBadge ─────────────────────────────────────────────────────────────

const statusDot: Record<StatusKind, string> = {
  live: "bg-ok",
  beta: "bg-info",
  progress: "bg-warn",
  dev: "bg-muted",
};

/** 7px dot + label; colour is never the only signal. */
export function StatusBadge({ kind, children }: { kind: StatusKind; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-medium">
      <span aria-hidden="true" className={cx("size-[7px] shrink-0 rounded-full", statusDot[kind])} />
      {children}
    </span>
  );
}

// ── Definition lists ────────────────────────────────────────────────────────

/**
 * Facts grid (hero facts, case-study meta): auto-fit columns ≥ 200px, each item with a
 * 1px top rule, a mono label and a 15px/500 value.
 */
export function MetaList({
  items,
  variant = "hero",
  className,
}: {
  items: Fact[];
  /** `hero`: 14px top padding + 16px bottom margin. `caseStudy`: 14px padding top and bottom. */
  variant?: "hero" | "caseStudy";
  className?: string;
}) {
  return (
    <dl className={cx("grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-8", className)}>
      {items.map((f) => (
        <div
          key={f.label}
          className={cx(
            "border-t border-border pt-3.5",
            variant === "hero" ? "mb-4" : "pb-3.5",
          )}
        >
          <dt className="font-mono text-label text-muted">{f.label}</dt>
          <dd className="mt-1 text-ui font-medium">
            {f.href ? (
              <TextLink href={f.href} aria-label={`${f.label}: ${f.value}`}>
                {f.value}
              </TextLink>
            ) : (
              f.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export type DefinitionRow = { label: string; value: ReactNode };

/** Two-column label/value list (project rows: 88px, About: 110px). Rows with an empty value are skipped. */
export function DefinitionRows({
  rows,
  labelWidth = 88,
  className,
}: {
  rows: DefinitionRow[];
  labelWidth?: number;
  className?: string;
}) {
  return (
    <dl
      className={cx("grid gap-x-4 gap-y-2.5", className)}
      style={{ gridTemplateColumns: `${labelWidth}px 1fr` }}
    >
      {rows
        .filter((r) => r.value !== undefined && r.value !== null && r.value !== "")
        .map((r) => (
          <div key={r.label} className="contents">
            <dt className="text-muted">{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
    </dl>
  );
}

// ── RuleList ────────────────────────────────────────────────────────────────

/**
 * List whose items each carry a 1px top rule and 14px vertical padding.
 * `minColumn` turns it into an auto-fit grid (e.g. 300px → two columns on desktop).
 */
export function RuleList({
  children,
  minColumn,
  columnGap = 48,
  as: Tag = "ul",
  className,
}: {
  children: ReactNode;
  minColumn?: number;
  columnGap?: number;
  as?: "ul" | "ol" | "div";
  className?: string;
}) {
  return (
    <Tag
      className={cx("m-0 list-none p-0", minColumn ? "grid" : undefined, className)}
      style={
        minColumn
          ? {
              gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumn}px, 100%), 1fr))`,
              columnGap,
            }
          : undefined
      }
    >
      {children}
    </Tag>
  );
}

export function RuleItem({
  children,
  as: Tag = "li",
  className,
}: {
  children: ReactNode;
  as?: "li" | "div";
  className?: string;
}) {
  return <Tag className={cx("border-t border-border py-3.5", className)}>{children}</Tag>;
}
