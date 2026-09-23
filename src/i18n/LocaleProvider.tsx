import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { idiomaInicial } from "@/content";
import type { Locale } from "@/content/types";
import { cambiarIdiomaChat } from "@/lib/chatWidget";
import { LocaleContext, type LocaleContextValue } from "./locale-context";

/**
 * Mantiene el idioma activo, lo persiste y lo refleja en el atributo lang del
 * documento, que es lo que leen los lectores de pantalla y los buscadores, y
 * en el widget del chat si está cargado.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleEstado] = useState<Locale>(idiomaInicial);

  useEffect(() => {
    document.documentElement.lang = locale;
    cambiarIdiomaChat(locale);
  }, [locale]);

  const setLocale = useCallback((siguiente: Locale) => {
    setLocaleEstado(siguiente);
    try {
      window.localStorage.setItem("idioma", siguiente);
    } catch {
      /* Sin localStorage la elección dura lo que dure la pestaña. */
    }
  }, []);

  const valor = useMemo<LocaleContextValue>(() => ({ locale, setLocale }), [locale, setLocale]);

  return <LocaleContext value={valor}>{children}</LocaleContext>;
}
