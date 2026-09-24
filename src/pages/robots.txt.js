// robots.txt
//
// Se genera en vez de escribirse a mano para que la dirección del mapa salga
// del mismo `site.domain` que usan las canónicas. Un robots.txt con el dominio
// equivocado es de los errores más caros y más difíciles de ver.
//
// No se bloquea nada por aquí: las páginas que no deben indexarse lo dicen con
// su propia etiqueta `noindex`, que es lo que Google respeta. Bloquearlas
// además en robots.txt sería contraproducente, porque el robot no podría
// entrar a leer esa etiqueta.
//
// PARA WORDPRESS: si el sitio queda detrás de un dominio de pruebas antes de
// salir a producción, ahí sí conviene un `Disallow: /` temporal. Acuérdate de
// quitarlo el día del lanzamiento.
import { site } from "../data/site.js";

export function GET() {
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${site.domain}/sitemap.xml
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
}
