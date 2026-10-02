// @ts-check
import { defineConfig } from "astro/config";

// El administrador es un sitio estático aparte, en su propio subdominio
// (admin.neucast.com.mx). Las páginas son el cascarón: el contenido lo pinta
// el navegador leyendo la API (ver src/scripts/api.js).
export default defineConfig({
  site: "https://admin.neucast.com.mx",
  trailingSlash: "always",
  build: { format: "directory" },
  // Nadie tiene que encontrar el administrador en Google.
  server: { port: 4322 },
});
