import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { ThemeContext, temaInicial, type Tema, type ThemeContextValue } from "./theme-context";

const CLAVE = "tema";

/**
 * Tema claro u oscuro. El valor inicial ya viene fijado por el script inline de
 * index.html (para evitar el parpadeo); aquí solo se mantiene y se persiste.
 * Mientras el visitante no elija explícitamente, se sigue al sistema.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  // Si no hay elección guardada, los cambios del sistema mandan.
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-color-scheme: dark)");

    const alCambiar = (evento: MediaQueryListEvent) => {
      try {
        if (window.localStorage.getItem(CLAVE)) return;
      } catch {
        /* Sin localStorage se considera que no hay elección guardada. */
      }
      setTema(evento.matches ? "dark" : "light");
    };

    consulta.addEventListener("change", alCambiar);
    return () => consulta.removeEventListener("change", alCambiar);
  }, []);

  const alternarTema = useCallback(() => {
    setTema((actual) => {
      const siguiente: Tema = actual === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(CLAVE, siguiente);
      } catch {
        /* Sin localStorage la elección dura lo que dure la pestaña. */
      }
      return siguiente;
    });
  }, []);

  const valor = useMemo<ThemeContextValue>(() => ({ tema, alternarTema }), [tema, alternarTema]);

  return <ThemeContext value={valor}>{children}</ThemeContext>;
}
