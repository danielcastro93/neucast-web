// Índice del buscador.
//
// Se genera en la compilación con las mismas listas que generan las páginas:
// si se agrega una pieza, una categoría o un proyecto, el buscador la encuentra
// en la siguiente publicación sin tocar nada más. No hay servidor de búsqueda;
// el navegador descarga este archivo la primera vez que alguien abre el
// buscador y busca ahí mismo, al teclear.
//
// Pensado para 500 piezas o más: cada pieza son unos 250 bytes, así que el
// catálogo completo pesa decenas de KB comprimido y solo se pide cuando se usa.
// Por eso lleva lo justo para encontrar y pintar un resultado, nada de la
// ficha técnica.
//
// Claves cortas a propósito, porque el archivo crece con el catálogo:
//   n nombre · t tipo · c categoría · m material · k colores · u dirección · i foto
import { categories } from "../data/site.js";
import { piezas, rutaPieza, materiales, gruposColor } from "../data/catalogo.js";
import { proyectos } from "../data/proyectos.js";
import { homeOffice } from "../data/homeOffice.js";
import { todosLosMuebles } from "../data/site.js";

const nombreDe = (lista, id) => lista.find((x) => x.id === id)?.nombre || "";

export function GET() {
  const catNombre = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

  const indice = {
    piezas: piezas.map((p) => ({
      n: p.nombre,
      t: p.tipo,
      c: catNombre[p.cat] || "",
      m: nombreDe(materiales, p.material),
      // colores y espacios: "home office" también encuentra sus piezas
      k: [...(p.colores || []).map((id) => nombreDe(gruposColor, id)), ...(p.espacios || []).includes("home-office") ? ["home office casa"] : []]
        .filter(Boolean)
        .join(" "),
      u: rutaPieza(p),
      i: p.img?.[0] || "",
    })),
    // las secciones que no son categoría van en la misma lista y se buscan
    // igual; `e` es la etiqueta que lleva el resultado (por omisión, Categoría)
    categorias: [
      ...categories.map((c) => ({ n: c.name, u: `/muebles/${c.slug}/`, i: c.photo })),
      { n: homeOffice.nombre, u: homeOffice.ruta, i: homeOffice.portada.img, e: "Espacio" },
      { n: "Catálogos en PDF", u: "/recursos/", i: todosLosMuebles.photo, e: "Descargas" },
    ],
    proyectos: proyectos.map((p) => ({
      n: p.nombre,
      t: `${p.espacio} · ${p.ciudad}`,
      u: `/proyectos/${p.slug}/`,
      i: p.portada?.img || "",
    })),
  };

  return new Response(JSON.stringify(indice), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
