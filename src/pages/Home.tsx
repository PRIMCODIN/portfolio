import type { ComponentType } from "react";

import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { AgentSection } from "@/components/sections/Agent";
import { Contact } from "@/components/sections/Contact";
import { Now } from "@/components/sections/Now";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { Seo } from "@/components/ui/Seo";
import { useContent } from "@/i18n/locale-context";
import { chatDisponible } from "@/lib/chatWidget";

/** Secciones de la portada, en el orden en que aparecen. */
const secciones: { id: string; Componente: ComponentType }[] = [
  { id: "sobre-mi", Componente: About },
  { id: "proyectos", Componente: Projects },
  ...(chatDisponible ? [{ id: "agente", Componente: AgentSection }] : []),
  { id: "stack", Componente: Stack },
  { id: "trayectoria", Componente: Timeline },
  { id: "ahora", Componente: Now },
  { id: "contacto", Componente: Contact },
];

export function Home() {
  const { seo } = useContent();

  return (
    <>
      <Seo title={seo.title} />
      <Hero />
      {secciones.map(({ id, Componente }) => (
        <Componente key={id} />
      ))}
    </>
  );
}
