/**
 * Tipos compartidos por las dos versiones de contenido (es.ts y en.ts).
 * Ningún componente debe llevar texto escrito a mano: todo sale de aquí.
 */

export type Locale = "es" | "en";

/* --------------------------------------------------------------------------
   Datos pendientes de confirmar
   --------------------------------------------------------------------------
   Un valor marcado con todo() no se renderiza en producción; en desarrollo se
   pinta un chip ámbar con la nota. Así ningún dato sin confirmar llega a la
   web publicada, y a la vez no se pierde de vista mientras se trabaja. */

export interface Todo {
  readonly __todo: string;
}

export function todo(nota: string): Todo {
  return { __todo: nota };
}

export function esTodo(valor: unknown): valor is Todo {
  return typeof valor === "object" && valor !== null && "__todo" in valor;
}

/** Valor que puede estar todavía pendiente de confirmar. */
export type Pendiente<T> = T | Todo;

/* --------------------------------------------------------------------------
   Piezas de contenido
   -------------------------------------------------------------------------- */

export interface Seo {
  title: string;
  description: string;
}

export interface Enlace {
  href: string;
  label: string;
}

export interface Proyecto {
  id: string;
  /** Si es false el proyecto no se pinta, pero se conserva el contenido. */
  visible: boolean;
  destacado: boolean;
  titulo: string;
  resumen: string;
  rol: string;
  estado: string;
  stack: string[];
  repo?: Pendiente<string>;
  demo?: string;
  /** Identificador del caso de estudio asociado, si lo tiene. */
  casoDeEstudio?: string;
  imagen?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
}

export interface Experiencia {
  id: string;
  puesto: string;
  empresa: string;
  /** Jornada o modalidad: «Jornada parcial · Híbrido». */
  modalidad?: Pendiente<string>;
  inicio: string;
  /** null significa que el puesto sigue activo. */
  fin: string | null;
  ubicacion?: string;
  logros: string[];
  stack?: string[];
  /** Identificador del caso de estudio asociado, si lo tiene. */
  casoDeEstudio?: string;
}

export interface Formacion {
  id: string;
  titulo: string;
  centro: string;
  inicio: Pendiente<string>;
  fin: string | null;
  nota?: string;
}

export interface GrupoStack {
  id: string;
  titulo: string;
  items: string[];
}

/* --------------------------------------------------------------------------
   Casos de estudio
   --------------------------------------------------------------------------
   La estructura es genérica a propósito: añadir un segundo caso consiste en
   añadir otra entrada a `casosDeEstudio` y su slug en las rutas. */

/** Nodo del diagrama de arquitectura. El componente SVG conoce las posiciones
 *  por `id`; aquí solo viven los textos. */
export interface NodoArquitectura {
  id: string;
  titulo: string;
  detalle: string;
}

export interface DecisionTecnica {
  id: string;
  titulo: string;
  /** Qué se decidió. */
  decision: string;
  /** Por qué. Es la parte que interesa a quien lee el caso. */
  porque: string;
}

export interface ResultadoMedible {
  id: string;
  valor: string;
  etiqueta: string;
  nota?: string;
}

export interface CasoDeEstudio {
  id: string;
  /** Ruta: /proyectos/<slug> */
  slug: string;
  seo: Seo;
  titulo: string;
  subtitulo: string;
  /** Una línea de contexto sobre el encargo. */
  contexto: string;
  estado: string;
  stack: string[];
  problema: {
    titulo: string;
    parrafos: string[];
  };
  arquitectura: {
    titulo: string;
    intro: string;
    nodos: NodoArquitectura[];
    nota?: string;
  };
  decisiones: {
    titulo: string;
    items: DecisionTecnica[];
  };
  /** Dónde y cómo corre en producción. */
  despliegue: {
    titulo: string;
    intro: string;
    items: string[];
  };
  resultados: {
    titulo: string;
    intro: string;
    items: ResultadoMedible[];
  };
  volver: string;
}

/* --------------------------------------------------------------------------
   Esquema de la sección Agente
   --------------------------------------------------------------------------
   El componente elige icono y bloque de ejemplo por `id`. */

export interface PasoEsquema {
  id: "pregunta" | "entiende" | "busca" | "responde";
  titulo: string;
  descripcion: string;
  /** Etiqueta técnica en mono: «pgvector · HNSW · RRF». */
  tecnica: string;
  /** Medida real del paso en el turno de ejemplo, con el formato del idioma. */
  metrica?: string;
}

export interface UsoEsquema {
  id: "soporte" | "captacion" | "derivacion" | "documentacion";
  titulo: string;
  ejemplo: string;
  descripcion: string;
}

export interface EsquemaAgente {
  etiqueta: string;
  titulo: string;
  /** El subtítulo cita la pregunta del turno, que se pinta aparte con
   *  lang="es": aquí va lo que la rodea, comillas incluidas. */
  subtitulo: { antes: string; despues: string };
  /** Rótulo del bloque de ejemplo de cada paso. */
  ejemplo: string;
  pasos: PasoEsquema[];
  /** Datos reales del turno. Son iguales en los dos idiomas y se pintan con
   *  lang="es". */
  turno: {
    pregunta: string;
    vector: string;
    fuentes: string[];
    respuesta: string;
  };
  limites: {
    titulo: string;
    items: string[];
  };
  usos: {
    etiqueta: string;
    titulo: string;
    destacado: {
      indicador: string;
      titulo: string;
      descripcion: string;
      ejemplo: string;
      boton: string;
    };
    otrosTitulo: string;
    otros: UsoEsquema[];
    multitenant: {
      titulo: string;
      descripcion: string;
      api: string;
      inquilinos: { id: string; nombre: string; estado: string; activo: boolean }[];
    };
  };
}

/* --------------------------------------------------------------------------
   Contenido completo del sitio
   -------------------------------------------------------------------------- */

export interface SiteContent {
  locale: Locale;
  /** Texto del badge de disponibilidad (hero y contacto). */
  disponibilidad: string;

  seo: Seo;

  ui: {
    saltarAlContenido: string;
    abrirMenu: string;
    cerrarMenu: string;
    cambiarTema: string;
    temaClaro: string;
    temaOscuro: string;
    cambiarIdioma: string;
    actualidad: string;
    pendiente: string;
    navegacionPrincipal: string;
    perfiles: string;
    navegacionPie: string;
  };

  nav: {
    monograma: string;
    /** requiereChat: el enlace solo aparece si el widget está configurado. */
    items: (Enlace & { requiereChat?: boolean })[];
    contactar: string;
  };

  hero: {
    nombre: string;
    titular: string;
    propuesta: string;
    verProyectos: string;
    descargarCv: string;
    /** CTA principal hacia la sección Agente, con su subtexto. Solo se pinta
     *  si el widget está configurado. */
    hablarConAgente: string;
    hablarConAgenteSubtexto: string;
    /** Ruta del PDF en public/. Los enlaces solo se pintan si existe al compilar. */
    cvHref: string;
    github: Enlace;
    linkedin: Enlace;
  };

  /** Sección del agente RAG. Solo se pinta si el widget está configurado. */
  agente: {
    titulo: string;
    intro: string;
    aviso: string;
    enlace: string;
    /** Salto al esquema de debajo del chat. */
    enlaceEsquema: string;
    /** CTA de la columna de texto que enciende el modo técnico del widget.
     *  Solo se pinta si el widget lo permite. */
    modoTecnico: {
      titulo: string;
      texto: string;
      boton: string;
      activo: string;
    };
    cargando: string;
    error: string;
    errorEnlace: string;
    /** Inspector del turno: sustituye al texto de la columna, desde lg, con
     *  el modo técnico del widget encendido. Los números los compone el
     *  componente («12 candidatos considerados», «LLM · 2 pasadas»). */
    inspector: {
      etiqueta: string;
      vacio: string;
      /** Una pestaña sin nada que enseñar (métricas antiguas). */
      sinDatos: string;
      fichas: {
        modelo: string;
        tokens: string;
        coste: string;
        total: string;
      };
      pestanas: {
        etiqueta: string;
        tiempos: string;
        busqueda: string;
      };
      tiempos: {
        preparacion: string;
        embeddings: string;
        busqueda: string;
        guardar: string;
        llm: string;
        pasadas: string;
        herramientas: string;
        otros: string;
        primerToken: string;
      };
      consultas: {
        titulo: string;
        notaB: string;
      };
      fragmentos: {
        titulo: string;
        candidatos: string;
      };
      fuentes: {
        titulo: string;
      };
    };
    /** Esquema estático bajo el chat: cómo funciona y para qué sirve. */
    esquema: EsquemaAgente;
  };

  sobreMi: {
    titulo: string;
    parrafos: string[];
    datos: { id: string; clave: string; valor: string }[];
  };

  proyectos: {
    titulo: string;
    intro: string;
    verCaso: string;
    verRepo: string;
    verDemo: string;
    items: Proyecto[];
  };

  stack: {
    titulo: string;
    intro: string;
    /** Cómo debe leerse un elemento que un lector de pantalla pronunciaría
     *  mal o descartaría, como «C#». La clave es el texto visible. */
    lecturas: Record<string, string>;
    grupos: GrupoStack[];
  };

  trayectoria: {
    titulo: string;
    tituloTecnica: string;
    tituloPrevia: string;
    introPrevia: string;
    tituloFormacion: string;
    tecnica: Experiencia[];
    previa: Experiencia[];
    formacion: Formacion[];
  };

  ahora: {
    titulo: string;
    parrafos: string[];
  };

  contacto: {
    titulo: string;
    intro: string;
    emailEtiqueta: string;
    cvEtiqueta: string;
    /** El email se guarda partido para no servirlo literal en el HTML. */
    emailPartes: [string, string];
    linkedin: Enlace;
    github: Enlace;
  };

  footer: {
    hechoCon: string;
    derechos: string;
  };

  casosDeEstudio: Record<string, CasoDeEstudio>;
}
