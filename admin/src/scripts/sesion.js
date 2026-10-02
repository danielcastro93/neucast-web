// La sesión del administrador vive en sessionStorage: se va al cerrar la
// pestaña, que es lo que se espera de una herramienta de trabajo.
const LLAVE = "neucast-admin:sesion";

export function sesionActual() {
  try {
    return JSON.parse(sessionStorage.getItem(LLAVE) || "null");
  } catch {
    return null;
  }
}

export function iniciarSesion(datos) {
  sessionStorage.setItem(LLAVE, JSON.stringify(datos));
}

export function cerrarSesion() {
  sessionStorage.removeItem(LLAVE);
}

// Las pantallas del administrador la llaman al arrancar: sin sesión, a entrar.
export function exigirSesion() {
  const s = sesionActual();
  if (s) return s;
  const destino = encodeURIComponent(location.pathname + location.search);
  location.replace(`${import.meta.env.BASE_URL}?a=${destino}`);
  return null;
}
