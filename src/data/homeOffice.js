// Home office: la primera colección por espacio.
//
// No es una categoría. Las piezas siguen viviendo en la suya (una silla
// operativa sigue en Sillas operativas) y aparecen aquí porque traen
// "home-office" en su campo `espacios` (src/data/catalogo.js). Así no se
// duplica nada y una pieza nueva entra sola con marcar la casilla.
//
// PARA EL ADMINISTRADOR: tres cosas se capturan aquí y no en las piezas.
// - Los sets: nombre, texto corto y las piezas que lo forman (por slug).
// - Las ideas: título, texto y foto. Son guías cortas, sin cifras: si una
//   idea necesita una medida, va solo si está confirmada.
// - Las fotos de la página.
//
// FOTOS: hoy son de Pexels, de posicionamiento, hasta que haya fotografía
// propia de home office. Ver docs/pendientes.md, "Origen de las imágenes".
import { piezas, buscarPieza } from "./catalogo.js";

export const ESPACIO = "home-office";

export const homeOffice = {
  ruta: "/home-office/",
  nombre: "Home office",
  hero: {
    img: "/img/home-office/hero.jpg",
    alt: "Home office con escritorio frente a la ventana, silla de oficina con respaldo de malla y plantas",
  },
  // la foto que la representa fuera de su página: home y menú
  portada: {
    img: "/img/home-office/set-completo.jpg",
    alt: "Home office con escritorio, cajonera con ruedas y silla de oficina tapizada junto a la ventana",
  },
  cierre: "/img/home-office/cierre.jpg",
};

export const sets = [
  {
    id: "esencial",
    nombre: "Set esencial",
    texto: "Lo justo para trabajar bien todos los días: un escritorio recto, una silla operativa para la jornada completa y un archivero rodante que cabe debajo.",
    piezas: ["escritorio-eje", "silla-orbita", "archivero-bitacora"],
  },
  {
    id: "direccion",
    nombre: "Set de dirección",
    texto: "Para quien dirige desde casa: un escritorio en L con superficie de trabajo y otra de apoyo, una silla ejecutiva y una credenza a la altura del escritorio.",
    piezas: ["escritorio-angulo", "silla-reforma", "credenza-bosques"],
  },
  {
    id: "compacto",
    nombre: "Set compacto",
    texto: "Para un rincón de la sala o de la recámara: un escritorio recto, una silla sin brazos que entra y sale sin chocar y un librero que ordena hacia arriba.",
    piezas: ["escritorio-eje", "silla-nodo", "librero-lineal"],
  },
].map((s) => ({ ...s, piezas: s.piezas.map(buscarPieza).filter(Boolean) }))
  .filter((s) => s.piezas.length > 1);

export const ideas = [
  {
    titulo: "Pon el escritorio junto a la ventana",
    texto: "De lado a la luz, no de frente ni de espaldas. Así la luz natural no te deslumbra ni se refleja en la pantalla, y en las videollamadas se te ve bien.",
    img: "/img/home-office/idea-luz.jpg",
    alt: "Escritorio de metal y madera junto a una ventana con lámpara de piso y planta",
  },
  {
    titulo: "Empieza por la silla",
    texto: "Es la pieza con la que pasas más horas. Busca que el respaldo acompañe la espalda, que la altura se ajuste a tu escritorio y que los descansabrazos queden al nivel de la mesa.",
    img: "/img/home-office/idea-silla.jpg",
    alt: "Silla de oficina con respaldo de malla y cabecera frente a un escritorio con monitor",
  },
  {
    titulo: "Guarda para despejar",
    texto: "Un archivero con ruedas, una credenza o un librero sacan los papeles de la superficie. Un escritorio despejado se siente como oficina; uno lleno, como pendiente.",
    img: "/img/home-office/idea-guardar.jpg",
    alt: "Estudio con muebles de guardado a todo lo largo de la pared y escritorio corrido bajo la ventana",
  },
  {
    titulo: "Que se integre a tu casa",
    texto: "Elige acabados que dialoguen con el resto del espacio: madera, tonos neutros, metal fino. Si trabajas en la recámara o en la sala, al cerrar la laptop tiene que verse como un mueble más.",
    img: "/img/home-office/idea-casa.jpg",
    alt: "Rincón de trabajo en una recámara con escritorio de madera, silla de madera curvada y lámparas colgantes",
  },
];

export const piezasHomeOffice = piezas.filter((p) => (p.espacios || []).includes(ESPACIO));
