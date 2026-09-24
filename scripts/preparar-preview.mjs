// Prepara dist/ para la vista previa de GitHub Pages.
//
//   node scripts/preparar-preview.mjs /neucast-web
//
// SOLO para la vista previa. La compilación de producción no pasa por aquí: en
// neucast.com.mx el sitio se sirve desde la raíz y no hace falta nada de esto.
//
// Hace dos cosas:
//
// 1. Mete el prefijo de la subcarpeta en todas las direcciones absolutas. En
//    Pages el sitio no cuelga de la raíz sino de /neucast-web/, así que un
//    href="/muebles/" apuntaría fuera del sitio.
//
// 2. Pide a los buscadores que no la indexen. Es una copia del sitio en otro
//    dominio: si se indexara, competiría con neucast.com.mx por sus propias
//    palabras. Por eso va noindex en cada página y un robots.txt que cierra
//    todo.
import fs from "fs";
import path from "path";

const DIST = "dist";
const BASE = (process.argv[2] || "").replace(/\/+$/, "");
if (!BASE.startsWith("/")) {
  console.error("Falta el prefijo. Ejemplo: node scripts/preparar-preview.mjs /neucast-web");
  process.exit(1);
}

const archivos = [];
(function rec(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) rec(f);
    else if (e.name.endsWith(".html")) archivos.push(f);
  }
})(DIST);

const NOINDEX = '<meta name="robots" content="noindex, nofollow" />';

let cambios = 0;
for (const f of archivos) {
  let s = fs.readFileSync(f, "utf8");

  // atributos: href, src y action. La doble barra de //dominio.com se respeta.
  s = s.replace(/\s(href|src|action)="\/(?!\/)/g, (m, attr) => ` ${attr}="${BASE}/`);

  // rutas dentro de los scripts, que Astro deja con comillas invertidas
  s = s.replace(/(["'`])\/(gracias|muebles|proyectos|contacto|nosotros|img|video|fichas)\//g,
    (m, q, seg) => `${q}${BASE}/${seg}/`);

  // la vista previa no se indexa nunca
  s = s.replace(/<meta name="robots" content="[^"]*"\s*\/?>/, NOINDEX);
  if (!s.includes(NOINDEX)) s = s.replace("</head>", `${NOINDEX}</head>`);

  fs.writeFileSync(f, s);
  cambios++;
}

// El mapa del sitio de producción no sirve aquí y confunde: apunta al dominio
// real desde una copia que no se indexa.
for (const sobra of ["sitemap.xml"]) {
  const p = path.join(DIST, sobra);
  if (fs.existsSync(p)) fs.rmSync(p);
}

fs.writeFileSync(
  path.join(DIST, "robots.txt"),
  `# Vista previa del sitio. El sitio real es https://neucast.com.mx
User-agent: *
Disallow: /
`
);

// GitHub Pages sirve 404.html cuando no encuentra una ruta.
const cuatro = path.join(DIST, "404", "index.html");
if (fs.existsSync(cuatro)) fs.copyFileSync(cuatro, path.join(DIST, "404.html"));

// Sin esto Pages pasa la carpeta por Jekyll y se come lo que empieza con guion bajo.
fs.writeFileSync(path.join(DIST, ".nojekyll"), "");

console.log(`Vista previa lista: ${cambios} páginas bajo ${BASE}/, sin indexar.`);
