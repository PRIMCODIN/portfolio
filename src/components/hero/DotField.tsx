import { useEffect, useRef } from "react";

import { useMediaQuery, usePrefiereMenosMovimiento } from "@/hooks/useMediaQuery";
import { useTheme } from "@/theme/theme-context";

/** Separación objetivo entre puntos, en píxeles CSS. */
const SEPARACION = 34;
/** Tope de puntos: por encima no se gana nada visualmente y sí se gasta CPU. */
const MAXIMO_PUNTOS = 900;
/** Radio de influencia del cursor. */
const RADIO = 140;

interface Punto {
  /** Posición de reposo. */
  ox: number;
  oy: number;
  /** Posición actual. */
  x: number;
  y: number;
}

/**
 * Campo de puntos del hero. Sin librerías: un canvas, una rejilla de puntos y
 * un muelle que los aparta del cursor y los devuelve a su sitio.
 *
 * Se detiene solo cuando la sección sale del viewport o la pestaña pasa a
 * segundo plano, y no llega a animarse si el visitante pide menos movimiento o
 * navega sin puntero fino (móvil): en esos casos se pinta una sola vez.
 */
export function DotField() {
  const referencia = useRef<HTMLCanvasElement>(null);
  const menosMovimiento = usePrefiereMenosMovimiento();
  const punteroFino = useMediaQuery("(pointer: fine)");
  const { tema } = useTheme();

  const animar = !menosMovimiento && punteroFino;

  useEffect(() => {
    const canvas = referencia.current;
    const contenedor = canvas?.parentElement;
    if (!canvas || !contenedor) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const colorPunto = getComputedStyle(canvas).getPropertyValue("--color-border").trim();
    const colorActivo = getComputedStyle(canvas).getPropertyValue("--color-text-muted").trim();

    let puntos: Punto[] = [];
    let ancho = 0;
    let alto = 0;
    let cursorX = Number.NEGATIVE_INFINITY;
    let cursorY = Number.NEGATIVE_INFINITY;
    let fotograma = 0;
    let enPantalla = true;

    /** Recalcula el tamaño del lienzo y reparte los puntos en rejilla. */
    function medir() {
      const caja = contenedor!.getBoundingClientRect();
      ancho = Math.max(1, Math.round(caja.width));
      alto = Math.max(1, Math.round(caja.height));

      canvas!.width = Math.round(ancho * dpr);
      canvas!.height = Math.round(alto * dpr);
      canvas!.style.width = `${ancho}px`;
      canvas!.style.height = `${alto}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Si la rejilla nominal supera el tope, se separa hasta caber.
      const nominal = Math.ceil(ancho / SEPARACION) * Math.ceil(alto / SEPARACION);
      const separacion =
        nominal > MAXIMO_PUNTOS ? Math.sqrt((ancho * alto) / MAXIMO_PUNTOS) : SEPARACION;

      const columnas = Math.max(1, Math.floor(ancho / separacion));
      const filas = Math.max(1, Math.floor(alto / separacion));
      const margenX = (ancho - (columnas - 1) * separacion) / 2;
      const margenY = (alto - (filas - 1) * separacion) / 2;

      puntos = [];
      for (let fila = 0; fila < filas; fila += 1) {
        for (let columna = 0; columna < columnas; columna += 1) {
          const ox = margenX + columna * separacion;
          const oy = margenY + fila * separacion;
          puntos.push({ ox, oy, x: ox, y: oy });
        }
      }
    }

    function pintar() {
      ctx!.clearRect(0, 0, ancho, alto);

      for (const punto of puntos) {
        const dx = punto.x - cursorX;
        const dy = punto.y - cursorY;
        const distancia = Math.hypot(dx, dy);
        const cerca = distancia < RADIO ? 1 - distancia / RADIO : 0;

        ctx!.fillStyle = cerca > 0.35 ? colorActivo : colorPunto;
        ctx!.beginPath();
        ctx!.arc(punto.x, punto.y, 1 + cerca * 0.9, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function paso() {
      for (const punto of puntos) {
        const dx = punto.ox - cursorX;
        const dy = punto.oy - cursorY;
        const distancia = Math.hypot(dx, dy);

        let destinoX = punto.ox;
        let destinoY = punto.oy;

        if (distancia < RADIO && distancia > 0.001) {
          // Empuje hacia fuera, más fuerte cuanto más cerca está el cursor.
          const empuje = (1 - distancia / RADIO) ** 2 * 18;
          destinoX += (dx / distancia) * empuje;
          destinoY += (dy / distancia) * empuje;
        }

        // Interpolación suave: el punto persigue su destino sin rebotes.
        punto.x += (destinoX - punto.x) * 0.12;
        punto.y += (destinoY - punto.y) * 0.12;
      }

      pintar();
      fotograma = window.requestAnimationFrame(paso);
    }

    function arrancar() {
      if (!animar || fotograma) return;
      fotograma = window.requestAnimationFrame(paso);
    }

    function parar() {
      if (!fotograma) return;
      window.cancelAnimationFrame(fotograma);
      fotograma = 0;
    }

    function alMover(evento: PointerEvent) {
      const caja = canvas!.getBoundingClientRect();
      cursorX = evento.clientX - caja.left;
      cursorY = evento.clientY - caja.top;
    }

    function alSalir() {
      cursorX = Number.NEGATIVE_INFINITY;
      cursorY = Number.NEGATIVE_INFINITY;
    }

    function alCambiarVisibilidad() {
      if (document.hidden || !enPantalla) parar();
      else arrancar();
    }

    medir();
    pintar();

    const observadorTamano = new ResizeObserver(() => {
      medir();
      pintar();
    });
    observadorTamano.observe(contenedor);

    if (!animar) {
      return () => observadorTamano.disconnect();
    }

    // Fuera del viewport no se gasta un solo fotograma.
    const observadorVisible = new IntersectionObserver(
      (entradas) => {
        enPantalla = entradas.some((entrada) => entrada.isIntersecting);
        alCambiarVisibilidad();
      },
      { threshold: 0 },
    );
    observadorVisible.observe(contenedor);

    window.addEventListener("pointermove", alMover, { passive: true });
    window.addEventListener("pointerleave", alSalir);
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    arrancar();

    return () => {
      parar();
      observadorTamano.disconnect();
      observadorVisible.disconnect();
      window.removeEventListener("pointermove", alMover);
      window.removeEventListener("pointerleave", alSalir);
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    };
  }, [animar, tema]);

  return (
    <canvas
      ref={referencia}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
