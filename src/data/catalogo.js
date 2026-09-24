// El catálogo: piezas, filtros y bloques editoriales.
//
// PARA WORDPRESS: ver docs/wordpress.md, apartado 3.2. Es un tipo de contenido
// `pieza` con campos personalizados. Los campos de filtro (uso, respaldo,
// plazas, brazos, base, extras, material, colores, entrega) NO son texto libre:
// solo aceptan los valores declarados en `filtros`, `materiales` y
// `gruposColor` de este mismo archivo. Si el CMS manda otro valor, la pieza
// desaparece al filtrar por ese campo. En WordPress tienen que ser listas
// desplegables o taxonomías, nunca un campo de texto.
//
// Datos demo del catálogo. La forma de cada objeto es la que tendrán los campos
// del CMS en fase 3, así que el diseño no cambia cuando se conecte.
//
// NOMENCLATURA: las piezas llevan nombre propio de Neucast. El criterio es que
// el nombre diga algo de la pieza. Unas son lugares mexicanos cuyo carácter
// encaja (Polanco y Reforma para dirección, Condesa y Roma para sofás de
// sobremesa, Tulum para una apilable ligera) y otras describen la forma o la
// función (Ángulo para el escritorio en L, Hilera para el bench, Andén para la
// banca de espera). Ver docs/catalogo.md.
//
// Cada filtro sale de un campo, nunca del texto libre, o el filtrado no es
// fiable. Los valores posibles están declarados aquí abajo.

// Los colores de tapicería tienen nombre comercial: plumbago, fiusha,
// capuchino, mist, camello... Nadie busca así, por eso cada uno se mapea a un
// grupo filtrable y el nombre comercial se guarda para la ficha de la pieza.
export const gruposColor = [
  { id: "negro",  nombre: "Negro",  hex: "#1D1D1B" },
  { id: "gris",   nombre: "Gris",   hex: "#8A8A87" },
  { id: "blanco", nombre: "Blanco", hex: "#EFEEE8" },
  { id: "beige",  nombre: "Beige",  hex: "#C9B99B" },
  { id: "cafe",   nombre: "Café",   hex: "#5A4032" },
  { id: "azul",   nombre: "Azul",   hex: "#2B3A67" },
  { id: "verde",  nombre: "Verde",  hex: "#4A5D3A" },
  { id: "rojo",   nombre: "Rojo",   hex: "#8C2F2F" },
];

// Familias de tapicería y acabado tal como vienen en el muestrario
export const materiales = [
  { id: "smartmesh",    nombre: "Malla SmartMesh" },
  { id: "e-fabric",     nombre: "Tela E-Fabric" },
  { id: "technoleather",nombre: "Technoleather" },
  { id: "eco-leather",  nombre: "Eco-Leather" },
  { id: "piel",         nombre: "Piel genuina" },
  { id: "madera",       nombre: "Madera" },
  { id: "metal",        nombre: "Metal" },
  { id: "cristal",      nombre: "Cristal" },
];

// Grupos de filtro del panel completo. `campo` es la propiedad del producto.
export const filtros = [
  {
    campo: "uso",
    nombre: "Tipo de uso",
    opciones: [
      { id: "direccion",    nombre: "Dirección" },
      { id: "ejecutiva",    nombre: "Ejecutiva" },
      { id: "operativa",    nombre: "Operativa" },
      { id: "visita",       nombre: "Visita" },
      { id: "colectividad", nombre: "Colectividad" },
    ],
  },
  {
    campo: "respaldo",
    nombre: "Respaldo",
    opciones: [
      { id: "cabecera", nombre: "Con cabecera" },
      { id: "alto",     nombre: "Alto" },
      { id: "bajo",     nombre: "Bajo" },
    ],
  },
  {
    campo: "plazas",
    nombre: "Plazas",
    opciones: [
      { id: "1", nombre: "1 plaza" },
      { id: "2", nombre: "2 plazas" },
      { id: "3", nombre: "3 plazas" },
      { id: "4", nombre: "4 o más" },
    ],
  },
  {
    campo: "brazos",
    nombre: "Descansabrazos",
    opciones: [
      { id: "sin",       nombre: "Sin brazos" },
      { id: "fijos",     nombre: "Fijos" },
      { id: "ajustables",nombre: "Ajustables" },
    ],
  },
  {
    campo: "base",
    nombre: "Base",
    opciones: [
      { id: "aluminio",   nombre: "Aluminio pulido" },
      { id: "nylon",      nombre: "Nylon" },
      { id: "trineo",     nombre: "Trineo" },
      { id: "cantilever", nombre: "Cantilever" },
      { id: "patas",      nombre: "Cuatro patas" },
    ],
  },
  {
    campo: "extras",
    nombre: "Características",
    opciones: [
      { id: "apilable",  nombre: "Apilable" },
      { id: "ruedas",    nombre: "Con ruedas" },
      { id: "reclinable",nombre: "Reclinable" },
      { id: "modular",   nombre: "Modular" },
    ],
  },
  {
    campo: "entrega",
    nombre: "Disponibilidad",
    // Sustituye al filtro de precio: no publicamos precios, pero el plazo de
    // entrega sí lo tenemos y sí decide una compra.
    opciones: [
      { id: "inmediata", nombre: "Entrega inmediata" },
      { id: "10dias",    nombre: "Hasta 10 días" },
      { id: "pedido",    nombre: "Sobre pedido" },
    ],
  },
];

const p = (o) => ({ nuevo: false, plazas: null, extras: [], ...o });

export const piezas = [
  p({ slug:"silla-polanco", nombre:"Polanco", cat:"sillas-ejecutivas", tipo:"Silla de dirección",
    img:["/img/products/silla-ejecutiva-aria.png","/img/cats/sillas-ejecutivas.jpg"],
    alt:"Silla de dirección Polanco con respaldo de malla y base de aluminio",
    nuevo:true, uso:"direccion", respaldo:"cabecera", brazos:"ajustables", base:"aluminio",
    material:"smartmesh", colores:["negro","gris"], extras:["ruedas","reclinable"], entrega:"10dias" }),

  p({ slug:"silla-reforma", nombre:"Reforma", cat:"sillas-ejecutivas", tipo:"Silla ejecutiva",
    img:["/img/products/silla-ejecutiva-aria.png","/img/cats/sillas-ejecutivas.jpg"],
    alt:"Silla ejecutiva Reforma tapizada en azul",
    nuevo:true, uso:"ejecutiva", respaldo:"alto", brazos:"ajustables", base:"aluminio",
    material:"e-fabric", colores:["azul","negro","gris"], extras:["ruedas","reclinable"], entrega:"inmediata" }),

  p({ slug:"silla-catedra", nombre:"Cátedra", cat:"sillas-ejecutivas", tipo:"Silla ejecutiva",
    img:["/img/products/silla-ejecutiva-aria.png","/img/cats/sillas-ejecutivas.jpg"],
    alt:"Silla ejecutiva Cátedra tapizada en piel negra",
    uso:"ejecutiva", respaldo:"alto", brazos:"fijos", base:"aluminio",
    material:"piel", colores:["negro","cafe"], extras:["ruedas"], entrega:"pedido" }),

  p({ slug:"silla-agora", nombre:"Ágora", cat:"sillas-ejecutivas", tipo:"Silla de visita",
    img:["/img/products/silla-ejecutiva-aria.png","/img/cats/sillas-ejecutivas.jpg"],
    alt:"Silla de visita Ágora con base cantilever",
    uso:"visita", respaldo:"bajo", brazos:"fijos", base:"cantilever",
    material:"technoleather", colores:["negro","beige"], entrega:"10dias" }),

  p({ slug:"silla-orbita", nombre:"Órbita", cat:"sillas-operativas", tipo:"Silla operativa",
    img:["/img/products/silla-operativa-orbita.png","/img/cats/sillas-operativas.jpg"],
    alt:"Silla operativa Órbita negra con ruedas",
    uso:"operativa", respaldo:"bajo", brazos:"ajustables", base:"nylon",
    material:"smartmesh", colores:["negro"], extras:["ruedas"], entrega:"inmediata" }),

  p({ slug:"silla-vertice", nombre:"Vértice", cat:"sillas-operativas", tipo:"Silla operativa",
    img:["/img/products/silla-operativa-orbita.png","/img/cats/sillas-operativas.jpg"],
    alt:"Silla operativa Vértice con respaldo de malla gris",
    nuevo:true, uso:"operativa", respaldo:"bajo", brazos:"fijos", base:"nylon",
    material:"smartmesh", colores:["gris","negro"], extras:["ruedas"], entrega:"inmediata" }),

  p({ slug:"silla-nodo", nombre:"Nodo", cat:"sillas-operativas", tipo:"Silla multitask",
    img:["/img/products/silla-operativa-orbita.png","/img/cats/sillas-operativas.jpg"],
    alt:"Silla multitask Nodo sin brazos",
    uso:"operativa", respaldo:"bajo", brazos:"sin", base:"nylon",
    material:"e-fabric", colores:["negro","verde","rojo"], extras:["ruedas"], entrega:"10dias" }),

  p({ slug:"mesa-tempo", nombre:"Tempo", cat:"salas-de-juntas", tipo:"Mesa de juntas",
    img:["/img/products/mesa-juntas-tempo.png","/img/cats/salas-de-juntas.jpg"],
    alt:"Mesa de juntas Tempo alargada en madera oscura",
    nuevo:true, uso:"ejecutiva", respaldo:null, brazos:null, base:"patas",
    material:"madera", colores:["cafe","negro"], extras:["modular"], entrega:"pedido" }),

  p({ slug:"mesa-cabildo", nombre:"Cabildo", cat:"salas-de-juntas", tipo:"Mesa de consejo",
    img:["/img/products/mesa-juntas-tempo.png","/img/cats/salas-de-juntas.jpg"],
    alt:"Mesa de consejo Cabildo con cubierta clara",
    uso:"direccion", respaldo:null, brazos:null, base:"patas",
    material:"madera", colores:["beige","blanco"], extras:["modular"], entrega:"pedido" }),

  p({ slug:"mesa-circulo", nombre:"Círculo", cat:"salas-de-juntas", tipo:"Mesa de juntas",
    img:["/img/products/mesa-juntas-tempo.png","/img/cats/salas-de-juntas.jpg"],
    alt:"Mesa de juntas Círculo redonda para cuatro personas",
    uso:"ejecutiva", respaldo:null, brazos:null, base:"patas",
    material:"cristal", colores:["negro","gris"], entrega:"10dias" }),

  p({ slug:"escritorio-eje", nombre:"Eje", cat:"escritorios", tipo:"Escritorio recto",
    img:["/img/products/escritorio-eje.png","/img/cats/escritorios.jpg"],
    alt:"Escritorio Eje minimalista con cubierta clara",
    uso:"operativa", respaldo:null, brazos:null, base:"patas",
    material:"madera", colores:["beige","blanco"], extras:["modular"], entrega:"inmediata" }),

  p({ slug:"escritorio-angulo", nombre:"Ángulo", cat:"escritorios", tipo:"Escritorio en L",
    img:["/img/products/escritorio-eje.png","/img/cats/escritorios.jpg"],
    alt:"Escritorio Ángulo en L con credenza lateral",
    nuevo:true, uso:"ejecutiva", respaldo:null, brazos:null, base:"patas",
    material:"madera", colores:["cafe","gris"], extras:["modular"], entrega:"10dias" }),

  p({ slug:"escritorio-hilera", nombre:"Hilera", cat:"escritorios", tipo:"Bench de trabajo",
    img:["/img/products/escritorio-eje.png","/img/cats/escritorios.jpg"],
    alt:"Bench de trabajo Hilera para cuatro posiciones",
    uso:"operativa", respaldo:null, brazos:null, base:"patas",
    material:"metal", colores:["blanco","gris"], extras:["modular"], entrega:"pedido" }),

  p({ slug:"silla-nube", nombre:"Nube", cat:"cafeterias", tipo:"Silla de cafetería",
    img:["/img/products/silla-cafeteria-nube.png","/img/cats/cafeterias.jpg"],
    alt:"Silla Nube blanca con patas de madera para cafetería",
    uso:"colectividad", respaldo:"bajo", brazos:"sin", base:"patas",
    material:"madera", colores:["blanco","beige"], extras:["apilable"], entrega:"inmediata" }),

  p({ slug:"silla-tulum", nombre:"Tulum", cat:"cafeterias", tipo:"Silla apilable",
    img:["/img/products/silla-cafeteria-nube.png","/img/cats/cafeterias.jpg"],
    alt:"Silla apilable Tulum con estructura de trineo",
    nuevo:true, uso:"colectividad", respaldo:"bajo", brazos:"sin", base:"trineo",
    material:"e-fabric", colores:["verde","azul","negro"], extras:["apilable"], entrega:"inmediata" }),

  p({ slug:"banco-mirador", nombre:"Mirador", cat:"cafeterias", tipo:"Banco alto",
    img:["/img/products/silla-cafeteria-nube.png","/img/cats/cafeterias.jpg"],
    alt:"Banco alto Mirador con descansapiés metálico",
    uso:"colectividad", respaldo:"bajo", brazos:"sin", base:"patas",
    material:"metal", colores:["negro","rojo"], extras:["apilable"], entrega:"10dias" }),

  p({ slug:"sofa-condesa", nombre:"Condesa", cat:"lounge-y-areas-comunes", tipo:"Sofá",
    img:["/img/products/mesa-lounge-piedra.png","/img/cats/lounge-y-areas-comunes.jpg"],
    alt:"Sofá Condesa de tres plazas tapizado en tela",
    nuevo:true, uso:"colectividad", respaldo:"bajo", brazos:"fijos", base:"patas",
    material:"e-fabric", colores:["gris","azul"], plazas:"3", extras:["modular"], entrega:"pedido" }),

  p({ slug:"sofa-roma", nombre:"Roma", cat:"lounge-y-areas-comunes", tipo:"Sofá",
    img:["/img/products/mesa-lounge-piedra.png","/img/cats/lounge-y-areas-comunes.jpg"],
    alt:"Sofá Roma de dos plazas tapizado en piel",
    uso:"colectividad", respaldo:"bajo", brazos:"fijos", base:"patas",
    material:"eco-leather", colores:["cafe","negro"], plazas:"2", entrega:"10dias" }),

  p({ slug:"sillon-coyoacan", nombre:"Coyoacán", cat:"lounge-y-areas-comunes", tipo:"Sillón",
    img:["/img/products/mesa-lounge-piedra.png","/img/cats/lounge-y-areas-comunes.jpg"],
    alt:"Sillón Coyoacán individual tapizado",
    uso:"colectividad", respaldo:"bajo", brazos:"fijos", base:"patas",
    material:"e-fabric", colores:["verde","beige"], plazas:"1", entrega:"10dias" }),

  p({ slug:"mesa-piedra", nombre:"Piedra", cat:"lounge-y-areas-comunes", tipo:"Mesa de centro",
    img:["/img/products/mesa-lounge-piedra.png","/img/cats/lounge-y-areas-comunes.jpg"],
    alt:"Mesa de centro Piedra con base cónica",
    uso:"colectividad", respaldo:null, brazos:null, base:"patas",
    material:"madera", colores:["beige","negro"], entrega:"inmediata" }),

  p({ slug:"banca-anden", nombre:"Andén", cat:"lounge-y-areas-comunes", tipo:"Banca de espera",
    img:["/img/products/mesa-lounge-piedra.png","/img/cats/lounge-y-areas-comunes.jpg"],
    alt:"Banca de espera Andén de cuatro plazas",
    uso:"colectividad", respaldo:"bajo", brazos:"sin", base:"trineo",
    material:"technoleather", colores:["negro","gris"], plazas:"4", entrega:"pedido" }),

  p({ slug:"librero-lineal", nombre:"Lineal", cat:"almacenamiento", tipo:"Librero",
    img:["/img/products/librero-lineal.png","/img/cats/almacenamiento.jpg"],
    alt:"Librero Lineal modular con repisas abiertas",
    uso:"operativa", respaldo:null, brazos:null, base:null,
    material:"madera", colores:["blanco","cafe"], extras:["modular"], entrega:"10dias" }),

  p({ slug:"credenza-bosques", nombre:"Bosques", cat:"almacenamiento", tipo:"Credenza",
    img:["/img/products/librero-lineal.png","/img/cats/almacenamiento.jpg"],
    alt:"Credenza Bosques de dos puertas",
    nuevo:true, uso:"ejecutiva", respaldo:null, brazos:null, base:null,
    material:"madera", colores:["cafe","blanco"], extras:["modular"], entrega:"pedido" }),

  p({ slug:"archivero-bitacora", nombre:"Bitácora", cat:"almacenamiento", tipo:"Archivero",
    img:["/img/products/librero-lineal.png","/img/cats/almacenamiento.jpg"],
    alt:"Archivero Bitácora de dos gavetas con ruedas",
    uso:"operativa", respaldo:null, brazos:null, base:null,
    material:"metal", colores:["blanco","negro"], extras:["ruedas"], entrega:"inmediata" }),

  p({ slug:"banca-brisa", nombre:"Brisa", cat:"exteriores", tipo:"Banca de exterior",
    img:["/img/products/banca-exterior-brisa.png","/img/cats/exteriores.jpg"],
    alt:"Banca Brisa de exterior en metal verde",
    uso:"colectividad", respaldo:"bajo", brazos:"sin", base:"patas",
    material:"metal", colores:["verde","negro"], plazas:"3", extras:["apilable"], entrega:"10dias" }),

  p({ slug:"mesa-patio", nombre:"Patio", cat:"exteriores", tipo:"Mesa de terraza",
    img:["/img/products/banca-exterior-brisa.png","/img/cats/exteriores.jpg"],
    alt:"Mesa de terraza Patio con cubierta resistente a la intemperie",
    nuevo:true, uso:"colectividad", respaldo:null, brazos:null, base:"patas",
    material:"metal", colores:["negro","beige"], entrega:"pedido" }),
];

// Bloques editoriales que se intercalan en la cuadrícula. Cada uno OCUPA EL
// LUGAR DE DOS PIEZAS, así que tiene que llevar a algún lado: si es solo una
// foto bonita, cuesta dos productos y no devuelve nada.
// ---------- Bloques editoriales del listado ----------
//
// Reglas decididas el 23 de septiembre de 2026, para que no dependan de cuántas
// piezas tenga el catálogo el día que se llene:
//
// 1. CUÁNTOS. Dos por listado como máximo, y los dos dentro de las primeras 20
//    piezas. No se repiten hacia abajo por largo que sea el catálogo. Quien ya
//    pasó de la pieza 20 viene a comparar, no a descubrir: ahí un bloque cuesta
//    más atención de la que devuelve, y repetido cada N se vuelve ruido.
//
// 2. DÓNDE. Tras la pieza 8 y tras la 20. En la cuadrícula de cuatro columnas el
//    bloque ocupa dos, así que esas posiciones lo dejan a la izquierda y a la
//    derecha de su fila, con dos filas completas de piezas en medio.
//
// 3. CUÁNDO NO. Un bloque solo entra si después de él queda al menos una fila
//    completa de piezas. Con menos, manda sobre el listado en vez de
//    acompañarlo. En números: el primero pide 12 piezas y el segundo 24. Por eso
//    hoy ninguna categoría los muestra.
//
// 4. DE QUÉ. Dentro de una categoría el bloque tiene que hablar de esa
//    categoría. Un "explora los espacios" genérico encima de sillas es relleno y
//    se nota. Si no hay material propio, no va ningún bloque: el listado se
//    aguanta solo.
const POSICIONES_BLOQUE = [8, 20];

// Solo para /muebles/, que es el único listado sin tema: ahí cualquier proyecto
// es pertinente porque la página los cubre todos. El primero manda al listado
// completo y el segundo a un proyecto concreto: uno prueba que hay oficio, el
// otro enseña una pieza instalada.
const bloquesGenerales = [
  {
    img: "/img/cta-sillones.jpg",
    alt: "Área común corporativa con sillones instalados por Neucast",
    antetitulo: "Trabajo terminado",
    titulo: "Oficinas que ya amueblamos completas",
    enlace: "/proyectos/",
    cta: "Ver los proyectos",
  },
  {
    img: "/img/proyecto-cafeteria.jpg",
    alt: "Cafetería corporativa amueblada por Neucast",
    antetitulo: "Proyecto · Ciudad de México",
    titulo: "Una cafetería para 300 personas",
    enlace: "/proyectos/cafeteria-corporativa-cdmx/",
    cta: "Recorrer el proyecto",
  },
];

// Una categoría solo lleva bloque si tenemos algo que de verdad sea de ella.
// Las que faltan no llevan ninguno, a propósito.
const bloquesPorCategoria = {
  cafeterias: [
    {
      img: "/img/proyecto-cafeteria.jpg",
      alt: "Cafetería corporativa amueblada por Neucast",
      antetitulo: "Proyecto · Ciudad de México",
      titulo: "Una cafetería para 300 personas",
      enlace: "/proyectos/cafeteria-corporativa-cdmx/",
      cta: "Recorrer el proyecto",
    },
  ],
  // Lounge se queda sin bloque a propósito: no hay un proyecto de esa categoría
  // todavía, y la regla es que sin material propio no va ninguno.
};

// Devuelve los bloques que le tocan a un listado, ya colocados y ya filtrados
// por la regla 3. `cat` en null significa el catálogo completo.
export const bloquesPara = (cat, nPiezas) =>
  (cat ? bloquesPorCategoria[cat] || [] : bloquesGenerales)
    .slice(0, POSICIONES_BLOQUE.length)
    .map((b, i) => ({ ...b, tras: POSICIONES_BLOQUE[i] }))
    .filter((b) => nPiezas >= b.tras + 4);

// Ruta canónica de una pieza. Vive aquí para que no vuelva a haber dos formas
// de URL para el mismo producto.
export const rutaPieza = (pieza) => `/muebles/${pieza.cat}/${pieza.slug}/`;

export const buscarPieza = (slug) => piezas.find((p) => p.slug === slug);
