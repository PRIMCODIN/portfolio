import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Now } from "@/components/sections/Now";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { Seo } from "@/components/ui/Seo";
import { useContent } from "@/i18n/locale-context";

/**
 * Página principal. Las secciones se añaden aquí en el orden en que aparecen
 * en la web; el número de cada una es su posición en la página.
 */
export function Home() {
  const { seo } = useContent();

  return (
    <>
      <Seo title={seo.title} />
      <Hero />
      <About />
      <Projects />
      <Stack />
      <Timeline />
      <Services />
      <Now />
      <Contact />
    </>
  );
}
