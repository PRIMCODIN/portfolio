import { en } from "./en";
import { es } from "./es";
import type { Locale, SiteContent } from "./types";

/** Los dos idiomas disponibles, en orden de aparición en el selector. */
export const idiomas: readonly Locale[] = ["es", "en"] as const;

export const contenidos: Record<Locale, SiteContent> = { es, en };

/** Comprueba si una cadena cualquiera es uno de los idiomas soportados. */
export function esIdiomaSoportado(valor: string | null): valor is Locale {
  return valor === "es" || valor === "en";
}

/**
 * Idioma inicial: manda lo que el visitante eligió la última vez y, si no hay
 * nada guardado, el del navegador. El catalán cae en la versión española.
 */
export function idiomaInicial(): Locale {
  if (typeof window === "undefined") return "es";

  try {
    const guardado = window.localStorage.getItem("idioma");
    if (esIdiomaSoportado(guardado)) return guardado;
  } catch {
    /* Sin localStorage: se decide por navegador. */
  }

  const preferido = window.navigator.language.toLowerCase();
  return preferido.startsWith("es") || preferido.startsWith("ca") ? "es" : "en";
}

export type { Locale, SiteContent };
