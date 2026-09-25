import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useContent, useLocale } from "@/i18n/locale-context";
import {
  acoplarChat,
  cargarChat,
  desacoplarChat,
  leerInspector,
  leerInspectorServidor,
  suscribirInspector,
} from "@/lib/chatWidget";
import { cn } from "@/lib/cn";
import { InspectorTurno } from "./InspectorTurno";
import { EnlaceTarjeta } from "./Projects";

type Estado = "cargando" | "listo" | "error";

/** Alto del chat desde lg. La columna de texto mide lo mismo para que el
 *  inspector no haga crecer la fila. */
const ALTO_LG = "lg:h-[min(560px,calc(100svh-var(--header-h)-4rem))]";

/** Las dos capas de la columna (texto e inspector) ocupan la misma celda y
 *  se funden entre sí. Con prefers-reduced-motion la regla global anula la
 *  transición. */
const CAPA =
  "[grid-area:1/1] transition-[opacity,visibility] duration-(--duration-base) ease-(--ease-soft)";

/**
 * Sección con el chat del agente embebido. Home solo la monta si el widget
 * está configurado.
 *
 * El chat no es un hijo de React: el hueco empieza vacío y, cuando la sección
 * se acerca al viewport, se le mueve dentro el host del widget, que vuelve a su
 * aparcamiento al desmontarse. El hueco reserva su alto desde el primer render
 * para que la carga no desplace nada. Reveal solo envuelve la columna de
 * texto: entre el chat y el documento no puede haber ningún transform.
 *
 * Al llegar a /#agente tiene que verse entera sin desplazarse: la sección
 * ocupa el alto de la pantalla, su ancla se detiene justo bajo la cabecera y
 * el chat mide como mucho la pantalla menos la cabecera y 4rem de aire, que
 * es lo que deja libre el centrado vertical.
 */
export function AgentSection() {
  const { agente } = useContent();
  const { locale } = useLocale();
  const hueco = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>("cargando");
  const inspector = useSyncExternalStore(suscribirInspector, leerInspector, leerInspectorServidor);
  const verInspector = inspector.conectado && inspector.modoTecnico;

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
    <section
      id="agente"
      className="scroll-mt-[var(--header-h)] border-t border-hairline"
      aria-labelledby="agente-titulo"
    >
      <Container>
        <div className="flex min-h-svh flex-col justify-center py-12 lg:py-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
            <Reveal className={cn("flex min-w-0 flex-col lg:col-span-5", ALTO_LG)}>
              <h2 id="agente-titulo" className="text-h2">
                {agente.titulo}
              </h2>
              <div className="mt-6 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)]">
                <div
                  className={cn(CAPA, verInspector && "invisible opacity-0")}
                  inert={verInspector}
                >
                  <p className="max-w-[52ch] text-text-muted">{agente.intro}</p>
                  <p className="mt-5 max-w-[52ch] text-small text-text-muted">{agente.aviso}</p>
                  <div className="mt-8">
                    <EnlaceTarjeta to="/proyectos/chatbot-rag">{agente.enlace}</EnlaceTarjeta>
                  </div>
                </div>

                {inspector.conectado && (
                  <div
                    role="region"
                    aria-label={agente.inspector.etiqueta}
                    inert={!verInspector}
                    className={cn(
                      CAPA,
                      "overflow-y-auto overscroll-contain rounded-card border border-border bg-bg-subtle",
                      !verInspector && "invisible opacity-0",
                    )}
                  >
                    <InspectorTurno key={inspector.turno} metricas={inspector.metricas} />
                  </div>
                )}
              </div>
            </Reveal>

            <div
              className={cn(
                "relative h-[min(560px,75svh)] min-w-0 overflow-hidden rounded-card border border-border lg:col-span-7",
                ALTO_LG,
              )}
            >
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
                        className="text-small text-text underline underline-offset-4 transition-colors duration-(--duration-fast) hover:text-accent"
                      >
                        {agente.errorEnlace}
                      </a>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
