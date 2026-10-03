// Qué campos tiene una categoría (y "Todos los muebles", que usa los mismos
// textos) y qué regla sigue cada uno. Los nombres de los campos son los del
// sitio (src/data/site.js, `categories`), para que la API los entregue tal cual.
//
// Todo es obligatorio: cada categoría es una página que posiciona por sus
// propias palabras, así que no puede salir sin su título y su descripción.
export const OBLIGATORIOS_CATEGORIA = ["name", "slug", "photo", "alt", "h1", "intro", "title", "desc"];

// Medidas de texto. El título y la descripción, a la medida de lo que enseña
// Google (unos 60 y unos 155 caracteres).
export const MEDIDAS_CATEGORIA = {
  name: { min: 3, max: 40 },
  alt: { min: 20, max: 160 },
  h1: { min: 3, max: 60 },
  intro: { min: 40, max: 180 },
  title: { min: 30, max: 65 },
  desc: { min: 100, max: 160 },
};

export const ETIQUETAS_CATEGORIA = {
  name: "el nombre",
  slug: "la dirección",
  photo: "la foto",
  alt: "el texto alternativo de la foto",
  h1: "el título de la página",
  intro: "el texto de entrada",
  title: "el título para Google",
  desc: "la descripción para Google",
};

// "Todos los muebles" no tiene nombre ni dirección: es /muebles/.
export const OBLIGATORIOS_TODOS = OBLIGATORIOS_CATEGORIA.filter((c) => c !== "name" && c !== "slug");

export const categoriaVacia = () => ({
  slug: "",
  name: "",
  photo: "",
  alt: "",
  h1: "",
  intro: "",
  title: "",
  desc: "",
  catalogoPropio: "", // un PDF propio del cliente; vacío = el que genera el sitio
  mecanismo: false,   // sus piezas llevan mecanismo (sillas): la ficha lo pide
  estado: "borrador",
});
