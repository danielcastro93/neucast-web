// Ordenar filas arrastrando su asa, con ratón o con el dedo. La fila se
// levanta, sigue al cursor y las demás se acomodan con animación (FLIP).
// Se escucha en la ventana: mover la fila en el DOM le quitaría la captura
// del puntero. Al soltar llama a `alSoltar(desde, hasta)` con los índices.
//
// La fila necesita la clase que se le pase en `fila` (para encontrar a sus
// hermanas) y el estilo `.arrastrando` usa la variable --dy.
export function arrastrarFila(e, fila, { selector, alSoltar }) {
  if (e.button > 0) return;
  e.preventDefault();
  const caja = fila.parentElement;
  const filas = () => [...caja.querySelectorAll(`:scope > ${selector}`)];
  const desde = filas().indexOf(fila);
  const y0 = e.clientY;
  const base = fila.getBoundingClientRect().top;
  fila.classList.add("arrastrando");
  document.body.classList.add("ordenando");

  const deslizar = (cambio) => {
    const otras = filas().filter((f) => f !== fila);
    const antes = new Map(otras.map((f) => [f, f.getBoundingClientRect().top]));
    cambio();
    otras.forEach((f) => {
      const d = antes.get(f) - f.getBoundingClientRect().top;
      if (d) f.animate([{ transform: `translateY(${d}px)` }, { transform: "none" }], { duration: 220, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  };
  const mover = (ev) => {
    const despues = filas().filter((f) => f !== fila).find((f) => ev.clientY < f.getBoundingClientRect().top + f.offsetHeight / 2) || null;
    if (despues !== fila.nextElementSibling) deslizar(() => caja.insertBefore(fila, despues));
    // la fila va pegada al dedo, aunque ya haya cambiado de lugar
    const natural = fila.getBoundingClientRect().top - (parseFloat(fila.style.getPropertyValue("--dy")) || 0);
    fila.style.setProperty("--dy", `${base + ev.clientY - y0 - natural}px`);
  };
  const soltar = () => {
    removeEventListener("pointermove", mover);
    removeEventListener("pointerup", soltar);
    removeEventListener("pointercancel", soltar);
    document.body.classList.remove("ordenando");
    fila.style.removeProperty("--dy");
    fila.classList.remove("arrastrando");
    const hasta = filas().indexOf(fila);
    if (hasta !== desde) alSoltar(desde, hasta);
  };
  addEventListener("pointermove", mover);
  addEventListener("pointerup", soltar);
  addEventListener("pointercancel", soltar);
}
