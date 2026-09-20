import { useCallback, useSyncExternalStore } from "react";

/**
 * Suscribe un componente a una media query. Se usa useSyncExternalStore en
 * lugar de un efecto con estado porque el navegador ya es la fuente de verdad:
 * así no hay renders en cascada ni valores desincronizados.
 */
export function useMediaQuery(consulta: string): boolean {
  const suscribir = useCallback(
    (alCambiar: () => void) => {
      const mql = window.matchMedia(consulta);
      mql.addEventListener("change", alCambiar);
      return () => mql.removeEventListener("change", alCambiar);
    },
    [consulta],
  );

  const leer = useCallback(() => window.matchMedia(consulta).matches, [consulta]);

  return useSyncExternalStore(suscribir, leer, () => false);
}

/** true si el visitante ha pedido reducir el movimiento. */
export function usePrefiereMenosMovimiento(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
