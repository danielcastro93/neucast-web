// Plantilla de los catálogos en PDF: por categoría y general.
//
// Mismo diseño que la ficha técnica (estilos, logotipo, pie), pero pensado
// para crecer: con 100 o 200 piezas por categoría, repetir la ficha completa
// de cada una daría archivos imposibles de abrir en un celular. Por eso:
//
// - Catálogo por categoría: portada, índice y UNA hoja por pieza con lo que
//   sirve para elegir (foto, párrafo, acabados, datos principales y medidas
//   generales). El detalle completo vive en la ficha, que la hoja enlaza.
// - Catálogo general: portada y una rejilla de miniaturas, varias piezas por
//   hoja, agrupadas por categoría. Es un índice visual, no la suma de todo.
//
// Las fotos llegan ya achicadas (fotos.py); aquí solo se colocan.
import { ESTILOS, logo, esc, telefono } from "./plantilla.mjs";
import { otrasListas } from "./otras-listas.mjs";

const ESTILOS_CATALOGO = `
/* portada */
.portada{padding:14mm 15mm 0}
.portada-foto{flex:1;margin-top:9mm;border-radius:3.5mm;overflow:hidden;background:#EDECE7}
.portada-foto img{width:100%;height:100%;object-fit:cover;display:block}
.portada-txt{padding:10mm 0 2mm}
.portada-ttl{font-size:44pt;font-weight:700;letter-spacing:-.03em;line-height:1;margin:3mm 0 4mm}
.portada-meta{font-size:10pt;color:#5f5e59}

/* índice */
.indice{margin-top:9mm}
.indice-ttl{font-size:22pt;font-weight:700;letter-spacing:-.02em;margin:2mm 0 7mm}
.indice ol{list-style:none;columns:2;column-gap:10mm}
.indice li{break-inside:avoid;display:flex;align-items:baseline;gap:2mm;padding:2.2mm 0;border-bottom:.25mm solid #E3E1DB}
.indice .i-tipo{color:#5f5e59}
.indice .i-nombre{font-weight:600}
.indice .i-pag{margin-left:auto;font-variant-numeric:tabular-nums;color:#5f5e59}
.indice a{color:inherit;text-decoration:none;display:contents}

/* hoja de pieza */
.pz{display:grid;grid-template-columns:1.12fr 1fr;gap:10mm;margin-top:9mm}
.pz .foto{padding:7mm}
.medidas-linea{margin-top:4mm;font-weight:600}
.enlace{margin:7mm 0 0;padding:4.5mm 5mm;border-radius:2.5mm;background:#F6F5F2;display:flex;justify-content:space-between;align-items:center;gap:6mm;font-size:8.4pt;color:#5f5e59}
.enlace a{color:#1D1D1B;font-weight:600;text-decoration:none;white-space:nowrap}
.pz-ambiente{flex:1;min-height:40mm;margin:7mm 0 8mm;border-radius:3.5mm;overflow:hidden;background:#EDECE7}
.pz-ambiente img{width:100%;height:100%;object-fit:cover;display:block}

/* versión compacta: dos piezas por hoja, sin foto de ambiente */
.par{flex:1;display:flex;flex-direction:column;justify-content:space-around;padding:4mm 0 6mm}
.media{display:grid;grid-template-columns:76mm 1fr;gap:9mm;align-items:start;padding:7mm 0}
.media + .media{border-top:.3mm solid #E3E1DB}
.media .foto{padding:6mm}
.media .nombre{font-size:22pt;margin:1.6mm 0 3mm}
.media .resumen{font-size:8.6pt}
.media .datos{margin-top:4mm;column-gap:7mm}
.media .datos div{padding:1.7mm 0;font-size:8.2pt}
.media .enlace{margin-top:4mm;padding:3mm 4mm}

/* catálogo general: rejilla */
.grupo-ttl{display:flex;align-items:baseline;justify-content:space-between;margin:8mm 0 4mm}
.grupo-ttl h2{font-size:15pt;font-weight:700;letter-spacing:-.015em}
.rejilla{display:grid;grid-template-columns:repeat(4,1fr);gap:6mm 4mm}
.mini{display:block;color:inherit;text-decoration:none;break-inside:avoid}
.mini-foto{aspect-ratio:1/1;background:#EDECE7;border-radius:2mm;display:flex;align-items:center;justify-content:center;padding:3mm;overflow:hidden}
.mini-foto img{max-width:100%;max-height:100%;object-fit:contain;display:block}
.mini .rotulo{margin-top:2.2mm;font-size:6pt;letter-spacing:.2em}
.mini-nombre{font-weight:700;font-size:9.4pt;margin-top:.6mm}
`;

const mes = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });

function cabecera(izq, der) {
  return `
    <header class="cab">
      ${logo("7.2mm")}
      <div class="cab-der"><p class="rotulo">${esc(izq)}</p><p class="rotulo">${esc(der)}</p></div>
    </header>`;
}

function pie(site, n, total, texto) {
  return `
    <footer class="pie">
      <span><strong>${esc(texto || site.domain.replace(/^https?:\/\//, ""))}</strong></span>
      <span>WhatsApp ${esc(telefono(site.whatsapp))} · ${esc(site.email)}</span>
      <span class="pag">${n} / ${total}</span>
    </footer>`;
}

function portada({ site, titulo, meta, foto }) {
  return `
  <section class="hoja portada">
    ${cabecera("Catálogo", mes.format(new Date()))}
    <div class="portada-foto"><img src="${foto}" alt=""></div>
    <div class="portada-txt">
      <p class="rotulo tipo">Catálogo Neucast</p>
      <h1 class="portada-ttl">${esc(titulo)}</h1>
      ${meta ? `<p class="portada-meta">${esc(meta)}</p>` : ""}
    </div>
    ${pie(site, 1, "{{TOTAL}}")}
  </section>`;
}

// --- catálogo de una categoría ---
// fotos(pieza) → { recorte, ambiente } con rutas file:// ya optimizadas
export function hojasDeCatalogo({ categoria, piezas, fotoPortada, fotos, contexto, porHoja = 1 }) {
  const { site, nombreOpcion, materiales, gruposColor, fichas, etiquetasMedida } = contexto;
  const n = piezas.length;

  // hoja 1 portada, hoja 2 índice, y una por pieza
  const primeraPieza = 3;
  const hojasPiezas = Math.ceil(n / porHoja);
  const total = 2 + hojasPiezas;
  const paginaDe = (i) => primeraPieza + Math.floor(i / porHoja);

  const indice = `
  <section class="hoja">
    ${cabecera("Catálogo", categoria.name)}
    <div class="indice">
      <p class="rotulo">Contenido</p>
      <h2 class="indice-ttl">${esc(categoria.name)}</h2>
      <ol>
        ${piezas.map((p, i) => `
          <li><a href="#${esc(p.slug)}">
            <span class="i-tipo">${esc(p.tipo)}</span>
            <span class="i-nombre">${esc(p.nombre)}</span>
            <span class="i-pag">${paginaDe(i)}</span>
          </a></li>`).join("")}
      </ol>
    </div>
    ${pie(site, 2, total)}
  </section>`;

  const datosDe = (p) => {
    const f = fichas[p.slug] || {};
    const frases = (f.resumen || "").split(". ");
    const fuerte = frases[0] ? frases[0].replace(/\.$/, "") + "." : "";
    const resto = frases.slice(1).join(". ").trim();
    const material = materiales.find((m) => m.id === p.material);
    const colores = (p.colores || []).map((id) => gruposColor.find((c) => c.id === id)).filter(Boolean);
    const datos = [
      ["Disponibilidad", nombreOpcion("entrega", p.entrega)],
      ["Material", material?.nombre],
      ["Tipo de uso", nombreOpcion("uso", p.uso)],
      ["Base", nombreOpcion("base", p.base)],
      ["Respaldo", nombreOpcion("respaldo", p.respaldo)],
      ["Descansabrazos", nombreOpcion("brazos", p.brazos)],
      ["Plazas", p.plazas ? `${p.plazas}${p.plazas === "4" ? " o más" : ""}` : null],
    ...otrasListas(p),
    ].filter(([, v]) => v);
    const medidas = Object.entries(etiquetasMedida)
      .filter(([k]) => f.medidas?.[k])
      .slice(0, 4)
      .map(([k, e]) => `${e} ${f.medidas[k]}`);
    const url = `${site.domain}/muebles/${p.cat}/${p.slug}/`;
    return { fuerte, resto, colores, datos, medidas, url, ...fotos(p) };
  };

  const textoPieza = (p, d, nivel = "h2") => `
        <p class="rotulo tipo">${esc(p.tipo)}</p>
        <${nivel} class="nombre">${esc(p.nombre)}</${nivel}>
        <p class="resumen"><b>${esc(d.fuerte)}</b> <span>${esc(d.resto)}</span></p>
        ${d.colores.length ? `
        <div class="bloque">
          <p class="rotulo">Acabados disponibles</p>
          <div class="acabados">${d.colores.map((c) => `<span class="acabado"><span class="muestra" style="background:${esc(c.hex)}"></span>${esc(c.nombre)}</span>`).join("")}</div>
        </div>` : ""}
        ${d.medidas.length ? `<p class="medidas-linea">${esc(d.medidas.join(" · "))}</p>` : ""}`;
  const datosHtml = (d) => `<dl class="datos">${d.datos.map(([e, v]) => `<div><dt>${esc(e)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`;
  const enlaceHtml = (d) => `
    <p class="enlace">
      <span>Plano acotado, construcción y cuidados en la ficha técnica completa</span>
      <a href="${esc(d.url)}">Ver la ficha en línea</a>
    </p>`;

  let hojas;
  if (porHoja === 2) {
    hojas = [];
    for (let i = 0; i < n; i += 2) {
      const par = piezas.slice(i, i + 2);
      hojas.push(`
  <section class="hoja">
    ${cabecera("Catálogo", categoria.name)}
    <div class="par">
      ${par.map((p) => {
        const d = datosDe(p);
        return `
      <article class="media" id="${esc(p.slug)}">
        <div class="foto"><img src="${d.recorte}" alt=""></div>
        <div class="texto">
          ${textoPieza(p, d)}
          ${datosHtml(d)}
          ${enlaceHtml(d)}
        </div>
      </article>`;
      }).join("")}
    </div>
    ${pie(site, paginaDe(i), total)}
  </section>`);
    }
  } else hojas = piezas.map((p, i) => {
    const d = datosDe(p);
    const { recorte, ambiente, url } = d;
    return `
  <section class="hoja" id="${esc(p.slug)}">
    ${cabecera(categoria.name, `${p.tipo} ${p.nombre}`)}
    <div class="pz">
      <div class="foto"><img src="${recorte}" alt=""></div>
      <div class="texto">${textoPieza(p, d)}
      </div>
    </div>
    ${datosHtml(d)}
    ${enlaceHtml(d)}
    ${ambiente ? `<div class="pz-ambiente"><img src="${ambiente}" alt=""></div>` : ""}
    ${pie(site, primeraPieza + i, total, url.replace(/^https?:\/\//, ""))}
  </section>`;
  });

  return (portada({ site, titulo: categoria.name, meta: "", foto: fotoPortada }) + indice + hojas.join(""))
    .replaceAll("{{TOTAL}}", String(total));
}

// --- catálogo general: rejilla por categoría ---
// Se reparte por altura: cada hoja tiene un presupuesto en milímetros, un
// título de categoría gasta poco y cada fila de cuatro miniaturas gasta una
// fila. Una categoría que no cabe sigue en la hoja siguiente con su título.
const COLUMNAS = 4;
const ALTO_UTIL = 226; // mm entre la cabecera y el pie de una hoja A4
const ALTO_TITULO = 16;
const ALTO_FILA = 58;
export function hojasDeGeneral({ grupos, fotoPortada, miniatura, contexto }) {
  const { site } = contexto;

  const paginas = [];
  let actual = [];
  let libre = ALTO_UTIL;
  const nuevaHoja = () => {
    if (actual.length) paginas.push(actual);
    actual = [];
    libre = ALTO_UTIL;
  };
  for (const g of grupos) {
    let resto = g.piezas;
    while (resto.length) {
      // un título sin al menos una fila debajo se pasa a la hoja siguiente
      if (libre < ALTO_TITULO + ALTO_FILA) nuevaHoja();
      const filas = Math.min(Math.ceil(resto.length / COLUMNAS), Math.floor((libre - ALTO_TITULO) / ALTO_FILA));
      const tomo = resto.slice(0, filas * COLUMNAS);
      actual.push({ categoria: g.categoria, piezas: tomo });
      libre -= ALTO_TITULO + filas * ALTO_FILA;
      resto = resto.slice(tomo.length);
    }
  }
  nuevaHoja();
  const total = 1 + paginas.length;

  const hojas = paginas.map((bloques, i) => `
  <section class="hoja">
    ${cabecera("Catálogo general", mes.format(new Date()))}
    ${bloques.map((b) => `
      <div class="grupo-ttl"><h2>${esc(b.categoria.name)}</h2></div>
      <div class="rejilla">
        ${b.piezas.map((p) => `
          <a class="mini" href="${esc(`${site.domain}/muebles/${p.cat}/${p.slug}/`)}">
            <span class="mini-foto"><img src="${miniatura(p)}" alt=""></span>
            <p class="rotulo">${esc(p.tipo)}</p>
            <p class="mini-nombre">${esc(p.nombre)}</p>
          </a>`).join("")}
      </div>`).join("")}
    ${pie(site, 2 + i, total)}
  </section>`);

  return (portada({ site, titulo: "La colección completa", meta: "", foto: fotoPortada }) + hojas.join(""))
    .replaceAll("{{TOTAL}}", String(total));
}

export const documentoCatalogo = (hojas, titulo) => `<!doctype html>
<html lang="es-MX"><head><meta charset="utf-8"><title>${esc(titulo)}</title>
<style>${ESTILOS}${ESTILOS_CATALOGO}</style></head><body>${hojas}</body></html>`;
