// "Mi proyecto": la lista de piezas que una persona va juntando mientras
// navega, para mandarla completa a cotizar. Quien amuebla una oficina no
// compra una silla, compra un espacio; esto convierte la navegación en una
// solicitud con cantidades.
//
// Vive en el navegador (localStorage): no hay cuentas ni servidor, y la lista
// sobrevive si se cierra la página. Al agregar una pieza se guarda una copia
// fija de lo que hace falta para pintarla (nombre, tipo, dirección y foto), así
// el panel no necesita cargar el catálogo entero, que con 500 piezas pesaría en
// cada página.
//
// PARA EL ADMINISTRADOR: el formulario de contacto manda esta lista en el
// campo `proyecto`. Ver docs/mapa-de-conexion.md.

const LLAVE = "neucast:proyecto";
const MAXIMO = 999;
export const EVENTO = "proyecto:cambio";

export function leer() {
  try {
    const v = JSON.parse(localStorage.getItem(LLAVE) || "[]");
    return Array.isArray(v) ? v.filter((i) => i && i.slug) : [];
  } catch {
    return [];
  }
}

function guardar(lista) {
  try {
    localStorage.setItem(LLAVE, JSON.stringify(lista));
  } catch {
    // almacenamiento bloqueado: la lista vive solo mientras dure la página
  }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: lista }));
}

export const tiene = (slug) => leer().some((i) => i.slug === slug);

export function agregar(pieza) {
  const lista = leer();
  if (!lista.some((i) => i.slug === pieza.slug)) lista.push({ ...pieza, cantidad: 1 });
  guardar(lista);
}

export function quitar(slug) {
  guardar(leer().filter((i) => i.slug !== slug));
}

export function cantidad(slug, n) {
  const lista = leer();
  const i = lista.find((x) => x.slug === slug);
  if (!i) return;
  const v = Math.round(Number(n));
  i.cantidad = Number.isFinite(v) ? Math.min(MAXIMO, Math.max(1, v)) : 1;
  guardar(lista);
}

export function vaciar() {
  guardar([]);
}

// El mensaje de WhatsApp lleva cantidades y, si la lista es corta, la
// dirección de cada pieza. Con listas largas las direcciones se omiten: el
// enlace de WhatsApp tiene un largo máximo y se cortaría a media lista.
export function mensaje(lista, dominio) {
  const conEnlace = lista.length <= 10;
  const renglones = lista.map((i) => {
    const r = `• ${i.cantidad} × ${i.tipo} ${i.nombre}`;
    return conEnlace ? `${r}\n  ${dominio}${i.ruta}` : r;
  });
  const total = lista.reduce((s, i) => s + (i.cantidad || 1), 0);
  return (
    "Hola, quiero cotizar este proyecto:\n\n" +
    renglones.join("\n") +
    `\n\n${lista.length} ${lista.length === 1 ? "modelo" : "modelos"}, ${total} ${total === 1 ? "pieza" : "piezas"} en total.`
  );
}

// otra pestaña cambió la lista: se avisa aquí también
addEventListener("storage", (e) => {
  if (e.key === LLAVE) window.dispatchEvent(new CustomEvent(EVENTO, { detail: leer() }));
});
