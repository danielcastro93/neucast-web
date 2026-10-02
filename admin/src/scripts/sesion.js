// La sesión del administrador vive en localStorage: la comparten todas las
// pestañas del navegador (abrir un enlace en otra no vuelve a pedir la
// contraseña) y se va al salir desde el menú de la cuenta.
const LLAVE = "neucast-admin:sesion";

export function sesionActual() {
  try {
    return JSON.parse(localStorage.getItem(LLAVE) || "null");
  } catch {
    return null;
  }
}

export function iniciarSesion(datos) {
  localStorage.setItem(LLAVE, JSON.stringify(datos));
}

export function cerrarSesion() {
  localStorage.removeItem(LLAVE);
}

// Las pantallas del administrador la llaman al arrancar: sin sesión, a entrar.
export function exigirSesion() {
  const s = sesionActual();
  if (s) return s;
  const destino = encodeURIComponent(location.pathname + location.search);
  location.replace(`${import.meta.env.BASE_URL}?a=${destino}`);
  return null;
}
