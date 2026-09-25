# Mapa de conexión, pantalla por pantalla

Este documento responde a una sola pregunta: **para cada cosa que se ve en el
sitio, ¿de dónde sale y qué hay que conectar en WordPress?**

Léelo con [wordpress.md](wordpress.md), que explica la forma exacta de cada dato,
y con [administrable.md](administrable.md), que lo cuenta desde el punto de vista
del cliente.

## Cómo leer las tablas

- **Sale de**: el archivo y el campo de donde viene hoy.
- **En WordPress**: qué hay que crear para que lo administre el cliente.
- **Fijo**: está escrito en el código a propósito. Ver el apartado 12.

Los cuatro archivos de datos son `src/data/site.js`, `catalogo.js`, `fichas.js` y
`proyectos.js`. Cuando la tabla dice "site.js" se refiere a ese archivo.

---

## 1. Lo que sale en todas las páginas

El encabezado, el pie, la burbuja de WhatsApp y la tarjeta de marca aparecen en
las 48 páginas. Un error aquí se multiplica por 48.

| Qué se ve | Sale de | En WordPress |
| --- | --- | --- |
| Número de WhatsApp de la burbuja, del encabezado, del pie y de cada botón de cotizar | `site.js` → `site.whatsapp` | Un campo de opciones del tema. **Formato internacional sin signos ni espacios:** `5215512345678` |
| Correo de ventas | `site.js` → `site.email` | Campo de opciones |
| Facebook e Instagram | `site.js` → `site.social` | Campos de opciones |
| Dominio con `https://` y sin diagonal final | `site.js` → `site.domain` | Campo de opciones. **El dato más caro de equivocar:** de aquí salen las canónicas, el mapa del sitio y las direcciones absolutas |
| Las ocho categorías del menú y del pie | `site.js` → `categories` | La taxonomía de categorías |
| Tarjeta de marca de Google (`Organization`) | `site.js` → `organizacion` | Campos de opciones. Le falta el bloque `LocalBusiness` con domicilio y teléfono |
| Textos del menú, del pie y de los botones | Fijos | — |

**Los mensajes de WhatsApp.** Cada botón abre WhatsApp con un texto ya escrito,
distinto según desde dónde se pulse: desde una ficha dice el nombre de la pieza,
desde un proyecto dice el del proyecto. Lo arma `waLink(mensaje)` en `site.js`.
Si el cliente quiere cambiar esos textos hay que exponerlos; hoy viven junto a
cada botón.

---

## 2. Home

| Bloque | Qué se ve | Sale de | En WordPress |
| --- | --- | --- | --- |
| Hero | Título, bajada, foto de fondo, botones | Fijos | Fijo, salvo que se pida editable |
| Categorías | Las ocho tarjetas con foto y nombre | `site.js` → `categories` (`name`, `photo`, `alt`) | Taxonomía |
| Piezas destacadas | El carrusel de piezas | `site.js` → `destacados`, una lista de ocho `slug` | **Un selector de piezas ordenable.** Ver el apartado 4 |
| Proyecto destacado | Foto con puntos sobre las piezas | `proyectos.js` → el **primer** proyecto del arreglo | Marcar un proyecto como destacado, o respetar el orden |
| Editorial | Texto, video y enlace a Nosotros | Fijos y `public/video/` | Fijo |
| Cierre | Bloque final con foto y botones | Fijo | Fijo |

**Ojo con las piezas destacadas.** `destacados` guarda `slug`, no objetos. Si el
cliente borra o renombra una pieza, esa tarjeta **desaparece sin avisar** y el
carrusel se queda con siete. Es a propósito: es preferible a un enlace muerto.
En WordPress conviene que sea una relación de verdad, no texto libre.

---

## 3. Catálogo y categorías

### `/muebles/` y las ocho `/muebles/{categoria}/`

Cada categoría es **una página indexable propia**, con su `h1`, su título de
buscador, su descripción y su entrada. Ahí viven las palabras por las que
posiciona cada una: una sola página no puede posicionar por las ocho.

| Qué se ve | Sale de | En WordPress |
| --- | --- | --- |
| Nombre en el menú, el pie y el carrusel | `categories[].name` | Nombre del término |
| Dirección de la página | `categories[].slug` | Slug del término. **Cambiarlo rompe la dirección**; hay que redirigir |
| Foto de la tarjeta y del carrusel | `categories[].photo` | Imagen destacada del término |
| Texto alternativo de esa foto | `categories[].alt` | Campo de texto del término |
| Encabezado de la página | `categories[].h1` | Campo del término |
| Título que sale en Google | `categories[].title` | Campo del término, 30 a 65 caracteres |
| Descripción que sale en Google | `categories[].desc` | Campo del término, 70 a 160 caracteres |
| Frase bajo el encabezado | `categories[].intro` | Campo del término, 120 a 150 caracteres |
| Tarjeta "Todos los muebles" | `site.js` → `todosLosMuebles` | Campos de opciones |
| Bloques editoriales entre las piezas | `catalogo.js` → `bloquesPara()` | Ver el apartado 11 |
| Filtros disponibles y sus opciones | `catalogo.js` → `filtros`, `gruposColor`, `materiales` | **No se conecta.** Ver el apartado 12 |

---

## 4. Ficha de producto

La pantalla con más campos del sitio. Se lee de arriba abajo.

### 4.1 Galería

| Qué se ve | Sale de | En WordPress |
| --- | --- | --- |
| Todas las fotos de la pieza | `catalogo.js` → `pieza.img[]`, un arreglo | Galería de imágenes. La **primera es la principal** y sale recortada |
| Texto alternativo de la primera foto | `pieza.alt` | Campo de la pieza |
| Texto alternativo del resto | Se arma solo: `"{nombre} en uso"` | Conviene un alt por imagen |
| El video del final de la galería | `public/video/editorial-neucast.mp4`, el mismo para todas | Fijo hoy. Si se quiere uno por pieza, es un campo más |
| Los puntos bajo el carrusel en teléfono | Se cuentan solos | — |

**La regla de los puntos.** Con muchas fotos no se pintan muchos puntos: se
enseñan **cinco como máximo** y la ventana se corre. Una pieza con veinte fotos
no satura la pantalla. La misma regla que el carrusel de zonas de los proyectos.

**La regla de las fotos en las tarjetas.** En las tarjetas del catálogo se
enseñan **dos fotos como máximo en escritorio** (la principal y una de ambiente)
y **una en táctil**. Si la pieza trae quince, en la tarjeta salen dos. Las demás
se ven en la ficha.

### 4.2 Columna de compra

| Qué se ve | Sale de | En WordPress |
| --- | --- | --- |
| Tipo, encima del nombre | `pieza.tipo` | Campo. Es lo que es: "Silla operativa", "Mesa de juntas" |
| Nombre | `pieza.nombre` | Título. **Sin el tipo:** "Órbita", no "Silla Órbita" |
| Acabados disponibles | `pieza.colores[]` | Taxonomía de color, lista cerrada |
| Categoría | `pieza.cat` | Taxonomía |
| Disponibilidad | `pieza.entrega` | Lista cerrada: `inmediata`, `2-3-semanas`, `10dias`, `sobre-pedido` |
| Material | `pieza.material` | Lista cerrada de `materiales` |
| Base, respaldo, plazas, descansabrazos | `pieza.base`, `.respaldo`, `.plazas`, `.brazos` | Listas cerradas de `filtros` |
| Etiqueta "Nuevo" | `pieza.nuevo` | Casilla |
| Botones de cotizar | `site.whatsapp` y `/contacto/` | — |

**Los campos de filtro no son texto libre.** Cada uno solo acepta los valores
declarados en `catalogo.js`. Si WordPress manda uno que no está en la lista, la
pieza **deja de aparecer al filtrar por ese campo** y nadie se entera. Tienen que
ser listas desplegables o taxonomías, nunca un campo de texto.

### 4.3 Los cuatro paneles laterales

| Panel | Sale de |
| --- | --- |
| Detalles del producto | `fichas.js` → `resumen` y `destacados[]` |
| Dimensiones | `fichas.js` → `medidas{}` y el croquis, que se dibuja solo con las medidas |
| Materiales y cuidados | `fichas.js` → `construccion{}`, `mecanismo{}` y `cuidados[]` |
| Descargas | `public/fichas/` |

`etiquetasMedida` y `etiquetasConstruccion`, al final de `fichas.js`, traducen
cada clave a lo que se lee en pantalla. **Si WordPress agrega una clave nueva hay
que darla de alta ahí o no se muestra**, sin error y sin aviso.

### 4.4 El bloque bajo la galería

| Qué se ve | Sale de |
| --- | --- |
| Párrafo grande, primera frase en negro y el resto en gris | `fichas.js` → `resumen` |
| Foto de ambiente | La segunda foto de la pieza |
| Recuadro "Entrega e instalación" | `pieza.entrega` más un texto fijo |
| Recuadro "Materiales" | Las dos primeras entradas de `construccion{}` |
| Recuadro "Cuidados" | Los dos primeros de `cuidados[]` |

**Los tres recuadros son los mismos en todas las piezas** y se llenan solos. No
hay texto escrito a mano por pieza, y el recuadro cuyo dato falte no se pinta.

**La primera frase del `resumen` tiene que defender sola a la pieza**: es la que
va en negro y la que se usa como descripción en el buscador.

### 4.5 Abajo

"Piezas que combinan" se llena solo: primero las de la misma categoría y después
el resto, hasta llenar el carrusel. No se configura.

---

## 5. Proyectos

### `/proyectos/`

Título, entrada y cuadrícula. Los textos de la cabecera son fijos; las tarjetas
salen de `proyectos.js`.

### `/proyectos/{proyecto}/`

| Qué se ve | Sale de |
| --- | --- |
| Foto de portada y su alt | `portada.img`, `portada.alt` |
| Título | `nombre`, de 30 a 50 caracteres, dos renglones |
| Bajada | `resumen`, de 105 a 125 caracteres, tres renglones |
| Texto de "Leer más" | `intro[]`. El primero se ve, el resto se despliega |
| Tabla de datos | `sector`, `cliente`, `ciudad`, `anio`, `espacio`, `escala`, `superficie` y `ficha[]` |
| El relato | `bloques[]`. Ver abajo |
| Piezas instaladas | `piezas[]`, una lista de `slug` del catálogo |
| Otros proyectos | Se llena solo |

**Los seis tipos de bloque:**

| Tipo | Campos | Qué pinta |
| --- | --- | --- |
| `capitulo` | `titulo`, `texto[]` | Título a la izquierda, párrafos a la derecha |
| `imagen` | `img`, `alt`, `pie` | Foto de orilla a orilla con pie |
| `duo` | `medios[2]` de `{img, alt, pie}` | Dos fotos al 50 por ciento |
| `escenas` | `escenas[]` de `{img, alt, pie, hotspots[]}` | Carrusel de zonas con puntos sobre las piezas |
| `destacado` | `texto[2]` | Frase grande centrada, a dos tonos |
| `video` | `src`, `poster`, `alt` | Video de orilla a orilla |

**La secuencia que usan los cuatro proyectos**, y que conviene respetar para que
se lean parejos:

```
imagen · capítulo · dúo · destacado · capítulo · escenas ·
capítulo · imagen · dúo · destacado · capítulo · video
```

Nunca dos imágenes seguidas ni dos capítulos seguidos.

**Los puntos sobre la foto** (`hotspots`) llevan `x` e `y` en porcentaje para
escritorio y `mx`/`my` opcionales para teléfono, donde el recorte cambia. Cada
punto apunta a una `slug` del catálogo. **Un punto cuya pieza no exista no se
pinta**, para no mandar a una página que no está. Esto va a pasar seguido al
conectar WordPress: es a propósito y no hay que "arreglarlo".

En WordPress esto es un tipo de contenido `proyecto` con un **campo repetidor de
bloques**. Es lo más laborioso de modelar y lo que más rinde: es lo que evita que
todos los proyectos se vean iguales.

---

## 6. Contacto

El formulario manda un `POST` con JSON a la dirección que se ponga en `ENDPOINT`.

| Campo | Qué llega | Validación |
| --- | --- | --- |
| `asunto` | Una de cinco opciones fijas | Obligatorio |
| `nombre`, `apellido` | Texto | Solo letras, acentos, ñ, espacios y los signos de un apellido compuesto |
| `empresa` | Texto | Opcional |
| `correo` | Texto | Formato de correo |
| `telefono` | **Diez dígitos sin separadores**: `5512345678` | Obligatorio |
| `ciudad` | Texto | Solo letras |
| `estado` | Una de las **32 entidades**, de una lista cerrada | Obligatorio |
| `mensaje` | Texto | Obligatorio |
| `aviso` | `"on"` | Obligatorio |

**Hay que validar otra vez en el servidor.** Lo del navegador es comodidad para
quien escribe, no seguridad: cualquiera puede mandar un `POST` a mano.

El formulario trae un **campo trampa** llamado `sitio_web`, invisible para una
persona. Si llega con contenido, es un robot: hay que descartar ese envío en el
servidor sin responder nada.

**Hoy no manda nada.** `SIMULAR_ENVIO = true` en `src/pages/contacto.astro`: el
formulario valida, enseña la pantalla de gracias y se queda ahí. Hay que ponerlo
en `false` y apuntar `ENDPOINT` al destino real.

---

## 7. Nosotros, preguntas frecuentes y legales

Textos fijos, a propósito. Cambian una vez al año y pasarlos por un editor invita
a que alguien rompa el posicionamiento sin darse cuenta. Si más adelante se
quieren editables, el camino es el mismo que el resto.

Las **preguntas frecuentes** además alimentan el esquema `FAQPage` que Google
puede enseñar como desplegables en el resultado. Si se conectan, hay que mantener
el esquema sincronizado.

Las **páginas legales** están redactadas sobre un sitio sin formularios y sin
cookies. **En cuanto el formulario mande de verdad hay que reescribirlas y que
las revise un abogado.** Ver `pendientes.md`.

---

## 8. Imágenes

| Dónde | Hoy | Al conectar |
| --- | --- | --- |
| Producto | `public/img/products/` | Vienen de WordPress |
| Categorías | `public/img/cats/` | Vienen de WordPress |
| Proyectos | `public/img/` | Vienen de WordPress |
| Secciones fijas (hero, nosotros, contacto, 404) | `public/img/` | **Se quedan en el repositorio** |
| Video | `public/video/` | Se queda |
| Fichas en PDF | `public/fichas/` | Vienen de WordPress |

**Cada imagen necesita su texto alternativo.** No es un extra: es lo que lee
Google y lo que oye quien navega con lector de pantalla. La regla es describir lo
que se ve, no repetir el nombre de la pieza. Una imagen decorativa lleva el alt
vacío y `aria-hidden`, y eso es lo correcto.

**Las imágenes todavía no están optimizadas.** No hay `srcset` ni WebP y ninguna
declara su tamaño, así que el teléfono se baja la versión de escritorio y la
página salta mientras cargan. Conviene resolverlo cuando entren las fotos reales,
no antes, porque habría que rehacerlo. Ver `pendientes.md`.

---

## 9. Las medidas de los textos

La retícula está calibrada para textos de un largo concreto. Conviene poner el
contador de caracteres en los campos de WordPress.

| Campo | Caracteres | Para que quede en |
| --- | --- | --- |
| Nombre del proyecto | 30 a 50 | dos renglones |
| Resumen del proyecto | 105 a 125 | tres renglones |
| Título de capítulo | 24 a 32 | dos renglones |
| Párrafo de capítulo | 90 a 135 | dos renglones |
| Pie de foto | hasta 110 | uno o dos renglones |
| Entrada de categoría | 120 a 150 | dos renglones |
| Título de buscador | 30 a 65 | no se corta en Google |
| Descripción de buscador | 70 a 160 | no se corta en Google |

---

## 10. Lo que se genera solo

No hay que conectar nada de esto, pero conviene saber que existe:

- **`sitemap.xml`** sale de las mismas listas que generan las páginas. Si el
  catálogo crece, crece solo.
- **`robots.txt`** apunta al mapa del sitio.
- **Las canónicas** y la etiqueta `robots` de cada página viven en
  `src/layouts/Base.astro`.
- **Los datos estructurados** de cada pieza, categoría y proyecto.
- **Las migas de pan.**
- **"Piezas que combinan"** y **"Otros proyectos"**.

---

## 11. Los bloques editoriales del catálogo

Entre las piezas de la cuadrícula se intercalan bloques con foto y texto. Qué
bloque va en qué categoría lo decide `bloquesPara()` en `catalogo.js`, junto a
los datos y no en la página.

Hoy no se conectan. Si se quisieran administrar, serían un tipo de contenido
propio con categoría y posición.

---

## 12. Lo que no se conecta, y por qué

| Qué | Por qué |
| --- | --- |
| La estructura de las páginas | Es el diseño, no contenido |
| Los filtros y sus opciones | Una opción nueva sin su regla de filtrado deja piezas fuera sin avisar. Se agregan en código, con su etiqueta y su valor |
| Los textos de nosotros, contacto y legales | Cambian una vez al año y son los que sostienen el posicionamiento |
| Las preguntas frecuentes | Alimentan el esquema de Google |
| Los colores, la tipografía, las medidas | Viven en `src/styles/global.css`. Cambiar un valor ahí cambia el sitio entero |
| Los bloques editoriales del catálogo | Ver el apartado 11 |

---

## 13. Antes de dar por conectado

```bash
npm run build && npm run revisar
```

`revisar` recorre el sitio compilado y falla si encuentra un enlace muerto, un
título o una descripción fuera de medida, un título repetido entre dos páginas,
una imagen sin alt, un encabezado saltado, un guion largo en el texto visible,
una palabra que no va, una imagen de compartir que no es absoluta, datos
estructurados rotos o una página fuera del mapa del sitio.

**Conviene correrlo en cada publicación desde WordPress.** Es lo que avisa de que
alguien escribió un texto demasiado largo o dejó un enlace muerto.
