# Pendientes y decisiones abiertas

Lo que falta es contenido y datos del cliente, no código. El front está
terminado: 50 páginas, 46 indexables, sin enlaces rotos.

Lo urgente, en orden:

1. Conectar el formulario de contacto, que hoy no manda nada.
2. El número de WhatsApp y el correo de ventas reales.
3. El contenido real del catálogo, las fichas y los proyectos.
4. Las fotos reales de producto y de proyecto.
5. El administrador propio (ver abajo): definir el backend con el desarrollador.

## Administrador propio

Ya no se usa WordPress: el administrador se hace desde cero, con el frontend
en Astro (sitio estático aparte, tipo `admin.neucast.com.mx`) y una API. El
porqué está en `decisiones.md`; el contrato de datos, en `administrador.md`; el
flujo de publicación, en `despliegue.md`.

- [ ] **Definir el backend con el desarrollador**, según su lenguaje: si es
      PHP, Laravel con MySQL en Hostinger; si es Node, ver el punto siguiente.
- [ ] **Confirmar qué acepta el plan de Hostinger** (Business Web Hosting):
      si corre Node, qué versión de PHP trae y si deja crear los subdominios
      del administrador y de la API.
- [ ] **Avisarle al desarrollador del cambio.** Ya se le había mandado un
      mensaje hablando de WordPress headless; hay que decirle que ahora es un
      administrador propio y pasarle `administrador.md`.
- [ ] **Licencia o alternativa de Helvetica Neue** para generar las fichas y
      los catálogos en PDF en el servidor de compilación (Linux no la trae).
- [ ] **Pasar el dominio `neucast.com.mx` a Hostinger** y retirar el WordPress
      que hoy está instalado para ese dominio, revisando antes si alguna
      dirección publicada está indexada.
- [ ] **Contratar el VPS de Hostinger (KVM 1) y montar ahí producción y
      `stg.neucast.com.mx`** (sin GitHub). El plan Business Web Hosting se
      queda para correo y respaldo.
- [ ] **Confirmar con el cliente dónde está su correo** (cree que en GoDaddy):
      buzón de las solicitudes y cuenta desde la que manda el servidor.
- [ ] **El paso a producción en el VPS**: compilar con los datos de la
      API, generar los PDF, pasar `npm run revisar` y subir `dist/` por SSH.

## Páginas

| Página | Ruta | Estado |
|---|---|---|
| Home | `/` | ✅ Lista |
| 404 | `/404/` | ✅ Lista |
| Listado de catálogo | `/muebles/` | ✅ Lista |
| Categoría | `/muebles/{categoria}/` | ✅ Listas (8) |
| Detalle de pieza | `/muebles/{categoria}/{pieza}/` | ✅ Listas (26, fichas de maqueta) |
| Proyectos | `/proyectos/` | ✅ Lista (contenido de maqueta) |
| Home office | `/home-office/` | ✅ Lista (fotos de Pexels, de posicionamiento) |
| Recursos | `/recursos/` | ✅ Lista: catálogo general y uno por categoría |
| Detalle de proyecto | `/proyectos/{slug}/` | ✅ Listas (4, contenido de maqueta) |
| Nosotros | `/nosotros/` | ✅ Lista |
| Preguntas frecuentes | `/preguntas-frecuentes/` | ✅ Lista |
| Contacto | `/contacto/` | ✅ Lista (falta conectar el envío) |
| Gracias | `/gracias/` | ✅ Lista |
| Aviso de privacidad | `/aviso-de-privacidad/` | ✅ Lista (faltan datos) |
| Términos y condiciones | `/terminos-y-condiciones/` | ✅ Lista (faltan datos) |

Más `sitemap.xml` y `robots.txt`, que se generan de las mismas listas que
generan las páginas.

## Enlaces rotos

Ninguno conocido: las 26 fichas de pieza y las cinco páginas de proyectos ya
existen. Conviene repetir la auditoría antes de publicar: recorrer los `href`
del build y comprobar que cada ruta existe en `dist/`.

## Buscador

**Hecho el 30 de septiembre de 2026.** Se adelantó porque el catálogo va a
pasar de 500 piezas. Índice propio (`buscar.json`) en vez de Pagefind; el
porqué está en `mapa-de-conexion.md`, apartado 11b.

## Fichas técnicas y catálogos en PDF

**Plantilla aprobada** por Daniel el 30 de septiembre de 2026 como base para
todas las fichas. Vive en `scripts/fichas/`: `plantilla.mjs` arma el HTML de
una ficha con los datos y `generar.mjs` lo imprime a PDF con Chrome sin
interfaz.

```bash
npm run fichas                                  # todas, a public/fichas/
node scripts/fichas/generar.mjs <carpeta> [slug ...]   # solo algunas
```

Una o dos hojas por pieza: la primera siempre (foto, nombre, párrafo,
acabados, datos principales, destacados y foto de ambiente); la segunda solo
si hay medidas, construcción, mecanismo o cuidados.

**Ya se descargan desde la ficha** (30 de septiembre). Los PDF están
versionados en `public/fichas/neucast-{slug}.pdf` y el panel de Descargas de
cada pieza enlaza al suyo, con el número de hojas y el peso leídos del archivo.
Si una pieza no tiene PDF, la opción de Descargas no aparece. **Cada vez que
cambien los datos de una pieza o la plantilla hay que volver a correr
`npm run fichas` en una Mac y subir los PDF**; si no, el PDF se queda atrás de
la ficha web.

**Lo que falta:**

1. Generarlos al publicar en vez de a mano, para que nunca se desfasen: en el
   mismo paso que compila el sitio en el servidor de Neucast. Depende del punto 3 (la
   letra) y del administrador propio, que es quien sabrá qué pieza cambió.
2. ~~El catálogo por categoría~~ **Hecho el 2 de octubre de 2026.** Página
   `/recursos/` con el catálogo general y uno por categoría; cada categoría
   enlaza el suyo en un bloque al final del listado (en la cabecera competía
   con el título) y `/muebles/` enlaza el general. Por decisión de Daniel, ni
   la página ni las categorías dicen hojas, peso ni número de piezas, y el
   enlace del footer y del menú dice "Catálogos", en la columna de Muebles. Se generan
   con `npm run catalogos` (en una Mac, como las fichas) en `public/catalogos/`.
   Formato aprobado: dos piezas por hoja, sin foto de ambiente, con fotos
   achicadas por `scripts/fichas/fotos.py` (Python con Pillow). Medido: unos
   35 KB por pieza (100 piezas, unos 3.4 MB; 200, unos 6.8 MB); el general en
   rejilla, unos 11 KB por pieza. Si una categoría pasa de unas 150 piezas,
   conviene partir su catálogo por tipo de mueble. Un catálogo que pase el
   cliente va en `public/catalogos/propios/` con el mismo nombre y se descarga
   ese en lugar del generado. **Al cambiar el catálogo hay que correr
   `npm run catalogos` y subir los PDF**, igual que con las fichas.
3. **Tipografía en el servidor de compilación.** La plantilla usa Helvetica
   Neue, que en Mac viene instalada pero en Linux no. Para que el PDF salga
   igual al compilar en el servidor (Linux) hay que licenciar la fuente para ese
   uso o elegir una alternativa muy parecida.
4. ~~Peso~~ Resuelto en los catálogos con fotos achicadas (punto 2). Las
   fichas individuales siguen con las fotos completas, como se aprobaron.
5. **Tiempo de publicación.** Con cientos de piezas conviene regenerar solo
   los PDF de lo que cambió.

## Origen de las imágenes

Las fotos de **Nosotros** y **Preguntas frecuentes** son de stock de
[Pexels](https://www.pexels.com) (licencia libre, sin atribución obligatoria).
Se descargaron, recortaron y optimizaron dentro del repo. Se reemplazan por
fotografía propia de Neucast cuando exista: basta sustituir el archivo con el
mismo nombre en `public/img/nosotros/` y `public/img/faq-hero.jpg`.

**Línea visual.** Dos reglas para elegir foto en Nosotros:

1. **Paleta.** Tonos cálidos y neutros de la marca: crema (`--paper`), arena
   (`--sand`), madera clara y tinta. Nada de colores saturados ni de grises
   fríos que peleen con el fondo del sitio.
2. **Cada imagen ilustra lo que dice su texto.** En el ADN, "Forma" muestra la
   silueta y la unión de una pieza, "Material" un primer plano del textil y
   "Propósito" una sala de juntas, que es justo el espacio que nombra el
   párrafo. Una foto bonita que no ilustra el texto no entra.

| Archivo | Pexels |
|---|---|
| `nosotros/hero-lobby.jpg` | 9203451 |
| `nosotros/pilar-forma.jpg` | 7602882 |
| `nosotros/pilar-material.jpg` | 36346049 |
| `nosotros/pilar-proposito.jpg` | 7046164 |
| `nosotros/cierre-material.jpg` | 7232397 |
| `faq-hero.jpg` | 16630138 |
| `gracias-tela.jpg` | 4862997 |
| `home-office/hero.jpg` | 28461034 |
| `home-office/set-completo.jpg` | 14245340 |
| `home-office/idea-luz.jpg` | 15062127 |
| `home-office/idea-silla.jpg` | 31726663 |
| `home-office/idea-guardar.jpg` | 6958123 |
| `home-office/idea-casa.jpg` | 6969995 |
| `home-office/cierre.jpg` | 6934243 |

La página de contacto no tiene foto propia: como imagen para compartir
(Open Graph) usa la que trae `Base.astro` por omisión,
`public/img/hero-oficina.jpg`. El `contacto-hero.jpg` (Pexels 14002100) que
listaba esta tabla no existe en el repositorio.

Las de **home office** son de posicionamiento: no hay todavía fotografía de
home office de Neucast. Se cambian por propias sustituyendo el archivo con el
mismo nombre.


Videos (Pexels): `oficina-neucast.mp4` 8347237, `editorial-neucast.mp4` 7533208.

## Imágenes

### Dónde viven
- **Fijas del diseño** (hero, editorial, CTA, fotos de espacios): `public/img/`.
  Se suben al hosting tal cual. Para actualizar una, se reemplaza el archivo
  **con el mismo nombre** y listo.
- **De catálogo** (piezas, categorías, proyectos): hoy están en `public/img/`
  como demo; vendrán del administrador y el `src` saldrá de su API.

### Nombres y alt (SEO)
- Nombre de archivo descriptivo y con guiones: `sillas-ejecutivas.jpg`,
  `proyecto-cafeteria.jpg`. Nunca `IMG_2831.jpg`.
- El `alt` describe la imagen, no repite keywords. Los componentes aceptan un
  campo `alt` desde los datos, así que **el cliente podrá editarlo desde el
  administrador**.
  Si no se define, se arma uno razonable por defecto.

### Optimización pendiente
Hoy las imágenes se sirven tal cual (JPG comprimido). Cuando lleguen las fotos
reales conviene mover las fijas a `src/assets/` y usar el componente `<Image>`
de Astro: genera WebP/AVIF y `srcset` automáticamente. El flujo de "reemplazar
por nombre" se mantiene igual (se edita el archivo en `src/assets/`).

## Componentes reutilizables

En `src/components/`:
- `Logo.astro`: logotipo (acepta `height` y `mono`)
- `Icon.astro`: iconos del sitio (`arrow`, `chevron`, `chevronLeft`, `whatsapp`)
- `WaButton.astro`: botón de WhatsApp con mensaje precargado y variantes
- `PageHero.astro`: cabecera de página interior (imagen con título encima)
- `SectionHead.astro`: cabecera de sección (título, subtítulo, link o controles)
- `PiezaCard.astro`: card de pieza
- `CategoryCard.astro`: card de categoría

En `src/layouts/Base.astro`: header, menú lateral, footer, burbuja de WhatsApp
y los observadores de animación. **Toda página nueva parte de este layout** y
hereda header, footer y comportamiento sin repetir código.

## BLOQUEANTE: el formulario dice "gracias" sin enviar nada

El flujo está completo de punta a punta (validación, estado de envío, redirección
a `/gracias/`), pero **la llamada al servidor está simulada** para que el
prototipo se pueda enseñar al cliente.

En `src/pages/contacto.astro`, al inicio del `<script>`:

```js
const SIMULAR_ENVIO = true;   // ← poner en false
const ENDPOINT = "";          // ← poner la URL real
```

**Mientras `SIMULAR_ENVIO` sea true, el sitio no puede publicarse en el dominio
real.** Una persona llenaría el formulario, vería la página de gracias y su
solicitud no llegaría a ningún lado.

### Recomendación: recibirlo en la API del administrador

Como el proyecto va a tener su propia API en Hostinger para administrar el
catálogo, lo más limpio es que esa misma API reciba el formulario. No agrega
proveedores, no cuesta nada extra y no hay un tercero más que declarar en el
aviso de privacidad. El campo `proyecto` (la lista de Mi proyecto) viaja en el
mismo envío.

1. **Una ruta de contacto en la API** (por ejemplo `POST /contacto`; la
   dirección exacta la define quien haga la API).
2. **Guardar la solicitud en la base** antes de mandar el correo. Es lo que hace
   que el cliente vea los prospectos en el administrador aunque el correo falle
   o se vaya a spam. Un formulario que solo manda correo pierde clientes en
   silencio.
3. **Enviar con SMTP autenticado** del buzón de Hostinger, no con el `mail()` del
   servidor. Sin SMTP el correo acaba en spam.
4. **Permitir el origen del sitio por CORS**, porque el frontend vive en otro
   dominio.
5. **Antispam sin terceros**: la trampa oculta (`sitio_web`) ya está en el
   formulario; basta con descartar en el servidor los envíos que la traigan
   llena, más un límite por IP. Evitar reCAPTCHA: mete otro tercero, cookies y
   más texto legal.

La alternativa es un servicio tipo Web3Forms o Formspree, que se monta en una
tarde, pero suma un proveedor que hay que declarar y deja los prospectos fuera
del administrador del cliente.

## Páginas legales

**Son borradores y necesitan revisión de un abogado en México antes de
publicarse.** Están redactados sobre lo que el sitio hace hoy (sin formularios,
sin cookies propias, sin analítica y con la conversión por WhatsApp y correo),
que es lo que la ley exige describir.

Mientras contengan datos sin llenar, las dos páginas salen con `noindex` y los
huecos aparecen **resaltados en amarillo**, para que nadie las publique sin darse
cuenta. En cuanto se llenen, el `noindex` desaparece solo.

### Datos que debe dar el cliente

| Dato | Dónde se usa |
|---|---|
| Razón social completa | Aviso y términos |
| RFC | Aviso y términos |
| Domicilio fiscal completo | Aviso y términos |
| Teléfono de contacto | Aviso |
| Ciudad y estado para la jurisdicción | Términos |
| Correo real del responsable de datos | Los dos (hoy usa el de `site.js`, simulado) |

Se editan en el bloque `const resp = {...}` al inicio de cada página.

### Puntos que el abogado debe confirmar

- **El marco cambió hace poco.** La LFPDPPP se sustituyó en 2025 y el INAI
  desapareció, con sus funciones trasladadas a la administración pública federal.
  Por eso el aviso habla de "la autoridad competente" sin nombrarla: hay que
  confirmar el nombre vigente y ponerlo.
- El plazo de garantía concreto que se ofrece, para que coincida con lo que dice
  la página de preguntas frecuentes.
- Las condiciones de cancelación y si el anticipo es reembolsable.
- Si hace falta registro ante PROFECO por el tipo de operación.

### REVISIÓN OBLIGATORIA ANTES DE SALIR A PRODUCCIÓN

Los legales se redactaron sobre el sitio tal como estaba: **sin formularios, sin
cookies y sin analítica**. Dos cosas previstas para esta fase rompen justo esa
base, así que **hay que releerlos completos antes del lanzamiento**:

**1. La página de contacto con formulario.** Hoy el aviso dice literalmente
"este sitio no tiene formularios". En cuanto exista hay que:

- Corregir esa frase y describir el formulario como canal de recolección.
- Listar los campos exactos del formulario en el apartado de datos tratados.
- Poner un **enlace al aviso de privacidad junto al botón de enviar**, con la
  casilla o la leyenda de consentimiento. Es requisito, no adorno.
- Declarar al proveedor que procesa el envío como encargado, y si está fuera de
  México, mencionar la transferencia internacional.
- Revisar el apartado de conservación: los mensajes del formulario se guardan en
  algún lado y hay que decir por cuánto tiempo.

**2. La analítica.** Ver el apartado siguiente.

**3. Repasar de punta a punta** que todo lo que se implementó en fase 1 esté
descrito: si se agregó chat, mapa embebido, video de terceros o pixel de
remarketing, cada uno es un tratamiento o una transferencia que declarar.

### El día que se agregue analítica

Hoy el sitio **no instala una sola cookie** y lo único que llama a un tercero es
Google Fonts. Por eso no hay banner: pedir consentimiento para algo que no
ocurre es ruido.

En cuanto se agregue Google Analytics, Meta Pixel o similar hay que: actualizar
el aviso, crear una política de cookies y poner un banner que **pida
consentimiento antes** de cargar esos scripts, no después.

## Fotos que no corresponden a lo que dicen

- `espacio-recepcion.jpg` era una terraza exterior con muebles de mimbre
  rotulada como recepción. Se borró al quitar la sección de espacios y ya no la
  usa nada.
- **Las fotos de proyecto se repiten entre un proyecto y otro.** Dentro de una
  misma página no se repite ninguna, pero la misma foto ilustra cosas distintas
  en dos casos. Es maqueta: cada proyecto real necesita sus diez fotos propias.
- **Las fotos de producto son ocho demostraciones** repartidas entre 26 piezas.

## Catálogo: lo que cambia cuando entre el catálogo real

### La paginación de hoy es de mentiras

`Cargar más` no pide nada: las 26 piezas viajan completas en el HTML y el
JavaScript solo esconde las que sobran de la tanda. Con 26 da igual. Con 300 o
500, el navegador descarga las 500 cards con sus fotos antes de pintar la
primera, y Core Web Vitals se cae.

Cuando el catálogo venga del administrador, **el botón tiene que traer la
siguiente tanda**, no destapar lo que ya está. Y los filtros, que hoy también
corren sobre el DOM, tendrán que viajar en la consulta.

### Las especificaciones de la ficha son de maqueta

`src/data/fichas.js` tiene las 26 fichas completas: medidas, construcción,
mecanismo y cuidados. **Ninguno de esos valores está confirmado contra un
catálogo.** Se escribieron para poder ver la ficha llena y, sobre todo, para
dejar por escrito qué campos tiene que traer el administrador.

Antes de publicar hay que sustituirlos uno por uno contra las tablas de medidas
de PREMIUM y las especificaciones de Zol. Mientras tanto, esas páginas no
deberían indexarse con datos inventados.

También falta:

- **Fotos reales.** Hoy cada pieza reusa uno de ocho PNG de demostración y la
  foto de su categoría. La galería está hecha para tres o cuatro tomas por
  pieza: producto recortado, ambiente y detalle de material.
- **La ficha técnica en PDF con datos reales.** Ya se genera una por pieza
  (ver "Fichas técnicas y catálogos en PDF"), pero con los datos de maqueta:
  hay que regenerarlas cuando entren los reales.
- **Video de producto.** La referencia lo tiene y le sienta bien a la ficha,
  pero no hay material. No se puso un clip genérico repetido en 26 páginas.

### Material para los bloques editoriales por categoría

Las reglas ya están escritas en `src/data/catalogo.js` y el mecanismo funciona,
pero hoy solo `/muebles/` muestra bloques: las categorías no llegan al mínimo de
12 piezas y, sobre todo, **falta material propio de cada una**.

Hay que pedirle al cliente, por categoría, una foto de proyecto instalado o de
espacio resuelto **que sea de esa categoría**. Lo que ya tenemos y es honesto:

| Categoría | Material | Estado |
|---|---|---|
| Cafeterías | `proyecto-cafeteria.jpg` | ya cargado |
| Lounge y áreas comunes | `cta-sillones.jpg` | ya cargado |
| Las otras seis | nada | **falta** |

Una categoría sin material propio no lleva bloque, a propósito. Es preferible a
poner un "explora los espacios" genérico encima de una cuadrícula de sillas.

## Datos estructurados

### Las migas de pan se quitaron del esquema

`BreadcrumbList` viajaba en cinco páginas sin que existiera una miga visible en
ninguna. Google pide que lo marcado se vea, así que se quitó el esquema en vez
de dejar una declaración sin respaldo.

**Si algún día se ponen migas visibles**, hay que devolver el esquema: en las
fichas de producto y en las páginas de categoría es donde más aporta, porque
quien llega desde una búsqueda cae ahí directo y no pasó por el catálogo.

### Lo que falta de la tarjeta de marca

`Organization` ya viaja en todas las páginas desde el layout, con una sola
matrícula. Falta `WebSite` con `potentialAction` de búsqueda, que es lo que habilita
la caja de búsqueda en el resultado, ni `LocalBusiness` con domicilio y horario,
que es lo que conecta con la ficha de Google Business. Las dos piden datos del
cliente que todavía no tenemos: domicilio, teléfono fijo y horario. `WebSite`
además solo tiene sentido cuando el sitio tenga buscador propio.

También hay que sustituir en `Organization` el correo y las redes, que hoy son
los simulados de `src/data/site.js`, y cambiar el logo: hoy apunta al favicon
SVG y debería ser una imagen cuadrada de al menos 112 px.

## Datos que hay que pedirle al cliente al final

Todo esto está simulado en `src/data/site.js` o marcado entre corchetes en las
páginas legales. Son los últimos huecos antes de publicar.

- [ ] **Correo de contacto real.** Hoy `contacto.ventas@neucast.com.mx`, sin
      confirmar. Sale en el footer, en la ficha de marca y en los legales.
- [ ] **Número de WhatsApp real.** Hoy `5215500000000`. Alimenta todos los
      botones de cotización del sitio.
- [ ] **Para `LocalBusiness`:** domicilio completo, teléfono fijo y horario de
      atención. Sin esos tres no se puede declarar.
- [ ] **Para los legales:** razón social, RFC, domicilio fiscal y jurisdicción.
- [x] Logo cuadrado de 512 px para el esquema `Organization`. Resuelto.
- [ ] **Home office: ¿entregan a domicilios particulares?** ¿Y a varios
      domicilios para una misma empresa? Hoy la página no lo promete: habla de
      cotizar sets por puesto en una sola propuesta y nada más. Si la respuesta
      es sí, se dice en la página y en el bloque para empresas.
- [ ] **Home office: fotos propias** de espacios de trabajo en casa con piezas
      de Neucast, para sustituir las de Pexels.

## Proyectos: los cuatro casos son de maqueta

La sección está construida (`/proyectos/` y cuatro páginas de detalle), pero
**todo el contenido de `src/data/proyectos.js` está inventado**: los sectores,
las ciudades, los años, las cifras y los textos. Se escribieron para poder ver
la sección completa y para dejar por escrito qué campos tiene que traer el
administrador. Antes de publicar hay que sustituirlos por casos reales.

Los cuatro llevan hoy la misma secuencia de bloques, que es la plantilla de la
sección y la que hay que llenar en cada caso nuevo:

    imagen · capítulo · dúo · destacado · capítulo · escenas ·
    capítulo · imagen · dúo · destacado · capítulo · video

Nunca dos imágenes seguidas ni dos capítulos seguidos. Si un proyecto real pide
otro ritmo, los bloques se reordenan sin tocar la página.

Por cada proyecto real hace falta:

- [ ] **Diez fotos propias**: la portada, dos a todo el ancho, cuatro para los
      dos pares y tres para las zonas con puntos. Hoy reusan las de categoría y
      las de ambiente, y hay fotos que se repiten entre un proyecto y otro
      (dentro de una misma página no se repite ninguna).
- [ ] **Video por proyecto.** Se reproduce en su sitio, no en el visor. Hoy los
      cuatro reusan los dos clips editoriales.
- [ ] **Medidas de los textos**, que son las que sostienen la retícula: el
      nombre entre 30 y 50 caracteres (dos renglones), el resumen entre 105 y
      125 (tres), los títulos de capítulo entre 24 y 32 (dos) y cada párrafo
      entre 90 y 135 (dos). Con esas medidas las cuatro páginas se ven iguales.
- [ ] Tipo de espacio, ciudad, año, superficie en metros y escala (puestos,
      personas o lugares). La superficie de hoy también está inventada.
- [ ] **El encargo**: qué pedían y con qué problema llegaron. Es el párrafo que
      convence, y es el que nadie puede escribir sin haber estado ahí.
- [ ] Qué piezas del catálogo se instalaron, para los puntos sobre la foto.
- [ ] **¿Se puede nombrar al cliente?** Hoy se usa sector y ciudad, que funciona
      igual y no pide autorización. Si la hay, el campo `cliente` la sustituye.

Un punto cuya pieza no esté en el catálogo no se pinta, para no mandar a una
página que no existe.

### Cómo clasificar los proyectos cuando sean muchos

Hoy van de corrido, del más reciente al más viejo, y con cuatro está bien: un
filtro sobre cuatro tarjetas es peor que ninguno, porque obliga a elegir antes
de haber visto.

**A partir de unos doce**, conviene filtrar por **tipo de espacio** (cafetería,
piso de trabajo, recepción, sala de consejo), que es el eje por el que la gente
llega: alguien que va a amueblar una cafetería quiere ver cafeterías. Se
reutilizan los chips del catálogo, así que es trabajo de datos, no de diseño.

La ciudad es tentadora como segundo filtro, pero sirve menos: nadie descarta un
proyecto por estar en otra ciudad. Vale más como dato de la ficha, que ya está.

**A partir de unos treinta**, cada tipo de espacio se gana su propia página
(`/proyectos/cafeterias/`). Ahí sí vuelve la idea de "espacios" que se descartó,
pero en la forma que no canibaliza: son colecciones de proyectos, no listados de
muebles, así que no compiten con `/muebles/{categoria}/`.

## Otras páginas que valdría la pena

1. **Blog o guías** (cómo elegir silla operativa, cuánto mide una sala de juntas
   para diez). Es lo que captura búsquedas de quien todavía no sabe qué comprar.
2. **Gracias por WhatsApp**, si algún día se quiere medir ese canal aparte.

No se harán páginas por espacio: tres de los cuatro espacios ya tienen su
página en el catálogo y competirían por la misma búsqueda.

## Antes de publicar

- [ ] **Poner `SIMULAR_ENVIO = false` y conectar el `ENDPOINT` del formulario**
      en `src/pages/contacto.astro`. Hoy valida, enseña la pantalla de gracias y
      no manda nada. Es lo más caro de olvidar: el sitio pierde solicitudes sin
      avisar.
- [ ] Número de WhatsApp y correo reales en `src/data/site.js` (hoy simulados).
      El número lo usan 269 enlaces del sitio.
- [ ] Contenido real: catálogo, fichas técnicas y proyectos
- [ ] Fotos reales de producto y de proyecto
- [ ] Datos fiscales y de domicilio para `LocalBusiness` y para las legales
- [ ] Revisar las legales con un abogado, ya con el formulario funcionando
- [ ] Google Search Console: dar de alta el sitio y mandar `sitemap.xml`
- [ ] Ficha de Google Business
- [ ] Redirecciones desde la página "próximamente" actual
- [ ] Revisar Core Web Vitals con las fotos reales

Ya resuelto y no hay que volver a hacerlo:

- [x] `sitemap.xml` y `robots.txt`, generados de las mismas listas que generan
      las páginas. Se actualizan solos.
- [x] Canónicas con diagonal final y `robots` explícito en las 50 páginas
- [x] Datos estructurados: `Organization` en todas, más `Product`,
      `CollectionPage`, `Article`, `FAQPage`, `ContactPage` y `AboutPage` donde
      corresponde. `BreadcrumbList` se quitó a propósito, porque las migas no se
      ven en pantalla y Google pide no marcar lo que no se muestra.
- [x] Un `h1` por página y sin saltos de nivel
