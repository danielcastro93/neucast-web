# Documentación de Neucast

Toda la documentación del proyecto vive en esta carpeta. Empieza por el
documento que corresponda a lo que vengas a hacer.

| Si vienes a... | Lee |
| --- | --- |
| Conectar WordPress | [wordpress.md](wordpress.md) |
| Entender cómo está armado el sitio | [arquitectura.md](arquitectura.md) |
| Tocar el diseño o agregar una pantalla | [design-system.md](design-system.md) |
| Saber qué falta antes de publicar | [pendientes.md](pendientes.md) |
| Entender por qué algo está así | [decisiones.md](decisiones.md) |
| Trabajar sobre el catálogo | [catalogo.md](catalogo.md) |

## Estado

El front está terminado: 48 páginas, 44 indexables, sin enlaces rotos.

```bash
npm run build && npm run revisar
```

Eso comprueba enlaces, SEO, encabezados y las reglas de abajo. Hoy pasa limpio.

Lo que falta es contenido y datos del cliente, no código. La lista completa y al
día está en [pendientes.md](pendientes.md). Lo más urgente, en orden:

1. Conectar el formulario de contacto, que hoy no manda nada.
2. El número de WhatsApp y el correo de ventas reales.
3. El contenido real del catálogo, las fichas y los proyectos.
4. Las fotos reales de producto y de proyecto.

## Reglas que no se negocian

Están explicadas en los documentos, pero conviene tenerlas a la mano:

1. **El mobiliario se presenta como de Neucast.** Nunca se menciona proveedor,
   fabricante, distribución ni comercializadora, y tampoco se dice que Neucast
   fabrique. El origen de la pieza no se toca.
2. **Nunca se inventan cifras.**
3. **Sin guiones largos** en el texto visible.
4. **Los botones dicen la acción concreta**, no "ver más".
5. **Todo lo que se superpone difumina el fondo**, no solo lo oscurece.
