import { useEffect, useEffectEvent, useRef, useState } from "react";

import { Section, type PropsSeccion } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useContent, useLocale } from "@/i18n/locale-context";
import { acoplarChat, cargarChat, desacoplarChat } from "@/lib/chatWidget";
import { EnlaceTarjeta } from "./Projects";

type Estado = "cargando" | "listo" | "error";

/**
 * Sección con el chat del agente embebido. Home solo la monta si el widget
 * está configurado.
 *
 * El chat no es un hijo de React: el hueco empieza vacío y, cuando la sección
 * se acerca al viewport, se le mueve dentro el host del widget, que vuelve a su
 * aparcamiento al desmontarse. El hueco reserva su alto desde el primer render
 * para que la carga no desplace nada. Reveal solo envuelve la columna de
 * texto: entre el chat y el documento no puede haber ningún transform.
 */
export function AgentSection({ numero }: PropsSeccion) {
  const { agente } = useContent();
  const { locale } = useLocale();
  const hueco = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("cargando");

  // El idioma solo cuenta para la primera carga; cambiarlo no debe volver a
  // observar ni a cargar nada.
  const cargar = useEffectEvent(() => cargarChat(locale));

  useEffect(() => {
    const elemento = hueco.current;
    if (!elemento) return;
    let montado = true;

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas.some((entrada) => entrada.isIntersecting)) return;
        observador.disconnect();

        cargar().then(
          () => {
            if (!montado) return;
            acoplarChat(elemento);
            setEstado("listo");
          },
          () => {
            if (montado) setEstado("error");
          },
        );
      },
      { rootMargin: "600px 0px" },
    );

    observador.observe(elemento);

    return () => {
      montado = false;
      observador.disconnect();
      desacoplarChat();
    };
  }, []);

  return (
    <Section id="agente" numero={numero} etiqueta={agente.etiqueta} titulo={agente.titulo}>
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <Reveal className="md:col-span-5">
          <p className="max-w-[52ch] text-text-muted">{agente.intro}</p>
          <p className="mt-5 max-w-[52ch] text-small text-text-muted">{agente.aviso}</p>
          <div className="mt-8">
            <EnlaceTarjeta to="/proyectos/avalon-agent">{agente.enlace}</EnlaceTarjeta>
          </div>
        </Reveal>

        <div className="relative h-[min(560px,75svh)] overflow-hidden rounded-card border border-border md:col-span-7 md:h-[560px]">
          <div ref={hueco} className="absolute inset-0" />

          {estado !== "listo" && (
            <div
              role="status"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-7 text-center"
            >
              {estado === "cargando" ? (
                <p className="label-mono">{agente.cargando}</p>
              ) : (
                <>
                  <p className="text-small text-text-muted">{agente.error}</p>
                  <a
                    href="#contacto"
                    className="text-small text-text underline underline-offset-4 transition-colors duration-[--duration-fast] hover:text-accent"
                  >
                    {agente.errorEnlace}
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
