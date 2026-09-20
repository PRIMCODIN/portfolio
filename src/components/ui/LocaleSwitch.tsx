import { idiomas } from "@/content";
import { useContent, useLocale } from "@/i18n/locale-context";
import { cn } from "@/lib/cn";

/** Selector de idioma. Dos opciones, así que van las dos a la vista. */
export function LocaleSwitch() {
  const { locale, setLocale } = useLocale();
  const { ui } = useContent();

  return (
    <div
      role="group"
      aria-label={ui.cambiarIdioma}
      className="inline-flex items-center rounded-pill border border-border p-0.5"
    >
      {idiomas.map((idioma) => {
        const activo = idioma === locale;
        return (
          <button
            key={idioma}
            type="button"
            lang={idioma}
            aria-pressed={activo}
            onClick={() => setLocale(idioma)}
            className={cn(
              "label-mono rounded-pill px-2.5 py-1 transition-colors duration-[--duration-fast] ease-[--ease-soft]",
              activo ? "bg-text text-bg" : "hover:text-text",
            )}
          >
            {idioma}
          </button>
        );
      })}
    </div>
  );
}
