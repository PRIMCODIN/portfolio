import { createContext, use } from "react";

import { contenidos } from "@/content";
import type { Locale, SiteContent } from "@/content/types";

export interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const LocaleContext = createContext<LocaleContextValue | null>(null);

function useContextoLocale(): LocaleContextValue {
  const contexto = use(LocaleContext);
  if (!contexto) {
    throw new Error("useLocale debe usarse dentro de <LocaleProvider>");
  }
  return contexto;
}

/** Idioma activo y función para cambiarlo. */
export function useLocale(): LocaleContextValue {
  return useContextoLocale();
}

/** Todo el contenido del sitio en el idioma activo. */
export function useContent(): SiteContent {
  return contenidos[useContextoLocale().locale];
}
