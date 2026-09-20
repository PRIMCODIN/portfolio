/**
 * URL pública del sitio, sin barra final. Se define en el build con
 * VITE_SITE_URL (ver .env.example). Si no está, las URLs canónicas y de Open
 * Graph se emiten relativas en lugar de inventarse un dominio.
 */
export const SITIO = (import.meta.env.VITE_SITE_URL ?? "").replace(/\/+$/, "");

/** Convierte una ruta del sitio en URL absoluta, si hay dominio configurado. */
export function urlAbsoluta(ruta: string): string {
  return SITIO ? `${SITIO}${ruta}` : ruta;
}
