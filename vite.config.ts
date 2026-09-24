import { existsSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

// Sitio estático sin backend: build a dist/ listo para Cloudflare Pages,
// GitHub Pages o Caddy. El alias @ apunta a src/.
// Los enlaces al CV solo se pintan si el PDF está en public/ al compilar.
const cvDisponible = existsSync(
  fileURLToPath(new URL("./public/cv-victor-prim-romero.pdf", import.meta.url)),
);

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
