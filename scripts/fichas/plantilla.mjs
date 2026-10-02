// Plantilla de la ficha técnica en PDF.
//
// Una sola plantilla para todas las piezas: arma el HTML de una ficha con los
// datos que ya existen (catálogo y fichas) y el diseño de Neucast. El PDF lo
// imprime Chrome sin interfaz (ver generar.mjs). Nadie sube fichas a mano, así
// que nunca puede colarse la ficha ni la marca de un fabricante.
//
// Reglas de contenido, las mismas que la ficha web:
// - Lo obligatorio siempre sale: nombre, tipo, foto, párrafo, acabados y
//   datos principales.
// - Lo opcional (medidas, construcción, mecanismo, cuidados) sale solo si
//   existe. Si una pieza no trae nada opcional, la ficha es de una hoja.
//
// La misma función sirve para el catálogo por categoría: se concatenan las
// hojas de varias piezas con una portada delante.
import fs from "node:fs";
import path from "node:path";

const RAIZ = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const PUBLICO = path.join(RAIZ, "public");

// --- el logotipo, tal cual está en el sitio ---
const logoFuente = fs.readFileSync(path.join(RAIZ, "src/components/Logo.astro"), "utf8");
const logoInterior = logoFuente
  .slice(logoFuente.indexOf(">", logoFuente.indexOf("<svg")) + 1, logoFuente.lastIndexOf("</svg>"))
  .replaceAll("var(--logo-sym, var(--olive))", "#78894A")
  .replaceAll("var(--logo-txt, var(--ink))", "#1D1D1B");
const logoViewBox = logoFuente.match(/viewBox="([^"]+)"/)[1];
export const logo = (alto) =>
  `<svg class="logo" style="height:${alto}" viewBox="${logoViewBox}" xmlns="http://www.w3.org/2000/svg" aria-label="Neucast">${logoInterior}</svg>`;

export const esc = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const archivo = (ruta) => (ruta ? "file://" + path.join(PUBLICO, ruta) : "");

// "5215512345678" → "+52 55 1234 5678"
export const telefono = (n) => {
  const d = String(n).replace(/\D/g, "").replace(/^521?/, "");
  return `+52 ${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
};

// --- el croquis, el mismo dibujo que la ficha web ---
function croquis(m) {
  const c = { ancho: m.largo || m.ancho, fondo: m.fondo, alto: m.alto, diametro: m.diametro };
  if (!c.ancho && !c.alto && !c.diametro) return "";
  const redonda = Boolean(c.diametro && !c.ancho);
  const cota = (x, y, t, extra = "") =>
    t ? `<text x="${x}" y="${y}" ${extra} class="cota">${esc(t)}</text>` : "";
  const dibujo = redonda
    ? `<g fill="none" stroke="#1D1D1B" stroke-width="1.4">
        <ellipse cx="160" cy="70" rx="80" ry="26"/>
        <path d="M80 70 L80 150M240 70 L240 150"/><path d="M80 150 A80 26 0 0 0 240 150"/>
        <g stroke="#95948e" stroke-width="1">
          <path d="M80 36 L240 36M80 31 L80 41M240 31 L240 41"/>
          ${c.alto ? '<path d="M56 70 L56 150M51 70 L61 70M51 150 L61 150"/>' : ""}
        </g></g>
       ${cota(160, 27, c.diametro, 'text-anchor="middle"')}
       ${cota(46, 110, c.alto, 'text-anchor="middle" transform="rotate(-90 46 110)"')}`
    : `<g fill="none" stroke="#1D1D1B" stroke-width="1.4">
        <path d="M60 70 L210 70 L210 170 L60 170 Z"/>
        <path d="M60 70 L105 38 L255 38 L210 70"/><path d="M210 170 L255 138 L255 38"/>
        <g stroke="#95948e" stroke-width="1">
          ${c.ancho ? '<path d="M60 186 L210 186M60 181 L60 191M210 181 L210 191"/>' : ""}
          ${c.alto ? '<path d="M40 70 L40 170M35 70 L45 70M35 170 L45 170"/>' : ""}
          ${c.fondo ? '<path d="M221 163 L262 134M217 158 L225 167M258 129 L266 138"/>' : ""}
        </g></g>
       ${cota(135, 203, c.ancho, 'text-anchor="middle"')}
       ${cota(30, 124, c.alto, 'text-anchor="middle" transform="rotate(-90 30 124)"')}
       ${cota(256, 163, c.fondo)}`;
  return `<svg class="croquis" viewBox="0 0 320 210" xmlns="http://www.w3.org/2000/svg">${dibujo}</svg>`;
}

// --- estilos de la ficha: A4, sin márgenes de impresora, con los colores del sitio ---
export const ESTILOS = `
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:"Helvetica Neue","HelveticaNeue",Inter,Arial,sans-serif;color:#1D1D1B;font-size:9.2pt;line-height:1.45}
.hoja{width:210mm;height:297mm;padding:14mm 15mm 0;position:relative;overflow:hidden;page-break-after:always;break-after:page;display:flex;flex-direction:column}
.hoja:last-child{page-break-after:auto;break-after:auto}
.rotulo{font-size:6.8pt;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:#5f5e59}
.cab{display:flex;align-items:center;justify-content:space-between;padding-bottom:6mm;border-bottom:.3mm solid #E3E1DB}
.logo{display:block;width:auto}
.cab-der{text-align:right}
.cab-der .rotulo + .rotulo{margin-top:1.2mm;color:#95948e}

/* hoja 1: presentación */
.presenta{display:grid;grid-template-columns:1.12fr 1fr;gap:10mm;margin-top:9mm}
.foto{background:#EDECE7;border-radius:3.5mm;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;padding:9mm}
.foto img{max-width:100%;max-height:100%;object-fit:contain;display:block}
.texto{display:flex;flex-direction:column;padding-top:2mm}
.tipo{color:#48542B}
.nombre{font-size:30pt;font-weight:700;letter-spacing:-.025em;line-height:1.02;margin:2.5mm 0 5mm}
.resumen b{font-weight:700;color:#1D1D1B}
.resumen span{color:#5f5e59}
.bloque{margin-top:6mm}
.bloque > .rotulo{margin-bottom:2.8mm}
.acabados{display:flex;flex-wrap:wrap;gap:2mm 4.5mm}
.acabado{display:inline-flex;align-items:center;gap:1.8mm;font-size:8.6pt}
.muestra{width:4mm;height:4mm;border-radius:50%;box-shadow:inset 0 0 0 .25mm rgba(0,0,0,.14)}

.datos{margin-top:10mm;display:grid;grid-template-columns:1fr 1fr;column-gap:10mm}
.datos div{display:flex;justify-content:space-between;gap:4mm;padding:2.4mm 0;border-bottom:.25mm solid #E3E1DB}
.datos dt{color:#5f5e59}
.datos dd{font-weight:600;text-align:right}

.destacados{margin-top:8mm;display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.destacado{background:#EDECE7;border-radius:2.5mm;padding:4.5mm;font-size:8.6pt;font-weight:500}

/* la foto de ambiente llena lo que queda de la hoja 1 */
.ambiente{flex:1;min-height:40mm;margin-top:8mm;margin-bottom:8mm;border-radius:3.5mm;overflow:hidden;background:#EDECE7}
.ambiente img{width:100%;height:100%;object-fit:cover;display:block}

/* hoja 2: especificaciones */
.espec{display:grid;grid-template-columns:1fr 1fr;gap:10mm;margin-top:9mm}
.titulo-sec{font-size:15pt;font-weight:700;letter-spacing:-.015em;margin:2mm 0 5mm}
.croquis{width:100%;height:auto;background:#F6F5F2;border-radius:2.5mm;padding:3mm;margin-bottom:4mm}
.cota{font-family:inherit;font-size:9px;fill:#1D1D1B;font-weight:600}
.tabla div{display:flex;justify-content:space-between;gap:4mm;padding:2.2mm 0;border-bottom:.25mm solid #E3E1DB}
.tabla dt{color:#5f5e59}
.tabla dd{font-weight:600;text-align:right}
/* construcción: etiqueta arriba y valor abajo; los valores son frases y
   alineados a la derecha se partían feo */
.apilada div{padding:2.6mm 0;border-bottom:.25mm solid #E3E1DB}
.apilada dt{color:#5f5e59;font-size:7.8pt;margin-bottom:.6mm}
.apilada dd{font-weight:600}
.lista{list-style:none}
.lista li{position:relative;padding:1.6mm 0 1.6mm 4.5mm}
.lista li::before{content:"";position:absolute;left:0;top:3.5mm;width:1.5mm;height:1.5mm;border-radius:50%;background:#78894A}
.sub{font-weight:700;margin-bottom:1mm}
.nota{margin-top:4mm;font-size:7.4pt;color:#95948e}

/* pie de cada hoja */
.pie{margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:6mm;padding:5mm 0 9mm;border-top:.3mm solid #E3E1DB;font-size:7.6pt;color:#5f5e59}
.pie strong{color:#1D1D1B;font-weight:600}
.pie .pag{white-space:nowrap}
`;

// --- una ficha: una o dos hojas ---
export function hojasDeFicha({ pieza, ficha, contexto }) {
  const { site, categoria, nombreOpcion, material, colores, etiquetasMedida, etiquetasConstruccion } = contexto;
  const f = ficha || {};

  // el párrafo: la primera frase en tinta y el resto en gris, como en la web
  const frases = (f.resumen || "").split(". ");
  const fuerte = frases[0] ? frases[0].replace(/\.$/, "") + "." : "";
  const resto = frases.slice(1).join(". ").trim();

  const principales = [
    ["Categoría", categoria?.name],
    ["Disponibilidad", nombreOpcion("entrega", pieza.entrega)],
    ["Material", material?.nombre],
    ["Tipo de uso", nombreOpcion("uso", pieza.uso)],
    ["Base", nombreOpcion("base", pieza.base)],
    ["Respaldo", nombreOpcion("respaldo", pieza.respaldo)],
    ["Descansabrazos", nombreOpcion("brazos", pieza.brazos)],
    ["Plazas", pieza.plazas ? `${pieza.plazas}${pieza.plazas === "4" ? " o más" : ""}` : null],
  ].filter(([, v]) => v);

  const medidas = Object.entries(etiquetasMedida).filter(([k]) => f.medidas?.[k]).map(([k, e]) => [e, f.medidas[k]]);
  const construccion = Object.entries(etiquetasConstruccion).filter(([k]) => f.construccion?.[k]).map(([k, e]) => [e, f.construccion[k]]);
  const mecanismo = f.mecanismo?.ajustes?.length ? f.mecanismo : null;
  const cuidados = f.cuidados || [];
  const destacados = (f.destacados || []).slice(0, 3);

  const url = `${site.domain}/muebles/${pieza.cat}/${pieza.slug}/`;
  const cab = (derecha) => `
    <header class="cab">
      ${logo("7.2mm")}
      <div class="cab-der"><p class="rotulo">Ficha técnica</p><p class="rotulo">${esc(derecha)}</p></div>
    </header>`;
  const pie = (n, total) => `
    <footer class="pie">
      <span><strong>${esc(url.replace(/^https?:\/\//, ""))}</strong></span>
      <span>WhatsApp ${esc(telefono(site.whatsapp))} · ${esc(site.email)}</span>
      <span class="pag">${n} / ${total}</span>
    </footer>`;
  const dl = (filas, clase) =>
    `<dl class="${clase}">${filas.map(([e, v]) => `<div><dt>${esc(e)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;

  const hayEspec = medidas.length || construccion.length || mecanismo || cuidados.length;
  const total = hayEspec ? 2 : 1;

  const hoja1 = `
  <section class="hoja">
    ${cab(categoria?.name || "")}
    <div class="presenta">
      <div class="foto"><img src="${archivo(pieza.img?.[0])}" alt=""></div>
      <div class="texto">
        <p class="rotulo tipo">${esc(pieza.tipo)}</p>
        <h1 class="nombre">${esc(pieza.nombre)}</h1>
        <p class="resumen"><b>${esc(fuerte)}</b> <span>${esc(resto)}</span></p>
        ${colores.length ? `
        <div class="bloque">
          <p class="rotulo">Acabados disponibles</p>
          <div class="acabados">${colores.map((c) => `<span class="acabado"><span class="muestra" style="background:${esc(c.hex)}"></span>${esc(c.nombre)}</span>`).join("")}</div>
        </div>` : ""}
      </div>
    </div>
    ${dl(principales, "datos")}
    ${destacados.length ? `<div class="destacados">${destacados.map((d) => `<p class="destacado">${esc(d)}</p>`).join("")}</div>` : ""}
    ${pieza.img?.[1] ? `<div class="ambiente"><img src="${archivo(pieza.img[1])}" alt=""></div>` : ""}
    ${pie(1, total)}
  </section>`;

  if (!hayEspec) return hoja1;

  const hoja2 = `
  <section class="hoja">
    ${cab(`${pieza.tipo} ${pieza.nombre}`)}
    <div class="espec">
      <div>
        ${medidas.length ? `
          <p class="rotulo">Dimensiones</p>
          <h2 class="titulo-sec">Medidas</h2>
          ${croquis(f.medidas)}
          ${dl(medidas, "tabla")}
          <p class="nota">Medidas nominales; pueden variar hasta 2 cm según el acabado.</p>` : ""}
      </div>
      <div>
        ${construccion.length ? `
          <p class="rotulo">Materiales</p>
          <h2 class="titulo-sec">Construcción</h2>
          ${dl(construccion, "apilada")}` : ""}
        ${mecanismo ? `
          <div class="bloque">
            <p class="sub">${esc(mecanismo.nombre || "Mecanismo")}</p>
            <ul class="lista">${mecanismo.ajustes.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
          </div>` : ""}
        ${cuidados.length ? `
          <div class="bloque">
            <p class="rotulo">Cuidados</p>
            <ul class="lista">${cuidados.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
          </div>` : ""}
      </div>
    </div>
    ${pie(2, total)}
  </section>`;

  return hoja1 + hoja2;
}

export const documento = (hojas, titulo) => `<!doctype html>
<html lang="es-MX"><head><meta charset="utf-8"><title>${esc(titulo)}</title>
<style>${ESTILOS}</style></head><body>${hojas}</body></html>`;
