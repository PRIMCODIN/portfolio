import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * React Router no restaura el scroll por sí solo: al cambiar de ruta sube
 * arriba, y si la URL trae ancla, lleva a la sección correspondiente.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const destino = document.querySelector(hash);
      if (destino) {
        destino.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
