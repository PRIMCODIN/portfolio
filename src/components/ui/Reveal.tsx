import { useEffect, useRef, useState, type ReactNode } from "react";

import { usePrefiereMenosMovimiento } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

interface Props {
  children: ReactNode;
  /** Retardo en milisegundos, para escalonar varios elementos. */
  retardo?: number;
  /** Etiqueta a renderizar. Dentro de una lista tiene que ser li. */
  as?: "div" | "li";
  className?: string;
}

/**
 * Aparición al entrar en el viewport: un fundido con un desplazamiento corto.
 * No usa ninguna librería de animación, solo IntersectionObserver y una
 * transición CSS. Si se ha pedido reducir el movimiento, el contenido nace ya
 * visible y no se llega a observar nada.
 */
export function Reveal({ children, retardo = 0, as: Etiqueta = "div", className }: Props) {
  const referencia = useRef<HTMLDivElement & HTMLLIElement>(null);
  const menosMovimiento = usePrefiereMenosMovimiento();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento || menosMovimiento) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((entrada) => entrada.isIntersecting)) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, [menosMovimiento]);

  return (
    <Etiqueta
      ref={referencia}
      data-visible={visible || menosMovimiento}
      style={retardo ? { transitionDelay: `${retardo}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Etiqueta>
  );
}
