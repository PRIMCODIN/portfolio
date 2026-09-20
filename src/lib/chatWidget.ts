/**
 * Integración opcional del widget del asistente RAG.
 *
 * El widget solo se carga si están las tres variables de entorno. Si falta
 * cualquiera, nada se inyecta, nada falla y no se escribe en consola: el sitio
 * funciona exactamente igual sin él.
 */

interface ConfiguracionWidget {
  urlWidget: string;
  urlApi: string;
  claveTenant: string;
}

/** Devuelve la configuración solo si está completa. */
export function configuracionWidget(): ConfiguracionWidget | null {
  const urlWidget = import.meta.env.VITE_CHAT_WIDGET_URL;
  const urlApi = import.meta.env.VITE_CHAT_API_URL;
  const claveTenant = import.meta.env.VITE_CHAT_TENANT_KEY;

  if (!urlWidget || !urlApi || !claveTenant) return null;
  return { urlWidget, urlApi, claveTenant };
}

const ID_SCRIPT = "avalon-widget";

/** Inyecta el script del widget una sola vez. Resuelve cuando está listo. */
export function cargarWidget(config: ConfiguracionWidget): Promise<void> {
  const existente = document.getElementById(ID_SCRIPT);
  if (existente) return Promise.resolve();

  return new Promise((resolver, rechazar) => {
    const script = document.createElement("script");
    script.id = ID_SCRIPT;
    script.src = config.urlWidget;
    script.defer = true;
    script.dataset.apiUrl = config.urlApi;
    script.dataset.tenantKey = config.claveTenant;
    script.addEventListener("load", () => resolver());
    script.addEventListener("error", () => rechazar(new Error("widget no disponible")));
    document.body.appendChild(script);
  });
}

/** Abre el widget si expone una API global; si no, no hace nada. */
export function abrirWidget(): void {
  const global = window as unknown as { avalonWidget?: { open?: () => void } };
  global.avalonWidget?.open?.();
}
