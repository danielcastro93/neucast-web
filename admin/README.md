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
│   │   ├── piezas/            lista y edición de piezas
│   │   ├── destacadas.astro   las piezas del carrusel de la portada y su orden
│   │   ├── categorias/        lista (con Todos los muebles) y edición de categorías
│   │   └── listas.astro       listas configurables, medidas y partes: crecen a cualquier tipo de mueble
│   ├── components/            Modal, IconoAdmin, PasosEditor
│   ├── scripts/
│   │   ├── api.js             la única cara de la API para las pantallas
│   │   ├── api-simulada.js    hoy: JSON de semilla más localStorage
│   │   ├── api-real.js        después: fetch a la API de Amauri, mismas funciones
│   │   ├── sesion.js          la sesión (localStorage: la comparten las pestañas)
│   │   ├── validar.js         las reglas de los tres niveles y las medidas de texto
│   │   ├── esquemas/pieza.js  los campos fijos de una pieza y sus medidas de texto
│   │   ├── listas.js          cómo se leen las listas: dónde aparecen y dónde son obligatorias
│   │   ├── medios.js          de dónde se cargan las fotos
│   │   ├── pasos.js           la barra de pasos de los editores (avance y seguir el scroll)
│   │   ├── ordenar.js         ordenar filas arrastrando su asa
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

## La base de sistema

El administrador se arma como una app de Apple y lleva encima la identidad
de Neucast (Helvetica Neue, la tinta y el oliva). Los tokens están al
principio de `src/styles/admin.css`:

| Token | Equivale en Apple a | Uso |
| --- | --- | --- |
| `--t-titulo-grande` (34) | Large Title | El título de cada pantalla |
| `--t-titulo-1` (28) | Title 1 | El estado principal de una tarjeta |
| `--t-titulo-2` (22) | Title 2 | Títulos de modal |
| `--t-titulo-3` (19) | Title 3 | Títulos de sección |
| `--t-encabezado` (16) | Headline | Nombres en listas |
| `--t-cuerpo` (15) | Body | Texto y campos |
| `--t-llamada` (14) | Callout | Botones, chips, menús |
| `--t-subtitulo` (13) | Subheadline | Segundas líneas |
| `--t-nota` (12) | Footnote | Notas y fechas |
| `--etiqueta` a `--etiqueta-4` | label a quaternaryLabel | La tinta en cuatro intensidades |
| `--relleno`, `--relleno-2` | fill | Fondo de campos, chips y botones grises |
| `--material*` + `--desenfoque` | materials | Barras y menús translúcidos |
| `--r-1` a `--r-5` | radios concéntricos | Lo de dentro siempre más chico que lo de fuera |

**Ritmo de espaciado (regla base).** Nada se ve amontonado: de lo más
pegado a lo más separado, siempre con estos tokens.

| Token | Valor | Entre |
| --- | --- | --- |
| `--esp-titulo-texto` | 8 | un título y su bajada |
| `--esp-etiqueta` | 12 | una etiqueta y su control; un control y su ayuda |
| `--esp-nota-bloque` | 14 | una nota y el bloque que explica |
| `--esp-chips` | 10 | chips, botones y opciones entre sí |
| `--esp-campos` | 34 | un campo (o grupo de chips) y el siguiente |
| `--esp-renglon` | 20 | arriba y abajo de cada renglón de tabla o lista |
| `--esp-pantalla-movil` | 32 | en teléfono, de la barra de arriba al título de cada pantalla |

**Desplegables propios.** Ningún desplegable se ve como el del sistema:
`scripts/desplegable.js` esconde cada `<select class="control">` y pone
encima un botón con su menú (el mismo estilo que el de las acciones de cada
renglón), con teclado, búsqueda por letra y palomita en la opción elegida.
Se aplica solo a los que aparezcan después; en el HTML se sigue escribiendo
un `<select>` normal. Una opción de relleno se marca `hidden` y una opción
que es una acción lleva un valor que empieza con `__` (sale separada y en
oliva, como "Nuevo material…").

Campos rellenos sin contorno, botones en píldora, separadores finísimos y
movimiento con resorte (`--resorte`) para todo lo que se presiona. Las
reglas de teléfono están en `src/styles/componentes.css`.

## Reglas que el administrador aplica solas

- Las listas cerradas (material, grupos de color, uso, respaldo, brazos,
  base, plazas, características, disponibilidad) son selectores, nunca texto
  libre. Se administran solo en **Listas**: ahí se agregan, se renombran (el
  `id` no cambia, así las piezas la siguen encontrando), se ordenan
  arrastrando y se quitan; una opción en uso no se puede quitar hasta cambiar
  las piezas que la usan. En la pieza, cada lista enlaza a la suya.
- Tres niveles de campos: obligatorios para todas, obligatorios según la
  categoría (el formulario los enseña al elegirla) y opcionales.
- Un borrador se guarda incompleto; una pieza publicada tiene que traer todos
  los obligatorios. El formulario señala qué falta y en qué sección.
- Contadores de caracteres con los rangos de `docs/administrador.md`.
- Palabras prohibidas y guiones largos se revisan al guardar.
- Lo guardado sale solo a pruebas; el botón "Publicar" lo pasa a producción.
