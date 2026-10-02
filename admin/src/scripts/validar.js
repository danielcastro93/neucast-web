// Las reglas que el administrador aplica antes de dejar publicar.
//
// Devuelven un objeto { campo: mensaje }. Vacío quiere decir que todo pasa.
// La API real tiene que volver a validar: esto es comodidad para quien
// captura, no seguridad.
import { OBLIGATORIOS, SEGUN_CATEGORIA, MEDIDAS, ETIQUETAS } from "./esquemas/pieza.js";

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

export function validarPieza(pieza, listas) {
  const errores = {};
  const valor = (campo) =>
    campo === "resumen" ? pieza.ficha?.resumen
    : campo === "acabados" ? acabadosDe(pieza).filter((a) => a.grupo)
    : pieza[campo];

  for (const campo of OBLIGATORIOS) {
    if (vacio(valor(campo))) errores[campo] = `Falta ${ETIQUETAS[campo]}`;
  }
  for (const campo of SEGUN_CATEGORIA[pieza.cat] || []) {
    if (vacio(pieza[campo])) errores[campo] = `Falta ${ETIQUETAS[campo]}: lo piden las piezas de esta categoría`;
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
  if (listas) {
    const ids = (lista) => new Set((lista || []).map((o) => o.id));
    const deFiltro = (campo) => ids(listas.filtros.find((f) => f.campo === campo)?.opciones);
    if (pieza.material && !ids(listas.materiales).has(pieza.material)) errores.material = "Material fuera de la lista";
    if ((pieza.acabados || []).some((a) => a.grupo && !ids(listas.gruposColor).has(a.grupo))) errores.acabados = "Hay un acabado con un grupo de color fuera de la lista";
    for (const campo of ["uso", "respaldo", "brazos", "base", "plazas", "entrega"]) {
      if (!vacio(pieza[campo]) && !deFiltro(campo).has(String(pieza[campo]))) errores[campo] = "Valor fuera de la lista";
    }
    if ((pieza.extras || []).some((x) => !deFiltro("extras").has(x))) errores.extras = "Hay una característica fuera de la lista";
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
