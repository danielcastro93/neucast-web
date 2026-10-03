// Lo que comparten el molde (el modal de publicar, la barra de abajo en el
// teléfono) y la pantalla de inicio: leer el estado de publicación, pintar
// la lista de cambios con su miniatura y correr la publicación con sus pasos.
import { listar, publicar } from "./api.js";
import { medio } from "./medios.js";
import { escapar, fechaRelativa } from "./ui.js";

const QUE = { piezas: "Pieza", categorias: "Categoría", proyectos: "Proyecto", ajustes: "Ajustes", "home-office": "Home office", listas: "Listas" };
// Los registros únicos (listas, ajustes) se anotan con el nombre de la
// colección: aquí llevan un nombre para leerse y su ícono en vez de una letra.
const UNICOS = {
  listas: { nombre: "Listas de opciones", ruta: "listas/", icono: '<path d="M7 6h9M7 10h9M7 14h9"/><circle cx="4" cy="6" r=".6"/><circle cx="4" cy="10" r=".6"/><circle cx="4" cy="14" r=".6"/>' },
  ajustes: { nombre: "Destacadas y ajustes", ruta: "destacadas/", icono: '<path d="m10 3 2.1 4.4 4.8.6-3.5 3.3.9 4.7L10 13.7 5.7 16l.9-4.7L3.1 8l4.8-.6L10 3Z"/>' },
  "home-office": { nombre: "Home office", ruta: null, icono: '<path d="M4 10.5 10 5l6 5.5"/><path d="M5.5 9.5V16h9V9.5"/>' },
};
const base = import.meta.env.BASE_URL;

export async function estado() {
  const [p, piezas, categorias] = await Promise.all([listar("publicacion"), listar("piezas").catch(() => []), listar("categorias").catch(() => [])]);
  const porSlug = new Map(piezas.map((x) => [x.slug, x]));
  // las categorías también se enseñan con su foto y abren su editor
  categorias.forEach((c) => porSlug.set(`categorias:${c.slug}`, c));
  const pendientes = (p.pendientes || []).slice().reverse();
  return { ...p, pendientes, porSlug };
}

// Una fila de cambio: miniatura (si es pieza), qué es, nombre y cuándo.
export function filaCambio(c, porSlug) {
  const pieza = c.coleccion === "piezas" ? porSlug.get(c.id) : null;
  const categoria = c.coleccion === "categorias" ? porSlug.get(`categorias:${c.id}`) : null;
  const unico = !pieza && !categoria && (c.id === c.coleccion || !c.id) ? UNICOS[c.coleccion] : null;
  const imagen = pieza?.img?.[0] || categoria?.photo;
  const foto = imagen
    ? `<img src="${escapar(medio(imagen))}" alt="" loading="lazy" />`
    : unico ? `<span class="miniatura-vacia"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${unico.icono}</svg></span>` : "";
  const nombre = escapar(unico?.nombre || c.nombre || c.id);
  const enlace = c.borrado ? null
    : pieza ? `${base}piezas/editar/?slug=${encodeURIComponent(c.id)}`
    : categoria ? `${base}categorias/editar/?slug=${encodeURIComponent(c.id)}`
    : unico?.ruta ? `${base}${unico.ruta}` : null;
  const accion = c.borrado ? "Se borra" : "Cambió";
  const cuerpo = `
    <span class="miniatura">${foto || `<span class="miniatura-vacia">${escapar((QUE[c.coleccion] || "?")[0])}</span>`}</span>
    <span class="renglon-texto">
      <strong class="${c.borrado ? "tachado" : ""}">${nombre}</strong>
      <small>${unico ? "" : `${escapar(QUE[c.coleccion] || c.coleccion)} · `}${unico ? accion : accion.toLowerCase()} ${escapar(fechaRelativa(c.fecha))}</small>
    </span>`;
  return enlace
    ? `<li><a class="renglon" href="${enlace}">${cuerpo}<svg class="renglon-flecha" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 5 5 5-5 5"/></svg></a></li>`
    : `<li><div class="renglon">${cuerpo}</div></li>`;
}

// Los pasos que corre el servidor al publicar. En la simulación se enseñan
// en secuencia mientras responde; con la API real los marcará ella.
export const PASOS = [
  "Compilando el sitio",
  "Generando fichas y catálogos en PDF",
  "Revisando enlaces, textos y mapa del sitio",
  "Subiendo a neucast.com.mx",
];

export async function correrPublicacion(alPaso) {
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pausa = (ms) => new Promise((r) => setTimeout(r, quieto ? 0 : ms));
  const trabajo = publicar("produccion");
  for (let i = 0; i < PASOS.length - 1; i++) {
    alPaso(i);
    await pausa(650);
  }
  alPaso(PASOS.length - 1);
  const resultado = await trabajo;
  await pausa(450);
  alPaso(PASOS.length);
  dispatchEvent(new CustomEvent("neucast:publicado"));
  return resultado;
}
