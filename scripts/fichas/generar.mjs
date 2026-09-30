// Genera fichas técnicas en PDF a partir de los datos.
//
//   node scripts/fichas/generar.mjs <carpeta-de-salida> [slug ...]
//
// Sin slugs genera todas las piezas. Imprime con Chrome sin interfaz, así que
// la tipografía y el diseño salen idénticos a la vista previa en el navegador.
//
// Plantilla aprobada por Daniel el 30 de septiembre de 2026. Las fichas del
// sitio se generan con `npm run fichas`, que las deja en public/fichas/ con el
// nombre neucast-{slug}.pdf; la ficha web enlaza a la suya. Se generan en una
// Mac a propósito: la plantilla usa Helvetica Neue, que los servidores Linux
// no tienen. Hacerlo al publicar queda pendiente (docs/pendientes.md).
//
// El HTML intermedio va a una carpeta temporal, nunca junto a los PDF: si no,
// acabaría publicado dentro del sitio.
import fs from "node:fs";
import os from "node:os";
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
const temporal = fs.mkdtempSync(path.join(os.tmpdir(), "neucast-fichas-"));

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
  const htmlRuta = path.join(temporal, `${pieza.slug}.html`);
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
  const kb = Math.round(fs.statSync(pdfRuta).size / 1024);
  console.log(`✓ ${path.basename(pdfRuta)} · ${kb} KB`);
}
fs.rmSync(temporal, { recursive: true, force: true });
