import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconoEnlaceExterno, IconoFlecha } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { TodoMark } from "@/components/ui/TodoMark";
import { usePrefiereMenosMovimiento } from "@/hooks/useMediaQuery";
import { useContent, useLocale } from "@/i18n/locale-context";
import { cargarChat, chatDisponible, enfocarChat } from "@/lib/chatWidget";
import { valorPublicable } from "@/lib/contenido";
import { DotField } from "./DotField";

/**
 * Resuelve cuando termina el desplazamiento que está a punto de empezar. Los
 * navegadores sin scrollend no avisan: ahí se da por terminado a los 800 ms.
 */
function finDelDesplazamiento(): Promise<void> {
  return new Promise((resolver) => {
    if (!("onscrollend" in window)) {
      setTimeout(resolver, 800);
      return;
    }
    document.addEventListener("scrollend", () => resolver(), { once: true });
  });
}

export function Hero() {
  const { hero, disponibilidad, ui } = useContent();
  const { locale } = useLocale();
  const menosMovimiento = usePrefiereMenosMovimiento();
  const cv = valorPublicable(hero.cvHref);

  // Pide el chat antes de llegar, para que la carga corra a la vez que el
  // desplazamiento, y lo enfoca cuando ha terminado de moverse la página: un
  // focus a mitad de camino lo cortaría. En pantallas táctiles no se enfoca:
  // abriría el teclado y taparía el chat que se acaba de mostrar.
  const preguntarAlAgente = () => {
    const carga = cargarChat(locale);
    const destino = document.getElementById("agente");
    if (!destino) return;

    const comportamiento = menosMovimiento ? "instant" : "smooth";

    if (window.matchMedia("(pointer: coarse)").matches) {
      destino.scrollIntoView({ behavior: comportamiento, block: "start" });
      carga.catch(() => {
        /* El fallo de carga ya lo cuenta la propia sección. */
      });
      return;
    }

    const margen = parseFloat(getComputedStyle(destino).scrollMarginTop) || 0;
    const yaEnSitio = Math.abs(destino.getBoundingClientRect().top - margen) < 2;
    const llegada = yaEnSitio ? Promise.resolve() : finDelDesplazamiento();
    destino.scrollIntoView({ behavior: comportamiento, block: "start" });

    Promise.all([carga, llegada]).then(
      () => requestAnimationFrame(enfocarChat),
      () => {
        /* El fallo de carga ya lo cuenta la propia sección. */
      },
    );
  };

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
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#proyectos" variante="primario">
                {hero.verProyectos}
                <IconoFlecha />
              </Button>

              {chatDisponible && (
                <Button variante="secundario" onClick={preguntarAlAgente}>
                  {hero.preguntarAgente}
                </Button>
              )}

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
