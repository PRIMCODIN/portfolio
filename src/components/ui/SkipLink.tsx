import { useContent } from "@/i18n/locale-context";

/** Primer elemento enfocable de la página: salta directo al contenido. */
export function SkipLink() {
  const { ui } = useContent();

  return (
    <a
      href="#contenido"
      className="skip-link rounded-pill border border-border bg-surface px-4 py-2 text-small"
    >
      {ui.saltarAlContenido}
    </a>
  );
}
