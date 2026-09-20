import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconoEnlaceExterno, IconoFlecha } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { TodoMark } from "@/components/ui/TodoMark";
import { useContent } from "@/i18n/locale-context";
import { valorPublicable } from "@/lib/contenido";
import { DotField } from "./DotField";

export function Hero() {
  const { hero, disponibilidad } = useContent();
  const cv = valorPublicable(hero.cvHref);

  return (
    <section id="inicio" className="relative overflow-hidden">
      <DotField />

      <Container className="relative">
        <div className="flex min-h-[min(92svh,960px)] flex-col justify-center pt-[calc(var(--header-h)+4rem)] pb-28">
          <Reveal>
            <p className="label-mono">
              {"// "}
              {hero.etiqueta}
            </p>
          </Reveal>

          <Reveal retardo={60}>
            <h1 className="mt-7 text-display">{hero.nombre}</h1>
          </Reveal>

          <Reveal retardo={120}>
            <p className="mt-6 text-h2 text-text-muted">{hero.titular}</p>
          </Reveal>

          <Reveal retardo={180}>
            <p className="mt-7 max-w-[46ch] text-text-muted">{hero.propuesta}</p>
          </Reveal>

          <Reveal retardo={240}>
            <div className="mt-9">
              <Badge>{disponibilidad}</Badge>
            </div>
          </Reveal>

          <Reveal retardo={300}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#proyectos" variante="primario">
                {hero.verProyectos}
                <IconoFlecha />
              </Button>

              {cv ? (
                <Button href={cv} variante="secundario">
                  {hero.descargarCv}
                </Button>
              ) : (
                <TodoMark valor={hero.cvHref} />
              )}
            </div>
          </Reveal>

          <Reveal retardo={360}>
            <nav aria-label={hero.github.label} className="mt-10 flex flex-wrap items-center gap-6">
              {[hero.github, hero.linkedin].map((enlace) => (
                <a
                  key={enlace.href}
                  href={enlace.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-small text-text-muted transition-colors duration-[--duration-fast] hover:text-text"
                >
                  {enlace.label}
                  <IconoEnlaceExterno className="opacity-70" />
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
