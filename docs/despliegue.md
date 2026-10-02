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
| Plan de Hostinger | Business Web Hosting. Se conserva (correo y respaldo); el sitio no lo usa | Contratado |
| VPS de Hostinger | KVM 1 para arrancar (se puede subir de plan sin mover nada). Precios en https://www.hostinger.com/mx/vps-hosting | **Por contratar** |
| Entorno de pruebas | `stg.neucast.com.mx`, en el mismo VPS, con noindex y contraseña | Decidido el 2 de octubre de 2026, por montar |
| Correo | El cliente cree que su correo está en GoDaddy. Hay que confirmarlo: define desde dónde manda el formulario y a dónde llegan las solicitudes | **Por confirmar con el cliente** |
| Dominio `neucast.com.mx` | Hay que pasarlo a Hostinger | **Pendiente** |
| El sitio público | Hostinger, en el dominio raíz | Decidido |
| Frontend del administrador | Hostinger, sitio Astro estático aparte en un subdominio tipo `admin.neucast.com.mx` | Decidido, por construir |
| Backend y API del administrador | Hostinger. Si es PHP: Laravel con MySQL. Si es Node: confirmar antes que el plan lo acepte | **Por definir con el desarrollador** |
| Compilación y publicación | En el propio servidor de Neucast (VPS de Hostinger) | Por montar |
| Código | En el servidor de Neucast, con copia en la Mac de Daniel. Nada en GitHub | Decidido el 2 de octubre de 2026 |

### Antes que nada: el dominio y el WordPress que ya está instalado

Hoy `neucast.com.mx` aparece en el panel de Hostinger como un sitio de
WordPress. Ya no se va a usar WordPress, así que **ese WordPress se puede
retirar en vez de moverlo** a un subdominio. El esquema final es:

- **`neucast.com.mx`** sirve los archivos estáticos que salen de `npm run build`.
  Es lo que ve el público y lo que indexa Google.
- **`admin.neucast.com.mx`** (o el subdominio que se prefiera) sirve el
  frontend del administrador, también estático. Solo lo usa el cliente para
  editar. No tiene cara al público y no se indexa.
- **La API** vive en el mismo servidor, en su propio subdominio o ruta. La
  consultan el administrador, la compilación y el formulario de contacto.
- **`stg.neucast.com.mx`** es el entorno de pruebas: una copia del sitio con
  `noindex` y contraseña, para revisar cambios antes de publicarlos.
  Sustituye a la vista previa de GitHub Pages, que se apaga al migrar.

Pasos, en orden:

1. **Pasar el dominio `neucast.com.mx` a Hostinger**, para tener dominio,
   hospedaje y certificados en un solo panel.
2. **Revisar qué hay publicado hoy en el dominio raíz** antes de retirar el
   WordPress: si alguna dirección existe y está indexada, hay que redirigirla
   en vez de dejarla en 404.
3. **Retirar el WordPress** y dejar el dominio raíz libre para `dist/`.
4. Contratar el VPS y crear los subdominios del administrador, de la API y de
   pruebas (`stg.`).

### Infraestructura propia, sin GitHub

**Decisión de Daniel (2 de octubre de 2026): nada del proyecto vive en GitHub.**
Ni el código, ni la compilación, ni la vista previa. Todo queda en
infraestructura de Neucast, en Hostinger, que ya es el proveedor del dominio y
del hospedaje.

**Lo que hace falta y el plan compartido no da.** El sitio público son
archivos estáticos y los sirve cualquier hospedaje. Pero compilarlo necesita
Node, y generar las fichas y los catálogos en PDF necesita Chrome sin
interfaz. El plan Business Web Hosting es hospedaje compartido: corre PHP y
MySQL y da SSH, pero no corre Node de forma permanente ni Chrome. Por eso la
propuesta es **un VPS de Hostinger** (servidor Linux propio, de los planes
chicos) donde viva todo:

| En el VPS | Qué hace |
| --- | --- |
| Nginx | Sirve `neucast.com.mx` (los archivos de `dist/`), `admin.` y `preview.`, con certificados Let's Encrypt |
| La API y su base de datos | El backend del administrador, en el lenguaje que defina el desarrollador (Node o PHP), con MySQL o MariaDB |
| Node y Chrome sin interfaz | Compilan el sitio y generan los PDF cuando el administrador publica |
| Un repositorio Git privado | El código del sitio y del administrador, con copia en la Mac de Daniel |
| Copias de seguridad | De la base de datos, las fotos y los PDF, programadas en el mismo servidor |

Un VPS chico alcanza de sobra: el sitio público es estático y la compilación
corre solo cuando alguien publica. El precio exacto del plan se consulta en
el panel de Hostinger antes de contratar.

**El plan Business Web Hosting se queda** (decisión de Daniel, 2 de octubre de
2026), para el correo y como respaldo. El sitio no lo usa. Lo único nuevo que
se compra es el VPS.

**El entorno de pruebas vive en el mismo VPS.** `stg.neucast.com.mx` sirve una
segunda copia del sitio compilada con los mismos datos, cerrada a Google con
`noindex` y con contraseña para que no la vea nadie de fuera. El flujo que
conviene: todo lo que se guarda en el administrador se publica primero en
pruebas de forma automática, y un botón "Publicar" lo pasa a producción. Así
el cliente revisa antes de que lo vea el público y no hace falta un segundo
servidor. Si algún día el administrador crece mucho, se separa en otro VPS,
pero para arrancar no hace falta.

**El correo.** El cliente cree que su correo está en GoDaddy; hay que
confirmarlo. Importa por dos cosas: a qué buzón llegan las solicitudes del
formulario, y desde qué cuenta las manda el servidor. Si el correo está en
GoDaddy, el servidor puede enviar por el SMTP de esa cuenta con su contraseña
de aplicación, o por un servicio de envío con plan gratuito. Sin esto resuelto
el formulario no puede salir del modo de prueba.

**Firebase y similares quedan descartados.** Resuelven base de datos y
hospedaje, pero no corren Chrome para los PDF, cobran por uso y amarran el
proyecto a un proveedor. Con el VPS todo está en un solo lugar y se puede
mover entero a otro proveedor copiando el servidor.

**Mientras el VPS no exista**, la vista previa sigue en GitHub Pages y los PDF
se generan en la Mac con `npm run fichas` y `npm run catalogos`. Al migrar se
apaga la vista previa de GitHub y se borra el repositorio de ahí.

**El certificado.** Hostinger da Let's Encrypt gratis y lo renueva solo, para el
dominio y para cada subdominio. Hay que activarlo en todos y forzar HTTPS.

## 3. El ciclo de publicación

```
El cliente guarda en el administrador
        ↓ la API encola una publicación (en el mismo servidor)
El servidor de Neucast
        ↓ npm run build     (consulta la API y compila Astro con esos datos)
        ↓ fichas y catálogos en PDF de lo que cambió
        ↓ npm run revisar   (si algo falla, no se publica)
Copia dist/ a la carpeta que sirve neucast.com.mx
```

**El paso de revisión no es opcional.** `npm run revisar` recorre el sitio
compilado y devuelve error si encuentra un enlace muerto, un título repetido
entre dos páginas, un texto fuera de medida, una imagen sin alt, un encabezado
saltado o una página fuera del mapa del sitio. Es la red que atrapa lo que el
cliente escriba mal desde el administrador. Conviene que una compilación que no
pase la revisión **no llegue a producción**.

**La publicación es una tarea del propio servidor.** La API guarda el cambio
y deja una tarea en cola; un proceso del mismo servidor la toma, compila, genera
los PDF, pasa la revisión y, solo si todo pasó, sustituye la carpeta pública
de un golpe (compila en una carpeta aparte y cambia el enlace al final), así el
sitio nunca se ve a medias. El administrador muestra el estado de la última
publicación y el error, si lo hubo.

**Dos publicaciones seguidas no se pisan.** La cola las ejecuta una por una, y
si el cliente guarda tres piezas en un minuto, se compila una sola vez con las
tres.

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
- **La cola de publicación** solo la dispara la API desde el propio servidor;
  nadie la puede llamar desde fuera.

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
