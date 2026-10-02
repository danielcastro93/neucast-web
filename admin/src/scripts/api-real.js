// La API real, cuando exista. Mismas funciones que la simulación, contra un
// servidor. Las rutas de abajo son una propuesta: Amauri las confirma o las
// cambia aquí, y las pantallas no se enteran.
import { ErrorApi } from "./api.js";
import { sesionActual } from "./sesion.js";

export function crear(base) {
  const url = (ruta) => `${base.replace(/\/+$/, "")}${ruta}`;

  async function pedir(ruta, opciones = {}) {
    const sesion = sesionActual();
    const res = await fetch(url(ruta), {
      ...opciones,
      headers: {
        "Content-Type": "application/json",
        ...(sesion?.token ? { Authorization: `Bearer ${sesion.token}` } : {}),
        ...(opciones.headers || {}),
      },
    });
    const cuerpo = await res.json().catch(() => ({}));
    if (!res.ok) throw new ErrorApi(cuerpo.mensaje || "La API no respondió bien", cuerpo.campos || {}, res.status);
    return cuerpo;
  }

  return {
    listar: (c) => pedir(`/${c}`),
    obtener: (c, id) => pedir(`/${c}/${encodeURIComponent(id)}`),
    guardar: (c, r) => {
      const id = r._original ?? r.slug ?? r.id;
      const { _original, ...datos } = r;
      return id
        ? pedir(`/${c}/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(datos) })
        : pedir(`/${c}`, { method: "POST", body: JSON.stringify(datos) });
    },
    borrar: (c, id) => pedir(`/${c}/${encodeURIComponent(id)}`, { method: "DELETE" }),
    publicar: (destino) => pedir(`/publicar/${destino}`, { method: "POST" }),
    entrar: (correo, clave) =>
      pedir(`/entrar`, { method: "POST", body: JSON.stringify({ correo, clave }) }),
  };
}
