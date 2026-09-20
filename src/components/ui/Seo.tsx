import { urlAbsoluta } from "@/lib/sitio";

/**
 * Metadatos por ruta. React 19 eleva title, meta y link al <head> desde
 * cualquier punto del árbol, así que no hace falta ninguna librería.
 *
 * Ojo: los rastreadores de LinkedIn, WhatsApp o X no ejecutan JavaScript. Lo
 * que ellos leen lo genera el script de postbuild, que escribe estas mismas
 * etiquetas en el HTML servido de cada ruta.
 */
export function Seo({
  title,
  description,
  ruta,
}: {
  title: string;
  description: string;
  ruta: string;
}) {
  const url = urlAbsoluta(ruta);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
    </>
  );
}
