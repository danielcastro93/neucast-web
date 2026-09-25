# Publicación, dominio y seguridad

Para quien va a montar la infraestructura. Aquí está cómo se publica el sitio,
qué decisiones quedan abiertas y qué hay que dejar cerrado antes de producción.

---

## 1. Qué es lo que se publica

El sitio es **estático**. `npm run build` deja en `dist/` una carpeta de HTML,
CSS, JavaScript e imágenes. No hay servidor de aplicación, ni base de datos, ni
nada que ejecutar: se sirven archivos.

Eso tiene tres consecuencias que mandan sobre todo lo demás:

1. **WordPress no necesita estar disponible para que el sitio funcione.** Si se
   cae el CMS, el sitio sigue en pie. Las llamadas a WordPress ocurren **en la
   compilación**, no en el navegador del visitante.
2. **Publicar un cambio en WordPress requiere volver a compilar.** No basta con
   guardar: hay que disparar una compilación.
3. **No hay que proteger la API del tráfico público** ni preocuparse por su
   velocidad. Solo la consulta el proceso de compilación.

---

## 2. Dónde vive cada cosa

| Pieza | Dónde | Estado |
| --- | --- | --- |
| Dominio `neucast.com.mx` | Hostinger | Contratado |
| WordPress (administración) | Hostinger, en un subdominio tipo `admin.neucast.com.mx` | Por montar |
| El sitio público | Hostinger, junto al dominio | Decidido |
| Código | GitHub | Listo |

### Todo en Hostinger

El sitio público se queda en Hostinger, junto al dominio y a WordPress. Un solo
proveedor y una sola factura.

**Funciona sin ningún truco.** El sitio son archivos estáticos: HTML, CSS,
JavaScript e imágenes. No necesita PHP, ni Node, ni base de datos corriendo del
lado del servidor. Lo único que hace falta es que alguien sirva esos archivos, y
eso lo hace cualquier hospedaje.

**Lo único que hay que resolver es dónde se compila.** El sitio se compila con
Node, y un hospedaje compartido no siempre trae ese proceso. La forma limpia, y
la que ya está medio armada en el repositorio, es que **la compilación ocurra en
GitHub y lo que suba a Hostinger sea el resultado**:

```
GitHub Actions
  npm ci
  npm run build      → deja dist/
  npm run revisar    → si falla, no sube nada
  sube dist/ a Hostinger por FTP o SSH → public_html
```

Hostinger da credenciales de FTP en todos sus planes y acceso SSH en algunos.
Con cualquiera de los dos funciona; **cuál usar lo confirma quien monte la
infraestructura según el plan contratado.** Hostinger también tiene integración
con Git en algunos planes: sirve para traer el repositorio, pero hay que
comprobar si compila o solo copia archivos, porque lo que se publica es `dist/`
y no el código.

Ya existe `.github/workflows/preview.yml`, que compila, pasa la revisión y
publica la vista previa. Para producción es el mismo archivo cambiando el último
paso: en vez de publicar en GitHub Pages, subir `dist/` a `public_html`. Las
credenciales van como secretos del repositorio, nunca escritas en el archivo.

**El certificado.** Hostinger da Let's Encrypt gratis y lo renueva solo, tanto
para el dominio como para el subdominio de WordPress. Hay que activarlo en los
dos y forzar HTTPS.

## 3. El ciclo de publicación

```
El cliente guarda en WordPress
        ↓ webhook
Se dispara la compilación
        ↓ npm run build   (consulta la API de WordPress)
        ↓ npm run revisar (si algo falla, no se publica)
Se publica dist/
```

**El paso de revisión no es opcional.** `npm run revisar` recorre el sitio
compilado y devuelve error si encuentra un enlace muerto, un título repetido
entre dos páginas, un texto fuera de medida, una imagen sin alt, un encabezado
saltado o una página fuera del mapa del sitio. Es la red que atrapa lo que el
cliente escriba mal desde el CMS. Conviene que una compilación que no pase la
revisión **no llegue a producción**.

**El webhook.** WordPress tiene que avisar cuando se publica algo. Como la
compilación vive en GitHub Actions, el aviso es una llamada a la API de GitHub
(`repository_dispatch`) desde un `hook` de `save_post`, con un token de acceso
guardado en WordPress. Conviene agrupar los avisos para que guardar cinco veces
seguidas no dispare cinco compilaciones.

---

## 4. Lo que hay que dejar cerrado antes de producción

### Certificado y cifrado

- **Certificado SSL** en el dominio y en el subdominio de WordPress. Let's
  Encrypt basta y los tres proveedores lo renuevan solos.
- **Todo el tráfico por HTTPS**, con redirección permanente desde HTTP.
- **HSTS.** El sitio ya declara `strict-transport-security` en la vista previa;
  hay que confirmarlo en producción.
- **Sin contenido mixto.** Todo lo que cargue la página tiene que ir por HTTPS.

### Direcciones

- **Una sola dirección canónica.** Decidir si el sitio vive en `neucast.com.mx` o
  en `www.neucast.com.mx` y redirigir la otra de forma permanente. El sitio
  declara sus canónicas **con diagonal final**; la configuración del servidor
  tiene que respetar eso o se duplican las páginas a ojos de Google.
- **`site.domain` en `src/data/site.js` tiene que coincidir exactamente** con la
  dirección elegida, con `https://` y sin diagonal final. Si queda mal, quedan
  mal las canónicas, el mapa del sitio y todas las direcciones absolutas de
  golpe. Es el dato más caro de equivocar.
- **Página 404 propia**, que ya existe, servida con el código 404 de verdad.

### WordPress

- **En un subdominio aparte**, no en el mismo host que sirve el sitio.
- **Usuarios con el permiso mínimo**: el cliente edita contenido, no instala
  plugins.
- **Segundo factor** en las cuentas de administración.
- **Copias de seguridad automáticas** de la base y de los archivos subidos.
- **Actualizaciones al día**, que es por donde entra casi todo.
- **La API de solo lectura para el público.** Lo que consulta la compilación no
  necesita escribir nada.

### El formulario

Está explicado campo por campo en [mapa-de-conexion.md](mapa-de-conexion.md),
apartado 6. Lo crítico:

- **Validar otra vez en el servidor.** Lo del navegador es comodidad, no
  seguridad.
- **Guardar cada solicitud además de mandar el correo.** Si solo se manda correo
  y ese correo se pierde, la solicitud se pierde en silencio, que es el peor
  error posible aquí.
- **SMTP autenticado**, no la función de correo del servidor, o acaba en spam.
- **Permitir el origen del sitio por CORS**, porque el frontend vive en otro
  dominio que el CMS.
- **El campo trampa `sitio_web`**: si llega con contenido es un robot y hay que
  descartarlo sin responder.
- **Límite de envíos por IP**, para que nadie inunde el buzón.

### Analítica

Todavía no hay ninguna. **El día que se agregue hay que declararla en el aviso de
privacidad y poner un aviso de cookies**, porque hoy los legales dicen que el
sitio no usa cookies. Ver `pendientes.md`.

---

## 5. Lo que ya está resuelto y conviene no rehacer

- **Mapa del sitio y `robots.txt`** se generan de las mismas listas que generan
  las páginas: si WordPress se conecta bien, se actualizan solos.
- **Canónicas y etiqueta `robots` por página**, en `src/layouts/Base.astro`. Las
  páginas que no se indexan lo declaran.
- **Datos estructurados** de cada pieza, categoría y proyecto.
- **48 páginas, 44 indexables, sin enlaces rotos.**

---

## 6. Requisitos

- **Node 22.12 o superior** para compilar.
- Nada más. No hay base de datos ni proceso que mantener vivo del lado del sitio.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # compila a dist/
npm run revisar  # revisa dist/
```
