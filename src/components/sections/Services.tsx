import { Section, type PropsSeccion } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/i18n/locale-context";

export function Services({ numero }: PropsSeccion) {
  const { servicios } = useContent();

  return (
    <Section
      id="servicios"
      numero={numero}
      etiqueta={servicios.etiqueta}
      titulo={servicios.titulo}
      intro={servicios.intro}
    >
      <div className="grid gap-px overflow-hidden rounded-card border border-hairline bg-hairline sm:grid-cols-2">
        {servicios.items.map((servicio, indice) => (
          <Reveal key={servicio.id} retardo={indice * 60} className="bg-bg">
            <article className="h-full p-7 sm:p-9">
              <p className="label-mono">{String(indice + 1).padStart(2, "0")}</p>
              <h3 className="mt-6 text-h3">{servicio.titulo}</h3>
              <p className="mt-4 text-small text-text-muted">{servicio.descripcion}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
