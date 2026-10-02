// Documento de estrategia y mapa del sitio, en PDF, con la plantilla de las
// fichas técnicas (logotipo, rótulos, A4).
//
//   node scripts/entregables/estrategia.mjs <carpeta-de-salida>            → para Mich (SEO) y Gabriela
//   node scripts/entregables/estrategia.mjs <carpeta-de-salida> --completo → versión interna de Daniel
//
// La versión para Mich y Gabriela dice a qué va el sitio, qué páginas tiene
// con sus enlaces, y qué base de posicionamiento hay ya y qué falta definir
// con el análisis de SEO. La completa agrega "Lo que sigue": cómo está hecho
// el sitio, el administrador y todo lo que debe ser administrable, métricas,
// dominio, fase 2 y lo que falta del cliente. Esa es para Daniel.
// Las direcciones apuntan a la vista previa, que es lo que se puede abrir hoy.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { ESTILOS, logo, esc } from "../fichas/plantilla.mjs";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const CHROME =
  process.env.CHROME ||
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((c) =>
    fs.existsSync(c)
  );
const salida = process.argv[2];
const completo = process.argv.includes("--completo");
if (!salida || !CHROME) {
  console.error("Uso: node scripts/entregables/estrategia.mjs <carpeta-de-salida> [--completo]  (necesita Chrome)");
  process.exit(1);
}
fs.mkdirSync(salida, { recursive: true });

const { categories } = await import("../../src/data/site.js");
const { piezas } = await import("../../src/data/catalogo.js");
const { proyectos } = await import("../../src/data/proyectos.js");

const PREVIEW = "https://danielcastro93.github.io/neucast-web";
const mes = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" }).format(new Date());
const url = (ruta) => `${PREVIEW}${ruta}`;
const enlace = (ruta) => `<a href="${esc(url(ruta))}">${esc(ruta)}</a>`;
const foto = (ruta) => "file://" + path.join(RAIZ, "public", ruta);

const ESTILOS_DOC = `
.hoja{padding-top:12mm}
a{color:#48542B;text-decoration:none}
.portada-foto{flex:1;margin-top:9mm;border-radius:3.5mm;position:relative;overflow:hidden;background:#3D3B37}
.portada-foto img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.portada-foto::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(15,15,12,.72) 0%,rgba(15,15,12,.18) 45%,rgba(15,15,12,0) 100%)}
.portada-foto .logo-grande{position:absolute;left:10mm;bottom:10mm;height:14mm;width:auto;z-index:1}
.portada-txt{padding:10mm 0 2mm}
.portada-ttl{font-size:38pt;font-weight:700;letter-spacing:-.03em;line-height:1.02;margin:3mm 0 4mm}
.portada-meta{font-size:10pt;color:#5f5e59;line-height:1.5}
.sec{margin-top:7mm}
.sec > .rotulo{margin-bottom:1.6mm;color:#48542B}
.h{font-size:19pt;font-weight:700;letter-spacing:-.02em;line-height:1.1;margin-bottom:4mm}
.h2{font-size:11.5pt;font-weight:700;margin:5mm 0 2mm}
p.t{font-size:9.2pt;color:#1D1D1B;max-width:160mm}
p.t + p.t{margin-top:2mm}
p.g{color:#5f5e59}
.dos{display:grid;grid-template-columns:1fr 1fr;gap:6mm 10mm;margin-top:3mm}
.caja{background:#F6F5F2;border-radius:2.5mm;padding:4.5mm 5mm}
.caja .rotulo{margin-bottom:1.5mm}
.caja p{font-size:8.6pt}
.caja ul.lista li{font-size:8.2pt;padding-top:1mm;padding-bottom:1mm}
.caja ul.lista li::before{top:2.8mm}
.pasos{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-top:4mm}
.paso{background:#EDECE7;border-radius:2.5mm;padding:4mm;font-size:8.2pt}
.paso .n{font-size:16pt;font-weight:700;color:#78894A;line-height:1;margin-bottom:2mm}
.paso b{display:block;margin-bottom:1.2mm;font-size:9pt}
table{width:100%;border-collapse:collapse;font-size:8.2pt;margin-top:3mm}
th{text-align:left;font-size:6.6pt;letter-spacing:.2em;text-transform:uppercase;color:#5f5e59;font-weight:500;padding:0 2mm 2mm 0;border-bottom:.3mm solid #1D1D1B}
td{padding:2.2mm 2mm 2.2mm 0;border-bottom:.25mm solid #E3E1DB;vertical-align:top}
td.b{font-weight:600}
td.u a{word-break:break-all}
.si{color:#48542B;font-weight:600}.no{color:#95948e}
.lista li{font-size:8.8pt}
.nota{margin-top:3mm;font-size:7.6pt;color:#95948e}
.aviso{margin-top:4mm;padding:3.5mm 5mm;border-left:.8mm solid #78894A;background:#F6F5F2;font-size:8.6pt}
`;

const hoja = (cab, contenido, n, total) => `
<section class="hoja">
  <header class="cab">
    ${logo("7.2mm")}
    <div class="cab-der"><p class="rotulo">${completo ? "Documento interno" : "Estrategia del sitio"}</p><p class="rotulo">${esc(cab)}</p></div>
  </header>
  ${contenido}
  <footer class="pie">
    <span><strong>neucast.com.mx</strong> · vista previa en danielcastro93.github.io/neucast-web</span>
    <span>${esc(mes)}</span>
    <span class="pag">${n} / ${total}</span>
  </footer>
</section>`;

// ---------- portada ----------
const portada = `
<section class="hoja">
  <header class="cab">
    ${logo("7.2mm")}
    <div class="cab-der"><p class="rotulo">${completo ? "Documento interno" : "Documento de trabajo"}</p><p class="rotulo">${esc(mes)}</p></div>
  </header>
  <div class="portada-foto">
    <img src="${foto("/img/hero-oficina.jpg")}" alt="">
    ${logo("14mm").replace('class="logo"', 'class="logo logo-grande"').replaceAll("#1D1D1B", "#FFFFFF")}
  </div>
  <div class="portada-txt">
    <p class="rotulo" style="color:#48542B">neucast.com.mx</p>
    <h1 class="portada-ttl">${completo ? "Estrategia, mapa del sitio y lo que sigue" : "Estrategia y mapa del sitio"}</h1>
    <p class="portada-meta">${completo ? "Versión interna. Preparado por Daniel Castro." : "Para Mich y para Gabriela. Preparado por Daniel Castro."}</p>
  </div>
</section>`;

// ---------- 01 para qué es el sitio ----------
const queEs = `
  <div class="sec">
    <p class="rotulo">01</p>
    <h2 class="h">Hacia dónde va el sitio</h2>
    <p class="t">Neucast vende mobiliario de diseño. Vende piezas y vende espacios: desde una silla suelta hasta una oficina, una sala de juntas, una cafetería o una terraza amuebladas completas. Cualquier persona puede comprar, y el sitio está hecho para que cualquiera llegue a cotizar sin ayuda.</p>
    <p class="t g">A quien más le habla es a quien está amueblando un espacio de trabajo. Esa es la compra que más vale y la que más se repite, y por eso el sitio presenta las piezas como de Neucast, enseña espacios completos y resuelve la cotización en un mensaje.</p>
  </div>
  <div class="dos">
    <div class="caja"><p class="rotulo">A quién le habla</p><p>A quien amuebla un espacio de trabajo: una empresa, una pyme, un emprendedor, un despacho de arquitectura o interiorismo, o una persona que arma su propio lugar de trabajo. También a quien busca una pieza para una terraza, una recepción o un área común.</p></div>
    <div class="caja"><p class="rotulo">Qué queremos que haga</p><p>Que cotice. En esta primera fase la comunicación va principalmente por WhatsApp, con el mensaje ya escrito desde cada pieza, cada proyecto y la lista de Mi proyecto. El formulario de correo queda para solicitudes más específicas.</p></div>
    <div class="caja"><p class="rotulo">Cómo funciona</p><p>Como una tienda en línea, pero sin pago: la persona explora, filtra, busca, arma su lista con cantidades y la manda a cotizar. En esta fase no hay pasarela de pago ni precios públicos.</p></div>
    <div class="caja"><p class="rotulo">Cómo se mide</p><p>Mensajes de WhatsApp iniciados desde el sitio, solicitudes enviadas por el formulario, listas de Mi proyecto enviadas y descargas de fichas y catálogos.</p></div>
  </div>
  <div class="sec">
    <h3 class="h2">Reglas que sostienen la estrategia</h3>
    <ul class="lista">
      <li>El mobiliario se presenta como de Neucast. No se menciona origen, proveedor ni fabricación.</li>
      <li>No se publica ninguna cifra que no esté confirmada: ni plazos, ni medidas, ni cantidades.</li>
      <li>Cada botón dice la acción concreta: "Cotizar por WhatsApp", "Descargar el catálogo", nunca "ver más".</li>
      <li>Una sola familia tipográfica, paleta de grises con el verde de la marca y fotos grandes donde el espacio lo pide.</li>
      <li>Todo está pensado para crecer a cientos de piezas sin rehacer nada: buscador, catálogos y fichas se generan solos desde los datos.</li>
    </ul>
  </div>`;

// ---------- 02 recorrido ----------
const recorrido = `
  <div class="sec">
    <p class="rotulo">02</p>
    <h2 class="h">El recorrido hasta cotizar</h2>
    <p class="t">Cada sección tiene un papel en un camino de cuatro pasos. Google y las categorías meten gente. El catálogo y el buscador la dejan explorar. La ficha y los proyectos la convencen. WhatsApp, el formulario y Mi proyecto cierran.</p>
  </div>
  <div class="pasos">
    <div class="paso"><div class="n">1</div><b>Entrar</b>Home y categorías son las puertas. Son las páginas que posicionan: cada categoría tiene su título, su descripción y su texto de entrada editables.</div>
    <div class="paso"><div class="n">2</div><b>Explorar</b>Catálogo con filtros por tipo de uso, material, color y disponibilidad. Buscador instantáneo pensado para más de 500 piezas.</div>
    <div class="paso"><div class="n">3</div><b>Decidir</b>La ficha de producto: fotos, acabados, datos principales, medidas y ficha técnica en PDF. Los proyectos instalados son la prueba de que Neucast resuelve espacios completos.</div>
    <div class="paso"><div class="n">4</div><b>Cotizar</b>WhatsApp con el mensaje ya escrito, formulario de contacto, y Mi proyecto: una lista con cantidades que se manda completa por WhatsApp o por correo.</div>
  </div>
  <div class="sec">
    <h3 class="h2">Decisiones que conviene conocer</h3>
    <ul class="lista">
      <li><b>Mi proyecto</b> funciona como un carrito sin pago. Vive en el navegador de la persona, no pide registro, y al final se convierte en un mensaje de WhatsApp o en un envío del formulario.</li>
      <li><b>Home office</b> es una página de apoyo que pidió el cliente, no una categoría. Las piezas siguen en su categoría y se marcan como aptas para home office. Si posiciona o no, lo dirá el análisis de SEO.</li>
      <li><b>Las fichas y los catálogos en PDF</b> se generan solos con una plantilla de Neucast. Nadie sube PDF a mano, así que nunca aparece la marca de un fabricante.</li>
      <li><b>Los textos de producto</b> se escriben para quien compra para un espacio de trabajo: uso, resistencia y plazos, no decoración.</li>
      ${completo ? `<li><b>Los legales</b> (aviso de privacidad y términos) están en borrador y requieren revisión del abogado del cliente antes de publicar.</li>` : ""}
    </ul>
  </div>`;

// ---------- 03 mapa: páginas fijas ----------
const fijas = [
  ["Inicio", "/", "Puerta principal: categorías, piezas destacadas, proyecto, home office, marca y cierre a cotizar.", true],
  ["Muebles (catálogo)", "/muebles/", "Todas las piezas con filtros. Enlaza el catálogo general en PDF.", true],
  ["Home office", "/home-office/", "Página de apoyo: sets, piezas, ideas y bloque para empresas.", true],
  ["Proyectos", "/proyectos/", "Espacios instalados. Es la prueba social del sitio.", true],
  ["Catálogos", "/recursos/", "Catálogo general y uno por categoría para descargar.", true],
  ["Nosotros", "/nosotros/", "Quiénes somos, valores y cierre a cotizar.", true],
  ["Preguntas frecuentes", "/preguntas-frecuentes/", "Entrega, instalación, garantía y cotización.", true],
  ["Contacto", "/contacto/", "Formulario de solicitud. Recibe también la lista de Mi proyecto.", true],
  ["Gracias", "/gracias/", "Confirmación del formulario.", false],
  ["Aviso de privacidad", "/aviso-de-privacidad/", "Legal.", false],
  ["Términos y condiciones", "/terminos-y-condiciones/", "Legal.", false],
  ["Página no encontrada", "/404.html", "Error 404 con salida al catálogo.", false],
];
const filaFija = ([n, r, q, i]) =>
  `<tr><td class="b">${esc(n)}</td><td class="u">${enlace(r)}</td><td>${esc(q)}</td><td class="${i ? "si" : "no"}">${i ? "Sí" : "No"}</td></tr>`;

const mapa1 = `
  <div class="sec">
    <p class="rotulo">03</p>
    <h2 class="h">Mapa del sitio: páginas fijas</h2>
    <p class="t">Las direcciones abren la vista previa. En producción la ruta es la misma bajo neucast.com.mx. "Indexable" dice si la página debe aparecer en Google; las que no, llevan noindex y quedan fuera del mapa del sitio.</p>
  </div>
  <table>
    <thead><tr><th style="width:34mm">Sección</th><th style="width:40mm">Ruta</th><th>Qué hace</th><th style="width:16mm">Indexable</th></tr></thead>
    <tbody>${fijas.map(filaFija).join("")}</tbody>
  </table>
  <p class="aviso">Estas son las rutas iniciales. Falta la revisión de SEO a cargo de Mich para validar que son las correctas, igual que los nombres y las direcciones de categorías, piezas y proyectos.</p>
  ${completo ? `<div class="sec">
    <h3 class="h2">Archivos que se generan solos</h3>
    <table>
      <tbody>
        <tr><td class="b" style="width:34mm">Mapa del sitio</td><td class="u" style="width:40mm">${enlace("/sitemap.xml")}</td><td>Todas las páginas indexables. Se rehace en cada publicación con las mismas listas que generan las páginas.</td></tr>
        <tr><td class="b">robots.txt</td><td class="u">${enlace("/robots.txt")}</td><td>Permite todo y apunta al mapa del sitio. En la vista previa cierra el sitio a propósito.</td></tr>
        <tr><td class="b">Índice del buscador</td><td class="u">${enlace("/buscar.json")}</td><td>Lo que lee el buscador. No es una página.</td></tr>
        <tr><td class="b">Fichas técnicas</td><td class="u">/fichas/neucast-{pieza}.pdf</td><td>Una por pieza, generada con la plantilla de Neucast.</td></tr>
        <tr><td class="b">Catálogos</td><td class="u">/catalogos/neucast-catalogo-{categoria}.pdf</td><td>Uno por categoría y el general.</td></tr>
      </tbody>
    </table>
  </div>` : ""}`;

// ---------- 04 mapa: plantillas ----------
const ejemploCat = categories[0];
const ejemploPieza = piezas.find((p) => p.cat === ejemploCat.slug) || piezas[0];
const ejemploProy = proyectos[0];
const plantillas = `
  <div class="sec">
    <p class="rotulo">04</p>
    <h2 class="h">Mapa del sitio: plantillas que se repiten</h2>
    <p class="t">Tres páginas son plantillas: se diseñan una vez y se repiten por cada categoría, cada pieza y cada proyecto. Para revisarlas basta abrir un ejemplo de cada una. Lo que se ajuste ahí se aplica a todas.</p>
  </div>
  <table>
    <thead><tr><th style="width:30mm">Plantilla</th><th style="width:22mm">Hoy</th><th style="width:52mm">Ejemplo</th><th>Qué lleva</th></tr></thead>
    <tbody>
      <tr><td class="b">Categoría</td><td>${categories.length} páginas</td><td class="u">${enlace(`/muebles/${ejemploCat.slug}/`)}</td><td>Título, texto de entrada, riel de categorías, filtros, rejilla de piezas y catálogo en PDF de la categoría. Los cuatro textos de posicionamiento (h1, title, description, intro) son editables por categoría.</td></tr>
      <tr><td class="b">Ficha de producto</td><td>${piezas.length} páginas</td><td class="u">${enlace(`/muebles/${ejemploPieza.cat}/${ejemploPieza.slug}/`)}</td><td>Galería, acabados, datos principales, cotizar por WhatsApp o correo, agregar a Mi proyecto, detalles, dimensiones, materiales, descargas (ficha en PDF), relato con foto grande y piezas que combinan.</td></tr>
      <tr><td class="b">Proyecto</td><td>${proyectos.length} páginas</td><td class="u">${enlace(`/proyectos/${ejemploProy.slug}/`)}</td><td>Apertura, introducción, capítulos con fotos, escenas con puntos sobre las piezas, piezas del proyecto y otros proyectos.</td></tr>
    </tbody>
  </table>
  <div class="sec">
    <h3 class="h2">Las categorías</h3>
    <p class="t">Hoy el prototipo tiene ${categories.length} categorías de muestra, con sus nombres y direcciones provisionales. La lista definitiva de categorías la define el cliente, porque es lo que vende; SEO valida los nombres y las direcciones con las que conviene posicionar cada una.</p>
    ${completo ? `<table>
      <thead><tr><th style="width:44mm">Categoría de muestra</th><th style="width:48mm">Ruta</th><th>Título que posiciona hoy</th></tr></thead>
      <tbody>${categories
        .map((c) => `<tr><td class="b">${esc(c.name)}</td><td class="u">${enlace(`/muebles/${c.slug}/`)}</td><td>${esc(c.title)}</td></tr>`)
        .join("")}</tbody>
    </table>` : ""}
    <p class="nota">Las categorías, las piezas y los proyectos saldrán del administrador: dar de alta uno crea su página, su catálogo en PDF y su lugar en el menú, el buscador y el mapa del sitio.</p>
  </div>`;

// ---------- 05 SEO ----------
const seo = `
  <div class="sec">
    <p class="rotulo">05</p>
    <h2 class="h">Posicionamiento: lo que hay hoy y lo que falta definir</h2>
    <p class="t">El prototipo ya trae una base técnica de posicionamiento implementada, para que el trabajo de SEO sea de análisis y afinación, no de construcción. Lo que decide el posicionamiento (palabras, fórmulas de títulos, direcciones y textos) está por validar con el análisis de SEO y se cambia en un solo lugar.</p>
  </div>
  <div class="dos">
    <div>
      <h3 class="h2">Qué está implementado hoy (base de posicionamiento)</h3>
      <ul class="lista">
        <li>Un solo h1 por página y jerarquía de encabezados sin saltos.</li>
        <li>Título y descripción en todas las páginas; canónica en cada una.</li>
        <li>Mapa del sitio con solo las páginas indexables; noindex en gracias, legales y 404.</li>
        <li>Datos estructurados: organización en todo el sitio, producto en fichas, artículo en proyectos, preguntas frecuentes, páginas de colección, contacto y "acerca de".</li>
        <li>Migas de pan en todas las páginas y sitio web con buscador declarado en el home.</li>
        <li>Open Graph y Twitter en todas las páginas. Idioma es-MX.</li>
        <li>Direcciones limpias, con diagonal final y sin parámetros.</li>
        <li>Sitio estático: carga rápida, sin servidor para mostrar contenido.</li>
        <li>Textos alternativos en las fotos de producto y de ambiente.</li>
      </ul>
    </div>
    <div>
      <h3 class="h2">Qué falta definir con el análisis de SEO</h3>
      <ul class="lista">
        <li><b>Todo el contenido actual es de posicionamiento provisional.</b> Falta revisar títulos, descripciones y textos de todas las páginas contra las palabras clave que salgan del análisis.</li>
        <li><b>La fórmula de los títulos.</b> Hoy la ficha usa "{tipo} {nombre} | {categoría} | Neucast" y el proyecto "{espacio} en {ciudad} | Proyectos | Neucast". Si conviene otra, se cambia una vez y aplica a todas.</li>
        <li><b>Las direcciones</b> de las páginas fijas, categorías, piezas y proyectos.</li>
        <li><b>Las categorías:</b> el cliente define cuáles vende; SEO valida nombres y direcciones.</li>
        <li><b>Los cuatro textos de cada categoría:</b> h1, title, description e intro. Son los que sostienen el posicionamiento por tipo de mueble.</li>
        <li><b>Home office:</b> qué búsqueda atacar, si es que conviene posicionarla, y si más adelante vale una sección de ideas o guías.</li>
        <li><b>Search Console y analítica:</b> alta, propiedad y qué medir. Si se agrega analítica hay que actualizar el aviso de privacidad y pedir consentimiento.</li>
      </ul>
    </div>
  </div>
  <p class="nota">No hay etiqueta de palabras clave ni campos de "título SEO" por pieza a propósito: los títulos salen de una fórmula que define SEO, y la consistencia pesa más que el control pieza por pieza.</p>`;

// ---------- 06+ lo que sigue (solo interno) ----------
const comoEsta = `
  <div class="sec">
    <p class="rotulo">06</p>
    <h2 class="h">Lo que sigue: cómo está hecho el sitio y qué falta</h2>
    <p class="t">El sitio es estático, hecho con Astro 7. El contenido vive hoy en archivos de datos dentro del código; esos archivos son el contrato que el administrador tiene que llenar. Toda la infraestructura será propia, en Hostinger: nada del proyecto vive en GitHub. La vista previa actual en GitHub Pages es provisional y se apaga al migrar.</p>
  </div>
  <div class="dos">
    <div class="caja"><p class="rotulo">El administrador</p><ul class="lista">
      <li>Frontend en Astro, como sitio aparte (por ejemplo admin.neucast.com.mx), reutilizando los tokens y componentes del sistema de diseño de Neucast.</li>
      <li>Infraestructura: un VPS de Hostinger con el sitio, el administrador, la API, la base de datos, la compilación con Node y Chrome para los PDF, el código en un repositorio privado y las copias de seguridad. El plan compartido no corre Node ni Chrome.</li>
      <li>Backend y API por definir con el desarrollador (Node o PHP con MySQL); en el VPS cualquiera de los dos corre.</li>
      <li>Flujo de publicación: se guarda en el administrador, la API encola una publicación en el propio servidor, se compila el sitio con los datos de la API, se generan fichas y catálogos en PDF, se revisa y se copia a la carpeta pública.</li>
      <li>El formulario de contacto lo recibe la API, con la lista de Mi proyecto en el mismo envío.</li>
      <li>Pendiente: licenciar Helvetica Neue para generar los PDF en el servidor, o elegir una alternativa muy parecida. Mientras, se generan en una Mac.</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Dominio, hospedaje y legales</p><ul class="lista">
      <li>Pasar neucast.com.mx a Hostinger, contratar el VPS y retirar el WordPress que hoy está instalado ahí. Decidir si el plan compartido se queda para correo o se cancela.</li>
      <li>Certificado, redirecciones a https y a la versión con o sin www, y robots sin bloqueo en producción.</li>
      <li>Alta en Search Console con la cuenta de Google de la empresa.</li>
      <li>Aviso de privacidad y términos: revisión del abogado del cliente. Hoy el sitio no usa cookies ni analítica; Mi proyecto usa almacenamiento local, que es funcional. Si se agrega analítica, hace falta aviso de consentimiento.</li>
      <li>Avisar al desarrollador del cambio: el mensaje que se le mandó hablaba de WordPress.</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Fase 2</p><ul class="lista">
      <li>Comparador de piezas.</li>
      <li>Selector de acabados que cambie la foto (requiere una foto por color).</li>
      <li>Ver la pieza en el espacio con la cámara (requiere modelos 3D).</li>
      <li>Planos para descargar.</li>
      <li>Tarjeta de muestras de acabados antes del footer, si el cliente confirma que puede enviarlas.</li>
      <li>Sección de ideas o guías, si SEO lo recomienda.</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Lo que falta del cliente</p><ul class="lista">
      <li>Número de WhatsApp de ventas y correo para las solicitudes.</li>
      <li>Razón social, RFC, domicilio fiscal y jurisdicción. Domicilio, teléfono y horario para la ficha de Google.</li>
      <li>Lista definitiva de categorías y la carga inicial acordada, por escrito.</li>
      <li>Datos de cada pieza según la tabla de campos. Fotos de producto con fondo transparente, fotos de espacios instalados y de home office.</li>
      <li>Decisiones: entrega a domicilios particulares, muestras de acabados, modelos 3D o foto por color.</li>
      <li>Accesos: Hostinger, registro del dominio y cuenta de Google.</li>
    </ul></div>
  </div>`;

const administrable1 = `
  <div class="sec">
    <p class="rotulo">07</p>
    <h2 class="h">Todo lo que debe ser administrable</h2>
    <p class="t">Lo que sigue es la lista de pantallas y campos del administrador. Cada campo existe porque hoy el sitio lo pinta en algún lugar. Las listas cerradas son listas desplegables, nunca texto libre, porque los filtros y el buscador dependen de que los valores sean exactos.</p>
  </div>
  <h3 class="h2">Ajustes de la empresa (una sola pantalla)</h3>
  <table>
    <thead><tr><th style="width:46mm">Campo</th><th>Dónde se usa</th></tr></thead>
    <tbody>
      <tr><td class="b">Dominio</td><td>Canónicas, mapa del sitio y direcciones absolutas.</td></tr>
      <tr><td class="b">WhatsApp de ventas</td><td>Todos los botones de cotizar, la burbuja flotante, el panel de Mi proyecto y los PDF.</td></tr>
      <tr><td class="b">Correo de ventas</td><td>Pie de página, formulario y PDF.</td></tr>
      <tr><td class="b">Instagram y Facebook</td><td>Pie de página.</td></tr>
      <tr><td class="b">Datos de la empresa para Google</td><td>Razón social, domicilio, teléfono y horario: ficha de organización y de negocio local.</td></tr>
      <tr><td class="b">Piezas destacadas del home</td><td>Lista ordenable de piezas que salen en el riel del inicio.</td></tr>
      <tr><td class="b">Proyecto destacado del home</td><td>Hoy es el primero de la lista; conviene poder elegirlo.</td></tr>
      <tr><td class="b">Foto de "Todos los muebles"</td><td>Tarjeta del menú y del catálogo.</td></tr>
    </tbody>
  </table>
  <h3 class="h2">Categorías</h3>
  <table>
    <thead><tr><th style="width:46mm">Campo</th><th>Regla</th></tr></thead>
    <tbody>
      <tr><td class="b">Nombre y dirección (slug)</td><td>La dirección la valida SEO. Cambiarla después requiere redirección.</td></tr>
      <tr><td class="b">Foto y texto alternativo</td><td>Tarjeta de categoría, menú, buscador, portada del catálogo en PDF.</td></tr>
      <tr><td class="b">Los cuatro textos de posicionamiento</td><td>h1, title, description e intro. Con medidas máximas: title hasta 65 caracteres, description entre 70 y 160.</td></tr>
      <tr><td class="b">Orden</td><td>Define el menú, el riel de categorías y el catálogo general.</td></tr>
      <tr><td class="b">Catálogo propio en PDF (opcional)</td><td>Si se sube, sustituye al generado.</td></tr>
      <tr><td class="b">Bloques editoriales (opcional)</td><td>Foto de un proyecto o espacio de esa categoría para intercalar en la rejilla. Sin material propio no se pinta nada.</td></tr>
    </tbody>
  </table>
  <p class="nota">Al guardar una categoría se crea su página, su catálogo en PDF y su lugar en el menú, el buscador y el mapa del sitio. Una categoría sin piezas publicadas existe con su aviso de "todavía no hay piezas".</p>`;

const administrable2 = `
  <div class="sec">
    <p class="rotulo">08</p>
    <h2 class="h">Piezas: el alta de un producto</h2>
    <p class="t">Tres niveles. Sin los obligatorios la pieza no se puede publicar, porque alimentan los filtros, el buscador, la ficha en PDF y lo que ve Google. Los obligatorios según el tipo solo se piden cuando aplican a la categoría. Lo opcional se pinta solo si existe.</p>
  </div>
  <div class="dos">
    <div class="caja"><p class="rotulo">Obligatorios para todas</p><ul class="lista">
      <li>Nombre propio (sin el tipo: "Órbita", no "Silla Órbita") y dirección (slug).</li>
      <li>Tipo de mueble ("Silla operativa", "Mesa de juntas").</li>
      <li>Categoría (una sola).</li>
      <li>Al menos una foto, de preferencia con fondo transparente, y el texto alternativo de la principal. Las demás fotos con su propio alt.</li>
      <li>Párrafo descriptivo (resumen).</li>
      <li>Material (lista cerrada) y acabados o colores (al menos uno, lista cerrada con nombre comercial y grupo de color).</li>
      <li>Disponibilidad (lista cerrada: inmediata, hasta 10 días, sobre pedido).</li>
      <li>Tipo de uso (lista cerrada).</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Obligatorios según el tipo</p><ul class="lista">
      <li>Sillas: respaldo, descansabrazos y base.</li>
      <li>Sofás y bancas: plazas.</li>
      <li>Mesas y escritorios: base.</li>
      <li>Características extra (lista cerrada: apilable, con ruedas, reclinable, modular).</li>
    </ul>
    <p class="rotulo" style="margin-top:4mm">Marcas y colecciones</p><ul class="lista">
      <li>Nuevo (sí o no): etiqueta en la tarjeta.</li>
      <li>Espacios: casillas como "Home office". Una pieza puede estar en varias colecciones sin salir de su categoría.</li>
      <li>Publicada o borrador.</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Opcionales (ficha técnica)</p><ul class="lista">
      <li>Destacados: hasta tres frases cortas.</li>
      <li>Medidas: altura total, longitud, anchura, profundidad, diámetro, espesor de cubierta, altura libre bajo cubierta, altura y anchura y profundidad del asiento, altura del respaldo, medidas de brazos, altura de cabecera. Solo las que apliquen, con su unidad.</li>
      <li>Construcción: tapicería, asiento, armazón, estructura, cubierta, suspensión, base, patas, ruedas, acabado.</li>
      <li>Mecanismo: nombre y lista de ajustes.</li>
      <li>Cuidados: lista de frases.</li>
      <li>Piezas que combinan (opcional; si no, se calculan por categoría).</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Qué se genera solo al guardar</p><ul class="lista">
      <li>La página de la pieza con su título y descripción por fórmula.</li>
      <li>La ficha técnica en PDF y el catálogo de su categoría.</li>
      <li>Su lugar en el catálogo, los filtros, el buscador, el mapa del sitio y las colecciones donde esté marcada.</li>
      <li>Los datos estructurados de producto y las migas de pan.</li>
    </ul></div>
  </div>`;

const administrable3 = `
  <div class="sec">
    <p class="rotulo">09</p>
    <h2 class="h">Proyectos, home office, textos fijos y métricas</h2>
  </div>
  <div class="dos">
    <div class="caja"><p class="rotulo">Proyectos</p><ul class="lista">
      <li>Cabecera: nombre, dirección, tipo de espacio, ciudad, resumen, foto de portada con alt.</li>
      <li>Introducción: uno o más párrafos.</li>
      <li>Cuerpo como lista ordenable de bloques: capítulo (título y párrafos), frase destacada (una o dos líneas), foto a todo lo ancho (con alt y pie), par de fotos, video, y escenas con puntos: foto más una lista de piezas del catálogo con su posición sobre la imagen.</li>
      <li>Piezas del proyecto: lista de piezas del catálogo.</li>
      <li>Publicado o borrador, y cuál es el destacado del home.</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Home office y otras colecciones</p><ul class="lista">
      <li>Fotos de cabecera, portada y cierre, con alt.</li>
      <li>Sets: nombre, texto corto y de dos a cuatro piezas del catálogo.</li>
      <li>Ideas: título, texto y foto con alt.</li>
      <li>Las piezas entran solas con la casilla "Home office" de cada pieza.</li>
      <li>Si se abren más colecciones por espacio, es la misma pantalla.</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Textos de las páginas fijas</p><ul class="lista">
      <li>Home: titular, bajada y textos de cada bloque.</li>
      <li>Nosotros, Catálogos, Contacto y Preguntas frecuentes: título, descripción, textos y, en preguntas frecuentes, la lista de preguntas y respuestas por grupo.</li>
      <li>Legales: aviso de privacidad y términos, por secciones, con fecha de actualización.</li>
      <li>Cada página con su title y description editables.</li>
    </ul></div>
    <div class="caja"><p class="rotulo">Métricas y reportes en el mismo panel</p><ul class="lista">
      <li>Visitas por página y por periodo, y de dónde llegan.</li>
      <li>Búsquedas internas: qué escribe la gente y qué no encuentra.</li>
      <li>Conversión: clics a WhatsApp por pieza y proyecto, envíos del formulario, listas de Mi proyecto enviadas, descargas de fichas y catálogos.</li>
      <li>Lo que reporta Google: impresiones, clics y posición por página, leído de Search Console.</li>
      <li>Descarga de reportes en Excel o PDF por periodo.</li>
      <li>Si se agrega medición en el sitio, hay que actualizar el aviso de privacidad y pedir consentimiento.</li>
    </ul></div>
  </div>
  <div class="sec">
    <h3 class="h2">Reglas del administrador</h3>
    <ul class="lista">
      <li>Las listas cerradas (material, colores, uso, respaldo, brazos, base, plazas, extras, disponibilidad) se administran aparte, y cambiar un valor cambia el filtro en todo el sitio.</li>
      <li>Nada se publica con campos obligatorios vacíos. El administrador avisa qué falta.</li>
      <li>Al publicar se regeneran solo la pieza, su categoría y el catálogo general, no todo el catálogo.</li>
      <li>Usuarios con permisos: quien captura y quien publica pueden ser personas distintas.</li>
    </ul>
  </div>`;

const cuerpo = completo
  ? [queEs, recorrido, mapa1, plantillas, seo, comoEsta, administrable1, administrable2, administrable3]
  : [queEs, recorrido, mapa1, plantillas, seo];
const cabs = completo
  ? ["Hacia dónde va", "El recorrido", "Mapa del sitio", "Plantillas", "Posicionamiento", "Lo que sigue", "Administrable", "Piezas", "Proyectos y métricas"]
  : ["Hacia dónde va", "El recorrido", "Mapa del sitio", "Plantillas", "Posicionamiento"];
const total = cuerpo.length + 1;
const html = `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>Neucast · Estrategia y mapa del sitio</title>
<style>${ESTILOS}${ESTILOS_DOC}</style></head><body>${portada}${cuerpo.map((c, i) => hoja(cabs[i], c, i + 2, total)).join("")}</body></html>`;

const temporal = fs.mkdtempSync(path.join(os.tmpdir(), "neucast-estrategia-"));
const htmlRuta = path.join(temporal, "estrategia.html");
const pdfRuta = path.resolve(salida, completo ? "neucast-estrategia-completa-interna.pdf" : "neucast-estrategia-y-mapa-del-sitio.pdf");
fs.writeFileSync(htmlRuta, html);
execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files", `--print-to-pdf=${pdfRuta}`, "file://" + htmlRuta], { stdio: "ignore" });
fs.rmSync(temporal, { recursive: true, force: true });
const hojas = (fs.readFileSync(pdfRuta).toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
console.log(`✓ ${path.basename(pdfRuta)} · ${hojas} hojas (esperadas ${total}) · ${Math.round(fs.statSync(pdfRuta).size / 1024)} KB`);
