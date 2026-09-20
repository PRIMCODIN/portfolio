import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Retícula de fondo: líneas de 1px que estructuran toda la página. Es
 * decorativa, así que queda fuera del árbol de accesibilidad. En móvil se
 * simplifica a cuatro columnas y, en pantallas muy estrechas, solo quedan las
 * dos líneas que marcan el ancho del contenido.
 */
export function GridLines() {
  // 768px es el mismo corte que usa el modificador md de Tailwind: si la
  // retícula de fondo y el bento no comparten punto de ruptura, a ese ancho
  // exacto las tarjetas se salen de las líneas.
  const esAncha = useMediaQuery("(min-width: 768px)");
  const esEstrecha = useMediaQuery("(max-width: 480px)");
  const columnas = esEstrecha ? 1 : esAncha ? 12 : 4;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="container-grid h-full">
        <div
          className="grid h-full"
          style={{ gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columnas }, (_, indice) => (
            <div key={indice} className="border-l border-hairline last:border-r" />
          ))}
        </div>
      </div>
    </div>
  );
}
