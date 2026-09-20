# BRIEF — Portfolio personal de Víctor Prim Romero

Este fichero es la fuente de verdad del proyecto. Contiene el encargo, la dirección de diseño y todos los datos del perfil. Léelo entero antes de empezar y vuelve a él ante cualquier duda de contenido.

Fuentes consolidadas: perfil de LinkedIn (linkedin.com/in/victor-prim-romero), GitHub (github.com/PRIMCODIN y los README de sus repos) y notas propias. Donde las fuentes no coinciden, está indicado.

---

## 1. Encargo

Crear desde cero mi web personal con dos objetivos:

1. **Ahora:** escaparate para encontrar trabajo como desarrollador (backend, IA aplicada, fullstack).
2. **A medio plazo:** marca personal para vender servicios freelance de automatización con IA, asistentes RAG, integraciones y apps a medida.

Tiene que parecer hecha por alguien que cuida el detalle: elegante, rápida, sobria y técnica. Nada de plantilla genérica.

### Reglas de trabajo

- Antes de escribir código, preséntame: estructura de carpetas, decisiones de stack con su porqué, sistema de diseño (tipografías, escala tipográfica, colores, grid, espaciados) y un esquema de cada sección. Espera mi OK.
- Comentarios de código en español. La web en español con versión en inglés.
- **No inventes datos.** Métricas, fechas, empresas o logros que no estén en este brief van como `TODO` en los ficheros de contenido, nunca en la UI final sin marcar.
- Al terminar cada bloque de trabajo, propón un mensaje de commit (no hagas push).
- Si existe `docs/cv.pdf`, léelo y enumera cualquier contradicción con este brief antes de usarlo.

---

## 2. Stack

- Vite + React + TypeScript.
- Tailwind CSS, con los tokens de diseño como variables CSS (tema claro y oscuro).
- `motion` (Framer Motion) solo para microinteracciones y apariciones al hacer scroll. Nada de 3D ni librerías pesadas.
- Tipografías autoalojadas con Fontsource: una sans geométrica para display y cuerpo (tipo Geist o Inter Tight) y una mono para etiquetas técnicas. Propón la combinación.
- React Router solo para las páginas de caso de estudio.
- Salida estática (`dist/`) desplegable en Cloudflare Pages, GitHub Pages o detrás de Caddy en un VPS. Sin backend propio.

---

## 3. Dirección de diseño

Referencia de ambiente: la landing de Google Antigravity (el IDE). Inspiración de sensación, no copia: nada de sus assets, logos ni textos.

- Fondo claro por defecto, mucho espacio en blanco, tipografía de display grande con tracking ajustado.
- **Clean grid:** retícula visible pero sutil (líneas de 1px en gris muy claro) que estructura la página; secciones y tarjetas alineadas a ella. Composiciones tipo bento para proyectos y stack.
- Un único color de acento usado con moderación (propón uno) sobre grises neutros.
- Detalle técnico en tipografía mono para etiquetas pequeñas (p. ej. `// 01 — Proyectos`, stack, estado de un proyecto).
- Hero con un campo sutil de puntos o partículas en canvas que reacciona al cursor: ligero, sin librerías, pausado fuera de pantalla y desactivado con `prefers-reduced-motion`.
- Botones tipo píldora, bordes finos, sombras mínimas, radios consistentes.
- Modo oscuro completo con toggle y respeto a `prefers-color-scheme`.
- Animaciones discretas: fade/slide corto al entrar en viewport, hovers precisos.

### Calidad exigida

- Responsive impecable de 360px a pantallas anchas; en móvil la retícula se simplifica.
- Accesibilidad: HTML semántico, contraste AA, foco visible, navegación por teclado, `alt` en imágenes.
- Rendimiento: Lighthouse ≥95 en todas las categorías; imágenes AVIF/WebP con tamaños explícitos; sin layout shift.
- SEO: `title` y `meta description` por página, Open Graph y Twitter Card con imagen OG, `sitemap.xml`, `robots.txt`, favicon y JSON-LD `Person`.

---

## 4. Arquitectura de contenido

- Todo el texto vive en `src/content/es.ts` y `src/content/en.ts` con un tipo compartido. Ningún componente lleva texto hardcodeado.
- Selector ES/EN en la cabecera; idioma por defecto según el navegador, persistido.
- Proyectos como array tipado: título, resumen, rol, stack, estado, enlaces (repo/demo), destacado sí/no, imagen, caso de estudio opcional.
- Experiencia como array tipado: puesto, empresa, modalidad, fechas, ubicación, logros.
- Flag `disponibilidad` en el contenido que se muestra como badge en el hero y en contacto. Valor actual: «Abierto a oportunidades · presencial o híbrido en el área de Barcelona».

---

## 5. Secciones

1. **Cabecera** fija y minimalista: nombre o monograma, navegación por anclas, toggle de tema, selector de idioma, botón «Contactar».
2. **Hero:** nombre, titular, frase de valor, badge de disponibilidad, CTAs «Ver proyectos» y «Descargar CV» (`public/cv.pdf`; `TODO` si no existe), enlaces a GitHub y LinkedIn.
3. **Quién soy:** texto breve y humano (ver §7).
4. **Proyectos:** bento con destacados grandes y el resto en tarjetas. Avalon Agent lleva caso de estudio propio (problema, arquitectura con diagrama SVG hecho a mano, decisiones técnicas con su porqué, resultados). Estructura preparada para añadir más casos.
5. **Experiencia y formación:** línea temporal sobria. La experiencia técnica primero; la anterior agrupada como «Trayectoria previa: trato con cliente».
6. **Stack:** agrupado por áreas, en retícula. Sin barras de porcentaje de dominio.
7. **Servicios** (marca personal): 3-4 tarjetas orientadas a resultado de negocio, sin precios.
8. **Ahora / Aspiraciones.**
9. **Contacto:** email (ofuscado o `mailto`), LinkedIn, GitHub, badge de disponibilidad. Sin formulario con backend.
10. **Footer:** año, enlaces, «Hecho con React» discreto.

### Integración del asistente (preparar, no bloquear)

- Componente que inyecta el widget de mi chatbot RAG (script externo `widget.js`) solo si existen `VITE_CHAT_WIDGET_URL`, `VITE_CHAT_API_URL` y `VITE_CHAT_TENANT_KEY`. Si faltan, no renderiza nada y no da errores.
- Bloque «Pregúntale a mi asistente» en el hero o en contacto que abre el widget; oculto si no está configurado.
- Documentar la activación en el README.

---

## 6. Perfil — datos básicos

- **Nombre:** Víctor Prim Romero
- **Titular (LinkedIn):** Desarrollador Fullstack Junior · Flutter · Kotlin · Python · PostgreSQL · IA aplicada · Docker | Estudiante DAM
- **Titular (GitHub):** Junior Developer · Fullstack · Applied AI · End-to-end product
- **Titular propuesto para la web:** «Desarrollador fullstack · IA aplicada». Frase de valor: construyo software de punta a punta, del diseño de la arquitectura a un producto desplegado y funcionando.
- **Ubicación:** Viladecans (área de Barcelona). En GitHub figura «Barcelona». Usar «Barcelona» en la web.
- **Búsqueda:** en busca de empleo, presencial o híbrido.
- **Idiomas:** castellano y catalán nativos; inglés con competencia profesional completa.
- **Enfoque:** backend, IA aplicada y DevOps.
- **Enlaces:** LinkedIn https://www.linkedin.com/in/victor-prim-romero · GitHub https://github.com/PRIMCODIN
- **Email profesional:** `TODO`

---

## 7. Quién soy — material para el texto

Clave narrativa: antes de programar pasé años en trato directo con clientes (soporte técnico telefónico, atención al público, entornos exigentes como un casino). Eso me hace entender el problema de negocio y hablar con el cliente, no solo escribir código. Hoy estudio DAM, hago prácticas como desarrollador backend e integración de IA y construyo proyectos propios que llevo hasta producción.

Escríbelo en primera persona, cercano, sin frases hechas tipo «apasionado por la tecnología». Máximo dos párrafos cortos.

---

## 8. Experiencia (fuente: LinkedIn)

### Desarrollador Backend e Integración de IA (Prácticas DAM) — YMRO Technologies

Jornada parcial · marzo 2026 – actualidad · Barcelona · Híbrido

Asistente conversacional con IA integrado en una app móvil, desarrollado en un equipo de 6 personas. Rol: backend, orquestación e infraestructura.

- Diseñé y monté los flujos en n8n y Dify que conectaban la app Flutter con los servicios de IA, definiendo el contrato de datos de extremo a extremo.
- Construí un agente acotado mediante system prompts y RAG, reduciendo las respuestas fuera de dominio.
- Integré Google Calendar vía OAuth para lectura y creación de eventos en pruebas reales.
- Habilité un servidor local centralizado para que los 6 integrantes probaran el mismo flujo, unificando el entorno de pruebas.
- Diseñé la arquitectura de datos y el manejo de errores de los flujos para hacerlos escalables.

Stack: Flutter · n8n · Dify · Groq · Google Calendar OAuth · Docker

`TODO`: confirmar si puede nombrarse el producto (Aurora) y mencionar la auditoría técnica posterior del MVP (detectó credenciales expuestas y un webhook sin autenticar; propuso migrar la orquestación a FastAPI + Supabase). Hay restricciones contractuales de portfolio pendientes de cerrar: hasta confirmarlo, ni nombre del producto ni enlaces a código.

### Cofundador y responsable técnico — Avalon Intelligence

Agencia de automatización con IA para pymes. `TODO`: fechas y cómo presentarlo públicamente (no figura en LinkedIn).

### Trayectoria previa: trato con cliente

- **Asistente telefónico — Securitas Direct.** Contrato temporal · junio 2024 – septiembre 2025 · Cornellà de Llobregat. Atención telefónica y resolución de incidencias técnicas, telemantenimiento y diagnóstico remoto de averías, gestión de avisos y autorizaciones en sistemas internos.
- **Crupier — Grup Peralada (Casino de Barcelona).** Jornada completa · marzo 2022 – marzo 2023 · Barcelona. Conducción de mesas y control preciso del juego, gestión exacta de fichas, pagos y cobros, atención al cliente en entornos exigentes.
- **Dependiente de tienda — Lindt & Sprüngli.** Jornada parcial · septiembre 2019 – marzo 2020 · Viladecans. Atención y asesoramiento al cliente, caja, reposición y control de stock, apoyo en acciones de venta.
- `TODO`: decidir si se incluyen dos trabajos que no están en LinkedIn: venta de Google Pixel en MediaMarkt (Salesland) y dependiente en Décimas.

---

## 9. Formación

- **CFGS Desarrollo de Aplicaciones Multiplataforma (DAM)** — Davante MEDAC, Viladecans. Cursando 2.º. `TODO`: fechas (la sección de formación de LinkedIn no muestra detalle).

---

## 10. Proyectos

### Avalon Agent — destacado, con caso de estudio

Asistente conversacional RAG multi-tenant en español para pymes: responde con la base de conocimiento de cada negocio, capta leads y deriva a una persona cuando hace falta.

- Stack: Python, FastAPI, Supabase (PostgreSQL + pgvector con índice HNSW), embeddings `bge-m3` vía Ollama, LLM por endpoint compatible con OpenAI, widget en JavaScript sin dependencias.
- Arquitectura: ingesta de Markdown con chunking por encabezados e idempotente por hash → embeddings → búsqueda vectorial por tenant (`match_chunks`) → prompt con contexto → respuesta en streaming SSE → tools `capture_lead` y `handoff_human` → persistencia de conversaciones y leads.
- Decisiones técnicas para el caso de estudio:
  - **Eval de retrieval como criterio de avance:** 20 preguntas reales de cliente; el chunk correcto debe estar en el top-4.
  - **Diagnóstico de embeddings:** `nomic-embed-text` generaba un espacio de similitud degenerado en español (rango comprimido, preguntas fuera de dominio puntuando por encima de aciertos reales). Al cambiar a `bge-m3` (1024 dimensiones) el eval pasó de **11/20 a 17/20**.
  - **Streaming con `fetch` + `ReadableStream`** en lugar de `EventSource`, que no permite cabeceras propias ni POST (necesarios para autenticar el tenant con `X-Tenant-Key`).
  - **Widget con Shadow DOM:** estilos aislados de la web anfitriona, render de markdown con escape previo del HTML.
  - **Reglas internas fuera del contexto del chat:** el fichero de escalado se indexa para evaluación pero no entra al prompt, porque el modelo recitaba sus propias reglas operativas al visitante.
  - **Una sola vía de escritura de leads** con deduplicación y normalización de email a nivel de base de datos.
- Estado: `TODO` (en desarrollo / desplegado). Enlace al repo: `TODO`.

### App de fitness y nutrición — `gymApp` (en desarrollo)

App móvil para registrar calorías y entrenamientos con arquitectura profesional: Clean Architecture y Riverpod en Flutter, backend en Supabase con RLS y orquestación de IA vía n8n para estimar calorías a partir de fotos. Desarrollo con especificaciones documentadas y estructura por capas. Pensada también como futuro SaaS.
Stack: Flutter · Dart · Riverpod · Clean Architecture · Supabase (RLS) · n8n · Docker
Repo: https://github.com/PRIMCODIN/gymApp

### Sistema bancario — `appBancaria`

Dos apps Android nativas (Kotlin + Jetpack Compose) sobre una misma base de datos, modelando el aislamiento de privilegios de un sistema bancario real: panel de administración y app cliente. Transferencias entre usuarios e historial vía Ktor. Chatbot financiero que responde en lenguaje natural sobre los datos del usuario, con agente orquestado en n8n vía webhook. Modelado en Supabase con Row Level Security y gestión de roles sobre datos sensibles.
Stack: Kotlin · Jetpack Compose · Supabase (PostgreSQL, RLS) · n8n · Ktor · Docker
Repo: https://github.com/PRIMCODIN/appBancaria

### Flag Challenge — `flagQuiz`

Juego web de adivinar banderas con varios modos de juego y ranking global en tiempo real, hecho de extremo a extremo: frontend, base de datos y despliegue.
Stack: React · Vite · Supabase (PostgreSQL, Auth, RLS, Realtime) · Vercel
Repo: https://github.com/PRIMCODIN/flagQuiz · Demo: https://flag-quiz-primcodin16.vercel.app/

### Bot de agendado por voz — `agendadorBot`

Pipeline completo audio → cita: bot de Telegram conectado a Make.com que recibe notas de voz, las transcribe y estructura los datos (título, fecha, hora) con un flujo en Dify, crea el evento en Google Calendar vía OAuth y confirma al usuario.
Stack: Telegram Bot API · Make.com · Dify · Google Calendar API (OAuth)
Repo: https://github.com/PRIMCODIN/agendadorBot

### SOCCER N GO (en desarrollo)

App de geolocalización estilo Pokémon GO con estadios de clubes de fútbol, en un equipo de 3. `TODO`: confirmar si se publica ya.

---

## 11. Stack

- **Lenguajes:** Python, Dart, Kotlin, JavaScript/TypeScript, C#, SQL, HTML/CSS
- **Backend e infraestructura:** FastAPI, Pydantic, Ktor, Supabase, PostgreSQL, pgvector, MongoDB, Docker, OAuth, Row Level Security
- **IA y automatización:** RAG, embeddings y búsqueda vectorial, system prompts, orquestación de agentes LLM, n8n, Dify, Make.com, Groq, Ollama
- **Móvil:** Flutter, Riverpod, Clean Architecture, Kotlin, Jetpack Compose
- **Frontend:** React, Vite
- **Herramientas:** Git y GitHub, Claude Code, Vercel, Google Cloud Console

---

## 12. Servicios (marca personal)

Cuatro tarjetas, cada una con problema → resultado, sin precios:

1. **Automatización de procesos con IA:** tareas repetitivas (pasar datos, responder lo mismo, hacer seguimiento) convertidas en flujos automáticos con supervisión humana donde hace falta.
2. **Asistentes y chatbots RAG para negocio:** responden con la información validada del negocio, captan contactos y derivan a una persona.
3. **Integraciones y APIs:** conectar CRM, calendario, facturación, WhatsApp y servicios de IA para que los datos fluyan sin teclear.
4. **Apps móviles y web a medida:** de la arquitectura al despliegue.

---

## 13. Ahora / Aspiraciones (borrador para ajustar)

Busco mi primer puesto como desarrollador en backend, IA aplicada o producto. Quiero seguir construyendo sistemas de IA que resuelvan problemas reales de negocio, medidos con datos, y a medio plazo ofrecer esos servicios con mi propia marca.

Fuera del código: `TODO` (sección opcional, desactivada por defecto).

---

## 14. Entregables

1. Proyecto funcionando con `npm run dev` y `npm run build` sin warnings.
2. README con: cómo editar el contenido, cómo añadir un proyecto o caso de estudio, cómo activar el widget del asistente y cómo desplegar (Cloudflare Pages y `dist/` servido con Caddy).
3. Lista final de todos los `TODO` pendientes.
4. Resultados de Lighthouse en móvil y escritorio.
