# Neucast

Sitio de [neucast.com.mx](https://neucast.com.mx): mobiliario de diseño para
espacios corporativos.

**Vista previa:** https://danielcastro93.github.io/neucast-web/

Astro 7, estático. El contenido vive en `src/data/` y está preparado para venir
de WordPress.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # compila a dist/
npm run revisar  # revisa dist/: enlaces, SEO, encabezados y reglas del proyecto
```

Node 22.12 o superior.

## Documentación

Todo está en [`docs/`](docs/). Si vienes a conectar WordPress, empieza por
[`docs/mapa-de-conexion.md`](docs/mapa-de-conexion.md): pantalla por pantalla,
qué se ve, de dónde sale y qué hay que crear en el gestor. Después
[`docs/wordpress.md`](docs/wordpress.md) para la forma exacta de cada dato y
[`docs/despliegue.md`](docs/despliegue.md) para hospedaje, certificados y
seguridad.

El índice completo está en [`docs/README.md`](docs/README.md).

## Estado

48 páginas, 44 indexables, sin enlaces rotos. Lo que falta es contenido y datos
del cliente, no código: la lista está en
[`docs/pendientes.md`](docs/pendientes.md).
