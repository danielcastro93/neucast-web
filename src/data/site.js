// Datos de la empresa: los usa el encabezado, el pie, los botones de WhatsApp y
// el esquema Organization que viaja en las 48 páginas.
//
// PARA WORDPRESS: ver docs/wordpress.md, apartado 3.1. Lo que hay que sustituir
// está marcado abajo con "simulado". Cuidado con `domain`: de ahí salen las
// canónicas, el mapa del sitio y el robots.txt, así que si queda mal, quedan
// mal los tres de golpe.
//
// Datos demo del prototipo.
// En Fase 3 estos objetos se reemplazan por fetch a WordPress (WPGraphQL/REST).
// La forma de cada objeto es la que tendrán los campos del CMS, así que el
// diseño no cambia cuando se conecte: solo cambia de dónde vienen los datos.

export const site = {
  name: "Neucast",
  domain: "https://neucast.com.mx",
  whatsapp: "5215500000000", // ← simulado; definir número real antes del lanzamiento
  email: "contacto.ventas@neucast.com.mx", // ← simulado; falta el real
  // confirmadas por el cliente el 23 de septiembre de 2026
  social: {
    facebook: "https://www.facebook.com/neucast",
    instagram: "https://www.instagram.com/neucastoficial",
  },
};

// Tarjeta de identidad de la marca. La emite el layout, así que viaja en todas
// las páginas: el home es la que Google toma como raíz del sitio y era la única
// que no declaraba nada. Las páginas que dicen `isPartOf` con esta matrícula la
// encuentran ahora en su propia página y no en otra.
export const descripcionMarca =
  "Neucast es una marca mexicana de mobiliario de diseño para espacios corporativos. Vendemos desde una pieza hasta el equipamiento completo de oficinas, salas de juntas, recepciones, cafeterías, áreas comunes y espacios comerciales. Envíos e instalación en todo México.";

export const organizacion = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.domain}/#organizacion`,
  name: site.name,
  url: site.domain,
  // Google pide una imagen cuadrada de 112 px como mínimo, así que el favicon
  // SVG no le sirve.
  logo: `${site.domain}/img/logo-neucast.png`,
  description: descripcionMarca,
  email: site.email,
  areaServed: { "@type": "Country", name: "México" },
  sameAs: [site.social.instagram, site.social.facebook],
  knowsAbout: [
    "Mobiliario de oficina",
    "Muebles para oficina",
    "Mobiliario corporativo",
    "Diseño de espacios de trabajo",
    "Equipamiento de salas de juntas",
  ],
};

export const waLink = (msg) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;

// photo = foto de ambiente (cards de categoría y menú)
// alt   = texto alternativo editable desde el CMS
// La entrada a "todos los muebles" necesita su propia imagen: tomar prestada
// la de sillas ejecutivas hacía que el menú pareciera tener dos veces la misma
// categoría. Esta toma es del piso completo, con escritorios, sillas, guardado
// y lounge en el mismo encuadre.
export const todosLosMuebles = {
  photo: "/img/cats/todos-los-muebles.jpg",
  alt: "Piso de oficina con escritorios, sillería, guardado y área lounge",
};

export const categories = [
  {
    slug: "sillas-ejecutivas",
    name: "Sillas ejecutivas",
    photo: "/img/cats/sillas-ejecutivas.jpg",
    alt: "Silla ejecutiva de diseño en una oficina privada",
    // SEO propio de la categoría: cada una posiciona por sus palabras,
    // una sola página no puede hacerlo por las ocho.
    h1: "Sillas ejecutivas",
    title: "Sillas ejecutivas y de dirección para oficina | Neucast",
    desc: "Sillas ejecutivas y de dirección con respaldo de malla o tapizado, soporte lumbar y descansabrazos ajustables. Envío e instalación en todo México.",
    intro: "Respaldo alto o con cabecera, soporte lumbar y mecanismos para la jornada completa.",
  },
  {
    slug: "sillas-operativas",
    name: "Sillas operativas",
    photo: "/img/cats/sillas-operativas.jpg",
    alt: "Sillas operativas en un área de trabajo abierta",
    // SEO propio de la categoría: cada una posiciona por sus palabras,
    // una sola página no puede hacerlo por las ocho.
    h1: "Sillas operativas y ergonómicas",
    title: "Sillas operativas y ergonómicas de oficina | Neucast",
    desc: "Sillería operativa y ergonómica para jornada completa: respaldo de malla, altura y descansabrazos regulables. Envío e instalación en todo México.",
    intro: "Ergonomía real y materiales que resisten la rotación diaria de un piso de trabajo.",
  },
  {
    slug: "salas-de-juntas",
    name: "Salas de juntas",
    photo: "/img/cats/salas-de-juntas.jpg",
    alt: "Sala de juntas con mesa y sillería corporativa",
    // SEO propio de la categoría: cada una posiciona por sus palabras,
    // una sola página no puede hacerlo por las ocho.
    h1: "Mesas para sala de juntas",
    title: "Mesas para sala de juntas y consejo | Neucast",
    desc: "Mesas de juntas y de consejo en madera, cristal o cubierta técnica, con medidas a la escala de tu sala. Envío e instalación en todo México.",
    intro: "Medidas que se ajustan a la sala, no al revés, y acabados que envejecen bien.",
  },
  {
    slug: "escritorios",
    name: "Escritorios",
    photo: "/img/cats/escritorios.jpg",
    alt: "Escritorios de oficina junto a ventanales",
    // SEO propio de la categoría: cada una posiciona por sus palabras,
    // una sola página no puede hacerlo por las ocho.
    h1: "Escritorios de oficina",
    title: "Escritorios ejecutivos y operativos de oficina | Neucast",
    desc: "Escritorios ejecutivos, operativos, en L y bench de trabajo, con paso de cables y credenzas a juego. Envío e instalación en todo México.",
    intro: "Rectos, en L o bench, con paso de cables resuelto y credenzas que combinan.",
  },
  {
    slug: "cafeterias",
    name: "Cafeterías",
    photo: "/img/cats/cafeterias.jpg",
    alt: "Cafetería corporativa con mesas y sillería de madera",
    // SEO propio de la categoría: cada una posiciona por sus palabras,
    // una sola página no puede hacerlo por las ocho.
    h1: "Mobiliario para cafetería corporativa",
    title: "Mobiliario para cafetería y comedor de oficina | Neucast",
    desc: "Sillas apilables, bancos altos y mesas para cafeterías y comedores corporativos. Materiales que aguantan la rotación diaria.",
    intro: "Piezas apilables y superficies que aguantan la rotación y la limpieza diaria.",
  },
  {
    slug: "lounge-y-areas-comunes",
    name: "Lounge y áreas comunes",
    photo: "/img/cats/lounge-y-areas-comunes.jpg",
    alt: "Área lounge de oficina con sillones y mesas de apoyo",
    // SEO propio de la categoría: cada una posiciona por sus palabras,
    // una sola página no puede hacerlo por las ocho.
    h1: "Lounge y áreas comunes",
    title: "Sofás y mobiliario para áreas comunes de oficina | Neucast",
    desc: "Sofás, sillones, bancas de espera y mesas de centro para áreas lounge y recepciones corporativas. Envío e instalación en todo México.",
    intro: "Sofás de una a cuatro plazas, sillones y mesas de apoyo para esperar y conversar.",
  },
  {
    slug: "almacenamiento",
    name: "Almacenamiento",
    photo: "/img/cats/almacenamiento.jpg",
    alt: "Mueble de almacenamiento con libros y accesorios",
    // SEO propio de la categoría: cada una posiciona por sus palabras,
    // una sola página no puede hacerlo por las ocho.
    h1: "Almacenamiento y guardado",
    title: "Libreros, credenzas y archiveros de oficina | Neucast",
    desc: "Libreros, credenzas y archiveros para oficina, modulares y a juego con el resto del mobiliario. Envío e instalación en todo México.",
    intro: "Libreros, credenzas y archiveros modulares que combinan con tus escritorios.",
  },
  {
    slug: "exteriores",
    name: "Exteriores",
    photo: "/img/cats/exteriores.jpg",
    alt: "Terraza corporativa con mobiliario de exterior",
    // SEO propio de la categoría: cada una posiciona por sus palabras,
    // una sola página no puede hacerlo por las ocho.
    h1: "Mobiliario de exterior",
    title: "Mobiliario de exterior para terrazas corporativas | Neucast",
    desc: "Bancas y mesas de exterior para terrazas y patios corporativos, con materiales resistentes a la intemperie.",
    intro: "Materiales pensados para el sol y la lluvia, con el mismo diseño de adentro.",
  },
];

// Las piezas viven en catalogo.js, que es la única fuente. Aquí solo se elige
// cuáles se destacan en el home, para que el home nunca enlace a una pieza que
// no existe en el catálogo.
export const destacados = [
  "silla-polanco",
  "mesa-tempo",
  "silla-nube",
  "escritorio-eje",
  "silla-orbita",
  "librero-lineal",
  "mesa-piedra",
  "banca-brisa",
];


