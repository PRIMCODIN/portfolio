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

export interface Servicio {
  id: string;
  titulo: string;
  descripcion: string;
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
  resultados: {
    titulo: string;
    intro: string;
    items: ResultadoMedible[];
  };
  volver: string;
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
    etiqueta: string;
    nombre: string;
    titular: string;
    propuesta: string;
    verProyectos: string;
    descargarCv: string;
    /** CTA hacia la sección Agente. Solo se pinta si el widget está configurado. */
    preguntarAgente: string;
    cvHref: Pendiente<string>;
    github: Enlace;
    linkedin: Enlace;
  };

  /** Sección del agente RAG. Solo se pinta si el widget está configurado. */
  agente: {
    etiqueta: string;
    titulo: string;
    intro: string;
    aviso: string;
    enlace: string;
    cargando: string;
    error: string;
    errorEnlace: string;
  };

  sobreMi: {
    etiqueta: string;
    titulo: string;
    parrafos: string[];
    datos: { id: string; clave: string; valor: string }[];
  };

  proyectos: {
    etiqueta: string;
    titulo: string;
    intro: string;
    verCaso: string;
    verRepo: string;
    verDemo: string;
    items: Proyecto[];
  };

  stack: {
    etiqueta: string;
    titulo: string;
    intro: string;
    grupos: GrupoStack[];
  };

  trayectoria: {
    etiqueta: string;
    titulo: string;
    tituloTecnica: string;
    tituloPrevia: string;
    introPrevia: string;
    tituloFormacion: string;
    tecnica: Experiencia[];
    previa: Experiencia[];
    formacion: Formacion[];
  };

  servicios: {
    etiqueta: string;
    titulo: string;
    intro: string;
    items: Servicio[];
  };

  ahora: {
    etiqueta: string;
    titulo: string;
    parrafos: string[];
  };

  contacto: {
    etiqueta: string;
    titulo: string;
    intro: string;
    emailEtiqueta: string;
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
