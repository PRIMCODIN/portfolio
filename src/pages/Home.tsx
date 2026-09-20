import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";

/**
 * Página principal. Las secciones se añaden aquí en el orden en que aparecen
 * en la web; el número de cada una es su posición en la página.
 */
export function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Stack />
      <Timeline />
    </>
  );
}
