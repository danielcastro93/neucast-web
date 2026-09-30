// Genera fichas técnicas en PDF a partir de los datos.
//
//   node scripts/fichas/generar.mjs <carpeta-de-salida> [slug ...]
//
// Sin slugs genera todas las piezas. Imprime con Chrome sin interfaz, así que
// la tipografía y el diseño salen idénticos a la vista previa en el navegador.
//
// Hoy se usa para aprobar la plantilla. Cuando se automatice, esto correrá al
// publicar y dejará un PDF por pieza en dist/fichas/, más un catálogo por
// categoría con las mismas hojas. Ver docs/pendientes.md.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { hojasDeFicha, documento } from "./plantilla.mjs";

const CHROME =
  process.env.CHROME ||
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((c) =>
    fs.existsSync(c)
  );
if (!CHROME) {
  console.error("No encontré Chrome. Indica la ruta con CHROME=/ruta/al/chrome");
  process.exit(1);
}

const [salida, ...slugs] = process.argv.slice(2);
if (!salida) {
  console.error("Uso: node scripts/fichas/generar.mjs <carpeta-de-salida> [slug ...]");
  process.exit(1);
}
fs.mkdirSync(salida, { recursive: true });

const { site, categories } = await import("../../src/data/site.js");
const { piezas, filtros, materiales, gruposColor } = await import("../../src/data/catalogo.js");
const { fichas, etiquetasMedida, etiquetasConstruccion } = await import("../../src/data/fichas.js");

const nombreOpcion = (campo, id) => {
  const g = filtros.find((x) => x.campo === campo);
  return g?.opciones.find((o) => o.id === id)?.nombre || null;
};

const elegidas = slugs.length ? piezas.filter((p) => slugs.includes(p.slug)) : piezas;
for (const pieza of elegidas) {
  const contexto = {
    site,
    categoria: categories.find((c) => c.slug === pieza.cat),
    nombreOpcion,
    material: materiales.find((m) => m.id === pieza.material),
    colores: (pieza.colores || []).map((id) => gruposColor.find((c) => c.id === id)).filter(Boolean),
    etiquetasMedida,
    etiquetasConstruccion,
  };
  const html = documento(hojasDeFicha({ pieza, ficha: fichas[pieza.slug], contexto }), `${pieza.tipo} ${pieza.nombre} · Ficha técnica`);
  const htmlRuta = path.resolve(salida, `${pieza.slug}.html`);
  const pdfRuta = path.resolve(salida, `neucast-${pieza.slug}.pdf`);
  fs.writeFileSync(htmlRuta, html);
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--allow-file-access-from-files",
    `--print-to-pdf=${pdfRuta}`,
    "file://" + htmlRuta,
  ], { stdio: "ignore" });
  console.log(`✓ ${path.basename(pdfRuta)}`);
}
