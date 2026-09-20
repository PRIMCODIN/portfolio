import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

import { es } from "../src/content/es.ts";

/**
 * Prerender de metadatos. Los rastreadores de LinkedIn, WhatsApp o X no
 * ejecutan JavaScript, así que las etiquetas que React inyecta al montar no
 * las ven nunca. Este script escribe un index.html por ruta con su title, su
 * description, su canonical y sus etiquetas Open Graph y Twitter ya dentro del
 * HTML servido.
 *
 * No hay SSR ni duplicado de textos: los valores salen del mismo contenido
 * tipado que usa la web (src/content/es.ts), que Node lee directamente.
 */

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(RAIZ, "dist");

const entorno = loadEnv(process.env.NODE_ENV ?? "production", RAIZ, "VITE_");
const SITIO = (entorno.VITE_SITE_URL ?? "").replace(/\/+$/, "");

const MARCA_INICIO = "<!-- meta:inicio -->";
const MARCA_FIN = "<!-- meta:fin -->";

interface ImagenOg {
  ruta: string;
  ancho: number;
  alto: number;
}

interface Ruta {
  /** Ruta pública, empezando por barra. */
  ruta: string;
  title: string;
  description: string;
  /** Prioridad en el sitemap. */
  prioridad: string;
}

const rutas: Ruta[] = [
  { ruta: "/", title: es.seo.title, description: es.seo.description, prioridad: "1.0" },
  ...Object.values(es.casosDeEstudio).map((caso) => ({
    ruta: `/proyectos/${caso.slug}`,
    title: caso.seo.title,
    description: caso.seo.description,
    prioridad: "0.8",
  })),
];

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function absoluta(ruta: string): string {
  return SITIO ? `${SITIO}${ruta}` : ruta;
}

/** Datos estructurados Person, solo en la portada. */
function datosEstructurados(): string {
  const persona = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: es.hero.nombre,
    jobTitle: es.hero.titular,
    description: es.seo.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Barcelona",
      addressCountry: "ES",
    },
    knowsLanguage: ["es", "ca", "en"],
    sameAs: [es.hero.github.href, es.hero.linkedin.href],
    ...(SITIO ? { url: SITIO } : {}),
  };

  return `<script type="application/ld+json">${JSON.stringify(persona)}</script>`;
}

/** Lee ancho y alto de la cabecera IHDR de un PNG. */
function medidasPng(archivo: string): { ancho: number; alto: number } | null {
  const cabecera = readFileSync(archivo).subarray(0, 24);
  if (cabecera.length < 24 || cabecera.toString("ascii", 12, 16) !== "IHDR") return null;
  return { ancho: cabecera.readUInt32BE(16), alto: cabecera.readUInt32BE(20) };
}

function bloqueDeMetadatos(ruta: Ruta, imagenOg: ImagenOg | null): string {
  const url = absoluta(ruta.ruta);
  const etiquetas = [
    `<meta name="description" content="${escapar(ruta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapar(es.hero.nombre)}" />`,
    `<meta property="og:locale" content="es_ES" />`,
    `<meta property="og:title" content="${escapar(ruta.title)}" />`,
    `<meta property="og:description" content="${escapar(ruta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapar(ruta.title)}" />`,
    `<meta name="twitter:description" content="${escapar(ruta.description)}" />`,
  ];

  if (imagenOg) {
    etiquetas.push(
      `<meta property="og:image" content="${absoluta(imagenOg.ruta)}" />`,
      `<meta property="og:image:width" content="${imagenOg.ancho}" />`,
      `<meta property="og:image:height" content="${imagenOg.alto}" />`,
      `<meta property="og:image:alt" content="${escapar(es.hero.nombre)} — ${escapar(es.hero.titular)}" />`,
      `<meta name="twitter:image" content="${absoluta(imagenOg.ruta)}" />`,
    );
  }

  if (ruta.ruta === "/") etiquetas.push(datosEstructurados());

  return [MARCA_INICIO, ...etiquetas, MARCA_FIN].join("\n    ");
}

function escribirRuta(plantilla: string, ruta: Ruta, imagenOg: ImagenOg | null): void {
  let html = plantilla.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapar(ruta.title)}</title>`);

  const bloque = bloqueDeMetadatos(ruta, imagenOg);
  html = html.includes(MARCA_INICIO)
    ? html.replace(new RegExp(`${MARCA_INICIO}[\\s\\S]*?${MARCA_FIN}`), bloque)
    : html.replace("</head>", `  ${bloque}\n  </head>`);

  if (ruta.ruta === "/") {
    writeFileSync(join(DIST, "index.html"), html, "utf8");
    return;
  }

  // Se escriben las dos formas que resuelven los alojamientos estáticos:
  // /proyectos/avalon-agent.html y /proyectos/avalon-agent/index.html. Con una
  // sola, un servidor que no resuelva el índice de directorio para rutas sin
  // barra final acabaría sirviendo el HTML de la portada, y el rastreador de
  // turno leería el título y la imagen equivocados.
  for (const destino of [join(DIST, `${ruta.ruta}.html`), join(DIST, ruta.ruta, "index.html")]) {
    mkdirSync(dirname(destino), { recursive: true });
    writeFileSync(destino, html, "utf8");
  }
}

function escribirSitemapYRobots(): void {
  const lineas = rutas
    .map(
      (ruta) =>
        `  <url>\n    <loc>${absoluta(ruta.ruta)}</loc>\n    <priority>${ruta.prioridad}</priority>\n  </url>`,
    )
    .join("\n");

  if (SITIO) {
    writeFileSync(
      join(DIST, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lineas}\n</urlset>\n`,
      "utf8",
    );
  }

  const robots = SITIO
    ? `User-agent: *\nAllow: /\n\nSitemap: ${SITIO}/sitemap.xml\n`
    : `User-agent: *\nAllow: /\n`;
  writeFileSync(join(DIST, "robots.txt"), robots, "utf8");
}

/**
 * llms.txt: resumen del sitio en markdown para agentes y modelos, que cada vez
 * más leen esto antes que el HTML. Sale del mismo contenido que la web.
 */
function escribirLlmsTxt(): void {
  const proyectos = es.proyectos.items
    .filter((proyecto) => proyecto.visible)
    .map((proyecto) => `- **${proyecto.titulo}** (${proyecto.estado}): ${proyecto.resumen}`);

  const servicios = es.servicios.items.map(
    (servicio) => `- **${servicio.titulo}**: ${servicio.descripcion}`,
  );

  const texto = [
    `# ${es.hero.nombre}`,
    "",
    `> ${es.hero.titular}. ${es.hero.propuesta}`,
    "",
    es.disponibilidad,
    "",
    "## Quién soy",
    "",
    ...es.sobreMi.parrafos,
    "",
    "## Proyectos",
    "",
    ...proyectos,
    "",
    "## Servicios",
    "",
    ...servicios,
    "",
    "## Enlaces",
    "",
    `- GitHub: ${es.hero.github.href}`,
    `- LinkedIn: ${es.hero.linkedin.href}`,
    ...(SITIO ? [`- Caso de estudio: ${SITIO}/proyectos/avalon-agent`] : []),
    "",
  ].join(String.fromCharCode(10));

  writeFileSync(join(DIST, "llms.txt"), texto, "utf8");
}

function principal(): void {
  const plantilla = readFileSync(join(DIST, "index.html"), "utf8");
  // Las medidas se leen del propio PNG: declararlas a ojo es pedir que un día
  // dejen de coincidir con el archivo.
  const archivoOg = join(DIST, "og.png");
  const medidas = existsSync(archivoOg) ? medidasPng(archivoOg) : null;
  const imagenOg: ImagenOg | null = medidas
    ? { ruta: "/og.png", ancho: medidas.ancho, alto: medidas.alto }
    : null;

  for (const ruta of rutas) escribirRuta(plantilla, ruta, imagenOg);

  // GitHub Pages sirve 404.html cuando la ruta no existe: es el fallback SPA.
  copyFileSync(join(DIST, "index.html"), join(DIST, "404.html"));

  escribirSitemapYRobots();
  escribirLlmsTxt();

  const avisos: string[] = [];
  if (!SITIO)
    avisos.push(
      "VITE_SITE_URL sin definir: canonical y Open Graph quedan relativos y no se genera sitemap.xml",
    );
  if (!imagenOg)
    avisos.push("sin imagen Open Graph en public/: se omiten og:image y twitter:image");

  console.log(
    `postbuild: ${rutas.length} rutas prerenderizadas (${rutas.map((r) => r.ruta).join(", ")})`,
  );
  for (const aviso of avisos) console.log(`postbuild: aviso — ${aviso}`);
}

principal();
