import assert from "node:assert/strict";
import { test } from "node:test";

import { calcularCascada, porcentaje, type Tiempos } from "./cascada.ts";

/**
 * Paridad con cascadaDe de widget/widget.js. Las entradas son los `tiempos`
 * de SINTETICOS en scripts/verificar_modo_tecnico.py (avalon-agent) y los
 * valores esperados, los que dio su paso i contra el widget.
 */

const NORMAL: Tiempos = {
  limites_ms: 26,
  conversacion_ms: 36,
  guardar_usuario_ms: 14,
  embeddings_ms: 4540,
  match_chunks_ms: 29,
  ttft_ms: 5401,
  llm_ms: 2748,
  pasadas_llm: 1,
  tools_ms: 0,
  total_ms: 7399,
};

const TOOLS: Tiempos = {
  limites_ms: 41,
  conversacion_ms: 88,
  embeddings_ms: 312,
  match_chunks_ms: 176,
  guardar_usuario_ms: 63,
  ttft_ms: 2405,
  llm_ms: 3120,
  pasadas_llm: 2,
  tools_ms: 118,
  total_ms: 4052,
};

const LIMITE: Tiempos = {
  limites_ms: 36,
  conversacion_ms: 79,
  guardar_usuario_ms: 54,
  total_ms: 231,
};

/** Las filas como pares id → ms, en orden. */
function filas(t: Tiempos): [string, number][] {
  return calcularCascada(t).filas.map((f) => [f.id, f.ms]);
}

test("turno normal", () => {
  const r = calcularCascada(NORMAL);
  assert.deepEqual(filas(NORMAL), [
    ["limites", 26],
    ["conversacion", 36],
    ["embeddings", 4540],
    ["busqueda", 29],
    ["guardar", 14],
    ["llm-espera", 756],
    ["llm-generacion", 1992],
    ["otros", 6],
  ]);
  assert.equal(r.ttft, 5401);
  assert.equal(r.total, 7399);
  assert.equal(r.servidorMs, 4651);
  assert.equal(porcentaje(r.servidorMs, r.total), 63);
  assert.equal(r.llmMs, 2748);
  assert.equal(porcentaje(r.llmMs, r.total), 37);
  assert.equal(r.conTools, false);
});

test("turno con tools", () => {
  const r = calcularCascada(TOOLS);
  assert.deepEqual(filas(TOOLS), [
    ["limites", 41],
    ["conversacion", 88],
    ["embeddings", 312],
    ["busqueda", 176],
    ["guardar", 63],
    ["llm-espera", 1725],
    ["llm-generacion", 1513],
    ["otros", 134],
  ]);
  assert.equal(r.ttft, 2405);
  assert.equal(r.servidorMs, 814);
  assert.equal(porcentaje(r.servidorMs, r.total), 20);
  assert.equal(r.llmMs, 3238);
  assert.equal(porcentaje(r.llmMs, r.total), 80);
  assert.equal(r.conTools, true);
  assert.equal(r.pasadas, 2);
  assert.equal(r.toolsMs, 118);
});

test("turno cortado por límite", () => {
  const r = calcularCascada(LIMITE);
  assert.deepEqual(filas(LIMITE), [
    ["limites", 36],
    ["conversacion", 79],
    ["guardar", 54],
    ["otros", 62],
  ]);
  assert.equal(r.ttft, null);
  assert.equal(r.hayLLM, false);
  assert.ok(r.filas.every((f) => f.tipo === "servidor"));
  assert.equal(r.servidorMs, 231);
  assert.equal(porcentaje(r.servidorMs, r.total), 100);
});

test("las filas se colocan una detrás de otra", () => {
  for (const t of [NORMAL, TOOLS, LIMITE]) {
    const r = calcularCascada(t);
    r.filas.forEach((f, i) => {
      const anterior = r.filas[i - 1];
      assert.equal(f.inicio, anterior ? anterior.inicio + anterior.ms : 0);
    });
  }
});
