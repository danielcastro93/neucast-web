// Qué campos tiene una pieza y qué regla sigue cada uno.
//
// Es la tabla de tres niveles aprobada por el cliente el 30 de septiembre de
// 2026 (docs/mapa-de-conexion.md, 4.0), escrita para que la lean el
// formulario, la validación y la API.

// Obligatorios para todas las piezas.
export const OBLIGATORIOS = ["nombre", "slug", "tipo", "cat", "img", "alt", "resumen", "material", "acabados", "entrega", "uso"];

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

// Las medidas en grupos. Cada categoría enseña de entrada los grupos que le
// tocan; los demás quedan detrás de "Más medidas". Un grupo con algún dato
// capturado se enseña siempre.
export const GRUPOS_MEDIDA = [
  { id: "generales", nombre: "Generales", claves: ["alto", "ancho", "fondo", "largo", "diametro", "peso"] },
  { id: "asiento", nombre: "Asiento y respaldo", claves: ["altoAsiento", "anchoAsiento", "fondoAsiento", "altoRespaldo", "brazoInterno", "brazoExterno", "cabecera"] },
  { id: "cubierta", nombre: "Cubierta", claves: ["espesorCubierta", "alturaLibre"] },
  { id: "capacidad", nombre: "Capacidad", claves: ["plazas", "personas", "puestos", "apilables", "carga"] },
  { id: "guardado", nombre: "Guardado", claves: ["puertas", "gavetas", "entrepanos", "cargaEntrepano", "cargaGaveta"] },
];
export const MEDIDAS_POR_CATEGORIA = {
  "sillas-ejecutivas": ["generales", "asiento", "capacidad"],
  "sillas-operativas": ["generales", "asiento", "capacidad"],
  cafeterias: ["generales", "asiento", "capacidad", "cubierta"],
  "lounge-y-areas-comunes": ["generales", "asiento", "capacidad", "cubierta"],
  exteriores: ["generales", "asiento", "capacidad", "cubierta"],
  "salas-de-juntas": ["generales", "cubierta", "capacidad"],
  escritorios: ["generales", "cubierta", "capacidad"],
  almacenamiento: ["generales", "guardado"],
};

// La unidad de cada medida: va escrita fuera del campo, para que nadie la
// borre sin querer. Las que no tienen unidad son conteos y solo aceptan
// enteros. Las que admiten rango (lo que se ajusta) se escriben "45-55" y se
// guardan "45 a 55 cm", como en la ficha del sitio.
export const UNIDAD_MEDIDA = {
  alto: "cm", ancho: "cm", fondo: "cm", largo: "cm", diametro: "cm", peso: "kg",
  altoAsiento: "cm", anchoAsiento: "cm", fondoAsiento: "cm", altoRespaldo: "cm",
  brazoInterno: "cm", brazoExterno: "cm", cabecera: "cm",
  espesorCubierta: "mm", alturaLibre: "cm",
  carga: "kg", cargaEntrepano: "kg", cargaGaveta: "kg",
};
export const CONTEOS = new Set(["plazas", "personas", "puestos", "apilables", "puertas", "gavetas", "entrepanos"]);

// Ejemplos para los placeholders. Son ejemplos de formato, no datos: nada de
// esto se publica.
export const EJEMPLO_MEDIDA = {
  alto: "118", ancho: "68", fondo: "70", largo: "240", diametro: "120", peso: "19",
  altoAsiento: "45-55", anchoAsiento: "50", fondoAsiento: "48", altoRespaldo: "72",
  brazoInterno: "48", brazoExterno: "68", cabecera: "26",
  espesorCubierta: "25", alturaLibre: "68",
  plazas: "3", personas: "8", puestos: "4", apilables: "6", carga: "130",
  puertas: "2", gavetas: "3", entrepanos: "4", cargaEntrepano: "30", cargaGaveta: "25",
};

// Qué partes de construcción tiene cada categoría.
export const CONSTRUCCION_POR_CATEGORIA = {
  "sillas-ejecutivas": ["tapiceria", "asiento", "estructura", "base", "ruedas"],
  "sillas-operativas": ["tapiceria", "asiento", "estructura", "base", "ruedas"],
  cafeterias: ["tapiceria", "asiento", "estructura", "base", "acabado"],
  "lounge-y-areas-comunes": ["tapiceria", "armazon", "asiento", "suspension", "patas", "cubierta", "estructura", "base"],
  exteriores: ["estructura", "asiento", "cubierta", "base", "acabado"],
  "salas-de-juntas": ["cubierta", "estructura", "base", "acabado"],
  escritorios: ["cubierta", "estructura", "base", "acabado"],
  almacenamiento: ["estructura", "cubierta", "base", "acabado"],
};
export const EJEMPLO_CONSTRUCCION = {
  tapiceria: "Malla sobre marco de nylon",
  asiento: "Espuma inyectada de alta densidad",
  armazon: "Madera de pino tratada",
  estructura: "Acero con pintura electrostática",
  cubierta: "Melamina de 25 mm",
  suspension: "Cinchos elásticos",
  base: "Aluminio pulido de cinco puntas",
  patas: "Madera maciza de encino",
  ruedas: "Ruedas de 60 mm para piso duro",
  acabado: "Pintura electrostática negra",
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
  acabados: "al menos un acabado",
  entrega: "la disponibilidad",
  uso: "el tipo de uso",
  respaldo: "el respaldo",
  brazos: "los descansabrazos",
  base: "la base",
  plazas: "las plazas",
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
