import { useContent } from "@/i18n/locale-context";

/**
 * Lienzo de la imagen Open Graph, exactamente 1200x630. Solo se monta en
 * desarrollo: sirve para capturarla una vez y guardarla en public/og.jpg.
 * No forma parte del sitio publicado.
 */
export function Og() {
  const { hero, disponibilidad } = useContent();

  return (
    <div
      data-theme="light"
      className="fixed top-0 left-0 z-[999] flex flex-col justify-between overflow-hidden bg-bg"
      style={{ width: 1200, height: 630, padding: 72 }}
    >
      {/* Retícula de 12 columnas, como en la web */}
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-12">
        {Array.from({ length: 12 }, (_, indice) => (
          <div key={indice} className="border-l border-hairline last:border-r" />
        ))}
      </div>

      <div className="relative">
        <p className="label-mono" style={{ fontSize: 18, letterSpacing: "0.12em" }}>
          {"// "}
          {hero.etiqueta}
        </p>
      </div>

      <div className="relative">
        <p
          className="font-sans font-semibold text-text"
          style={{ fontSize: 104, letterSpacing: "-0.035em", lineHeight: 1 }}
        >
          {hero.nombre}
        </p>
        <p className="mt-6 text-text-muted" style={{ fontSize: 40, letterSpacing: "-0.02em" }}>
          {hero.titular}
        </p>
      </div>

      <div className="relative flex items-center justify-between">
        <span className="flex items-center gap-4 text-text-muted" style={{ fontSize: 22 }}>
          <span className="size-3 rounded-pill bg-accent" />
          {disponibilidad}
        </span>
        <span className="label-mono" style={{ fontSize: 18, letterSpacing: "0.12em" }}>
          github.com/PRIMCODIN
        </span>
      </div>
    </div>
  );
}
