// Genera los catálogos en PDF: uno por categoría y el general.
//
//   node scripts/fichas/catalogos.mjs <carpeta-de-salida>
//   node scripts/fichas/catalogos.mjs <carpeta-de-salida> --escala 100,200
//
// --escala es para medir: arma catálogos de prueba de N piezas repitiendo las
// del catálogo de maqueta, cada una con su foto única, y dice cuánto pesan.
// Sirve para saber cómo se comportará el archivo cuando una categoría crezca.
//
// Como las fichas, se imprime con Chrome sin interfaz y en una Mac, por la
// Helvetica Neue. Las fotos se achican antes con fotos.py (Python + Pillow).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { hojasDeCatalogo, hojasDeGeneral, documentoCatalogo } from "./catalogo.mjs";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const PUBLICO = path.join(RAIZ, "public");
const CHROME =
  process.env.CHROME ||
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((c) =>
    fs.existsSync(c)
  );
if (!CHROME) {
  console.error("No encontré Chrome. Indica la ruta con CHROME=/ruta/al/chrome");
  process.exit(1);
}

const args = process.argv.slice(2);
const salida = args[0];
const iEscala = args.indexOf("--escala");
const escalas = iEscala > -1 ? args[iEscala + 1].split(",").map(Number) : [];
// --compacto: dos piezas por hoja y sin foto de ambiente
const compacto = args.includes("--compacto");
const porHoja = compacto ? 2 : 1;
const sufijo = compacto ? "-compacto" : "";
if (!salida) {
  console.error("Uso: node scripts/fichas/catalogos.mjs <carpeta-de-salida> [--escala 100,200]");
  process.exit(1);
}
fs.mkdirSync(salida, { recursive: true });
const temporal = fs.mkdtempSync(path.join(os.tmpdir(), "neucast-catalogos-"));

const { site, categories, todosLosMuebles } = await import("../../src/data/site.js");
const { piezas, filtros, materiales, gruposColor } = await import("../../src/data/catalogo.js");
const { fichas, etiquetasMedida } = await import("../../src/data/fichas.js");

const nombreOpcion = (campo, id) => filtros.find((x) => x.campo === campo)?.opciones.find((o) => o.id === id)?.nombre || null;
const contexto = { site, nombreOpcion, materiales, gruposColor, fichas, etiquetasMedida };

// --- fotos: se encolan y se procesan todas de una vez ---
const trabajos = [];
const vistas = new Map();
function foto(ruta, tipo, marca = "") {
  if (!ruta) return "";
  const clave = `${ruta}|${tipo}|${marca}`;
  if (!vistas.has(clave)) {
    const destino = path.join(temporal, `f${vistas.size}.jpg`);
    vistas.set(clave, destino);
    trabajos.push([path.join(PUBLICO, ruta), destino, tipo, marca]);
  }
  return "file://" + vistas.get(clave);
}
function procesarFotos() {
  if (!trabajos.length) return;
  const lote = path.join(temporal, "trabajos.json");
  fs.writeFileSync(lote, JSON.stringify(trabajos.splice(0)));
  execFileSync("python3", [path.join(RAIZ, "scripts/fichas/fotos.py"), "--lote", lote], { stdio: "inherit" });
}

function imprimir(html, nombre) {
  const htmlRuta = path.join(temporal, nombre.replace(/\.pdf$/, ".html"));
  const pdfRuta = path.resolve(salida, nombre);
  fs.writeFileSync(htmlRuta, html);
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files", `--print-to-pdf=${pdfRuta}`, "file://" + htmlRuta], { stdio: "ignore" });
  const bytes = fs.readFileSync(pdfRuta);
  const hojas = (bytes.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
  return { nombre, kb: Math.round(bytes.length / 1024), hojas };
}

const informe = [];

// --- uno por categoría ---
for (const categoria of categories) {
  const suyas = piezas.filter((p) => p.cat === categoria.slug);
  if (!suyas.length) continue;
  const html = documentoCatalogo(
    hojasDeCatalogo({
      categoria,
      piezas: suyas,
      fotoPortada: foto(categoria.photo, "portada"),
      fotos: (p) => ({ recorte: foto(p.img[0], "recorte", p.slug), ambiente: compacto ? "" : foto(p.img[1], "ambiente", p.slug) }),
      contexto,
      porHoja,
    }),
    `Catálogo ${categoria.name} · Neucast`
  );
  procesarFotos();
  informe.push({ ...imprimir(html, `neucast-catalogo-${categoria.slug}${sufijo}.pdf`), piezas: suyas.length });
}

// --- general ---
{
  const grupos = categories
    .map((c) => ({ categoria: { ...c, cuenta: piezas.filter((p) => p.cat === c.slug).length }, piezas: piezas.filter((p) => p.cat === c.slug) }))
    .filter((g) => g.piezas.length);
  const html = documentoCatalogo(
    hojasDeGeneral({ grupos, fotoPortada: foto(todosLosMuebles.photo, "portada"), miniatura: (p) => foto(p.img[0], "miniatura", p.slug), contexto }),
    "Catálogo general · Neucast"
  );
  procesarFotos();
  informe.push({ ...imprimir(html, "neucast-catalogo-general.pdf"), piezas: piezas.length });
}

// --- pruebas de escala ---
for (const n of escalas) {
  const categoria = { ...categories[0], name: `Prueba de ${n} piezas` };
  const muchas = Array.from({ length: n }, (_, i) => {
    const p = piezas[i % piezas.length];
    return { ...p, slug: `${p.slug}-${i}`, nombre: `${p.nombre} ${i + 1}` };
  });
  // las fichas se buscan por slug: la copia usa la de su pieza original
  const ctx = { ...contexto, fichas: new Proxy(fichas, { get: (t, k) => t[String(k).replace(/-\d+$/, "")] }) };
  const html = documentoCatalogo(
    hojasDeCatalogo({
      categoria,
      piezas: muchas,
      fotoPortada: foto(categoria.photo, "portada"),
      fotos: (p) => ({ recorte: foto(p.img[0], "recorte", p.slug), ambiente: compacto ? "" : foto(p.img[1], "ambiente", p.slug) }),
      contexto: ctx,
      porHoja,
    }),
    categoria.name
  );
  procesarFotos();
  informe.push({ ...imprimir(html, `prueba-categoria-${n}${sufijo}.pdf`), piezas: n });

  const gruposN = [{ categoria: { ...categoria, cuenta: n }, piezas: muchas }];
  const htmlG = documentoCatalogo(
    hojasDeGeneral({ grupos: gruposN, fotoPortada: foto(todosLosMuebles.photo, "portada"), miniatura: (p) => foto(p.img[0], "miniatura", p.slug), contexto: ctx }),
    `General de ${n} piezas`
  );
  procesarFotos();
  informe.push({ ...imprimir(htmlG, `prueba-general-${n}.pdf`), piezas: n });
}

fs.rmSync(temporal, { recursive: true, force: true });
for (const r of informe) {
  const porPieza = r.piezas ? Math.round(r.kb / r.piezas) : "";
  console.log(`${r.nombre.padEnd(44)} ${String(r.piezas).padStart(4)} piezas  ${String(r.hojas).padStart(4)} hojas  ${String(r.kb).padStart(7)} KB  (${porPieza} KB por pieza)`);
}
