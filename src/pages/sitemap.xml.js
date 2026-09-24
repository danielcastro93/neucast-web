// Mapa del sitio.
//
// Se arma con las mismas listas que generan las páginas, así que no hay una
// segunda lista que mantener: si se agrega una categoría, una pieza o un
// proyecto, el mapa lo recoge solo en la siguiente compilación.
//
// PARA WORDPRESS: cuando el catálogo y los proyectos vengan de la API, este
// archivo sigue sirviendo igual. Lo único que cambia es de dónde salen
// `categories`, `piezas` y `proyectos`; la forma del mapa no se toca.
//
// Fuera quedan a propósito las páginas con `noindex`: aviso de privacidad,
// términos y condiciones, gracias y el 404. Un mapa que incluye páginas que se
// pidió no indexar es una contradicción y Search Console la reporta.
import { site, categories } from "../data/site.js";
import { piezas, rutaPieza } from "../data/catalogo.js";
import { proyectos } from "../data/proyectos.js";

// prioridad y frecuencia son pistas, no órdenes: sirven para decir qué parte
// del sitio cambia y cuál es la que vende
const FIJAS = [
  { ruta: "/", prioridad: "1.0", cada: "weekly" },
  { ruta: "/muebles/", prioridad: "0.9", cada: "weekly" },
  { ruta: "/proyectos/", prioridad: "0.8", cada: "monthly" },
  { ruta: "/nosotros/", prioridad: "0.6", cada: "yearly" },
  { ruta: "/contacto/", prioridad: "0.7", cada: "yearly" },
  { ruta: "/preguntas-frecuentes/", prioridad: "0.5", cada: "yearly" },
];

export function GET() {
  const urls = [
    ...FIJAS,
    ...categories.map((c) => ({ ruta: `/muebles/${c.slug}/`, prioridad: "0.8", cada: "weekly" })),
    ...piezas.map((p) => ({ ruta: rutaPieza(p), prioridad: "0.7", cada: "monthly" })),
    ...proyectos.map((p) => ({ ruta: `/proyectos/${p.slug}/`, prioridad: "0.6", cada: "monthly" })),
  ];

  const hoy = new Date().toISOString().slice(0, 10);
  const cuerpo = urls
    .map(
      (u) => `  <url>
    <loc>${new URL(u.ruta, site.domain).href}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${u.cada}</changefreq>
    <priority>${u.prioridad}</priority>
  </url>`
    )
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cuerpo}
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } }
  );
}
