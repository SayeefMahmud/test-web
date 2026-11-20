import { Header } from "@/components/header";
import { homeSectionComponents } from "@/components/home-sections";
import { homeSections } from "@/content/home";

/** Home: the sections listed in `content/home.ts`, in order. */
export default function Home() {
  return (
    <>
      <Header />
      <main>
        {homeSections.map((section) => {
          const Component = homeSectionComponents[section.component];
          return <Component key={section.id} section={section} />;
        })}
      </main>
    </>
  );
}
