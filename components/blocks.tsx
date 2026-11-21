import type {
  Achievement,
  EarlierEntry,
  ExperienceEntry as ExperienceEntryData,
  ExperienceProject as ExperienceProjectData,
  MoreProject,
  Paragraph,
  SkillGroup,
} from "@/content/types";
import { cx } from "./layout";
import { RuleItem, RuleList, TextLink } from "./ui";

// Content blocks for the home sections. Each renders one typed list from `content/`.

/** Small 15px/600 subheading ("More projects", "Earlier"). */
export function Subheading({
  children,
  level: Tag = "h3",
  className,
}: {
  children: string;
  level?: "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag className={cx("text-ui font-semibold", className)}>{children}</Tag>
  );
}

/** Name on the left, type muted on the right, 1px top rules. */
export function MoreProjectRows({ items }: { items: MoreProject[] }) {
  return (
    <RuleList>
      {items.map((x) => (
        <RuleItem key={x.name} className="flex justify-between gap-4 text-ui">
          {x.href ? (
            <TextLink href={x.href} variant="underline">
              {x.name}
            </TextLink>
          ) : (
            <span>{x.name}</span>
          )}
          <span className="flex-none text-muted">{x.type}</span>
        </RuleItem>
      ))}
    </RuleList>
  );
}

/** Mono tech list, "A · B · C". Hidden when empty. */
function TechLine({ tech }: { tech?: string[] }) {
  if (!tech?.length) return null;
  return (
    <p className="mt-3 font-mono text-meta text-muted">{tech.join(" · ")}</p>
  );
}

/** A project under a role: name with its dates, context, summary, tech. Projects after the first sit under a 1px rule. */
function ExperienceProjectItem({
  project: p,
}: {
  project: ExperienceProjectData;
}) {
  return (
    <li className="mt-6 border-t border-border pt-6 first:mt-5 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <h4 className="font-semibold">{p.name}</h4>
        <p className="font-mono text-meta text-muted">{p.time}</p>
      </div>
      <p className="mt-0.5 text-ui text-muted">{p.context}</p>
      <p className="mt-3 text-pretty">{p.summary}</p>
      <TechLine tech={p.tech} />
    </li>
  );
}

/** 220px meta column (dates, employer) + full-width content column: role, then its projects. */
export function ExperienceEntry({ entry: e }: { entry: ExperienceEntryData }) {
  return (
    <li className="flex flex-wrap gap-x-[clamp(24px,4vw,64px)] gap-y-2 border-t border-border py-7">
      <div className="flex-[0_0_220px]">
        <p className="font-mono text-meta text-muted">{e.time}</p>
        <p className="mt-1 font-medium">{e.org}</p>
      </div>
      <div className="min-w-0 flex-[1_1_420px]">
        <h3 className="text-h3 font-semibold">{e.role}</h3>
        {e.context && <p className="mt-0.5 text-ui text-muted">{e.context}</p>}
        {e.summary && <p className="mt-3 text-pretty">{e.summary}</p>}
        <TechLine tech={e.tech} />
        {e.projects && e.projects.length > 0 && (
          <ul className="m-0 list-none p-0">
            {e.projects.map((p) => (
              <ExperienceProjectItem key={p.name} project={p} />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function ExperienceList({
  entries,
}: {
  entries: ExperienceEntryData[];
}) {
  return (
    <ol className="m-0 list-none p-0">
      {entries.map((e) => (
        <ExperienceEntry key={`${e.org}-${e.time}`} entry={e} />
      ))}
    </ol>
  );
}

/** Compact row: dates (mono) | **role**, org · muted description. */
export function EarlierRow({ entry: e }: { entry: EarlierEntry }) {
  return (
    <li className="flex flex-wrap gap-x-[clamp(24px,4vw,64px)] gap-y-1 border-t border-border py-3.5 text-ui">
      <span className="flex-[0_0_220px] pt-0.5 font-mono text-meta text-muted">
        {e.time}
      </span>
      <span className="flex-[1_1_420px]">
        <strong className="font-semibold">{e.role}</strong>, {e.org}{" "}
        <span className="text-muted">· {e.description}</span>
      </span>
    </li>
  );
}

export function EarlierList({ entries }: { entries: EarlierEntry[] }) {
  return (
    <ul className="m-0 list-none p-0">
      {entries.map((e) => (
        <EarlierRow key={`${e.role}-${e.org}`} entry={e} />
      ))}
    </ul>
  );
}

/** Category (600, 220px) | muted comma-separated items. No chips, logos or bars. */
export function StackRows({ groups }: { groups: SkillGroup[] }) {
  return (
    <RuleList as="div">
      {groups.map((g) => (
        <RuleItem
          as="div"
          key={g.category}
          className="flex flex-wrap gap-x-[clamp(24px,4vw,64px)] gap-y-0.5 text-ui"
        >
          <h3 className="flex-[0_0_220px] font-semibold">{g.category}</h3>
          <p className="flex-[1_1_420px] text-muted">{g.items.join(", ")}</p>
        </RuleItem>
      ))}
    </RuleList>
  );
}

/** Title 600, muted detail below, year right-aligned in mono. */
export function AchievementItem({ item: a }: { item: Achievement }) {
  return (
    <RuleItem className="flex justify-between gap-4 text-ui">
      <span>
        <strong className="font-semibold">{a.title}</strong>
        <br />
        <span className="text-muted">{a.detail}</span>
      </span>
      {a.year && (
        <span className="flex-none pt-0.5 font-mono text-meta text-muted">
          {a.year}
        </span>
      )}
    </RuleItem>
  );
}

export function AchievementList({ items }: { items: Achievement[] }) {
  return (
    <RuleList minColumn={320}>
      {items.map((a) => (
        <AchievementItem key={a.title} item={a} />
      ))}
    </RuleList>
  );
}

/** 18px paragraphs (About), 16px apart. The heading above supplies the top gap. */
export function Prose({
  paragraphs,
  className,
}: {
  paragraphs: Paragraph[];
  className?: string;
}) {
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p
          key={p.text}
          className={cx(
            "text-[18px] text-pretty",
            i > 0 && "mt-4",
            p.muted && "text-muted",
          )}
        >
          {p.text}
        </p>
      ))}
    </div>
  );
}

/** Contact email as a large Newsreader accent link: 1px underline at 8px, 2px on hover. */
export function EmailLink({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className={cx(
        "hit-area inline-block font-serif text-[clamp(24px,2.4vw,34px)] text-accent [overflow-wrap:anywhere] underline decoration-1 underline-offset-8 transition-[text-decoration-thickness] duration-150 ease-out hover:decoration-2",
        className,
      )}
    >
      {email}
    </a>
  );
}
