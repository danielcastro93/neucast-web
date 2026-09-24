# Neucast

Sitio estático en Astro 7 para neucast.com.mx, mobiliario de diseño para
espacios corporativos. Preparado para que el contenido venga de WordPress.

## Comandos

```bash
npm run dev      # servidor local en http://localhost:4321
npm run build    # compila a dist/
npm run preview  # sirve dist/
```

No existen `astro dev --background`, `astro dev stop` ni `astro dev logs`.

## Antes de tocar nada

Lee [`docs/README.md`](docs/README.md), que dice qué documento corresponde a
cada tarea. Los que más se usan:

- `docs/arquitectura.md`: cómo está armado el sitio y qué trampas tiene
- `docs/design-system.md`: el diseño y sus reglas
- `docs/wordpress.md`: qué es administrable
- `docs/pendientes.md`: qué falta antes de publicar

## Reglas del proyecto

1. **El mobiliario se presenta como de Neucast.** Nunca se menciona proveedor,
   fabricante, distribución ni comercializadora, y tampoco se dice que Neucast
   fabrique. El origen de la pieza no se toca.
2. **Nunca se inventan cifras.** Si no hay dato confirmado, no va.
3. **Sin guiones largos** en el texto visible. Se comprueba sobre `dist/`.
4. **Los botones dicen la acción concreta**, no "ver más".
5. **Todo lo que se superpone difumina el fondo**, no solo lo oscurece.
6. **En táctil no hay flechas**: los carruseles se pasan con el dedo.
7. **Todas las capas cierran con animación** y con Escape.
8. **Nada de medidas en `ch` que corten el texto** antes del borde de su caja.
9. Los textos se alinean a la izquierda en teléfono.

## Al terminar un cambio

Compila y comprueba sobre `dist/`: enlaces sin destino, guiones largos,
palabras prohibidas, un `h1` por página, y que el mapa del sitio siga teniendo
exactamente las páginas indexables.
