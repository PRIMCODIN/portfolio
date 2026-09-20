import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { Footer } from "@/components/layout/Footer";
import { GridLines } from "@/components/layout/GridLines";
import { Header } from "@/components/layout/Header";
import { ScrollManager } from "@/components/layout/ScrollManager";
import { SkipLink } from "@/components/ui/SkipLink";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { Home } from "@/pages/Home";
import { Og } from "@/pages/Og";
import { ThemeProvider } from "@/theme/ThemeProvider";

// El caso de estudio se carga aparte: no lastra la portada, que es lo que
// casi todo el mundo va a ver.
const CaseStudy = lazy(() =>
  import("@/pages/CaseStudy").then((modulo) => ({ default: modulo.CaseStudy })),
);

function Sitio() {
  return (
    <>
      <ScrollManager />
      <SkipLink />
      <GridLines />
      <Header />
      <main id="contenido">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/proyectos/:slug"
            element={
              <Suspense fallback={<div className="min-h-svh" />}>
                <CaseStudy />
              </Suspense>
            }
          />
          {/* Lienzo de la imagen Open Graph: solo en desarrollo. */}
          {import.meta.env.DEV && <Route path="/og" element={<Og />} />}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <BrowserRouter>
          <Sitio />
        </BrowserRouter>
      </LocaleProvider>
    </ThemeProvider>
  );
}
