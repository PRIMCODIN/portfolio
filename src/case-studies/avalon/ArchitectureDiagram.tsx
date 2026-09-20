import type { NodoArquitectura } from "@/content/types";

/**
 * Diagrama de arquitectura dibujado a mano en SVG. Las posiciones viven aquí;
 * los textos, en el contenido. Por debajo de 768px el diagrama se sustituye por
 * la lista ordenada de nodos, que además es la alternativa textual que leen los
 * lectores de pantalla en cualquier tamaño.
 */

interface Caja {
  x: number;
  y: number;
  w: number;
  h: number;
}

const CAJAS: Record<string, Caja> = {
  // Carril de ingesta
  fuentes: { x: 20, y: 50, w: 190, h: 92 },
  ingesta: { x: 250, y: 50, w: 190, h: 92 },
  embeddings: { x: 480, y: 50, w: 190, h: 92 },
  // Almacén: los dos carriles se encuentran aquí
  almacen: { x: 20, y: 190, w: 600, h: 80 },
  datos: { x: 660, y: 190, w: 240, h: 80 },
  // Carril de consulta
  widget: { x: 20, y: 330, w: 190, h: 92 },
  api: { x: 250, y: 330, w: 190, h: 92 },
  busqueda: { x: 480, y: 330, w: 190, h: 92 },
  llm: { x: 710, y: 330, w: 190, h: 92 },
  respuesta: { x: 365, y: 470, w: 190, h: 92 },
};

/** Sangrado horizontal del texto dentro de cada caja. */
const SANGRADO = 16;
/** Avance medio de Geist Mono a 10.5px. Sirve para no salirse de la caja. */
const ANCHO_CARACTER = 6.35;

/** Parte un texto en líneas que quepan en `ancho` píxeles. */
function partirEnLineas(texto: string, ancho: number): string[] {
  const maximo = Math.max(8, Math.floor((ancho - SANGRADO * 2) / ANCHO_CARACTER));
  const lineas: string[] = [];
  let actual = "";

  for (const palabra of texto.split(" ")) {
    const tentativa = actual ? `${actual} ${palabra}` : palabra;
    if (tentativa.length > maximo && actual) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = tentativa;
    }
  }

  if (actual) lineas.push(actual);
  return lineas;
}

function Nodo({ nodo }: { nodo: NodoArquitectura }) {
  const caja = CAJAS[nodo.id];
  if (!caja) return null;

  const lineas = partirEnLineas(nodo.detalle, caja.w);

  return (
    <g>
      <rect
        x={caja.x}
        y={caja.y}
        width={caja.w}
        height={caja.h}
        rx="10"
        className="fill-surface stroke-border"
        strokeWidth="1"
      />
      <text
        x={caja.x + SANGRADO}
        y={caja.y + 30}
        className="fill-text text-[13px] font-medium"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {nodo.titulo}
      </text>
      {lineas.map((linea, indice) => (
        <text
          key={linea}
          x={caja.x + SANGRADO}
          y={caja.y + 50 + indice * 14}
          className="fill-text-muted text-[10.5px]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {linea}
        </text>
      ))}
    </g>
  );
}

export function ArchitectureDiagram({
  nodos,
  titulo,
  intro,
}: {
  nodos: NodoArquitectura[];
  titulo: string;
  intro: string;
}) {
  return (
    <>
      <svg
        viewBox="0 0 920 582"
        className="hidden h-auto w-full md:block"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`${titulo}. ${intro}`}
      >
        <defs>
          <marker
            id="punta"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" className="fill-border" />
          </marker>
          <marker
            id="punta-acento"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" className="fill-accent" />
          </marker>
        </defs>

        {/* Etiquetas de carril */}
        <text
          x="20"
          y="34"
          className="fill-text-muted text-[10.5px] tracking-[0.08em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          INGESTA
        </text>
        <text
          x="20"
          y="314"
          className="fill-text-muted text-[10.5px] tracking-[0.08em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          CONSULTA
        </text>

        <g className="stroke-border" strokeWidth="1" fill="none" markerEnd="url(#punta)">
          {/* Ingesta: documentación → troceado → embeddings */}
          <path d="M 216 96 L 244 96" />
          <path d="M 446 96 L 474 96" />
          {/* Embeddings → almacén vectorial */}
          <path d="M 575 148 L 575 184" />
          {/* Almacén → búsqueda, en cada consulta */}
          <path d="M 575 276 L 575 324" />
          {/* Consulta: widget → API → búsqueda → modelo */}
          <path d="M 216 376 L 244 376" />
          <path d="M 446 376 L 474 376" />
          <path d="M 676 376 L 704 376" />
          {/* El modelo persiste conversaciones y leads */}
          <path d="M 805 324 L 805 276" />
        </g>

        {/* La vuelta al widget en streaming: el único trazo con color */}
        <g className="stroke-accent" strokeWidth="1.2" fill="none" markerEnd="url(#punta-acento)">
          <path d="M 805 428 L 805 516 L 561 516" />
          <path d="M 365 516 L 115 516 L 115 428" />
        </g>

        <text
          x="585"
          y="308"
          className="fill-text-muted text-[10px]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          top-4
        </text>

        {nodos.map((nodo) => (
          <Nodo key={nodo.id} nodo={nodo} />
        ))}
      </svg>

      {/* Visible en móvil; en escritorio queda solo para lectores de pantalla. */}
      <ol className="space-y-px overflow-hidden rounded-card border border-hairline bg-hairline md:sr-only">
        {nodos.map((nodo, indice) => (
          <li key={nodo.id} className="flex gap-4 bg-bg p-5">
            <span className="label-mono pt-0.5">{String(indice + 1).padStart(2, "0")}</span>
            <span>
              <span className="block text-small font-medium">{nodo.titulo}</span>
              <span className="label-mono mt-1 block normal-case tracking-normal">
                {nodo.detalle}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </>
  );
}
