# Design system: Neucast

Fuente de verdad: `src/styles/global.css`. Este documento explica cómo usarlo.

**Regla base:** ningún componente inventa tamaños. Si necesitas un tamaño de texto,
usas una clase de nivel (`.t-h2`); si necesitas un color, usas un token (`var(--olive)`).
Un `clamp()` suelto dentro de un componente es un bug, no una decisión.

---

## 1. Color

| Token | Valor | Uso |
|---|---|---|
| `--white` | `#ffffff` | Fondo base del sitio |
| `--paper` | `#F5F2E7` | Superficies alternas (footer, cards de producto, secciones) |
| `--paper-soft` | `#FAF8F1` | Variante aún más clara |
| `--ink` | `#1D1D1B` | Texto principal, botón primario |
| `--ink-60` | `#5f5e59` | Texto secundario, párrafos de apoyo |
| `--ink-40` | `#95948e` | Texto terciario, metadatos, iconos inactivos |
| `--line` | `#E7E4DA` | Bordes y divisores |
| `--olive` | `#78894A` | **Acento.** Solo detalles: links, viñetas, hotspot activo |
| `--olive-deep` | `#5E6C39` | Acento sobre fondo claro (links, hover) |
| `--sage` / `--sand` | `#A1B39D` / `#D9C7A1` | Apoyo, uso muy puntual |
| `--wa` | `#1DAA61` | Exclusivo de WhatsApp. Nunca decorativo |

El verde **acentúa, no domina**. Si una sección se ve verde, está mal.

---

## 2. Tipografía

Familias: `--sans` (Helvetica Neue nativa en Apple, Inter como respaldo) y
`--serif` (Baskerville / Libre Baskerville) para acentos editoriales.

### Escala (fluida: móvil → escritorio)

| Clase | Token | Móvil (375px) | Escritorio (1440px) | Uso |
|---|---|---|---|---|
| `.t-display` | `--fs-display` | 31px | 72px | Solo el H1 del hero |
| `.t-h1` | `--fs-h1` | 28px | 52px | Título de página, banners de cierre |
| `.t-h2` | `--fs-h2` | 25px | 38px | Título de sección |
| `.t-h3` | `--fs-h3` | 20px | 28px | Subtítulo dentro de una sección |
| `.t-h4` | `--fs-h4` | 17px | 20px | Título de card o bloque |
|  | `--fs-body-lg` | 16px | 18px | Entradilla |
|  | `--fs-body` | 16px | 16px | Cuerpo |
|  | `--fs-sm` | 15px | 15px | Texto de apoyo, links de footer |
|  | `--fs-xs` | 13px | 13px | Labels, texto de botones |
|  | `--fs-2xs` | 12px | 12px | Overline |

La jerarquía se mantiene en **todos** los anchos: display > h1 > h2 > h3 > h4 > body.
Un H3 nunca puede verse más grande que el H2 que lo contiene.

### Clases de carácter

- `.display`: peso 700 y tracking apretado. Se combina con la clase de nivel:
  `class="display t-h2"`. **No define tamaño.**
- `.serif-eyebrow`: antetítulo en serif.
- `.overline`: 12px, mayúsculas, tracking amplio, color oliva.
- `.label`: 13px, peso 600. Navegación y botones.

### Salto de línea

- `.t-display` usa `text-wrap:balance` (líneas parejas, ideal para un titular corto).
- `.t-h1/.t-h2/.t-h3` usan `text-wrap:pretty` (llenan el renglón antes de saltar).
- Para forzar un corte exacto, se parte el texto en `<span class="paint-line">`.
- `text-wrap:balance` reparte las palabras parejo entre las líneas, así que
  corta antes de llegar al final del renglón. Sirve en titulares y párrafos de
  varias líneas, pero **no en frases sueltas de una o dos líneas**: ahí se usa
  `text-wrap:wrap` para que la frase llene el ancho y solo salte cuando se acaba.
- Cuidado: `text-wrap` no acepta `normal`. Sus valores son `wrap`, `nowrap`,
  `balance`, `pretty` y `stable`; cualquier otro se descarta en silencio y la
  regla heredada sigue mandando.

---

## 3. Espaciado

| Token | Valor | Uso |
|---|---|---|
| `--space-1..8` | 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 px | Escala general |
| `--gutter` | `clamp(20px,4vw,56px)` | Margen lateral. **Todo** se alinea a él |
| `--section-y` | `clamp(64px,9vw,120px)` | Separación entre secciones |
| `--block-y` | `clamp(28px,4vw,44px)` | Cabecera → contenido |
| `--container` | `1440px` | Ancho máximo del contenido |

Los carruseles (`.rail`) calculan su padding con `--rail-pad` para alinearse al
borde interno de `.container` en cualquier ancho.

---

## 4. Botones

Todos parten de `.pill` (alto 44px, radio completo, 13px/600, centrado).

| Clase | Aspecto | Cuándo |
|---|---|---|
| `.pill--wa` | Verde WhatsApp | **Toda acción que lleve a WhatsApp**, sobre fondo claro |
| `.pill--primary` | Tinta sólida, texto blanco | Acción principal que **no** es WhatsApp, sobre fondo claro |
| `.pill` (base) | Blanco sólido, texto tinta | Acción principal sobre foto |
| `.pill--ghost` | Contorno, sin relleno | Secundaria sobre fondo claro |
| `.pill--glass` | Translúcido + blur | Secundaria sobre foto |

Reglas:
- Sobre **fondo claro**: primaria `--primary`, secundaria `--ghost`.
- Sobre **foto o fondo oscuro**: primaria `.pill` (blanca), secundaria `--glass`.

### Por qué la acción principal es negra y no verde

Hay dos verdes en el sitio y ninguno puede ser el botón principal. El **oliva**
es el acento de marca y la regla es que acentúe, no domine. El **verde
WhatsApp** está reservado a ese canal. Un botón principal en oliva pondría dos
verdes distintos en la misma pantalla, uno apagado y otro saturado: se ensucia y,
peor, el verde deja de significar "esto te lleva a WhatsApp".

La tinta resuelve las dos cosas: máximo contraste sobre crema, cero competencia
con el verde, y es el registro de la referencia. El código queda legible:
**verde = WhatsApp, tinta = todo lo demás, contorno = secundario.**

### El verde funciona en los dos sentidos

- `--wa` **nunca** se usa de adorno.
- Y al revés: **una acción que lleve a WhatsApp no puede ir de otro color** sobre
  fondo claro. Si el botón es verde, el usuario sabe a dónde va antes de tocarlo;
  si a veces es verde y a veces no, el color no informa nada.
- **Excepción sobre foto:** ahí manda el contraste y se usan `.pill` y
  `--glass`. El verde sobre imagen pierde legibilidad y compite con el titular.
  Es lo que hace el hero: el botón de WhatsApp va en cristal y el del header pasa
  a verde en cuanto se sale de la foto.

**Un solo nombre por variante.** `.pill--dark` existió como alias exacto de
`.pill--primary` y se eliminó: dos nombres para la misma regla es cómo un sistema
empieza a desordenarse, porque tarde o temprano alguien cambia uno y no el otro.
- En móvil (≤639px) los botones son de ancho completo y 50px de alto.
- La burbuja flotante de WhatsApp se oculta cuando hay otro CTA de cotización
  en pantalla (`[data-hides-fab]`), para no repetir la misma acción.

### Carruseles dentro de una card

Las fotos de cada pieza del catálogo se pasan con el dedo en táctil. **Las
flechas no van debajo de la foto**, como en muchas plantillas: ensucian la
cuadrícula y en móvil no sirven. Van **sobre la imagen, a los lados**, y solo
aparecen con cursor fino (`@media (hover:hover) and (pointer:fine)`) al acercar
el ratón a la card.

Los puntos son la única señal en táctil de que hay más de una foto, así que ahí
están siempre visibles y en escritorio aparecen con el hover.

**En la card caben dos fotos como mucho: la principal y la de ambiente.** La
galería completa vive en la ficha de la pieza. Una pieza con seis fotos enseña
dos en la card; una con una sola enseña una, y entonces no hay puntos ni
flechas porque no hay a dónde pasar. El tope está declarado en `PiezaCard` como
`MAX_FOTOS_CARD`, y como la card es una sola, la regla cae en los cuatro sitios
donde se usa: el riel del home, el catálogo, las piezas que combinan de la ficha
y las piezas de un proyecto.

**En táctil no hay carrusel de fotos, en ninguna card.** Solo se pinta la foto
principal.

El motivo es el mismo en los dos sitios donde vive la card, y es de peso: la
tira de fotos es un contenedor que se desplaza en horizontal. Dentro de un riel
compite con el riel. Y en la cuadrícula del catálogo hay veinte llenando la
pantalla, así que un deslizamiento vertical que empieza sobre una foto se
engancha al carrusel y **la página no baja**: hay que levantar el dedo y
repetir. Entre pasar fotos y poder recorrer la página, manda la página.

Esconder el desbordamiento no basta: la tira sigue siendo desplazable por
dentro. Si las demás fotos no se pintan, no hay nada que desplazar y no hay
gesto que robar. Los puntos también se van, porque ya no señalan nada.

Las fotos completas siguen en la ficha de la pieza, que es donde alguien las
busca de verdad. Con cursor fino no hay conflicto y se quedan el carrusel, sus
flechas y sus puntos.

### Bloques editoriales en una cuadrícula de producto

Un bloque grande cada 8 o 12 piezas rompe la monotonía de la retícula, que es lo
que hace que la gente deje de mirar a partir de la cuarta fila. Pero **ocupa el
lugar de dos productos**, así que tiene que llevar a algún lado: a un espacio, a
un proyecto, a una guía. Si es solo una foto bonita, cuesta dos piezas y no
devuelve nada.

Con filtros aplicados los bloques **se ocultan**: quien está filtrando busca algo
concreto y ahí estorban.

### Tabs

`.tab` en píldora: contorno tenue en reposo, tinta sólida cuando está activo.
Cada tab controla un panel; los paneles inactivos se ocultan con
`display:none`, **no se sacan del DOM**, así que su texto se sigue indexando.

**Ningún tab se esconde.** Cuando no caben, bajan de renglón (`flex-wrap`), no
se recortan con un degradado. Por eso la etiqueta del tab es corta y va en un
campo aparte del nombre largo del grupo (`tab` vs `nombre`), igual que en los
espacios del home: con etiquetas largas no entran dos por renglón en un móvil.

**Los chips de temas de preguntas frecuentes bajan de renglón, no se recorren
de lado.** Eran un carrusel y con cuatro chips el recorrido entero era de 17 px
en un teléfono de 440. A esa distancia no hay gesto que valga: la franja ocupa
todo el ancho, así que el deslizamiento arranca cerca de la orilla y el teléfono
lo entiende como su gesto de ir atrás o adelante. Dos renglones ocupan 46 px más
y resuelven el caso en cualquier ancho y con cualquier nombre de categoría, que
es lo que importa cuando los temas vengan del gestor.

**En móvil los chips de filtro del catálogo sí son carrusel.** Llevan
`rail rail-mask` y van **a sangre**,
fuera del `.container`: así `--rail-pad` alinea el primer chip con el margen de
la página y el degradado de la derecha avisa de que hay más. A partir de 900px
caben todos, así que se centran y el carrusel se desactiva
(`overflow:visible`, `mask-image:none`).

**No usar `.rail` dentro de una columna angosta.** `.rail` calcula su padding
contra el ancho del contenedor completo, así que dentro de un bloque más
estrecho recorta el último elemento.

**Al cambiar de panel** las tarjetas entran escalonadas con `itemIn` y un
retraso de `calc(var(--i) * 55ms)`.

### Cuántos CTA por página

El header, el menú, el footer y la burbuja ya ofrecen la acción de cotizar de
forma permanente. Eso es **chrome del sitio** y no se cuenta.

Dentro del contenido de una página va **un solo momento de conversión**, al
final: un CTA primario (WhatsApp) y como mucho uno secundario (correo).
Repetir el mismo botón a media página no aumenta conversión, cansa y le resta
peso al cierre. Un CTA intermedio solo se justifica si ofrece una acción
**distinta** a la del cierre.

---

## 5. Imágenes: cuándo responden al cursor

Regla: **una imagen solo reacciona si lleva a algún lado.** Un cursor de lupa o un
acercamiento al pasar el mouse son promesas; si al hacer clic no pasa nada, el
usuario siente que algo se rompió.

| Clase | Comportamiento | Cuándo |
|---|---|---|
| `.media` | Estática. Sin cursor especial ni hover | Imagen decorativa que no es enlace |
| `.zoom-frame` | Acerca la imagen levemente al pasar el cursor | La imagen **es** un enlace (cards de categoría y pieza) |
| `.cursor-zoom` | Cursor de lupa | **Reservado para galerías con lightbox.** No usar donde no abra nada |

Hoy `.cursor-zoom` está definida pero sin usar: entra cuando existan las galerías
del detalle de pieza y del detalle de proyecto.

## 5. Nada se mueve debajo del dedo

**Un bloque que se desplaza mientras alguien lo está tocando se lleva el toque
por delante**: el navegador descarta el clic porque el destino se movió, y hace
falta tocar dos veces. Es la causa de casi todos los "no me responde al primer
toque" que salieron en las pruebas.

Por eso:

- **La entrada al hacer scroll solo sube en bloques sin nada que tocar dentro.**
  Los que llevan un enlace o un botón solo aparecen. Quién puede subir lo decide
  el script del layout mirando el contenido, así que se mantiene solo.
- **La burbuja de WhatsApp solo se desvanece**, no entra subiendo.
- **Los anillos y pulsos decorativos llevan `pointer-events:none`.** Si crecen y
  son hijos de un botón, la zona que recibe el dedo late con ellos y el mismo
  punto de la pantalla a veces contesta y a veces no.

## 5a. Zonas de toque: 44 px

**Todo lo que se toca mide al menos 44 px de alto en teléfono.** Es la medida de
un dedo, y por debajo de ahí el primer toque se va al elemento de al lado y hace
falta un segundo. Ha pasado ya con el logotipo del encabezado, el enlace a
proyectos de la cabecera de un caso, el enlace a la categoría de la ficha, el
"explora el catálogo" de nosotros, el "leer más" de un proyecto y los puntos del
carrusel de zonas.

El texto no se mueve de sitio: lo que crece es la caja que recibe el dedo.

- Enlaces y botones sueltos: `min-height:44px` con `display:inline-flex` y
  `align-items:center`, y `min-height:0` de 900 para arriba.
- Controles pequeños que no pueden crecer, como un punto de 7 px: un
  pseudoelemento transparente con `inset` negativo les agranda la zona sin
  tocar el dibujo.
- **La excepción son los enlaces dentro de un párrafo**, que no pueden crecer
  sin romper el renglón. La norma de accesibilidad los exime por eso mismo.

Se revisa midiendo, no a ojo: hay que recorrer `a[href]` y `button` de cada
página y comprobar el alto de su caja. **Ojo con los bloques que entran con
animación**: si se miden antes de que el observador les ponga `.in` están en
opacidad cero y se saltan. Hay que forzar la clase antes de medir, o el repaso
deja huecos.

## 5a bis. Los puntos de un carrusel: ventana de cinco

Un carrusel no pinta un punto por diapositiva cuando hay muchas. **La fila se
topa en cinco ranuras** y se convierte en una ventana que se corre, con los
puntos de los extremos encogidos para decir que hay más de ese lado:

```
·  ∙  ▬▬  ∙  ·
```

- Hasta cinco zonas se pintan todas, sin encoger.
- Con más, la ventana se corre para dejar el activo al centro y se frena en los
  extremos: en la primera el activo va a la izquierda, en la última a la
  derecha.
- Solo se encoge el punto del borde que **todavía tiene zonas más allá**. Al
  llegar al final, ese lado deja de encogerse.
- El encogido conserva su ranura y solo se dibuja más chico, así que **la fila
  mide siempre lo mismo**: 76 px. Importa porque el pie de foto comparte
  renglón con los puntos y tiene reservado ese ancho exacto; si la fila creciera
  con cada zona nueva, el texto bailaría o acabaría debajo.
- Cinco y no tres porque con tres solo caben vecino, activo y vecino, y no queda
  sitio para el encogido, que es justo el que avisa de que la fila sigue.

Vale igual en teléfono, tablet y escritorio: no hay ningún punto de corte de por
medio. En escritorio además están las flechas.

## 5b. Carruseles: el dedo primero

Todo carrusel del sitio se pasa deslizando. Las flechas son un extra para el
cursor, nunca el único camino.

**La condición es siempre la misma:**

```css
@media (hover:hover) and (pointer:fine) and (min-width:900px){ … }
```

Las tres partes hacen falta. `hover:hover` y `pointer:fine` solos bastan para un
teléfono de verdad, pero **no para una ventana angosta en escritorio**: ahí el
navegador sigue diciendo que hay cursor y la flecha aparece encima del
contenido, en un carrusel que a ese ancho ya se lee como táctil.

Hoy la cumplen las tres que existen: `.pz-flecha` (fotos de la card),
`.mb-cats-flecha` (categorías del listado) y `.rail-btn` (cabeceras de sección).

Lo que sí va en todos los anchos: el degradado de `rail-mask`, que avisa que hay
más contenido, y el acercamiento de la foto al pasar el cursor, que no tapa nada.

## 6. Video y ritmo visual

Referencia: la página de "Artesanía y calidad" de BoConcept y su home.

**Componente `VideoFrame.astro`.** Video ambiental: sin sonido, en bucle,
`playsinline`, con póster de respaldo. Solo reproduce **mientras está en
pantalla** (IntersectionObserver), para no gastar batería ni datos. Lleva un
**botón de pausa** circular translúcido abajo a la derecha, como el del hero de
BoConcept. Si el sistema pide reducir movimiento, no arranca y se queda en el
póster; si el usuario pausa a mano, el observador deja de reanudarlo.

Optimización: sin pista de audio, 1280px de ancho, CRF 30 y `+faststart`.
Referencia de peso: 12 segundos en 461 KB.

**Video y texto enfrentados.** Cuando el video es el protagonista del bloque,
no se rodea de más imágenes: ocupa la mitad (cuadrado, `ratio="1/1"`) pegado al
borde del contenedor, y en la otra mitad van título, párrafo y un link de texto,
centrados verticalmente contra él. En móvil el texto va primero y el video
debajo. Referencia: la página de "Artesanía y calidad" de BoConcept.

Se probó antes un mosaico de varias fotos con desfases verticales y se
descartó: con una sola pieza fuerte el bloque se lee mejor y no compite con el
video.

**Cierre de página.** El bloque de conversión va sobre foto, con antetítulo en
serif que entra con `.rise`, el título en `t-h1` partido en dos `.paint-line`
escalonadas con `--i`, y los CTA con `.fade-in`. La secuencia arranca cuando el
bloque entra en pantalla (`.in-view` pone `--play:running`).

**Documentos legales (`LegalDoc.astro`).** Lo único que se pliega es el bloque
de **Contenido**, y solo en móvil, donde una docena de títulos ocupa media
pantalla antes de llegar al documento. En escritorio queda abierto y fijo al
costado, con su cabecera convertida en rótulo (`pointer-events:none`).

**El texto del documento nunca se pliega**: va corrido, sin líneas divisorias ni
controles. Un texto legal se lee, se busca con Ctrl+F y se imprime; esconderlo
tras acordeones estorba más de lo que ayuda.

El plegado del índice lo aplica el script **después del render**: el HTML sale
con el índice abierto, así los enlaces están en el DOM y la página funciona sin
JavaScript.

**Acordeones.** `<details>` no anima su alto: se abre y se cierra de golpe. Se
toma el control del clic del `<summary>` con `preventDefault()` y se anima la
caja de la respuesta entre 0 y su `scrollHeight` con la Web Animations API. Al
cerrar, el `open=false` se aplica en el `onfinish`, si no el contenido
desaparecería antes de encogerse. El respiro inferior vive en el párrafo, no en
la caja, para que no quede colgando cuando el alto llega a cero.

**Dosis.** El movimiento se usa donde aporta, no en cada sección. Como mucho un
video por página: hoy el home lo tiene en el bloque editorial y Nosotros en
"Lo que nos define".

**Pantallas de un solo mensaje.** La 404 y la página de gracias van a pantalla
completa sobre foto, sin footer (`hideFooter`) y con `data-hides-fab`: ahí solo
hay una cosa que decir y dos salidas, así que nada más debe competir. La imagen
es una textura tranquila, sin objetos que distraigan, y el velo es radial porque
el texto va centrado.

**Excepción: contacto no lleva hero.** Es la única página cuyo trabajo es una
tarea y no una lectura: quien llega ya decidió escribir. Una foto a pantalla
completa solo retrasa el primer campo, y en móvil lo empuja fuera de la primera
pantalla. La consistencia se sostiene con la tipografía, el color y el espaciado;
un sistema aguanta una excepción deliberada donde el trabajo de la página
cambia. La foto se conserva como imagen de Open Graph, que sí sirve al
compartir el enlace.

**Cabecera de página interior: `PageHero.astro`.** Imagen recuadrada con
antetítulo y título centrados encima sobre un velo radial. Es el mismo bloque en
todas las páginas interiores, así que vive en el componente y no repetido en
cada página. Props: `image`, `alt`, `eyebrow`, `titulo` (arreglo de líneas, cada
una se pinta escalonada con `--i`) y `size` (`display` para el título grande,
`h1` para el normal). El recorte cambia con el ancho: 3/4 en móvil, 16/9 en
tablet y 21/9 en escritorio.

Ojo al montar el título por líneas: hay que emitir el espacio entre los `<span>`
de forma explícita (`<Fragment set:html="&#32;" />`), porque si no Astro lo
colapsa y el texto indexable queda pegado.

**Cuidado con `.container` + `max-width`.** `.container` lleva márgenes
automáticos, así que ponerle encima un `max-width` no lo estrecha por la
derecha: lo **centra**. Si un bloque tiene que ser más angosto, el `max-width`
va en los textos de dentro, nunca en el `.container`.

**Dónde NO va el video.** No en el hero, porque es el elemento LCP y cargarlo
ahí degrada la métrica salvo que el póster siga siendo el LCP. Tampoco detrás
de un CTA, porque le resta foco al botón, ni en el bloque de proyecto, porque
los hotspots se posicionan por coordenadas sobre una imagen fija.

### Header

**Fondo blanco sólido, nunca cristal esmerilado.** El difuminado se reservó para
los overlays; en la barra fija ensuciaba el contenido que pasa por debajo. La
separación la da una línea de 1px con `--line`, que basta.

Tres estados:
1. **Sobre el hero**: transparente, logo y navegación en blanco.
2. **Con scroll**: blanco sólido y línea.
3. **Con el panel de categorías abierto**: blanco sólido, aunque no haya scroll.
   Si no, queda un hueco transparente por el que se ve la foto del hero.

**El panel de categorías** solo existe en escritorio; en móvil manda el menú
lateral. **No va a sangre**: es una tarjeta contenida de 1040px centrada bajo la
navegación. A ancho completo quedaba un vacío enorme a la derecha del bloque de
apoyo.

Dentro: dos columnas de tarjetas con miniatura y nombre, empezando por "Todos
los muebles" con la misma etiqueta que en móvil, y a la derecha un bloque con
imagen y botón. Un menú no tiene por qué ser solo una lista de enlaces: ese
hueco puede llevar a un proyecto o a una guía.

**Todas las filas del menú móvil tienen el mismo tamaño.** Existía un
modificador que achicaba una sola entrada y lo único que lograba era parecer un
error. Si una entrada merece menos peso, no va en la lista principal.

Ojo con la especificidad: la regla del modo transparente es
`.hd.overlay:not(.scrolled):not(.mega-abierto)`. Sin la última exclusión, el
logo sale blanco sobre blanco cuando se abre el panel.

## 7. Superficies y overlays

- Fondo del sitio: `--white`. Secciones alternas: `--paper`.
- Radio: `--radius` (12px) en media y contenedores, `--radius-sm` (8px) en elementos chicos.
- **Todo overlay difumina el fondo**: clase `.scrim` (blur 16px + velo tenue).
  Nunca solo oscurecer.

---

## 8. Movimiento

- Curva: `--ease` = `cubic-bezier(.22,.61,.36,1)`. Las animaciones de entrada usan
  `cubic-bezier(.25,.1,.5,1)`.
- `.paint-line`: el texto se pinta desde el centro (efecto de entrada de titulares).
  Escalonar con `--i`.
- `.rise`: sube 15px con fade. `.fade-in`: solo fade.
- Control con `--play` (`paused`/`running`): el hero corre al cargar, los bloques
  de abajo esperan a entrar en pantalla.
- Todo respeta `prefers-reduced-motion`.

---

## 9. Reglas de contenido

- **Nunca usar guion largo () en texto visible.**
- Textos alineados a la izquierda en móvil.
- Los CTA dicen la acción concreta ("Cotizar cafeterías"), no genéricos ("Ver más").
