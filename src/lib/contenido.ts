import { esTodo, type Pendiente } from "@/content/types";

/**
 * Devuelve el valor solo si está confirmado. Un dato marcado con todo() no
 * llega nunca a la web publicada: aquí sale undefined y quien lo consume
 * decide si oculta el bloque o, en desarrollo, pinta el chip de pendiente.
 */
export function valorPublicable<T>(valor: Pendiente<T> | undefined): T | undefined {
  if (valor === undefined || esTodo(valor)) return undefined;
  return valor;
}

/** Nota del TODO, solo para mostrarla durante el desarrollo. */
export function notaPendiente(valor: unknown): string | undefined {
  return esTodo(valor) ? valor.__todo : undefined;
}
