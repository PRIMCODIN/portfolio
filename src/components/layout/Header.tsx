import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import { Button } from "@/components/ui/Button";
import { IconoCerrar, IconoMenu } from "@/components/ui/icons";
import { LocaleSwitch } from "@/components/ui/LocaleSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useContent } from "@/i18n/locale-context";
import { chatDisponible } from "@/lib/chatWidget";
import { cvDisponible } from "@/lib/cv";
import { Container } from "./Container";

/**
 * Cabecera fija. En escritorio muestra la navegación por anclas completa; en
 * móvil se pliega en un panel que se cierra al elegir destino o con Escape.
 */
export function Header() {
  const { nav, hero, ui } = useContent();
  const items = nav.items.filter((item) => !item.requiereChat || chatDisponible);
  const { pathname } = useLocation();
  // Fuera de la portada las anclas tienen que volver a ella primero.
  const destino = (ancla: string) => (pathname === "/" ? ancla : `/${ancla}`);
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);

  // Escape cierra el panel y devuelve el foco al botón que lo abrió.
  useEffect(() => {
    if (!abierto) return;

    const alPulsar = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    };

    document.addEventListener("keydown", alPulsar);
    return () => document.removeEventListener("keydown", alPulsar);
  }, [abierto]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg/85 backdrop-blur-md">
      <Container>
        <div className="flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link
            to={destino("#inicio")}
            className="label-mono text-text transition-opacity duration-(--duration-fast) hover:opacity-70"
          >
            {nav.monograma}
          </Link>

          <nav aria-label={ui.navegacionPrincipal} className="hidden items-center gap-7 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                to={destino(item.href)}
                className="text-small text-text-muted transition-colors duration-(--duration-fast) hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LocaleSwitch />
            </div>
            <ThemeToggle />
            {/* Solo desde lg: en md, con la navegación completa, no cabe. */}
            {cvDisponible && (
              <div className="hidden lg:block">
                <Button href={hero.cvHref} variante="secundario" descargar className="px-4 py-2">
                  {hero.descargarCv}
                </Button>
              </div>
            )}
            <div className="hidden md:block">
              <Button to={destino("#contacto")} variante="primario" className="px-4 py-2">
                {nav.contactar}
              </Button>
            </div>
            <button
              ref={botonMenu}
              type="button"
              onClick={() => setAbierto((valor) => !valor)}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? ui.cerrarMenu : ui.abrirMenu}
              className="inline-flex size-9 items-center justify-center rounded-pill border border-border text-text-muted transition-colors duration-(--duration-fast) hover:border-text hover:text-text md:hidden"
            >
              {abierto ? <IconoCerrar /> : <IconoMenu />}
            </button>
          </div>
        </div>
      </Container>

      {abierto && (
        <div id="menu-movil" className="border-t border-hairline bg-bg md:hidden">
          <Container>
            <nav className="flex flex-col py-2" aria-label={ui.navegacionPrincipal}>
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={destino(item.href)}
                  onClick={() => setAbierto(false)}
                  className="border-b border-hairline py-3.5 text-text-muted transition-colors duration-(--duration-fast) last:border-b-0 hover:text-text"
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-3 py-4">
                <LocaleSwitch />
                <div className="flex flex-wrap items-center gap-2">
                  {cvDisponible && (
                    <Button
                      href={hero.cvHref}
                      variante="secundario"
                      descargar
                      className="px-4 py-2"
                    >
                      {hero.descargarCv}
                    </Button>
                  )}
                  <Button to={destino("#contacto")} variante="primario" className="px-4 py-2">
                    {nav.contactar}
                  </Button>
                </div>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
