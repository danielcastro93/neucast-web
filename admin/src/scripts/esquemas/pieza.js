// Qué campos tiene una pieza y qué regla sigue cada uno.
//
// Es la tabla de tres niveles aprobada por el cliente el 30 de septiembre de
// 2026 (docs/mapa-de-conexion.md, 4.0), escrita para que la lean el
// formulario, la validación y la API.

// Obligatorios para todas las piezas, además de las listas que sean
// obligatorias en su categoría. Qué lista es obligatoria dónde, qué medidas
// pide cada categoría y con qué unidad ya no está aquí: son datos de las
// listas (scripts/listas.js), y se cambian desde la pantalla Listas.
export const OBLIGATORIOS = ["nombre", "slug", "tipo", "cat", "img", "alt", "resumen", "acabados"];

// Medidas de texto (docs/administrador.md, apartado 4).
export const MEDIDAS = {
  nombre: { min: 2, max: 40 },
  tipo: { min: 3, max: 40 },
  alt: { min: 20, max: 160 },
  resumen: { min: 80, max: 320 },
};

// Nombres en pantalla de cada campo, para los mensajes de error.
export const ETIQUETAS = {
  nombre: "el nombre",
  slug: "la dirección",
  tipo: "el tipo de mueble",
  cat: "la categoría",
  img: "al menos una foto",
  alt: "el texto alternativo de la foto principal",
  resumen: "el párrafo descriptivo",
  material: "el material",
  acabados: "al menos un acabado",
};

// Cuántas piezas que combinan se pueden elegir (las que caben en el carrusel).
export const MAX_COMBINA = 8;

// Una pieza vacía, para dar de alta.
export const piezaVacia = () => ({
  slug: "",
  nombre: "",
  tipo: "",
  cat: "",
  img: [],
  alts: [],
  alt: "",
  nuevo: false,
  destacada: false, // entra al carrusel "Piezas destacadas" del inicio
  ambiente: "",     // la foto grande de abajo; vacía = la segunda de la galería
  video: null,      // { src } al final de la galería; null = el video general
  // el valor de cada lista va con el id de la lista (material, entrega,
  // uso, respaldo… o el de una lista nueva)
  material: "",
  // `acabados` guarda el nombre comercial y su grupo; `colores` (lo que filtra
  // el sitio) se deriva de los grupos al guardar.
  acabados: [],
  colores: [],
  entrega: "",
  uso: "",
  respaldo: null,
  brazos: null,
  base: null,
  plazas: null,
  extras: [],
  espacios: [],
  combina: [],
  ficha: { resumen: "", destacados: [], medidas: {}, construccion: {}, mecanismo: null, cuidados: [] },
  estado: "borrador",
});
