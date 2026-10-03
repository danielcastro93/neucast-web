// La barra de pasos (components/PasosEditor.astro): sigue el scroll y pinta
// el avance de los obligatorios. La usan los editores de pieza y categoría.

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

// Marca cada paso (completo o con error) y la cuenta "N de M".
//   requeridos      los campos obligatorios ahora mismo
//   errores         { campo: mensaje } de la validación completa
//   mostrados       los errores que ya se enseñaron (al intentar guardar)
//   seccionDe       campo → id de sección
//   conObligatorios ids de sección que tienen algo obligatorio (las demás
//                   nunca llevan palomita)
export function pintarAvance({ requeridos, errores, mostrados = {}, seccionDe, conObligatorios }) {
  const conError = new Set(Object.keys(mostrados).map(seccionDe));
  const incompletas = new Set(Object.keys(errores).map(seccionDe));
  $$("[data-indice]").forEach((a) => {
    const id = a.dataset.indice;
    a.classList.toggle("con-error", conError.has(id));
    a.classList.toggle("completa", conObligatorios.has(id) && !conError.has(id) && !incompletas.has(id));
  });
  const faltan = requeridos.filter((k) => errores[k]);
  const hechos = requeridos.length - faltan.length;
  $("[data-avance-cuenta]").textContent = `${hechos} de ${requeridos.length}`;
  $("[data-avance-barra]").style.width = `${requeridos.length ? (hechos / requeridos.length) * 100 : 100}%`;
  $("[data-avance]").classList.toggle("avance--lista", !faltan.length);
  $("[data-avance-nota]").textContent = faltan.length
    ? `Falta${faltan.length === 1 ? " un dato" : `n ${faltan.length} datos`}. Mientras, se puede guardar como borrador.`
    : "Tiene todo lo obligatorio. Ya se puede publicar.";
}

// El paso activo sigue a la sección visible: la última cuyo inicio ya pasó
// del primer tercio de la pantalla (con secciones largas, la proporción
// visible no sirve). Las pastillas llevan al principio de su sección.
export function seguirPasos() {
  const secciones = () => $$(".seccion").filter((s) => !s.hidden);
  const indice = $(".pasos-lista");
  const seguir = () => {
    const lista = secciones();
    if (!lista.length) return;
    const corte = innerHeight * 0.34;
    let actual = lista[0];
    for (const sec of lista) if (sec.getBoundingClientRect().top <= corte) actual = sec;
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) actual = lista.at(-1);
    let nueva = null;
    $$("[data-indice]").forEach((a) => {
      const es = a.dataset.indice === actual.id;
      if (es && !a.classList.contains("activo")) nueva = a;
      a.classList.toggle("activo", es);
    });
    // En teléfono la activa enseña su nombre y crece: se centra cuando ya
    // tiene su ancho final, así la última nunca queda cortada.
    if (nueva) requestAnimationFrame(() => centrar(indice, nueva));
  };
  addEventListener("scroll", seguir, { passive: true });
  seguir();
  $$("[data-indice]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.indice)?.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  );
  return seguir;
}

function centrar(indice, a) {
  if (indice.scrollWidth <= indice.clientWidth) return;
  const caja = indice.getBoundingClientRect();
  const r = a.getBoundingClientRect();
  const centro = indice.scrollLeft + (r.left - caja.left) + r.width / 2 - caja.width / 2;
  indice.scrollTo({ left: Math.max(0, Math.min(centro, indice.scrollWidth - indice.clientWidth)), behavior: "smooth" });
}

// Esconde los pasos de las secciones que no aplican (y los renumera).
export function ocultarPasos(ids) {
  const ocultos = new Set(ids);
  let n = 0;
  $$("[data-paso]").forEach((li) => {
    const fuera = ocultos.has(li.dataset.paso);
    li.hidden = fuera;
    if (!fuera) li.querySelector(".paso-num").textContent = ++n;
  });
}
