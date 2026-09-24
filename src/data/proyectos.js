// Los proyectos instalados.
//
// PARA WORDPRESS: ver docs/wordpress.md, apartado 3.4. Es un tipo de contenido
// `proyecto` con un campo repetidor de bloques. Es lo más laborioso de modelar
// y lo que más rinde: es lo que evita que todos los proyectos se vean iguales.
// Las medidas de cada texto están en el apartado 4 del mismo documento; si se
// respetan, las páginas se ven parejas entre sí.
//
// Proyectos instalados.
//
// La página de cada proyecto se arma con una secuencia de bloques. Los cuatro
// casos llevan hoy la misma secuencia, que es la plantilla de la sección:
//
//   imagen · capítulo · dúo · destacado · capítulo · escenas ·
//   capítulo · imagen · dúo · destacado · capítulo · video
//
// Nunca dos imágenes seguidas ni dos capítulos seguidos. Si un proyecto pide
// otro ritmo, los bloques se reordenan sin tocar la página.
//
// Tipos de bloque:
//   capitulo   título y dos párrafos, en dos columnas
//   imagen     una foto a todo el ancho
//   duo        dos fotos al 50 por ciento
//   escenas    carrusel de zonas, cada una con puntos sobre las piezas
//   video      video a todo el ancho; se reproduce en su lugar, no en el visor
//   destacado  una línea grande, para respirar entre capítulos
//
// Cualquier imagen abre el visor de pantalla completa, en el mismo orden en que
// aparece en la página. La portada y el video quedan fuera: la portada es solo
// la imagen que vende el proyecto y el video se reproduce donde está.
//
// OJO: los cuatro casos son de maqueta. Los textos, las ciudades, los años y
// las cifras se escribieron para poder ver la sección completa y para dejar por
// escrito qué campos tiene que traer WordPress. Nada está confirmado. Ver
// docs/pendientes.md.
//
// Sobre el nombre del cliente: se usa el sector y la ciudad, no la razón
// social, porque nombrar a un cliente pide su autorización por escrito y casi
// nunca la hay. Si se consigue, el campo `cliente` la sustituye.

// hotspots: x/y en escritorio, mx/my en móvil; si faltan, se usa x/y
const p = (o) => ({ cliente: null, ficha: [], piezas: [], bloques: [], ...o });

export const proyectos = [
  p({
    slug: "cafeteria-corporativa-cdmx",
    nombre: "Una cafetería para 300 personas",
    sector: "Corporativo de servicios financieros",
    ciudad: "Ciudad de México",
    anio: "2025",
    espacio: "Cafetería y comedor",
    escala: "300 colaboradores",
    superficie: "420 m²",
    portada: {
      img: "/img/proyecto-cafeteria.jpg",
      alt: "Cafetería corporativa con mesas redondas, sillería de madera y banca corrida",
    },
    resumen:
      "El comedor se usaba dos horas al día. Hoy también sirve para juntas cortas y para trabajar fuera del escritorio.",
    intro: [
      "Tenían un comedor de turno único que a las cuatro de la tarde quedaba muerto. Querían que la gente se quedara ahí después de comer, sin convertirlo en una sala de juntas más ni perder capacidad a la hora pico.",
      "El presupuesto no daba para ampliar el área, así que todo tenía que salir de reacomodar lo que ya existía y de cambiar el mobiliario por piezas que sirvieran para dos cosas a la vez.",
      "La cocina y la barra de servicio no se tocaron: el proyecto entero se resolvió del lado del comedor.",
    ],
    ficha: [{ etiqueta: "Piezas instaladas", valor: "148" }],
    bloques: [
      {
        tipo: "imagen",
        img: "/img/cats/cafeterias.jpg",
        alt: "El área de comida con mesas redondas y sillería de madera",
        pie: "La mesa redonda de cuatro es la unidad del comedor: se junta con otra para seis y se separa en treinta segundos.",
      },
      {
        tipo: "capitulo",
        titulo: "Medimos el uso, no el plano",
        texto: [
          "Tres visitas en horarios distintos para ver cuánta gente había, dónde se sentaba y qué mesas quedaban siempre libres.",
          "El plano decía ciento veinte lugares y en el pico se usaban noventa. Esa diferencia fue la que liberó el área de trabajo suelto.",
        ],
      },
      {
        tipo: "duo",
        medios: [
          {
            img: "/img/nosotros/pilar-forma.jpg",
            alt: "Detalle de una silla tapizada del comedor",
            pie: "Asiento tapizado, para quedarse",
          },
          {
            img: "/img/nosotros/cierre-material.jpg",
            alt: "Detalle del textil de la tapicería",
            pie: "Textil que aguanta el uso diario",
          },
        ],
      },
      {
        tipo: "destacado",
        texto: ["Un comedor que solo sirve para comer", "está apagado veintidós horas al día."],
      },
      {
        tipo: "capitulo",
        titulo: "Tres alturas en vez de una",
        texto: [
          "Mesa corrida para el turno de comida, barra alta para quien llega solo y mesas bajas con banca para las juntas de cuatro.",
          "Las tres conviven en la misma sala sin dividirla: lo que cambia es la altura, no el material ni el color.",
        ],
      },
      {
        tipo: "escenas",
        escenas: [
          {
            img: "/img/espacio-lounge.jpg",
            alt: "Zona de estar del comedor con sillones y mesa de centro",
            pie: "Zona de estar. Para el café de media mañana y las llamadas cortas.",
            hotspots: [
              { x: 44, y: 62, slug: "sillon-coyoacan" },
              { x: 66, y: 70, my: 76, slug: "mesa-piedra" },
            ],
          },
          {
            img: "/img/cats/lounge-y-areas-comunes.jpg",
            alt: "Área de juntas informales junto al comedor",
            pie: "Juntas de cuatro. Las que antes ocupaban una sala con puerta.",
            hotspots: [
              { x: 40, y: 64, slug: "sofa-condesa" },
              { x: 68, y: 68, my: 74, slug: "banca-brisa" },
            ],
          },
          {
            img: "/img/cats/almacenamiento.jpg",
            alt: "Guardado y servicio en el costado del comedor",
            pie: "Guardado y servicio. Todo lo del turno de comida, fuera de la vista.",
            hotspots: [
              { x: 48, y: 60, slug: "credenza-bosques" },
              { x: 72, y: 66, my: 72, slug: "librero-lineal" },
            ],
          },
        ],
      },
      {
        tipo: "capitulo",
        titulo: "El comedor también es oficina",
        texto: [
          "Después de las cuatro la mitad del área se usa para trabajar fuera del escritorio, que era justo lo que no existía en el piso.",
          "No hizo falta señalizar nada: el mobiliario dice solo para qué sirve cada zona y a qué hora conviene usarla.",
        ],
      },
      {
        tipo: "imagen",
        img: "/img/faq-hero.jpg",
        alt: "La antesala del comedor, con asientos junto al ventanal",
        pie: "La antesala se amuebló con el mismo criterio: pocas piezas, repetidas, y nada que estorbe el paso.",
      },
      {
        tipo: "duo",
        medios: [
          {
            img: "/img/cta-sillones.jpg",
            alt: "Dos sillones junto al muro del comedor",
            pie: "Dos lugares para esperar la mesa",
          },
          {
            img: "/img/nosotros/pilar-material.jpg",
            alt: "Detalle del tejido de la tapicería de la banca",
            pie: "El tejido de la banca corrida",
          },
        ],
      },
      {
        tipo: "destacado",
        texto: ["Nadie pidió una sala nueva.", "Pidieron poder quedarse donde ya comían."],
      },
      {
        tipo: "capitulo",
        titulo: "Sillería que se apila y guarda",
        texto: [
          "La sillería se guarda en carro y libera el área completa para los eventos internos, que antes se hacían en el estacionamiento.",
          "Dos personas dejan la sala vacía en veinte minutos y la vuelven a montar en el mismo tiempo, sin herramienta.",
        ],
      },
      {
        tipo: "video",
        src: "/video/editorial-neucast.mp4",
        poster: "/video/editorial-neucast-poster.jpg",
        alt: "Recorrido por la cafetería terminada",
      },
    ],
    piezas: [
      "silla-nube",
      "silla-tulum",
      "banco-mirador",
      "mesa-patio",
      "banca-brisa",
      "sofa-condesa",
      "mesa-tempo",
      "mesa-circulo",
      "banca-anden",
      "sillon-coyoacan",
      "mesa-piedra",
      "credenza-bosques",
    ],
  }),

  // ---------------------------------------------------------------------------
  // CASO COMPLETO. Este es el único proyecto armado de punta a punta: sirve de
  // plantilla para los que vengan de WordPress. Los demás traen la secuencia
  // corta a propósito, para no llenar el sitio de material inventado.
  // ---------------------------------------------------------------------------
  p({
    slug: "piso-operativo-monterrey",
    nombre: "Un piso operativo que crece de cuatro en cuatro",
    sector: "Empresa de tecnología",
    ciudad: "Monterrey",
    anio: "2025",
    espacio: "Piso de trabajo",
    escala: "96 puestos",
    portada: {
      img: "/img/hero-oficina.jpg",
      alt: "Piso de oficina abierto con bench de trabajo y sillería operativa",
    },
    resumen:
      "Contrataban cada trimestre y armaban puestos con lo que hubiera. Dejamos un sistema que crece sin que se note.",
    intro: [
      "Crecían por tandas y cada compra se resolvía por su cuenta, así que el piso acabó siendo un muestrario. Pedían un estándar que aguantara tres años de contrataciones sin volver a verse remendado.",
      "La condición era que cada ampliación pudiera instalarse en fin de semana, sin parar la operación ni mover a nadie de lugar.",
      "El piso tampoco era solo puestos: había que resolver las juntas, el café y la llegada con el mismo criterio, para que el conjunto se leyera como uno.",
    ],
    superficie: "1,150 m²", // inventado, como el resto de la maqueta
    ficha: [{ etiqueta: "Piezas instaladas", valor: "212" }],
    bloques: [
      {
        tipo: "imagen",
        img: "/img/cats/escritorios.jpg",
        alt: "El bench de cuatro puestos repetido a lo largo del piso",
        pie: "El módulo se repite sin variantes: lo que entra en la tanda tres es idéntico a lo que entró en la uno.",
      },
      {
        tipo: "capitulo",
        titulo: "Los cables, ya resueltos",
        texto: [
          "Canaleta corrida con tapa abatible en toda la estructura. Agregar un puesto no obliga a llamar al eléctrico ni a abrir el piso.",
          "Cada bench baja a piso por un solo punto, así que el área se ve igual de limpia cuando la fila pasa de cuatro a doce puestos.",
        ],
      },
      {
        tipo: "duo",
        medios: [
          {
            img: "/img/cats/sillas-operativas.jpg",
            alt: "Sillería operativa en el área de trabajo",
            pie: "Silla ajustable en los puestos fijos",
          },
          {
            img: "/img/cats/almacenamiento.jpg",
            alt: "Guardado individual junto a los puestos",
            pie: "Guardado bajo cubierta, uno por persona",
          },
        ],
      },
      {
        tipo: "destacado",
        texto: ["Un piso se ve remendado", "cuando cada tanda trajo un mueble distinto."],
      },
      {
        tipo: "capitulo",
        titulo: "El piso no es solo puestos",
        texto: [
          "Juntas, café y llegada se resolvieron con el mismo criterio que el área de trabajo: pocas referencias, repetidas muchas veces.",
          "Recorre las tres zonas y toca los puntos para abrir la ficha de cada pieza que quedó instalada.",
        ],
      },
      {
        tipo: "escenas",
        escenas: [
          {
            img: "/img/cats/salas-de-juntas.jpg",
            alt: "Sala de juntas del piso con mesa de cubierta clara y sillería ejecutiva",
            pie: "Sala de juntas. Mesa de doble pedestal y sillería ejecutiva.",
            hotspots: [
              { x: 50, y: 62, slug: "mesa-cabildo" },
              { x: 24, y: 70, my: 74, slug: "silla-catedra" },
            ],
          },
          {
            img: "/img/cats/lounge-y-areas-comunes.jpg",
            alt: "Área de lounge del piso con sofá, sillón y mesa de centro",
            pie: "Lounge de paso. Se usa para las llamadas largas y para esperar.",
            hotspots: [
              { x: 42, y: 64, slug: "sofa-roma" },
              { x: 68, y: 70, my: 76, slug: "mesa-piedra" },
            ],
          },
          {
            img: "/img/cats/cafeterias.jpg",
            alt: "Zona de café del piso con mesas altas y bancos",
            pie: "Zona de café. Mesa alta y banco, para el rato corto.",
            hotspots: [
              { x: 52, y: 66, slug: "banco-mirador" },
              { x: 30, y: 58, my: 62, slug: "silla-nube" },
            ],
          },
        ],
      },
      {
        tipo: "capitulo",
        titulo: "Una sola paleta, tres zonas",
        texto: [
          "Las tres zonas comparten la misma madera y la misma estructura, así que pasar de los puestos al café no se siente como cambiar de piso.",
          "Fue la decisión que más se nota y la que menos costó: elegir una paleta corta y no soltarla en ninguna de las tres tandas.",
        ],
      },
      {
        tipo: "imagen",
        img: "/img/nosotros/hero-lobby.jpg",
        alt: "La llegada al piso, con asientos de espera y mostrador",
        pie: "La llegada repite los acabados del área de trabajo, sin volverse una recepción aparte.",
      },
      {
        tipo: "duo",
        medios: [
          {
            img: "/img/espacio-lounge.jpg",
            alt: "Sillones y mesa de centro en el área de espera",
            pie: "Espera para dos, sin cerrar el paso",
          },
          {
            img: "/img/nosotros/pilar-material.jpg",
            alt: "Detalle del tejido de la tapicería",
            pie: "El mismo tejido en todo el piso",
          },
        ],
      },
      {
        tipo: "destacado",
        texto: ["Tres tandas, tres fines de semana,", "y el lunes nadie cambió de lugar."],
      },
      {
        tipo: "capitulo",
        titulo: "Sin parar la operación",
        texto: [
          "Cada tanda entró en viernes por la tarde y quedó lista el domingo. El lunes nadie llegó a buscar dónde se había quedado su lugar.",
          "La siguiente ampliación no necesita que estemos: el módulo ya está definido y el acomodo dibujado hasta el último puesto.",
        ],
      },
      {
        tipo: "video",
        src: "/video/oficina-neucast.mp4",
        poster: "/video/oficina-neucast-poster.jpg",
        alt: "Recorrido por el piso operativo terminado",
      },
    ],
    piezas: [
      "escritorio-hilera",
      "escritorio-eje",
      "silla-orbita",
      "silla-vertice",
      "archivero-bitacora",
      "librero-lineal",
      "mesa-cabildo",
      "silla-catedra",
      "sofa-roma",
      "mesa-piedra",
      "banco-mirador",
      "silla-nube",
    ],
  }),

  p({
    slug: "recepcion-y-lounge-guadalajara",
    nombre: "La primera impresión, en quince metros",
    sector: "Despacho de arquitectura",
    ciudad: "Guadalajara",
    anio: "2024",
    espacio: "Recepción y lounge",
    escala: "5 lugares de espera",
    superficie: "15 m²",
    portada: {
      img: "/img/espacio-lounge.jpg",
      alt: "Área lounge con sillones de color y mesa de centro sobre tapete",
    },
    resumen:
      "Un vestíbulo angosto donde la gente esperaba de pie. Cabían cinco asientos sin cerrar el paso, y ahí quedaron.",
    intro: [
      "Recibían clientes y candidatos en un pasillo de paso, con dos sillas que nadie usaba porque quedaban de espaldas a la puerta. Pedían que se pudiera esperar sentado sin estorbar la circulación.",
      "El reto no era el mobiliario sino el ancho: cualquier propuesta tenía que dejar libre el corredor que conecta la entrada con las salas.",
      "Tampoco se podía tocar la obra. Ni el mostrador ni los muros se movieron un centímetro.",
    ],
    ficha: [{ etiqueta: "Piezas instaladas", valor: "9" }],
    bloques: [
      {
        tipo: "imagen",
        img: "/img/faq-hero.jpg",
        alt: "El vestíbulo terminado, con los sillones junto al ventanal y el mostrador al fondo",
        pie: "Los asientos miran a la puerta: quien llega ve quién lo recibe antes de sentarse.",
      },
      {
        tipo: "capitulo",
        titulo: "Medimos el paso, no el mueble",
        texto: [
          "El corredor pedía ciento diez centímetros libres. Todo lo que se propuso salió de restar eso al ancho total, no al revés.",
          "Con esa cuenta hecha, la discusión dejó de ser cuántos asientos caben y pasó a ser cuáles caben sin estorbar.",
        ],
      },
      {
        tipo: "duo",
        medios: [
          {
            img: "/img/cta-sillones.jpg",
            alt: "Dos sillones individuales junto al muro de concreto del vestíbulo",
            pie: "Dos sillones, no un sofá de tres",
          },
          {
            img: "/img/nosotros/pilar-forma.jpg",
            alt: "Detalle del asiento tapizado de un sillón de espera",
            pie: "Asiento firme, para esperar sentado",
          },
        ],
      },
      {
        tipo: "destacado",
        texto: ["En quince metros lo que decide no es el mueble:", "es por dónde pasa la gente."],
      },
      {
        tipo: "capitulo",
        titulo: "Piezas sueltas, no un sofá",
        texto: [
          "Cuatro sillones individuales se acomodan según quién llegue, y en días de junta se mueven en treinta segundos.",
          "Un sofá de tres habría fijado la escena y habría dejado el vestíbulo con una sola manera posible de usarse.",
        ],
      },
      {
        tipo: "escenas",
        escenas: [
          {
            img: "/img/nosotros/hero-lobby.jpg",
            alt: "La llegada al despacho, con el mostrador y los asientos de espera",
            pie: "La llegada. Mostrador, dos asientos y el corredor siempre libre.",
            hotspots: [
              { x: 46, y: 62, slug: "sillon-coyoacan" },
              { x: 70, y: 68, my: 74, slug: "mesa-piedra" },
            ],
          },
          {
            img: "/img/cats/lounge-y-areas-comunes.jpg",
            alt: "El lounge del despacho con sofá y sillones de color",
            pie: "El lounge. Entrevistas cortas y esperas largas, sin reservar sala.",
            hotspots: [
              { x: 40, y: 64, slug: "sofa-roma" },
              { x: 68, y: 70, my: 76, slug: "sofa-condesa" },
            ],
          },
          {
            img: "/img/cats/almacenamiento.jpg",
            alt: "Guardado bajo el mostrador de recepción",
            pie: "Guardado de recepción. Todo lo que no debe estar a la vista.",
            hotspots: [
              { x: 48, y: 60, slug: "credenza-bosques" },
              { x: 72, y: 66, my: 72, slug: "librero-lineal" },
            ],
          },
        ],
      },
      {
        tipo: "capitulo",
        titulo: "La espera también es sala",
        texto: [
          "Las entrevistas cortas dejaron de ocupar una sala de juntas: se resuelven en el mismo lounge, sin reservar nada.",
          "Eso liberó las dos salas del despacho para lo que sí necesita puerta cerrada y calendario.",
        ],
      },
      {
        tipo: "imagen",
        img: "/img/proyectos-hero.jpg",
        alt: "El lounge visto desde el corredor, con la mesa de centro al frente",
        pie: "La mesa se retiró del borde para poder acercar una silla por cualquier lado.",
      },
      {
        tipo: "duo",
        medios: [
          {
            img: "/img/nosotros/cierre-material.jpg",
            alt: "Detalle del textil claro de la tapicería",
            pie: "Textil claro, que no marca el uso",
          },
          {
            img: "/img/nosotros/pilar-material.jpg",
            alt: "Detalle del tejido de la tapicería de los sillones",
            pie: "El tejido de los sillones",
          },
        ],
      },
      {
        tipo: "destacado",
        texto: ["Nadie vuelve a esperar de pie", "en un pasillo de paso."],
      },
      {
        tipo: "capitulo",
        titulo: "Una mesa que no obliga a rodear",
        texto: [
          "Base retirada del borde y altura de asiento, para dejar el café sin levantarse y acercar una silla por cualquier lado.",
          "Es la pieza que más se usa del vestíbulo y la que menos se nota, que era exactamente el encargo.",
        ],
      },
      {
        tipo: "video",
        src: "/video/editorial-neucast.mp4",
        poster: "/video/editorial-neucast-poster.jpg",
        alt: "Recorrido por la recepción y el lounge terminados",
      },
    ],
    piezas: [
      "sillon-coyoacan",
      "sofa-roma",
      "mesa-piedra",
      "banca-anden",
      "silla-agora",
      "mesa-circulo",
      "credenza-bosques",
      "sofa-condesa",
      "librero-lineal",
      "silla-reforma",
    ],
  }),

  p({
    slug: "sala-de-consejo-cdmx",
    nombre: "Una sala de consejo donde se firma",
    sector: "Corporativo industrial",
    ciudad: "Ciudad de México",
    anio: "2024",
    espacio: "Sala de consejo",
    escala: "14 lugares",
    superficie: "62 m²",
    portada: {
      img: "/img/cats/salas-de-juntas.jpg",
      alt: "Sala de juntas con mesa de cubierta clara y sillería ejecutiva",
    },
    resumen:
      "La mesa anterior tenía patas en las cabeceras y dos lugares no servían. La nueva se apoya en dos pedestales.",
    intro: [
      "Querían recibir consejo y firmar contratos en la misma sala, con capacidad real para catorce personas y sin extensiones de corriente cruzando la mesa.",
      "La sala ya existía y no se podía tocar la obra: todo tenía que resolverse con el mobiliario y con el acomodo.",
      "El plazo lo marcaba la sesión de consejo de octubre, así que la fecha de instalación no se movía.",
    ],
    ficha: [{ etiqueta: "Piezas instaladas", valor: "21" }],
    bloques: [
      {
        tipo: "imagen",
        img: "/img/cats/sillas-ejecutivas.jpg",
        alt: "La sillería ejecutiva alrededor de la mesa de consejo",
        pie: "Catorce lugares reales: ninguno queda contra una pata ni a medio metro de la pantalla.",
      },
      {
        tipo: "capitulo",
        titulo: "Fuera las patas de las cabeceras",
        texto: [
          "Doble pedestal en lugar de cuatro patas. Se ganaron los dos lugares de las cabeceras, que antes quedaban inservibles.",
          "Es el cambio que pagó el proyecto: dos lugares más en la misma sala, sin mover un solo muro.",
        ],
      },
      {
        tipo: "duo",
        medios: [
          {
            img: "/img/nosotros/pilar-proposito.jpg",
            alt: "La mesa de consejo vista desde la cabecera, con el muro de repisas al fondo",
            pie: "Cubierta de una sola pieza",
          },
          {
            img: "/img/nosotros/pilar-forma.jpg",
            alt: "Detalle del respaldo tapizado de una silla ejecutiva",
            pie: "Respaldo firme, para sesiones largas",
          },
        ],
      },
      {
        tipo: "destacado",
        texto: ["Una sala se mide por los lugares que sirven,", "no por los que caben."],
      },
      {
        tipo: "capitulo",
        titulo: "Las conexiones, al centro",
        texto: [
          "Registro embutido a lo largo del eje, con tapa a ras de cubierta. Nadie vuelve a pasar un cable por encima de la mesa.",
          "Cada tres lugares hay corriente y datos, así que la posición de quien presenta dejó de depender del enchufe.",
        ],
      },
      {
        tipo: "escenas",
        escenas: [
          {
            img: "/img/cats/lounge-y-areas-comunes.jpg",
            alt: "La antesala del consejo, con sofá y sillones",
            pie: "Antesala. Donde se espera a que abran la sesión.",
            hotspots: [
              { x: 42, y: 64, slug: "sofa-roma" },
              { x: 68, y: 70, my: 76, slug: "mesa-piedra" },
            ],
          },
          {
            img: "/img/cats/almacenamiento.jpg",
            alt: "La credenza y el librero del piso de dirección",
            pie: "Guardado. Expedientes y servicio de café, a la altura de la cubierta.",
            hotspots: [
              { x: 48, y: 60, slug: "credenza-bosques" },
              { x: 72, y: 66, my: 72, slug: "librero-lineal" },
            ],
          },
          {
            img: "/img/nosotros/hero-lobby.jpg",
            alt: "La llegada al piso de dirección",
            pie: "Llegada. El mismo acabado que la sala, desde que se abre el elevador.",
            hotspots: [
              { x: 46, y: 62, slug: "sillon-coyoacan" },
              { x: 70, y: 68, my: 74, slug: "silla-agora" },
            ],
          },
        ],
      },
      {
        tipo: "capitulo",
        titulo: "La antesala cuenta igual",
        texto: [
          "Quien espera para entrar al consejo se sienta en la antesala, que se resolvió con el mismo acabado de la sala.",
          "Son dos espacios seguidos y la gente los lee como uno solo, así que no podían venir de dos criterios distintos.",
        ],
      },
      {
        tipo: "imagen",
        img: "/img/faq-hero.jpg",
        alt: "El vestíbulo del piso de dirección, con la antesala a un costado",
        pie: "La llegada al piso de dirección, con la antesala a la izquierda y la sala al fondo.",
      },
      {
        tipo: "duo",
        medios: [
          {
            img: "/img/nosotros/cierre-material.jpg",
            alt: "Detalle del textil de la tapicería ejecutiva",
            pie: "Un textil para toda la sillería",
          },
          {
            img: "/img/nosotros/pilar-material.jpg",
            alt: "Detalle del tejido de la tapicería ejecutiva",
            pie: "El tejido de la sillería",
          },
        ],
      },
      {
        tipo: "destacado",
        texto: ["El cable sobre la mesa", "es lo primero que ve el consejo."],
      },
      {
        tipo: "capitulo",
        titulo: "Guardado a la vista, en orden",
        texto: [
          "Credenza a la altura de la cubierta para servir café y guardar expedientes, con el mismo acabado de la mesa.",
          "Se colocó del lado largo, para que abrirla no obligue a que nadie se levante de su lugar.",
        ],
      },
      {
        tipo: "video",
        src: "/video/editorial-neucast.mp4",
        poster: "/video/editorial-neucast-poster.jpg",
        alt: "Recorrido por la sala de consejo terminada",
      },
    ],
    piezas: [
      "mesa-cabildo",
      "silla-catedra",
      "silla-polanco",
      "credenza-bosques",
      "silla-reforma",
      "mesa-tempo",
      "silla-agora",
      "librero-lineal",
      "sofa-roma",
      "mesa-piedra",
      "sillon-coyoacan",
    ],
  }),
];

// Las imágenes que abren el visor, en el orden en que aparecen en la página.
// Fuera quedan la portada (no se amplía) y el video (se reproduce en su sitio).
export const mediosDe = (proyecto) =>
  proyecto.bloques.flatMap((b) => {
    if (b.tipo === "duo") return b.medios;
    if (b.tipo === "escenas") return b.escenas;
    if (b.tipo === "imagen") return [b];
    return [];
  });

// Para el schema: la portada también cuenta como imagen del proyecto.
export const imagenesDe = (proyecto) => [proyecto.portada, ...mediosDe(proyecto)];

export const proyectoPorSlug = (slug) => proyectos.find((x) => x.slug === slug);

// El home enseña uno. Es el primero de la lista para no tener dos fuentes: si
// mañana se reordena, el home sigue solo.
export const proyectoDestacado = proyectos[0];
