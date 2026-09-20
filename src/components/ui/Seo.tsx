/**
 * Título del documento por ruta. React 19 lo eleva al <head> desde cualquier
 * punto del árbol, así que no hace falta ninguna librería.
 *
 * Aquí no se emiten canonical ni Open Graph a propósito: de eso se encarga el
 * script de postbuild, que los escribe en el HTML servido de cada ruta. Si
 * además los pintara React, cada página acabaría con dos etiquetas de cada y
 * los rastreadores verían canonicals en conflicto.
 */
export function Seo({ title }: { title: string }) {
  return <title>{title}</title>;
}
