# Neucast: sitio de mobiliario corporativo (neucast.com.mx)

> **Design system documentado en [design-system.md](design-system.md)** (escala tipográfica,
> color, espaciado, jerarquía de botones, overlays, movimiento). Regla: ningún componente
> define tamaños de texto con `clamp()` propio; se usan las clases de nivel `.t-h1/.t-h2/.t-h3`.

Resumen de decisiones aprobadas/propuestas. Propuesta completa: https://claude.ai/code/artifact/6d27af49-cec4-43fd-8e0f-864ab7e20ed1

## Stack
- Frontend: **Astro** (estático) + GSAP/View Transitions. Dominio neucast.com.mx.
- Hosting: se barajó Vercel o Cloudflare Pages y **se decidió Hostinger**, junto
  al dominio y a WordPress, para no sumar un proveedor más. La compilación vive
  en GitHub Actions y lo que sube a Hostinger es `dist/`. Ver `despliegue.md`.
- CMS: **WordPress headless + ACF** en Hostinger (ya pagado), subdominio admin.neucast.com.mx. Webhook → rebuild automático.
- Contacto: WhatsApp (wa.me con mensaje precargado, conversión principal, evento GA4) + formulario email solo en /contacto/.
- Sin e-commerce en fase 1; escalable a WooCommerce/Stripe después.

## Identidad (Brandbook VERDE: línea muebles; el azul es el corporativo)
- Assets de marca: los brandbooks en PDF, los SVG del logotipo y los recursos los tiene el equipo aparte.
- **Los valores vigentes de color y tipografía están en [design-system.md](design-system.md)**, que
  manda sobre esta sección. En la implementación se ajustaron respecto al brandbook: la tipografía
  final es **Helvetica Neue nativa + Inter de respaldo** (para replicar BoConcept, que usa Helvetica
  Neue) con **Baskerville** en acentos editoriales, en lugar de Roboto Flex + Lora. El oliva de
  interfaz es `#78894A` (el `#8A9A5B` del brandbook no daba contraste suficiente en texto).
- Dirección: mucho blanco, minimalista tipo BoConcept (referencia: boconcept.com/es-mx), verde solo
  como acento, fotografía protagonista, carruseles, hotspots en proyectos → interlinking a producto.

## Sitemap
`/`, `/muebles/` (+ categorías: sillas-operativas, sillas-ejecutivas, escritorios, salas-de-juntas, recepciones, lounge-y-areas-comunes, cafeterias, almacenamiento; producto en `/muebles/{cat}/{prod}/`), `/proyectos/{slug}/` con hotspots, `/nosotros/`, `/preguntas-frecuentes/`, `/contacto/`, `/aviso-de-privacidad/`. Fase 2: `/ideas/` (blog SEO).

## SEO
- Keywords head: muebles para oficina / mobiliario de oficina (sinónimos, usar ambos). Categoría: sillas ergonómicas, escritorios ejecutivos, mesas sala de juntas, recepción, cafeterías. Diferenciador (menos competencia): mobiliario corporativo de diseño.
- Competidores MX (todos estética de catálogo/bodega): Ofinobel, Ofimarca, Bering, Ideark, TodoOficina, Office Depot/Max; premium: Herman Miller. Hueco: nadie con lenguaje BoConcept en oficina.
- Técnico: schema Organization/Product/BreadcrumbList/FAQPage/ItemList, sitemap auto, robots, canonicals, OG, AVIF/WebP+srcset, Search Console, ficha Google Business, sameAs a Facebook/@neucastoficial.

## Ronda de feedback 1 (24 ago 2026): aplicada
Overlay más fuerte en hero; botón Cotiza del header en verde WhatsApp al hacer scroll (glass blanco sobre hero); FAB WhatsApp rediseñada (gradiente, ping periódico, tooltip glass en hover desktop); carruseles alineados al gutter (scroll-padding-left); cards de categoría sin cursor-zoom ni flechas + controles prev/next; nombre de pieza es enlace al detalle; degradado fuerte en caption de proyectos; tabs de espacios sin sticky en desktop (sticky solo mobile) + título/sub explicativos; CTA final con imagen sillones-concreto y botón verde WhatsApp; footer rediseñado (tagline serif grande + pill WA, wordmark gigante watermark, redes en iconos); botones full-width en mobile; hotspots con coordenadas duales desktop/mobile (--dx/--dy vs --mx/--my) y contenedor .proj-canvas separado del caption; menú móvil nuevo: hoja blanca tipo app con filas de categorías (thumb+chevron) estilo BoConcept. OJO: el header con backdrop-filter es containing block de sus hijos fixed: el menú usa height calc(100dvh - header) en vez de inset.

## Ronda de feedback 2 (24 ago 2026): aplicada
Copy hero ampliado ("espacios corporativos completos: de la recepción a la cafetería"); UX anti-saturación de CTAs: la burbuja WhatsApp se oculta (IntersectionObserver + [data-hides-fab]) cuando el CTA final o el footer están en viewport; subrayado animado izq→der en nav del header; cards de categoría ahora con FOTO completa (public/img/cats/*.jpg, recortes cuadrados de resources: campo `photo` en categories, `img` sigue siendo el recorte PNG para piezas); degradado de carruseles más marcado y en AMBOS lados (el izquierdo solo aparece con scroll, clase .rail-scrolled); más degradado en caption de proyectos + FIX: caption con pointer-events:none en desktop (bloqueaba los clics a hotspots); CTA con object-position 72% (sillones completos); footer: correo visible como texto, .ft-social con margin-right 84px para no chocar con la burbuja; menú móvil = drawer lateral izquierdo (fuera del header, body-level) con scrim, top bar logo+X, drill-down "Muebles" → segunda vista con ‹Atrás y filas foto+nombre (patrón BoConcept), track 200% translateX. Logo gigante watermark del footer: Daniel aún indeciso, se queda por ahora. Generación de imágenes IA: Adobe/Canva MCP requieren OAuth (no autorizado aún): por ahora fotos de stock de resources.

## Ronda de feedback 3 (24 ago 2026): aplicada
- **Copy/SEO**: hero sub = "Mobiliario de oficina de diseño para recepciones, salas de juntas, cafeterías y áreas comunes. Envíos a todo México." (head keyword + categorías + alcance). Title SEO = "Muebles para oficina y mobiliario corporativo de diseño | Neucast". **REGLA: nunca usar guion largo () en copy visible.** Verificado: 0 en el HTML de build.
- Subtítulo de Espacios en un renglón (white-space:nowrap + font-size fluido).
- **Layout invertido** en Espacios y Editorial: texto primero/izquierda, imagen después/derecha (order en grid; desktop 1fr 1.25fr).
- CTA final: se queda alineado a la izquierda (preferencia de Daniel); en móvil object-position 64%/88% + padding-bottom 200px para que los sillones se vean completos bajo los botones. OJO: `.cta-inner` usa padding-block, hay que sobreescribir con `.cta .cta-inner` (especificidad).
- **Menú móvil**: FIX del "arrastrado" = faltaba `overflow:hidden` en `.drawer-panel` (la vista de categorías se asomaba fuera). Sin logo; header tipo app con "‹ Atrás" (solo en subvista) + X; título "Muebles" en el contenido; **sin líneas divisorias** en filas de menú ni de categorías; X se dibuja animada (dos spans con scaleX escalonado); hamburguesa se transforma en X al abrir.
- **REGLA de overlays**: clase `.scrim` en global.css: todo overlay (drawer, modal, popup, lightbox) difumina el fondo con backdrop-filter blur(16px), no solo oscurece.
- Carruseles: en móvil el degradado va **solo del lado derecho** (media query ≤899px anula el izquierdo).

## Ronda de feedback 4 (24 ago 2026): aplicada
- **Alineación de carruseles/tabs**: `.rail` usa `--rail-pad: max(var(--gutter), calc((100% - var(--container))/2 + var(--gutter)))` para alinear con el borde interno de `.container` en cualquier ancho. Verificado: título, primera card y tabs comparten el mismo left.
- **Logo**: el viewBox estaba recortando la tinta real. Medido con getBBox: x 408→1592, y 500→700. Nuevo viewBox `408 500 1184 200` y ratio 1184/200. Ahora el alto de la caja == alto visible y centra ópticamente bien con el nav.
- **Header**: `.hd-nav` con `margin-left:26px` y `gap:32px` (más aire respecto al logo).
- **Espacios (desktop)**: imagen izquierda / texto derecha (`.space-media{order:1}`); móvil mantiene texto primero. Editorial "La idea es simple" se queda al revés (texto izq/imagen der) para alternar ritmo.
- **FIX scroll horizontal en móvil** (43px): lo causaba `white-space:nowrap` en `.sec-sub` con texto largo. Se acortó el copy a "Elige un espacio y mira cómo lo trabajamos." + `overflow:hidden;text-overflow:ellipsis` como red de seguridad. También se corrigieron dos overflows menores: `.ft-mark` (márgenes negativos → padding) y `.fab-ring` (scale 1.7→1.5, right 18→22px). **Verificado: scrollWidth == clientWidth en móvil y desktop.**
- **Footer**: watermark con padding propio (ya no toca la línea del copyright); redes sociales promovidas a columna propia "Síguenos" con icono + nombre (antes escondidas en la barra inferior); correo visible cortando después del @ vía `<wbr>` + `overflow-wrap:break-word`.
- **Drawer**: ambas vistas caben sin scroll vertical (medido: scrollHeight == clientHeight a 812px). Categorías con más separación (padding 11px), thumbs 52px y más aire bajo el título "Muebles".

## Ronda de feedback 5 (24 ago 2026): aplicada
- **Hotspots**: reescritos. La tarjeta se centra sobre el punto y JS calcula `--shift` para mantenerla dentro de la imagen **y** dentro del área visible (respeta `--header-h`); si no cabe arriba, voltea abajo (`.flip`). Se eliminaron las clases fijas edge-l/edge-r. Ancho `min(228px,74vw)`. **Escritorio: abre con hover** (`mouseenter`/`mouseleave` bajo `(hover:hover) and (min-width:900px)`); móvil sigue con clic. Cierra en `resize`. Verificado: los 3 hotspots quedan dentro del canvas a 375px.
- **Animación del bloque final** replicada de BoConcept (M10ContentBanner). Receta exacta extraída de su CSS: cada línea con `background-clip:text`, `color:transparent`, `background-color:rgba(255,255,255,.3)` como estado fantasma y `background-image` blanco sólido cuya `background-size` crece de `0 100%` a `100% 100%`, `background-position:50% 0` (rellena del centro hacia afuera), 0.8s, `cubic-bezier(.25,.1,.5,1)`, escalonado 0.2s por línea. Eyebrow sube con fade (delay 1s) y los CTAs aparecen (1.15s). Se dispara con IntersectionObserver que cambia `--play` de `paused` a `running`. **`width:fit-content` en las líneas** para que la caja del fondo abrace el texto y no el contenedor.
- **CTA móvil**: `object-position:57% 88%` + padding-bottom 210px → los sillones se ven centrados y completos.
- **Logo móvil**: se centra en la barra (patrón BoConcept) con `position:absolute;left:50%`, tamaño `clamp(17px,4.8vw,21px)`. En ≤360px el botón Cotiza se reduce a solo ícono para no invadirlo. Verificado sin colisión ni overflow a 320/360/375px.

## Ronda de feedback 6 (24 ago 2026): aplicada
- **Animaciones refactorizadas a utilidades globales** (`.paint-line`, `.rise`, `.fade-in` en global.css) con `--play` (paused/running), `--delay` e `--i`. El hero corre al cargar (`.hero-content{--play:running}`); el bloque final espera al IntersectionObserver. Se eliminó el CSS duplicado del CTA.
- **Hero animado**: H1 en 2 `.paint-line` (pintado centro-afuera, escalonado), eyebrow con `.rise` a .85s, subtítulo y botones con `.fade-in` a 1s/1.12s. OJO: `.hero-sub` tenía `opacity:.92` propia que ganaba por especificidad a `.fade-in{opacity:0}` → se movió el matiz al `color:rgba(...)`. H1 móvil bajó a `clamp(31px,...)` para que cada línea quepa entera (antes partía en 4 renglones).
- **Burbuja WhatsApp**: el hero también lleva `data-hides-fab`, así no aparece de inicio (ya hay Cotiza en header + "Cotiza tu proyecto"); entra al pasar el hero. Arranca con `.fab-hidden` en el HTML para evitar parpadeo; si una página no tiene targets, se muestra.
- **Logo móvil**: alineado a la izquierda junto a la hamburguesa (se quitó el centrado absoluto). Se eliminó el fallback de botón solo-ícono: a 320px caben logo + "Cotiza" con 41px de aire.
- **Decisión UX botón header**: se mantiene ícono + texto "Cotiza". Un ícono suelto de WhatsApp se lee como red social/compartir, no como acción de cotizar.
- **Watermark del footer**: `padding-inline:var(--gutter)` para que respete márgenes (antes se veía apretado/cortado en móvil).

## Ronda de feedback 7 (24 ago 2026): aplicada + DESIGN SYSTEM formalizado
Daniel preguntó si ya había design system. Respuesta honesta: **no del todo**. Había tokens de
color/tipografía/motion pero **cada componente inventaba su propio `clamp()` de tamaño**, y eso
causaba bugs reales (medido: el "h3" de Espacios y el "h2" de sección medían ambos 24px, y el
"h2" del CTA medía 30px). Se formalizó en `global.css` + `docs/design-system.md`:
- Escala fluida con jerarquía garantizada en todo ancho: `--fs-display/h1/h2/h3/h4/body-lg/body/sm/xs/2xs`
  y clases `.t-display/.t-h1/.t-h2/.t-h3/.t-h4`. `.display` ya **solo** define peso/tracking, no tamaño.
  Verificado en móvil: 31 > 27 > 25 > 20.
- Escala de espaciado `--space-1..8`, `--section-y`, `--block-y`.
- Jerarquía de botones documentada: `.pill--wa` (conversión) / `.pill--primary` (principal en claro) /
  `.pill` (principal sobre foto) / `.pill--ghost` (secundaria en claro) / `.pill--glass` (secundaria sobre foto).
- Saltos de línea: `.t-display` usa `balance`; `.t-h1/h2/h3` usan `pretty` (llenan el renglón).

Bugs corregidos en la misma ronda:
- **Descendentes cortados (la "g")**: con `background-clip:text` el texto visible es el fondo, y la caja
  del fondo la define el line-height, así que la cola de la g quedaba fuera. Fix: `padding-bottom:.16em`
  + `margin-bottom:-.16em` en `.paint-line` (agranda la caja sin mover el layout). Verificado: 7px de holgura.
- **Botón en iPad con texto a la izquierda**: `.pill` no tenía `justify-content`; al estirarse a ancho
  completo en el drawer el contenido quedaba pegado a la izquierda. Fix: `justify-content:center` en `.pill`.
- **Tabs sin degradado**: se les añadió `.rail-mask` + `.rail-both` (excepción móvil que sí difumina a la
  izquierda al desplazarse, porque ahí lo cortado es la pestaña anterior).
- Cortes de línea: "Amueblamos cada rincón / de tu empresa" (antes partía en "cada"), CTA a 2 renglones
  ("Tu oficina nueva" / "empieza con un mensaje") y tagline del footer a 2 renglones. Para el CTA hubo que
  quitar el gutter duplicado (`.cta` ya tiene margen propio + `.container` interno repetía el padding).

## Ronda 8 (24 ago 2026): limpieza, componentes y 404
- **Limpieza**: se borraron 5 imágenes sin usar (~1.4 MB), `src/assets-logo-alterno.svg` y los `.DS_Store`.
  Imágenes recomprimidas y hero redimensionado a 1920px: de 6.1 MB a **4.2 MB**.
- **Nombres SEO**: los PNG de producto pasaron de numéricos (`1244742.png`) a descriptivos
  (`silla-ejecutiva-aria.png`). Todos los `alt` son ahora campos editables en `src/data/site.js`
  (así el cliente los controlará desde el CMS). Verificado: 36 imágenes, 0 rotas, 0 sin alt.
- **Componentes reutilizables** en `src/components/`: `Icon`, `WaButton`, `SectionHead`,
  `ProductCard`, `CategoryCard` (+ `Logo` que ya existía). La home se refactorizó para usarlos
  y se eliminó el CSS duplicado. Las siguientes páginas parten de estos.
- **404 lista** (`src/pages/404.astro`): usa la animación de pintado, propone ir al inicio,
  cotizar por WhatsApp y 4 categorías; rejilla decorativa que se arma al cargar (solo ≥1100px).
- **Buscador: descartado en fase 1** (catálogo chico). Si más adelante se necesita → Pagefind
  (índice estático en el build, sin servidor ni costo). Documentado en `pendientes.md`.
- Nuevo `docs/pendientes.md` con el mapa de páginas faltantes, la política de imágenes y el
  checklist previo a publicar.

## Ronda 9 (24 ago 2026)
- Subtítulo del hero a **dos renglones en escritorio** (`max-width` de 44ch a 60ch).
- **404 rediseñada**: fuera la rejilla decorativa. Ahora es foto a pantalla completa
  (`404-muro-luz.jpg`, el muro con haz de luz y sillones) con degradado, header en modo overlay,
  antetítulo "Error 404 · Página no encontrada", el título con la animación de pintado
  ("Esta página / se quedó sin amueblar"), copy nuevo y **un solo CTA: "Volver al inicio"**.
  Se quitó la sección de categorías. Lleva `data-hides-fab` para que la burbuja no compita
  con el único botón.
- NOTA de entorno: el HMR de Astro no refresca los estilos de la 404 (se sirve con status 404);
  si se editan sus estilos hay que **reiniciar el dev server** para verlos.

## Ronda 10 (24 ago 2026): ajustes 404
- **Footer fuera de la 404.** Se añadió la prop `hideFooter` al layout. Razón: el menú del header
  ya da toda la navegación (categorías incluidas), así que el usuario no queda atrapado, y un
  footer de ~760px después de un mensaje de error rompe la composición a pantalla completa.
  Esto además elimina el hueco blanco que aparecía entre la imagen y el footer (venía del
  `margin-top` del footer). Verificado en build: index 1 footer, 404 sin footer.
- Copy acortado: "La dirección que buscas no existe o cambió de lugar." (un renglón en escritorio).
- Antetítulo: pasó de `.serif-eyebrow` con "Error 404 · Página no encontrada" a `.overline`
  con solo **"Error 404"**. El serif chico sobre foto se leía sin intención; el overline
  (mayúsculas, tracking) sí lee como etiqueta deliberada. Se le puso blanco al 72% porque el
  oliva del token no contrasta sobre la foto. Se quitó "Página no encontrada" por redundante
  con el título (esa frase se conserva en el `<title>` para buscadores).

## Ronda 11 (24 ago 2026): afordancias de imagen
Daniel notó que las imágenes de "Amueblamos cada rincón" y "La idea es simple" mostraban cursor
de lupa pero al hacer clic no pasaba nada. **De acuerdo, y se fue más allá**: además del cursor
se quitó el acercamiento al hover, porque también promete interacción en una imagen que no es
enlace. Nueva regla en el design system (sección 5):
- `.media` → imagen decorativa, estática (Espacios y Editorial).
- `.zoom-frame` → solo si la imagen ES enlace (cards de categoría y pieza). Conserva el acercamiento.
- `.cursor-zoom` → queda definida pero **sin usar**; se reserva para las galerías con lightbox del
  detalle de pieza y de proyecto, que es justo donde Daniel la quiere.
Verificado: transition-duration 0s en las decorativas, 1.1s en las que son enlace.

## Ronda 12 (24 ago 2026): hotspot inalcanzable
La tarjeta del hotspot se cerraba antes de poder hacer clic en "Cotizar". **Causa:** hay 12px de
hueco entre el punto y la tarjeta; ese hueco no pertenece a `.spot` ni a la tarjeta, así que al
cruzarlo disparaba `mouseleave` y se cerraba. La tarjeta **ya era un solo `<a>`** (todo el card
lleva a WhatsApp), el problema era de alcance, no de clic. Solución doble:
- `.spot-card::before` = puente invisible de 16px que cubre el hueco (se invierte con `.flip`).
- Margen de gracia de 160ms en `mouseleave`, cancelable al volver a entrar.
Verificado con movimiento de cursor real: la tarjeta sigue abierta al cruzar el hueco,
`elementFromPoint` sobre "Cotizar" devuelve el enlace, y al alejarse cierra (0 abiertas).

## Ronda 13 (22 sep 2026): Nosotros y Preguntas frecuentes
- **Entorno**: `node_modules` estaba corrupto (la carpeta de astro pesaba 952 KB en vez de 6.7 MB),
  lo que colgaba `astro dev` y `astro build` sin imprimir nada. Resuelto con `npm ci`.
  Después se actualizó Astro 7.2.6 → 7.3.4 sin cambios en el código del sitio.
- **`CLAUDE.md` desactualizado**: indica `astro dev --background` y `astro dev stop/status/logs`,
  comandos que **no existen** en Astro 7.x (verificado contra `astro --help`). Pendiente corregirlo.
- **SEO por página en el layout**: nuevas props `image`, `noindex` y `schema`. Base.astro ahora emite
  canónica, Open Graph completo, Twitter Card y bloques JSON-LD.
- **/nosotros/**: estructura calcada de la página "Acerca de" de BoConcept (hero con imagen inset y
  texto centrado, manifiesto, tres pilares con foto vertical, bloque de proceso, cifras y cierre).
  Schema: Organization + AboutPage + BreadcrumbList.
- **/preguntas-frecuentes/**: 15 preguntas en 4 temas, con índice lateral pegajoso y acordeón
  exclusivo (solo una abierta por tema). Schema **FAQPage**, que es lo que permite que las preguntas
  salgan desplegadas en Google. Las preguntas están redactadas como las buscaría una persona
  ("¿cuánto tarda la entrega...?", "¿hacen envíos a todo México?").
- **FIX de accesibilidad y SEO**: Astro colapsaba el espacio entre los `<span class="paint-line">`,
  así que el texto de los H1 quedaba pegado ("Espacios de trabajo**que** la gente disfruta"). Se
  insertó `{' '}` explícito en las 4 páginas. Verificado en el HTML de build.
- Imágenes de stock de Pexels, recortadas y optimizadas (hero de 1920px en 143 KB). Origen
  documentado en `pendientes.md`.
- Enlaces del header/footer/menú ya apuntan a `/nosotros/` y `/preguntas-frecuentes/`.

## Ronda 14 (22 sep 2026): ajustes a Nosotros
- **Cifras inventadas eliminadas.** El bloque decía "8 categorías / 32 estados / 100% de los
  proyectos": datos que yo inventé y que Neucast no tiene confirmados. Se reemplazó por una
  declaración de marca en serif ("Un espacio bien amueblado no se nota. Se nota el que no lo está").
  **Regla: no inventar métricas.** Si más adelante hay datos reales (años operando, proyectos
  entregados, clientes), ahí va el bloque de cifras.
- **Copy**: se quitó una frase que hablaba del origen de las piezas e invitaba a comparar con
  otras marcas. Sustituida por el argumento de que cada área pide algo distinto y por eso se
  trabaja por proyecto. También se reescribió el pilar "Selección", que decía
  "por cómo se comportan a los tres años" (confuso), ahora habla del uso diario concreto.
- **Hero**: imagen nueva (Pexels 35058546, lounge corporativo cálido con madera y piel) porque la
  anterior no comunicaba nada. Texto ahora **centrado dentro de la imagen** (flex centrado en vez de
  anclado abajo) con velo radial para contraste parejo. Recorte 3/4 en móvil para que el título
  respire, 21/9 en escritorio.
- **Anchos**: `.ns-centro` pasó de 62ch (~500px) a 880px, de modo que la entradilla cae en **dos
  renglones** y el subtítulo de "Cómo trabajamos" en **uno**. Los párrafos quedaron en 680px:
  más anchos que antes sin volverse incómodos de leer.

## Ronda 15 (22 sep 2026): reposicionamiento de Nosotros
- **Error de posicionamiento corregido.** El copy afirmaba "trabajamos por proyecto y no por pieza
  suelta", lo cual es **falso**: Neucast también vende piezas individuales. Reescrito todo el
  manifiesto con el posicionamiento correcto: mobiliario de diseño **desde una pieza hasta el
  equipamiento de un inmueble completo**.
- **Alcance ampliado**: ya no se limita a oficinas. El foco sigue siendo el espacio corporativo,
  pero el texto abre a hotelería, espacios comerciales e institucionales (coherente con la visión
  del brandbook, que apunta a varios sectores). Title y description actualizados.
- **Pilares reenfocados**: Selección/Proyecto/Entrega → **Criterio / Escala / Respaldo**. "Escala"
  es el que resuelve explícitamente que atienden tanto una silla como un corporativo entero.
- **Bloque de proceso reemplazado** por "Dos caminos, la misma atención": una columna para comprar
  una pieza y otra para encargar un proyecto. Sustituye los tres pasos rígidos que no convencían y
  de paso comunica el doble modelo de venta.
- **Hero de nuevo**: la imagen anterior (Pexels 35058546) tenía un timón de barco en la pared.
  Ahora es Pexels 9203451, un lobby corporativo con sillones de piel, sofá modular y mesas de
  diseño. Master 4:3 que sirve para el recorte 21/9 de escritorio y el 3/4 de móvil.

## Ronda 16 (22 sep 2026): voz de marca: el mobiliario es de Neucast
**Regla de copy para todo el sitio:** el mobiliario se presenta como **propio de Neucast**. El
origen de la pieza simplemente no se aborda. Se habla de "nuestro catálogo", "nuestro mobiliario",
"nuestras piezas".

Términos **prohibidos** en copy visible: comercializadora, fabricante, proveedor, distribuidor,
"marcas distintas", "de su fabricante". Se comprueba sobre `dist/` con `npm run revisar`.

Cambios concretos:
- Manifiesto de Nosotros reducido a **dos párrafos** (antes tres) y reescrito. Entradilla nueva
  ("Nuestro mobiliario da forma a los espacios...") que cae en **dos renglones**.
- Pilar "Criterio": hablaba del respaldo de un tercero; ahora habla del estándar propio.
- FAQ: la garantía se redactó como "Toda pieza cuenta con garantía contra defectos de
  fabricación". También se quitó "precio inflado de catálogo" y el alt del almacén que
  decía "distribución".

## Ronda 17 (22 sep 2026): voz BoConcept y saturación de CTAs
- **Registro de marca alineado con la página "Acerca de" de BoConcept**, a petición de Daniel.
  Patrón que replicamos: apertura con verbo y beneficio humano ("Creamos espacios corporativos
  que mejoran la manera en que las empresas trabajan, se reúnen y reciben"), lenguaje de valores
  en vez de operación, y posesión total del producto.
- **Pilares reconvertidos de operativos a cualidades**: Criterio/Escala/Respaldo → **Forma /
  Materia / Propósito**, espejo de Forma/Sensación/Funcionalidad de BoConcept. La cabecera pasó a
  "El ADN de nuestro mobiliario".
- **"Cómo comprar" eliminado.** En una página de marca no va un flujo de compra; BoConcept no lo
  tiene. Se reencuadró como "Nuestro alcance: de una pieza a un espacio completo", que comunica el
  doble modelo (pieza suelta / proyecto) como capacidad de marca y no como instructivo.
- **Saturación de CTAs corregida.** La página tenía **7 enlaces a WhatsApp**. Se eliminó el CTA
  intermedio; el contenido ahora tiene **un solo momento de conversión** al cierre (WhatsApp +
  correo). Header, menú, footer y burbuja siguen siendo chrome permanente. Regla documentada en
  `design-system.md`.

## Ronda 18 (22 sep 2026): video y grids asimétricos
Daniel pidió que el sitio se sintiera "vivo", con imágenes grandes y video, tomando como
referencia la página "Artesanía y calidad" de BoConcept y su home. Alcance acordado en Nosotros:
**hero, párrafos y sección ADN se quedan como están**; se rehicieron los tres bloques finales.

- **Componente `VideoFrame.astro`**: video sin sonido, en bucle, `playsinline`, con póster.
  Reproduce solo mientras está en pantalla y trae botón de pausa translúcido abajo a la derecha
  (mismo patrón que el hero de BoConcept, verificado en su sitio). Respeta `prefers-reduced-motion`
  y, si el usuario pausa a mano, el observador ya no lo reanuda.
- **Video**: Pexels 8347237, procesado con ffmpeg (sin audio, 1280px, CRF 30, +faststart).
  **461 KB / 12 s.** Póster de 39 KB.
- **"Lo que nos define"** pasó a grid asimétrico de 12 columnas: el video ocupa las dos filas de
  la izquierda y a la derecha se apilan el texto y una foto desfasada. Para que no quedara un hueco
  blanco, el video usa `grid-row:1/3` + `align-self:stretch` en vez de una proporción fija.
- **La banda de la frase se fusionó con el cierre**: ahora la frase va en serif grande sobre la
  imagen del cierre, junto a un único momento de conversión. Se eliminó el bloque "Empecemos" y la
  banda oscura suelta, que sumaban dos secciones de relleno.
- Patrón documentado en `design-system.md` (sección 6), incluida la regla de dosis: como mucho un
  video por página.

## Estado al cierre del 24 ago 2026

**Home, 404, Nosotros y Preguntas frecuentes terminadas.** Doce rondas de feedback aplicadas y verificadas
en navegador (desktop, tablet, móvil 375 y 320px). Build limpio: 2 páginas, sin scroll horizontal,
sin guiones largos, 36 imágenes sin rotas y todas con alt.

Arrancar el proyecto: `npm run dev` (puerto 4321). El dev server quedó apagado al cerrar la sesión.

Secciones de la home: hero animado, carrusel de categorías, carrusel de piezas, proyecto con
hotspots, tabs de espacios, bloque editorial, CTA final animado y footer.

**Siguiente: Fase 2**, el listado de categorías (`/muebles/`), la página de
categoría y el detalle de pieza. El mapa completo de páginas faltantes está en
[pendientes.md](pendientes.md). Los componentes reutilizables ya están listos en `src/components/`
y toda página nueva parte de `src/layouts/Base.astro`.

## Fases
1. ✅ Design system + Home navegable + 404: **terminada y aprobada**
2. ⏭️ Resto de plantillas con contenido demo ← siguiente
3. WP headless + carga de catálogo real
4. SEO final, QA, performance, DNS, lanzamiento

## Pendiente confirmar con cliente
Cobertura geográfica/showroom, catálogo inicial y fotos (¿marcas nombrables?), ¿precios visibles o solo cotización?, proyectos reales disponibles, WhatsApp y correo definitivos, confirmación identidad verde.

## Auditoría de /nosotros/ (22 sep 2026)

**Código.** Se eliminaron restos de los refactors del bloque final: el import
`waLink` (WaButton arma el enlace por su cuenta), el `id="cierreNosotros"` que
no referenciaba nadie, un comentario que seguía describiendo el mosaico
asimétrico ya borrado, un `max-width:none` que ya venía heredado de `.ns-texto`
y un `margin-bottom` en móvil que se sumaba al `gap` del grid y duplicaba la
separación entre el texto y el video.

**SEO corregido.**
- La `description` medía 263 caracteres: Google corta alrededor de 160, así que
  se veía partida. Ahora mide 152 y la frase completa cabe. La versión larga se
  quedó en los datos estructurados, que no se truncan.
- Arrastraba "hotelería", que Daniel había pedido quitar en una ronda anterior.
  Era una regresión y estaba tanto en el meta como en el schema.
- El sinónimo de cabecera "muebles para oficina" no aparecía en el cuerpo; ahora
  está una vez, de forma natural, junto a "mobiliario de oficina".
- `AboutPage` gana `inLanguage`, `about` y `publisher` apuntando al `@id` de la
  Organization, para que Google una la página con la entidad de marca.

**Lo que impide el 10 y no depende de esta página.**
- `/muebles/`, `/proyectos/`, `/contacto/` y `/aviso-de-privacidad/` responden
  404. El menú, el footer y el link "Explora el catálogo" apuntan ahí.
- No hay `sitemap.xml` ni `robots.txt`.
- El contenido de la página son 258 palabras. Es razonable para una página de
  marca, pero no va a posicionar por sí sola: quien posiciona por las keywords
  de cabecera es `/muebles/` y sus categorías.

## Arquitectura del catálogo (23 sep 2026)

- **Una sola plantilla** para el listado: `Catalogo.astro`. La usan `/muebles/` y
  cada `/muebles/{categoria}/`. Cambian el título, el texto y el conjunto de
  piezas; el resto es idéntico. Cada categoría tiene su URL indexable con su
  title, description y H1, que es donde viven las keywords de categoría.
- **Una sola fuente de piezas**: `catalogo.js`. El home ya no tiene su propio
  listado: elige slugs de ahí. Antes había dos catálogos que no coincidían y el
  home enlazaba a piezas que no existían.
- **Una sola forma de URL**: `rutaPieza()` en `catalogo.js`. Antes convivían
  `/muebles/{slug}/` en el home y `/muebles/{cat}/{slug}/` en el listado.
- **Los bloques editoriales solo en el listado completo.** Dentro de una
  categoría hay pocas piezas y estorban.
- **El header abre un panel de categorías** con el mismo patrón de miniaturas del
  menú móvil, para que las dos versiones se lean como el mismo menú. Se abre con
  el cursor, con el teclado y con el primer toque en táctil.

