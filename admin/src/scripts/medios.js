// Las fotos viven con el sitio (y después con la API), no con el administrador.
// Las rutas que guardan los datos son del sitio ("/img/products/x.png"); aquí
// se les pone delante el dominio donde están hoy.
const BASE = (import.meta.env.PUBLIC_MEDIOS || "http://localhost:4321").replace(/\/+$/, "");

export const medio = (ruta) => (ruta ? (/^https?:/.test(ruta) ? ruta : `${BASE}${ruta}`) : "");
