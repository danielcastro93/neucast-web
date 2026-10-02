// Lo que comparten el molde (el modal de publicar, la barra de abajo en el
// teléfono) y la pantalla de inicio: leer el estado de publicación, pintar
// la lista de cambios con su miniatura y correr la publicación con sus pasos.
import { listar, publicar } from "./api.js";
import { medio } from "./medios.js";
import { escapar, fechaRelativa } from "./ui.js";

const QUE = { piezas: "Pieza", categorias: "Categoría", proyectos: "Proyecto", ajustes: "Ajustes", "home-office": "Home office" };
const base = import.meta.env.BASE_URL;

export async function estado() {
  const [p, piezas] = await Promise.all([listar("publicacion"), listar("piezas").catch(() => [])]);
  const porSlug = new Map(piezas.map((x) => [x.slug, x]));
  const pendientes = (p.pendientes || []).slice().reverse();
  return { ...p, pendientes, porSlug };
}

// Una fila de cambio: miniatura (si es pieza), qué es, nombre y cuándo.
export function filaCambio(c, porSlug) {
  const pieza = c.coleccion === "piezas" ? porSlug.get(c.id) : null;
  const foto = pieza?.img?.[0] ? `<img src="${escapar(medio(pieza.img[0]))}" alt="" loading="lazy" />` : "";
  const nombre = escapar(c.nombre || c.id);
  const enlace = pieza && !c.borrado ? `${base}piezas/editar/?slug=${encodeURIComponent(c.id)}` : null;
  const accion = c.borrado ? "Se borra" : "Cambió";
  const cuerpo = `
    <span class="miniatura">${foto || `<span class="miniatura-vacia">${escapar((QUE[c.coleccion] || "?")[0])}</span>`}</span>
    <span class="renglon-texto">
      <strong class="${c.borrado ? "tachado" : ""}">${nombre}</strong>
      <small>${escapar(QUE[c.coleccion] || c.coleccion)} · ${accion.toLowerCase()} ${escapar(fechaRelativa(c.fecha))}</small>
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
