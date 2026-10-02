# Administrador de Neucast

El frontend del administrador: un sitio Astro estático que vive en
`admin.neucast.com.mx` y habla con la API (`api/`). Las páginas son el
cascarón; el contenido lo pinta el navegador leyendo la API.

```bash
npm run dev:admin     # http://localhost:4322 (desde la raíz)
npm run build:admin   # compila a admin/dist/
npm run semilla       # regenera admin/public/api/*.json desde sitio/src/data/
```

Las fotos las sirve el sitio, así que en desarrollo conviene tener también
`npm run dev` corriendo en el 4321 (`PUBLIC_MEDIOS` cambia esa dirección).

## Cómo está armado

```
admin/
├── scripts/semilla.mjs        genera los JSON de semilla a partir de los datos del sitio
├── public/api/*.json          la semilla: lo que la API simulada responde
├── src/
│   ├── layouts/Admin.astro    barra lateral plegable, barra superior, estado de publicación, sesión
│   ├── pages/
│   │   ├── index.astro        entrar
│   │   ├── inicio.astro       estado del sitio y accesos rápidos
│   │   └── piezas/            lista y edición de piezas
│   ├── components/            Modal, IconoAdmin
│   ├── scripts/
│   │   ├── api.js             la única cara de la API para las pantallas
│   │   ├── api-simulada.js    hoy: JSON de semilla más localStorage
│   │   ├── api-real.js        después: fetch a la API de Amauri, mismas funciones
│   │   ├── sesion.js          la sesión (sessionStorage)
│   │   ├── validar.js         las reglas de los tres niveles y las medidas de texto
│   │   ├── esquemas/pieza.js  qué campos tiene una pieza y cuáles son obligatorios por categoría
│   │   ├── medios.js          de dónde se cargan las fotos
│   │   └── ui.js              avisos, modales, fechas
│   └── styles/admin.css       lo propio del administrador, encima de compartido/global.css
```

## La API simulada

Mientras Amauri construye la API, `api.js` responde con `api-simulada.js`:
carga `public/api/*.json` una vez y le pone encima lo que se guarda en
`localStorage` (llaves `neucast-admin:*`). Capturar, borrar y publicar
funcionan y sobreviven a recargar. Para volver a la semilla: el botón
"Restablecer la simulación" de Inicio.

Cuando exista la API real se define `PUBLIC_API` (en `.env`) con su dirección
y `api.js` usa `api-real.js`. Las pantallas no cambian. Las rutas propuestas
están en `api-real.js`; Amauri las confirma o las cambia ahí.

## La cuenta de prueba

La simulación trae dos cuentas en `public/api/usuarios.json` (una que
administra y otra que captura). No son cuentas reales: la API real trae las
suyas y las contraseñas nunca viajan en un JSON.

## Variables

| Variable | Qué es | Sin definir |
| --- | --- | --- |
| `PUBLIC_API` | La dirección de la API real | se usa la simulación |
| `PUBLIC_MEDIOS` | De dónde se cargan las fotos | `http://localhost:4321` |
| `PUBLIC_STG` | El sitio de pruebas, para "Ver en pruebas" | `http://localhost:4321` |

## Reglas que el administrador aplica solas

- Las listas cerradas (material, acabados, uso, respaldo, brazos, base,
  plazas, características, disponibilidad) son selectores, nunca texto libre.
- Tres niveles de campos: obligatorios para todas, obligatorios según la
  categoría (el formulario los enseña al elegirla) y opcionales.
- Un borrador se guarda incompleto; una pieza publicada tiene que traer todos
  los obligatorios. El formulario señala qué falta y en qué sección.
- Contadores de caracteres con los rangos de `docs/administrador.md`.
- Palabras prohibidas y guiones largos se revisan al guardar.
- Lo guardado sale solo a pruebas; el botón "Publicar" lo pasa a producción.
