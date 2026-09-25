import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import type { SiteContent } from "@/content/types";
import { useContent, useLocale } from "@/i18n/locale-context";
import type { FragmentoTurno, MetricasTurno, PestanaInspector } from "@/lib/chatWidget";
import { cn } from "@/lib/cn";

type Textos = SiteContent["agente"]["inspector"];

interface Tramo {
  id: string;
  nombre: string;
  ms: number;
  /** Mezcla del acento con la superficie: sin colores nuevos, sigue al tema. */
  color: string;
}

const PESTANAS: PestanaInspector[] = ["tiempos", "busqueda"];

function esNumero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
}

function mezclaAcento(porcentaje: number): string {
  return `color-mix(in oklab, var(--color-accent) ${porcentaje}%, var(--color-surface))`;
}

/**
 * Tramos de la barra de tiempos, en orden de ejecución. Cada uno solo si su
 * clave es numérica; «Otros» es lo que queda hasta el total.
 */
function calcularTramos(tiempos: NonNullable<MetricasTurno["tiempos"]>, textos: Textos): Tramo[] {
  const t = textos.tiempos;
  const tramos: Tramo[] = [];

  const preparacion = [tiempos.limites_ms, tiempos.conversacion_ms].filter(esNumero);
  if (preparacion.length > 0) {
    tramos.push({
      id: "preparacion",
      nombre: t.preparacion,
      ms: preparacion.reduce((a, b) => a + b, 0),
      color: mezclaAcento(22),
    });
  }
  if (esNumero(tiempos.embeddings_ms)) {
    tramos.push({
      id: "embeddings",
      nombre: t.embeddings,
      ms: tiempos.embeddings_ms,
      color: mezclaAcento(38),
    });
  }
  if (esNumero(tiempos.match_chunks_ms)) {
    tramos.push({
      id: "busqueda",
      nombre: t.busqueda,
      ms: tiempos.match_chunks_ms,
      color: mezclaAcento(54),
    });
  }
  if (esNumero(tiempos.guardar_usuario_ms)) {
    tramos.push({
      id: "guardar",
      nombre: t.guardar,
      ms: tiempos.guardar_usuario_ms,
      color: mezclaAcento(70),
    });
  }
  if (esNumero(tiempos.llm_ms)) {
    const pasadas = tiempos.pasadas_llm;
    tramos.push({
      id: "llm",
      nombre: esNumero(pasadas) && pasadas >= 2 ? `${t.llm} · ${pasadas} ${t.pasadas}` : t.llm,
      ms: tiempos.llm_ms,
      color: "var(--color-accent)",
    });
  }
  if (esNumero(tiempos.tools_ms) && tiempos.tools_ms > 0) {
    tramos.push({
      id: "herramientas",
      nombre: t.herramientas,
      ms: tiempos.tools_ms,
      color: mezclaAcento(84),
    });
  }

  const suma = tramos.reduce((total, tramo) => total + tramo.ms, 0);
  if (esNumero(tiempos.total_ms) && tiempos.total_ms - suma > 0) {
    tramos.push({
      id: "otros",
      nombre: t.otros,
      ms: tiempos.total_ms - suma,
      color: "color-mix(in oklab, var(--color-text-muted) 30%, var(--color-surface))",
    });
  }

  return tramos;
}

/** «A», «B» o «A+B» según qué consulta encontró el fragmento. */
function insignia(fragmento: FragmentoTurno): string | null {
  const ids = [...new Set(fragmento.consultas ?? [])].sort();
  return ids.length > 0 ? ids.join("+") : null;
}

function Titulo({ children }: { children: ReactNode }) {
  return <h3 className="label-mono">{children}</h3>;
}

function Insignia({ texto }: { texto: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-pill border px-1.5 font-mono text-[0.6875rem] leading-4",
        texto.includes("+")
          ? "border-accent bg-accent text-accent-contrast"
          : "border-accent text-accent",
      )}
    >
      {texto}
    </span>
  );
}

function Ficha({
  valor,
  sub,
  etiqueta,
  pequeno,
}: {
  valor: string;
  sub?: string;
  etiqueta: string;
  /** Para el modelo, que suele ocupar dos líneas. */
  pequeno?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col rounded-[8px] bg-surface px-2.5 py-1.5">
      <span
        className={cn(
          "font-medium break-words tabular-nums",
          pequeno && "text-[0.8125rem] leading-tight",
        )}
      >
        {valor}
      </span>
      {sub && (
        <span className="text-[0.6875rem] leading-tight break-words text-text-muted">{sub}</span>
      )}
      <span className="label-mono mt-auto pt-0.5 text-[0.625rem]">{etiqueta}</span>
    </div>
  );
}

function Fragmento({
  fragmento,
  similitud,
}: {
  fragmento: FragmentoTurno;
  similitud: Intl.NumberFormat;
}) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  const etiqueta = insignia(fragmento);
  const ruta = [fragmento.documento, fragmento.seccion].filter(Boolean).join(" › ");

  return (
    <li className="border-t border-hairline first:border-t-0">
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={id}
        onClick={() => setAbierto((valor) => !valor)}
        className="flex w-full items-start gap-2 py-1 text-left text-small transition-colors duration-(--duration-fast) hover:text-accent"
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={cn(
            "mt-[0.3rem] size-3 shrink-0 fill-none stroke-current stroke-[1.5] text-text-muted transition-transform duration-(--duration-fast)",
            abierto && "rotate-90",
          )}
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
        <span className="min-w-0 flex-1">
          {esNumero(fragmento.posicion) && (
            <span className="font-mono text-text-muted">#{fragmento.posicion} </span>
          )}
          <span className="break-words">{ruta}</span>
          {esNumero(fragmento.similitud) && (
            <span className="font-mono text-text-muted">
              {" · "}
              {similitud.format(fragmento.similitud)}
            </span>
          )}
        </span>
        {etiqueta && <Insignia texto={etiqueta} />}
      </button>
      <div id={id} hidden={!abierto} className="pb-3 pl-5">
        <p className="text-small whitespace-pre-line text-text-muted">{fragmento.contenido}</p>
      </div>
    </li>
  );
}

/**
 * Detalles técnicos del turno seleccionado en el chat, con el mismo diseño
 * que el panel propio del widget: cuatro fichas arriba y las pestañas Tiempos
 * y Búsqueda debajo. Pinta solo lo que traigan las métricas, porque las de
 * mensajes antiguos vienen incompletas.
 *
 * La pestaña elegida la guarda quien lo monta: el componente se remonta con
 * cada turno y la elección tiene que sobrevivir.
 */
export function InspectorTurno({
  metricas,
  pestana,
  alElegirPestana,
}: {
  metricas: MetricasTurno | null;
  pestana: PestanaInspector;
  alElegirPestana: (pestana: PestanaInspector) => void;
}) {
  const textos = useContent().agente.inspector;
  const { locale } = useLocale();
  const idBase = useId();
  const pestanas = useRef<(HTMLButtonElement | null)[]>([]);

  if (!metricas) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center p-7 text-center">
        <p className="max-w-[32ch] text-small text-text-muted">{textos.vacio}</p>
      </div>
    );
  }

  const entero = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const segundos = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const similitud = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const coste = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  });
  const ms = (valor: number) => `${entero.format(valor)} ms`;
  const duracion = (valor: number) =>
    valor < 1000 ? ms(valor) : `${segundos.format(valor / 1000)} s`;

  const tiempos = metricas.tiempos;
  const tramos = tiempos ? calcularTramos(tiempos, textos) : [];
  const suma = tramos.reduce((total, tramo) => total + tramo.ms, 0);
  // Sin total_ms (métricas antiguas), la suma de lo que haya.
  const total = esNumero(tiempos?.total_ms) ? tiempos.total_ms : suma;
  const escala = Math.max(total, suma);
  const ttft = tiempos?.ttft_ms;
  const posicionTtft =
    esNumero(ttft) && escala > 0 ? Math.min(Math.max(ttft / escala, 0), 1) * 100 : null;

  const { entrada, salida } = metricas.tokens ?? {};
  const numero = (n: number | undefined) => (esNumero(n) ? entero.format(n) : "—");

  const retrieval = metricas.retrieval;
  const consultas = (retrieval?.consultas ?? []).filter((consulta) => consulta.texto);
  const hayB = consultas.some((consulta) => consulta.id === "B");
  const fragmentos = retrieval?.fragmentos ?? [];
  const fuentes = metricas.fuentes ?? [];

  /** Patrón tabs de ARIA: flechas, Inicio y Fin mueven la selección y el foco. */
  const alPulsarTecla = (evento: KeyboardEvent<HTMLButtonElement>, indice: number) => {
    const ultimo = PESTANAS.length - 1;
    const destino = {
      ArrowRight: indice === ultimo ? 0 : indice + 1,
      ArrowLeft: indice === 0 ? ultimo : indice - 1,
      Home: 0,
      End: ultimo,
    }[evento.key];
    const siguiente = destino === undefined ? undefined : PESTANAS[destino];
    if (destino === undefined || !siguiente) return;
    evento.preventDefault();
    alElegirPestana(siguiente);
    pestanas.current[destino]?.focus();
  };

  const panelTiempos =
    tramos.length > 0 && escala > 0 ? (
      <>
        <div aria-hidden="true" className={cn("relative", posicionTtft !== null && "pb-5")}>
          <div className="flex h-2.5 gap-px overflow-hidden rounded-[3px] bg-surface">
            {tramos.map(
              (tramo) =>
                tramo.ms > 0 && (
                  <span
                    key={tramo.id}
                    className="h-full"
                    style={{
                      width: `${(tramo.ms / escala) * 100}%`,
                      backgroundColor: tramo.color,
                    }}
                  />
                ),
            )}
          </div>
          {posicionTtft !== null && (
            <div className="absolute inset-y-0 w-0" style={{ left: `${posicionTtft}%` }}>
              <span className="absolute -top-1 h-4.5 w-px bg-text" />
              <span
                className={cn(
                  "absolute top-4 font-mono text-[0.6875rem] whitespace-nowrap text-text",
                  posicionTtft < 25
                    ? "left-0"
                    : posicionTtft > 75
                      ? "right-0"
                      : "left-0 -translate-x-1/2",
                )}
              >
                {textos.tiempos.primerToken}
              </span>
            </div>
          )}
        </div>

        {/* Leyenda en dos columnas. El total no va aquí: está en las fichas. */}
        <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1 text-[0.8125rem]">
          {tramos.map((tramo) => (
            <div key={tramo.id} className="flex min-w-0 items-center gap-2">
              <dt className="flex min-w-0 flex-1 items-center gap-2 text-text-muted">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: tramo.color }}
                />
                <span className="min-w-0 break-words">{tramo.nombre}</span>
              </dt>
              <dd className="shrink-0 font-mono tabular-nums">{ms(tramo.ms)}</dd>
            </div>
          ))}
          {esNumero(ttft) && (
            <div className="flex min-w-0 items-center gap-2">
              <dt className="flex min-w-0 flex-1 items-center gap-2 text-text-muted">
                <span aria-hidden="true" className="flex w-2.5 shrink-0 justify-center">
                  <span className="h-3 w-px bg-text" />
                </span>
                <span className="min-w-0 break-words">{textos.tiempos.primerToken}</span>
              </dt>
              <dd className="shrink-0 font-mono tabular-nums">{ms(ttft)}</dd>
            </div>
          )}
        </dl>
      </>
    ) : (
      <p className="text-small text-text-muted">{textos.sinDatos}</p>
    );

  const hayBusqueda = consultas.length > 0 || fragmentos.length > 0 || fuentes.length > 0;
  const panelBusqueda = hayBusqueda ? (
    <div className="flex flex-col gap-3">
      {consultas.length > 0 && (
        <section className="flex flex-col gap-1">
          <Titulo>{textos.consultas.titulo}</Titulo>
          <ul className="flex flex-col gap-0.5">
            {consultas.map((consulta, indice) => (
              <li key={consulta.id ?? indice} className="flex items-start gap-2 text-small">
                {consulta.id && <Insignia texto={consulta.id} />}
                <span className="min-w-0 break-words">{consulta.texto}</span>
              </li>
            ))}
          </ul>
          {hayB && (
            <p className="text-[0.75rem] leading-snug text-text-muted">{textos.consultas.notaB}</p>
          )}
        </section>
      )}

      {fragmentos.length > 0 && (
        <section className="flex flex-col gap-1">
          <Titulo>
            {textos.fragmentos.titulo}
            {esNumero(retrieval?.candidatos) && (
              <span className="normal-case tracking-normal">
                {" · "}
                {entero.format(retrieval.candidatos)} {textos.fragmentos.candidatos}
              </span>
            )}
          </Titulo>
          <ul>
            {fragmentos.map((fragmento, indice) => (
              <Fragmento
                key={fragmento.posicion ?? `i${indice}`}
                fragmento={fragmento}
                similitud={similitud}
              />
            ))}
          </ul>
        </section>
      )}

      {!retrieval && fuentes.length > 0 && (
        <section className="flex flex-col gap-1.5">
          <Titulo>{textos.fuentes.titulo}</Titulo>
          <ul className="flex flex-col gap-1 text-small">
            {fuentes.map((fuente, indice) => (
              <li key={`${fuente.posicion ?? ""}-${indice}`} className="break-words">
                {[fuente.documento, fuente.seccion].filter(Boolean).join(" › ")}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  ) : (
    <p className="text-small text-text-muted">{textos.sinDatos}</p>
  );

  const paneles: Record<PestanaInspector, { nombre: string; contenido: ReactNode }> = {
    tiempos: { nombre: textos.pestanas.tiempos, contenido: panelTiempos },
    busqueda: { nombre: textos.pestanas.busqueda, contenido: panelBusqueda },
  };

  return (
    <div className="@container flex flex-col gap-2 p-3">
      <div className="grid grid-cols-2 gap-1.5 text-small @min-[26rem]:grid-cols-4">
        <Ficha
          valor={metricas.modelo || "—"}
          sub={metricas.proveedor}
          etiqueta={textos.fichas.modelo}
          pequeno
        />
        <Ficha valor={`${numero(entrada)} → ${numero(salida)}`} etiqueta={textos.fichas.tokens} />
        <Ficha
          valor={esNumero(metricas.coste_usd) ? coste.format(metricas.coste_usd) : "—"}
          etiqueta={textos.fichas.coste}
        />
        <Ficha valor={total > 0 ? duracion(total) : "—"} etiqueta={textos.fichas.total} />
      </div>

      <div>
        <div
          role="tablist"
          aria-label={textos.pestanas.etiqueta}
          className="flex gap-1 border-b border-border"
        >
          {PESTANAS.map((clave, indice) => {
            const elegida = clave === pestana;
            return (
              <button
                key={clave}
                ref={(nodo) => {
                  pestanas.current[indice] = nodo;
                }}
                type="button"
                role="tab"
                id={`${idBase}-tab-${clave}`}
                aria-selected={elegida}
                aria-controls={`${idBase}-panel-${clave}`}
                tabIndex={elegida ? 0 : -1}
                onClick={() => alElegirPestana(clave)}
                onKeyDown={(evento) => alPulsarTecla(evento, indice)}
                className={cn(
                  "-mb-px rounded-t-[6px] border-b-2 px-2.5 py-1 text-small transition-colors duration-(--duration-fast)",
                  elegida
                    ? "border-accent font-medium text-text"
                    : "border-transparent text-text-muted hover:text-text",
                )}
              >
                {paneles[clave].nombre}
              </button>
            );
          })}
        </div>

        {PESTANAS.map((clave) => (
          <div
            key={clave}
            role="tabpanel"
            id={`${idBase}-panel-${clave}`}
            aria-labelledby={`${idBase}-tab-${clave}`}
            hidden={clave !== pestana}
            // Tiempos no tiene nada enfocable: el panel entra en el orden de Tab.
            tabIndex={clave === "tiempos" ? 0 : undefined}
            className="rounded-[4px] pt-2.5"
          >
            {paneles[clave].contenido}
          </div>
        ))}
      </div>
    </div>
  );
}
