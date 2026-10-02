# Neucast

Sitio de [neucast.com.mx](https://neucast.com.mx): mobiliario de diseño para
espacios corporativos.

**Vista previa:** https://danielcastro93.github.io/neucast-web/

Astro 7, estático. El contenido vive en `sitio/src/data/` y está preparado para venir
de un administrador propio: un sitio Astro aparte que habla con una API (ya no
se usa WordPress).

Un solo repositorio con cuatro carpetas: `sitio/` (el sitio público),
`compartido/` (tokens, estilos y componentes que usan el sitio y el
administrador), `admin/` (el frontend del administrador, por construir) y
`api/` (el backend y la API, de Amauri). Son workspaces de npm: los comandos se
corren desde la raíz.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # compila a sitio/dist/
npm run revisar  # revisa sitio/dist/: enlaces, SEO, encabezados y reglas del proyecto
npm run fichas     # fichas técnicas en PDF, en una Mac
npm run catalogos  # catálogos en PDF, en una Mac
```

Node 22.12 o superior.

## Documentación

Todo está en [`docs/`](docs/). Si vienes a construir o conectar el
administrador, empieza por
[`docs/mapa-de-conexion.md`](docs/mapa-de-conexion.md): pantalla por pantalla,
qué se ve, de dónde sale y qué hay que crear en el administrador. Después
[`docs/administrador.md`](docs/administrador.md) para la forma exacta de cada
dato (el contrato con la API) y [`docs/despliegue.md`](docs/despliegue.md) para
hospedaje, publicación, certificados y seguridad.

El índice completo está en [`docs/README.md`](docs/README.md).

## Estado

50 páginas, 46 indexables, sin enlaces rotos. Lo que falta es contenido y datos
del cliente, no código: la lista está en
[`docs/pendientes.md`](docs/pendientes.md).
