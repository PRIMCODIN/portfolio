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
 * - inicial: tal como sale del HTML, visible. Sin JavaScript se queda así.
 * - oculto: estaba fuera de la pantalla al montar; espera a entrar.
 * - visible: ha entrado y aparece con la transición.
 */
type Estado = "inicial" | "oculto" | "visible";

/**
 * Aparición al entrar en el viewport: un fundido con un desplazamiento corto.
 * Solo se anima lo que empieza fuera de la pantalla. Lo que ya se ve al
 * cargar no se toca, así que nunca hay contenido visible con la opacidad
 * rebajada. Sin JavaScript, o si se ha pedido reducir el movimiento, todo se
 * queda en su estado inicial, que es visible.
 */
export function Reveal({ children, retardo = 0, as: Etiqueta = "div", className }: Props) {
  const referencia = useRef<HTMLDivElement & HTMLLIElement>(null);
  const menosMovimiento = usePrefiereMenosMovimiento();
  const [estado, setEstado] = useState<Estado>("inicial");

  useEffect(() => {
    const elemento = referencia.current;
    if (!elemento || menosMovimiento) return;

    // La primera notificación dice si el elemento ya estaba en pantalla: en
    // ese caso se queda como está y se deja de observar.
    let primera = true;
    const observador = new IntersectionObserver((entradas) => {
      const dentro = entradas.some((entrada) => entrada.isIntersecting);

      if (primera) {
        primera = false;
        if (dentro) observador.disconnect();
        else setEstado("oculto");
        return;
      }

      if (dentro) {
        setEstado("visible");
        observador.disconnect();
      }
    });

    observador.observe(elemento);
    return () => observador.disconnect();
  }, [menosMovimiento]);

  return (
    <Etiqueta
      ref={referencia}
      data-reveal={menosMovimiento ? "inicial" : estado}
      style={retardo && estado === "visible" ? { transitionDelay: `${retardo}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Etiqueta>
  );
}
