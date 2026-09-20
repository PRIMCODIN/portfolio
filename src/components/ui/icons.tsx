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
