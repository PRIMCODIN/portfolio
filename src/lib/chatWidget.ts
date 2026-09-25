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
 *
 * Desde lg el widget delega en la página los detalles técnicos de cada turno
 * (inspector externo): este módulo escucha sus eventos y los publica en un
 * store mínimo que la sección Agente lee con useSyncExternalStore. El estado
 * del modo técnico se sigue a cualquier ancho, porque de él depende el CTA.
 */

import type { Locale } from "@/content/types";

/**
 * Métricas de un turno tal como las emite el widget. Todas las claves son
 * opcionales: los mensajes guardados con versiones anteriores del API traen
 * menos, y se pinta solo lo que haya.
 */
export interface MetricasTurno {
  modelo?: string;
  proveedor?: string;
  tokens?: { entrada?: number; salida?: number };
  coste_usd?: number | null;
  tools?: unknown;
  tiempos?: {
    limites_ms?: number;
    conversacion_ms?: number;
    guardar_usuario_ms?: number;
    embeddings_ms?: number;
    match_chunks_ms?: number;
    ttft_ms?: number;
    llm_ms?: number;
    pasadas_llm?: number;
    tools_ms?: number;
    total_ms?: number;
  };
  fuentes?: FuenteTurno[];
  retrieval?: RetrievalTurno | null;
  sesion?: unknown;
}

export interface FuenteTurno {
  documento?: string;
  seccion?: string;
  posicion?: number;
}

export interface RetrievalTurno {
  consultas?: { id?: string; tipo?: string; texto?: string }[];
  candidatos?: number;
  fragmentos?: FragmentoTurno[];
}

export interface FragmentoTurno {
  posicion?: number;
  documento?: string;
  seccion?: string;
  contenido?: string;
  similitud?: number;
  consultas?: string[];
  rrf?: number;
}

interface DetalleModoTecnico {
  activo: boolean;
}

interface DetalleTurno {
  origen: "nuevo" | "seleccion";
  /** null: la conversación se ha borrado. */
  metricas: MetricasTurno | null;
}

interface ApiWidget {
  focus?: () => void;
  setLang?: (lang: string) => void;
  activarInspectorExterno?: (activo: boolean) => void;
  setModoTecnico?: (activo: boolean) => void;
  /** null si el tenant no tiene modo técnico o aún no hay configuración. */
  getModoTecnico?: () => boolean | null;
}

declare global {
  interface Window {
    avalonWidget?: ApiWidget;
  }

  interface WindowEventMap {
    "chat:modo-tecnico": CustomEvent<DetalleModoTecnico>;
    "chat:turno": CustomEvent<DetalleTurno>;
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
  seguirModoTecnico();
  conectarInspector();
}

/** Devuelve el chat al aparcamiento, fuera del árbol de React. */
export function desacoplarChat(): void {
  dejarDeSeguirModoTecnico();
  desconectarInspector();
  if (host && aparcamiento && host.parentElement !== aparcamiento) {
    aparcamiento.appendChild(host);
  }
}

/* --------------------------------------------------------------------------
   Inspector externo
   -------------------------------------------------------------------------- */

export type PestanaInspector = "tiempos" | "busqueda";

export interface EstadoInspector {
  /** El widget delega en la página: solo desde lg y con el chat acoplado. */
  conectado: boolean;
  /** El widget tiene setModoTecnico y el tenant, modo técnico. A cualquier
   *  ancho, con el chat acoplado. */
  tecnicoDisponible: boolean;
  modoTecnico: boolean;
  metricas: MetricasTurno | null;
  /** Sube con cada chat:turno. Sirve de key para reiniciar el inspector. */
  turno: number;
  /** Pestaña elegida en el inspector. Vive aquí para sobrevivir al cambio de
   *  turno, que remonta el componente. */
  pestana: PestanaInspector;
}

const INSPECTOR_INICIAL: EstadoInspector = {
  conectado: false,
  tecnicoDisponible: false,
  modoTecnico: false,
  metricas: null,
  turno: 0,
  pestana: "tiempos",
};

/** Por debajo de lg el widget usa su propio panel técnico. */
const CONSULTA_LG = "(min-width: 1024px)";

let estadoInspector = INSPECTOR_INICIAL;
const suscriptores = new Set<() => void>();
let consultaLg: MediaQueryList | null = null;
let inspectorActivo = false;

function actualizarInspector(cambios: Partial<EstadoInspector>): void {
  estadoInspector = { ...estadoInspector, ...cambios };
  suscriptores.forEach((avisar) => avisar());
}

export function suscribirInspector(avisar: () => void): () => void {
  suscriptores.add(avisar);
  return () => suscriptores.delete(avisar);
}

export function leerInspector(): EstadoInspector {
  return estadoInspector;
}

export function leerInspectorServidor(): EstadoInspector {
  return INSPECTOR_INICIAL;
}

export function elegirPestana(pestana: PestanaInspector): void {
  actualizarInspector({ pestana });
}

/** Lo mismo que pulsar el interruptor del widget. El store se entera por
 *  chat:modo-tecnico, como con el interruptor. */
export function activarModoTecnico(): void {
  window.avalonWidget?.setModoTecnico?.(true);
}

/** El modo técnico según el widget. null si no lo tiene el tenant, si aún no
 *  hay configuración o si el widget es anterior a getModoTecnico. */
function leerModoTecnico(): boolean | null {
  const widget = window.avalonWidget;
  if (typeof widget?.setModoTecnico !== "function") return null;
  if (typeof widget.getModoTecnico !== "function") return null;
  return widget.getModoTecnico() ?? null;
}

function alCambiarModo(evento: WindowEventMap["chat:modo-tecnico"]): void {
  actualizarInspector({
    tecnicoDisponible: leerModoTecnico() !== null,
    modoTecnico: evento.detail.activo === true,
  });
}

let siguiendoModo = false;

/**
 * Escucha el modo técnico a cualquier ancho y parte del estado real. Si el
 * widget aún no tiene la configuración, el getter da null y el estado llega
 * con el chat:modo-tecnico inicial. Idempotente, como conectarInspector.
 */
function seguirModoTecnico(): void {
  if (siguiendoModo) return;
  siguiendoModo = true;
  window.addEventListener("chat:modo-tecnico", alCambiarModo);

  const inicial = leerModoTecnico();
  actualizarInspector({ tecnicoDisponible: inicial !== null, modoTecnico: inicial === true });
}

function dejarDeSeguirModoTecnico(): void {
  if (!siguiendoModo) return;
  siguiendoModo = false;
  window.removeEventListener("chat:modo-tecnico", alCambiarModo);
  actualizarInspector({ tecnicoDisponible: false, modoTecnico: false });
}

function alCambiarTurno(evento: WindowEventMap["chat:turno"]): void {
  actualizarInspector({
    metricas: evento.detail.metricas ?? null,
    turno: estadoInspector.turno + 1,
  });
}

function activarInspector(activo: boolean): void {
  if (activo === inspectorActivo) return;
  inspectorActivo = activo;

  if (activo) {
    // El listener va antes de registrarse: el widget emite el estado actual
    // en el mismo momento. El de chat:modo-tecnico ya está puesto.
    window.addEventListener("chat:turno", alCambiarTurno);
    actualizarInspector({ conectado: true });
    window.avalonWidget?.activarInspectorExterno?.(true);
  } else {
    // modoTecnico no se toca: por debajo de lg lo sigue necesitando el CTA.
    window.removeEventListener("chat:turno", alCambiarTurno);
    window.avalonWidget?.activarInspectorExterno?.(false);
    actualizarInspector({ conectado: false, metricas: null });
  }
}

function alCruzarLg(evento: MediaQueryListEvent): void {
  activarInspector(evento.matches);
}

/** Idempotente: StrictMode puede acoplar dos veces. */
function conectarInspector(): void {
  if (consultaLg || !window.avalonWidget?.activarInspectorExterno) return;
  consultaLg = window.matchMedia(CONSULTA_LG);
  consultaLg.addEventListener("change", alCruzarLg);
  activarInspector(consultaLg.matches);
}

/** Idempotente: el cleanup de Agente llama aunque nunca se haya acoplado. */
function desconectarInspector(): void {
  if (!consultaLg) return;
  consultaLg.removeEventListener("change", alCruzarLg);
  consultaLg = null;
  activarInspector(false);
}

/** Todavía no tiene efecto en el widget; la conexión queda hecha. */
export function cambiarIdiomaChat(locale: Locale): void {
  window.avalonWidget?.setLang?.(locale);
}
