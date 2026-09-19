import { LocaleProvider } from "@/i18n/LocaleProvider";
import { useContent } from "@/i18n/locale-context";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { useTheme } from "@/theme/theme-context";

// Provisional: comprueba que el contenido y los dos proveedores están en pie.
// La cabecera, el enrutado y las secciones llegan en las fases siguientes.
function Borrador() {
  const contenido = useContent();
  const { tema, alternarTema } = useTheme();

  return (
    <main className="container-grid py-24">
      <p className="label-mono">// andamiaje</p>
      <h1 className="mt-4 text-display">{contenido.hero.nombre}</h1>
      <p className="mt-4 text-h3 text-text-muted">{contenido.hero.titular}</p>
      <p className="mt-6 max-w-[68ch]">{contenido.hero.propuesta}</p>
      <button
        type="button"
        onClick={alternarTema}
        className="mt-8 rounded-pill border border-border px-4 py-2 text-small"
      >
        {tema === "dark" ? contenido.ui.temaClaro : contenido.ui.temaOscuro}
      </button>
    </main>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <Borrador />
      </LocaleProvider>
    </ThemeProvider>
  );
}
