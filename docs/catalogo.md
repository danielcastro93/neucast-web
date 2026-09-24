# Catálogo: taxonomía, nomenclatura y filtros

Cómo está estructurado el producto, de dónde sale cada filtro y qué criterio
siguen los nombres de las piezas. Es el documento a la mano al capturar el
catálogo real en WordPress.

---

## 1. Nomenclatura de las piezas

**Las piezas llevan nombre propio de Neucast.** No se usan los nombres de modelo
que traen los catálogos de origen.

El criterio es que el nombre diga algo de la pieza, no que sea un nombre bonito
al azar. Hay dos familias:

- **Lugares mexicanos cuyo carácter encaja con la pieza**: Polanco y Reforma
  para dirección, Condesa y Roma para sofás de sobremesa, Coyoacán para un
  sillón, Tulum para una apilable ligera, Bosques para una credenza de madera.
- **Nombres que describen la forma o la función**: Ángulo para el escritorio en
  L, Hilera para el bench, Andén para la banca de espera, Mirador para el banco
  alto, Círculo para la mesa redonda, Bitácora para el archivero, Cátedra para
  la ejecutiva en piel, Ágora para la de visita.

Y los que ya venían del prototipo y funcionaban: Tempo, Nube, Eje, Órbita,
Piedra, Lineal, Brisa.

**El nombre no repite el tipo.** En los datos, `nombre` es "Órbita" y `tipo` es
"Silla operativa". La página los junta; el campo no.

Cuando entre una pieza nueva, el nombre se decide con este criterio antes de
capturarla. No es un detalle de estilo: la `slug` es la dirección de la página y
cambiarla después cuesta una redirección.

---

## 2. Taxonomía

### Las ocho categorías del sitio

Sillas ejecutivas · Sillas operativas · Salas de juntas · Escritorios ·
Cafeterías · Lounge y áreas comunes · Almacenamiento · Exteriores

Son las que existen como página y como filtro. Cada una vive en
`categories`, dentro de `src/data/site.js`, con su foto y sus textos de
posicionamiento.

### Atributos por familia

**Sillería**
- Uso: dirección, ejecutiva, operativa, multitask, visita, colectividad
- Respaldo: alto, bajo, con cabecera, sin cabecera
- Material del respaldo: malla, tapizado, plástico ventilado
- Mecanismo: synchro multiposiciones, reclinable con ajuste de inclinación y
  profundidad, rodilla con bloqueo y tensión
- Descansabrazos: fijos, 2D, 3D, sin brazos
- Base: aluminio pulido 5 puntas, nylon, trineo, cantilever (visita)
- Apilable: sí / no

**Sofás y bancas**
- Plazas: 1, 2, 3, 4, 5, puf
- Armazón: madera de pino sólido
- Patas: metal cromado, pintura gris o negra

**Escritorios, mesas y guardado**
- Tipo: recto, en L, península, bench, mesa de juntas, mesa de consejo,
  credenza, archivero, librero
- Gavetas: 2, 3, 4 puertas
- Medidas en cm

---

## 3. Colores: por qué hay dos niveles

Los colores de tapicería tienen nombre comercial: plumbago, fiusha, capuchino,
mist, humo, mandarina, ciruela, camello, burgundy, latte.

**Para filtrar no sirven así. Nadie busca "plumbago".** Por eso cada color
comercial se mapea a un **grupo de color** filtrable (negro, gris, blanco, azul,
verde, rojo, café, beige, amarillo) y el nombre comercial se guarda para la
ficha de la pieza.

Los grupos están en `gruposColor`, dentro de `src/data/catalogo.js`. El campo
`colores` de cada pieza lleva ids de esa lista, nunca nombres comerciales.

## 4. Familias de tapicería

Son nombres de familia, no de color:

| Familia | Colores |
|---|---|
| E-Fabric Addison | 14 |
| E-Fabric Reyna | 20 |
| E-Fabric Crepé | 16 |
| E-Fabric Plus | 4 |
| Technoleather | 16 |
| Eco-Leather | 6 |
| Genuine Leather | 4 |
| SmartMesh | 9 |
| SmartMesh Plus | 4 |

## 5. Medidas que lleva cada familia

- **Sillería**: alto piso-asiento, ancho y fondo de asiento, alto y ancho de
  respaldo, interno y externo de brazos, cabecera
- **Sofás**: alto, ancho y fondo total, fondo de asiento, altura piso-asiento,
  medida interna de brazo
- **Bancas y mesas**: diámetro, altura, medida de cubierta

La ficha pinta solo los campos que existen, así que una mesa redonda enseña
diámetro y no ancho, sin dejar huecos.

---

## 6. Los filtros

**Visibles siempre, en la barra:** Categoría · Color · Material · Disponibilidad

**Dentro del panel completo:**
- Tipo de uso (dirección, ejecutiva, operativa, visita, colectividad)
- Respaldo (alto, bajo, con cabecera)
- Plazas (sofás y bancas)
- Brazos (sin brazos, fijos, ajustables)
- Base
- Apilable
- Disponibilidad (entrega rápida)

**No hay filtro de precio** porque el sitio no publica precios. En su lugar va
**Disponibilidad**, que sí se tiene y sí decide una compra: hay modelos con
entrega rápida y conviene poder verlos solos.

**Cada filtro sale de un campo, nunca del texto libre**, o el filtrado no es
fiable. Los valores posibles están declarados en `filtros`, `materiales` y
`gruposColor`, dentro de `src/data/catalogo.js`. Si el CMS manda un valor que no
esté en la lista, la pieza desaparece al filtrar por ese campo, así que en
WordPress tienen que ser listas desplegables o taxonomías.

El panel calcula los conteos en vivo: cada opción dice cuántas piezas quedarían
si la marcaras, contando las que pasan los demás filtros ya aplicados.

---

## 7. Preguntas abiertas para el cliente

- **La paginación de hoy carga de veinte en veinte** con un botón. Con 26 piezas
  sobra; a partir de unas doscientas conviene revisar si hace falta paginación
  de verdad y un buscador (ver [pendientes.md](pendientes.md)).
- **Hay una línea de negocio que el sitio no contempla.** No es un detalle de
  catálogo: cambiaría el mapa del sitio. Está en las notas internas del
  proyecto y hay que preguntar si entra en esta fase, en una posterior, o si se
  queda fuera a propósito.
