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
      <div className="flex flex-wrap items-end gap-[clamp(32px,5vw,80px)]">
        <div className="min-w-0 flex-[1_1_600px]">
          <p style={rise(0)} className="animate-rise-in font-mono text-meta text-muted">
            {hero.eyebrow}
          </p>
          <h1
            style={rise(1)}
            className="mt-5 max-w-[17em] animate-rise-in font-serif text-display font-normal text-balance"
          >
            {hero.headline}
          </h1>
          <p
            style={rise(2)}
            className="mt-7 max-w-[36em] animate-rise-in text-lead text-pretty text-muted"
          >
            {hero.lead}
          </p>
          <div style={rise(3)} className="animate-rise-in">
            <ActionRow actions={hero.actions} className="mt-9" />
          </div>
        </div>
        {/* One image for both layouts: 148px above the text below md, 340px column on the right from md. */}
        <Portrait
          src={site.portrait}
          alt={hero.portraitAlt}
          preload
          sizes="(min-width: 768px) 340px, 148px"
          className="order-first w-[148px] md:order-none md:w-auto md:min-w-[260px] md:flex-[0_1_340px]"
        />
      </div>
      <MetaList items={hero.facts} className="mt-[clamp(48px,6vw,88px)]" />
    </Section>
  );
}

function SelectedProjects({ section }: SectionComponentProps) {
  return (
    <Section id={section.id} spacing="projects" label={section.title ? undefined : section.nav}>
      {section.title && <SectionHeader title={section.title} action={section.action} />}
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
          <Subheading className="mt-10 mb-1">{experience.earlierTitle}</Subheading>
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
          <Subheading className="mt-10 mb-1">{cp.problemSettingTitle}</Subheading>
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
          className="min-w-[240px] flex-[0_1_320px]"
        />
        <div className="max-w-[640px] flex-[1_1_420px]">
          {section.title && <SectionHeader title={section.title} />}
          <Prose paragraphs={about.paragraphs} />
          <DefinitionRows rows={about.facts} labelWidth={110} className="mt-7 text-ui" />
        </div>
      </div>
    </Section>
  );
}

function Contact({ section }: SectionComponentProps) {
  return (
    <Section id={section.id} spacing="contact">
      {section.title && <SectionHeader title={section.title} size="contact" />}
      <EmailLink email={site.email} />
      <ActionRow actions={contact.actions} size="md" className="mt-8" />
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
