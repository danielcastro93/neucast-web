// La API simulada: responde como respondería la API real, sin servidor.
//
// Lee la semilla de public/api/*.json una sola vez y le pone encima lo que
// se haya guardado en localStorage (llave neucast-admin:{coleccion}). Así se
// puede capturar, borrar y publicar, y todo sobrevive a recargar la página.
// Para volver a la semilla: localStorage.clear() en la consola, o el botón
// "Restablecer la simulación" de la pantalla de inicio.
import { ErrorApi } from "./api.js";
import { validarPieza, validarCategoria, validarBloque, enlaceDeBloque } from "./validar.js";

const LLAVE = (c) => `neucast-admin:${c}`;
const cache = new Map();
const CON_ID = { piezas: "slug", categorias: "slug", proyectos: "slug", bloques: "id", usuarios: "id" };

// Un retraso corto para que las pantallas se vean como con la API real: con
// respuesta instantánea los estados de "guardando" nunca aparecen y después
// sorprenden.
const espera = (ms = 180) => new Promise((r) => setTimeout(r, ms));

async function semilla(coleccion) {
  const res = await fetch(`${import.meta.env.BASE_URL}api/${coleccion}.json`);
  if (!res.ok) throw new ErrorApi(`No existe la colección ${coleccion}`, {}, 404);
  return res.json();
}

async function cargar(coleccion) {
  if (cache.has(coleccion)) return cache.get(coleccion);
  let datos;
  try {
    const local = localStorage.getItem(LLAVE(coleccion));
    datos = local ? JSON.parse(local) : await semilla(coleccion);
    // Un registro único guardado antes de que la semilla creciera (por ejemplo
    // ajustes sin los textos de "Todos los muebles"): lo que falte sale de la
    // semilla, un nivel hacia adentro.
    if (local && datos && typeof datos === "object") datos = completar(await semilla(coleccion), datos, CON_ID[coleccion]);
  } catch {
    datos = await semilla(coleccion);
  }
  cache.set(coleccion, datos);
  return datos;
}

const esObjeto = (v) => v && typeof v === "object" && !Array.isArray(v);
function completar(base, local, llave) {
  // una lista de registros: cada uno toma de la semilla los campos que no
  // tenga (una categoría guardada antes de que existiera `mecanismo`)
  if (Array.isArray(local)) {
    if (!llave || !Array.isArray(base)) return local;
    return local.map((r) => {
      const b = base.find((x) => String(x[llave]) === String(r[llave]));
      return b ? { ...b, ...r } : r;
    });
  }
  const r = { ...base, ...local };
  for (const k of Object.keys(base)) if (esObjeto(base[k]) && esObjeto(local[k])) r[k] = { ...base[k], ...local[k] };
  return r;
}

function persistir(coleccion, datos) {
  cache.set(coleccion, datos);
  try {
    localStorage.setItem(LLAVE(coleccion), JSON.stringify(datos));
  } catch {
    /* sin localStorage (navegación privada): se queda en memoria */
  }
}

const copia = (x) => JSON.parse(JSON.stringify(x));

export async function listar(coleccion) {
  await espera();
  return copia(await cargar(coleccion));
}

export async function obtener(coleccion, id) {
  await espera();
  const datos = await cargar(coleccion);
  if (!Array.isArray(datos)) return copia(datos);
  const llave = CON_ID[coleccion];
  const registro = datos.find((r) => String(r[llave]) === String(id));
  if (!registro) throw new ErrorApi("No existe ese registro", {}, 404);
  return copia(registro);
}

export async function guardar(coleccion, registro) {
  await espera(320);
  const datos = await cargar(coleccion);

  // Un solo registro (ajustes, home-office, publicacion): se sustituye.
  if (!Array.isArray(datos)) {
    const nuevo = { ...datos, ...registro, actualizado: new Date().toISOString() };
    persistir(coleccion, nuevo);
    await anotarPendiente(coleccion, coleccion);
    return copia(nuevo);
  }

  const llave = CON_ID[coleccion];
  const nuevo = { ...registro, actualizado: new Date().toISOString() };

  if (coleccion === "piezas") {
    const errores = validarPieza(nuevo, await cargar("listas"), await cargar("categorias"));
    // Se puede guardar un borrador incompleto; lo que no se puede es
    // publicar algo con obligatorios vacíos.
    if (nuevo.estado !== "borrador" && Object.keys(errores).length) {
      throw new ErrorApi("Faltan datos para publicar la pieza", errores);
    }
    const repetido = datos.find((r) => r.slug === nuevo.slug && r._original !== nuevo._original);
    const original = nuevo._original;
    if (repetido && repetido.slug !== original) {
      throw new ErrorApi("Ya hay una pieza con esa dirección", { slug: "Ya existe otra pieza con esta dirección" });
    }
  }

  if (coleccion === "categorias") {
    const errores = validarCategoria(nuevo);
    if (nuevo.estado !== "borrador" && Object.keys(errores).length) {
      throw new ErrorApi("Faltan datos para publicar la categoría", errores);
    }
    const repetida = datos.find((r) => r.slug === nuevo.slug && r.slug !== nuevo._original);
    if (repetida) throw new ErrorApi("Ya hay una categoría con esa dirección", { slug: "Ya existe otra categoría con esta dirección" });
  }

  if (coleccion === "bloques") {
    const errores = validarBloque(nuevo);
    if (nuevo.activo && Object.keys(errores).length) throw new ErrorApi("Faltan datos para prender el bloque", errores);
    nuevo.enlace = enlaceDeBloque(nuevo.destino); // lo que lee el sitio
  }

  const original = nuevo._original ?? nuevo[llave];
  delete nuevo._original;
  const i = datos.findIndex((r) => String(r[llave]) === String(original));
  if (i >= 0) datos[i] = nuevo;
  else datos.push(nuevo);
  persistir(coleccion, datos);
  // Si una categoría cambia de dirección, sus piezas y las listas que la
  // nombran se van con ella (la API real hace lo mismo en una transacción).
  if (coleccion === "categorias" && i >= 0 && original !== nuevo.slug) await moverCategoria(original, nuevo.slug);
  await anotarPendiente(coleccion, nuevo[llave], nuevo.nombre || nuevo.name);
  return copia(nuevo);
}

// `a` vacío: la categoría se borró y solo se quita de las listas.
async function moverCategoria(de, a) {
  const piezas = await cargar("piezas");
  let n = 0;
  piezas.forEach((p) => { if (p.cat === de) { p.cat = a; n++; } });
  if (n) persistir("piezas", piezas);
  const listas = await cargar("listas");
  const cambiar = (arr) => (Array.isArray(arr) ? (a ? arr.map((c) => (c === de ? a : c)) : arr.filter((c) => c !== de)) : arr);
  for (const grupo of [listas.listas, listas.medidas, listas.partes]) {
    grupo.forEach((x) => {
      x.categorias = cambiar(x.categorias);
      if ("obligatoria" in x) x.obligatoria = cambiar(x.obligatoria);
    });
  }
  persistir("listas", listas);
}

export async function borrar(coleccion, id) {
  await espera(260);
  const datos = await cargar(coleccion);
  const llave = CON_ID[coleccion];
  const registro = datos.find((r) => String(r[llave]) === String(id));
  if (!registro) throw new ErrorApi("No existe ese registro", {}, 404);
  if (coleccion === "categorias") {
    const suyas = (await cargar("piezas")).filter((p) => p.cat === registro.slug);
    if (suyas.length) throw new ErrorApi(`La categoría tiene ${suyas.length} ${suyas.length === 1 ? "pieza" : "piezas"}: muévelas a otra antes de borrarla`, {}, 409);
  }
  persistir(coleccion, datos.filter((r) => r !== registro));
  if (coleccion === "categorias") await moverCategoria(registro.slug, null);
  await anotarPendiente(coleccion, id, registro.nombre || registro.name, true);
  return { ok: true };
}

// Publicación: en la simulación solo mueve fechas y limpia pendientes.
// Con la API real, "pruebas" compila a stg y "produccion" a neucast.com.mx.
export async function publicar(destino) {
  await espera(900);
  const estado = await cargar("publicacion");
  const sesion = JSON.parse(localStorage.getItem("neucast-admin:sesion") || "{}");
  const marca = { fecha: new Date().toISOString(), por: sesion.nombre || "Simulación" };
  if (destino === "produccion") {
    estado.produccion = marca;
    estado.pendientes = [];
  } else {
    estado.pruebas = marca;
  }
  persistir("publicacion", estado);
  return copia(estado);
}

async function anotarPendiente(coleccion, id, nombre, borrado = false) {
  const estado = await cargar("publicacion");
  estado.pendientes = (estado.pendientes || []).filter((p) => !(p.coleccion === coleccion && p.id === id));
  estado.pendientes.push({ coleccion, id, nombre, borrado, fecha: new Date().toISOString() });
  // Lo guardado sale solo a pruebas: la API real compila stg al guardar.
  estado.pruebas = { fecha: new Date().toISOString(), por: "automático" };
  persistir("publicacion", estado);
}

export async function entrar(correo, clave) {
  await espera(600);
  const usuarios = await cargar("usuarios");
  const u = usuarios.find((x) => x.correo.toLowerCase() === String(correo).trim().toLowerCase());
  if (!u || u.clave !== clave) {
    throw new ErrorApi("El correo o la contraseña no coinciden", {}, 401);
  }
  const { clave: _omitida, ...sesion } = u;
  return { ...sesion, token: "simulado" };
}

export function restablecer() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith("neucast-admin:") && k !== "neucast-admin:sesion")
    .forEach((k) => localStorage.removeItem(k));
  cache.clear();
}
