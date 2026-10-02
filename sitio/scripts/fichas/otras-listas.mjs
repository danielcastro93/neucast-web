// Las listas que se crean desde el administrador (capacidad, tipo de luz…)
// también salen en los PDF, después de las de siempre, con su nombre.
import { filtros } from "../../src/data/catalogo.js";

const CONOCIDOS = new Set(["uso", "respaldo", "plazas", "brazos", "base", "extras", "entrega"]);

export const otrasListas = (pieza) =>
  filtros
    .filter((g) => !CONOCIDOS.has(g.campo))
    .map((g) => [
      g.nombre,
      [pieza[g.campo]].flat().map((id) => g.opciones.find((o) => o.id === id)?.nombre).filter(Boolean).join(", "),
    ])
    .filter(([, v]) => v);
