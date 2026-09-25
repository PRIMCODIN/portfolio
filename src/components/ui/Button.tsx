import type { ReactNode } from "react";
import { Link } from "react-router";

import { cn } from "@/lib/cn";
import { IconoEnlaceExterno } from "./icons";

type Variante = "primario" | "secundario" | "fantasma";

const estilos: Record<Variante, string> = {
  primario:
    "bg-accent text-accent-contrast hover:brightness-110 active:brightness-95 border border-transparent",
  secundario: "border border-border text-text hover:border-text hover:bg-bg-subtle",
  fantasma: "border border-transparent text-text-muted hover:text-text",
};

interface Props {
  children: ReactNode;
  variante?: Variante;
  href?: string;
  /** Ruta interna del router; tiene prioridad sobre href. */
  to?: string;
  /** Fuerza el tratamiento de enlace externo (abre en otra pestaña). */
  externo?: boolean;
  /** Descarga el destino en lugar de abrirlo. */
  descargar?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

/**
 * Botón en píldora. Si recibe href se pinta como enlace, y si el destino es
 * externo añade el icono de salida y el rel de seguridad.
 */
export function Button({
  children,
  variante = "secundario",
  href,
  to,
  externo,
  descargar,
  onClick,
  className,
  type = "button",
}: Props) {
  const esExterno = externo ?? (href?.startsWith("http") || href?.startsWith("mailto:")) ?? false;
  const clases = cn(
    "inline-flex items-center justify-center gap-2 rounded-pill px-5 py-2.5 text-small font-medium",
    "transition-[background-color,border-color,color,filter] duration-(--duration-fast) ease-(--ease-soft)",
    estilos[variante],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={clases}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={clases}
        download={descargar || undefined}
        {...(esExterno && !href.startsWith("mailto:")
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {children}
        {esExterno && <IconoEnlaceExterno className="opacity-70" />}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={clases}>
      {children}
    </button>
  );
}
