// El desplegable del administrador: ningún <select> se ve como el del
// sistema. El nativo se queda escondido (para el formulario, las etiquetas y
// la validación) y encima va un botón con el estilo de los campos que abre un
// menú propio, el mismo de las acciones de cada renglón.
//
// Se aplica solo: el molde lo llama al cargar y vigila los <select class="control">
// que aparezcan después. Si el código cambia `select.value` o agrega opciones,
// el botón se entera.
const CHEVRON = '<svg class="selector-flecha" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PALOMITA = '<svg class="selector-palomita" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 10.5 4 4 8-9"/></svg>';
let abierto = null;
let contador = 0;

export function mejorarDesplegables(scope = document) {
  scope.querySelectorAll("select.control:not([data-mejorado])").forEach(mejorar);
}

export function vigilarDesplegables() {
  mejorarDesplegables();
  new MutationObserver((cambios) => {
    for (const c of cambios) {
      for (const n of c.addedNodes) {
        if (n.nodeType !== 1) continue;
        if (n.matches?.("select.control")) mejorar(n);
        else mejorarDesplegables(n);
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", (e) => {
    if (abierto && !abierto.envoltura.contains(e.target)) cerrar(abierto);
  });
  addEventListener("resize", () => abierto && cerrar(abierto));
}

function mejorar(select) {
  if (select.dataset.mejorado) return;
  select.dataset.mejorado = "1";
  const id = `selector-${++contador}`;

  const envoltura = document.createElement("div");
  envoltura.className = "selector";
  select.parentNode.insertBefore(envoltura, select);
  envoltura.appendChild(select);
  select.classList.add("selector-nativo");
  select.tabIndex = -1;
  select.setAttribute("aria-hidden", "true");

  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "control selector-boton";
  boton.setAttribute("aria-haspopup", "listbox");
  boton.setAttribute("aria-expanded", "false");
  boton.setAttribute("aria-controls", id);
  const etiqueta = select.id && document.querySelector(`label[for="${select.id}"]`);
  if (etiqueta) {
    etiqueta.id ||= `${id}-etiqueta`;
    boton.setAttribute("aria-labelledby", `${etiqueta.id} ${id}-valor`);
  } else if (select.getAttribute("aria-label")) {
    boton.setAttribute("aria-label", select.getAttribute("aria-label"));
  }
  boton.innerHTML = `<span class="selector-valor" id="${id}-valor"></span>${CHEVRON}`;
  envoltura.appendChild(boton);

  const menu = document.createElement("ul");
  menu.className = "selector-menu";
  menu.id = id;
  menu.setAttribute("role", "listbox");
  menu.tabIndex = -1;
  envoltura.appendChild(menu);

  const estado = { select, boton, menu, envoltura, activo: -1, busqueda: "", reloj: 0 };

  // Si el código cambia el valor, el botón se entera.
  const desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
  Object.defineProperty(select, "value", {
    configurable: true,
    get() { return desc.get.call(this); },
    set(v) { desc.set.call(this, v); pintarValor(estado); },
  });
  new MutationObserver(() => { pintarValor(estado); if (envoltura.classList.contains("abierto")) pintarOpciones(estado); })
    .observe(select, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled"] });
  select.addEventListener("change", () => pintarValor(estado));
  // la etiqueta enfoca al nativo: se pasa al botón
  select.addEventListener("focus", () => boton.focus());

  boton.addEventListener("click", () => (envoltura.classList.contains("abierto") ? cerrar(estado) : abrir(estado)));
  boton.addEventListener("keydown", (e) => teclas(e, estado));
  menu.addEventListener("keydown", (e) => teclas(e, estado));
  pintarValor(estado);
}

const opciones = (s) => [...s.select.options].filter((o) => !o.hidden);

function pintarValor(s) {
  const o = s.select.selectedOptions[0];
  const valor = s.boton.querySelector(".selector-valor");
  const vacio = !o || o.value === "";
  valor.textContent = o ? o.textContent : "";
  s.boton.classList.toggle("selector-boton--vacio", vacio);
  s.boton.disabled = s.select.disabled;
}

function pintarOpciones(s) {
  const lista = opciones(s);
  s.menu.innerHTML = lista
    .map((o, i) => {
      const especial = o.value.startsWith("__");
      const sel = o.selected && o.value !== "";
      return `<li role="option" id="${s.menu.id}-${i}" data-i="${i}" aria-selected="${sel}" class="selector-opcion${especial ? " selector-opcion--accion" : ""}"${o.disabled ? ' aria-disabled="true"' : ""}>${PALOMITA}<span></span></li>`;
    })
    .join("");
  [...s.menu.children].forEach((li, i) => (li.querySelector("span").textContent = lista[i].textContent));
  [...s.menu.children].forEach((li) => {
    li.addEventListener("click", () => elegir(s, +li.dataset.i));
    li.addEventListener("mousemove", () => marcar(s, +li.dataset.i, false));
  });
}

function abrir(s) {
  if (abierto && abierto !== s) cerrar(abierto);
  pintarOpciones(s);
  s.envoltura.classList.add("abierto");
  s.boton.setAttribute("aria-expanded", "true");
  // arriba si abajo no cabe
  const r = s.boton.getBoundingClientRect();
  const alto = Math.min(320, s.menu.scrollHeight + 12);
  s.envoltura.classList.toggle("arriba", innerHeight - r.bottom < alto + 16 && r.top > alto + 16);
  abierto = s;
  const i = opciones(s).findIndex((o) => o.selected);
  marcar(s, i >= 0 ? i : 0, true);
  s.menu.focus({ preventScroll: true });
}

function cerrar(s, devolverFoco = false) {
  s.envoltura.classList.remove("abierto");
  s.boton.setAttribute("aria-expanded", "false");
  s.menu.removeAttribute("aria-activedescendant");
  if (abierto === s) abierto = null;
  if (devolverFoco) s.boton.focus();
}

function marcar(s, i, desplazar) {
  const items = [...s.menu.children];
  if (!items.length) return;
  i = Math.max(0, Math.min(items.length - 1, i));
  s.activo = i;
  items.forEach((li, j) => li.classList.toggle("activa", j === i));
  s.menu.setAttribute("aria-activedescendant", items[i].id);
  if (desplazar) items[i].scrollIntoView({ block: "nearest" });
}

function elegir(s, i) {
  const o = opciones(s)[i];
  if (!o || o.disabled) return;
  const cambio = s.select.value !== o.value;
  s.select.value = o.value;
  cerrar(s, true);
  if (cambio) {
    s.select.dispatchEvent(new Event("input", { bubbles: true }));
    s.select.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function teclas(e, s) {
  const abiertoAhora = s.envoltura.classList.contains("abierto");
  const n = opciones(s).length;
  if (!abiertoAhora) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      abrir(s);
    }
    return;
  }
  if (e.key === "ArrowDown") { e.preventDefault(); marcar(s, s.activo + 1, true); }
  else if (e.key === "ArrowUp") { e.preventDefault(); marcar(s, s.activo - 1, true); }
  else if (e.key === "Home") { e.preventDefault(); marcar(s, 0, true); }
  else if (e.key === "End") { e.preventDefault(); marcar(s, n - 1, true); }
  else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); elegir(s, s.activo); }
  else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); cerrar(s, true); }
  else if (e.key === "Tab") { cerrar(s); }
  else if (e.key.length === 1) {
    // escribir la primera letra salta a esa opción
    clearTimeout(s.reloj);
    s.busqueda += e.key.toLowerCase();
    s.reloj = setTimeout(() => (s.busqueda = ""), 600);
    const quitar = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const i = opciones(s).findIndex((o) => quitar(o.textContent).startsWith(quitar(s.busqueda)));
    if (i >= 0) marcar(s, i, true);
  }
}

