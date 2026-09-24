# Neucast

Sitio de [neucast.com.mx](https://neucast.com.mx): mobiliario de diseño para
espacios corporativos.

Astro 7, estático. Se compila a HTML y se publica la carpeta `dist/`. El
contenido vive hoy en `src/data/` y está preparado para venir de WordPress.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # compila a dist/
npm run preview  # sirve dist/ para revisarlo antes de publicar
npm run revisar  # revisa dist/: enlaces, SEO, encabezados y reglas del proyecto
```

Node 22.12 o superior.

## Documentación

Toda está en [`docs/`](docs/README.md).

- [wordpress.md](docs/wordpress.md): qué es administrable y cómo conectarlo
- [arquitectura.md](docs/arquitectura.md): cómo está armado el sitio
- [design-system.md](docs/design-system.md): el diseño y sus reglas
- [pendientes.md](docs/pendientes.md): qué falta antes de publicar
- [decisiones.md](docs/decisiones.md): por qué las cosas están así
- [catalogo.md](docs/catalogo.md): el catálogo y sus filtros

## Antes de publicar

El formulario de contacto **no manda nada** todavía: `SIMULAR_ENVIO` está en
`true` en `src/pages/contacto.astro`. El número de WhatsApp y el correo de
ventas también son de ejemplo. La lista completa está en
[pendientes.md](docs/pendientes.md).
