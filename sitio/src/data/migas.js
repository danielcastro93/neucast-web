// Migas de pan para los datos estructurados (BreadcrumbList).
//
// No se pintan en la página: le dicen a Google en qué parte del sitio vive
// cada una, para que el resultado de búsqueda muestre la ruta (Neucast ›
// Muebles › Sillas ejecutivas) en lugar de la dirección completa.
//
//   migas([["Muebles", "/muebles/"], ["Sillas ejecutivas", "/muebles/sillas-ejecutivas/"]])
//
// El inicio se agrega solo. La ruta es relativa; el dominio sale de site.js.
import { site } from "./site.js";

export function migas(pasos) {
  const todos = [["Inicio", "/"], ...pasos];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: todos.map(([nombre, ruta], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: nombre,
      item: new URL(ruta, site.domain).href,
    })),
  };
}
