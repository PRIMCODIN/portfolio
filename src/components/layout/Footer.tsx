import { useContent } from "@/i18n/locale-context";
import { IconoEnlaceExterno } from "@/components/ui/icons";
import { Container } from "./Container";

export function Footer() {
  const { footer, contacto, hero, ui } = useContent();
  const anio = new Date().getFullYear();

  return (
    <footer className="border-t border-hairline">
      <Container>
        <div className="flex flex-col gap-4 py-10 text-small text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {footer.derechos}
          </p>
          <nav className="flex items-center gap-5" aria-label={ui.navegacionPie}>
            {[hero.github, contacto.linkedin].map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 transition-colors duration-(--duration-fast) hover:text-text"
              >
                {enlace.label}
                <IconoEnlaceExterno className="opacity-70" />
              </a>
            ))}
          </nav>
          <p className="label-mono">{footer.hechoCon}</p>
        </div>
      </Container>
    </footer>
  );
}
