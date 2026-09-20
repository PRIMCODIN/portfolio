import { useContent } from "@/i18n/locale-context";
import { useTheme } from "@/theme/theme-context";
import { IconoLuna, IconoSol } from "./icons";

/** Alterna entre tema claro y oscuro. */
export function ThemeToggle() {
  const { tema, alternarTema } = useTheme();
  const { ui } = useContent();
  const etiqueta = tema === "dark" ? ui.temaClaro : ui.temaOscuro;

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={etiqueta}
      title={etiqueta}
      className="inline-flex size-9 items-center justify-center rounded-pill border border-border text-text-muted transition-colors duration-[--duration-fast] ease-[--ease-soft] hover:border-text hover:text-text"
    >
      {tema === "dark" ? <IconoSol /> : <IconoLuna />}
    </button>
  );
}
