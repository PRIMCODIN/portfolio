import type { MetricasTurno } from "@/lib/chatWidget";

/**
 * Filas del waterfall de tiempos y repartos del pie, sin React ni textos.
 *
 * Replica `cascadaDe` de widget/widget.js (avalon-agent): mismo orden, mismas
 * reglas y mismos números. Un cambio allí hay que traerlo aquí, y el test de
 * paridad (cascada.test.ts) usa los turnos sintéticos de
 * scripts/verificar_modo_tecnico.py para que no se separen.
 */

export type Tiempos = NonNullable<MetricasTurno["tiempos"]>;

export type IdFila =
  | "limites"
  | "conversacion"
  | "embeddings"
  | "busqueda"
  | "guardar"
  | "llm"
  | "llm-espera"
  | "llm-generacion"
  | "otros";

export interface FilaCascada {
  id: IdFila;
  /** Milisegundos desde t0 hasta el principio de la barra. */
  inicio: number;
  ms: number;
  tipo: "servidor" | "llm";
  fase?: "espera" | "generacion";
}

export interface Cascada {
  filas: FilaCascada[];
  /** total_ms, o la suma de las filas en métricas antiguas que no lo traigan. */
  total: number;
  /** Lo que ocupa la pista: el total, o el final de la última fila si se pasa. */
  escala: number;
  ttft: number | null;
  servidorMs: number;
  llmMs: number;
  hayLLM: boolean;
  conTools: boolean;
  toolsMs: number;
  pasadas: number | null;
}

/**
 * Etapas de servidor previas al modelo, en el orden en que se suman. Las
 * claves son duraciones acumuladas, no instantes, así que el inicio de cada
 * barra es la suma de las anteriores. Una clave ausente es una etapa que no
 * ocurrió y no tiene fila.
 */
const ETAPAS_SERVIDOR: { id: IdFila; clave: keyof Tiempos }[] = [
  { id: "limites", clave: "limites_ms" },
  { id: "conversacion", clave: "conversacion_ms" },
  { id: "embeddings", clave: "embeddings_ms" },
  { id: "busqueda", clave: "match_chunks_ms" },
  { id: "guardar", clave: "guardar_usuario_ms" },
];

function esNumero(valor: unknown): valor is number {
  return typeof valor === "number" && Number.isFinite(valor);
}

/**
 * El bloque LLM dura llm_ms + tools_ms: con tools, llm_ms suma las pasadas y
 * no se sabe cuánto duró cada una, así que no se reparte. Solo lo divide el
 * primer token, que sí es un instante desde t0.
 */
export function calcularCascada(t: Tiempos): Cascada {
  const filas: FilaCascada[] = [];
  let cursor = 0;
  for (const etapa of ETAPAS_SERVIDOR) {
    const ms = t[etapa.clave];
    if (!esNumero(ms)) continue;
    filas.push({ id: etapa.id, inicio: cursor, ms, tipo: "servidor" });
    cursor += ms;
  }
  let servidorMs = cursor;

  const toolsMs = esNumero(t.tools_ms) ? t.tools_ms : 0;
  const conTools = toolsMs > 0 || (esNumero(t.pasadas_llm) && t.pasadas_llm >= 2);
  const hayLLM = esNumero(t.llm_ms) || toolsMs > 0;
  const llmMs = hayLLM ? (esNumero(t.llm_ms) ? t.llm_ms : 0) + toolsMs : 0;
  if (hayLLM) {
    const inicio = cursor;
    const fin = inicio + llmMs;
    if (esNumero(t.ttft_ms) && t.ttft_ms >= inicio && t.ttft_ms <= fin) {
      filas.push({
        id: "llm-espera",
        inicio,
        ms: Math.max(0, t.ttft_ms - inicio),
        tipo: "llm",
        fase: "espera",
      });
      filas.push({
        id: "llm-generacion",
        inicio: t.ttft_ms,
        ms: Math.max(0, fin - t.ttft_ms),
        tipo: "llm",
        fase: "generacion",
      });
    } else {
      filas.push({ id: "llm", inicio, ms: llmMs, tipo: "llm" });
    }
    cursor = fin;
  }

  const total = esNumero(t.total_ms) ? t.total_ms : cursor;
  const resto = Math.max(0, total - cursor);
  if (resto > 0) {
    filas.push({ id: "otros", inicio: cursor, ms: resto, tipo: "servidor" });
    servidorMs += resto;
  }

  const ultima = filas[filas.length - 1];
  const escala = Math.max(total, ultima ? ultima.inicio + ultima.ms : 0) || 1;

  return {
    filas,
    total,
    escala,
    ttft: esNumero(t.ttft_ms) ? t.ttft_ms : null,
    servidorMs,
    llmMs,
    hayLLM,
    conTools,
    toolsMs,
    pasadas: esNumero(t.pasadas_llm) ? t.pasadas_llm : null,
  };
}

/** Porcentaje entero del pie, sobre total_ms. */
export function porcentaje(parte: number, total: number): number {
  return total > 0 ? Math.round((parte / total) * 100) : 0;
}
