// Todo buscador del administrador (<input type="search" class="control">)
// lleva su cruz para borrar lo escrito de un toque, como en iOS. La del
// navegador se esconde (cada uno la pinta distinto y Chrome en iPhone no la
// tiene). Se aplica solo: el molde lo llama al cargar y vigila los que
// aparezcan después.
const CRUZ = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="m2 2 6 6M8 2 2 8"/></svg>';

export function vigilarBuscadores() {
  mejorar(document);
  new MutationObserver((cambios) => {
    for (const c of cambios) for (const n of c.addedNodes) if (n.nodeType === 1) mejorar(n);
  }).observe(document.body, { childList: true, subtree: true });
}

function mejorar(scope) {
  const lista = scope.matches?.("input[type=search].control") ? [scope] : [...scope.querySelectorAll("input[type=search].control:not([data-con-cruz])")];
  lista.forEach((input) => {
    if (input.dataset.conCruz) return;
    input.dataset.conCruz = "1";
    const caja = document.createElement("span");
    caja.className = "buscador";
    input.parentNode.insertBefore(caja, input);
    caja.appendChild(input);
    const cruz = document.createElement("button");
    cruz.type = "button";
    cruz.className = "buscador-borrar";
    cruz.setAttribute("aria-label", "Borrar la búsqueda");
    cruz.tabIndex = -1;
    cruz.innerHTML = CRUZ;
    caja.appendChild(cruz);
    const pintar = () => caja.classList.toggle("con-texto", input.value.length > 0);
    input.addEventListener("input", pintar);
    // si el código cambia el valor (Quitar los filtros), la cruz se entera
    const desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    Object.defineProperty(input, "value", {
      configurable: true,
      get() { return desc.get.call(this); },
      set(v) { desc.set.call(this, v); pintar(); },
    });
    // la cruz no le quita el foco al campo: así el teclado no se cierra
    cruz.addEventListener("pointerdown", (e) => e.preventDefault());
    cruz.addEventListener("click", () => {
      input.value = "";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    });
    pintar();
  });
}
