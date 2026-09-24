// Revisión del sitio compilado.
//
//   npm run build && npm run revisar
//
// Recorre dist/ y comprueba de golpe lo que hay que comprobar antes de
// publicar. Devuelve código 1 si algo falla, para que sirva en un proceso
// automático.
//
// PARA WORDPRESS: cuando el contenido venga del CMS esto es lo que avisa de que
// alguien escribió un texto demasiado largo, dejó un enlace muerto o metió una
// palabra que no va. Conviene correrlo en cada publicación.
import fs from "fs";
import path from "path";

const DIST = "dist";
if (!fs.existsSync(DIST)) {
  console.error("No hay dist/. Corre primero: npm run build");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Reglas del proyecto
// ---------------------------------------------------------------------------

// Nunca se menciona el origen de la pieza. Las dos excepciones son legítimas:
// en el aviso de privacidad "proveedor" es una categoría de tercero, y en las
// preguntas frecuentes Neucast es el proveedor al que da de alta el cliente.
const PROHIBIDAS = /\b(fabricante|fabricamos|comercializadora|distribuidor|mayorista)\b/gi;
const EXCEPCIONES = ["/aviso-de-privacidad/", "/preguntas-frecuentes/"];

const TITULO = [30, 65];
const DESCRIPCION = [70, 160];

// ---------------------------------------------------------------------------

const paginas = [];
(function rec(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) rec(f);
    else if (e.name.endsWith(".html")) paginas.push(f);
  }
})(DIST);

const ruta = (f) => "/" + path.relative(DIST, f).replace(/index\.html$/, "").replace(/\\/g, "/");
const hayPagina = (h) => {
  const l = h.split("#")[0].split("?")[0];
  if (!l || l === "/") return true;
  const b = path.join(DIST, l);
  return fs.existsSync(b) || fs.existsSync(b + ".html") || fs.existsSync(path.join(b, "index.html"));
};

const fallos = [];
const indexables = [];

for (const f of paginas) {
  const crudo = fs.readFileSync(f, "utf8");
  // fuera los <script>: dentro hay plantillas de JS que parecen enlaces
  const html = crudo.replace(/<script[\s\S]*?<\/script>/g, "");
  const r = ruta(f);
  const falla = (m) => fallos.push(`${r}: ${m}`);

  // --- enlaces ---
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const h = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(h)) continue;
    if (h.startsWith("#")) {
      if (!html.includes(`id="${h.slice(1)}"`)) falla(`ancla sin destino ${h}`);
      continue;
    }
    if (/\.(css|js|ico|svg|png|jpe?g|webp|mp4|woff2?|xml|txt|pdf)$/i.test(h)) {
      if (!fs.existsSync(path.join(DIST, h.split("?")[0]))) falla(`archivo que no existe ${h}`);
      continue;
    }
    if (!hayPagina(h)) falla(`enlace muerto ${h}`);
  }

  // --- texto visible ---
  const visible = html
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<head[\s\S]*?<\/head>/g, "")
    .replace(/<[^>]+>/g, " ");
  if (visible.includes("—")) falla("guion largo en el texto visible");
  if (!EXCEPCIONES.includes(r)) {
    const p = visible.match(PROHIBIDAS);
    if (p) falla(`palabra que no va: ${[...new Set(p)].join(", ")}`);
  }

  // --- cabeza ---
  const t = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  const d = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  const noindex = /content="noindex/.test(html);
  if (!noindex) {
    indexables.push(r);
    if (t.length < TITULO[0] || t.length > TITULO[1]) falla(`título de ${t.length} caracteres`);
    if (d.length < DESCRIPCION[0] || d.length > DESCRIPCION[1]) falla(`descripción de ${d.length} caracteres`);
  }
  if (!/<link rel="canonical"/.test(html)) falla("sin canónica");
  if (!/<meta name="robots"/.test(html)) falla("sin etiqueta robots");
  if (!/<html[^>]*lang="es-MX"/.test(html)) falla("sin lang es-MX");

  // --- encabezados ---
  const h1 = (html.match(/<h1\b/g) || []).length;
  if (h1 !== 1) falla(`${h1} encabezados h1`);
  const niveles = [...html.matchAll(/<(h[1-6])\b/g)].map((x) => Number(x[1][1]));
  for (let i = 1; i < niveles.length; i++) {
    if (niveles[i] - niveles[i - 1] > 1) {
      falla(`salto de encabezado h${niveles[i - 1]} a h${niveles[i]}`);
      break;
    }
  }

  // --- imágenes ---
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt[=\s>]/.test(m[0])) falla(`imagen sin alt: ${m[0].slice(0, 60)}`);
  }
}

// --- mapa del sitio ---
const mapa = path.join(DIST, "sitemap.xml");
if (!fs.existsSync(mapa)) fallos.push("no hay sitemap.xml");
else {
  const xml = fs.readFileSync(mapa, "utf8");
  const enMapa = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  for (const r of indexables) if (!enMapa.includes(r)) fallos.push(`${r}: indexable y fuera del mapa`);
  for (const r of enMapa) if (!indexables.includes(r)) fallos.push(`${r}: en el mapa y no es indexable`);
}
if (!fs.existsSync(path.join(DIST, "robots.txt"))) fallos.push("no hay robots.txt");

// ---------------------------------------------------------------------------

console.log(`Revisadas ${paginas.length} páginas, ${indexables.length} indexables.`);
if (!fallos.length) {
  console.log("Todo en orden.");
  process.exit(0);
}
console.log(`\n${fallos.length} cosas que revisar:\n`);
fallos.forEach((f) => console.log("  " + f));
process.exit(1);
