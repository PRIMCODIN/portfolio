import { useId, useState } from "react";

import type { SiteContent } from "@/content/types";
import { useContent, useLocale } from "@/i18n/locale-context";
import type { FragmentoTurno, MetricasTurno } from "@/lib/chatWidget";
import { cn } from "@/lib/cn";

type Textos = SiteContent["agente"]["inspector"];

interface Tramo {
  id: string;
  nombre: string;
  ms: number;
  /** Mezcla del acento con la superficie: sin colores nuevos, sigue al tema. */
  color: string;
}

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

function Titulo({ children }: { children: string }) {
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
        className="flex w-full items-start gap-2 py-2.5 text-left text-small transition-colors duration-(--duration-fast) hover:text-accent"
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
 * Detalles técnicos del turno seleccionado en el chat: resumen, tiempos,
 * consultas y fragmentos del retrieval. Pinta solo lo que traigan las
 * métricas, porque las de mensajes antiguos vienen incompletas.
 */
export function InspectorTurno({ metricas }: { metricas: MetricasTurno | null }) {
  const textos = useContent().agente.inspector;
  const { locale } = useLocale();

  if (!metricas) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center p-7 text-center">
        <p className="max-w-[32ch] text-small text-text-muted">{textos.vacio}</p>
      </div>
    );
  }

  const entero = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const similitud = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const coste = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
  });

  // Resumen: modelo · proveedor · tokens · coste.
  const resumen: string[] = [];
  if (metricas.modelo) resumen.push(metricas.modelo);
  if (metricas.proveedor) resumen.push(metricas.proveedor);
  const { entrada, salida } = metricas.tokens ?? {};
  if (esNumero(entrada) || esNumero(salida)) {
    const formatear = (n: number | undefined) => (esNumero(n) ? entero.format(n) : "—");
    resumen.push(`${formatear(entrada)} → ${formatear(salida)} ${textos.resumen.tokens}`);
  }
  if ("coste_usd" in metricas) {
    resumen.push(esNumero(metricas.coste_usd) ? coste.format(metricas.coste_usd) : "—");
  }

  const tiempos = metricas.tiempos;
  const tramos = tiempos ? calcularTramos(tiempos, textos) : [];
  const suma = tramos.reduce((total, tramo) => total + tramo.ms, 0);
  const total = esNumero(tiempos?.total_ms) ? tiempos.total_ms : null;
  const escala = Math.max(total ?? 0, suma);
  const ttft = tiempos?.ttft_ms;
  const posicionTtft =
    esNumero(ttft) && escala > 0 ? Math.min(Math.max(ttft / escala, 0), 1) * 100 : null;

  const retrieval = metricas.retrieval;
  const consultas = (retrieval?.consultas ?? []).filter((consulta) => consulta.texto);
  const hayB = consultas.some((consulta) => consulta.id === "B");
  const fragmentos = retrieval?.fragmentos ?? [];
  const fuentes = metricas.fuentes ?? [];

  const ms = (valor: number) => `${entero.format(valor)} ms`;

  return (
    <div className="flex flex-col gap-7 p-5">
      {resumen.length > 0 && (
        <section className="flex flex-col gap-2">
          <Titulo>{textos.resumen.titulo}</Titulo>
          <p className="text-small break-words">{resumen.join(" · ")}</p>
        </section>
      )}

      {tramos.length > 0 && escala > 0 && (
        <section className="flex flex-col gap-3">
          <Titulo>{textos.tiempos.titulo}</Titulo>

          <div aria-hidden="true" className={cn("relative", posicionTtft !== null && "pb-5")}>
            <div className="flex h-3 gap-px overflow-hidden rounded-[4px] bg-surface">
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
                <span className="absolute -top-1 h-5 w-px bg-text" />
                <span
                  className={cn(
                    "absolute top-4.5 font-mono text-[0.6875rem] whitespace-nowrap text-text",
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

          <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-small">
            {tramos.map((tramo) => (
              <div key={tramo.id} className="contents">
                <dt className="flex items-center gap-2.5 text-text-muted">
                  <span
                    aria-hidden="true"
                    className="size-2.5 shrink-0 rounded-[3px]"
                    style={{ backgroundColor: tramo.color }}
                  />
                  {tramo.nombre}
                </dt>
                <dd className="text-right font-mono tabular-nums">{ms(tramo.ms)}</dd>
              </div>
            ))}
            {esNumero(ttft) && (
              <div className="contents">
                <dt className="flex items-center gap-2.5 text-text-muted">
                  <span aria-hidden="true" className="flex w-2.5 shrink-0 justify-center">
                    <span className="h-3 w-px bg-text" />
                  </span>
                  {textos.tiempos.primerToken}
                </dt>
                <dd className="text-right font-mono tabular-nums">{ms(ttft)}</dd>
              </div>
            )}
            {total !== null && (
              <div className="contents">
                <dt className="mt-1 border-t border-hairline pt-1">{textos.tiempos.total}</dt>
                <dd className="mt-1 border-t border-hairline pt-1 text-right font-mono tabular-nums">
                  {ms(total)}
                </dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {consultas.length > 0 && (
        <section className="flex flex-col gap-3">
          <Titulo>{textos.consultas.titulo}</Titulo>
          <ul className="flex flex-col gap-2">
            {consultas.map((consulta, indice) => (
              <li key={consulta.id ?? indice} className="flex items-start gap-2 text-small">
                {consulta.id && <Insignia texto={consulta.id} />}
                <span className="min-w-0 break-words">{consulta.texto}</span>
              </li>
            ))}
          </ul>
          {hayB && <p className="text-small text-text-muted">{textos.consultas.notaB}</p>}
        </section>
      )}

      {fragmentos.length > 0 && (
        <section className="flex flex-col gap-2">
          <Titulo>{textos.fragmentos.titulo}</Titulo>
          {esNumero(retrieval?.candidatos) && (
            <p className="text-small text-text-muted">
              {entero.format(retrieval.candidatos)} {textos.fragmentos.candidatos}
            </p>
          )}
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
        <section className="flex flex-col gap-2">
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
  );
}
