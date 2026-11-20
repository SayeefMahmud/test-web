import type {
  Achievement,
  EarlierEntry,
  ExperienceEntry as ExperienceEntryData,
  MoreProject,
  Paragraph,
  SkillGroup,
  Step,
  Tool,
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
  return <Tag className={cx("text-ui font-semibold", className)}>{children}</Tag>;
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

/** 220px meta column (dates, employer) + content column (max 680px). */
export function ExperienceEntry({ entry: e }: { entry: ExperienceEntryData }) {
  return (
    <li className="flex flex-wrap gap-x-[clamp(24px,4vw,64px)] gap-y-2 border-t border-border py-7">
      <div className="flex-[0_0_220px]">
        <p className="font-mono text-meta text-muted">{e.time}</p>
        <p className="mt-1 font-medium">{e.org}</p>
      </div>
      <div className="max-w-[680px] min-w-0 flex-[1_1_420px]">
        <h3 className="text-h3 font-semibold">{e.role}</h3>
        <p className="mt-0.5 text-ui text-muted">{e.context}</p>
        <p className="mt-3 text-pretty">{e.summary}</p>
        {e.tech.length > 0 && (
          <p className="mt-3 font-mono text-meta text-muted">{e.tech.join(" · ")}</p>
        )}
      </div>
    </li>
  );
}

export function ExperienceList({ entries }: { entries: ExperienceEntryData[] }) {
  return (
    <ol className="m-0 list-none p-0">
      {entries.map((e) => (
        <ExperienceEntry key={`${e.time}-${e.context}`} entry={e} />
      ))}
    </ol>
  );
}

/** Compact row: dates (mono) | **role**, org · muted description. */
export function EarlierRow({ entry: e }: { entry: EarlierEntry }) {
  return (
    <li className="flex flex-wrap gap-x-[clamp(24px,4vw,64px)] gap-y-1 border-t border-border py-3.5 text-ui">
      <span className="flex-[0_0_220px] pt-0.5 font-mono text-meta text-muted">{e.time}</span>
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

/** Numbered steps (01, 02, …), auto-fit columns ≥ 240px, each under a 1px fg rule. */
export function StepList({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol
      className={cx(
        "m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 p-0",
        className,
      )}
    >
      {steps.map((s, i) => (
        <li key={s.title} className="border-t border-fg pt-4">
          <span className="font-mono text-meta text-muted">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-1.5 font-serif text-[26px] leading-[1.2] font-normal">{s.title}</h3>
          <p className="mt-2.5 text-ui text-pretty text-muted">{s.description}</p>
        </li>
      ))}
    </ol>
  );
}

/** "**Title.** muted description" rows in two columns (≥ 300px). `highlight` colours the title accent. */
export function ToolList({ tools, className }: { tools: Tool[]; className?: string }) {
  return (
    <RuleList minColumn={300} className={className}>
      {tools.map((t) => (
        <RuleItem key={t.title} className="text-ui">
          <strong className={cx("font-semibold", t.highlight && "text-accent")}>{t.title}.</strong>{" "}
          <span className="text-muted">{t.description}</span>
        </RuleItem>
      ))}
    </RuleList>
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
        <span className="flex-none pt-0.5 font-mono text-meta text-muted">{a.year}</span>
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

/** 18px paragraphs (About). The first sits 20px below the heading, the rest 16px apart. */
export function Prose({ paragraphs, className }: { paragraphs: Paragraph[]; className?: string }) {
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p
          key={p.text}
          className={cx("text-[18px] text-pretty", i === 0 ? "mt-5" : "mt-4", p.muted && "text-muted")}
        >
          {p.text}
        </p>
      ))}
    </div>
  );
}

/** Contact email as a large Newsreader accent link: 1px underline at 8px, 2px on hover. */
export function EmailLink({ email, className }: { email: string; className?: string }) {
  return (
    <a
      href={`mailto:${email}`}
      className={cx(
        "inline-block font-serif text-[clamp(24px,2.4vw,34px)] text-accent [overflow-wrap:anywhere] underline decoration-1 underline-offset-8 transition-[text-decoration-thickness] duration-150 ease-out hover:decoration-2",
        className,
      )}
    >
      {email}
    </a>
  );
}
