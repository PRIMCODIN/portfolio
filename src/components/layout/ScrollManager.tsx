import { useEffect } from "react";
import { useLocation } from "react-router";

/** Alto de la cabecera fija, leído de `--header-h` para no duplicar el valor. */
function altoCabecera() {
  const raiz = document.documentElement;
  const valor = getComputedStyle(raiz).getPropertyValue("--header-h").trim();
  const numero = parseFloat(valor);
  if (Number.isNaN(numero)) return 0;
  return valor.endsWith("rem") ? numero * parseFloat(getComputedStyle(raiz).fontSize) : numero;
}

/**
 * Lleva a una sección dejándola centrada en el hueco visible bajo la cabecera.
 * Si no cabe entera, la alinea arriba (respetando su `scroll-margin-top`) para
 * que al menos se vea el titular.
 */
function irASeccion(destino: Element) {
  const cabecera = altoCabecera();
  const hueco = window.innerHeight - cabecera;
  const caja = destino.getBoundingClientRect();

  if (caja.height > hueco) {
    destino.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  const top = window.scrollY + caja.top - cabecera - (hueco - caja.height) / 2;
  window.scrollTo({ top: Math.max(0, top) });
}

/**
 * React Router no restaura el scroll por sí solo: al cambiar de ruta sube
 * arriba, y si la URL trae ancla, lleva a la sección correspondiente.
 */
export function ScrollManager() {
  // `key` cambia en cada navegación, así que volver a pulsar el mismo enlace
  // del menú también recoloca la sección.
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const destino = document.querySelector(hash);
      if (destino) {
        irASeccion(destino);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);

  return null;
}
