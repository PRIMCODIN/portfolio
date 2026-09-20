import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

interface Props {
  id: string;
  /** Número que encabeza la etiqueta mono: // 03 — PROYECTOS */
  numero: number;
  etiqueta: string;
  titulo: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Envoltorio común de todas las secciones: línea horizontal de apertura,
 * etiqueta técnica numerada, titular y contenido, todo alineado a la retícula.
 */
export function Section({ id, numero, etiqueta, titulo, intro, children, className }: Props) {
  const orden = String(numero).padStart(2, "0");

  return (
    <section id={id} className={cn("border-t border-hairline", className)}>
      <Container>
        <div className="py-[var(--section-y)]">
          <Reveal>
            <header className="max-w-[60ch]">
              <p className="label-mono">
                {"// "}
                {orden} — {etiqueta}
              </p>
              <h2 className="mt-4 text-h2">{titulo}</h2>
              {intro && <p className="mt-5 text-text-muted">{intro}</p>}
            </header>
          </Reveal>
          <div className="mt-14">{children}</div>
        </div>
      </Container>
    </section>
  );
}
