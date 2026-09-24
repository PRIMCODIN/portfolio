# Portfolio — Víctor Prim Romero

Web personal orientada a la búsqueda de empleo: proyectos, experiencia, CV y
el agente RAG embebido. Sitio estático, sin backend, bilingüe español/inglés,
con tema claro y oscuro.

**Stack:** Vite · React 19 · TypeScript estricto · Tailwind CSS v4 · React Router.

## Puesta en marcha

```bash
npm install
npm run dev        # servidor de desarrollo
npm run check      # tipos + ESLint + formato
npm run build      # genera dist/
npm run preview    # sirve dist/ en local
```

`npm run build` ejecuta el type-check, compila con Vite y lanza
`scripts/postbuild.ts`, que es el que escribe los metadatos por ruta, el
sitemap, el robots.txt, el llms.txt y el 404.html.

## Editar el contenido

Ningún componente lleva texto escrito a mano. **Todo** vive en dos ficheros:

- `src/content/es.ts`
- `src/content/en.ts`

Los dos se validan contra el tipo `SiteContent` de `src/content/types.ts` con
`satisfies`, así que si se añade una clave en español y se olvida en inglés,
`npm run check` falla. Para cambiar un texto de la web, se cambia ahí y ya.

### Datos que aún no están confirmados

Un valor que todavía no se puede publicar se envuelve con `todo()`:

```ts
cvHref: todo("subir public/cv.pdf actualizado y sustituir este valor por /cv.pdf"),
```

En desarrollo aparece un chip ámbar con la nota al lado del hueco. **En
producción ese bloque no se renderiza**, de modo que ni un marcador ni un dato
sin verificar llegan nunca a la web publicada. Cuando el dato esté confirmado,
se sustituye la llamada por el valor real y aparece solo.

### Añadir un proyecto

Una entrada más en `proyectos.items` de los dos ficheros de contenido:

```ts
{
  id: "mi-proyecto",
  visible: true,        // false lo conserva en el contenido pero no lo pinta
  destacado: false,     // true lo sube al bento grande (7 o 5 columnas)
  titulo: "Mi proyecto",
  resumen: "Qué resuelve y qué decisión técnica lo hizo posible.",
  rol: "Proyecto propio · backend",
  estado: "En desarrollo",
  stack: ["Python", "FastAPI"],
  repo: "https://github.com/PRIMCODIN/mi-proyecto",  // opcional
  demo: "https://...",                                // opcional
  casoDeEstudio: "mi-proyecto",                       // opcional, ver abajo
}
```

El bento reparte columnas solo: los dos primeros destacados ocupan 7 y 5
columnas, el resto 4.

### Añadir un caso de estudio

1. Añade una entrada a `casosDeEstudio` en `es.ts` y `en.ts` con la misma clave
   (que es el slug de la URL) siguiendo el tipo `CasoDeEstudio`: `problema`,
   `arquitectura`, `decisiones` y `resultados`.
2. Apunta el proyecto correspondiente con `casoDeEstudio: "<slug>"`.

No hay que tocar ningún componente: `src/pages/CaseStudy.tsx` es genérico y la
ruta `/proyectos/:slug` ya existe. El postbuild detecta el caso nuevo y le
genera su HTML y su entrada en el sitemap automáticamente.

El diagrama de arquitectura sí es propio de cada caso: el del chatbot RAG vive en
`src/case-studies/chatbot-rag/ArchitectureDiagram.tsx`, con las posiciones de las
cajas en el componente y los textos en el contenido. Para un caso nuevo, se
copia ese fichero como punto de partida.

## Activar el widget del asistente

La sección «Agente», su enlace en la navegación, el botón del hero y la carga
del script solo existen si están **las tres** variables. Si falta cualquiera,
no se renderiza nada y no se produce ningún error. Copia `.env.example` a `.env` y rellena:

```bash
VITE_CHAT_WIDGET_URL=https://asistente.ejemplo.com/widget/widget.js
VITE_CHAT_API_URL=https://asistente.ejemplo.com
VITE_CHAT_TENANT_KEY=clave-del-tenant
```

`VITE_CHAT_API_URL` va **sin sufijo de ruta**: el widget le concatena
`/v1/config` y `/v1/chat`, así que un `/api` al final acabaría pidiendo
`/api/v1/config`. La clave del tenant no es un secreto —viaja en un atributo
`data-` del HTML—, así que no necesita tratarse como tal.

El widget se usa en su layout inline (`data-layout="inline"`). El script se
inyecta una sola vez, con `defer`, cuando la sección Agente se acerca al
viewport o al pulsar el botón del hero. El chat se monta en un host propio que
`src/lib/chatWidget.ts` mueve entre un aparcamiento oculto y el hueco de la
sección, así que la conversación sobrevive a cambiar de idioma o de ruta. Si
`window.avalonWidget` no aparece en 10 segundos, la sección muestra un aviso con
un enlace a Contacto.

Las tres se resuelven **en tiempo de build**: Vite sustituye cada
`import.meta.env.VITE_*` al compilar, así que cambiarlas exige reconstruir, y
sin ellas el bloque no llega siquiera al bundle. En un build en la nube tienen
que estar en el entorno de build del proveedor; las variables de runtime del
Worker (`vars` de `wrangler.jsonc`) **no** sirven, porque nunca llegan a Vite.

El aspecto y el copy del chat no salen de aquí, sino de la configuración del
tenant en el servidor. Con `tema: auto` el widget sigue el `data-theme` del
`<html>` del portfolio, así que el toggle claro/oscuro lo arrastra sin que haya
que configurar nada en este repo.

## Despliegue

Antes de desplegar, **define `VITE_SITE_URL`** con el dominio real y sin barra
final. Sin ella, las URLs canónicas y de Open Graph se emiten relativas y no se
genera el sitemap; el build lo avisa por consola.

```bash
VITE_SITE_URL=https://tudominio.com npm run build
```

### Cloudflare Workers

El sitio se despliega como Worker con assets estáticos, vía
`@cloudflare/vite-plugin`. `wrangler.jsonc` (en la raíz; el de `src/` no se usa)
declara `not_found_handling: "single-page-application"`, que es el fallback del
router y sustituye al viejo `public/_redirects`. Los ficheros estáticos tienen
prioridad sobre ese fallback, así que las rutas prerenderizadas se sirven con
sus propios metadatos.

```bash
npm run preview   # build + wrangler dev, en local
npm run deploy    # build + wrangler deploy
```

Lanzado desde esta máquina, el build lee el `.env` local. Si el build corre en
la nube (Workers Builds, CI), hay que declarar allí las variables **de build**,
no las de runtime del Worker:

- Build command: `npm run build`
- Output directory: `dist`
- Variables de entorno: `VITE_SITE_URL`, `VITE_CHAT_WIDGET_URL`,
  `VITE_CHAT_API_URL`, `VITE_CHAT_TENANT_KEY`

Ojo con el CORS del asistente: el origen desde el que se sirve el sitio tiene
que estar en la lista del servidor del widget. `wrangler dev` usa el puerto
8787, que es un origen distinto del `5173` de `npm run dev`.

### GitHub Pages

Sube el contenido de `dist/`. El `404.html` que genera el postbuild es el
fallback para las rutas del router. Si el sitio no cuelga de la raíz del
dominio, hay que añadir `base` en `vite.config.ts`.

### Caddy en un VPS

```caddy
tudominio.com {
    root * /var/www/portfolio/dist
    encode zstd gzip
    try_files {path} {path}.html {path}/index.html /index.html
    file_server

    @estaticos path /fonts/* /assets/*
    header @estaticos Cache-Control "public, max-age=31536000, immutable"
}
```

El orden de `try_files` importa: `{path}.html` y `{path}/index.html` tienen que
ir **antes** que `/index.html`, o el fallback se comería las rutas
prerenderizadas y los rastreadores verían siempre los metadatos de la portada.

## Cómo está resuelto lo que no se ve

**Prerender de metadatos.** LinkedIn, WhatsApp y X no ejecutan JavaScript: las
etiquetas que React inyecta al montar no las ven nunca. `scripts/postbuild.ts`
escribe un HTML por ruta con su `title`, `description`, `canonical` y sus
etiquetas Open Graph y Twitter ya dentro del documento servido. Los valores
salen del mismo contenido tipado que usa la web —Node lee los `.ts`
directamente—, así que no hay un solo texto duplicado. No hay SSR.

Por eso `src/components/ui/Seo.tsx` solo emite el `<title>`: si React pintara
también el canonical, cada página tendría dos y los rastreadores verían
canonicals en conflicto.

**Tema sin parpadeo.** Un script inline en `index.html` fija `data-theme` en
`<html>` antes del primer pintado, leyendo `localStorage` y, si no hay nada
guardado, `prefers-color-scheme`.

**Tipografías.** Geist y Geist Mono autoalojadas, variables y solo con el
subconjunto latino (52 kB las dos), precargadas desde `public/fonts`. Vienen de
`@fontsource-variable/*`; para actualizarlas, se copian de nuevo los `.woff2`
desde `node_modules`.

**Campo de puntos del hero.** Canvas sin librerías. Se detiene al salir del
viewport y con la pestaña en segundo plano, y no llega a arrancar el bucle si
el visitante pide reducir el movimiento o no hay puntero fino.

**Imagen Open Graph.** Se genera desde la ruta `/og`, que solo existe en
desarrollo: `npm run dev`, abrir `http://localhost:5173/og`, capturar la
tarjeta de 1200×630 y guardarla como `public/og.png`. El postbuild lee sus
dimensiones reales del PNG para declararlas en las etiquetas.

## Resultados de Lighthouse

Medido sobre `npm run preview`, con Chrome en modo headless.

| Página          | Perfil     | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
| --------------- | ---------- | ----------: | ------------: | ---------------: | --: |
| Portada         | Escritorio |         100 |           100 |              100 | 100 |
| Portada         | Móvil      |          99 |           100 |              100 | 100 |
| Caso de estudio | Móvil      |          99 |           100 |              100 | 100 |

CLS 0 en las tres. En móvil: FCP 1,4 s · LCP 2,0 s · TBT 70 ms.
