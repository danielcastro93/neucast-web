// Cómo se leen las listas configurables (admin/public/api/listas.json y,
// después, la API). Una lista dice si se elige una opción o varias, en qué
// categorías aparece (null = todas), en cuáles es obligatoria ("todas" o una
// lista de categorías), si filtra en el sitio y sus opciones. El valor de cada
// lista se guarda en la pieza con el `id` de la lista: material, entrega,
// uso, respaldo… o el de cualquier lista nueva.
//
// Tres listas tienen su propio control en la pieza: material y disponibilidad
// (un desplegable) y colores (sale de los acabados). Las demás son chips.
export const CONTROL_PROPIO = new Set(["material", "entrega", "colores"]);

export const lista = (listas, id) => listas.listas.find((l) => l.id === id);
export const opciones = (listas, id) => lista(listas, id)?.opciones || [];
export const nombreOpcion = (listas, id, valor) => opciones(listas, id).find((o) => o.id === valor)?.nombre || "";

export const aplica = (l, cat) => !l.categorias || (!!cat && l.categorias.includes(cat));
export const esObligatoria = (l, cat) => l.obligatoria === "todas" || (!!cat && (l.obligatoria || []).includes(cat));

// Las listas que se eligen con chips en una categoría, en su orden.
export const listasDeChips = (listas, cat) =>
  listas.listas.filter((l) => !CONTROL_PROPIO.has(l.id) && aplica(l, cat));

// Las obligatorias de una categoría (para el avance y la validación).
export const obligatoriasDe = (listas, cat) =>
  listas.listas.filter((l) => aplica(l, cat) && esObligatoria(l, cat)).map((l) => l.id);

// Medidas que aplican a una categoría, por grupo.
export const medidasDe = (listas, cat, todas = false) =>
  listas.medidas.filter((m) => todas || !m.categorias || (!!cat && m.categorias.includes(cat)));
export const partesDe = (listas, cat, todas = false) =>
  listas.partes.filter((p) => todas || !p.categorias || (!!cat && p.categorias.includes(cat)));

export const medida = (listas, id) => listas.medidas.find((m) => m.id === id);
export const esConteo = (m) => !m?.unidad;

// Un id nuevo sin acentos y único dentro de un arreglo de objetos con `id`.
export function idNuevo(nombre, existentes, limpiar) {
  const raiz = limpiar(nombre) || "opcion";
  let id = raiz;
  for (let n = 2; existentes.some((o) => o.id === id); n++) id = `${raiz}-${n}`;
  return id;
}
