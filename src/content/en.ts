import { todo, type SiteContent } from "./types.ts";

/**
 * Contenido en inglés. Debe mantener exactamente las mismas claves que es.ts:
 * el `satisfies SiteContent` hace fallar el type-check si falta alguna.
 */
export const en = {
  locale: "en",

  disponibilidad: "Open to opportunities · on-site or hybrid in the Barcelona area",

  seo: {
    title: "Víctor Prim Romero — Backend developer · Applied AI",
    description:
      "Backend developer and applied AI: APIs, RAG systems and deployment on Linux. I build software end to end, from the architecture to a deployed, working product. Barcelona.",
  },

  ui: {
    saltarAlContenido: "Skip to content",
    abrirMenu: "Open menu",
    cerrarMenu: "Close menu",
    cambiarTema: "Switch theme",
    temaClaro: "Light theme",
    temaOscuro: "Dark theme",
    cambiarIdioma: "Switch language",
    actualidad: "Present",
    pendiente: "To be confirmed",
    navegacionPrincipal: "Main navigation",
    perfiles: "Profiles",
    navegacionPie: "Footer links",
  },

  nav: {
    monograma: "VP",
    items: [
      { href: "#sobre-mi", label: "About" },
      { href: "#proyectos", label: "Projects" },
      { href: "#agente", label: "Agent", requiereChat: true },
      { href: "#stack", label: "Stack" },
      { href: "#trayectoria", label: "Experience" },
    ],
    contactar: "Get in touch",
  },

  hero: {
    nombre: "Víctor Prim Romero",
    titular: "Backend developer · Applied AI",
    propuesta:
      "I build software end to end: from designing the architecture to a product deployed and running.",
    verProyectos: "See projects",
    descargarCv: "Download CV",
    hablarConAgente: "Talk to my AI agent",
    hablarConAgenteSubtexto:
      "Ask it about my experience. Turn on technical mode to see how it works under the hood.",
    cvHref: todo("subir public/cv.pdf actualizado y sustituir este valor por /cv.pdf"),
    github: { href: "https://github.com/PRIMCODIN", label: "GitHub" },
    linkedin: { href: "https://www.linkedin.com/in/victor-prim-romero", label: "LinkedIn" },
  },

  agente: {
    titulo: "Ask my agent",
    intro:
      "A RAG agent that answers from my own profile: experience, projects, stack and how I work. It's a multi-tenant RAG system I designed and deployed on my own server.",
    aviso: "It can make mistakes. For anything important, write to me directly.",
    enlace: "How it's built",
    cargando: "Loading the agent…",
    error: "The agent couldn't load.",
    errorEnlace: "Write to me directly",
  },

  sobreMi: {
    titulo: "I understand the problem before I code it",
    parrafos: [
      "Before I wrote code I spent years on the other side of the phone and the counter: technical support, casino tables, retail. That teaches you something no course does: how to listen to a badly explained problem, how to stay calm when the person in front of you is not, and how to give an answer that lands the first time.",
      "Today I study Multiplatform Application Development, am doing an internship as a backend and AI integration developer at YMRO Technologies, and build my own projects all the way to production. What interests me is the part that holds the product up: data architecture, service orchestration and deployment. And I am still interested in the conversation with whoever is going to use it.",
    ],
    datos: [
      { id: "ubicacion", clave: "Location", valor: "Barcelona" },
      { id: "enfoque", clave: "Focus", valor: "Backend · Applied AI · DevOps" },
      {
        id: "idiomas",
        clave: "Languages",
        valor: "Native Spanish and Catalan · professional English",
      },
      {
        id: "formacion",
        clave: "Education",
        valor: "Higher degree in software development, year 2",
      },
    ],
  },

  proyectos: {
    titulo: "Things I built and had to keep running",
    intro:
      "Personal and team projects, all taken past the demo stage: data architecture, deployment and the decisions I had to justify along the way.",
    verCaso: "Read the case study",
    verRepo: "Code",
    verDemo: "Demo",
    items: [
      {
        id: "chatbot-rag",
        visible: true,
        destacado: true,
        titulo: "Multi-tenant RAG chatbot",
        resumen:
          "Multi-tenant conversational RAG assistant in Spanish, with a FastAPI API and SSE streaming, vector search with pgvector and an embeddable widget. It is the agent on this page, deployed on a Linux VPS that I manage myself. I diagnosed that the embedding model was degrading Spanish retrieval, solved short queries by fusing two searches by rank, and verified tenant isolation with tests.",
        rol: "Personal project · design, backend, RAG and deployment",
        estado: "In production",
        stack: ["Python", "FastAPI", "pgvector", "bge-m3", "SSE", "Docker", "Caddy", "Linux"],
        casoDeEstudio: "chatbot-rag",
      },
      {
        id: "gymapp",
        visible: true,
        destacado: true,
        titulo: "Fitness and nutrition app",
        resumen:
          "Mobile app for tracking calories and workouts with a layered architecture: Clean Architecture and Riverpod in Flutter, a Supabase backend with Row Level Security, and AI orchestration planned in n8n to estimate calories from a photo of a meal.",
        rol: "Personal project · architecture and backend",
        estado: "In development",
        stack: ["Flutter", "Dart", "Riverpod", "Clean Architecture", "Supabase", "RLS", "n8n"],
        repo: "https://github.com/PRIMCODIN/gymApp",
      },
      {
        id: "appbancaria",
        visible: true,
        destacado: false,
        titulo: "Banking system",
        resumen:
          "Two native Android apps over a single database, modelling the privilege isolation of a real bank: an admin panel and a client app, with transfers between users, history, and a financial chatbot that answers questions about your own data in plain language.",
        rol: "Personal project · two apps and orchestration",
        estado: "Personal project",
        stack: ["Kotlin", "Jetpack Compose", "Supabase", "RLS", "Ktor", "n8n", "Docker"],
        repo: "https://github.com/PRIMCODIN/appBancaria",
      },
      {
        id: "flagquiz",
        visible: true,
        destacado: false,
        titulo: "Flag Challenge",
        resumen:
          "Web game of guessing flags with three game modes and a real-time global leaderboard, built end to end: frontend, database, access policies and deployment. Deployed and playable.",
        rol: "Personal project · end to end",
        estado: "In production",
        stack: ["React", "Vite", "Supabase", "Auth", "RLS", "Realtime", "Vercel"],
        repo: "https://github.com/PRIMCODIN/flagQuiz",
        demo: "https://flag-quiz-primcodin16.vercel.app/",
      },
      {
        id: "agendadorbot",
        visible: true,
        destacado: false,
        titulo: "Voice scheduling bot",
        resumen:
          "A full audio-to-appointment pipeline: a Telegram bot receives the voice note, a flow transcribes it and structures the data, and the event shows up in Google Calendar with a confirmation back to the user.",
        rol: "Personal project · automation",
        estado: "Personal project",
        stack: ["Telegram Bot API", "Make.com", "Dify", "Google Calendar API", "OAuth"],
        repo: "https://github.com/PRIMCODIN/agendadorBot",
      },
      {
        id: "soccerngo",
        visible: false,
        destacado: false,
        titulo: "SOCCER N GO",
        resumen:
          "Pokémon GO style geolocation app built around football club stadiums, developed in a team of three.",
        rol: "Team of 3",
        estado: "In development",
        stack: ["Flutter", "Geolocation"],
      },
    ],
  },

  stack: {
    titulo: "What I work with",
    intro:
      "Tools I have used on real projects, not in a tutorial. No percentage bars: either it solved something, or it is not on this list.",
    lecturas: { "C#": "C sharp" },
    grupos: [
      {
        id: "lenguajes",
        titulo: "Languages",
        items: ["Python", "Dart", "Kotlin", "TypeScript", "JavaScript", "C#", "SQL", "HTML/CSS"],
      },
      {
        id: "backend",
        titulo: "Backend and infrastructure",
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
        titulo: "AI and automation",
        items: [
          "RAG",
          "Embeddings and vector search",
          "System prompts",
          "LLM agent orchestration",
          "n8n",
          "Dify",
          "Make.com",
          "Groq",
          "Ollama",
        ],
      },
      {
        id: "movil",
        titulo: "Mobile",
        items: ["Flutter", "Riverpod", "Clean Architecture", "Kotlin", "Jetpack Compose"],
      },
      {
        id: "frontend",
        titulo: "Frontend",
        items: ["React", "Vite", "React Router"],
      },
      {
        id: "herramientas",
        titulo: "Tools",
        items: ["Git and GitHub", "Claude Code", "Vercel", "Google Cloud Console"],
      },
    ],
  },

  trayectoria: {
    titulo: "Experience and education",
    tituloTecnica: "Technical experience",
    tituloPrevia: "Earlier career: working with customers",
    introPrevia:
      "Years of dealing with people before dealing with machines. It is the reason I understand the business problem and can explain a solution without jargon.",
    tituloFormacion: "Education",
    tecnica: [
      {
        id: "chatbot-rag",
        puesto: "Multi-tenant RAG chatbot",
        empresa: "Personal project",
        inicio: "August 2026",
        fin: null,
        logros: [
          "End-to-end design and development of a multi-tenant conversational RAG assistant: a FastAPI API with SSE streaming, vector search with pgvector, tenant isolation verified with tests, retrieval and conversational evals, and an embeddable widget. Deployed on a Linux VPS that I manage myself. It is the assistant on this portfolio.",
        ],
        casoDeEstudio: "chatbot-rag",
      },
      {
        id: "ymro",
        puesto: "Backend and AI integration developer (internship)",
        empresa: "YMRO Technologies",
        modalidad: "Part-time · Hybrid",
        inicio: "March 2026",
        fin: null,
        ubicacion: "Barcelona",
        logros: [
          "Designed and built the n8n and Dify flows connecting the Flutter app to the AI services, defining the data contract end to end.",
          "Built a scoped agent using system prompts and RAG, cutting down out-of-domain answers.",
          "Integrated Google Calendar via OAuth to read and create events in real testing.",
          "Set up a centralised local server so all six team members could test the same flow, unifying the test environment.",
          "Designed the data architecture and error handling of the flows to make them scalable.",
        ],
        stack: ["Flutter", "n8n", "Dify", "Groq", "Google Calendar OAuth", "Docker"],
      },
    ],
    previa: [
      {
        id: "securitas",
        puesto: "Phone support assistant",
        empresa: "Securitas Direct",
        modalidad: "Fixed-term contract",
        inicio: "June 2024",
        fin: "September 2025",
        ubicacion: "Cornellà de Llobregat",
        logros: [
          "Phone support and resolution of technical incidents.",
          "Remote maintenance and remote fault diagnosis.",
          "Handling of alerts and authorisations in internal systems.",
        ],
      },
      {
        id: "casino",
        puesto: "Croupier",
        empresa: "Grup Peralada · Casino de Barcelona",
        modalidad: "Full-time",
        inicio: "March 2022",
        fin: "March 2023",
        ubicacion: "Barcelona",
        logros: [
          "Running tables and keeping precise control of the game.",
          "Exact handling of chips, payouts and collections.",
          "Customer service in demanding, high-pressure settings.",
        ],
      },
      {
        id: "lindt",
        puesto: "Shop assistant",
        empresa: "Lindt & Sprüngli",
        modalidad: "Part-time",
        inicio: "September 2019",
        fin: "March 2020",
        ubicacion: "Viladecans",
        logros: [
          "Customer service and advice.",
          "Till, restocking and stock control.",
          "Support on sales campaigns.",
        ],
      },
    ],
    formacion: [
      {
        id: "dam",
        titulo: "Higher Degree in Multiplatform Application Development",
        centro: "Davante MEDAC, L'Hospitalet de Llobregat",
        inicio: "September 2025",
        fin: null,
        nota: "Year 2",
      },
      {
        id: "bachillerato",
        titulo: "Technological Baccalaureate",
        centro: "IES de Sales",
        inicio: "2016",
        fin: "2020",
      },
    ],
  },

  ahora: {
    titulo: "What I am on and where I am going",
    parrafos: [
      "I am looking for my first role as a developer in backend, applied AI or product, on a team where I can see the whole business problem and not just the ticket.",
      "I want to keep building AI systems that solve real problems and can be measured with data, not with demos.",
    ],
  },

  contacto: {
    titulo: "Let's talk",
    intro:
      "If you have a role, a project proposal or a technical question, write to me. I reply to everything.",
    emailEtiqueta: "Email",
    emailPartes: ["vprimromero", "gmail.com"],
    linkedin: { href: "https://www.linkedin.com/in/victor-prim-romero", label: "LinkedIn" },
    github: { href: "https://github.com/PRIMCODIN", label: "GitHub" },
  },

  footer: {
    hechoCon: "Built with React",
    derechos: "Víctor Prim Romero",
  },

  casosDeEstudio: {
    "chatbot-rag": {
      id: "chatbot-rag",
      slug: "chatbot-rag",
      seo: {
        title: "Multi-tenant RAG chatbot — Case study · Víctor Prim Romero",
        description:
          "Multi-tenant RAG chatbot in Spanish built with FastAPI, pgvector and SSE streaming, deployed on a Linux VPS: architecture, technical decisions, evals and deployment.",
      },
      titulo: "Multi-tenant RAG chatbot",
      subtitulo: "FastAPI · pgvector · SSE · embeddable widget",
      contexto:
        "It started as the assistant for an AI automation agency I co-founded, which was its first test tenant. Today it is also the agent on this portfolio.",
      estado: "In production",
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
        titulo: "The problem",
        parrafos: [
          "A small business gets the same ten questions every day: opening hours, prices, terms, whether you cover my area. Someone on the team answers them by hand, almost always late, and the person asking has already gone elsewhere.",
          "The obvious answer is a chatbot, and that is where the real problem starts: a generic model states things that are not true with complete confidence, and a business cannot afford an assistant that invents a price or a coverage area.",
          "The system is a single service running for several tenants at once. Each one has its own isolated knowledge base, the assistant answers only from it, captures the contact details of interested visitors and hands off to a person when the conversation goes beyond what it knows.",
        ],
      },
      arquitectura: {
        titulo: "The architecture",
        intro:
          "Two separate paths: ingestion, which happens when a tenant's documentation changes, and querying, which happens on every visitor message.",
        nodos: [
          { id: "fuentes", titulo: "Documentation", detalle: "Markdown per tenant" },
          {
            id: "ingesta",
            titulo: "Ingestion",
            detalle: "Chunked by headings, idempotent by hash",
          },
          {
            id: "embeddings",
            titulo: "Embeddings",
            detalle: "bge-m3, 1024 dimensions, via Ollama",
          },
          {
            id: "almacen",
            titulo: "Supabase + pgvector",
            detalle: "HNSW index, isolated per tenant",
          },
          { id: "widget", titulo: "Widget", detalle: "Dependency-free JavaScript, Shadow DOM" },
          {
            id: "api",
            titulo: "FastAPI",
            detalle: "Tenant via X-Tenant-Key, limits per tenant and IP",
          },
          {
            id: "busqueda",
            titulo: "Vector search",
            detalle: "Per tenant; two queries fused by rank",
          },
          { id: "llm", titulo: "LLM with tools", detalle: "capture_lead and handoff_human" },
          { id: "respuesta", titulo: "SSE streaming", detalle: "fetch + ReadableStream" },
          { id: "datos", titulo: "Persistence", detalle: "Normalised conversations and leads" },
        ],
        nota: "The file with the internal escalation rules is indexed so it can be evaluated, but it never enters the chat context.",
      },
      decisiones: {
        titulo: "Technical decisions",
        items: [
          {
            id: "eval",
            titulo: "A retrieval eval as the gate for every change",
            decision:
              "Real customer questions against the knowledge base; the correct chunk has to appear among the top results.",
            porque:
              "Without a measure, “it seems to answer better now” is not a criterion, it is a feeling. With the eval, every change to the chunking, the model or the prompt is accepted or rejected with a number attached.",
          },
          {
            id: "embeddings",
            titulo: "From nomic-embed-text to bge-m3",
            decision:
              "I switched the embedding model to bge-m3, 1024 dimensions, served through Ollama.",
            porque:
              "The eval exposed that nomic-embed-text produced a degenerate similarity space in Spanish: the score range was compressed and out-of-domain questions were scoring above genuine matches, so the ranking was close to noise. With bge-m3 the eval went from 11/20 to 17/20 with nothing else changed.",
          },
          {
            id: "fusion",
            titulo: "Two queries fused by rank, not by score",
            decision:
              "Short queries run two searches, and the results are combined by the position each chunk holds in each list, not by its score.",
            porque:
              "A two- or three-word query carries little signal and retrieval fails more often. Scores from two different queries are not on the same scale, so comparing them rewards whichever one scores high by construction; rank is comparable. On the eval's short queries it went from 10/12 to 12/12.",
          },
          {
            id: "eval-conversacional",
            titulo: "A conversational eval fed by real failures",
            decision:
              "On top of the retrieval eval, an eval of full conversations. Every real failure that shows up in production becomes a regression case.",
            porque:
              "Retrieval can be right and the answer still wrong. Turning every failure into a case guarantees that a fixed bug does not come back with the next prompt or model change.",
          },
          {
            id: "aislamiento",
            titulo: "Tenant isolation verified with tests",
            decision:
              "Every data access is scoped to the authenticated tenant, and automated tests check that one tenant cannot reach another tenant's data.",
            porque:
              "In a multi-tenant system a leak between clients is the worst possible failure. “The filter is in place” is not a guarantee; a test that fails as soon as it is not, is.",
          },
          {
            id: "limites",
            titulo: "Usage limits per tenant and per IP",
            decision: "The API limits how many requests it accepts from each tenant and each IP.",
            porque:
              "It is a public endpoint that ends up calling an LLM. Without limits, a loop or an abuse turns into cost and a degraded service for every other tenant.",
          },
          {
            id: "streaming",
            titulo: "Streaming with fetch and ReadableStream, not EventSource",
            decision:
              "The answer arrives over SSE, but consumed with fetch and ReadableStream instead of the browser's EventSource API.",
            porque:
              "EventSource only issues GET requests and cannot send custom headers. The tenant authenticates with X-Tenant-Key and the message travels in the body of a POST, so the standard API was ruled out from the start.",
          },
          {
            id: "modo-tecnico",
            titulo: "A technical mode inside the chat itself",
            decision:
              "The chat has a technical mode that shows each answer's metrics in real time.",
            porque:
              "For anyone evaluating the system, seeing how it answers under the hood is worth more than any description. And it lets me spot odd behaviour without going to the logs.",
          },
          {
            id: "shadow-dom",
            titulo: "The widget lives inside a Shadow DOM",
            decision:
              "The whole widget mounts in a shadow root, and answer markdown is rendered only after escaping the HTML.",
            porque:
              "It is embedded in other people's sites that I have no control over. Without isolation, any stylesheet on the host page can break the chat and the chat can break the page. Escaping first also stops a model answer from injecting HTML into it.",
          },
          {
            id: "reglas",
            titulo: "Internal rules stay out of the chat context",
            decision:
              "The escalation document is indexed so it can be evaluated, but it is excluded from the context sent to the model.",
            porque:
              "It was in, and the model ended up reciting its own operating rules back to the visitor: when to hand off, what conditions to apply. Internal information walking out the front door.",
          },
          {
            id: "leads",
            titulo: "A single write path for leads",
            decision:
              "Every contact comes in through the same path, with deduplication and email normalisation in the database itself.",
            porque:
              "When there are two or three places a lead can be written from, the same contact ends up duplicated with the email uppercase in one row and lowercase in another. Solving it in the database is the only way to stop it depending on whoever writes the next bit of code remembering.",
          },
        ],
      },
      despliegue: {
        titulo: "Deployment",
        intro:
          "The API runs on a Linux VPS (Ubuntu LTS) that I deploy and maintain myself. The server is closed by default and only opens what it must.",
        items: [
          "SSH key access only, with root login and password authentication disabled.",
          "ufw firewall with only ports 22, 80 and 443 open.",
          "Automatic security updates.",
          "Docker Compose with Caddy, FastAPI and Ollama. Caddy handles automatic HTTPS and is the only exposed service; Ollama serves bge-m3 on CPU.",
          "The database lives in Supabase cloud, and this portfolio on Cloudflare Workers.",
        ],
      },
      resultados: {
        titulo: "Results",
        intro: "What can be measured, measured. What cannot, described for what it is.",
        items: [
          {
            id: "eval",
            valor: "17/20",
            etiqueta: "eval questions with the correct chunk among the top results",
            nota: "Before the embedding model change: 11 out of 20.",
          },
          {
            id: "consultas-cortas",
            valor: "12/12",
            etiqueta: "short eval queries solved after fusing two searches by rank",
            nota: "Before the fusion: 10 out of 12.",
          },
          {
            id: "multitenant",
            valor: "Multi-tenant",
            etiqueta: "one API for several tenants, with isolation between them verified by tests",
          },
          {
            id: "idempotente",
            valor: "Idempotent",
            etiqueta: "reindexing the docs does not duplicate chunks: the content hash decides",
          },
        ],
      },
      volver: "Back to projects",
    },
  },
} satisfies SiteContent;
