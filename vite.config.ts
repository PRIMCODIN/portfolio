import { existsSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

// Sitio estático sin backend: build a dist/ listo para Cloudflare Pages,
// GitHub Pages o Caddy. El alias @ apunta a src/.
// Los enlaces al CV solo se pintan si el PDF de ese idioma está en public/ al
// compilar. Las rutas coinciden con hero.cvHref de cada contenido.
const existePdf = (nombre: string) =>
  existsSync(fileURLToPath(new URL(`./public/${nombre}`, import.meta.url)));
const cvDisponible = {
  es: existePdf("cv-victor-prim-romero.pdf"),
  en: existePdf("cv-victor-prim-romero-en.pdf"),
};

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __CV_DISPONIBLE__: JSON.stringify(cvDisponible),
  },
  build: {
    target: "es2022",
    cssTarget: "chrome111",
    assetsInlineLimit: 2048,
  },
});
