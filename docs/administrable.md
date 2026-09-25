# Qué es administrable

Inventario completo de lo que el cliente va a poder editar desde WordPress, qué
tipo de contenido le toca a cada cosa y dónde vive hoy.

Es el documento que hay que tener a la mano al modelar el CMS. La forma exacta
de cada campo está en [wordpress.md](wordpress.md).

---

## 1. Resumen

| Qué | Tipo de contenido | Archivo de hoy | Piezas |
| --- | --- | --- | --- |
| Categorías | taxonomía | `site.js` → `categories` | 8 |
| Piezas | entrada `pieza` | `catalogo.js` → `piezas` | 26 |
| Ficha técnica de cada pieza | campos de `pieza` | `fichas.js` | 26 |
| Proyectos | entrada `proyecto` | `proyectos.js` | 4 |
| Piezas destacadas del home | selección | `site.js` → `destacados` | 8 |
| Opciones de los filtros | taxonomías | `catalogo.js` → `filtros`, `materiales`, `gruposColor` | |
| Bloques editoriales del catálogo | entrada `bloque` | `catalogo.js` | 2 por listado |
| Datos de la empresa | ajustes | `site.js` → `site` | |
| Preguntas frecuentes | entrada `pregunta` | `preguntas-frecuentes.astro` | 31 |

Lo que **no** se conecta, y por qué, está en el apartado 8.

---

## 2. Categorías

Ocho, y son la columna vertebral del sitio: cada una es una página, un filtro y
un nivel de la dirección de cada pieza.

| Campo | Qué es | Dónde se ve |
| --- | --- | --- |
| `slug` | La dirección: `/muebles/{slug}/` | dirección |
| `name` | El nombre | menú, tarjeta, migas |
| `photo` + `alt` | La foto de la tarjeta | home y `/muebles/` |
| `h1` | El encabezado de la página de categoría | página de categoría |
| `intro` | El texto bajo el encabezado, **a dos renglones siempre** | página de categoría |
| `title` | El título que sale en Google, 30 a 65 caracteres | cabeza de la página |
| `desc` | La descripción que sale en Google, 70 a 160 | cabeza de la página |

**Cuidado con el `slug`.** Es la dirección de la categoría y parte de la de cada
pieza. Cambiarlo después de publicar rompe las direcciones de todas sus piezas y
obliga a una redirección por cada una.

Agregar una categoría en el CMS crea sola su página, su entrada en el menú, su
tarjeta en el home, su filtro y su lugar en el mapa del sitio.

---

## 3. Piezas

Es el grueso del trabajo. Una entrada por pieza, con tres bloques de campos.

### 3.1 Identidad

| Campo | Notas |
| --- | --- |
| `slug` | Único en todo el sitio. Es la dirección |
| `nombre` | Solo el nombre: "Órbita", no "Silla Órbita" |
| `tipo` | Lo que es: "Silla operativa". La página los junta |
| `cat` | La categoría a la que pertenece |
| `img` | Una o más fotos. La primera es la principal. En la tarjeta del catálogo se enseñan **dos como mucho**; la galería completa va en la ficha |
| `alt` | Qué se ve en la primera foto |
| `nuevo` | Sí/no. Pinta la etiqueta "Nuevo" en la tarjeta |

El criterio para poner nombre a una pieza nueva está en
[catalogo.md](catalogo.md). No es un detalle de estilo: la `slug` sale de ahí.

### 3.2 Campos de filtro

**Estos son los que hacen funcionar el panel de filtros y no pueden ser texto
libre.** Cada uno solo acepta los valores declarados en `filtros`, `materiales`
y `gruposColor`. Si el CMS manda un valor que no está en la lista, la pieza
desaparece al filtrar por ese campo, y es un fallo difícil de ver porque la
pieza se sigue viendo bien en su página.

En WordPress tienen que ser **listas desplegables o taxonomías**.

| Campo | Aplica a | Valores |
| --- | --- | --- |
| `material` | todas | uno de `materiales` |
| `colores` | todas | uno o varios de `gruposColor` |
| `entrega` | todas | inmediata, 2-3-semanas, sobre-pedido |
| `uso` | sillería | dirección, ejecutiva, operativa, multitask, visita, colectividad |
| `respaldo` | sillería | alto, bajo, con cabecera, sin cabecera |
| `brazos` | sillería | sin brazos, fijos, ajustables |
| `base` | sillería | aluminio, nylon, trineo, cantilever |
| `plazas` | sofás y bancas | 1, 2, 3, 4, 5, puf |
| `extras` | varias | apilable y demás |

Una pieza solo llena los campos que le aplican. El panel esconde los grupos que
no tienen ninguna pieza.

### 3.3 Ficha técnica

| Campo | Qué es |
| --- | --- |
| `resumen` | El párrafo bajo el título, máximo tres renglones |
| `destacados` | Viñetas que la venden. Se leen dentro del panel "Detalles del producto", y **el primero alimenta la descripción de Google**. Ya no se pintan como lista numerada en la página |
| `medidas` | ancho, profundidad, altura, altura de asiento, diámetro, peso |
| `construccion` | estructura, asiento, respaldo, acabado, base |
| `mecanismo` | Solo sillas |
| `cuidados` | Cómo se limpia y se mantiene |
| Ficha en PDF | El archivo que se descarga |

**La ficha pinta solo lo que existe.** Una mesa redonda enseña diámetro y no
ancho, y una pieza sin mecanismo no muestra ese panel. No hay que rellenar de
vacíos.

Si el CMS agrega una clave nueva de medida o de construcción, hay que darla de
alta en `etiquetasMedida` o `etiquetasConstruccion` (en `fichas.js`) o no se
muestra. Es el único punto donde agregar un campo pide tocar código.

---

## 4. Proyectos

Una entrada por proyecto, con una cabecera de datos y una **secuencia de
bloques**. Es lo más laborioso de modelar y lo que más rinde: es lo que evita
que todos los proyectos se vean iguales.

### 4.1 Cabecera

`nombre`, `sector`, `cliente` (si hay autorización), `ciudad`, `anio`,
`espacio`, `escala`, `superficie`, `portada` (foto + alt), `resumen`, `intro`
(varios párrafos, el primero visible y el resto tras "Leer más"), `ficha`
(pares etiqueta/valor extra) y `piezas` (cuáles del catálogo se instalaron).

### 4.2 Los bloques

Campo repetidor con seis tipos: `capitulo`, `imagen`, `duo`, `escenas`,
`destacado` y `video`. Los campos de cada uno están en
[wordpress.md](wordpress.md).

La secuencia que llevan los cuatro de hoy, y que conviene respetar:

```
imagen · capítulo · dúo · destacado · capítulo · escenas ·
capítulo · imagen · dúo · destacado · capítulo · video
```

Nunca dos imágenes seguidas ni dos capítulos seguidos.

### 4.3 Los puntos sobre la foto

El bloque `escenas` es un carrusel de zonas, y cada zona lleva puntos sobre las
piezas. Cada punto es una **posición en porcentaje** más la `slug` de una pieza
del catálogo.

**Un punto cuya pieza no exista no se pinta**, para no mandar a una página que
no existe. Eso va a pasar seguido mientras se carga el catálogo, así que es a
propósito y no hay que "arreglarlo".

En el CMS lo ideal es un selector de pieza (no texto libre) más dos campos de
posición, y si se puede, un selector visual sobre la foto.

---

## 5. Las piezas destacadas del home

Hoy es una lista de ocho `slug` en `site.js`, y **el orden es el orden en que se
ven**. El home las enseña en un carrusel.

Dos maneras de modelarlo en WordPress, las dos válidas:

- **Un campo de relación** en una pantalla de ajustes, donde el cliente arrastra
  las piezas que quiere y en qué orden. Es lo más claro para quien administra.
- **Una casilla "destacada" en cada pieza**, más un campo de orden. Es más
  cómodo al capturar, pero el cliente pierde la vista de conjunto.

Recomiendo la primera.

**Cuántas se muestran:** hoy ocho. Es un carrusel, así que admite más o menos
sin romperse, pero conviene un mínimo de cuatro para que la fila no se vea coja.
Si el campo queda vacío, la sección desaparece del home y no se rompe nada.

El home también enseña **un proyecto**, que es el primero de la lista de
proyectos. Si el orden lo va a decidir el cliente, ese campo también va en la
pantalla de ajustes.

---

## 6. Los filtros

`filtros`, `materiales` y `gruposColor` son las listas maestras. Son
administrables, pero **se tocan poco y se tocan con cuidado**: agregar una
opción es seguro, renombrar o borrar una deja piezas apuntando a un valor que ya
no existe.

Los **grupos de color** merecen una nota. Los colores de tapicería tienen nombre
comercial (plumbago, capuchino, mist) y nadie busca así. Por eso cada color
comercial se mapea a un grupo filtrable (negro, gris, azul, verde...) y el
nombre comercial se guarda para la ficha. Son dos campos distintos, no uno.

El panel calcula los conteos solo: cada opción dice cuántas piezas quedarían si
la marcaras, contando las que ya pasan los demás filtros.

---

## 7. Datos de la empresa

Viven en `site.js` y se ven en todas las páginas.

| Dato | Dónde se ve |
| --- | --- |
| Dominio | canónicas, mapa del sitio, robots.txt |
| WhatsApp | los botones de cotización de todo el sitio |
| Correo | pie, ficha de marca, legales |
| Instagram y Facebook | pie |
| Logotipo | encabezado, pie y la ficha que lee Google |
| Descripción de marca | la ficha que lee Google |

En WordPress es una pantalla de ajustes, no una entrada.

**Cuidado con el dominio.** Si queda mal, quedan mal las canónicas, el mapa del
sitio y el robots.txt de golpe. Es el dato más caro de equivocar.

---

## 8. Qué no se conecta, y por qué

| Qué | Por qué |
| --- | --- |
| Textos del home, de nosotros y de contacto | Cambian una vez al año y son los que más pesan para posicionar. Pasarlos por un editor invita a romperlos sin darse cuenta |
| Aviso de privacidad y términos | Los revisa un abogado. No se editan sin volver a revisarlos |
| La estructura de las páginas | Es el diseño, no contenido |
| Colores, tipografía, espaciados | Igual |

Las **31 preguntas frecuentes** son un caso aparte: hoy están en el código y
conviene conectarlas, porque son las que más se actualizan cuando cambia una
política de entrega o de garantía. Es un tipo de contenido sencillo: pregunta,
respuesta y grupo. Queda a criterio de si entra en esta fase.

---

## 9. Qué pasa al migrar

Hoy hay 26 piezas y 4 proyectos porque el prototipo necesitaba enseñar el sitio
lleno. **Al conectar el CMS, esas páginas desaparecen** y vuelven a aparecer
conforme se cargue el contenido real. Es lo esperado.

Lo que **no** desaparece son las plantillas. Son tres:

| Plantilla | Genera | Hoy |
| --- | --- | --- |
| Categoría | una página por categoría | 8 |
| Detalle de pieza | una página por pieza | 26 |
| Detalle de proyecto | una página por proyecto | 4 |

Y **nueve páginas únicas**, que existen siempre con contenido o sin él:

| Página | Ruta |
| --- | --- |
| Home | `/` |
| Listado del catálogo | `/muebles/` |
| Listado de proyectos | `/proyectos/` |
| Nosotros | `/nosotros/` |
| Contacto | `/contacto/` |
| Preguntas frecuentes | `/preguntas-frecuentes/` |
| Gracias | `/gracias/` |
| Aviso de privacidad | `/aviso-de-privacidad/` |
| Términos y condiciones | `/terminos-y-condiciones/` |

Más el `404`, que no es una página que se visite sino la que responde cuando una
dirección no existe.

**Ojo con el listado del catálogo** (`/muebles/`), que es fácil de olvidar
porque no es ni plantilla ni página de contenido: es la cuadrícula con todos los
filtros, y es de las que más tráfico recibe.

### Probado con el catálogo vacío

Compilé el sitio con cero piezas, cero proyectos y cero destacadas, que es el
estado exacto del día uno de la migración. **Compila y salen 18 páginas**: las
nueve únicas, las ocho categorías y el 404. Pasa la revisión completa.

Para que eso funcionara hubo que tapar cuatro huecos, que ya están tapados:

- El **menú** enseña una tarjeta con la foto del primer proyecto. Sin proyectos
  tumbaba el menú entero, y con él las 48 páginas. Ahora no se pinta.
- El **listado de proyectos** tomaba la foto del primero para compartir en
  redes. Ahora la página existe igual, con su H1 y un aviso de que todavía no
  hay proyectos publicados.
- El **home** enseñaba las cabeceras de "Piezas destacadas" y "Proyectos
  reales" con nada debajo. Ahora esas secciones desaparecen si su lista está
  vacía, y queda hero, categorías, el bloque editorial y el cierre.
- El **catálogo vacío** decía "ninguna pieza coincide con esos filtros", que no
  es el problema. Ahora distingue los dos casos y dice "todavía no hay piezas en
  esta sección".

Y lo que ya funcionaba: un punto que apunte a una pieza que todavía no exista
simplemente no se pinta.

Conforme se carguen piezas y proyectos, las páginas aparecen solas. No hay nada
que activar.
