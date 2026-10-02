# API y backend de Neucast

Aquí va el backend del administrador: la base de datos, la API que consumen el
frontend del administrador (`admin/`) y la compilación del sitio (`sitio/`), la
recepción del formulario de contacto y la cola de publicación. Lo construye
Amauri. El lenguaje está por definir (Node o PHP, con MySQL); corre en el VPS de
Hostinger, así que cualquiera de los dos sirve.

Hoy esta carpeta solo tiene este archivo. El contrato ya está escrito y no se
repite aquí para que exista en un solo lugar:

| Qué necesitas | Dónde está |
| --- | --- |
| Cómo es el administrador, la forma exacta de cada dato que la API tiene que entregar (piezas, fichas, categorías, proyectos, home office, ajustes) y las listas cerradas | [`docs/administrador.md`](../docs/administrador.md) |
| Pantalla por pantalla, qué se ve en el sitio, de dónde sale y qué hay que crear en el administrador | [`docs/mapa-de-conexion.md`](../docs/mapa-de-conexion.md) |
| Todo lo que el cliente va a poder editar, contado desde su punto de vista | [`docs/administrable.md`](../docs/administrable.md) |
| El VPS, los subdominios, el entorno de pruebas `stg.`, el ciclo de publicación, el formulario (validación, SMTP, CORS, campo trampa, límite por IP), certificados y seguridad | [`docs/despliegue.md`](../docs/despliegue.md) |

## Lo que la API tiene que hacer, en una lista

1. **Entregar los datos para compilar el sitio.** La compilación de `sitio/`
   consulta la API y espera exactamente las formas que hoy tienen los objetos
   de `sitio/src/data/*.js`. Solo lectura; nadie más la consulta.
2. **Recibir el formulario de contacto** (`POST` en JSON, campos en
   `docs/administrador.md`, apartado 6). Guardar cada solicitud además de
   mandar el correo.
3. **Dar servicio al frontend del administrador:** sesión, usuarios con
   permisos, alta y edición de todo lo administrable, subida de fotos.
4. **Encolar la publicación:** al guardar, compilar a `stg.neucast.com.mx`;
   con el botón "Publicar", compilar a producción. La compilación corre
   `npm run build`, genera los PDF, corre `npm run revisar` y solo si todo
   pasa sustituye la carpeta pública (`docs/despliegue.md`, apartado 3).
5. **Reportar el estado** de la última publicación y su error, si lo hubo.

Las rutas de la API las define quien la construye. Mientras no existan, el
frontend del administrador trabaja contra una simulación local con los mismos
datos de `sitio/src/data/`.
