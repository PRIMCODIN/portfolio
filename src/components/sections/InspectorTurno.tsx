import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import type { SiteContent } from "@/content/types";
import { useContent, useLocale } from "@/i18n/locale-context";
import { calcularCascada, porcentaje, type FilaCascada, type IdFila } from "@/lib/cascada";
import type { FragmentoTurno, MetricasTurno, PestanaInspector } from "@/lib/chatWidget";
import { cn } from "@/lib/cn";

type Textos = SiteContent["agente"]["inspector"];

const PESTANAS: PestanaInspector[] = ["tiempos", "busqueda"];

const NOMBRE_FILA: Record<IdFila, keyof Textos["tiempos"]> = {
  limites: "limites",
  conversacion: "conversacion",
  embeddings: "embeddings",
  busqueda: "busqueda",
  guardar: "guardar",
  llm: "llm",
  "llm-espera": "llmEspera",
  "llm-generacion": "llmGeneracion",
  otros: "otros",
};

/** Dos colores y nada más, los dos del tema: servidor en gris y LLM en acento. */
function colorBarra(fila: Pick<FilaCascada, "tipo" | "fase">): string {
  if (fila.tipo === "servidor") return "bg-text-muted opacity-55";
  return fila.fase === "espera" ? "bg-accent opacity-40" : "bg-accent";
}

function esNumero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
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

function Cifra({
  valor,
  etiqueta,
  grande,
}: {
  valor: string;
  etiqueta: string;
  /** El total va a 28 px; el primer token, a 20. */
  grande?: boolean;
}) {
  return (
    <div className="inline-flex min-w-0 items-baseline gap-1.5">
      <span
        className={cn(
          "leading-[1.15] font-medium whitespace-nowrap tabular-nums",
          grande ? "text-[28px]" : "text-[20px]",
        )}
      >
        {valor}
      </span>
      <span className="label-mono text-[0.625rem] whitespace-nowrap">{etiqueta}</span>
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
 * que el panel propio del widget: total y primer token arriba, con el modelo,
 * los tokens y el coste debajo, y las pestañas Tiempos y Búsqueda. Pinta
 * solo lo que traigan las métricas, porque las de mensajes antiguos vienen
 * incompletas.
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
  // Sin style currency: «$» delante y el separador decimal del idioma, como
  // el widget, que pinta $0,0050.
  const coste = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
  const ms = (valor: number) => `${entero.format(valor)} ms`;
  const duracion = (valor: number) =>
    valor < 1000 ? ms(valor) : `${segundos.format(valor / 1000)} s`;

  const t = textos.tiempos;
  const cascada = calcularCascada(metricas.tiempos ?? {});
  const { filas, total, escala, ttft } = cascada;

  const { entrada, salida } = metricas.tokens ?? {};
  const numero = (n: number | undefined) => (esNumero(n) ? entero.format(n) : "—");
  const hayTokens = esNumero(entrada) || esNumero(salida);
  const costeUsd = esNumero(metricas.coste_usd) ? metricas.coste_usd : null;

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

  // La línea del primer token es un solo elemento sobre toda la cascada. Las
  // pistas empiezan en --t-et + --t-gap y miden lo que dejan las otras dos
  // columnas, igual en todas las filas: el calc reproduce esa geometría.
  const lineaTtft =
    ttft !== null
      ? `calc(var(--t-et) + var(--t-gap) + (100% - var(--t-et) - var(--t-ms) - 2 * var(--t-gap)) * ${Math.min(1, ttft / escala)})`
      : null;

  const reparto = (tipo: FilaCascada["tipo"], nombre: string, valor: number) => (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span aria-hidden="true" className={cn("size-[9px] rounded-[2px]", colorBarra({ tipo }))} />
      {nombre} {ms(valor)} · {porcentaje(valor, total)} %
    </span>
  );

  const panelTiempos =
    filas.length > 0 ? (
      <div className="text-[0.75rem]">
        {/* Etiqueta | pista | ms. La columna de ms tiene ancho fijo para que
            las pistas de todas las filas empiecen y acaben en el mismo x. */}
        <div className="relative grid [--t-et:130px] [--t-gap:0.5rem] [--t-ms:4.5rem]">
          {filas.map((fila) => {
            const nombre = t[NOMBRE_FILA[fila.id]];
            return (
              <div
                key={fila.id}
                title={fila.id === "otros" ? t.otrosTitulo : `${nombre}: ${ms(fila.ms)}`}
                className="grid min-h-5 grid-cols-[var(--t-et)_minmax(0,1fr)_var(--t-ms)] items-center gap-(--t-gap)"
              >
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{nombre}</span>
                {/* La barra es la vista rápida; etiqueta y ms dicen lo mismo en texto. */}
                <span aria-hidden="true" className="relative h-2.5">
                  <i
                    className={cn("absolute inset-y-0 min-w-[3px] rounded-[2px]", colorBarra(fila))}
                    style={{
                      left: `${Math.min(100, (fila.inicio / escala) * 100)}%`,
                      width: `${Math.min(100, (fila.ms / escala) * 100)}%`,
                    }}
                  />
                </span>
                <span className="text-right whitespace-nowrap text-text-muted tabular-nums">
                  {ms(fila.ms)}
                </span>
              </div>
            );
          })}
          {ttft !== null && lineaTtft !== null && (
            <span
              aria-hidden="true"
              title={`${t.primerToken}: ${ms(ttft)}`}
              className="pointer-events-none absolute inset-y-0 w-0 border-l border-dashed border-text opacity-70"
              style={{ left: lineaTtft }}
            />
          )}
        </div>

        {cascada.conTools && (
          <p className="mt-1.5 text-[0.6875rem] text-text-muted">
            {cascada.pasadas !== null && `${cascada.pasadas} ${t.pasadas} · `}
            tools {ms(cascada.toolsMs)}
          </p>
        )}

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 border-t border-border pt-1.5 text-text-muted tabular-nums">
          {reparto("servidor", t.servidor, cascada.servidorMs)}
          {cascada.hayLLM && reparto("llm", t.llm, cascada.llmMs)}
        </div>
      </div>
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
      <div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5">
          <Cifra valor={total > 0 ? duracion(total) : "—"} etiqueta={t.total} grande />
          {ttft !== null && <Cifra valor={duracion(ttft)} etiqueta={t.primerToken} />}
        </div>
        {/* Sin tokens ni coste (turno cortado antes del modelo) no hay línea.
            Si no cabe, se parte entre spans: el separador va en el ::before
            del siguiente para no quedarse suelto. Solo el modelo se recorta. */}
        {(hayTokens || costeUsd !== null) && (
          <div
            title={
              metricas.modelo
                ? metricas.modelo + (metricas.proveedor ? ` (${metricas.proveedor})` : "")
                : undefined
            }
            className="mt-1 flex flex-wrap font-mono text-[0.75rem] text-text-muted [&>span]:whitespace-nowrap [&>span+span]:before:mx-[0.6ch] [&>span+span]:before:content-['·']"
          >
            {metricas.modelo && (
              <span className="max-w-full min-w-0 overflow-hidden text-ellipsis">
                {metricas.modelo}
              </span>
            )}
            {hayTokens && (
              <span>
                {numero(entrada)} → {numero(salida)} tok
              </span>
            )}
            {costeUsd !== null && <span>${coste.format(costeUsd)}</span>}
          </div>
        )}
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
