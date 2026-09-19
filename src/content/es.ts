import { todo, type SiteContent } from "./types";

/**
 * Contenido en español. Es la fuente de la que bebe toda la interfaz.
 * Para cambiar un texto de la web se cambia aquí y en en.ts. Nada más.
 */
export const es = {
  locale: "es",

  disponibilidad: "Abierto a oportunidades · presencial o híbrido en el área de Barcelona",

  seo: {
    title: "Víctor Prim Romero — Desarrollador fullstack · IA aplicada",
    description:
      "Desarrollador fullstack centrado en backend, IA aplicada y DevOps. Construyo software de punta a punta: de la arquitectura al producto desplegado. Barcelona.",
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
  },

  nav: {
    monograma: "VP",
    items: [
      { href: "#sobre-mi", label: "Quién soy" },
      { href: "#proyectos", label: "Proyectos" },
      { href: "#stack", label: "Stack" },
      { href: "#trayectoria", label: "Trayectoria" },
      { href: "#servicios", label: "Servicios" },
    ],
    contactar: "Contactar",
  },

  hero: {
    etiqueta: "Barcelona · Disponible",
    nombre: "Víctor Prim Romero",
    titular: "Desarrollador fullstack · IA aplicada",
    propuesta:
      "Construyo software de punta a punta: del diseño de la arquitectura a un producto desplegado y funcionando.",
    verProyectos: "Ver proyectos",
    descargarCv: "Descargar CV",
    cvHref: todo("subir public/cv.pdf actualizado y sustituir este valor por /cv.pdf"),
    github: { href: "https://github.com/PRIMCODIN", label: "GitHub" },
    linkedin: { href: "https://www.linkedin.com/in/victor-prim-romero", label: "LinkedIn" },
  },

  asistente: {
    etiqueta: "Asistente",
    titulo: "Pregúntale a mi asistente",
    descripcion:
      "El mismo asistente RAG que construyo para negocios, esta vez con mi perfil como base de conocimiento. Pregúntale por mi experiencia o por cómo está hecho algo.",
    cta: "Abrir el asistente",
  },

  sobreMi: {
    etiqueta: "Quién soy",
    titulo: "Entiendo el problema antes de programarlo",
    parrafos: [
      "Antes de escribir código pasé años al otro lado del teléfono y del mostrador: soporte técnico, mesas de casino, tienda. Ahí se aprende algo que no enseña ningún curso: a escuchar un problema mal explicado, a mantener la calma cuando quien tienes delante no la tiene y a devolver una respuesta que se entienda a la primera.",
      "Hoy estudio Desarrollo de Aplicaciones Multiplataforma, trabajo como desarrollador backend e integración de IA y construyo proyectos propios que llevo hasta producción. Me interesa la parte que sostiene el producto: la arquitectura de datos, la orquestación de los servicios y el despliegue. Y me sigue interesando la conversación con quien lo va a usar.",
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
    etiqueta: "Proyectos",
    titulo: "Cosas que he construido y he tenido que sostener",
    intro:
      "Proyectos propios y de equipo, todos llevados más allá de la demo: arquitectura de datos, despliegue y las decisiones que hubo que justificar por el camino.",
    verCaso: "Leer el caso de estudio",
    verRepo: "Código",
    verDemo: "Demo",
    items: [
      {
        id: "avalon-agent",
        visible: true,
        destacado: true,
        titulo: "Avalon Agent",
        resumen:
          "Asistente conversacional RAG multi-tenant en español para pymes: responde con la base de conocimiento de cada negocio, capta leads y deriva a una persona cuando hace falta. Diagnostiqué que el modelo de embeddings degradaba la búsqueda en español y el cambio subió el eval de recuperación de 11/20 a 17/20.",
        rol: "Diseño, backend, RAG y widget",
        estado: "En desarrollo",
        stack: ["Python", "FastAPI", "Supabase", "pgvector", "HNSW", "bge-m3", "SSE", "Shadow DOM"],
        casoDeEstudio: "avalon-agent",
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
    etiqueta: "Stack",
    titulo: "Con qué trabajo",
    intro:
      "Herramientas que he usado en proyectos reales, no en un tutorial. Sin barras de porcentaje: o ha servido para resolver algo, o no está en esta lista.",
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
    etiqueta: "Trayectoria",
    titulo: "Experiencia y formación",
    tituloTecnica: "Experiencia técnica",
    tituloPrevia: "Trayectoria previa: trato con cliente",
    introPrevia:
      "Años atendiendo a personas antes de atender a máquinas. Es la razón de que entienda el problema de negocio y sepa explicar una solución sin tecnicismos.",
    tituloFormacion: "Formación",
    tecnica: [
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
        centro: "Davante MEDAC, Viladecans",
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

  servicios: {
    etiqueta: "Servicios",
    titulo: "En qué puedo ayudar a un negocio",
    intro:
      "Automatización e IA aplicada para pymes: lo mismo que hago en Avalon Intelligence, ofrecido también por mi cuenta.",
    items: [
      {
        id: "automatizacion",
        titulo: "Automatización de procesos con IA",
        descripcion:
          "Las tareas que tu equipo repite cada día —pasar datos de un sitio a otro, responder lo mismo, hacer el seguimiento— convertidas en flujos que se ejecutan solos, con una persona supervisando donde de verdad importa.",
      },
      {
        id: "asistentes",
        titulo: "Asistentes y chatbots RAG",
        descripcion:
          "Un asistente que responde con la información validada de tu negocio, no con lo que se imagina. Resuelve las preguntas de siempre, capta el contacto de quien está interesado y deriva a una persona cuando la conversación lo pide.",
      },
      {
        id: "integraciones",
        titulo: "Integraciones y APIs",
        descripcion:
          "CRM, calendario, facturación, WhatsApp y servicios de IA conectados entre sí para que los datos dejen de pasar por un teclado y de perderse por el camino.",
      },
      {
        id: "apps",
        titulo: "Apps móviles y web a medida",
        descripcion:
          "De la arquitectura al despliegue: una aplicación pensada para mantenerse y crecer, no solo para enseñarla en una reunión.",
      },
    ],
  },

  ahora: {
    etiqueta: "Ahora",
    titulo: "En qué estoy y hacia dónde voy",
    parrafos: [
      "Busco mi primer puesto como desarrollador en backend, IA aplicada o producto, en un equipo donde pueda ver el problema de negocio completo y no solo el ticket.",
      "Quiero seguir construyendo sistemas de IA que resuelvan problemas reales y que se puedan medir con datos, no con demos. A medio plazo, ofrecer esos servicios con mi propia marca.",
    ],
  },

  contacto: {
    etiqueta: "Contacto",
    titulo: "Hablemos",
    intro:
      "Si tienes un puesto, un proyecto o simplemente una duda técnica, escríbeme. Respondo a todo.",
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
    "avalon-agent": {
      id: "avalon-agent",
      slug: "avalon-agent",
      seo: {
        title: "Avalon Agent — Caso de estudio · Víctor Prim Romero",
        description:
          "Asistente RAG multi-tenant en español para pymes: arquitectura, decisiones técnicas y el diagnóstico de embeddings que subió el eval de recuperación de 11/20 a 17/20.",
      },
      titulo: "Avalon Agent",
      subtitulo: "Un asistente RAG que responde con los datos del negocio, no con los suyos",
      contexto:
        "Desarrollado para Avalon Intelligence, agencia de automatización con IA que cofundé.",
      estado: "En desarrollo",
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
      ],
      problema: {
        titulo: "El problema",
        parrafos: [
          "Una pyme recibe cada día las mismas diez preguntas: horarios, precios, condiciones, si cubrís mi zona. Alguien del equipo las responde a mano, casi siempre tarde, y quien preguntaba ya se ha ido a otra parte.",
          "La solución evidente es un chatbot, y ahí empieza el problema de verdad: un modelo genérico contesta con total seguridad cosas que no son ciertas, y un negocio no puede permitirse que su asistente invente un precio o una cobertura.",
          "Avalon Agent es un servicio único que atiende a varios negocios a la vez. Cada uno tiene su base de conocimiento aislada, el asistente responde solo con ella, capta el contacto de quien está interesado y deriva a una persona cuando la conversación se sale de lo que sabe.",
        ],
      },
      arquitectura: {
        titulo: "La arquitectura",
        intro:
          "Dos recorridos separados: el de ingesta, que ocurre cuando cambia la documentación del negocio, y el de consulta, que ocurre en cada mensaje del visitante.",
        nodos: [
          { id: "fuentes", titulo: "Documentación", detalle: "Markdown por negocio" },
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
          { id: "api", titulo: "FastAPI", detalle: "Tenant autenticado con X-Tenant-Key" },
          {
            id: "busqueda",
            titulo: "Búsqueda vectorial",
            detalle: "match_chunks: los 4 mejores fragmentos del tenant",
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
              "20 preguntas reales de cliente contra la base de conocimiento; el fragmento correcto tiene que aparecer entre los cuatro primeros resultados.",
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
            id: "streaming",
            titulo: "Streaming con fetch y ReadableStream, no con EventSource",
            decision:
              "La respuesta llega por SSE, pero consumida con fetch y ReadableStream en lugar de la API EventSource del navegador.",
            porque:
              "EventSource solo hace peticiones GET y no permite enviar cabeceras propias. El tenant se autentica con X-Tenant-Key y el mensaje viaja en el cuerpo de un POST, así que la API estándar quedaba descartada desde el principio.",
          },
          {
            id: "shadow-dom",
            titulo: "El widget vive dentro de un Shadow DOM",
            decision:
              "Todo el widget se monta en un shadow root, y el markdown de las respuestas se renderiza después de escapar el HTML.",
            porque:
              "Se incrusta en webs ajenas sobre las que no tengo ningún control. Sin aislamiento, cualquier hoja de estilos del cliente puede romper el chat y el chat puede romper la web del cliente. El escape previo evita además que una respuesta del modelo inyecte HTML en la página anfitriona.",
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
      resultados: {
        titulo: "Resultados",
        intro: "Lo que se puede medir, medido. Lo que no, contado como lo que es.",
        items: [
          {
            id: "eval",
            valor: "17/20",
            etiqueta: "preguntas del eval con el fragmento correcto entre los cuatro primeros",
            nota: "Antes del cambio de modelo de embeddings: 11 de 20.",
          },
          {
            id: "multitenant",
            valor: "Multi-tenant",
            etiqueta:
              "una sola API para varios negocios, con la base de conocimiento aislada por cliente",
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
