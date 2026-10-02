// Documento de estrategia y mapa del sitio, en PDF, con la plantilla de las
// fichas técnicas (logotipo, rótulos, A4).
//
//   node scripts/entregables/estrategia.mjs <carpeta-de-salida>
//
// Para quién: Mitch (SEO) y Gabriela (cliente). Explica a qué va el sitio,
// cómo está pensado el recorrido hasta cotizar, qué páginas existen y cuáles
// son plantillas que se repiten, qué SEO ya está resuelto y qué define SEO.
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
if (!salida || !CHROME) {
  console.error("Uso: node scripts/entregables/estrategia.mjs <carpeta-de-salida>  (necesita Chrome)");
  process.exit(1);
}
fs.mkdirSync(salida, { recursive: true });

const { site, categories } = await import("../../src/data/site.js");
const { piezas } = await import("../../src/data/catalogo.js");
const { proyectos } = await import("../../src/data/proyectos.js");

const PREVIEW = "https://danielcastro93.github.io/neucast-web";
const mes = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" }).format(new Date());
const url = (ruta) => `${PREVIEW}${ruta}`;
const enlace = (ruta) => `<a href="${esc(url(ruta))}">${esc(ruta)}</a>`;

const ESTILOS_DOC = `
.hoja{padding-top:12mm}
a{color:#48542B;text-decoration:none}
.portada-foto{flex:1;margin-top:9mm;border-radius:3.5mm;background:#3D3B37;position:relative;overflow:hidden}
.portada-foto .logo-grande{position:absolute;left:10mm;bottom:10mm;height:16mm;width:auto}
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
`;

const hoja = (cab, contenido, n, total) => `
<section class="hoja">
  <header class="cab">
    ${logo("7.2mm")}
    <div class="cab-der"><p class="rotulo">Estrategia del sitio</p><p class="rotulo">${esc(cab)}</p></div>
  </header>
  ${contenido}
  <footer class="pie">
    <span><strong>neucast.com.mx</strong> · vista previa en danielcastro93.github.io/neucast-web</span>
    <span>${esc(mes)}</span>
    <span class="pag">${n} / ${total}</span>
  </footer>
</section>`;

// ---------- hojas ----------
const portada = `
<section class="hoja">
  <header class="cab">
    ${logo("7.2mm")}
    <div class="cab-der"><p class="rotulo">Documento de trabajo</p><p class="rotulo">${esc(mes)}</p></div>
  </header>
  <div class="portada-foto">${logo("16mm").replace('class="logo"', 'class="logo logo-grande"').replaceAll("#1D1D1B", "#FFFFFF")}</div>
  <div class="portada-txt">
    <p class="rotulo" style="color:#48542B">neucast.com.mx</p>
    <h1 class="portada-ttl">Estrategia y mapa del sitio</h1>
    <p class="portada-meta">A qué va el sitio, cómo está pensado el recorrido hasta cotizar y qué páginas existen.<br>Para Mitch (SEO) y para Gabriela. Preparado por Daniel Castro.</p>
  </div>
</section>`;

const queEs = `
  <div class="sec">
    <p class="rotulo">01</p>
    <h2 class="h">Para qué es el sitio</h2>
    <p class="t">Neucast vende mobiliario de diseño. Puede venderle a cualquiera, pero el sitio le habla a quien amuebla un espacio de trabajo: la empresa que equipa una oficina, una sala de juntas, una recepción o una cafetería, y los despachos de arquitectura e interiorismo que lo resuelven por ella. Esa es la compra que más vale y la que más se repite.</p>
    <p class="t g">Por eso todo el sitio presenta las piezas como de Neucast, habla de espacios completos y no de muebles sueltos, y nunca menciona proveedores ni fabricantes.</p>
  </div>
  <div class="dos">
    <div class="caja"><p class="rotulo">A quién le habla</p><p>A quien decide o recomienda la compra de mobiliario en una empresa: dirección, administración, recursos humanos, compras, y los despachos que diseñan el espacio. En segundo lugar, a quien arma su home office.</p></div>
    <div class="caja"><p class="rotulo">Qué queremos que haga</p><p>Que cotice. No hay pago en línea ni precios públicos: la conversión es un mensaje de WhatsApp o una solicitud por el formulario de contacto, de preferencia con la lista de piezas ya armada.</p></div>
    <div class="caja"><p class="rotulo">Cómo se mide</p><p>Mensajes de WhatsApp iniciados desde el sitio, solicitudes enviadas por el formulario, listas de "Mi proyecto" enviadas y descargas de fichas y catálogos.</p></div>
    <div class="caja"><p class="rotulo">Qué no es</p><p>No es una tienda en línea ni un catálogo de un fabricante. No muestra precios, no tiene carrito de pago y no compite por búsquedas de muebles para el hogar.</p></div>
  </div>
  <div class="sec">
    <h3 class="h2">Reglas que sostienen la estrategia</h3>
    <ul class="lista">
      <li>El mobiliario se presenta como de Neucast. No se menciona origen, proveedor ni fabricación.</li>
      <li>No se publica ninguna cifra que no esté confirmada: ni plazos, ni medidas, ni cantidades.</li>
      <li>Cada botón dice la acción concreta: "Cotizar por WhatsApp", "Descargar el catálogo", nunca "ver más".</li>
      <li>Una sola familia tipográfica, paleta de grises con el verde de la marca, y fotos grandes donde el espacio lo pide.</li>
      <li>Todo está pensado para crecer a cientos de piezas sin rehacer nada: buscador, catálogos y fichas se generan solos desde los datos.</li>
    </ul>
  </div>`;

const recorrido = `
  <div class="sec">
    <p class="rotulo">02</p>
    <h2 class="h">El recorrido hasta cotizar</h2>
    <p class="t">Cada sección tiene un papel en un camino de cuatro pasos. Google y las categorías meten gente; el catálogo y el buscador la dejan explorar; la ficha y los proyectos la convencen; y WhatsApp, el formulario y "Mi proyecto" cierran.</p>
  </div>
  <div class="pasos">
    <div class="paso"><div class="n">1</div><b>Entrar</b>Home, categorías y home office son las puertas. Son las páginas que posicionan: cada una tiene su título, su descripción y su texto de entrada editables.</div>
    <div class="paso"><div class="n">2</div><b>Explorar</b>Catálogo con filtros por tipo de uso, material, color y disponibilidad. Buscador instantáneo pensado para más de 500 piezas. Home office como colección por espacio.</div>
    <div class="paso"><div class="n">3</div><b>Decidir</b>La ficha de producto: fotos, acabados, datos principales, medidas y ficha técnica en PDF. Los proyectos instalados son la prueba de que Neucast resuelve espacios completos.</div>
    <div class="paso"><div class="n">4</div><b>Cotizar</b>WhatsApp con el mensaje ya escrito, formulario de contacto, y "Mi proyecto": una lista con cantidades que se manda completa por WhatsApp o por correo.</div>
  </div>
  <div class="sec">
    <h3 class="h2">Decisiones que conviene conocer</h3>
    <ul class="lista">
      <li><b>Home office</b> no es una categoría: es una colección. Las piezas siguen en su categoría y se marcan como aptas para home office. El ángulo es doble: la persona que arma su rincón y la empresa que equipa a su equipo en casa.</li>
      <li><b>"Mi proyecto"</b> funciona como un carrito sin pago. Vive en el navegador de la persona, no pide registro, y al final se convierte en un mensaje de WhatsApp o en un envío del formulario.</li>
      <li><b>Las fichas y los catálogos en PDF</b> se generan solos con una plantilla de Neucast. Nadie sube PDF a mano, así que nunca aparece la marca de un fabricante.</li>
      <li><b>Los textos de producto</b> se escriben para quien compra para una empresa: uso, resistencia y plazos, no decoración.</li>
      <li><b>Los legales</b> (aviso de privacidad y términos) están en borrador y requieren revisión del abogado del cliente antes de publicar.</li>
    </ul>
  </div>`;

const fijas = [
  ["Inicio", "/", "Puerta principal: categorías, piezas destacadas, proyecto, home office, marca y cierre a cotizar.", true],
  ["Muebles (catálogo)", "/muebles/", "Todas las piezas con filtros. Enlaza el catálogo general en PDF.", true],
  ["Home office", "/home-office/", "Colección por espacio: sets, piezas, ideas y bloque para empresas.", true],
  ["Proyectos", "/proyectos/", "Espacios instalados. Es la prueba social del sitio.", true],
  ["Catálogos", "/recursos/", "Catálogo general y uno por categoría para descargar.", true],
  ["Nosotros", "/nosotros/", "Quiénes somos, valores y cierre a cotizar.", true],
  ["Preguntas frecuentes", "/preguntas-frecuentes/", "Entrega, instalación, garantía y cotización. Lleva datos estructurados de preguntas.", true],
  ["Contacto", "/contacto/", "Formulario de solicitud. Recibe también la lista de \"Mi proyecto\".", true],
  ["Gracias", "/gracias/", "Confirmación del formulario.", false],
  ["Aviso de privacidad", "/aviso-de-privacidad/", "Legal. En borrador, pendiente del abogado.", false],
  ["Términos y condiciones", "/terminos-y-condiciones/", "Legal. En borrador, pendiente del abogado.", false],
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
  <div class="sec">
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
  </div>`;

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
      <tr><td class="b">Ficha de producto</td><td>${piezas.length} páginas</td><td class="u">${enlace(`/muebles/${ejemploPieza.cat}/${ejemploPieza.slug}/`)}</td><td>Galería, acabados, datos principales, cotizar por WhatsApp o correo, agregar a Mi proyecto, detalles, dimensiones, materiales, descargas (ficha en PDF), relato con foto grande y piezas que combinan. Datos estructurados de producto.</td></tr>
      <tr><td class="b">Proyecto</td><td>${proyectos.length} páginas</td><td class="u">${enlace(`/proyectos/${ejemploProy.slug}/`)}</td><td>Apertura, introducción, capítulos con fotos, escenas con puntos sobre las piezas, piezas del proyecto y otros proyectos. Datos estructurados de artículo.</td></tr>
    </tbody>
  </table>
  <div class="sec">
    <h3 class="h2">Las ${categories.length} categorías de hoy</h3>
    <table>
      <thead><tr><th style="width:44mm">Categoría</th><th style="width:48mm">Ruta</th><th>Título que posiciona hoy</th></tr></thead>
      <tbody>${categories
        .map((c) => `<tr><td class="b">${esc(c.name)}</td><td class="u">${enlace(`/muebles/${c.slug}/`)}</td><td>${esc(c.title)}</td></tr>`)
        .join("")}</tbody>
    </table>
    <p class="nota">Las categorías, su orden y sus textos salen del administrador. Agregar una categoría crea su página, su catálogo en PDF y su lugar en el menú, el buscador y el mapa del sitio.</p>
  </div>`;

const seo = `
  <div class="sec">
    <p class="rotulo">05</p>
    <h2 class="h">SEO: lo que ya está y lo que define Mitch</h2>
    <p class="t">La base técnica está resuelta para que la revisión sea de afinar, no de construir. Lo que decide el posicionamiento (palabras, fórmulas de títulos y direcciones) está en manos de SEO y se cambia en un solo lugar.</p>
  </div>
  <div class="dos">
    <div>
      <h3 class="h2">Ya resuelto</h3>
      <ul class="lista">
        <li>Un solo h1 por página y jerarquía de encabezados sin saltos.</li>
        <li>Título y descripción en todas las páginas; canónica en cada una.</li>
        <li>Mapa del sitio con solo las páginas indexables; noindex en gracias, legales y 404.</li>
        <li>Datos estructurados: organización en todo el sitio, producto en fichas, artículo en proyectos, preguntas frecuentes, páginas de colección, contacto y "acerca de".</li>
        <li>Migas de pan (BreadcrumbList) en todas las páginas y sitio web con buscador declarado en el home.</li>
        <li>Open Graph y Twitter en todas las páginas. Idioma es-MX.</li>
        <li>Direcciones limpias, con diagonal final, sin parámetros.</li>
        <li>Sitio estático: carga rápida, sin dependencias de servidor para mostrar contenido.</li>
      </ul>
    </div>
    <div>
      <h3 class="h2">Lo que define SEO</h3>
      <ul class="lista">
        <li><b>La fórmula de los títulos.</b> Hoy la ficha usa "{tipo} {nombre} | {categoría} | Neucast" y el proyecto "{espacio} en {ciudad} | Proyectos | Neucast". Si conviene otra, se cambia una vez y aplica a todas.</li>
        <li><b>Las direcciones (slugs)</b> de categorías, piezas y proyectos.</li>
        <li><b>Los cuatro textos de cada categoría:</b> h1, title, description e intro. Son los que sostienen el posicionamiento por tipo de mueble.</li>
        <li><b>Los textos de las páginas fijas:</b> home, home office, proyectos, nosotros, preguntas frecuentes y contacto.</li>
        <li><b>La estrategia de home office:</b> qué búsqueda atacar y si conviene abrir una sección de ideas o guías más adelante.</li>
        <li><b>Search Console y analítica:</b> alta, propiedad y qué medir. Si se agrega analítica hay que actualizar el aviso de privacidad y pedir consentimiento.</li>
      </ul>
    </div>
  </div>
  <p class="nota">No hay etiqueta de palabras clave ni campos de "título SEO" por pieza a propósito: la consistencia de la fórmula pesa más que el control pieza por pieza.</p>`;

const siguiente = `
  <div class="sec">
    <p class="rotulo">06</p>
    <h2 class="h">Lo que sigue</h2>
  </div>
  <div class="dos">
    <div class="caja"><p class="rotulo">Administrador propio</p><p>El contenido se capturará en un administrador hecho a la medida: categorías, piezas con sus campos en tres niveles (obligatorios, obligatorios según el tipo, opcionales), proyectos, home office y datos de la empresa. Al publicar, el sitio se recompila con los datos nuevos y se regeneran las fichas y los catálogos.</p></div>
    <div class="caja"><p class="rotulo">Dominio y hospedaje</p><p>El sitio se publica en Hostinger bajo neucast.com.mx. La vista previa actual es solo para revisar y está cerrada a Google.</p></div>
    <div class="caja"><p class="rotulo">Fase 2</p><p>Comparador de piezas. Selector de acabados que cambie la foto (requiere una foto por color). Ver la pieza en el espacio con la cámara (requiere modelos 3D). Planos para descargar.</p></div>
    <div class="caja"><p class="rotulo">Lo que necesitamos del cliente</p><p>Número de WhatsApp y correo de ventas, razón social y datos para los legales, revisión legal del aviso y los términos, fotos de producto con fondo transparente, fotos de espacios instalados y de home office, y confirmar si pueden enviar muestras de acabados y entregar a domicilios particulares.</p></div>
  </div>
  <div class="sec">
    <h3 class="h2">Cómo revisar la vista previa</h3>
    <ul class="lista">
      <li>Abrir ${enlace("/")} en computadora y en celular: el diseño cambia entre uno y otro a propósito.</li>
      <li>Probar el buscador (la lupa) con "silla", "home office" o "catálogo", y "Mi proyecto" (el ícono de lista) agregando piezas desde las tarjetas o desde un set de home office.</li>
      <li>Descargar una ficha técnica desde una pieza y un catálogo desde ${enlace("/recursos/")}.</li>
      <li>El formulario de contacto está en modo de prueba: dice "gracias" sin enviar nada hasta que exista el administrador.</li>
    </ul>
  </div>`;

const cuerpo = [queEs, recorrido, mapa1, plantillas, seo, siguiente];
const cabs = ["Para qué es el sitio", "El recorrido", "Mapa del sitio", "Plantillas", "SEO", "Lo que sigue"];
const total = cuerpo.length + 1;
const html = `<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><title>Neucast · Estrategia y mapa del sitio</title>
<style>${ESTILOS}${ESTILOS_DOC}</style></head><body>${portada}${cuerpo.map((c, i) => hoja(cabs[i], c, i + 2, total)).join("")}</body></html>`;

const temporal = fs.mkdtempSync(path.join(os.tmpdir(), "neucast-estrategia-"));
const htmlRuta = path.join(temporal, "estrategia.html");
const pdfRuta = path.resolve(salida, "neucast-estrategia-y-mapa-del-sitio.pdf");
fs.writeFileSync(htmlRuta, html);
execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--allow-file-access-from-files", `--print-to-pdf=${pdfRuta}`, "file://" + htmlRuta], { stdio: "ignore" });
fs.rmSync(temporal, { recursive: true, force: true });
const hojas = (fs.readFileSync(pdfRuta).toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g) || []).length;
console.log(`✓ ${path.basename(pdfRuta)} · ${hojas} hojas (esperadas ${total}) · ${Math.round(fs.statSync(pdfRuta).size / 1024)} KB`);
