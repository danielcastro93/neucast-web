# Conexión con WordPress

Este documento es para quien va a conectar el sitio con WordPress. Dice qué es
administrable, dónde vive hoy cada dato, qué forma tiene que devolver la API y
qué cosas **no** hay que tocar.

Léelo junto con [administrable.md](administrable.md), que lista todo lo que el
cliente va a poder editar, y con [arquitectura.md](arquitectura.md), que explica
cómo está armado el front.

---

## 1. La idea en una frase

Hoy el contenido vive en cuatro archivos de JavaScript dentro de `src/data/`.
Cada uno exporta un arreglo de objetos planos. **Conectar WordPress es cambiar
de dónde sale ese arreglo, no cambiar las páginas.**

Si `piezas` sigue siendo un arreglo de objetos con los mismos campos, no importa
si viene de un archivo o de una API: las páginas se compilan igual.

```
ANTES                          DESPUÉS
src/data/catalogo.js           src/data/catalogo.js
  export const piezas = [...]    const res = await fetch(`${WP}/wp-json/wp/v2/pieza?per_page=100`)
                                 export const piezas = res.map(mapearPieza)
```

El sitio es **estático**: se compila con `npm run build` y se publica la carpeta
`dist/`. Las llamadas a WordPress ocurren **en la compilación**, no en el
navegador del visitante. Eso significa que:

- WordPress no necesita estar disponible para que el sitio funcione.
- Publicar un cambio en WordPress requiere volver a compilar. Conviene un
  *webhook* de WordPress que dispare la compilación en Hostinger.
- No hay que preocuparse por la velocidad de la API ni por protegerla del
  tráfico público.

---

## 2. Qué es administrable y qué no

| Administrable desde WordPress | Se queda en código |
| --- | --- |
| Piezas del catálogo | La estructura de las páginas |
| Fichas técnicas de cada pieza | Los filtros disponibles y sus opciones |
| Categorías (nombre, foto, texto) | El diseño, los colores, la tipografía |
| Proyectos completos | Los textos de páginas fijas (nosotros, contacto, legales) |
| Piezas destacadas del home | Las preguntas frecuentes |
| Datos de contacto y redes | Los bloques editoriales del catálogo |

Los textos de las páginas fijas **no** se conectan a propósito: cambian una vez
al año y pasarlos por un editor invita a que alguien rompa el posicionamiento
sin darse cuenta. Si más adelante se quieren editables, el camino es el mismo
que el resto.

---

## 3. Los cuatro archivos de datos

### 3.1 `src/data/site.js`: datos de la empresa

Lo usa el encabezado, el pie, los botones de WhatsApp y el esquema
`Organization` que va en las 48 páginas.

| Campo | Qué es | Hoy |
| --- | --- | --- |
| `site.domain` | Dominio con `https://`, sin diagonal final. De aquí salen las canónicas, el mapa del sitio y las direcciones absolutas. | real |
| `site.whatsapp` | Número en formato internacional sin signos: `52155...` | **simulado** |
| `site.email` | Correo de ventas | **simulado** |
| `site.social.facebook`, `site.social.instagram` | Perfiles | reales |
| `categories` | Las ocho categorías: `slug`, `name`, `photo`, `alt`, textos de posicionamiento | real |
| `destacados` | Las piezas que el home enseña en el riel, por `slug` | real |
| `todosLosMuebles` | Foto de la tarjeta "Todos los muebles" | real |
| `organizacion` | El JSON-LD de `Organization` | real, falta `LocalBusiness` |
| `waLink(mensaje)` | Arma el enlace de WhatsApp con el mensaje ya escrito | |

**Cuidado con `site.domain`.** Si queda mal, quedan mal las canónicas, el mapa
del sitio y el `robots.txt` de golpe. Es el dato más caro de equivocar.

### 3.2 `src/data/catalogo.js`: el catálogo

Es el archivo más grande y el que más importa conectar. Exporta:

- `piezas`: el arreglo de piezas.
- `filtros`, `gruposColor`, `materiales`: las opciones de filtrado.
- `buscarPieza(slug)`, `rutaPieza(pieza)`: ayudantes.
- `bloquesPara(categoria, cuantasPiezas)`: los bloques editoriales que se
  intercalan en la cuadrícula. Las listas de bloques son internas del archivo.

Forma de una pieza:

```js
{
  slug: "silla-orbita",          // único en todo el sitio, es la dirección
  nombre: "Órbita",              // sin el tipo: "Órbita", no "Silla Órbita"
  cat: "sillas-operativas",      // slug de una de las ocho categorías
  tipo: "Silla operativa",       // lo que es; se muestra encima del nombre
  img: ["/img/products/...png"], // 1 o más; la primera es la principal
  alt: "...",                    // descripción de la primera foto
  material: "malla",             // un id de `materiales`
  colores: ["negro", "gris"],    // ids de `gruposColor`
  entrega: "inmediata",          // inmediata | 2-3-semanas | sobre-pedido
  nuevo: true,                   // pinta la etiqueta "Nuevo"
  // campos de filtro, según la categoría:
  uso, respaldo, plazas, brazos, base, extras
}
```

**Los campos de filtro son los que hacen funcionar el panel de filtros.** No son
libres: cada uno solo acepta los valores declarados en `filtros`. Si WordPress
manda un valor que no está en la lista, la pieza deja de aparecer al filtrar por
ese campo. Conviene que en WordPress sean listas desplegables, no texto libre.

En WordPress esto es un **tipo de contenido `pieza`** con campos personalizados
(ACF o el que prefieras). La categoría es una taxonomía; los campos de filtro,
taxonomías o selectores.

### 3.3 `src/data/fichas.js`: las fichas técnicas

Una entrada por pieza, con la misma `slug`. Cada ficha tiene:

```js
{
  resumen: "...",              // el párrafo descriptivo de la pieza
  destacados: ["...", "..."],  // el primero alimenta la meta descripción
  medidas: { ancho, profundidad, altura, alturaAsiento, diametro, peso },
  construccion: { estructura, asiento, respaldo, acabado, base, ... },
  mecanismo: ["..."],          // solo sillas
  cuidados: ["..."]
}
```

**Todos los valores de medidas y construcción de hoy están inventados.** Son de
maqueta, escritos para poder ver la ficha completa y para dejar por escrito qué
campos hay que capturar. Ninguno se puede publicar.

`etiquetasMedida` y `etiquetasConstruccion` traducen las claves a lo que se lee
en pantalla. Si WordPress agrega una clave nueva, hay que agregarla ahí o no se
muestra.

**Dónde sale cada campo en la página.** Importa al escribirlos:

| Campo | Dónde se lee |
| --- | --- |
| `resumen` | El bloque grande bajo la galería. Su **primera frase** va en negro y el resto en gris, así que conviene que esa primera frase defina la pieza sola. También es la meta descripción. |
| `destacados` | Solo dentro del panel "Detalles del producto", y el primero arma la meta descripción del buscador. Ya no se pintan como lista numerada en la página. |
| `construccion` | Las dos primeras entradas arman el recuadro "Materiales" que va bajo la foto de ambiente. |
| `cuidados` | Los dos primeros arman el recuadro "Cuidados". |

Los tres recuadros bajo la foto (**Entrega e instalación**, **Materiales**,
**Cuidados**) son los mismos en todas las piezas y se llenan solos con lo de
arriba. No hay texto escrito a mano por pieza, y el recuadro cuyo dato falte
simplemente no se pinta.

### 3.4 `src/data/proyectos.js`: los proyectos

Cada proyecto tiene una cabecera de datos y una **secuencia de bloques**, que es
lo que hace que la página se lea como un relato y no como una plantilla.

```js
{
  slug, nombre, sector, cliente, ciudad, anio, espacio, escala, superficie,
  portada: { img, alt },
  resumen: "...",        // la bajada bajo el título
  intro: ["...", "...", "..."],  // el primero se ve; el resto tras "Leer más"
  ficha: [{ etiqueta, valor }],  // datos extra de la tabla
  piezas: ["slug", ...],         // las del catálogo que se instalaron
  bloques: [ ... ]
}
```

Tipos de bloque:

| Tipo | Campos | Qué pinta |
| --- | --- | --- |
| `capitulo` | `titulo`, `texto: []` | Título a la izquierda, párrafos a la derecha |
| `imagen` | `img`, `alt`, `pie` | Foto de orilla a orilla, con pie |
| `duo` | `medios: [{img, alt, pie}, {…}]` | Dos fotos al 50 por ciento |
| `escenas` | `escenas: [{img, alt, pie, hotspots: [{x, y, mx, my, slug}]}]` | Carrusel de zonas con puntos sobre las piezas |
| `destacado` | `texto: ["línea 1", "línea 2"]` | Frase grande centrada, a dos tonos |
| `video` | `src`, `poster`, `alt` | Video de orilla a orilla, se reproduce en su sitio |

**La secuencia que usan los cuatro** y que conviene respetar:

```
imagen · capítulo · dúo · destacado · capítulo · escenas ·
capítulo · imagen · dúo · destacado · capítulo · video
```

Nunca dos imágenes seguidas ni dos capítulos seguidos.

**Los hotspots** llevan `x` e `y` en porcentaje sobre la foto (escritorio) y
`mx`/`my` opcionales para teléfono, donde el recorte cambia. Un punto cuya
`slug` no exista en el catálogo **no se pinta**, para no mandar a una página que
no existe. Esto va a pasar seguido al conectar WordPress, así que es a propósito
y no hay que "arreglarlo".

En WordPress esto es un **tipo de contenido `proyecto`** con un campo repetidor
de bloques. Es lo más laborioso de modelar y lo que más rinde: es lo que evita
que todos los proyectos se vean iguales.

---

## 4. Las medidas de los textos

La retícula está calibrada para textos de un largo concreto. Si los textos que
entren por WordPress se salen de estos rangos, las páginas dejan de verse
parejas entre sí. Conviene poner el contador de caracteres en los campos.

| Campo | Caracteres | Para que quede en |
| --- | --- | --- |
| Nombre del proyecto | 30 a 50 | dos renglones |
| Resumen del proyecto | 105 a 125 | tres renglones |
| Título de capítulo | 24 a 32 | dos renglones |
| Párrafo de capítulo | 90 a 135 | dos renglones |
| Pie de foto | hasta 110 | uno o dos renglones |
| Texto de categoría | 120 a 150 | dos renglones |
| Título de página (SEO) | 30 a 65 | no se corta en Google |
| Meta descripción | 70 a 160 | no se corta en Google |

---

## 5. Lo que hay que respetar al escribir

Estas reglas no son de estilo, son del negocio. Si se rompen, el sitio trabaja
en contra de Neucast.

1. **El mobiliario se presenta como de Neucast.** Nunca se menciona proveedor,
   fabricante, distribución ni comercializadora, y tampoco se dice que Neucast
   fabrique. El origen de la pieza simplemente no se toca.
2. **Nunca se inventan cifras.** Ni de clientes, ni de años, ni de metros. Si no
   hay dato confirmado, no va.
3. **Sin guiones largos** en el texto visible. Se revisa con una búsqueda sobre
   `dist/` antes de publicar.
4. **Los botones dicen la acción concreta**, no "ver más".
5. **Todo lo que se superpone difumina el fondo**, no solo lo oscurece.

---

## 6. Lo que hay que conectar antes de publicar

Por orden de urgencia:

1. **El formulario de contacto.** Hoy `SIMULAR_ENVIO = true` en
   `src/pages/contacto.astro`: el formulario valida, enseña la pantalla de
   gracias y **no manda nada**. Hay que poner `false` y apuntar `ENDPOINT` al
   destino real. Sin esto el sitio pierde solicitudes en silencio, que es el
   peor error posible aquí.

   El `POST` llega como JSON con estos campos:

   ```json
   {
     "asunto": "Cotizar una o varias piezas",
     "nombre": "Daniel", "apellido": "Castro",
     "empresa": "",
     "correo": "daniel@ejemplo.com",
     "telefono": "5512345678",
     "ciudad": "Monterrey", "estado": "Nuevo León",
     "mensaje": "...",
     "aviso": "on"
   }
   ```

   `telefono` viaja siempre con **diez dígitos y sin separadores**: los espacios
   que se ven al escribir son solo para leerlo. `estado` es una de las 32
   entidades, elegida de una lista cerrada que vive en el frontmatter de
   `contacto.astro`, así que se puede agrupar por estado sin limpiar nada.
   `nombre`, `apellido` y `ciudad` aceptan letras, acentos, ñ, espacios y los
   signos de un apellido compuesto, nunca dígitos.

   **Valida otra vez en el servidor.** Lo de aquí es comodidad para quien
   escribe, no seguridad: cualquiera puede mandar un `POST` a mano.
2. **El número de WhatsApp.** `site.whatsapp` es un número de ejemplo y lo usan
   269 enlaces del sitio.
3. **El correo de ventas.** `site.email`, también de ejemplo.
4. **El contenido real**: catálogo, fichas y proyectos.
5. **Las fotos reales**: las de producto (hoy ocho demostraciones repartidas
   entre 26 piezas) y las de proyecto (diez por proyecto, más el video).
6. **Los datos fiscales y de domicilio** para el esquema `LocalBusiness` y para
   las páginas legales, que además tiene que revisar un abogado una vez que
   exista el formulario.

La lista completa y al día está en [pendientes.md](pendientes.md).

---

## 7. Cosas que conviene no tocar

- **`src/styles/global.css`**: las variables de diseño. Cambiar un valor aquí
  cambia el sitio entero, que es justo para lo que sirve, pero hay que saberlo.
- **La generación de `sitemap.xml` y `robots.txt`**: salen de las mismas listas
  que generan las páginas. Si se conecta WordPress bien, se actualizan solos.
- **Las canónicas y el `robots` de cada página**: viven en `src/layouts/Base.astro`
  y ya están resueltos. Las páginas que no se indexan lo declaran con la
  propiedad `noindex`.
- **Los componentes compartidos** (`VisorGaleria`, `PanelLateral`,
  `CursorAmpliar`, `CierreCta`, `EscenasCarrusel`): los usan varias páginas, así
  que un cambio ahí se nota en más sitios de los que parece.
