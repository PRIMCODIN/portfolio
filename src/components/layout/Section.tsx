import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

interface Props {
  id: string;
  titulo: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Envoltorio común de todas las secciones: línea horizontal de apertura,
 * titular y contenido, todo alineado a la retícula.
 */
export function Section({ id, titulo, intro, children, className }: Props) {
  return (
    // Al llegar por ancla, el margen negativo se come casi todo el padding
    // superior para que el titular quede cerca de la cabecera, como en #agente.
    <section
      id={id}
      className={cn(
        "scroll-mt-[calc(var(--header-h)-var(--section-y)+3rem)] border-t border-hairline",
        className,
      )}
    >
      <Container>
        <div className="py-[var(--section-y)]">
          <Reveal>
            <header className="max-w-[60ch]">
              <h2 className="text-h2">{titulo}</h2>
              {intro && <p className="mt-5 text-text-muted">{intro}</p>}
            </header>
          </Reveal>
          <div className="mt-14">{children}</div>
        </div>
      </Container>
    </section>
  );
}
