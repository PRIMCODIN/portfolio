/**
 * Iconos propios, geométricos y sin dependencias. Todos heredan el color del
 * texto y son decorativos: el significado siempre lo aporta la etiqueta.
 */

type Props = { className?: string };

const base = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/** Flecha diagonal: enlaces que salen del sitio. */
export function IconoEnlaceExterno({ className }: Props) {
  return (
    <svg {...base} className={className} width="14" height="14">
      <path d="M5.5 10.5 10.5 5.5" />
      <path d="M6.2 5.5h4.3v4.3" />
    </svg>
  );
}

/** Flecha a la derecha: navegación dentro del sitio. */
export function IconoFlecha({ className }: Props) {
  return (
    <svg {...base} className={className} width="14" height="14">
      <path d="M3 8h10" />
      <path d="M9 4l4 4-4 4" />
    </svg>
  );
}

export function IconoSol({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1.4v1.5M8 13.1v1.5M14.6 8h-1.5M2.9 8H1.4M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1M12.7 12.7l-1.1-1.1M4.4 4.4 3.3 3.3" />
    </svg>
  );
}

export function IconoLuna({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M13.2 9.4A5.6 5.6 0 0 1 6.6 2.8a5.6 5.6 0 1 0 6.6 6.6Z" />
    </svg>
  );
}

export function IconoMenu({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M2.5 5h11M2.5 11h11" />
    </svg>
  );
}

export function IconoCerrar({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

/* Iconos del esquema de la sección Agente. */

/** Bocadillo: una pregunta escrita. */
export function IconoBocadillo({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M2.5 4.2c0-.9.7-1.7 1.7-1.7h7.6c.9 0 1.7.8 1.7 1.7v5c0 .9-.8 1.6-1.7 1.6H7l-3 2.7v-2.7h.2c-1 0-1.7-.7-1.7-1.6Z" />
      <path d="M5.3 6.7h5.4" />
    </svg>
  );
}

/** Vector: una fila de valores entre corchetes. */
export function IconoVector({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M4 3H2.5v10H4M12 3h1.5v10H12" />
      <path d="M5.5 10V8M8 10V5.5M10.5 10V7" />
    </svg>
  );
}

export function IconoLupa({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <circle cx="7" cy="7" r="4.2" />
      <path d="m10.1 10.1 3.4 3.4" />
    </svg>
  );
}

/** Destello: la respuesta generada. */
export function IconoDestello({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M8 2.2c.4 3 1.8 4.4 4.8 4.8-3 .4-4.4 1.8-4.8 4.8-.4-3-1.8-4.4-4.8-4.8 3-.4 4.4-1.8 4.8-4.8Z" />
      <path d="M12.6 11.2v2.6M11.3 12.5h2.6" />
    </svg>
  );
}

export function IconoEscudo({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M8 1.8 13 3.6v4c0 3-2.1 5.4-5 6.6-2.9-1.2-5-3.6-5-6.6v-4Z" />
      <path d="m5.8 8 1.6 1.6 2.9-3" />
    </svg>
  );
}

/** Auriculares: atención al cliente. */
export function IconoAuriculares({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M2.8 10V8a5.2 5.2 0 0 1 10.4 0v2" />
      <path d="M2.8 9.2h1.8v3.6H3.6a.8.8 0 0 1-.8-.8ZM13.2 9.2h-1.8v3.6h1a.8.8 0 0 0 .8-.8Z" />
    </svg>
  );
}

/** Persona con un «+»: captación de contactos. */
export function IconoPersonaMas({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <circle cx="6.5" cy="5.2" r="2.5" />
      <path d="M1.8 13.5c.4-2.4 2.3-4 4.7-4s4.3 1.6 4.7 4" />
      <path d="M12.8 4.2v3.6M11 6h3.6" />
    </svg>
  );
}

/** Dos flechas que se cruzan: derivación a una persona. */
export function IconoTraspaso({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M2.5 5.5h10M10 3l2.5 2.5L10 8" />
      <path d="M13.5 10.5h-10M6 8l-2.5 2.5L6 13" />
    </svg>
  );
}

/** Libro abierto: documentación interna. */
export function IconoLibro({ className }: Props) {
  return (
    <svg {...base} className={className} width="16" height="16">
      <path d="M8 4.2C6.8 3.2 4.9 2.8 2.2 3v9.3c2.7-.2 4.6.2 5.8 1.2 1.2-1 3.1-1.4 5.8-1.2V3c-2.7-.2-4.6.2-5.8 1.2Z" />
      <path d="M8 4.2v9.3" />
    </svg>
  );
}
