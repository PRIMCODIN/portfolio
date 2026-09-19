import { createContext, use } from "react";

export type Tema = "light" | "dark";

export interface ThemeContextValue {
  tema: Tema;
  alternarTema: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const contexto = use(ThemeContext);
  if (!contexto) {
    throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  }
  return contexto;
}

/** Lee el tema que el script inline de index.html ya dejó fijado en <html>. */
export function temaInicial(): Tema {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}
