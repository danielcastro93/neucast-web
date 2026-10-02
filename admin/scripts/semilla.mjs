// Genera los JSON de semilla del administrador a partir de los datos del
// sitio (sitio/src/data/*.js). Es lo que la API simulada lee mientras la API
// real no existe, y es también el ejemplo exacto de lo que esa API tiene que
// responder.
//
//   npm run semilla        (desde la raíz)
//
// No se editan a mano: si cambian los datos del prototipo, se vuelve a correr.
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SALIDA = path.join(RAIZ, "public/api");

const { site, categories, destacados, todosLosMuebles, descripcionMarca } =
  await import("../../sitio/src/data/site.js");
const { piezas, filtros, materiales, gruposColor } =
  await import("../../sitio/src/data/catalogo.js");
const { fichas, etiquetasMedida, etiquetasConstruccion } = await import("../../sitio/src/data/fichas.js");
const { proyectos } = await import("../../sitio/src/data/proyectos.js");
const { homeOffice, sets, ideas } = await import("../../sitio/src/data/homeOffice.js");

// Una fecha fija para la semilla, así la lista no cambia de orden cada vez
// que se regenera. El día que exista la API, la pone ella.
const AYER = "2026-10-01T10:00:00.000Z";

fs.mkdirSync(SALIDA, { recursive: true });
const escribir = (nombre, datos) => {
  fs.writeFileSync(path.join(SALIDA, `${nombre}.json`), JSON.stringify(datos, null, 2) + "\n");
  console.log(`  ${nombre}.json`);
};

console.log("Semilla del administrador:");

// Piezas: el catálogo y su ficha en un solo registro, que es como se captura.
escribir(
  "piezas",
  piezas.map((p) => ({
    ...p,
    // el nombre comercial de cada acabado todavía no existe en el sitio: se
    // captura en el administrador; mientras, cada grupo es un acabado sin nombre
    acabados: (p.colores || []).map((grupo) => ({ nombre: "", grupo })),
    combina: [],
    destacada: destacados.includes(p.slug),
    ambiente: "",
    video: null,
    ficha: fichas[p.slug] || null,
    estado: "publicada",
    actualizado: AYER,
  }))
);

escribir(
  "categorias",
  categories.map((c, i) => ({ ...c, orden: i + 1, estado: "publicada", actualizado: AYER }))
);

// Las listas, como datos con sus reglas. Es lo que antes estaba fijo en el
// código del administrador: qué lista aparece en qué categoría, en cuáles es
// obligatoria, qué medidas pide cada una y con qué unidad. Desde la pantalla
// Listas se cambia todo esto y se crean listas, medidas y partes nuevas.
const CATS = categories.map((c) => c.slug);
const SILLAS = ["sillas-ejecutivas", "sillas-operativas"];
const opcionesDe = (campo) => filtros.find((f) => f.campo === campo)?.opciones || [];
// null en `categorias` quiere decir todas; "todas" en `obligatoria` también.
const lista = (id, nombre, extra) => ({ id, nombre, seleccion: "una", categorias: null, obligatoria: [], filtro: true, opciones: opcionesDe(id), ...extra });
const listasDatos = [
  lista("material", "Material", { sistema: true, obligatoria: "todas", opciones: materiales, nota: "El material principal de cada pieza." }),
  lista("colores", "Grupos de color", { sistema: true, seleccion: "varias", color: true, obligatoria: "todas", opciones: gruposColor, nota: "Los grupos por los que se filtra. El nombre comercial de cada acabado se escribe en la pieza." }),
  lista("entrega", "Disponibilidad", { sistema: true, obligatoria: "todas", nota: "En cuánto se entrega. Sale en la ficha y en el recuadro de entrega." }),
  lista("uso", "Tipo de uso", { sistema: true, obligatoria: "todas", nota: "Para qué se usa la pieza." }),
  lista("respaldo", "Respaldo", { categorias: [...SILLAS, "cafeterias"], obligatoria: SILLAS }),
  lista("brazos", "Descansabrazos", { categorias: [...SILLAS, "cafeterias"], obligatoria: SILLAS }),
  lista("base", "Base", { categorias: CATS.filter((c) => c !== "almacenamiento"), obligatoria: [...SILLAS, "cafeterias", "salas-de-juntas", "escritorios"] }),
  lista("plazas", "Plazas", { categorias: ["cafeterias", "lounge-y-areas-comunes", "exteriores"], obligatoria: ["lounge-y-areas-comunes", "exteriores"] }),
  lista("extras", "Características", { seleccion: "varias", nota: "Varias por pieza: apilable, con ruedas…" }),
];

const GRUPOS = [
  { id: "generales", nombre: "Generales" },
  { id: "asiento", nombre: "Asiento y respaldo" },
  { id: "cubierta", nombre: "Cubierta" },
  { id: "capacidad", nombre: "Capacidad" },
  { id: "guardado", nombre: "Guardado" },
];
const ASIENTOS = [...SILLAS, "cafeterias", "lounge-y-areas-comunes", "exteriores"];
const CUBIERTAS = ["cafeterias", "lounge-y-areas-comunes", "exteriores", "salas-de-juntas", "escritorios"];
// unidad vacía = conteo (solo enteros); rango = se puede escribir "45-55"
const medida = (id, grupo, unidad, ejemplo, categorias = null, rango = false) => ({
  id, nombre: etiquetasMedida[id], grupo, unidad, ejemplo, categorias, rango,
});
const medidasDatos = [
  medida("alto", "generales", "cm", "118", null, true),
  medida("ancho", "generales", "cm", "68"),
  medida("fondo", "generales", "cm", "70"),
  medida("largo", "generales", "cm", "240"),
  medida("diametro", "generales", "cm", "120"),
  medida("peso", "generales", "kg", "19"),
  medida("altoAsiento", "asiento", "cm", "45-55", ASIENTOS, true),
  medida("anchoAsiento", "asiento", "cm", "50", ASIENTOS),
  medida("fondoAsiento", "asiento", "cm", "48", ASIENTOS),
  medida("altoRespaldo", "asiento", "cm", "72", ASIENTOS),
  medida("brazoInterno", "asiento", "cm", "48", ASIENTOS),
  medida("brazoExterno", "asiento", "cm", "68", ASIENTOS),
  medida("cabecera", "asiento", "cm", "26", SILLAS),
  medida("espesorCubierta", "cubierta", "mm", "25", CUBIERTAS),
  medida("alturaLibre", "cubierta", "cm", "68", ["escritorios", "salas-de-juntas"]),
  medida("plazas", "capacidad", "", "3", ["lounge-y-areas-comunes", "exteriores", "cafeterias"]),
  medida("personas", "capacidad", "", "6-8", ["salas-de-juntas", "cafeterias", "exteriores"], true),
  medida("puestos", "capacidad", "", "4", ["escritorios"]),
  medida("apilables", "capacidad", "", "6", [...SILLAS, "cafeterias", "exteriores"]),
  medida("carga", "capacidad", "kg", "130", [...SILLAS, "cafeterias", "lounge-y-areas-comunes", "exteriores"]),
  medida("puertas", "guardado", "", "2", ["almacenamiento"]),
  medida("gavetas", "guardado", "", "3", ["almacenamiento"]),
  medida("entrepanos", "guardado", "", "4", ["almacenamiento"]),
  medida("cargaEntrepano", "guardado", "kg", "30", ["almacenamiento"]),
  medida("cargaGaveta", "guardado", "kg", "25", ["almacenamiento"]),
].filter((m) => m.nombre);

const parte = (id, ejemplo, categorias) => ({ id, nombre: etiquetasConstruccion[id], ejemplo, categorias });
const partesDatos = [
  parte("tapiceria", "Malla sobre marco de nylon", [...SILLAS, "cafeterias", "lounge-y-areas-comunes"]),
  parte("asiento", "Espuma inyectada de alta densidad", ASIENTOS),
  parte("armazon", "Madera de pino tratada", ["lounge-y-areas-comunes"]),
  parte("estructura", "Acero con pintura electrostática", null),
  parte("cubierta", "Melamina de 25 mm", [...CUBIERTAS, "almacenamiento"]),
  parte("suspension", "Cinchos elásticos", ["lounge-y-areas-comunes"]),
  parte("base", "Aluminio pulido de cinco puntas", null),
  parte("patas", "Madera maciza de encino", ["lounge-y-areas-comunes"]),
  parte("ruedas", "Ruedas de 60 mm para piso duro", SILLAS),
  parte("acabado", "Pintura electrostática negra", ["cafeterias", "exteriores", "salas-de-juntas", "escritorios", "almacenamiento"]),
].filter((x) => x.nombre);

escribir("listas", {
  listas: listasDatos,
  medidas: medidasDatos,
  gruposMedida: GRUPOS,
  partes: partesDatos,
  espacios: [{ id: "home-office", nombre: "Home office" }],
});

escribir(
  "proyectos",
  proyectos.map((p, i) => ({
    ...p,
    orden: i + 1,
    destacado: i === 0,
    estado: "publicada",
    actualizado: AYER,
    // los sets guardan slugs, no objetos
    piezas: (p.piezas || []).map((x) => (typeof x === "string" ? x : x.slug)),
  }))
);

escribir("home-office", {
  ...homeOffice,
  sets: sets.map((s) => ({ ...s, piezas: s.piezas.map((x) => x.slug) })),
  ideas,
});

escribir("ajustes", {
  nombre: site.name,
  dominio: site.domain,
  whatsapp: site.whatsapp,
  correo: site.email,
  social: site.social,
  descripcionMarca,
  destacados,
  todosLosMuebles,
});

// La cuenta de prueba de la simulación. No es una cuenta real: la API real
// trae las suyas, con contraseñas que nunca viajan en un JSON.
escribir("usuarios", [
  {
    id: 1,
    nombre: "Daniel Castro",
    correo: "daniel@neucast.com.mx",
    clave: "neucast2026",
    rol: "administra",
  },
  {
    id: 2,
    nombre: "Gaby Castillo",
    correo: "gaby@neucast.com.mx",
    clave: "neucast2026",
    rol: "captura",
  },
]);

// El estado de publicación con el que arranca la simulación.
escribir("publicacion", {
  produccion: { fecha: AYER, por: "Daniel Castro" },
  pruebas: { fecha: AYER, por: "Daniel Castro" },
  pendientes: [],
});

console.log("Listo.");
