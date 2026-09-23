import type { ComponentType } from "react";

import { Hero } from "@/components/hero/Hero";
import type { PropsSeccion } from "@/components/layout/Section";
import { About } from "@/components/sections/About";
import { AgentSection } from "@/components/sections/Agent";
import { Contact } from "@/components/sections/Contact";
import { Now } from "@/components/sections/Now";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { Seo } from "@/components/ui/Seo";
import { useContent } from "@/i18n/locale-context";
import { chatDisponible } from "@/lib/chatWidget";

/**
 * Secciones de la portada, en el orden en que aparecen. El número de cada una
 * es su posición en esta lista, así que una sección que no se pinta no deja
 * hueco en la numeración.
 */
const secciones: { id: string; Componente: ComponentType<PropsSeccion> }[] = [
  { id: "sobre-mi", Componente: About },
  { id: "proyectos", Componente: Projects },
  ...(chatDisponible ? [{ id: "agente", Componente: AgentSection }] : []),
  { id: "stack", Componente: Stack },
  { id: "trayectoria", Componente: Timeline },
  { id: "servicios", Componente: Services },
  { id: "ahora", Componente: Now },
  { id: "contacto", Componente: Contact },
];

export function Home() {
  const { seo } = useContent();

  return (
    <>
      <Seo title={seo.title} />
      <Hero />
      {secciones.map(({ id, Componente }, indice) => (
        <Componente key={id} numero={indice + 1} />
      ))}
    </>
  );
}
