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
    ficha: fichas[p.slug] || null,
    estado: "publicada",
    actualizado: AYER,
  }))
);

escribir(
  "categorias",
  categories.map((c, i) => ({ ...c, orden: i + 1, estado: "publicada", actualizado: AYER }))
);

// Las listas cerradas, en un solo archivo: son lo que llenan los selectores.
escribir("listas", {
  filtros,
  materiales,
  gruposColor,
  espacios: [{ id: "home-office", nombre: "Home office" }],
  // qué se lee en pantalla por cada clave de medida y de construcción
  etiquetasMedida,
  etiquetasConstruccion,
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
