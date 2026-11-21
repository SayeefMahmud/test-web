import type { ComponentType } from "react";
import type { HomeSection, HomeSectionComponent } from "@/content/home";
import {
  about,
  achievements,
  competitiveProgramming,
  contact,
  experience,
  hero,
  moreProjects,
  site,
  stack,
} from "@/content/site";
import { getProjects } from "@/lib/projects";
import {
  AchievementList,
  EarlierList,
  EmailLink,
  ExperienceList,
  MoreProjectRows,
  Prose,
  StackRows,
  Subheading,
} from "./blocks";
import { Footer } from "./footer";
import { IconLinks } from "./icon-links";
import { Section, SectionHeader } from "./layout";
import { Portrait } from "./media";
import { ProjectList } from "./project-row";
import { ActionRow, DefinitionRows, MetaList } from "./ui";

// One component per `HomeSectionComponent` name in `content/home.ts`. Each receives its registry
// entry (id, title, action) and reads its copy from `content/`. To add a section: write a
// component here, add it to `homeSectionComponents`, then add an entry to `homeSections`.

type SectionComponentProps = { section: HomeSection };

/** Page-load fade-in: opacity 0→1, 8px rise, 500ms ease-out, 60ms stagger (README › Motion). */
const rise = (step: number) => ({ animationDelay: `${step * 60}ms` });

function Hero({ section }: SectionComponentProps) {
  return (
    <Section id={section.id} spacing="hero">
      {/* Mobile: a 2-column grid — round portrait beside the eyebrow, everything else full width
          (the text column is `display: contents` so its children join the grid).
          From md: text column + 340px portrait side by side, as in the design. */}
      <div className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-4 md:flex md:flex-wrap md:items-end md:gap-[clamp(32px,5vw,80px)]">
        <div className="contents md:block md:min-w-0 md:flex-[1_1_600px]">
          <p
            style={rise(0)}
            className="col-start-2 row-start-1 animate-rise-in font-mono text-meta text-muted"
          >
            {hero.eyebrow.map((part, i) => (
              <span key={part}>
                {i > 0 && <span className="hidden md:inline"> · </span>}
                <span className="block md:inline">{part}</span>
              </span>
            ))}
          </p>
          <h1
            style={rise(1)}
            className="col-span-2 mt-5 animate-rise-in font-serif text-display font-normal md:max-w-[17em] md:text-balance"
          >
            {hero.headline}
          </h1>
          <p
            style={rise(2)}
            className="col-span-2 mt-7 animate-rise-in text-lead text-muted md:max-w-[36em] md:text-pretty"
          >
            {hero.lead}
          </p>
          <div
            style={rise(3)}
            className="col-span-2 mt-9 flex animate-rise-in flex-wrap items-center gap-x-3 gap-y-2"
          >
            <ActionRow actions={hero.actions} size="md" />
            {/* Profile icons; a hairline separates them from the button when there is one. */}
            <IconLinks
              links={hero.profiles}
              className={
                hero.actions.length > 0
                  ? "border-l border-border pl-3"
                  : undefined
              }
            />
          </div>
        </div>
        {/* One image for both layouts: 72px circle beside the eyebrow below md, 340px 4:5 column on the right from md. */}
        <Portrait
          src={site.portrait}
          alt={hero.portraitAlt}
          preload
          sizes="(min-width: 768px) 340px, 72px"
          frameClassName="aspect-square rounded-full md:aspect-[4/5] md:rounded-photo"
          imageClassName="object-[50%_20%] md:object-center"
          className="col-start-1 row-start-1 w-[72px] md:w-auto md:min-w-[260px] md:flex-[0_1_340px]"
        />
      </div>
      <MetaList items={hero.facts} className="mt-[clamp(48px,6vw,88px)]" />
    </Section>
  );
}

function SelectedProjects({ section }: SectionComponentProps) {
  return (
    <Section
      id={section.id}
      spacing="projects"
      label={section.title ? undefined : section.nav}
    >
      {section.title && (
        <SectionHeader title={section.title} action={section.action} />
      )}
      <ProjectList projects={getProjects()} />
    </Section>
  );
}

function MoreProjects({ section }: SectionComponentProps) {
  return (
    <Section id={section.id} label={moreProjects.title}>
      <Subheading className="mb-3">{moreProjects.title}</Subheading>
      <MoreProjectRows items={moreProjects.items} />
    </Section>
  );
}

function Experience({ section }: SectionComponentProps) {
  return (
    <Section id={section.id}>
      {section.title && <SectionHeader title={section.title} />}
      <ExperienceList entries={experience.entries} />
      {experience.earlier.length > 0 && (
        <>
          <Subheading className="mt-10 mb-1">
            {experience.earlierTitle}
          </Subheading>
          <EarlierList entries={experience.earlier} />
        </>
      )}
    </Section>
  );
}

function Stack({ section }: SectionComponentProps) {
  return (
    <Section id={section.id}>
      {section.title && <SectionHeader title={section.title} />}
      <StackRows groups={stack} />
    </Section>
  );
}

function CompetitiveProgramming({ section }: SectionComponentProps) {
  const cp = competitiveProgramming;
  return (
    <Section id={section.id}>
      {section.title && <SectionHeader title={section.title} />}
      <MetaList items={cp.facts} />
      {cp.results.length > 0 && (
        <>
          <Subheading className="mt-10 mb-1">{cp.resultsTitle}</Subheading>
          <AchievementList items={cp.results} />
        </>
      )}
      {cp.problemSetting.length > 0 && (
        <>
          <Subheading className="mt-10 mb-1">
            {cp.problemSettingTitle}
          </Subheading>
          <AchievementList items={cp.problemSetting} />
        </>
      )}
      {cp.teaching.length > 0 && (
        <>
          <Subheading className="mt-10 mb-1">{cp.teachingTitle}</Subheading>
          <EarlierList entries={cp.teaching} />
        </>
      )}
    </Section>
  );
}

function Achievements({ section }: SectionComponentProps) {
  return (
    <Section id={section.id}>
      {section.title && <SectionHeader title={section.title} />}
      <AchievementList items={achievements} />
    </Section>
  );
}

function About({ section }: SectionComponentProps) {
  return (
    <Section id={section.id}>
      <div className="flex flex-wrap items-start gap-[clamp(32px,6vw,96px)]">
        <Portrait
          src={site.portrait}
          alt={about.portraitAlt}
          sizes="(min-width: 768px) 320px, 100vw"
          // Below md: full-width 4:3 crop, kept near the top so the face and hair stay in frame.
          frameClassName="aspect-[4/3] rounded-photo md:aspect-[4/5]"
          imageClassName="object-top md:object-center"
          className="w-full md:w-auto md:min-w-[240px] md:flex-[0_1_320px]"
        />
        <div className="flex-[1_1_420px]">
          {section.title && <SectionHeader title={section.title} />}
          <Prose paragraphs={about.paragraphs} />
          <DefinitionRows
            rows={about.facts}
            labelWidth={110}
            className="mt-7 text-ui"
          />
        </div>
      </div>
    </Section>
  );
}

function Contact({ section }: SectionComponentProps) {
  return (
    <Section id={section.id} spacing="contact">
      {/* Headline left, email + links right on wide screens; stacked below lg. */}
      {/* last-baseline: the right column's last line sits on the headline's last baseline. */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-baseline-last lg:gap-16">
        {section.title && (
          <SectionHeader
            title={section.title}
            size="contact"
            className="lg:mb-0!"
          />
        )}
        <div className="lg:col-start-2 lg:flex lg:flex-col lg:items-end">
          <EmailLink email={site.email} />
          <ActionRow
            actions={contact.actions}
            size="contact"
            className="mt-8 lg:mt-5"
          />
        </div>
      </div>
      <Footer />
    </Section>
  );
}

export const homeSectionComponents: Record<
  HomeSectionComponent,
  ComponentType<SectionComponentProps>
> = {
  Hero,
  SelectedProjects,
  MoreProjects,
  Experience,
  Stack,
  CompetitiveProgramming,
  Achievements,
  About,
  Contact,
};
