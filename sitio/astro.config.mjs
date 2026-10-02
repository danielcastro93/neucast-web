// @ts-check
import { defineConfig } from "astro/config";

// El dominio vive en src/data/site.js, que es el único lugar donde se escribe.
// Aquí se importa para no tenerlo en dos sitios: si cambia, cambia en uno.
import { site } from "./src/data/site.js";

// https://astro.build/config
export default defineConfig({
  // `site` deja que Astro resuelva direcciones absolutas en la compilación.
  site: site.domain,

  // El sitio se publica como carpetas (/muebles/escritorios/index.html), así que
  // todas las direcciones llevan diagonal final. Declararlo evita que una misma
  // página exista con dos direcciones, que es lo que parte el posicionamiento.
  trailingSlash: "always",
  build: { format: "directory" },
});
