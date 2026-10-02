// La única cara de la API para todo el administrador.
//
// Las pantallas importan de aquí y nunca hablan con fetch directamente. Hoy
// responde la simulación (JSON de public/api/ más localStorage); el día que
// Amauri tenga la API real, PUBLIC_API apunta a ella y cambia solo este archivo.
//
// Las funciones devuelven promesas y, si algo falla, lanzan un ErrorApi con
// `campos` cuando el problema es de validación (clave → mensaje), para que el
// formulario lo pinte junto al campo.
import * as simulada from "./api-simulada.js";
import * as real from "./api-real.js";

const BASE = import.meta.env.PUBLIC_API || "";
const motor = BASE ? real.crear(BASE) : simulada;

export class ErrorApi extends Error {
  constructor(mensaje, campos = {}, codigo = 400) {
    super(mensaje);
    this.campos = campos;
    this.codigo = codigo;
  }
}

// Colecciones: "piezas", "categorias", "proyectos", "listas", "home-office",
// "ajustes", "usuarios", "publicacion".
export const listar = (coleccion) => motor.listar(coleccion);
export const obtener = (coleccion, id) => motor.obtener(coleccion, id);
export const guardar = (coleccion, registro) => motor.guardar(coleccion, registro);
export const borrar = (coleccion, id) => motor.borrar(coleccion, id);
export const publicar = (destino) => motor.publicar(destino); // "pruebas" | "produccion"
export const entrar = (correo, clave) => motor.entrar(correo, clave);
export const esSimulada = !BASE;
