import { todo, type SiteContent } from "./types.ts";

/**
 * Contenido en español. Es la fuente de la que bebe toda la interfaz.
 * Para cambiar un texto de la web se cambia aquí y en en.ts. Nada más.
 */
export const es = {
  locale: "es",

  disponibilidad: "Abierto a oportunidades · presencial o híbrido en el área de Barcelona",

  seo: {
    title: "Víctor Prim Romero — Desarrollador backend · IA aplicada",
    description:
      "Desarrollador backend e IA aplicada: APIs, sistemas RAG y despliegue en Linux. Construyo software de punta a punta, de la arquitectura al producto desplegado. Barcelona.",
  },

  ui: {
    saltarAlContenido: "Saltar al contenido",
    abrirMenu: "Abrir el menú",
    cerrarMenu: "Cerrar el menú",
    cambiarTema: "Cambiar de tema",
    temaClaro: "Tema claro",
    temaOscuro: "Tema oscuro",
    cambiarIdioma: "Cambiar de idioma",
    actualidad: "Actualidad",
    pendiente: "Pendiente de confirmar",
    navegacionPrincipal: "Navegación principal",
    perfiles: "Perfiles",
    navegacionPie: "Enlaces del pie",
  },

  nav: {
    monograma: "VP",
    items: [
      { href: "#sobre-mi", label: "Quién soy" },
      { href: "#proyectos", label: "Proyectos" },
      { href: "#agente", label: "Agente", requiereChat: true },
      { href: "#stack", label: "Stack" },
      { href: "#trayectoria", label: "Trayectoria" },
    ],
    contactar: "Contactar",
  },

  hero: {
    nombre: "Víctor Prim Romero",
    titular: "Desarrollador backend · IA aplicada",
    propuesta:
      "Construyo software de punta a punta: del diseño de la arquitectura a un producto desplegado y funcionando.",
    verProyectos: "Ver proyectos",
    descargarCv: "Descargar CV",
    hablarConAgente: "Habla con mi agente IA",
    hablarConAgenteSubtexto:
      "Pregúntale por mi experiencia. Activa el modo técnico para ver cómo funciona por dentro.",
    cvHref: todo("subir public/cv.pdf actualizado y sustituir este valor por /cv.pdf"),
    github: { href: "https://github.com/PRIMCODIN", label: "GitHub" },
    linkedin: { href: "https://www.linkedin.com/in/victor-prim-romero", label: "LinkedIn" },
  },

  agente: {
    titulo: "Pregúntale a mi agente",
    intro:
      "Un agente RAG que responde con la información de mi perfil: experiencia, proyectos, stack y forma de trabajar. Es un sistema RAG multi-tenant que he diseñado y desplegado en mi propio servidor.",
    aviso: "Puede equivocarse. Para lo importante, escríbeme directamente.",
    enlace: "Cómo está hecho",
    cargando: "Cargando el agente…",
    error: "No se ha podido cargar el agente.",
    errorEnlace: "Escríbeme directamente",
  },

  sobreMi: {
    titulo: "Entiendo el problema antes de programarlo",
    parrafos: [
      "Antes de escribir código pasé años al otro lado del teléfono y del mostrador: soporte técnico, mesas de casino, tienda. Ahí se aprende algo que no enseña ningún curso: a escuchar un problema mal explicado, a mantener la calma cuando quien tienes delante no la tiene y a devolver una respuesta que se entienda a la primera.",
      "Hoy estudio Desarrollo de Aplicaciones Multiplataforma, hago prácticas como desarrollador backend e integración de IA en YMRO Technologies y construyo proyectos propios que llevo hasta producción. Me interesa la parte que sostiene el producto: la arquitectura de datos, la orquestación de los servicios y el despliegue. Y me sigue interesando la conversación con quien lo va a usar.",
    ],
    datos: [
      { id: "ubicacion", clave: "Ubicación", valor: "Barcelona" },
      { id: "enfoque", clave: "Enfoque", valor: "Backend · IA aplicada · DevOps" },
      {
        id: "idiomas",
        clave: "Idiomas",
        valor: "Castellano y catalán nativos · inglés profesional",
      },
      { id: "formacion", clave: "Formación", valor: "CFGS DAM, 2.º curso" },
    ],
  },

  proyectos: {
    titulo: "Cosas que he construido y he tenido que sostener",
    intro:
      "Proyectos propios y de equipo, todos llevados más allá de la demo: arquitectura de datos, despliegue y las decisiones que hubo que justificar por el camino.",
    verCaso: "Leer el caso de estudio",
    verRepo: "Código",
    verDemo: "Demo",
    items: [
      {
        id: "chatbot-rag",
        visible: true,
        destacado: true,
        titulo: "Chatbot RAG multi-tenant",
        resumen:
          "Asistente conversacional RAG multi-tenant en español, con API en FastAPI y streaming SSE, búsqueda vectorial con pgvector y un widget embebible. Es el agente de esta página, desplegado en un VPS Linux que gestiono yo. Diagnostiqué que el modelo de embeddings degradaba la búsqueda en español, resolví las consultas cortas fusionando dos búsquedas por posición y verifiqué con tests el aislamiento entre tenants.",
        rol: "Proyecto propio · diseño, backend, RAG y despliegue",
        estado: "En producción",
        stack: ["Python", "FastAPI", "pgvector", "bge-m3", "SSE", "Docker", "Caddy", "Linux"],
        casoDeEstudio: "chatbot-rag",
      },
      {
        id: "gymapp",
        visible: true,
        destacado: true,
        titulo: "App de fitness y nutrición",
        resumen:
          "App móvil de registro de calorías y entrenamientos con arquitectura por capas: Clean Architecture y Riverpod en Flutter, backend en Supabase con Row Level Security y orquestación de IA prevista en n8n para estimar calorías a partir de la foto de un plato.",
        rol: "Proyecto propio · arquitectura y backend",
        estado: "En desarrollo",
        stack: ["Flutter", "Dart", "Riverpod", "Clean Architecture", "Supabase", "RLS", "n8n"],
        repo: "https://github.com/PRIMCODIN/gymApp",
      },
      {
        id: "appbancaria",
        visible: true,
        destacado: false,
        titulo: "Sistema bancario",
        resumen:
          "Dos apps Android nativas sobre una misma base de datos que modelan el aislamiento de privilegios de un banco real: panel de administración y app de cliente, con transferencias entre usuarios, historial y un chatbot financiero que responde en lenguaje natural sobre los datos propios.",
        rol: "Proyecto propio · dos apps y orquestación",
        estado: "Proyecto personal",
        stack: ["Kotlin", "Jetpack Compose", "Supabase", "RLS", "Ktor", "n8n", "Docker"],
        repo: "https://github.com/PRIMCODIN/appBancaria",
      },
      {
        id: "flagquiz",
        visible: true,
        destacado: false,
        titulo: "Flag Challenge",
        resumen:
          "Juego web de banderas con tres modos y ranking global en tiempo real, hecho de extremo a extremo: frontend, base de datos, políticas de acceso y despliegue. Desplegado y jugable.",
        rol: "Proyecto propio · de extremo a extremo",
        estado: "En producción",
        stack: ["React", "Vite", "Supabase", "Auth", "RLS", "Realtime", "Vercel"],
        repo: "https://github.com/PRIMCODIN/flagQuiz",
        demo: "https://flag-quiz-primcodin16.vercel.app/",
      },
      {
        id: "agendadorbot",
        visible: true,
        destacado: false,
        titulo: "Bot de agendado por voz",
        resumen:
          "Pipeline completo de audio a cita: un bot de Telegram recibe la nota de voz, un flujo la transcribe y estructura los datos, y el evento aparece en Google Calendar con confirmación al usuario.",
        rol: "Proyecto propio · automatización",
        estado: "Proyecto personal",
        stack: ["Telegram Bot API", "Make.com", "Dify", "Google Calendar API", "OAuth"],
        repo: "https://github.com/PRIMCODIN/agendadorBot",
      },
      {
        id: "soccerngo",
        visible: false,
        destacado: false,
        titulo: "SOCCER N GO",
        resumen:
          "App de geolocalización estilo Pokémon GO con estadios de clubes de fútbol, desarrollada en un equipo de tres personas.",
        rol: "Equipo de 3",
        estado: "En desarrollo",
        stack: ["Flutter", "Geolocalización"],
      },
    ],
  },

  stack: {
    titulo: "Con qué trabajo",
    intro:
      "Herramientas que he usado en proyectos reales, no en un tutorial. Sin barras de porcentaje: o ha servido para resolver algo, o no está en esta lista.",
    lecturas: { "C#": "C sharp" },
    grupos: [
      {
        id: "lenguajes",
        titulo: "Lenguajes",
        items: ["Python", "Dart", "Kotlin", "TypeScript", "JavaScript", "C#", "SQL", "HTML/CSS"],
      },
      {
        id: "backend",
        titulo: "Backend e infraestructura",
        items: [
          "FastAPI",
          "Pydantic",
          "Ktor",
          "Supabase",
          "PostgreSQL",
          "pgvector",
          "MongoDB",
          "Docker",
          "Docker Compose",
          "Linux",
          "Caddy",
          "Cloudflare",
          "OAuth",
          "Row Level Security",
        ],
      },
      {
        id: "ia",
        titulo: "IA y automatización",
        items: [
          "RAG",
          "Embeddings y búsqueda vectorial",
          "System prompts",
          "Orquestación de agentes LLM",
          "n8n",
          "Dify",
          "Make.com",
          "Groq",
          "Ollama",
        ],
      },
      {
        id: "movil",
        titulo: "Móvil",
        items: ["Flutter", "Riverpod", "Clean Architecture", "Kotlin", "Jetpack Compose"],
      },
      {
        id: "frontend",
        titulo: "Frontend",
        items: ["React", "Vite", "React Router"],
      },
      {
        id: "herramientas",
        titulo: "Herramientas",
        items: ["Git y GitHub", "Claude Code", "Vercel", "Google Cloud Console"],
      },
    ],
  },

  trayectoria: {
    titulo: "Experiencia y formación",
    tituloTecnica: "Experiencia técnica",
    tituloPrevia: "Trayectoria previa: trato con cliente",
    introPrevia:
      "Años atendiendo a personas antes de atender a máquinas. Es la razón de que entienda el problema de negocio y sepa explicar una solución sin tecnicismos.",
    tituloFormacion: "Formación",
    tecnica: [
      {
        id: "chatbot-rag",
        puesto: "Chatbot RAG multi-tenant",
        empresa: "Proyecto propio",
        inicio: "agosto 2026",
        fin: null,
        logros: [
          "Diseño y desarrollo completo de un asistente conversacional RAG multi-tenant: API en FastAPI con streaming SSE, búsqueda vectorial con pgvector, aislamiento entre tenants verificado con tests, evals de retrieval y conversacionales, y un widget embebible. Desplegado en un VPS Linux que gestiono yo. Es el asistente de este portfolio.",
        ],
        casoDeEstudio: "chatbot-rag",
      },
      {
        id: "ymro",
        puesto: "Desarrollador backend e integración de IA (Prácticas DAM)",
        empresa: "YMRO Technologies",
        modalidad: "Jornada parcial · Híbrido",
        inicio: "marzo 2026",
        fin: null,
        ubicacion: "Barcelona",
        logros: [
          "Diseñé y monté los flujos en n8n y Dify que conectaban la app Flutter con los servicios de IA, definiendo el contrato de datos de extremo a extremo.",
          "Construí un agente acotado mediante system prompts y RAG, reduciendo las respuestas fuera de dominio.",
          "Integré Google Calendar vía OAuth para lectura y creación de eventos en pruebas reales.",
          "Habilité un servidor local centralizado para que las seis personas del equipo probaran el mismo flujo, unificando el entorno de pruebas.",
          "Diseñé la arquitectura de datos y el manejo de errores de los flujos para hacerlos escalables.",
        ],
        stack: ["Flutter", "n8n", "Dify", "Groq", "Google Calendar OAuth", "Docker"],
      },
    ],
    previa: [
      {
        id: "securitas",
        puesto: "Asistente telefónico",
        empresa: "Securitas Direct",
        modalidad: "Contrato temporal",
        inicio: "junio 2024",
        fin: "septiembre 2025",
        ubicacion: "Cornellà de Llobregat",
        logros: [
          "Atención telefónica y resolución de incidencias técnicas.",
          "Telemantenimiento y diagnóstico remoto de averías.",
          "Gestión de avisos y autorizaciones en sistemas internos.",
        ],
      },
      {
        id: "casino",
        puesto: "Crupier",
        empresa: "Grup Peralada · Casino de Barcelona",
        modalidad: "Jornada completa",
        inicio: "marzo 2022",
        fin: "marzo 2023",
        ubicacion: "Barcelona",
        logros: [
          "Conducción de mesas y control preciso del juego.",
          "Gestión exacta de fichas, pagos y cobros.",
          "Atención al cliente en entornos exigentes y bajo presión.",
        ],
      },
      {
        id: "lindt",
        puesto: "Dependiente de tienda",
        empresa: "Lindt & Sprüngli",
        modalidad: "Jornada parcial",
        inicio: "septiembre 2019",
        fin: "marzo 2020",
        ubicacion: "Viladecans",
        logros: [
          "Atención y asesoramiento al cliente.",
          "Caja, reposición y control de stock.",
          "Apoyo en acciones de venta.",
        ],
      },
    ],
    formacion: [
      {
        id: "dam",
        titulo: "CFGS Desarrollo de Aplicaciones Multiplataforma (DAM)",
        centro: "Davante MEDAC, L'Hospitalet de Llobregat",
        inicio: "septiembre 2025",
        fin: null,
        nota: "2.º curso",
      },
      {
        id: "bachillerato",
        titulo: "Bachillerato Tecnológico",
        centro: "IES de Sales",
        inicio: "2016",
        fin: "2020",
      },
    ],
  },

  ahora: {
    titulo: "En qué estoy y hacia dónde voy",
    parrafos: [
      "Busco mi primer puesto como desarrollador en backend, IA aplicada o producto, en un equipo donde pueda ver el problema de negocio completo y no solo el ticket.",
      "Quiero seguir construyendo sistemas de IA que resuelvan problemas reales y que se puedan medir con datos, no con demos.",
    ],
  },

  contacto: {
    titulo: "Hablemos",
    intro:
      "Si tienes un puesto, una propuesta de proyecto o una duda técnica, escríbeme. Respondo a todo.",
    emailEtiqueta: "Email",
    emailPartes: ["vprimromero", "gmail.com"],
    linkedin: { href: "https://www.linkedin.com/in/victor-prim-romero", label: "LinkedIn" },
    github: { href: "https://github.com/PRIMCODIN", label: "GitHub" },
  },

  footer: {
    hechoCon: "Hecho con React",
    derechos: "Víctor Prim Romero",
  },

  casosDeEstudio: {
    "chatbot-rag": {
      id: "chatbot-rag",
      slug: "chatbot-rag",
      seo: {
        title: "Chatbot RAG multi-tenant — Caso de estudio · Víctor Prim Romero",
        description:
          "Chatbot RAG multi-tenant en español con FastAPI, pgvector y streaming SSE, desplegado en un VPS Linux: arquitectura, decisiones técnicas, evals y despliegue.",
      },
      titulo: "Chatbot RAG multi-tenant",
      subtitulo: "FastAPI · pgvector · SSE · widget embebible",
      contexto:
        "Nació como el asistente de una agencia de automatización con IA que cofundé, que fue su primer tenant de prueba. Hoy es también el agente de este portfolio.",
      estado: "En producción",
      stack: [
        "Python",
        "FastAPI",
        "Supabase",
        "PostgreSQL",
        "pgvector",
        "HNSW",
        "bge-m3",
        "Ollama",
        "SSE",
        "Shadow DOM",
        "Docker",
        "Caddy",
        "Linux",
      ],
      problema: {
        titulo: "El problema",
        parrafos: [
          "Una pyme recibe cada día las mismas diez preguntas: horarios, precios, condiciones, si cubrís mi zona. Alguien del equipo las responde a mano, casi siempre tarde, y quien preguntaba ya se ha ido a otra parte.",
          "La solución evidente es un chatbot, y ahí empieza el problema de verdad: un modelo genérico contesta con total seguridad cosas que no son ciertas, y un negocio no puede permitirse que su asistente invente un precio o una cobertura.",
          "El sistema es un servicio único que atiende a varios tenants a la vez. Cada uno tiene su base de conocimiento aislada, el asistente responde solo con ella, capta el contacto de quien está interesado y deriva a una persona cuando la conversación se sale de lo que sabe.",
        ],
      },
      arquitectura: {
        titulo: "La arquitectura",
        intro:
          "Dos recorridos separados: el de ingesta, que ocurre cuando cambia la documentación de un tenant, y el de consulta, que ocurre en cada mensaje del visitante.",
        nodos: [
          { id: "fuentes", titulo: "Documentación", detalle: "Markdown por tenant" },
          {
            id: "ingesta",
            titulo: "Ingesta",
            detalle: "Troceado por encabezados, idempotente por hash",
          },
          {
            id: "embeddings",
            titulo: "Embeddings",
            detalle: "bge-m3, 1024 dimensiones, vía Ollama",
          },
          {
            id: "almacen",
            titulo: "Supabase + pgvector",
            detalle: "Índice HNSW, aislado por tenant",
          },
          {
            id: "widget",
            titulo: "Widget",
            detalle: "JavaScript sin dependencias, Shadow DOM",
          },
          {
            id: "api",
            titulo: "FastAPI",
            detalle: "Tenant por X-Tenant-Key, límites por tenant e IP",
          },
          {
            id: "busqueda",
            titulo: "Búsqueda vectorial",
            detalle: "Por tenant; dos consultas fusionadas por posición",
          },
          { id: "llm", titulo: "LLM con tools", detalle: "capture_lead y handoff_human" },
          { id: "respuesta", titulo: "Streaming SSE", detalle: "fetch + ReadableStream" },
          { id: "datos", titulo: "Persistencia", detalle: "Conversaciones y leads normalizados" },
        ],
        nota: "El fichero con las reglas internas de escalado se indexa para poder evaluarlo, pero nunca entra en el contexto del chat.",
      },
      decisiones: {
        titulo: "Decisiones técnicas",
        items: [
          {
            id: "eval",
            titulo: "Un eval de recuperación como criterio de avance",
            decision:
              "Preguntas reales de cliente contra la base de conocimiento; el fragmento correcto tiene que aparecer entre los primeros resultados.",
            porque:
              "Sin una medida, «ahora parece que responde mejor» no es un criterio, es una sensación. Con el eval, cada cambio en el troceado, en el modelo o en el prompt se acepta o se descarta con un número delante.",
          },
          {
            id: "embeddings",
            titulo: "De nomic-embed-text a bge-m3",
            decision:
              "Cambié el modelo de embeddings a bge-m3, de 1024 dimensiones, servido con Ollama.",
            porque:
              "El eval destapó que nomic-embed-text generaba un espacio de similitud degenerado en español: el rango de puntuaciones estaba comprimido y había preguntas fuera de dominio puntuando por encima de aciertos reales, así que el orden de los resultados era casi ruido. Con bge-m3 el eval pasó de 11/20 a 17/20 sin tocar nada más.",
          },
          {
            id: "fusion",
            titulo: "Dos consultas fusionadas por posición, no por puntuación",
            decision:
              "Las consultas cortas lanzan dos búsquedas y los resultados se combinan según la posición que ocupa cada fragmento en cada lista, no según su puntuación.",
            porque:
              "Una consulta de dos o tres palabras da poca señal y la búsqueda falla más. Las puntuaciones de dos consultas distintas no están en la misma escala, así que compararlas premia a la que puntúa alto por construcción; la posición sí es comparable. Con las consultas cortas del eval se pasó de 10/12 a 12/12.",
          },
          {
            id: "eval-conversacional",
            titulo: "Un eval conversacional alimentado con fallos reales",
            decision:
              "Además del eval de recuperación, un eval de conversaciones completas. Cada fallo real que aparece en producción se convierte en un caso de regresión.",
            porque:
              "La recuperación puede acertar y la respuesta fallar igual. Convertir cada fallo en un caso garantiza que un error arreglado no vuelve con el siguiente cambio de prompt o de modelo.",
          },
          {
            id: "aislamiento",
            titulo: "Aislamiento entre tenants verificado con tests",
            decision:
              "Todo acceso a los datos va acotado al tenant autenticado, y hay tests automáticos que comprueban que un tenant no puede llegar a los datos de otro.",
            porque:
              "En un sistema multi-tenant una fuga entre clientes es el peor fallo posible. «El filtro está puesto» no es una garantía; un test que falla en cuanto deja de estarlo, sí.",
          },
          {
            id: "limites",
            titulo: "Límites de consumo por tenant y por IP",
            decision: "La API limita cuántas peticiones acepta de cada tenant y de cada IP.",
            porque:
              "Es un endpoint público que acaba llamando a un LLM. Sin límites, un bucle o un abuso se convierten en coste y en un servicio degradado para el resto de tenants.",
          },
          {
            id: "streaming",
            titulo: "Streaming con fetch y ReadableStream, no con EventSource",
            decision:
              "La respuesta llega por SSE, pero consumida con fetch y ReadableStream en lugar de la API EventSource del navegador.",
            porque:
              "EventSource solo hace peticiones GET y no permite enviar cabeceras propias. El tenant se autentica con X-Tenant-Key y el mensaje viaja en el cuerpo de un POST, así que la API estándar quedaba descartada desde el principio.",
          },
          {
            id: "modo-tecnico",
            titulo: "Un modo técnico dentro del propio chat",
            decision:
              "El chat tiene un modo técnico que muestra en tiempo real las métricas de cada respuesta.",
            porque:
              "Para quien evalúa el sistema, ver cómo responde por dentro vale más que cualquier descripción. Y a mí me sirve para detectar un comportamiento raro sin ir a los logs.",
          },
          {
            id: "shadow-dom",
            titulo: "El widget vive dentro de un Shadow DOM",
            decision:
              "Todo el widget se monta en un shadow root, y el markdown de las respuestas se renderiza después de escapar el HTML.",
            porque:
              "Se incrusta en webs ajenas sobre las que no tengo ningún control. Sin aislamiento, cualquier hoja de estilos de la página anfitriona puede romper el chat y el chat puede romper la página. El escape previo evita además que una respuesta del modelo inyecte HTML en ella.",
          },
          {
            id: "reglas",
            titulo: "Las reglas internas, fuera del contexto del chat",
            decision:
              "El documento de escalado se indexa para poder evaluarlo, pero se excluye del contexto que se envía al modelo.",
            porque:
              "Estaba dentro y el modelo acabó recitándole al visitante sus propias reglas operativas: cuándo derivar, qué condiciones aplicar. Información interna saliendo por la puerta de delante.",
          },
          {
            id: "leads",
            titulo: "Una sola vía de escritura para los leads",
            decision:
              "Todos los contactos entran por el mismo camino, con deduplicación y normalización del email en la propia base de datos.",
            porque:
              "Cuando hay dos o tres sitios desde los que se puede escribir un lead, el mismo contacto acaba duplicado con el email en mayúsculas en una fila y en minúsculas en otra. Resolverlo en la base de datos es la única forma de que no dependa de que quien escriba el código se acuerde.",
          },
        ],
      },
      despliegue: {
        titulo: "Despliegue",
        intro:
          "La API corre en un VPS con Linux (Ubuntu LTS) que despliego y mantengo yo. El servidor está cerrado por defecto y solo abre lo imprescindible.",
        items: [
          "Acceso solo por clave SSH, con el acceso de root y por contraseña desactivados.",
          "Firewall ufw con solo los puertos 22, 80 y 443 abiertos.",
          "Actualizaciones de seguridad automáticas.",
          "Docker Compose con Caddy, FastAPI y Ollama. Caddy gestiona el HTTPS automático y es el único servicio expuesto; Ollama sirve bge-m3 en CPU.",
          "La base de datos vive en Supabase cloud, y este portfolio, en Cloudflare Workers.",
        ],
      },
      resultados: {
        titulo: "Resultados",
        intro: "Lo que se puede medir, medido. Lo que no, contado como lo que es.",
        items: [
          {
            id: "eval",
            valor: "17/20",
            etiqueta: "preguntas del eval con el fragmento correcto entre los primeros resultados",
            nota: "Antes del cambio de modelo de embeddings: 11 de 20.",
          },
          {
            id: "consultas-cortas",
            valor: "12/12",
            etiqueta:
              "consultas cortas del eval resueltas tras fusionar dos búsquedas por posición",
            nota: "Antes de la fusión: 10 de 12.",
          },
          {
            id: "multitenant",
            valor: "Multi-tenant",
            etiqueta:
              "una sola API para varios tenants, con el aislamiento entre ellos verificado con tests",
          },
          {
            id: "idempotente",
            valor: "Idempotente",
            etiqueta:
              "reindexar la documentación no duplica fragmentos: decide el hash del contenido",
          },
        ],
      },
      volver: "Volver a proyectos",
    },
  },
} satisfies SiteContent;
