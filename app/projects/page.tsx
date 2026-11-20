import type { Metadata } from "next";
import { MoreProjectRows, Subheading } from "@/components/blocks";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Section } from "@/components/layout";
import { ProjectList } from "@/components/project-row";
import { moreProjects, projectsPage } from "@/content/site";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: projectsPage.title,
  description: projectsPage.description,
  alternates: { canonical: "/projects" },
  openGraph: { title: projectsPage.title, description: projectsPage.description, url: "/projects" },
};

/** Every selected project (same `ProjectRow` as Home, names as H2 under the page H1), then the smaller ones. */
export default function ProjectsPage() {
  return (
    <>
      <Header current="projects" />
      <main>
        <Section spacing="caseStudy">
          <h1 className="font-serif text-cs-title font-normal">{projectsPage.title}</h1>
          <ProjectList
            projects={getProjects()}
            headingLevel="h2"
            className="mt-[clamp(40px,5vw,72px)]"
          />
        </Section>

        <Section spacing="compact" className="pb-[clamp(48px,6vw,80px)]" label={moreProjects.title}>
          <Subheading level="h2" className="mb-3">{moreProjects.title}</Subheading>
          <MoreProjectRows items={moreProjects.items} />
          <Footer />
        </Section>
      </main>
    </>
  );
}
