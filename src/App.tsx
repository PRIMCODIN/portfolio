import { Footer } from "@/components/layout/Footer";
import { GridLines } from "@/components/layout/GridLines";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/ui/SkipLink";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { Home } from "@/pages/Home";
import { ThemeProvider } from "@/theme/ThemeProvider";

function Sitio() {
  return (
    <>
      <SkipLink />
      <GridLines />
      <Header />
      <main id="contenido">
        <Home />
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <Sitio />
      </LocaleProvider>
    </ThemeProvider>
  );
}
