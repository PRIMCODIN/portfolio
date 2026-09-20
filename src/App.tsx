import { Footer } from "@/components/layout/Footer";
import { GridLines } from "@/components/layout/GridLines";
import { Header } from "@/components/layout/Header";
import { Section } from "@/components/layout/Section";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { SkipLink } from "@/components/ui/SkipLink";
import { useContent } from "@/i18n/locale-context";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { ThemeProvider } from "@/theme/ThemeProvider";

// Provisional: comprueba el esqueleto de layout. Las secciones reales llegan
// en las fases siguientes.
function Borrador() {
  const contenido = useContent();

  return (
    <>
      <SkipLink />
      <GridLines />
      <Header />
      <main id="contenido">
        <div id="inicio" className="container-grid pt-[calc(var(--header-h)+6rem)] pb-24">
          <p className="label-mono">{"// "}00 — {contenido.hero.etiqueta}</p>
          <h1 className="mt-6 text-display">{contenido.hero.nombre}</h1>
          <p className="mt-6 max-w-[42ch] text-h3 text-text-muted">{contenido.hero.titular}</p>
          <div className="mt-8">
            <Badge>{contenido.disponibilidad}</Badge>
          </div>
        </div>

        <Section
          id="stack"
          numero={5}
          etiqueta={contenido.stack.etiqueta}
          titulo={contenido.stack.titulo}
          intro={contenido.stack.intro}
        >
          <ul className="flex flex-wrap gap-2">
            {contenido.stack.grupos[0]?.items.map((item) => (
              <li key={item}>
                <Chip>{item}</Chip>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          id="contacto"
          numero={9}
          etiqueta={contenido.contacto.etiqueta}
          titulo={contenido.contacto.titulo}
          intro={contenido.contacto.intro}
        >
          <Badge>{contenido.disponibilidad}</Badge>
        </Section>
      </main>
      <Footer />
    </>
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
