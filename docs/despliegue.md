# Publicación, dominio y seguridad

Para quien va a montar la infraestructura. Aquí está cómo se publica el sitio,
qué decisiones quedan abiertas y qué hay que dejar cerrado antes de producción.

---

## 1. Qué es lo que se publica

El sitio es **estático**. `npm run build` deja en `dist/` una carpeta de HTML,
CSS, JavaScript, imágenes y PDF. No hay servidor de aplicación, ni base de
datos, ni nada que ejecutar del lado del sitio público: se sirven archivos.

El contenido lo va a administrar el cliente desde un **administrador propio**,
hecho desde cero (ya no se usa WordPress). Eso tiene tres consecuencias que
mandan sobre todo lo demás:

1. **La API del administrador no necesita estar disponible para que el sitio
   funcione.** Si se cae, el sitio sigue en pie. Las llamadas a la API ocurren
   **en la compilación**, no en el navegador del visitante. La única excepción
   es el formulario de contacto, que sí manda a la API en vivo.
2. **Publicar un cambio requiere volver a compilar.** No basta con guardar: la
   API dispara una compilación.
3. **No hay que proteger la lectura de la API del tráfico público** ni
   preocuparse por su velocidad. Solo la consulta el proceso de compilación.

---

## 2. Dónde vive cada cosa

| Pieza | Dónde | Estado |
| --- | --- | --- |
| Plan de Hostinger | Business Web Hosting | Contratado |
| Dominio `neucast.com.mx` | Hay que pasarlo a Hostinger | **Pendiente** |
| El sitio público | Hostinger, en el dominio raíz | Decidido |
| Frontend del administrador | Hostinger, sitio Astro estático aparte en un subdominio tipo `admin.neucast.com.mx` | Decidido, por construir |
| Backend y API del administrador | Hostinger. Si es PHP: Laravel con MySQL. Si es Node: confirmar antes que el plan lo acepte | **Por definir con el desarrollador** |
| Compilación y publicación | GitHub Actions | La vista previa ya funciona; falta el paso a producción |
| Código | GitHub | Listo |

### Antes que nada: el dominio y el WordPress que ya está instalado

Hoy `neucast.com.mx` aparece en el panel de Hostinger como un sitio de
WordPress. Ya no se va a usar WordPress, así que **ese WordPress se puede
retirar en vez de moverlo** a un subdominio. El esquema final es:

- **`neucast.com.mx`** sirve los archivos estáticos que salen de `npm run build`.
  Es lo que ve el público y lo que indexa Google.
- **`admin.neucast.com.mx`** (o el subdominio que se prefiera) sirve el
  frontend del administrador, también estático. Solo lo usa el cliente para
  editar. No tiene cara al público y no se indexa.
- **La API** vive donde la ponga el desarrollador dentro de Hostinger (puede
  ser otro subdominio o una ruta del mismo). La consultan el administrador, la
  compilación y el formulario de contacto.

Pasos, en orden:

1. **Pasar el dominio `neucast.com.mx` a Hostinger**, para tener dominio,
   hospedaje y certificados en un solo panel.
2. **Revisar qué hay publicado hoy en el dominio raíz** antes de retirar el
   WordPress: si alguna dirección existe y está indexada, hay que redirigirla
   en vez de dejarla en 404.
3. **Retirar el WordPress** y dejar el dominio raíz libre para `dist/`.
4. Crear el subdominio del administrador y, si hace falta, el de la API.

### Todo en Hostinger

El sitio público, el administrador y la API se quedan en Hostinger, junto al
dominio. Un solo proveedor y una sola factura.

**El sitio público funciona sin ningún truco.** Son archivos estáticos: HTML,
CSS, JavaScript, imágenes y PDF. No necesita PHP, ni Node, ni base de datos
corriendo del lado del servidor. Lo único que hace falta es que alguien sirva
esos archivos, y eso lo hace cualquier hospedaje.

**Lo que hay que resolver es dónde se compila.** El sitio se compila con Node, y
un hospedaje compartido no siempre trae ese proceso. La forma limpia, y la que
ya está medio armada en el repositorio, es que **la compilación ocurra en GitHub
y lo que suba a Hostinger sea el resultado**:

```
GitHub Actions
  npm ci
  npm run build      → deja dist/ (con los datos que da la API)
  npm run revisar    → si falla, no sube nada
  sube dist/ a Hostinger por SSH → public_html
```

**El plan contratado es Business Web Hosting, que incluye acceso SSH**, así que
la subida va por SSH y no por FTP. Es preferible: se puede sincronizar solo lo
que cambió, se autentica con llave en vez de contraseña, y la llave se guarda
como secreto del repositorio.

Hostinger también tiene integración con Git en el panel. Sirve para traer el
repositorio, pero hay que comprobar si compila o solo copia archivos: lo que se
publica es `dist/`, no el código. Si solo copia, no sirve para esto.

Ya existe `.github/workflows/preview.yml`, que compila, pasa la revisión y
publica la vista previa. Para producción es el mismo archivo cambiando el último
paso: en vez de publicar en GitHub Pages, subir `dist/` a `public_html`. Las
credenciales van como secretos del repositorio, nunca escritas en el archivo.

**El certificado.** Hostinger da Let's Encrypt gratis y lo renueva solo, para el
dominio y para cada subdominio. Hay que activarlo en todos y forzar HTTPS.

## 3. El ciclo de publicación

```
El cliente guarda en el administrador
        ↓ la API avisa a GitHub (repository_dispatch)
GitHub Actions
        ↓ npm run build     (consulta la API y compila Astro con esos datos)
        ↓ fichas y catálogos en PDF de lo que cambió
        ↓ npm run revisar   (si algo falla, no se publica)
Sube dist/ a Hostinger
```

**El paso de revisión no es opcional.** `npm run revisar` recorre el sitio
compilado y devuelve error si encuentra un enlace muerto, un título repetido
entre dos páginas, un texto fuera de medida, una imagen sin alt, un encabezado
saltado o una página fuera del mapa del sitio. Es la red que atrapa lo que el
cliente escriba mal desde el administrador. Conviene que una compilación que no
pase la revisión **no llegue a producción**.

**El aviso a GitHub.** Al guardar, la API llama a la API de GitHub
(`repository_dispatch`) con un token de acceso guardado como secreto del lado
del servidor, nunca en el navegador. Conviene agrupar los avisos para que
guardar cinco veces seguidas no dispare cinco compilaciones.

**Los PDF.** Las fichas técnicas y los catálogos por categoría se generan en el
mismo paso de publicación, para que nunca se queden atrás de la ficha web. Hay
una condición: la plantilla usa **Helvetica Neue**, que viene en Mac pero no en
Linux, que es donde corre GitHub Actions. Para automatizarlo hay que licenciar
la fuente para ese uso o elegir una alternativa muy parecida. **Mientras no
exista el administrador**, los PDF se generan a mano en una Mac:

```bash
npm run fichas      # fichas técnicas, a public/fichas/
npm run catalogos   # catálogos por categoría y general, a public/catalogos/
```

y se suben al repositorio con el resto del sitio.

---

## 4. Lo que hay que dejar cerrado antes de producción

### Certificado y cifrado

- **Certificado SSL** en el dominio y en los subdominios del administrador y de
  la API. Hostinger lo da gratis con Let's Encrypt y lo renueva solo; hay que
  activarlo en todos y forzar HTTPS.
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

### El administrador y la API

- **En un subdominio aparte**, no en el mismo host que sirve el sitio.
- **Usuarios con el permiso mínimo**: el cliente edita contenido; la
  configuración la toca solo quien administra el sistema.
- **Segundo factor** en las cuentas de administración.
- **Copias de seguridad automáticas** de la base y de los archivos subidos.
- **Dependencias al día** (el marco del backend y sus paquetes), que es por
  donde entra casi todo.
- **La lectura de la API, sin escritura para el público.** Lo que consulta la
  compilación no necesita escribir nada; escribir pide sesión del
  administrador. La única ruta pública que recibe datos es la del formulario.
- **El token de GitHub** que dispara la publicación vive solo en el servidor.

### El formulario

Lo recibe la API del administrador. Está explicado campo por campo en
[mapa-de-conexion.md](mapa-de-conexion.md), apartado 6, y en
[administrador.md](administrador.md), apartado 6. El campo `proyecto` (la lista
de Mi proyecto) viaja en el mismo envío. Lo crítico:

- **Validar otra vez en el servidor.** Lo del navegador es comodidad, no
  seguridad.
- **Guardar cada solicitud además de mandar el correo.** Si solo se manda correo
  y ese correo se pierde, la solicitud se pierde en silencio, que es el peor
  error posible aquí.
- **SMTP autenticado**, no la función de correo del servidor, o acaba en spam.
- **Permitir el origen del sitio por CORS**, porque el sitio vive en otro
  dominio que la API.
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
  las páginas: si la API entrega bien los datos, se actualizan solos.
- **Canónicas y etiqueta `robots` por página**, en `src/layouts/Base.astro`. Las
  páginas que no se indexan lo declaran.
- **Datos estructurados** de cada pieza, categoría y proyecto.
- **50 páginas, 46 indexables, sin enlaces rotos.**

---

## 6. Requisitos

- **Node 22.12 o superior** para compilar.
- Nada más del lado del sitio público: no hay base de datos ni proceso que
  mantener vivo. La base y el proceso son de la API del administrador.
- Para generar los PDF a mano: una Mac (por la Helvetica Neue), Chrome y
  Python con Pillow (`scripts/fichas/fotos.py` achica las fotos de los
  catálogos).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # compila a dist/
npm run revisar  # revisa dist/
```
