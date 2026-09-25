import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";

import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useContent, useLocale } from "@/i18n/locale-context";
import { IconoFlecha } from "@/components/ui/icons";
import {
  acoplarChat,
  activarModoTecnico,
  cargarChat,
  desacoplarChat,
  elegirPestana,
  leerInspector,
  leerInspectorServidor,
  suscribirInspector,
} from "@/lib/chatWidget";
import { cn } from "@/lib/cn";
import { EsquemaAgente, ID_ESQUEMA } from "./EsquemaAgente";
import { InspectorTurno } from "./InspectorTurno";
import { CLASES_ENLACE_TARJETA as CLASES_ENLACE, EnlaceTarjeta } from "./Projects";

type Estado = "cargando" | "listo" | "error";

/** Alto del chat desde lg. La columna de texto mide lo mismo para que el
 *  inspector no haga crecer la fila. */
const ALTO_LG = "lg:h-[min(560px,calc(100svh-var(--header-h)-4rem))]";

/** Las dos capas de la columna (texto e inspector) ocupan la misma celda y
 *  se funden entre sí. Con prefers-reduced-motion la regla global anula la
 *  transición. */
const CAPA =
  "[grid-area:1/1] transition-[opacity,visibility] duration-(--duration-base) ease-(--ease-soft)";

/** Scroll suave, o instantáneo con prefers-reduced-motion. */
function comportamientoScroll(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

/** Por debajo de lg el chat va debajo del texto: el CTA tiene que llevar a él. */
const CONSULTA_LG = "(min-width: 1024px)";

/**
 * Invitación a encender el modo técnico del widget. Con el modo encendido se
 * queda a la vista, desactivada, para que en móvil se vea que ha funcionado;
 * desde lg la tapa el inspector.
 */
function CtaModoTecnico({ activo, alActivar }: { activo: boolean; alActivar: () => void }) {
  const textos = useContent().agente.modoTecnico;

  return (
    <div className="mt-5 max-w-[52ch] rounded-card border border-[color-mix(in_oklab,var(--color-accent)_35%,var(--color-border))] bg-bg-subtle p-4">
      <p className="font-medium">{textos.titulo}</p>
      <p className="mt-1 text-small text-text-muted">{textos.texto}</p>
      <button
        type="button"
        onClick={alActivar}
        disabled={activo}
        aria-pressed={activo}
        className="mt-3 inline-flex items-center gap-2 rounded-pill border border-accent px-4 py-1.5 text-small font-medium text-accent transition-colors duration-(--duration-fast) ease-(--ease-soft) hover:bg-accent hover:text-accent-contrast disabled:cursor-default disabled:border-border disabled:text-text-muted disabled:hover:bg-transparent"
      >
        {activo && (
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="size-3.5 fill-none stroke-current stroke-[1.75]"
          >
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        )}
        {activo ? textos.activo : textos.boton}
      </button>
    </div>
  );
}

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
  const seccion = useRef<HTMLElement>(null);
  const chat = useRef<HTMLDivElement>(null);
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

  /** Botón del esquema: vuelve al chat y, si el widget lo permite, enfoca su
   *  campo de texto. focus() usa preventScroll, así que no corta el scroll. */
  const probarChat = () => {
    seccion.current?.scrollIntoView({ behavior: comportamientoScroll(), block: "start" });
    window.avalonWidget?.focus?.();
  };

  /** CTA del modo técnico. Desde lg la columna pasa sola al inspector; por
   *  debajo, el chat queda debajo del texto y hay que llevar la vista a él. */
  const encenderModoTecnico = () => {
    activarModoTecnico();
    if (!window.matchMedia(CONSULTA_LG).matches) {
      chat.current?.scrollIntoView({ behavior: comportamientoScroll(), block: "center" });
    }
  };

  /** Enlace al esquema: sin tocar el hash, que ScrollManager recolocaría. */
  const irAlEsquema = (evento: MouseEvent<HTMLAnchorElement>) => {
    const destino = document.getElementById(ID_ESQUEMA);
    if (!destino) return;
    evento.preventDefault();
    destino.scrollIntoView({ behavior: comportamientoScroll(), block: "start" });
  };

  return (
    <section
      ref={seccion}
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
                  {estado === "listo" && inspector.tecnicoDisponible && (
                    <CtaModoTecnico
                      activo={inspector.modoTecnico}
                      alActivar={encenderModoTecnico}
                    />
                  )}
                  <p className="mt-5 max-w-[52ch] text-small text-text-muted">{agente.aviso}</p>
                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                    <EnlaceTarjeta to="/proyectos/chatbot-rag">{agente.enlace}</EnlaceTarjeta>
                    <a href={`#${ID_ESQUEMA}`} onClick={irAlEsquema} className={CLASES_ENLACE}>
                      {agente.enlaceEsquema}
                      <IconoFlecha className="rotate-90 opacity-70" />
                    </a>
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
                    <InspectorTurno
                      key={inspector.turno}
                      metricas={inspector.metricas}
                      pestana={inspector.pestana}
                      alElegirPestana={elegirPestana}
                    />
                  </div>
                )}
              </div>
            </Reveal>

            <div
              ref={chat}
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

        <EsquemaAgente alProbar={probarChat} />
      </Container>
    </section>
  );
}
