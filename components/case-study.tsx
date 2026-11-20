import { cacheLife } from "next/cache";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { codeToHtml, createCssVariablesTheme } from "shiki";
import type { ArchitectureDiagramProps, Frame, Item, Result, Shot } from "@/content/types";
import { labels } from "@/content/site";
import type { NextProject } from "@/lib/projects";
import { cx } from "./layout";
import { DeviceFrame, GalleryTile } from "./media";

// Case-study blocks. The MDX ones (FeatureList, ArchitectureDiagram, Results, CodeBlock)
// are registered in `mdx-components.tsx`; the rest are used by the page template.

/** "Stack" mono label followed by items separated by a border2 "/". */
export function StackLine({ items, className }: { items: string[]; className?: string }) {
  return (
    <p className={cx("border-t border-border pt-3.5 text-ui", className)}>
      <span className="mr-4 font-mono text-label text-muted">{labels.stack}</span>
      {items.map((s) => (
        <span key={s} className="mr-1.5">
          {s}{" "}
          <span aria-hidden="true" className="text-border2">
            /
          </span>
        </span>
      ))}
    </p>
  );
}

/** Hero screenshot on a sunk panel, then a gallery of tiles (auto-fit ≥ 220px). */
export function CaseStudyMedia({
  frame,
  hero,
  gallery = [],
}: {
  frame: Frame;
  hero: Shot;
  gallery?: Shot[];
}) {
  return (
    <>
      <div className="rounded-[14px] bg-sunk p-[clamp(16px,4vw,56px)]">
        <DeviceFrame
          frame={frame}
          shot={hero}
          context="hero"
          sizes="(min-width: 1280px) 1008px, 100vw"
        />
      </div>
      {gallery.length > 0 && (
        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {gallery.map((g) => (
            <GalleryTile key={g.label} shot={g} />
          ))}
        </div>
      )}
    </>
  );
}

/** Article column: max 680px, 18px text. MDX element styles live in `mdx-components.tsx`. */
export function Article({ children }: { children: ReactNode }) {
  return <article className="max-w-[680px] min-w-0 flex-auto text-[18px]">{children}</article>;
}

/** MDX `<FeatureList>`: two-column list (≥ 260px), 16px, title + muted description. */
export function FeatureList({ items }: { items: Item[] }) {
  return (
    <ul className="m-0 mt-5 grid list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-8 p-0 text-body">
      {items.map((f) => (
        <li key={f.title} className="border-t border-border py-3.5">
          <strong className="font-semibold">{f.title}</strong>
          <br />
          <span className="text-muted">{f.description}</span>
        </li>
      ))}
    </ul>
  );
}

/** MDX `<ArchitectureDiagram>`: the request path (→), external services dashed below, caption. */
export function ArchitectureDiagram({
  flow,
  primary,
  services = [],
  caption,
}: ArchitectureDiagramProps) {
  return (
    <figure className="m-0 mt-6 rounded-xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-center text-small">
        {flow.map((node, i) => (
          <span key={node} className="contents">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted">
                →
              </span>
            )}
            <span
              className={cx(
                "rounded-control border px-3.5 py-2.5",
                i === primary ? "border-fg font-semibold" : "border-border2",
              )}
            >
              {node}
            </span>
          </span>
        ))}
      </div>
      {services.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2.5 text-meta text-muted">
          {services.map((s) => (
            <span key={s} className="rounded-control border border-dashed border-border2 px-2.5 py-1.5">
              {s}
            </span>
          ))}
        </div>
      )}
      {caption && (
        <figcaption className="mt-4 text-center text-meta text-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

/** MDX `<Results>`: big Newsreader figures over muted labels, each under a 1px fg rule. */
export function Results({ items }: { items: Result[] }) {
  return (
    <dl className="m-0 mt-5 grid grid-cols-3 gap-4">
      {items.map((r) => (
        <div key={r.label} className="flex flex-col-reverse justify-end border-t border-fg pt-3">
          <dt className="mt-1 text-small text-muted">{r.label}</dt>
          <dd className="m-0 font-serif text-[clamp(28px,3vw,40px)] leading-[1.1]">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ── Code ────────────────────────────────────────────────────────────────────

/**
 * Shiki theme whose colours are CSS variables (`--shiki-*`, defined in globals.css),
 * so code follows the `--code` / `--code-fg` tokens in both themes.
 */
const codeTheme = createCssVariablesTheme({
  name: "site",
  variablePrefix: "--shiki-",
  fontStyle: false,
});

/** Shiki HTML for a snippet. Cached (`"use cache"`): Shiki reads the clock, which is not allowed while prerendering. */
async function highlight(code: string, lang: string): Promise<string> {
  "use cache";
  cacheLife("max"); // Same input, same output: never revalidate.
  try {
    return await codeToHtml(code, { lang, theme: codeTheme });
  } catch {
    // Unknown language: plain text.
    return codeToHtml(code, { lang: "text", theme: codeTheme });
  }
}

/** Highlighted at build time: bg `--code`, text `--code-fg`, radius 12, scrolls horizontally. */
export async function CodeBlock({ code, lang = "text" }: { code: string; lang?: string }) {
  const html = await highlight(code.replace(/\n$/, ""), lang);
  return (
    <div
      className="code-block mt-7 overflow-hidden rounded-xl bg-code text-code-fg [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:px-[22px] [&_pre]:py-5 [&_pre]:font-mono [&_pre]:text-[13.5px] [&_pre]:leading-[1.65]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Next project ────────────────────────────────────────────────────────────

/** Full-width link to the next project, 1px fg top rule; turns accent on hover. */
export function NextProjectLink({ next }: { next: NextProject }) {
  return (
    <NextLink
      href={next.href}
      className="flex flex-wrap items-end justify-between gap-4 border-t border-fg pt-7 no-underline transition-colors duration-150 ease-out hover:text-accent"
    >
      <span>
        <span className="block font-mono text-meta text-muted">{labels.nextProject}</span>
        <span className="mt-2 block font-serif text-[clamp(40px,5vw,72px)] leading-none">
          {next.project.name}
        </span>
        <span className="mt-2 block text-muted">{next.summary}</span>
      </span>
      <span aria-hidden="true" className="text-[32px]">
        →
      </span>
    </NextLink>
  );
}
