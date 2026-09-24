/**
 * Integración opcional del widget del asistente RAG, en su layout inline.
 *
 * El widget solo existe si están las tres variables de entorno. Si falta
 * cualquiera, nada se inyecta, nada falla y no se escribe en consola: el sitio
 * funciona exactamente igual sin él.
 *
 * El chat vive fuera de React. Se monta una sola vez en un host propio, que
 * pasa de un aparcamiento oculto en el <body> al hueco de la sección Agente y
 * vuelve a él cuando la sección se desmonta. Así la conversación sobrevive a
 * los remontajes de StrictMode, a la navegación entre rutas y al cambio de
 * idioma, y el script no se inyecta nunca dos veces.
 */

import type { Locale } from "@/content/types";

interface ApiWidget {
  focus?: () => void;
  setLang?: (lang: string) => void;
}

declare global {
  interface Window {
    avalonWidget?: ApiWidget;
  }
}

interface ConfiguracionWidget {
  urlWidget: string;
  urlApi: string;
  claveTenant: string;
}

/** La configuración solo si está completa. */
function leerConfiguracion(): ConfiguracionWidget | null {
  const urlWidget = import.meta.env.VITE_CHAT_WIDGET_URL;
  const urlApi = import.meta.env.VITE_CHAT_API_URL;
  const claveTenant = import.meta.env.VITE_CHAT_TENANT_KEY;

  if (!urlWidget || !urlApi || !claveTenant) return null;
  return { urlWidget, urlApi, claveTenant };
}

const configuracion = leerConfiguracion();

export const chatDisponible = configuracion !== null;

const ID_HOST = "agente-chat-host";
const ESPERA_MAXIMA_MS = 10_000;

const etiquetas: Record<Locale, string> = {
  es: "Chat con el agente de Víctor",
  en: "Chat with Víctor's agent",
};

let aparcamiento: HTMLDivElement | null = null;
let host: HTMLDivElement | null = null;
let carga: Promise<void> | null = null;

/** Crea el aparcamiento oculto y el host del chat, una sola vez. */
function obtenerHost(): HTMLDivElement {
  if (host) return host;

  aparcamiento = document.createElement("div");
  aparcamiento.hidden = true;

  host = document.createElement("div");
  host.id = ID_HOST;
  host.style.width = "100%";
  host.style.height = "100%";

  aparcamiento.appendChild(host);
  document.body.appendChild(aparcamiento);
  return host;
}

/**
 * Inyecta el script la primera vez y devuelve siempre la misma promesa. Se
 * resuelve cuando el widget publica window.avalonWidget y se rechaza si el
 * script no carga o si la API no aparece en 10 segundos.
 */
export function cargarChat(locale: Locale): Promise<void> {
  if (carga) return carga;

  carga = new Promise<void>((resolver, rechazar) => {
    if (!configuracion) {
      rechazar(new Error("widget no configurado"));
      return;
    }

    // El widget resuelve data-mount al ejecutarse: el host tiene que existir ya.
    obtenerHost();

    let intervalo: number | undefined;
    const limite = window.setTimeout(() => {
      window.clearInterval(intervalo);
      rechazar(new Error("el widget no ha publicado su API"));
    }, ESPERA_MAXIMA_MS);

    // window.avalonWidget se publica al ejecutarse el script, pero si el widget
    // sale antes por su cuenta (configuración inválida, montaje fallido) no
    // llega a existir: por eso se espera a él y no al evento load.
    const listo = () => {
      if (!window.avalonWidget) return false;
      window.clearTimeout(limite);
      window.clearInterval(intervalo);
      resolver();
      return true;
    };

    const script = document.createElement("script");
    script.src = configuracion.urlWidget;
    script.defer = true;
    script.dataset.apiUrl = configuracion.urlApi;
    script.dataset.tenantKey = configuracion.claveTenant;
    script.dataset.layout = "inline";
    script.dataset.mount = `#${ID_HOST}`;
    script.dataset.label = etiquetas[locale];
    script.addEventListener("load", () => {
      if (!listo()) intervalo = window.setInterval(listo, 100);
    });
    script.addEventListener("error", () => {
      window.clearTimeout(limite);
      window.clearInterval(intervalo);
      rechazar(new Error("widget no disponible"));
    });
    document.body.appendChild(script);
  });

  return carga;
}

/** Lleva el chat al hueco de la sección Agente. */
export function acoplarChat(hueco: HTMLElement): void {
  hueco.appendChild(obtenerHost());
}

/** Devuelve el chat al aparcamiento, fuera del árbol de React. */
export function desacoplarChat(): void {
  if (host && aparcamiento && host.parentElement !== aparcamiento) {
    aparcamiento.appendChild(host);
  }
}

/** Todavía no tiene efecto en el widget; la conexión queda hecha. */
export function cambiarIdiomaChat(locale: Locale): void {
  window.avalonWidget?.setLang?.(locale);
}
