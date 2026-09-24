// Bloqueo del scroll de la página mientras hay una capa abierta.
//
// `overflow:hidden` en el body no basta en iOS: la página de atrás se sigue
// moviendo y el dedo se pelea entre las dos, así que el scroll de la capa se
// siente trabado. Lo que sí funciona es fijar el body y devolverlo a su sitio
// al cerrar.
//
// Lleva cuenta de cuántas capas lo pidieron, para que cerrar una no suelte el
// scroll si todavía hay otra abierta (el visor se abre desde la ficha, y la
// ficha ya lo había bloqueado).
let abiertas = 0;
let posicion = 0;

export function bloquear() {
  abiertas += 1;
  if (abiertas > 1) return;
  posicion = window.scrollY;
  document.body.style.top = `-${posicion}px`;
  document.body.classList.add("no-scroll");
}

export function soltar() {
  abiertas = Math.max(0, abiertas - 1);
  if (abiertas > 0) return;
  document.body.classList.remove("no-scroll");
  document.body.style.top = "";
  // `auto` a propósito: devolver el scroll con animación se ve como un salto
  window.scrollTo({ top: posicion, behavior: "auto" });
}
