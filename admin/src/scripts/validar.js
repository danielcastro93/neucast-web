// Las reglas que el administrador aplica antes de dejar publicar.
//
// Devuelven un objeto { campo: mensaje }. Vacío quiere decir que todo pasa.
// La API real tiene que volver a validar: esto es comodidad para quien
// captura, no seguridad.
import { OBLIGATORIOS, MEDIDAS, ETIQUETAS } from "./esquemas/pieza.js";
import { aplica, esObligatoria } from "./listas.js";
import { OBLIGATORIOS_CATEGORIA, OBLIGATORIOS_TODOS, MEDIDAS_CATEGORIA, ETIQUETAS_CATEGORIA } from "./esquemas/categoria.js";

// Lo que no puede ir en ningún texto del sitio (regla 1 y regla 3).
const PROHIBIDAS = /\b(fabricante|fabricamos|comercializadora|distribuidor|mayorista|proveedor)\b/i;
const GUION_LARGO = /[—–]/;

const vacio = (v) => v == null || v === "" || (Array.isArray(v) && v.length === 0);

export function revisarTexto(texto) {
  if (!texto) return null;
  if (GUION_LARGO.test(texto)) return "Lleva un guion largo; en el sitio no se usan";
  const m = texto.match(PROHIBIDAS);
  if (m) return `No se puede usar la palabra "${m[0]}": el mobiliario se presenta como de Neucast`;
  return null;
}

export function revisarMedida(campo, texto) {
  const m = MEDIDAS[campo];
  if (!m || !texto) return null;
  const n = texto.trim().length;
  if (n < m.min) return `Muy corto: ${n} de ${m.min} caracteres mínimos`;
  if (n > m.max) return `Muy largo: ${n} de ${m.max} caracteres máximos`;
  return null;
}

// Las piezas que vienen de antes solo traen `colores` (los grupos). Mientras
// no tengan acabados con nombre comercial, sus grupos cuentan como acabados.
export const acabadosDe = (pieza) =>
  pieza.acabados?.length ? pieza.acabados : (pieza.colores || []).map((grupo) => ({ nombre: "", grupo }));

export function validarPieza(pieza, listas, categorias = null) {
  const errores = {};
  // una pieza publicada necesita una categoría que exista y esté publicada
  if (categorias && pieza.cat && pieza.estado === "publicada") {
    const c = categorias.find((x) => x.slug === pieza.cat);
    if (!c) errores.cat = "Esa categoría ya no existe";
    else if (c.estado === "borrador") errores.cat = `"${c.name}" está en borrador: publica primero la categoría`;
  }
  const valor = (campo) =>
    campo === "resumen" ? pieza.ficha?.resumen
    : campo === "acabados" ? acabadosDe(pieza).filter((a) => a.grupo)
    : pieza[campo];

  for (const campo of OBLIGATORIOS) {
    if (vacio(valor(campo))) errores[campo] = `Falta ${ETIQUETAS[campo]}`;
  }
  // las listas obligatorias en la categoría de la pieza
  for (const l of listas?.listas || []) {
    if (l.id === "colores" || !aplica(l, pieza.cat) || !esObligatoria(l, pieza.cat)) continue;
    if (vacio(pieza[l.id])) {
      const donde = l.obligatoria === "todas" ? "" : ": lo piden las piezas de esta categoría";
      errores[l.id] = `Falta ${l.nombre.toLowerCase()}${donde}`;
    }
  }

  if (pieza.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(pieza.slug)) {
    errores.slug = "Solo minúsculas, números y guiones, sin acentos";
  }

  for (const campo of ["nombre", "tipo", "alt"]) {
    const e = revisarTexto(pieza[campo]) || revisarMedida(campo, pieza[campo]);
    if (e && !errores[campo]) errores[campo] = e;
  }
  const r = pieza.ficha?.resumen;
  const er = revisarTexto(r) || revisarMedida("resumen", r);
  if (er && !errores.resumen) errores.resumen = er;

  // Las listas cerradas: un valor fuera de la lista rompe el filtro sin aviso.
  for (const l of listas?.listas || []) {
    const ids = new Set(l.opciones.map((o) => o.id));
    if (l.id === "colores") {
      if (acabadosDe(pieza).some((a) => a.grupo && !ids.has(a.grupo))) errores.acabados = "Hay un acabado con un grupo de color fuera de la lista";
      continue;
    }
    const v = pieza[l.id];
    if (vacio(v)) continue;
    const fuera = Array.isArray(v) ? v.some((x) => !ids.has(String(x))) : !ids.has(String(v));
    if (fuera) errores[l.id] = l.seleccion === "varias" ? `Hay una opción de ${l.nombre.toLowerCase()} fuera de la lista` : "Valor fuera de la lista";
  }

  return errores;
}

// La dirección se propone a partir del tipo y el nombre, como en el catálogo
// de hoy: "Silla operativa" + "Órbita" → silla-orbita (docs/catalogo.md).
export function proponerSlug(tipo, nombre) {
  const primera = (tipo || "").trim().split(/\s+/)[0] || "";
  return limpiarSlug(`${primera} ${nombre || ""}`);
}

export function limpiarSlug(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Una categoría, o "Todos los muebles" con `{ todos: true }`.
export function validarCategoria(cat, { todos = false } = {}) {
  const errores = {};
  for (const campo of todos ? OBLIGATORIOS_TODOS : OBLIGATORIOS_CATEGORIA) {
    if (vacio(typeof cat[campo] === "string" ? cat[campo].trim() : cat[campo])) errores[campo] = `Falta ${ETIQUETAS_CATEGORIA[campo]}`;
  }
  if (!todos && cat.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(cat.slug)) {
    errores.slug = "Solo minúsculas, números y guiones, sin acentos";
  }
  for (const [campo, m] of Object.entries(MEDIDAS_CATEGORIA)) {
    const t = (cat[campo] || "").trim();
    if (!t || errores[campo]) continue;
    const e = revisarTexto(t) || (t.length < m.min ? `Muy corto: ${t.length} de ${m.min} caracteres mínimos` : t.length > m.max ? `Muy largo: ${t.length} de ${m.max} caracteres máximos` : null);
    if (e) errores[campo] = e;
  }
  return errores;
}

// Un bloque editorial. Para prenderlo necesita imagen, rótulo, título, botón
// y destino; apagado se puede guardar a medias.
export const ETIQUETAS_BLOQUE = { img: "la imagen", alt: "el texto alternativo", antetitulo: "el rótulo", titulo: "el título", cta: "el texto del botón", destino: "a dónde lleva" };
export const MEDIDAS_BLOQUE = { antetitulo: { min: 3, max: 40 }, titulo: { min: 10, max: 60 }, cta: { min: 3, max: 30 }, alt: { min: 20, max: 160 } };
export function validarBloque(b) {
  const errores = {};
  for (const campo of ["img", "alt", "antetitulo", "titulo", "cta"]) {
    if (vacio((b[campo] || "").trim())) errores[campo] = `Falta ${ETIQUETAS_BLOQUE[campo]}`;
  }
  const d = b.destino || {};
  if (!d.tipo || (d.tipo !== "proyectos" && vacio(d.valor))) errores.destino = "Falta a dónde lleva";
  else if (d.tipo === "externo" && !/^https?:\/\/\S+$/.test(d.valor)) errores.destino = "La dirección externa empieza con https://";
  for (const [campo, m] of Object.entries(MEDIDAS_BLOQUE)) {
    const t = (b[campo] || "").trim();
    if (!t || errores[campo]) continue;
    const e = revisarTexto(t) || (t.length < m.min ? `Muy corto: ${t.length} de ${m.min} caracteres mínimos` : t.length > m.max ? `Muy largo: ${t.length} de ${m.max} caracteres máximos` : null);
    if (e) errores[campo] = e;
  }
  return errores;
}
export const enlaceDeBloque = (d) =>
  !d ? "" : d.tipo === "proyectos" ? "/proyectos/" : d.tipo === "proyecto" ? `/proyectos/${d.valor}/` : d.tipo === "categoria" ? `/muebles/${d.valor}/` : d.valor || "";
