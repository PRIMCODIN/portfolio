import { Section, type PropsSeccion } from "@/components/layout/Section";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/i18n/locale-context";
import type { Experiencia } from "@/content/types";
import { cn } from "@/lib/cn";
import { valorPublicable } from "@/lib/contenido";

/** Una entrada de la línea temporal. El punto solo se tiñe si sigue en curso. */
function Entrada({ experiencia, actualidad }: { experiencia: Experiencia; actualidad: string }) {
  const enCurso = experiencia.fin === null;
  const modalidad = valorPublicable(experiencia.modalidad);
  const meta = [experiencia.empresa, modalidad, experiencia.ubicacion].filter(Boolean).join(" · ");

  return (
    <li className="relative border-l border-hairline pb-12 pl-7 last:pb-0">
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1.5 -left-[3.5px] size-1.5 rounded-pill",
          enCurso ? "bg-accent" : "bg-border",
        )}
      />
      <p className="label-mono">
        {experiencia.inicio} — {experiencia.fin ?? actualidad}
      </p>
      <h4 className="mt-3 text-h3">{experiencia.puesto}</h4>
      <p className="mt-1.5 text-small text-text-muted">{meta}</p>

      <ul className="mt-5 space-y-2.5">
        {experiencia.logros.map((logro) => (
          <li key={logro.slice(0, 24)} className="text-small text-text-muted">
            {logro}
          </li>
        ))}
      </ul>

      {experiencia.stack && (
        <ul className="mt-5 flex flex-wrap gap-2">
          {experiencia.stack.map((item) => (
            <li key={item}>
              <Chip>{item}</Chip>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Timeline({ numero }: PropsSeccion) {
  const { trayectoria, ui } = useContent();

  return (
    <Section
      id="trayectoria"
      numero={numero}
      etiqueta={trayectoria.etiqueta}
      titulo={trayectoria.titulo}
    >
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <h3 className="label-mono mb-8">{trayectoria.tituloTecnica}</h3>
            <ul>
              {trayectoria.tecnica.map((experiencia) => (
                <Entrada
                  key={experiencia.id}
                  experiencia={experiencia}
                  actualidad={ui.actualidad}
                />
              ))}
            </ul>
          </Reveal>

          {/* Disclosure nativo: accesible y navegable con teclado sin JS. */}
          <Reveal retardo={80}>
            <details className="group mt-12 border-t border-hairline pt-8">
              <summary className="flex cursor-pointer list-none items-center gap-3 text-h3 marker:content-none">
                <span
                  aria-hidden="true"
                  className="text-text-muted transition-transform duration-[--duration-fast] group-open:rotate-45"
                >
                  +
                </span>
                {trayectoria.tituloPrevia}
              </summary>
              <p className="mt-4 max-w-[60ch] text-small text-text-muted">
                {trayectoria.introPrevia}
              </p>
              <ul className="mt-10">
                {trayectoria.previa.map((experiencia) => (
                  <Entrada
                    key={experiencia.id}
                    experiencia={experiencia}
                    actualidad={ui.actualidad}
                  />
                ))}
              </ul>
            </details>
          </Reveal>
        </div>

        <Reveal retardo={120} className="lg:col-span-4 lg:col-start-9">
          <h3 className="label-mono mb-8">{trayectoria.tituloFormacion}</h3>
          <ul>
            {trayectoria.formacion.map((estudio) => {
              const inicio = valorPublicable(estudio.inicio);
              return (
                <li key={estudio.id} className="border-t border-hairline py-5">
                  {inicio && (
                    <p className="label-mono">
                      {inicio} — {estudio.fin ?? ui.actualidad}
                    </p>
                  )}
                  <h4 className="mt-2.5 text-small font-medium">{estudio.titulo}</h4>
                  <p className="mt-1 text-small text-text-muted">
                    {estudio.centro}
                    {estudio.nota ? ` · ${estudio.nota}` : ""}
                  </p>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
