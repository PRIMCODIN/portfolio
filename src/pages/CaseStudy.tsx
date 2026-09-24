import { Link, useParams } from "react-router";

import { ArchitectureDiagram } from "@/case-studies/chatbot-rag/ArchitectureDiagram";
import { Container } from "@/components/layout/Container";
import { Chip } from "@/components/ui/Chip";
import { IconoFlecha } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Seo } from "@/components/ui/Seo";
import { useContent } from "@/i18n/locale-context";

/**
 * Página de caso de estudio. Es genérica: toma el slug de la ruta y pinta lo
 * que haya en contenido, así que añadir un segundo caso no toca este fichero.
 */
export function CaseStudy() {
  const contenido = useContent();
  const { slug } = useParams<{ slug: string }>();
  const caso = slug ? contenido.casosDeEstudio[slug] : undefined;

  if (!caso) {
    return (
      <Container>
        <div className="py-[var(--section-y)]">
          <h1 className="text-h2">404</h1>
          <Link
            to="/#proyectos"
            className="mt-6 inline-flex items-center gap-2 text-small text-text-muted hover:text-text"
          >
            {contenido.nav.items.find((item) => item.href === "#proyectos")?.label}
            <IconoFlecha />
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <article>
      <Seo title={caso.seo.title} />

      {/* Cabecera del caso */}
      <Container>
        <div className="pt-[calc(var(--header-h)+5rem)] pb-16">
          <Reveal>
            <Link
              to="/#proyectos"
              className="label-mono inline-flex items-center gap-2 transition-colors duration-[--duration-fast] hover:text-text"
            >
              <IconoFlecha className="rotate-180" />
              {caso.volver}
            </Link>
          </Reveal>

          <Reveal retardo={60}>
            <h1 className="mt-10 text-display">{caso.titulo}</h1>
          </Reveal>

          <Reveal retardo={120}>
            <p className="mt-6 max-w-[38ch] text-h2 text-text-muted">{caso.subtitulo}</p>
          </Reveal>

          <Reveal retardo={180}>
            <p className="mt-8 max-w-[60ch] text-small text-text-muted">{caso.contexto}</p>
          </Reveal>

          <Reveal retardo={240}>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Chip>{caso.estado}</Chip>
              {caso.stack.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>

      {/* Problema */}
      <section className="border-t border-hairline">
        <Container>
          <div className="py-[var(--section-y)]">
            <Reveal>
              <h2 className="text-h2">{caso.problema.titulo}</h2>
            </Reveal>
            <div className="mt-8 grid gap-6 lg:grid-cols-12">
              <Reveal retardo={60} className="lg:col-span-8">
                <div className="space-y-6">
                  {caso.problema.parrafos.map((parrafo) => (
                    <p key={parrafo.slice(0, 24)}>{parrafo}</p>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Arquitectura */}
      <section className="border-t border-hairline">
        <Container>
          <div className="py-[var(--section-y)]">
            <Reveal>
              <h2 className="text-h2">{caso.arquitectura.titulo}</h2>
              <p className="mt-6 max-w-[60ch] text-text-muted">{caso.arquitectura.intro}</p>
            </Reveal>

            <Reveal retardo={80}>
              <figure className="mt-12">
                <ArchitectureDiagram
                  nodos={caso.arquitectura.nodos}
                  titulo={caso.arquitectura.titulo}
                  intro={caso.arquitectura.intro}
                />
                {caso.arquitectura.nota && (
                  <figcaption className="mt-6 max-w-[60ch] text-small text-text-muted">
                    {caso.arquitectura.nota}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Decisiones técnicas */}
      <section className="border-t border-hairline">
        <Container>
          <div className="py-[var(--section-y)]">
            <Reveal>
              <h2 className="text-h2">{caso.decisiones.titulo}</h2>
            </Reveal>

            <ol className="mt-12">
              {caso.decisiones.items.map((decision, indice) => (
                <Reveal
                  key={decision.id}
                  retardo={Math.min(indice, 3) * 60}
                  as="li"
                  className="grid gap-6 border-t border-hairline py-10 lg:grid-cols-12"
                >
                  <h3 className="text-h3 lg:col-span-5">{decision.titulo}</h3>
                  <div className="space-y-4 lg:col-span-7">
                    <p>{decision.decision}</p>
                    <p className="border-l border-accent pl-5 text-text-muted">{decision.porque}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Despliegue */}
      <section className="border-t border-hairline">
        <Container>
          <div className="py-[var(--section-y)]">
            <Reveal>
              <h2 className="text-h2">{caso.despliegue.titulo}</h2>
              <p className="mt-6 max-w-[60ch] text-text-muted">{caso.despliegue.intro}</p>
            </Reveal>

            <ul className="mt-12 lg:w-8/12">
              {caso.despliegue.items.map((item, indice) => (
                <Reveal
                  key={item.slice(0, 24)}
                  retardo={Math.min(indice, 3) * 60}
                  as="li"
                  className="border-t border-hairline py-5"
                >
                  {item}
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Resultados */}
      <section className="border-t border-hairline">
        <Container>
          <div className="py-[var(--section-y)]">
            <Reveal>
              <h2 className="text-h2">{caso.resultados.titulo}</h2>
              <p className="mt-6 max-w-[60ch] text-text-muted">{caso.resultados.intro}</p>
            </Reveal>

            {/* dl > div > dt/dd: el div de cada Reveal es el que agrupa el par. */}
            <dl className="mt-12 grid gap-px overflow-hidden rounded-card border border-hairline bg-hairline sm:grid-cols-2">
              {caso.resultados.items.map((resultado, indice) => (
                <Reveal key={resultado.id} retardo={indice * 60} className="h-full bg-bg p-7">
                  <dt className="text-h2">{resultado.valor}</dt>
                  <dd className="mt-4 text-small text-text-muted">
                    {resultado.etiqueta}
                    {resultado.nota && (
                      <span className="label-mono mt-4 block normal-case tracking-normal">
                        {resultado.nota}
                      </span>
                    )}
                  </dd>
                </Reveal>
              ))}
            </dl>

            <Reveal retardo={200}>
              <Link
                to="/#proyectos"
                className="mt-14 inline-flex items-center gap-2 text-small text-text-muted transition-colors duration-[--duration-fast] hover:text-text"
              >
                <IconoFlecha className="rotate-180" />
                {caso.volver}
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>
    </article>
  );
}
