# Arquitectura del sitio

Cómo está armado el front. Si vienes a conectar WordPress, lee primero
[wordpress.md](wordpress.md) y usa este como referencia.

---

## 1. Qué es esto

Un sitio **estático** hecho con Astro 7. No hay servidor, no hay base de datos
en producción, no hay JavaScript de framework: se compila a HTML y se publica la
carpeta `dist/`.

```bash
npm install      # una vez
npm run dev      # servidor local en http://localhost:4321
npm run build    # compila a dist/
npm run preview  # sirve dist/ para revisarlo antes de publicar
npm run revisar  # revisa dist/ (ver el apartado 8)
```

Node 22.12 o superior.

---

## 2. El árbol

```
src/
├── data/          el contenido. Es lo que se conecta a WordPress
├── layouts/       Base.astro: cabeza, encabezado, pie y capas comunes
├── components/    piezas reutilizables
├── pages/         una por ruta; los corchetes generan varias
└── styles/        global.css: las variables de diseño

public/
├── img/           fotos
│   ├── cats/      una por categoría
│   ├── products/  fotos de pieza (hoy son demostraciones)
│   └── nosotros/  las de la página de nosotros
├── video/         clips y sus carteles
├── fichas/        PDF de ficha técnica
└── favicon.*

docs/              toda la documentación
```

---

## 3. Las páginas

| Archivo | Ruta | Cuántas |
| --- | --- | --- |
| `index.astro` | `/` | 1 |
| `muebles/index.astro` | `/muebles/` | 1 |
| `muebles/[categoria].astro` | `/muebles/{categoria}/` | 8 |
| `muebles/[categoria]/[pieza].astro` | `/muebles/{cat}/{pieza}/` | 26 |
| `proyectos/index.astro` | `/proyectos/` | 1 |
| `proyectos/[proyecto].astro` | `/proyectos/{slug}/` | 4 |
| `nosotros.astro` | `/nosotros/` | 1 |
| `contacto.astro` | `/contacto/` | 1 |
| `preguntas-frecuentes.astro` | `/preguntas-frecuentes/` | 1 |
| `gracias.astro` | `/gracias/` | 1, sin indexar |
| `aviso-de-privacidad.astro` | `/aviso-de-privacidad/` | 1, sin indexar |
| `terminos-y-condiciones.astro` | `/terminos-y-condiciones/` | 1, sin indexar |
| `404.astro` | `/404/` | 1, sin indexar |
| `sitemap.xml.js` | `/sitemap.xml` | se genera |
| `robots.txt.js` | `/robots.txt` | se genera |

48 páginas HTML, 44 indexables.

Las rutas con corchetes usan `getStaticPaths()`, que recorre las listas de
`src/data/`. Agregar una pieza al arreglo agrega su página, su entrada en el
mapa del sitio y sus enlaces, sin tocar nada más.

---

## 4. `Base.astro`, el molde

Todas las páginas lo envuelven. Recibe:

| Propiedad | Para qué |
| --- | --- |
| `title`, `description` | Etiquetas de la cabeza y Open Graph |
| `image` | La foto que se ve al compartir el enlace |
| `noindex` | `true` en las páginas que no deben indexarse |
| `schema` | Un objeto JSON-LD, o varios |
| `overlayHeader` | El encabezado va encima de la foto, sin fondo |
| `hideFooter` | Sin pie, para el 404 |

Y resuelve solo: canónica con diagonal final, `robots` explícito, Open Graph,
Twitter, el JSON-LD de `Organization` en todas las páginas, el encabezado con su
panel de categorías, el menú de teléfono, el pie, la burbuja de WhatsApp y el
observador que hace entrar los bloques al hacer scroll.

---

## 5. Los componentes

| Componente | Dónde se usa | Qué resuelve |
| --- | --- | --- |
| `Catalogo.astro` | `/muebles/` y las 8 categorías | Cuadrícula, filtros, conteos y bloques editoriales |
| `PiezaCard.astro` | catálogo, home, fichas, proyectos | La tarjeta de pieza, con su carrusel de fotos |
| `CategoryCard.astro` | home y `/muebles/` | La tarjeta de categoría |
| `SectionHead.astro` | home, fichas, proyectos | Cabecera de sección con las flechas del riel |
| `PageHero.astro` | nosotros, proyectos, preguntas | La foto de apertura con antetítulo y título |
| `VisorGaleria.astro` | ficha de pieza, proyecto | La galería a pantalla completa |
| `CursorAmpliar.astro` | ficha de pieza, proyecto | La pastilla "Ampliar" que sigue al cursor |
| `EscenaHotspots.astro` | home, proyectos | Foto con puntos sobre las piezas |
| `EscenasCarrusel.astro` | proyectos | Varias escenas, con su pie dentro de la foto |
| `PanelLateral.astro` | ficha de pieza | El cajón lateral de detalles |
| `CierreCta.astro` | home, proyectos | El bloque de cierre con foto de fondo |
| `VideoFrame.astro` | nosotros, ficha de pieza | Video con su cartel |
| `LegalDoc.astro` | aviso, términos | El molde de las páginas legales |
| `WaButton.astro`, `Icon.astro`, `Logo.astro` | varias | Piezas chicas |

Cuando algo se usa en dos páginas, sale a componente. Es la razón por la que
existen `VisorGaleria`, `CursorAmpliar`, `CierreCta` y `EscenasCarrusel`: los
tres primeros nacieron dentro de una página y salieron cuando una segunda pidió
lo mismo.

---

## 6. Los estilos

No hay framework de CSS. Cada componente lleva sus estilos con ámbito propio, y
`src/styles/global.css` tiene:

- **Las variables**: color, tipografía, espaciado, curvas de animación. Cambiar
  una aquí cambia el sitio entero.
- **Las utilidades compartidas**: `.container`, `.pill`, `.rail`, `.reveal`,
  `.paint-line`, `.scrim`.

Reglas que se repiten en todo el sitio y conviene conocer antes de tocar nada:

- **Todo lo que se superpone difumina el fondo** (`backdrop-filter`), no solo lo
  oscurece.
- **En táctil no hay flechas**: los carruseles se pasan con el dedo. Las flechas
  aparecen solo con `(hover:hover) and (pointer:fine)`.
- **Todas las capas cierran con animación** y con Escape.
- **Toda animación respeta `prefers-reduced-motion`.**
- El encabezado es fijo, así que cada página suma `var(--header-h)` a su relleno
  superior. No hay un espaciador global.

El detalle está en [design-system.md](design-system.md).

---

## 7. Lo que hay que saber antes de tocar el código

Cosas que costaron un rato y que no se ven leyendo:

- **Astro sube el `<script>` de un componente al lugar de la primera instancia.**
  En un riel puede quedar como primer hijo y romper las cuentas que midan
  `children[0]`. Por eso `SectionHead` ignora los hijos de ancho cero.
- **`[hidden]` pierde** contra cualquier regla del autor que declare `display`.
  Donde haga falta esconder algo con `hidden`, hay que repetirlo con
  `[hidden]{display:none !important}`.
- **`align-items:start` en una rejilla mata el `position:sticky`** de sus hijos,
  porque el padre queda solo tan alto como su contenido.
- **`.container` ya trae medida máxima y márgenes automáticos.** Ponerle otra
  medida máxima encima lo centra en vez de alinearlo al margen.
- **`.rail` trae relleno propio** para el carrusel de teléfono. Si el mismo
  elemento se vuelve rejilla en escritorio, hay que quitárselo o las tarjetas
  quedan metidas hacia dentro.
- **El servidor de desarrollo a veces sirve CSS viejo.** Si una medida no
  coincide con el código, reinícialo antes de buscar el error en otro lado.

---

## 8. Comprobaciones antes de publicar

Están automatizadas:

```bash
npm run build && npm run revisar
```

`scripts/revisar.mjs` recorre `dist/` y comprueba:

1. **Enlaces**: ningún `href` interno sin página, ninguna ancla sin destino,
   ningún archivo que no exista.
2. **Guiones largos**: ninguno en el texto visible.
3. **Palabras que no van**: fabricante, comercializadora, distribuidor,
   mayorista. Con dos excepciones declaradas: el aviso de privacidad, donde
   "proveedor" es una categoría de tercero, y las preguntas frecuentes, donde
   Neucast es el proveedor que da de alta el cliente.
4. **Un `h1` por página** y sin saltos de nivel.
5. **Título entre 30 y 65 caracteres**, descripción entre 70 y 160, en las
   páginas indexables.
6. **Canónica, etiqueta robots e idioma** en todas.
7. **Imágenes con `alt`.**
8. **El mapa del sitio** tiene exactamente las páginas indexables, ni una más ni
   una menos.

Devuelve código 1 si algo falla, así que sirve en un proceso automático. Es lo
que hay que correr en cada publicación una vez que el contenido venga del CMS.
