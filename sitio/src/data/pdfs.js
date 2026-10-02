// Los PDF que se descargan del sitio: fichas técnicas y catálogos.
//
// Se generan con la plantilla de Neucast y viven en public/ (ver
// scripts/fichas/). Aquí solo se averigua si existen y qué traen: el número de
// hojas y el peso se leen del archivo mismo, así que un botón nunca promete
// algo que el PDF no tiene. Si un PDF no existe, quien lo use no pinta el
// botón, en vez de dejar un enlace roto.
//
// CATÁLOGOS PROPIOS: si el cliente pasa un catálogo suyo para una categoría,
// se guarda en public/catalogos/propios/ con el mismo nombre que el generado
// (neucast-catalogo-{categoria}.pdf) y se descarga ese en su lugar. El
// generado se sigue haciendo, pero no se enlaza.
import fs from "node:fs";
import path from "node:path";

const PUBLICO = path.join(process.cwd(), "public");

function infoPdf(ruta) {
  const archivo = path.join(PUBLICO, ruta);
  if (!fs.existsSync(archivo)) return null;
  const bytes = fs.readFileSync(archivo);
  const hojas = (bytes.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
  const kb = bytes.length / 1024;
  const peso = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
  return { ruta, hojas, peso, meta: `PDF · ${hojas === 1 ? "1 hoja" : `${hojas} hojas`} · ${peso}` };
}

export const fichaPdf = (pieza) => infoPdf(`/fichas/neucast-${pieza.slug}.pdf`);

// "general" para el de todo el catálogo; si no, el slug de la categoría
export function catalogoPdf(slug) {
  const nombre = `neucast-catalogo-${slug}.pdf`;
  const propio = infoPdf(`/catalogos/propios/${nombre}`);
  return propio ? { ...propio, propio: true } : infoPdf(`/catalogos/${nombre}`);
}
