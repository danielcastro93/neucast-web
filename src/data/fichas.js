// Las fichas técnicas, una por pieza, con la misma slug del catálogo.
//
// PARA WORDPRESS: ver docs/wordpress.md, apartado 3.3. La ficha pinta solo los
// campos que existen, así que una pieza sin mecanismo o sin plazas no muestra
// esa parte y no hay que rellenar de vacíos. Si el CMS agrega una clave nueva
// de medida o de construcción, hay que darla de alta en `etiquetasMedida` o
// `etiquetasConstruccion` del final del archivo, o no se muestra.
//
// Ficha de producto: todo lo que puede llegar a tener una pieza.
//
// Los campos cubren lo que puede llevar una pieza (ver docs/catalogo.md): tablas
// de medidas por familia, mecanismos, bases, armazones, telas y plazos de
// entrega. La ficha pinta solo lo que existe, así que una pieza sin mecanismo o
// sin plazas no muestra esa parte.
//
// OJO: los valores son de maqueta. Sirven para ver la ficha completa y para que
// el desarrollo sepa qué campos tiene que traer WordPress, pero ninguno está
// confirmado. Hay que sustituirlos uno por uno antes de publicar.
// Ver docs/pendientes.md.

const f = (o) => ({ destacados: [], cuidados: [], mecanismo: null, ...o });

export const fichas = {
  "silla-polanco": f({
    resumen: "Respaldo de malla tensada de una pieza con cabecera regulable, pensada para la jornada completa y para recibir en la misma silla. El soporte lumbar se ajusta en altura y profundidad sin herramienta.",
    destacados: [
      "Cabecera regulable en altura e inclinación",
      "Mecanismo synchro con cinco posiciones de bloqueo",
      "Soporte lumbar ajustable en altura y profundidad"
    ],
    medidas: {
      alto: "118 a 128 cm",
      ancho: "68 cm",
      fondo: "70 cm",
      altoAsiento: "45 a 55 cm",
      anchoAsiento: "50 cm",
      fondoAsiento: "48 cm",
      altoRespaldo: "72 cm",
      brazoInterno: "48 cm",
      brazoExterno: "68 cm",
      cabecera: "26 cm",
      peso: "19 kg",
      carga: "130 kg"
    },
    construccion: {
      tapiceria: "Malla SmartMesh sobre marco de nylon reforzado",
      asiento: "Espuma inyectada de alta densidad, 55 kg/m³",
      estructura: "Nylon reforzado con fibra de vidrio",
      base: "Aluminio pulido de cinco puntas",
      ruedas: "Ruedas dobles de 60 mm para piso duro"
    },
    mecanismo: {
      nombre: "Synchro multiposiciones",
      ajustes: [
        "Altura de asiento por pistón de gas",
        "Inclinación con cinco posiciones de bloqueo",
        "Tensión graduable por peso",
        "Profundidad de asiento deslizable",
        "Descansabrazos 3D"
      ]
    },
    cuidados: [
      "Aspirar la malla con boquilla suave cada dos semanas",
      "Limpiar manchas con paño húmedo y jabón neutro, sin frotar",
      "Revisar el apriete de la base cada seis meses"
    ]
  }),

  "silla-reforma": f({
    resumen: "Respaldo alto tapizado con costura vertical que marca la línea de la espalda. Pensada para escritorios donde la silla se ve tanto como se usa.",
    destacados: [
      "Respaldo alto tapizado con soporte lumbar integrado",
      "Mecanismo synchro con tensión graduable",
      "Descansabrazos ajustables en altura y giro"
    ],
    medidas: {
      alto: "112 a 122 cm",
      ancho: "66 cm",
      fondo: "68 cm",
      altoAsiento: "44 a 54 cm",
      anchoAsiento: "50 cm",
      fondoAsiento: "47 cm",
      altoRespaldo: "68 cm",
      brazoInterno: "47 cm",
      brazoExterno: "66 cm",
      peso: "18 kg",
      carga: "130 kg"
    },
    construccion: {
      tapiceria: "E-Fabric Reyna",
      asiento: "Espuma inyectada de alta densidad, 50 kg/m³",
      estructura: "Madera contrachapada moldeada",
      base: "Aluminio pulido de cinco puntas",
      ruedas: "Ruedas dobles de 60 mm para piso duro"
    },
    mecanismo: {
      nombre: "Synchro multiposiciones",
      ajustes: [
        "Altura de asiento por pistón de gas",
        "Inclinación con cuatro posiciones de bloqueo",
        "Tensión graduable por peso",
        "Descansabrazos 2D"
      ]
    },
    cuidados: [
      "Aspirar la tapicería cada dos semanas",
      "Manchas frescas: absorber sin frotar y limpiar con jabón neutro",
      "No exponer la tela a sol directo de forma permanente"
    ]
  }),

  "silla-catedra": f({
    resumen: "Piel genuina sobre respaldo alto acolchado, con brazos integrados al cuerpo. La pieza de dirección cuando la silla forma parte de la conversación.",
    destacados: [
      "Piel genuina de grano corregido",
      "Respaldo alto acolchado con costura horizontal",
      "Base de aluminio pulido de cinco puntas"
    ],
    medidas: {
      alto: "114 a 124 cm",
      ancho: "70 cm",
      fondo: "72 cm",
      altoAsiento: "45 a 55 cm",
      anchoAsiento: "52 cm",
      fondoAsiento: "49 cm",
      altoRespaldo: "70 cm",
      brazoInterno: "49 cm",
      brazoExterno: "70 cm",
      peso: "21 kg",
      carga: "130 kg"
    },
    construccion: {
      tapiceria: "Genuine Leather",
      asiento: "Espuma de alta resiliencia, 55 kg/m³, con acolchado de 200 g",
      estructura: "Madera contrachapada moldeada",
      base: "Aluminio pulido de cinco puntas",
      ruedas: "Ruedas dobles de 60 mm para piso duro"
    },
    mecanismo: {
      nombre: "Reclinable con bloqueo",
      ajustes: [
        "Altura de asiento por pistón de gas",
        "Reclinación con bloqueo en tres posiciones",
        "Tensión graduable por peso"
      ]
    },
    cuidados: [
      "Limpiar con paño seco o ligeramente humedecido",
      "Aplicar acondicionador para piel dos veces al año",
      "Mantener a más de un metro de fuentes de calor"
    ]
  }),

  "silla-agora": f({
    resumen: "Silla de visita en cantilever: la estructura continua le da rebote sin mecanismo. Se apila de a cuatro para liberar la sala.",
    destacados: [
      "Estructura cantilever de tubo de acero continuo",
      "Se apila hasta cuatro piezas",
      "Technoleather de limpieza inmediata"
    ],
    medidas: {
      alto: "84 cm",
      ancho: "58 cm",
      fondo: "60 cm",
      altoAsiento: "46 cm",
      anchoAsiento: "48 cm",
      fondoAsiento: "45 cm",
      altoRespaldo: "38 cm",
      brazoInterno: "47 cm",
      brazoExterno: "58 cm",
      apilables: "4",
      peso: "9 kg",
      carga: "120 kg"
    },
    construccion: {
      tapiceria: "Technoleather",
      asiento: "Espuma inyectada de 45 kg/m³",
      estructura: "Tubo de acero de 25 mm con pintura electrostática",
      base: "Cantilever con tapas antideslizantes"
    },
    cuidados: [
      "Limpiar con paño húmedo y jabón neutro",
      "Revisar las tapas de apoyo cada seis meses",
      "No apilar más de cuatro piezas"
    ]
  }),

  "silla-orbita": f({
    resumen: "La silla que se compra por veinte. Malla transpirable, ajustes básicos bien resueltos y materiales que aguantan la rotación de un piso de trabajo.",
    destacados: [
      "Respaldo de malla transpirable con soporte lumbar fijo",
      "Mecanismo de rodilla con bloqueo y tensión",
      "Descansabrazos ajustables en altura"
    ],
    medidas: {
      alto: "96 a 106 cm",
      ancho: "62 cm",
      fondo: "64 cm",
      altoAsiento: "43 a 53 cm",
      anchoAsiento: "48 cm",
      fondoAsiento: "45 cm",
      altoRespaldo: "52 cm",
      brazoInterno: "46 cm",
      brazoExterno: "62 cm",
      peso: "14 kg",
      carga: "120 kg"
    },
    construccion: {
      tapiceria: "Malla SmartMesh sobre marco de nylon",
      asiento: "Espuma inyectada de 45 kg/m³",
      estructura: "Nylon reforzado",
      base: "Nylon de cinco puntas",
      ruedas: "Ruedas de 50 mm para piso duro"
    },
    mecanismo: {
      nombre: "Rodilla con bloqueo",
      ajustes: [
        "Altura de asiento por pistón de gas",
        "Bloqueo de inclinación",
        "Tensión graduable por peso",
        "Descansabrazos 1D"
      ]
    },
    cuidados: [
      "Aspirar la malla cada dos semanas",
      "Limpiar manchas con paño húmedo y jabón neutro",
      "Revisar el apriete de la base cada seis meses"
    ]
  }),

  "silla-vertice": f({
    resumen: "Versión sin ajustes de brazo de la silla operativa: lo mismo donde importa, menos piezas donde no. Para pisos donde la silla no cambia de dueño.",
    destacados: [
      "Respaldo de malla transpirable",
      "Mecanismo de rodilla con bloqueo",
      "Descansabrazos fijos integrados al asiento"
    ],
    medidas: {
      alto: "94 a 104 cm",
      ancho: "60 cm",
      fondo: "62 cm",
      altoAsiento: "43 a 53 cm",
      anchoAsiento: "47 cm",
      fondoAsiento: "44 cm",
      altoRespaldo: "50 cm",
      brazoInterno: "46 cm",
      brazoExterno: "60 cm",
      peso: "13 kg",
      carga: "120 kg"
    },
    construccion: {
      tapiceria: "Malla SmartMesh Plus sobre marco de nylon",
      asiento: "Espuma inyectada de 45 kg/m³",
      estructura: "Nylon reforzado",
      base: "Nylon de cinco puntas",
      ruedas: "Ruedas de 50 mm para piso duro"
    },
    mecanismo: {
      nombre: "Rodilla con bloqueo",
      ajustes: [
        "Altura de asiento por pistón de gas",
        "Bloqueo de inclinación",
        "Tensión graduable por peso"
      ]
    },
    cuidados: [
      "Aspirar la malla cada dos semanas",
      "Limpiar manchas con paño húmedo y jabón neutro"
    ]
  }),

  "silla-nodo": f({
    resumen: "Multitask sin brazos: entra y sale de un escritorio sin chocar, y rueda entre puestos cuando el piso es compartido.",
    destacados: [
      "Sin brazos, entra completa bajo el escritorio",
      "Asiento tapizado en E-Fabric",
      "Base de nylon con ruedas de 50 mm"
    ],
    medidas: {
      alto: "88 a 98 cm",
      ancho: "54 cm",
      fondo: "56 cm",
      altoAsiento: "42 a 52 cm",
      anchoAsiento: "46 cm",
      fondoAsiento: "43 cm",
      altoRespaldo: "46 cm",
      peso: "11 kg",
      carga: "110 kg"
    },
    construccion: {
      tapiceria: "E-Fabric Crepé",
      asiento: "Espuma inyectada de 40 kg/m³",
      estructura: "Nylon reforzado",
      base: "Nylon de cinco puntas",
      ruedas: "Ruedas de 50 mm para piso duro"
    },
    mecanismo: {
      nombre: "Contacto permanente",
      ajustes: [
        "Altura de asiento por pistón de gas",
        "Inclinación de respaldo con tensión fija"
      ]
    },
    cuidados: [
      "Aspirar la tapicería cada dos semanas",
      "Limpiar manchas con jabón neutro, sin frotar"
    ]
  }),

  "mesa-tempo": f({
    resumen: "Cubierta continua de madera sobre bases metálicas retiradas del borde, para que nadie choque con una pata. Con paso de cables corrido a lo largo del eje.",
    destacados: [
      "Cubierta de una pieza, sin junta a la vista",
      "Paso de cables corrido con tapa abatible",
      "Se extiende en módulos de 80 cm"
    ],
    medidas: {
      largo: "300 cm",
      ancho: "120 cm",
      alto: "75 cm",
      espesorCubierta: "30 mm",
      personas: "10 a 12",
      peso: "96 kg"
    },
    construccion: {
      cubierta: "Aglomerado de alta densidad con chapa de madera y canto ABS de 2 mm",
      estructura: "Bastidor de acero calibre 14",
      base: "Patas de acero con pintura electrostática",
      acabado: "Barniz mate de poro abierto"
    },
    cuidados: [
      "Limpiar con paño apenas húmedo y secar de inmediato",
      "Usar posavasos: el agua estancada levanta la chapa",
      "No arrastrar objetos sobre la cubierta"
    ]
  }),

  "mesa-cabildo": f({
    resumen: "Mesa de consejo de cubierta clara y base de doble pedestal. Pensada para la sala donde se firma, no donde se trabaja.",
    destacados: [
      "Doble pedestal, sin patas en las cabeceras",
      "Registro de conexiones embutido al centro",
      "Se arma en sitio sin herramienta especial"
    ],
    medidas: {
      largo: "400 cm",
      ancho: "140 cm",
      alto: "75 cm",
      espesorCubierta: "38 mm",
      personas: "14 a 16",
      peso: "142 kg"
    },
    construccion: {
      cubierta: "Aglomerado de alta densidad con laminado y canto ABS de 3 mm",
      estructura: "Bastidor de acero calibre 14",
      base: "Pedestales de acero con pintura electrostática",
      acabado: "Laminado mate antihuella"
    },
    cuidados: [
      "Limpiar con paño apenas húmedo",
      "Evitar limpiadores abrasivos sobre el laminado",
      "Revisar la nivelación de los pedestales una vez al año"
    ]
  }),

  "mesa-circulo": f({
    resumen: "Mesa redonda de cristal templado sobre base central. Para la junta corta de cuatro, donde nadie preside.",
    destacados: [
      "Cristal templado de 12 mm con canto pulido",
      "Base central: cabe una silla en cualquier punto",
      "Diámetro de 120 cm para cuatro personas"
    ],
    medidas: {
      diametro: "120 cm",
      alto: "74 cm",
      espesorCubierta: "12 mm",
      personas: "4",
      peso: "48 kg"
    },
    construccion: {
      cubierta: "Cristal templado de 12 mm con canto pulido",
      estructura: "Columna de acero de 100 mm",
      base: "Plato de acero con pintura electrostática y niveladores"
    },
    cuidados: [
      "Limpiar con limpiavidrios sin amoniaco",
      "Revisar los niveladores si la mesa se mueve",
      "No golpear el canto: el templado falla por el borde"
    ]
  }),

  "escritorio-eje": f({
    resumen: "Escritorio recto con paso de cables resuelto de fábrica y faldón opcional. La pieza base de un piso: se repite sin verse repetida.",
    destacados: [
      "Pasacables en cubierta y canaleta bajo la superficie",
      "Niveladores en las cuatro patas",
      "Combina con la credenza de la misma línea"
    ],
    medidas: {
      largo: "160 cm",
      ancho: "70 cm",
      alto: "75 cm",
      espesorCubierta: "25 mm",
      alturaLibre: "68 cm",
      peso: "42 kg"
    },
    construccion: {
      cubierta: "Aglomerado de alta densidad con melamina y canto ABS de 2 mm",
      estructura: "Bastidor de acero calibre 16",
      base: "Patas de acero con pintura electrostática y niveladores"
    },
    cuidados: [
      "Limpiar con paño apenas húmedo",
      "No usar solventes sobre la melamina",
      "Revisar los niveladores al cambiar de lugar"
    ]
  }),

  "escritorio-angulo": f({
    resumen: "Escritorio en L con retorno del lado que se pida. Da una superficie de trabajo y otra de apoyo sin sumar dos muebles.",
    destacados: [
      "Retorno reversible: se arma a derecha o a izquierda",
      "Pasacables en los dos tramos",
      "Faldón metálico perforado incluido"
    ],
    medidas: {
      largo: "180 cm",
      ancho: "160 cm",
      fondo: "70 cm",
      alto: "75 cm",
      espesorCubierta: "25 mm",
      alturaLibre: "68 cm",
      peso: "64 kg"
    },
    construccion: {
      cubierta: "Aglomerado de alta densidad con melamina y canto ABS de 2 mm",
      estructura: "Bastidor de acero calibre 16",
      base: "Patas de acero con pintura electrostática y niveladores",
      acabado: "Faldón de lámina perforada"
    },
    cuidados: [
      "Limpiar con paño apenas húmedo",
      "Revisar el apriete del retorno cada seis meses"
    ]
  }),

  "escritorio-hilera": f({
    resumen: "Bench para equipos completos: una sola estructura, cuatro puestos y un solo registro de cables. Crece de cuatro en cuatro.",
    destacados: [
      "Cuatro puestos sobre una estructura continua",
      "Canaleta central corrida para todo el bench",
      "Mamparas divisorias opcionales"
    ],
    medidas: {
      largo: "280 cm",
      ancho: "140 cm",
      alto: "75 cm",
      puestos: "4",
      espesorCubierta: "25 mm",
      alturaLibre: "68 cm",
      peso: "118 kg"
    },
    construccion: {
      cubierta: "Aglomerado de alta densidad con melamina y canto ABS de 2 mm",
      estructura: "Perfil de acero de 60 × 30 mm",
      base: "Patas de acero con pintura electrostática y niveladores",
      acabado: "Canaleta central de lámina con tapa abatible"
    },
    cuidados: [
      "Limpiar con paño apenas húmedo",
      "Revisar el apriete de la estructura cada seis meses",
      "No cargar la canaleta con más de 15 kg"
    ]
  }),

  "silla-nube": f({
    resumen: "Concha de polipropileno sobre patas de madera maciza. Se limpia de un trapazo y se apila cuando hay que despejar.",
    destacados: [
      "Concha de una pieza, sin juntas donde se acumule",
      "Patas de haya maciza con tapas de fieltro",
      "Se apila hasta seis piezas"
    ],
    medidas: {
      alto: "80 cm",
      ancho: "52 cm",
      fondo: "54 cm",
      altoAsiento: "45 cm",
      anchoAsiento: "46 cm",
      fondoAsiento: "42 cm",
      altoRespaldo: "35 cm",
      apilables: "6",
      peso: "5 kg",
      carga: "110 kg"
    },
    construccion: {
      estructura: "Concha de polipropileno inyectado",
      base: "Patas de haya maciza con barniz al agua",
      acabado: "Tapas de fieltro para piso duro"
    },
    cuidados: [
      "Limpiar con paño húmedo y jabón neutro",
      "Revisar el apriete de las patas cada seis meses",
      "No apilar más de seis piezas"
    ]
  }),

  "silla-tulum": f({
    resumen: "Apilable con asiento tapizado y base de trineo. Se guarda en carro y sale cuando el comedor se convierte en auditorio.",
    destacados: [
      "Base de trineo: no raya ni se atora",
      "Se apila hasta diez piezas",
      "Ganchos de enlace para formar fila"
    ],
    medidas: {
      alto: "82 cm",
      ancho: "50 cm",
      fondo: "55 cm",
      altoAsiento: "46 cm",
      anchoAsiento: "45 cm",
      fondoAsiento: "42 cm",
      altoRespaldo: "36 cm",
      apilables: "10",
      peso: "6 kg",
      carga: "110 kg"
    },
    construccion: {
      tapiceria: "E-Fabric Plus sobre asiento y respaldo",
      asiento: "Espuma de 35 kg/m³",
      estructura: "Tubo de acero de 20 mm con pintura electrostática",
      base: "Trineo con tapas antideslizantes"
    },
    cuidados: [
      "Aspirar la tapicería cada dos semanas",
      "Limpiar manchas con jabón neutro",
      "No apilar más de diez piezas"
    ]
  }),

  "banco-mirador": f({
    resumen: "Banco alto para barra y mesa de pie. Reposapiés integrado al aro de la estructura, que es donde se gasta un banco.",
    destacados: [
      "Aro reposapiés integrado a la estructura",
      "Asiento a 75 cm, altura de barra",
      "Se apila hasta cinco piezas"
    ],
    medidas: {
      alto: "105 cm",
      ancho: "42 cm",
      fondo: "44 cm",
      altoAsiento: "75 cm",
      anchoAsiento: "38 cm",
      fondoAsiento: "36 cm",
      altoRespaldo: "28 cm",
      apilables: "5",
      peso: "7 kg",
      carga: "110 kg"
    },
    construccion: {
      estructura: "Tubo de acero de 22 mm con pintura electrostática",
      asiento: "Lámina troquelada con espuma de 30 kg/m³",
      base: "Cuatro patas con aro reposapiés y tapas antideslizantes"
    },
    cuidados: [
      "Limpiar con paño húmedo y jabón neutro",
      "Cambiar las tapas cuando se desgasten: protegen el piso"
    ]
  }),

  "sofa-condesa": f({
    resumen: "Sofá de tres plazas con asientos independientes y armazón de pino sólido. Modular: se suma un módulo y se vuelve de cinco.",
    destacados: [
      "Armazón de pino sólido secado en horno",
      "Asientos y respaldos desenfundables",
      "Modular: crece en módulos de una plaza"
    ],
    medidas: {
      largo: "220 cm",
      fondo: "92 cm",
      alto: "82 cm",
      altoAsiento: "43 cm",
      fondoAsiento: "58 cm",
      brazoInterno: "196 cm",
      plazas: "3",
      peso: "68 kg"
    },
    construccion: {
      tapiceria: "E-Fabric Addison, desenfundable",
      armazon: "Pino sólido secado en horno",
      asiento: "Espuma de alta resiliencia de 35 kg/m³ sobre suspensión de cinchas",
      suspension: "Cinchas elásticas entrelazadas",
      patas: "Metal con pintura negra mate"
    },
    cuidados: [
      "Aspirar semanalmente, incluso bajo los cojines",
      "Rotar los cojines cada mes para parejar el uso",
      "Lavar las fundas en seco"
    ]
  }),

  "sofa-roma": f({
    resumen: "Dos plazas en Eco-Leather, con brazos bajos que no roban asiento. Para la sala de espera donde el sofá tiene que verse y aguantar.",
    destacados: [
      "Eco-Leather de limpieza inmediata",
      "Brazos bajos: aprovechan el ancho",
      "Patas de metal cromado"
    ],
    medidas: {
      largo: "160 cm",
      fondo: "88 cm",
      alto: "78 cm",
      altoAsiento: "43 cm",
      fondoAsiento: "56 cm",
      brazoInterno: "136 cm",
      plazas: "2",
      peso: "52 kg"
    },
    construccion: {
      tapiceria: "Eco-Leather",
      armazon: "Pino sólido secado en horno",
      asiento: "Espuma de alta resiliencia de 35 kg/m³",
      suspension: "Cinchas elásticas entrelazadas",
      patas: "Metal cromado"
    },
    cuidados: [
      "Limpiar con paño húmedo y secar",
      "No usar solventes ni limpiadores con alcohol",
      "Mantener alejado de fuentes de calor directo"
    ]
  }),

  "sillon-coyoacan": f({
    resumen: "Sillón de una plaza con respaldo envolvente. Ocupa poco y define una esquina sin cerrarla.",
    destacados: [
      "Respaldo envolvente de una pieza",
      "Armazón de pino sólido",
      "Funda desmontable"
    ],
    medidas: {
      largo: "82 cm",
      fondo: "80 cm",
      alto: "78 cm",
      altoAsiento: "43 cm",
      fondoAsiento: "54 cm",
      brazoInterno: "58 cm",
      plazas: "1",
      peso: "27 kg"
    },
    construccion: {
      tapiceria: "E-Fabric Reyna, desenfundable",
      armazon: "Pino sólido secado en horno",
      asiento: "Espuma de alta resiliencia de 35 kg/m³",
      suspension: "Cinchas elásticas entrelazadas",
      patas: "Metal con pintura gris"
    },
    cuidados: [
      "Aspirar semanalmente",
      "Rotar el cojín de asiento cada mes",
      "Lavar la funda en seco"
    ]
  }),

  "mesa-piedra": f({
    resumen: "Mesa de centro de cubierta maciza y base retirada del borde, para que se pueda acercar una silla por cualquier lado.",
    destacados: [
      "Cubierta de madera maciza de 40 mm",
      "Base retirada del borde",
      "Altura de 38 cm, la de un asiento lounge"
    ],
    medidas: {
      largo: "110 cm",
      ancho: "60 cm",
      alto: "38 cm",
      espesorCubierta: "40 mm",
      peso: "28 kg"
    },
    construccion: {
      cubierta: "Madera maciza con barniz mate de poro abierto",
      estructura: "Bastidor de acero",
      base: "Patas de acero con pintura negra mate y niveladores"
    },
    cuidados: [
      "Limpiar con paño apenas húmedo y secar",
      "Usar posavasos",
      "Aplicar aceite para madera una vez al año"
    ]
  }),

  "banca-anden": f({
    resumen: "Banca de espera de cuatro plazas sobre estructura continua. Se limpia debajo sin moverla, que es lo que decide en un vestíbulo.",
    destacados: [
      "Cuatro plazas sobre una sola estructura",
      "Asientos individuales tapizados en Technoleather",
      "Estructura elevada: se limpia debajo"
    ],
    medidas: {
      largo: "240 cm",
      fondo: "62 cm",
      alto: "80 cm",
      altoAsiento: "45 cm",
      fondoAsiento: "46 cm",
      altoRespaldo: "35 cm",
      plazas: "4",
      peso: "46 kg"
    },
    construccion: {
      tapiceria: "Technoleather",
      asiento: "Espuma inyectada de 45 kg/m³ sobre base de lámina",
      estructura: "Viga de acero de 60 × 40 mm con pintura electrostática",
      base: "Trineo con niveladores"
    },
    cuidados: [
      "Limpiar con paño húmedo y jabón neutro",
      "Revisar el apriete de los asientos cada seis meses"
    ]
  }),

  "librero-lineal": f({
    resumen: "Librero abierto de cinco entrepaños, con repisas graduables cada 32 mm. Se ancla a muro y se alinea con la credenza de la misma línea.",
    destacados: [
      "Cinco entrepaños graduables cada 32 mm",
      "Herraje de anclaje a muro incluido",
      "Fondo cerrado: no se ve el muro detrás"
    ],
    medidas: {
      alto: "180 cm",
      ancho: "80 cm",
      fondo: "35 cm",
      entrepanos: "5",
      cargaEntrepano: "25 kg",
      peso: "54 kg"
    },
    construccion: {
      estructura: "Aglomerado de alta densidad con melamina y canto ABS de 2 mm",
      acabado: "Melamina texturizada antihuella",
      base: "Zócalo con niveladores"
    },
    cuidados: [
      "Limpiar con paño apenas húmedo",
      "Anclar siempre a muro antes de cargar",
      "No exceder 25 kg por entrepaño"
    ]
  }),

  "credenza-bosques": f({
    resumen: "Credenza de cuatro puertas con entrepaño interior graduable. A la altura del escritorio, para que sirva de superficie de apoyo.",
    destacados: [
      "Cuatro puertas con bisagra de cierre suave",
      "Entrepaño interior graduable en cada módulo",
      "Cubierta a 75 cm, a la altura del escritorio"
    ],
    medidas: {
      alto: "75 cm",
      ancho: "180 cm",
      fondo: "45 cm",
      puertas: "4",
      entrepanos: "2",
      peso: "78 kg"
    },
    construccion: {
      cubierta: "Aglomerado de alta densidad con chapa de madera y canto ABS de 2 mm",
      estructura: "Aglomerado de alta densidad con melamina",
      base: "Zócalo con niveladores",
      acabado: "Barniz mate de poro abierto"
    },
    cuidados: [
      "Limpiar con paño apenas húmedo",
      "Revisar el ajuste de las bisagras una vez al año",
      "No cargar la cubierta con más de 40 kg"
    ]
  }),

  "archivero-bitacora": f({
    resumen: "Archivero rodante de tres gavetas con cerradura general. Cabe bajo el escritorio recto de la misma línea.",
    destacados: [
      "Tres gavetas con corredera telescópica",
      "Cerradura general de un solo giro",
      "Cabe bajo el escritorio: 58 cm de alto"
    ],
    medidas: {
      alto: "58 cm",
      ancho: "40 cm",
      fondo: "50 cm",
      gavetas: "3",
      cargaGaveta: "15 kg",
      peso: "26 kg"
    },
    construccion: {
      estructura: "Lámina de acero calibre 22 con pintura electrostática",
      base: "Cuatro ruedas, dos con freno",
      acabado: "Pintura epóxica texturizada"
    },
    mecanismo: {
      nombre: "Corredera telescópica con antivuelco",
      ajustes: [
        "Apertura total de la gaveta",
        "Bloqueo antivuelco: una gaveta a la vez",
        "Cerradura general de un solo giro"
      ]
    },
    cuidados: [
      "Limpiar con paño húmedo y secar",
      "Lubricar las correderas una vez al año",
      "No exceder 15 kg por gaveta"
    ]
  }),

  "banca-brisa": f({
    resumen: "Banca de tres plazas para terraza, en aluminio con listones tratados. Pensada para quedarse afuera todo el año.",
    destacados: [
      "Aluminio con tratamiento anticorrosivo",
      "Listones con acabado resistente a rayos UV",
      "Se apila hasta tres piezas"
    ],
    medidas: {
      largo: "180 cm",
      fondo: "60 cm",
      alto: "80 cm",
      altoAsiento: "44 cm",
      fondoAsiento: "45 cm",
      altoRespaldo: "36 cm",
      plazas: "3",
      apilables: "3",
      peso: "18 kg"
    },
    construccion: {
      estructura: "Perfil de aluminio con pintura electrostática",
      asiento: "Listones de madera tratada para exterior",
      base: "Tapas antideslizantes para piso mojado",
      acabado: "Tratamiento anticorrosivo y filtro UV"
    },
    cuidados: [
      "Enjuagar con agua limpia cada mes",
      "Aplicar aceite a los listones dos veces al año",
      "Cubrir o guardar en temporada de granizo"
    ]
  }),

  "mesa-patio": f({
    resumen: "Mesa de terraza con cubierta perforada que no encharca. Base con niveladores para piso irregular.",
    destacados: [
      "Cubierta perforada: el agua escurre sola",
      "Niveladores para piso irregular",
      "Orificio central para sombrilla, con tapón"
    ],
    medidas: {
      diametro: "90 cm",
      alto: "74 cm",
      espesorCubierta: "20 mm",
      personas: "4",
      peso: "14 kg"
    },
    construccion: {
      cubierta: "Lámina de aluminio perforada con pintura electrostática",
      estructura: "Columna de aluminio de 60 mm",
      base: "Plato de aluminio con niveladores",
      acabado: "Tratamiento anticorrosivo y filtro UV"
    },
    cuidados: [
      "Enjuagar con agua limpia cada mes",
      "Revisar los niveladores al cambiarla de lugar",
      "Colocar el tapón cuando no se use sombrilla"
    ]
  }),
};

export const fichaDe = (slug) => fichas[slug] || null;

// Etiquetas legibles. El orden de estos objetos manda el orden de la ficha.
export const etiquetasMedida = {
  alto: "Altura total",
  largo: "Longitud",
  ancho: "Anchura",
  fondo: "Profundidad",
  diametro: "Diámetro",
  espesorCubierta: "Espesor de cubierta",
  alturaLibre: "Altura libre bajo cubierta",
  altoAsiento: "Altura del asiento",
  anchoAsiento: "Anchura del asiento",
  fondoAsiento: "Profundidad del asiento",
  altoRespaldo: "Altura del respaldo",
  brazoInterno: "Medida interna de brazos",
  brazoExterno: "Medida externa de brazos",
  cabecera: "Altura de cabecera",
  plazas: "Plazas",
  personas: "Personas",
  puestos: "Puestos de trabajo",
  puertas: "Puertas",
  gavetas: "Gavetas",
  entrepanos: "Entrepaños",
  apilables: "Piezas apilables",
  cargaEntrepano: "Carga por entrepaño",
  cargaGaveta: "Carga por gaveta",
  carga: "Carga máxima",
  peso: "Peso",
};

export const etiquetasConstruccion = {
  tapiceria: "Tapicería",
  asiento: "Asiento",
  armazon: "Armazón",
  estructura: "Estructura",
  cubierta: "Cubierta",
  suspension: "Suspensión",
  base: "Base",
  patas: "Patas",
  ruedas: "Ruedas",
  acabado: "Acabado",
};
