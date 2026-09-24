import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconoEnlaceExterno, IconoFlecha } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/i18n/locale-context";
import { chatDisponible } from "@/lib/chatWidget";
import { cvDisponible } from "@/lib/cv";
import { DotField } from "./DotField";

export function Hero() {
  const { hero, disponibilidad, ui } = useContent();

  return (
    <section id="inicio" className="relative overflow-hidden">
      <DotField />

      <Container className="relative">
        <div className="flex min-h-[min(92svh,960px)] flex-col justify-center pt-[calc(var(--header-h)+4rem)] pb-28">
          <Reveal>
            <h1 className="text-display">{hero.nombre}</h1>
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
            <div className="mt-9">
              <div className="flex flex-wrap items-center gap-3">
                {/* Ancla normal: funciona sin JavaScript, y el desplazamiento
                    suave lo pone scroll-behavior, que el CSS quita a quien pide
                    menos movimiento. */}
                {chatDisponible && (
                  <Button href="#agente" variante="primario" className="halo-acento">
                    {hero.hablarConAgente}
                    <IconoFlecha />
                  </Button>
                )}

                <Button href="#proyectos" variante={chatDisponible ? "secundario" : "primario"}>
                  {hero.verProyectos}
                  {!chatDisponible && <IconoFlecha />}
                </Button>

                {cvDisponible && (
                  <Button href={hero.cvHref} variante="secundario" descargar>
                    {hero.descargarCv}
                  </Button>
                )}
              </div>

              {chatDisponible && (
                <p className="mt-4 max-w-[46ch] text-small text-text-muted">
                  {hero.hablarConAgenteSubtexto}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal retardo={360}>
            <nav aria-label={ui.perfiles} className="mt-10 flex flex-wrap items-center gap-6">
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
