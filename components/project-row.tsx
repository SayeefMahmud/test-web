import NextLink from "next/link";
import type { Project } from "@/content/types";
import { labels } from "@/content/site";
import { getCaseStudyHref } from "@/lib/projects";
import { cx } from "./layout";
import { DeviceFrame, ScreenBackdrop } from "./media";
import { ProjectMedia } from "./project-media";
import { ShipViewer } from "./ship-viewer";
import { DefinitionRows, StatusBadge, TextLink } from "./ui";

type ProjectRowProps = {
  project: Project;
  /** Position in the list: drives the "01" number and the side the media sits on (odd → right). */
  index: number;
  /** Heading level of the project name (H3 under a section H2). */
  headingLevel?: "h2" | "h3";
};

// Size container: a frame can fit itself to the panel's content box (cqw / cqh).
const mediaPanel =
  "box-border flex aspect-[4/3] min-w-0 flex-[1_1_520px] items-center justify-center rounded-[14px] bg-sunk p-[7%] [container-type:size]";

/** One selected project: media panel in a device frame + text, alternating sides by index. */
export function ProjectRow({ project: p, index, headingLevel: Heading = "h3" }: ProjectRowProps) {
  const caseStudy = getCaseStudyHref(p.slug);
  const screenshot = <DeviceFrame frame={p.frame} shot={p.shot} />;
  const frame = p.model ? (
    <ProjectMedia
      screenshot={screenshot}
      model={
        <DeviceFrame
          frame={p.frame}
          shot={p.shot}
          screen={
            <>
              <ScreenBackdrop shot={p.shot} />
              <ShipViewer
                src={p.model.src}
                label={p.model.label}
                hint={labels.mediaView.hint}
                loadingLabel={labels.mediaView.loading}
                failedLabel={labels.mediaView.failed}
              />
            </>
          }
        />
      }
      labels={labels.mediaView}
    />
  ) : (
    screenshot
  );
  const links = [
    ...p.links.flatMap((l) => (l.href ? [{ label: l.label, href: l.href, arrow: "↗" as const }] : [])),
    ...(caseStudy ? [{ label: labels.caseStudyLink, href: caseStudy, arrow: "→" as const }] : []),
  ];

  return (
    <article
      id={p.slug}
      className={cx(
        "flex scroll-mt-24 flex-wrap items-center gap-[clamp(28px,5vw,72px)]",
        index % 2 === 1 && "flex-row-reverse",
      )}
    >
      {/* A panel with a 3D switch holds buttons, so it can't also be a link. */}
      {caseStudy && !p.model ? (
        // Mouse shortcut only: the "Case study" text link below is the accessible route,
        // so the media isn't a second tab stop with a mismatched name.
        <NextLink
          href={caseStudy}
          tabIndex={-1}
          aria-hidden="true"
          className={cx(
            mediaPanel,
            "no-underline transition-transform duration-400 ease-lift hover:-translate-y-1",
          )}
        >
          {frame}
        </NextLink>
      ) : (
        <div className={cx(mediaPanel, p.model && "flex-col gap-3")}>{frame}</div>
      )}

      <div className="min-w-0 flex-[1_1_340px]">
        <p className="font-mono text-meta text-muted">
          {String(index + 1).padStart(2, "0")} · {p.platform}
        </p>
        <Heading className="mt-2.5 font-serif text-project font-normal">{p.name}</Heading>
        <p className="mt-3.5 text-[17px] text-pretty">{p.summary}</p>
        <DefinitionRows
          className="mt-6 text-small"
          rows={[
            {
              label: labels.projectFacts.status,
              value: <StatusBadge kind={p.statusKind}>{p.status}</StatusBadge>,
            },
            { label: labels.projectFacts.devices, value: p.devices },
            { label: labels.projectFacts.stack, value: p.tech.join(" · ") },
          ]}
        />
        {links.length > 0 && (
          <ul className="m-0 mt-6 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-ui font-medium">
            {links.map((l) => (
              <li key={l.label}>
                <TextLink
                  href={l.href}
                  arrow={l.arrow}
                  aria-label={`${p.name} ${l.label}`}
                >
                  {l.label}
                </TextLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/** Stack of project rows, clamp(64px, 8vw, 128px) apart. */
export function ProjectList({
  projects,
  headingLevel,
  className,
}: {
  projects: Project[];
  headingLevel?: ProjectRowProps["headingLevel"];
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-[clamp(64px,8vw,128px)]", className)}>
      {projects.map((p, i) => (
        <ProjectRow key={p.slug} project={p} index={i} headingLevel={headingLevel} />
      ))}
    </div>
  );
}
