import type { Locale } from "@/content/types";

/**
 * Por idioma, si el PDF del CV estaba en public/ al compilar. Sin él, ningún
 * enlace de descarga se pinta: mejor no tener el botón que tenerlo apuntando a
 * un 404.
 */
export const cvDisponible: Record<Locale, boolean> = __CV_DISPONIBLE__;
