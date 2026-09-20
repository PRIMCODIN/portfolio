import { Link } from "react-router";

import { Section } from "@/components/layout/Section";
import { Chip } from "@/components/ui/Chip";
import { IconoEnlaceExterno, IconoFlecha } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import type { Proyecto, SiteContent } from "@/content/types";
import { useContent } from "@/i18n/locale-context";
import { cn } from "@/lib/cn";
import { valorPublicable } from "@/lib/contenido";

type Textos = SiteContent["proyectos"];

/** Enlace de pie de tarjeta, con subrayado que aparece al pasar por encima. */
function EnlaceTarjeta({
  href,
  to,
  children,
  externo,
}: {
  href?: string;
  to?: string;
  children: string;
  externo?: boolean;
}) {
  const clases =
    "inline-flex items-center gap-1.5 text-small text-text-muted underline decoration-transparent underline-offset-4 transition-colors duration-[--duration-fast] hover:text-text hover:decoration-current";

  const contenido = (
    <>
      {children}
      {externo ? (
        <IconoEnlaceExterno className="opacity-70" />
      ) : (
        <IconoFlecha className="opacity-70" />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={clases}>
        {contenido}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={clases}>
      {contenido}
    </a>
  );
}

function Tarjeta({ proyecto, textos }: { proyecto: Proyecto; textos: Textos }) {
  const repo = valorPublicable(proyecto.repo);

  return (
    <article
      className={cn(
        "group flex h-full flex-col bg-bg transition-colors duration-[--duration-base] ease-[--ease-soft] hover:bg-bg-subtle",
        proyecto.destacado ? "p-7 sm:p-9" : "p-7",
      )}
    >
      <Chip className="self-start">{proyecto.estado}</Chip>

      <h3 className={cn("mt-7", proyecto.destacado ? "text-h2" : "text-h3")}>{proyecto.titulo}</h3>
      <p className="label-mono mt-2.5">{proyecto.rol}</p>

      <p
        className={cn(
          "mt-5 text-text-muted",
          proyecto.destacado ? "max-w-[52ch]" : "text-small",
        )}
      >
        {proyecto.resumen}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {proyecto.stack.map((item) => (
          <li key={item}>
            <Chip>{item}</Chip>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
        {proyecto.casoDeEstudio && (
          <EnlaceTarjeta to={`/proyectos/${proyecto.casoDeEstudio}`}>
            {textos.verCaso}
          </EnlaceTarjeta>
        )}
        {repo && (
          <EnlaceTarjeta href={repo} externo>
            {textos.verRepo}
          </EnlaceTarjeta>
        )}
        {proyecto.demo && (
          <EnlaceTarjeta href={proyecto.demo} externo>
            {textos.verDemo}
          </EnlaceTarjeta>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  const { proyectos } = useContent();
  const visibles = proyectos.items.filter((proyecto) => proyecto.visible);
  const destacados = visibles.filter((proyecto) => proyecto.destacado);
  const resto = visibles.filter((proyecto) => !proyecto.destacado);

  /** Los destacados ocupan 7 y 5 columnas; el resto, 4 (tres por fila). */
  const columnas = (proyecto: Proyecto, indice: number) => {
    if (!proyecto.destacado) return "md:col-span-4";
    return indice % 2 === 0 ? "md:col-span-7" : "md:col-span-5";
  };

  return (
    <Section
      id="proyectos"
      numero={2}
      etiqueta={proyectos.etiqueta}
      titulo={proyectos.titulo}
      intro={proyectos.intro}
    >
      {/* gap-px sobre el color de la retícula: una sola línea de 1px separa
          celdas vecinas, sin bordes duplicados. */}
      <div className="grid gap-px overflow-hidden rounded-card border border-hairline bg-hairline md:grid-cols-12">
        {[...destacados, ...resto].map((proyecto, indice) => (
          <Reveal
            key={proyecto.id}
            retardo={Math.min(indice, 3) * 60}
            className={cn("bg-bg", columnas(proyecto, indice))}
          >
            <Tarjeta proyecto={proyecto} textos={proyectos} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
