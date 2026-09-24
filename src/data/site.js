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
  },
  {
    slug: "sillas-operativas",
    name: "Sillas operativas",
    photo: "/img/cats/sillas-operativas.jpg",
    alt: "Sillas operativas en un área de trabajo abierta",
  },
  {
    slug: "salas-de-juntas",
    name: "Salas de juntas",
    photo: "/img/cats/salas-de-juntas.jpg",
    alt: "Sala de juntas con mesa y sillería corporativa",
  },
  {
    slug: "escritorios",
    name: "Escritorios",
    photo: "/img/cats/escritorios.jpg",
    alt: "Escritorios de oficina junto a ventanales",
  },
  {
    slug: "cafeterias",
    name: "Cafeterías",
    photo: "/img/cats/cafeterias.jpg",
    alt: "Cafetería corporativa con mesas y sillería de madera",
  },
  {
    slug: "lounge-y-areas-comunes",
    name: "Lounge y áreas comunes",
    photo: "/img/cats/lounge-y-areas-comunes.jpg",
    alt: "Área lounge de oficina con sillones y mesas de apoyo",
  },
  {
    slug: "almacenamiento",
    name: "Almacenamiento",
    photo: "/img/cats/almacenamiento.jpg",
    alt: "Mueble de almacenamiento con libros y accesorios",
  },
  {
    slug: "exteriores",
    name: "Exteriores",
    photo: "/img/cats/exteriores.jpg",
    alt: "Terraza corporativa con mobiliario de exterior",
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


