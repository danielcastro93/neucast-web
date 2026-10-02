// Piezas de interfaz que usan todas las pantallas: avisos, modales, fechas.
import { bloquear, soltar } from "@neucast/compartido/scripts/bloqueo-scroll.js";

const quieto = matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- Avisos (toast) ----------
   Entran abajo a la derecha, uno encima de otro, y se van solos. Un aviso
   de error se queda hasta que se cierra. */
export function avisar(texto, { tipo = "ok", duracion = 3600 } = {}) {
  let pila = document.querySelector(".avisos");
  if (!pila) {
    pila = document.createElement("div");
    pila.className = "avisos";
    pila.setAttribute("aria-live", "polite");
    document.body.appendChild(pila);
  }
  const el = document.createElement("div");
  el.className = `aviso aviso--${tipo}`;
  el.innerHTML = `<span class="aviso-punto"></span><span class="aviso-texto"></span><button type="button" class="aviso-x" aria-label="Cerrar">×</button>`;
  el.querySelector(".aviso-texto").textContent = texto;
  const quitar = () => {
    if (el.classList.contains("aviso--fuera")) return;
    el.classList.add("aviso--fuera");
    const fin = () => el.remove();
    if (quieto.matches) return fin();
    el.addEventListener("animationend", fin, { once: true });
    setTimeout(fin, 400);
  };
  el.querySelector(".aviso-x").addEventListener("click", quitar);
  pila.appendChild(el);
  if (tipo !== "error") setTimeout(quitar, duracion);
  return quitar;
}

/* ---------- Modales ----------
   Un modal es un <dialog class="modal"> con data-modal. Se abre con
   abrirModal(id) y cierra con cerrarModal(id), Escape, el velo o cualquier
   [data-cierra-modal] dentro. Entra con escala y difumina el fondo; la
   salida es el gesto inverso. */
export function abrirModal(id) {
  const d = document.getElementById(id);
  if (!d || d.open) return;
  d.classList.remove("modal--cerrando");
  d.showModal();
  bloquear();
  const primero = d.querySelector("[autofocus], input, select, textarea, button:not([data-cierra-modal])");
  primero?.focus({ preventScroll: true });
}

export function cerrarModal(id) {
  const d = document.getElementById(id);
  if (!d || !d.open) return;
  const fin = () => {
    if (!d.open) return;
    d.close();
    d.classList.remove("modal--cerrando");
    soltar();
  };
  if (quieto.matches) return fin();
  d.classList.add("modal--cerrando");
  d.addEventListener("animationend", fin, { once: true });
  setTimeout(fin, 320);
}

// Pregunta con dos salidas. Resuelve true si se confirma.
export function confirmar({ titulo, texto, accion = "Confirmar", peligro = false }) {
  const d = document.getElementById("modal-confirmar");
  if (!d) return Promise.resolve(window.confirm(texto));
  d.querySelector("[data-titulo]").textContent = titulo;
  d.querySelector("[data-texto]").textContent = texto;
  const btn = d.querySelector("[data-confirma]");
  btn.textContent = accion;
  btn.classList.toggle("boton--peligro", peligro);
  btn.classList.toggle("boton--primario", !peligro);
  return new Promise((resolver) => {
    const listo = (valor) => {
      btn.removeEventListener("click", si);
      d.removeEventListener("cancelar", no);
      cerrarModal(d.id);
      resolver(valor);
    };
    const si = () => listo(true);
    const no = () => listo(false);
    btn.addEventListener("click", si);
    d.addEventListener("cancelar", no, { once: true });
    abrirModal(d.id);
  });
}

// Cableado general: se llama una vez desde el molde.
export function cablearModales() {
  document.querySelectorAll("dialog.modal").forEach((d) => {
    // Escape: el navegador dispara "cancel"; se intercepta para animar la salida.
    d.addEventListener("cancel", (e) => {
      e.preventDefault();
      d.dispatchEvent(new CustomEvent("cancelar"));
      cerrarModal(d.id);
    });
    // Clic en el velo (fuera de la caja).
    d.addEventListener("click", (e) => {
      if (e.target === d) {
        d.dispatchEvent(new CustomEvent("cancelar"));
        cerrarModal(d.id);
      }
    });
    d.querySelectorAll("[data-cierra-modal]").forEach((b) =>
      b.addEventListener("click", () => {
        d.dispatchEvent(new CustomEvent("cancelar"));
        cerrarModal(d.id);
      })
    );
  });
  document.querySelectorAll("[data-abre-modal]").forEach((b) =>
    b.addEventListener("click", () => abrirModal(b.dataset.abreModal))
  );
}

/* ---------- Fechas ---------- */
const fmtFecha = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" });
const fmtHora = new Intl.DateTimeFormat("es-MX", { hour: "numeric", minute: "2-digit" });

export function fechaCorta(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return fmtFecha.format(d).replace(".", "");
}

export function fechaRelativa(iso) {
  if (!iso) return "nunca";
  const d = new Date(iso);
  const min = Math.round((Date.now() - d) / 60000);
  if (min < 1) return "ahora mismo";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  const dias = Math.round(h / 24);
  if (dias === 1) return `ayer a las ${fmtHora.format(d)}`;
  if (dias < 7) return `hace ${dias} días`;
  return fechaCorta(iso);
}

export const escapar = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/* ---------- El globo ----------
   Uno solo, flotante en <body>, para los elementos con data-globo. Los que
   llevan data-globo-solo="angosta" solo lo enseñan con la barra lateral
   angosta: con la barra ancha el nombre ya está escrito al lado del ícono y
   repetirlo estorba. */
let globo = null;
const elGlobo = () => {
  if (!globo) {
    globo = document.createElement("div");
    globo.className = "globo";
    globo.setAttribute("role", "presentation");
    document.body.appendChild(globo);
  }
  return globo;
};

// El mismo criterio que el CSS: escritorio es tener ratón, no tener ancho.
export const ESCRITORIO = "(min-width: 72em) and (hover: hover) and (pointer: fine)";
const barraAngosta = () =>
  document.documentElement.dataset.sb === "plegada" && matchMedia(ESCRITORIO).matches;

export function mostrarGlobo(el) {
  const texto = el.dataset.globo;
  if (!texto) return;
  if (el.dataset.globoSolo === "angosta" && !barraAngosta()) return;

  const g = elGlobo();
  g.textContent = texto;
  g.dataset.lado = el.dataset.globoLado || "derecha";
  g.classList.add("visible");
  const r = el.getBoundingClientRect();
  const gr = g.getBoundingClientRect();
  if (g.dataset.lado === "arriba") {
    g.style.left = Math.max(8, Math.min(innerWidth - gr.width - 8, r.left + r.width / 2 - gr.width / 2)) + "px";
    g.style.top = Math.max(8, r.top - gr.height - 10) + "px";
    return;
  }
  // Dentro de la barra el globo se separa del BORDE de la barra, no del
  // ícono: los enlaces no llegan a la orilla y quedaba pegado al canto.
  const barra = el.closest(".bl");
  let minimo = 0;
  if (barra) {
    minimo = barra.getBoundingClientRect().right + 16;
    // La bolita sobresale del canto: un globo a su altura se le montaba
    // encima. Solo en ese caso se corre lo necesario para pasarla.
    const bolita = barra.querySelector(".bl-colapsar");
    if (bolita && el !== bolita) {
      const c = bolita.getBoundingClientRect();
      const alto = r.top + r.height / 2 - gr.height / 2;
      if (alto < c.bottom + 8 && alto + gr.height > c.top - 8) minimo = c.right + 12;
    }
  }
  g.style.left = Math.min(innerWidth - gr.width - 8, Math.max(minimo, r.right + 12)) + "px";
  g.style.top = Math.max(8, r.top + r.height / 2 - gr.height / 2) + "px";
}

export function ocultarGlobo() {
  globo?.classList.remove("visible");
}

export function activarGlobos(scope = document) {
  scope.querySelectorAll("[data-globo]").forEach((el) => {
    if (el.dataset.globoListo) return;
    el.dataset.globoListo = "1";
    el.addEventListener("mouseenter", () => mostrarGlobo(el));
    el.addEventListener("focus", () => mostrarGlobo(el));
    el.addEventListener("mouseleave", ocultarGlobo);
    el.addEventListener("blur", ocultarGlobo);
    el.addEventListener("click", ocultarGlobo);
  });
}
addEventListener("scroll", ocultarGlobo, { passive: true, capture: true });

// El bote de basura para el HTML que se pinta desde scripts (el mismo de
// IconoAdmin): relleno, como el de Apple.
export const ICONO_BASURA = (t = 16) =>
  `<svg width="${t}" height="${t}" viewBox="0 0 20 20" aria-hidden="true"><path stroke="none" fill="currentColor" d="M8.6 2.5h2.8c.66 0 1.2.54 1.2 1.2v.8h3.15a.85.85 0 0 1 0 1.7H4.25a.85.85 0 0 1 0-1.7H7.4v-.8c0-.66.54-1.2 1.2-1.2Z"/><path stroke="none" fill="currentColor" fill-rule="evenodd" d="M5.3 7.4h9.4l-.66 8.36A1.9 1.9 0 0 1 12.15 17.5h-4.3a1.9 1.9 0 0 1-1.9-1.74L5.3 7.4Zm3.05 1.9a.65.65 0 0 0-.65.65v4.6a.65.65 0 0 0 1.3 0v-4.6a.65.65 0 0 0-.65-.65Zm3.3 0a.65.65 0 0 0-.65.65v4.6a.65.65 0 0 0 1.3 0v-4.6a.65.65 0 0 0-.65-.65Z"/></svg>`;
