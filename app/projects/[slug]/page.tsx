import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article, CaseStudyMedia, NextProjectLink, StackLine } from "@/components/case-study";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Section } from "@/components/layout";
import { Toc } from "@/components/toc";
import { Button, MetaList, TextLink } from "@/components/ui";
import { labels } from "@/content/site";
import { getCaseStudy, getCaseStudyStaticSlugs, getNextProject } from "@/lib/projects";

/** Only projects with an MDX case study get a page (while switched on); any other slug 404s. */
export function generateStaticParams() {
  return getCaseStudyStaticSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: cs.project.name,
    description: cs.meta.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: cs.project.name, description: cs.meta.summary, url: `/projects/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) notFound();
  const { project, meta, toc, Content } = cs;
  const next = getNextProject(project.slug);
  const ctas = project.links.filter((l) => l.href);

  return (
    <>
      <Header current="projects" mobileThemeToggle={false} />
      <main>
        <Section spacing="caseStudy">
          <TextLink href="/projects" variant="muted" arrow="←" className="text-small">
            {labels.allProjects}
          </TextLink>
          <p className="mt-[clamp(32px,4vw,56px)] font-mono text-meta text-muted">
            {labels.caseStudyEyebrow} · {project.platform}
          </p>
          <h1 className="mt-3 font-serif text-cs-title font-normal">{project.name}</h1>
          <p className="mt-5 max-w-[28em] font-serif text-cs-summary text-pretty text-muted">
            {meta.summary}
          </p>
          {ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((l, i) => (
                <Button
                  key={l.kind}
                  href={l.href!}
                  variant={i === 0 ? "primary" : "secondary"}
                  size="md"
                  arrow="↗"
                >
                  {l.ctaLabel ?? l.label}
                </Button>
              ))}
            </div>
          )}
          <MetaList items={meta.facts} variant="caseStudy" className="mt-[clamp(40px,5vw,64px)]" />
          {meta.stack.length > 0 && <StackLine items={meta.stack} className="mt-1" />}
        </Section>

        <Section spacing="caseStudyMedia" label={labels.screenshots}>
          <CaseStudyMedia frame={project.frame} hero={meta.hero} gallery={meta.gallery} />
        </Section>

        <Section
          spacing="caseStudyBody"
          className="flex items-start gap-[clamp(40px,8vw,120px)]"
          label={labels.caseStudyEyebrow}
        >
          <Toc entries={toc} />
          <Article>
            <Content />
          </Article>
        </Section>

        <Section spacing="caseStudyEnd" label={labels.nextProject}>
          {next && <NextProjectLink next={next} />}
          <Footer variant="caseStudy" />
        </Section>
      </main>
    </>
  );
}
