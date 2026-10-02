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
