// Qué campos tiene una pieza y qué regla sigue cada uno.
//
// Es la tabla de tres niveles aprobada por el cliente el 30 de septiembre de
// 2026 (docs/mapa-de-conexion.md, 4.0), escrita para que la lean el
// formulario, la validación y la API.

// Obligatorios para todas las piezas.
export const OBLIGATORIOS = ["nombre", "slug", "tipo", "cat", "img", "alt", "resumen", "material", "colores", "entrega", "uso"];

// Obligatorios según la categoría. La llave es el slug de la categoría.
export const SEGUN_CATEGORIA = {
  "sillas-ejecutivas": ["respaldo", "brazos", "base"],
  "sillas-operativas": ["respaldo", "brazos", "base"],
  cafeterias: ["base"],
  "lounge-y-areas-comunes": ["plazas"],
  exteriores: ["plazas"],
  "salas-de-juntas": ["base"],
  escritorios: ["base"],
  almacenamiento: [],
};

// Campos de filtro que se enseñan (aunque no sean obligatorios) por categoría.
export const FILTROS_POR_CATEGORIA = {
  "sillas-ejecutivas": ["uso", "respaldo", "brazos", "base", "extras"],
  "sillas-operativas": ["uso", "respaldo", "brazos", "base", "extras"],
  cafeterias: ["uso", "respaldo", "brazos", "base", "plazas", "extras"],
  "lounge-y-areas-comunes": ["uso", "plazas", "base", "extras"],
  exteriores: ["uso", "plazas", "base", "extras"],
  "salas-de-juntas": ["uso", "base", "extras"],
  escritorios: ["uso", "base", "extras"],
  almacenamiento: ["uso", "extras"],
};

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
  colores: "al menos un acabado",
  entrega: "la disponibilidad",
  uso: "el tipo de uso",
  respaldo: "el respaldo",
  brazos: "los descansabrazos",
  base: "la base",
  plazas: "las plazas",
};

// Una pieza vacía, para dar de alta.
export const piezaVacia = () => ({
  slug: "",
  nombre: "",
  tipo: "",
  cat: "",
  img: [],
  alt: "",
  nuevo: false,
  material: "",
  colores: [],
  entrega: "",
  uso: "",
  respaldo: null,
  brazos: null,
  base: null,
  plazas: null,
  extras: [],
  espacios: [],
  ficha: { resumen: "", destacados: [], medidas: {}, construccion: {}, mecanismo: null, cuidados: [] },
  estado: "borrador",
});
