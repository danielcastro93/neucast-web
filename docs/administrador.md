# Conexión con el administrador

Este documento es para quien va a construir el administrador de Neucast y
conectarlo con el sitio. Dice qué es administrable, dónde vive hoy cada dato,
qué forma tiene que devolver la API y qué cosas **no** hay que tocar.

Léelo junto con [administrable.md](administrable.md), que lista todo lo que el
cliente va a poder editar, con [mapa-de-conexion.md](mapa-de-conexion.md), que
lo recorre pantalla por pantalla, y con [arquitectura.md](arquitectura.md), que
explica cómo está armado el front.

---

## 0. Cómo es el administrador

Ya no se usa WordPress. El administrador se construye desde cero, propio, para
poder crecer sin depender de plugins ni de la forma de datos de un gestor ajeno.
Tiene dos partes:

| Parte | Qué es | Estado |
| --- | --- | --- |
| **Frontend del administrador** | Un sitio aparte hecho en Astro, estático, en un subdominio tipo `admin.neucast.com.mx`. Vive en `admin/` de este mismo repositorio y reutiliza los tokens y componentes del sistema de diseño que están en `compartido/` (`global.css`, `Icon`, `Logo`, `PanelLateral`; lo demás sale ahí cuando el administrador lo pida) y habla con la API | Decidido, por construir |
| **Backend y API** | Guarda los datos, recibe el formulario de contacto y dispara la publicación. Lo hace Amauri en `api/` de este repositorio | **Lenguaje por definir** (Node o PHP, con MySQL). Corre en el VPS, así que cualquiera de los dos sirve |

El hospedaje es un VPS de Hostinger. Cómo se publica está en
[despliegue.md](despliegue.md).

---

## 1. La idea en una frase

Hoy el contenido vive en archivos de JavaScript dentro de `sitio/src/data/`. Cada uno
exporta arreglos de objetos planos. **Conectar el administrador es cambiar de
dónde sale ese arreglo, no cambiar las páginas.**

Si `piezas` sigue siendo un arreglo de objetos con los mismos campos, no importa
si viene de un archivo o de una API: las páginas se compilan igual. **El
contrato de datos es la forma que tienen hoy los objetos de `sitio/src/data/*.js`, y
la API tiene que entregar exactamente esas formas.**

```
ANTES                          DESPUÉS
sitio/src/data/catalogo.js           sitio/src/data/catalogo.js
  export const piezas = [...]    const res = await fetch(`${API}/piezas`)
                                 export const piezas = await res.json()
```

(La dirección `${API}/piezas` es ilustrativa: las rutas las define quien haga la
API.)

El sitio es **estático**: se compila con `npm run build` y se publica la carpeta
`sitio/dist/`. Las llamadas a la API ocurren **en la compilación**, no en el navegador
del visitante. Eso significa que:

- La API no necesita estar disponible para que el sitio funcione.
- Publicar un cambio requiere volver a compilar. Al guardar en el administrador,
  la API encola una publicación que corre en el propio servidor de Neucast (ver `docs/despliegue.md`).
- No hay que preocuparse por la velocidad de la API ni por protegerla del
  tráfico público de lectura.

---

## 2. Qué es administrable y qué no

| Administrable desde el administrador | Se queda en código |
| --- | --- |
| Piezas del catálogo | La estructura de las páginas |
| Fichas técnicas de cada pieza | Los filtros disponibles y sus opciones |
| Categorías (nombre, foto, texto) | El diseño, los colores, la tipografía |
| Proyectos completos | Los textos de páginas fijas (nosotros, contacto, legales) |
| Piezas destacadas del home | Las preguntas frecuentes |
| Datos de contacto y redes | Los bloques editoriales del catálogo |
| Colecciones por espacio (home office) | |

Los textos de las páginas fijas **no** se conectan a propósito: cambian una vez
al año y pasarlos por un editor invita a que alguien rompa el posicionamiento
sin darse cuenta. Si más adelante se quieren editables, el camino es el mismo
que el resto.

---

## 3. Los archivos de datos

### 3.1 `sitio/src/data/site.js`: datos de la empresa

Lo usa el encabezado, el pie, los botones de WhatsApp y el esquema
`Organization` que va en las 50 páginas.

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

En el administrador, los datos de la empresa son **una pantalla de ajustes**
(un solo registro), no una lista. Las categorías son su propia tabla.

**Cuidado con `site.domain`.** Si queda mal, quedan mal las canónicas, el mapa
del sitio y el `robots.txt` de golpe. Es el dato más caro de equivocar.

### 3.2 `sitio/src/data/catalogo.js`: el catálogo

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
  entrega: "inmediata",          // un id de la lista `entrega` de `filtros`
  nuevo: true,                   // pinta la etiqueta "Nuevo"
  espacios: ["home-office"],     // colecciones por espacio; hoy solo home-office
  // campos de filtro, según la categoría:
  uso, respaldo, plazas, brazos, base, extras
}
```

Los valores de `entrega` hoy son `inmediata`, `10dias` y `pedido`. La lista
manda: se lee de `filtros` en `catalogo.js`.

**Los campos de filtro son los que hacen funcionar el panel de filtros.** No son
libres: cada uno solo acepta los valores declarados en `filtros`. Si la API
manda un valor que no está en la lista, la pieza deja de aparecer al filtrar por
ese campo. En el administrador tienen que ser **listas cerradas** (selectores de
una opción o de varias), nunca texto libre.

En el administrador esto es la **tabla de piezas**. La categoría es una
referencia a la tabla de categorías; los campos de filtro, `colores`,
`material` y `espacios` son listas cerradas.

### 3.3 `sitio/src/data/fichas.js`: las fichas técnicas

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
en pantalla. Si el administrador agrega una clave nueva, hay que agregarla ahí o
no se muestra.

En el administrador la ficha puede ir dentro de la misma pantalla de la pieza:
para quien captura es una sola cosa.

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

### 3.4 `sitio/src/data/proyectos.js`: los proyectos

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
no existe. Esto va a pasar seguido mientras se carga el catálogo, así que es a
propósito y no hay que "arreglarlo".

En el administrador esto es la **tabla de proyectos** con una **lista ordenable
de bloques**, donde cada bloque elige su tipo y pide solo los campos de ese
tipo. Es lo más laborioso de construir y lo que más rinde: es lo que evita que
todos los proyectos se vean iguales.

### 3.5 `sitio/src/data/homeOffice.js`: la colección por espacio

Las piezas de home office no se capturan aquí: aparecen porque traen
`home-office` en su campo `espacios` (apartado 3.2). Lo que sí vive aquí:

| Export | Qué es |
| --- | --- |
| `homeOffice` | Las fotos de la página: `hero`, `portada` (con su `alt`) y `cierre` |
| `sets` | `id`, `nombre`, `texto` y `piezas` (de dos a cuatro `slug`). Un set con menos de dos piezas publicadas no sale |
| `ideas` | Título, texto y foto. Sin cifras que no estén confirmadas |

El detalle pantalla por pantalla está en
[mapa-de-conexion.md](mapa-de-conexion.md), apartado 11c.

### 3.6 `sitio/src/data/pdfs.js`: los PDF

No se captura nada. Lee de `sitio/public/` si existe la ficha o el catálogo en PDF y
saca del archivo las hojas y el peso. Un catálogo propio del cliente va en
`sitio/public/catalogos/propios/` con el mismo nombre que el generado y se descarga
ese en su lugar. Cómo se generan está en [despliegue.md](despliegue.md).

---

## 4. Las medidas de los textos

La retícula está calibrada para textos de un largo concreto. Si los textos que
entren por el administrador se salen de estos rangos, las páginas dejan de verse
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
   `sitio/dist/` antes de publicar.
4. **Los botones dicen la acción concreta**, no "ver más".
5. **Todo lo que se superpone difumina el fondo**, no solo lo oscurece.

---

## 6. Lo que hay que conectar antes de publicar

Por orden de urgencia:

1. **El formulario de contacto.** Hoy `SIMULAR_ENVIO = true` en
   `sitio/src/pages/contacto.astro`: el formulario valida, enseña la pantalla de
   gracias y **no manda nada**. Hay que poner `false` y apuntar `ENDPOINT` a la
   ruta de contacto de la API del administrador. Sin esto el sitio pierde
   solicitudes en silencio, que es el peor error posible aquí.

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
     "aviso": "on",
     "proyecto": [
       { "pieza": "Silla operativa Órbita", "cantidad": 40, "url": "https://neucast.com.mx/muebles/..." }
     ]
   }
   ```

   `telefono` viaja siempre con **diez dígitos y sin separadores**: los espacios
   que se ven al escribir son solo para leerlo. `estado` es una de las 32
   entidades, elegida de una lista cerrada que vive en el frontmatter de
   `contacto.astro`, así que se puede agrupar por estado sin limpiar nada.
   `nombre`, `apellido` y `ciudad` aceptan letras, acentos, ñ, espacios y los
   signos de un apellido compuesto, nunca dígitos. `proyecto` es opcional: solo
   llega si la persona armó una lista en "Mi proyecto", y viaja en el mismo
   envío (cantidad entre 1 y 999).

   **Valida otra vez en el servidor.** Lo de aquí es comodidad para quien
   escribe, no seguridad: cualquiera puede mandar un `POST` a mano. Lo demás que
   tiene que hacer la API con el envío (guardarlo, SMTP, CORS, campo trampa,
   límite por IP) está en [despliegue.md](despliegue.md), apartado 4.
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

- **`compartido/`**: las variables de diseño (`styles/global.css`), los
  íconos, el logotipo y el cajón lateral. Cambiar un valor aquí cambia el sitio
  entero, que es justo para lo que sirve, pero hay que saberlo. El frontend del
  administrador usa lo mismo, así que un cambio aquí también se nota allá.
- **La generación de `sitemap.xml` y `robots.txt`**: salen de las mismas listas
  que generan las páginas. Si la API entrega bien los datos, se actualizan
  solos.
- **Las canónicas y el `robots` de cada página**: viven en `sitio/src/layouts/Base.astro`
  y ya están resueltos. Las páginas que no se indexan lo declaran con la
  propiedad `noindex`.
- **Los componentes compartidos** (`VisorGaleria`, `PanelLateral`,
  `CursorAmpliar`, `CierreCta`, `EscenasCarrusel`): los usan varias páginas, así
  que un cambio ahí se nota en más sitios de los que parece.
