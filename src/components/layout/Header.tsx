import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { IconoCerrar, IconoMenu } from "@/components/ui/icons";
import { LocaleSwitch } from "@/components/ui/LocaleSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useContent } from "@/i18n/locale-context";
import { Container } from "./Container";

/**
 * Cabecera fija. En escritorio muestra la navegación por anclas completa; en
 * móvil se pliega en un panel que se cierra al elegir destino o con Escape.
 */
export function Header() {
  const { nav, ui } = useContent();
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
          <a
            href="#inicio"
            className="label-mono text-text transition-opacity duration-[--duration-fast] hover:opacity-70"
          >
            {nav.monograma}
          </a>

          <nav aria-label={nav.contactar} className="hidden items-center gap-7 md:flex">
            {nav.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-small text-text-muted transition-colors duration-[--duration-fast] hover:text-text"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LocaleSwitch />
            </div>
            <ThemeToggle />
            <div className="hidden md:block">
              <Button href="#contacto" variante="primario" className="px-4 py-2">
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
              className="inline-flex size-9 items-center justify-center rounded-pill border border-border text-text-muted transition-colors duration-[--duration-fast] hover:border-text hover:text-text md:hidden"
            >
              {abierto ? <IconoCerrar /> : <IconoMenu />}
            </button>
          </div>
        </div>
      </Container>

      {abierto && (
        <div id="menu-movil" className="border-t border-hairline bg-bg md:hidden">
          <Container>
            <nav className="flex flex-col py-2" aria-label={ui.abrirMenu}>
              {nav.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className="border-b border-hairline py-3.5 text-text-muted transition-colors duration-[--duration-fast] last:border-b-0 hover:text-text"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center justify-between gap-3 py-4">
                <LocaleSwitch />
                <Button href="#contacto" variante="primario" className="px-4 py-2">
                  {nav.contactar}
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
