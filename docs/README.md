# Documentación de Neucast

Sitio de [neucast.com.mx](https://neucast.com.mx): mobiliario de diseño para
espacios corporativos. Astro 7, estático, preparado para que el contenido venga
de WordPress.

## Por dónde empezar

**Si vienes a conectar WordPress, lee estos tres en este orden:**

1. [mapa-de-conexion.md](mapa-de-conexion.md) — pantalla por pantalla, qué se ve,
   de dónde sale y qué hay que crear en WordPress. Empieza aquí.
2. [wordpress.md](wordpress.md) — la forma exacta de cada dato y qué pasa al
   migrar.
3. [despliegue.md](despliegue.md) — dónde se hospeda, el ciclo de publicación,
   certificados y seguridad.

**Para lo demás:**

| Si vienes a... | Lee |
| --- | --- |
| Saber qué va a poder editar el cliente | [administrable.md](administrable.md) |
| Entender cómo está armado el sitio | [arquitectura.md](arquitectura.md) |
| Tocar el diseño o agregar una pantalla | [design-system.md](design-system.md) |
| Saber qué falta antes de publicar | [pendientes.md](pendientes.md) |
| Entender por qué algo está así | [decisiones.md](decisiones.md) |
| Trabajar sobre el catálogo | [catalogo.md](catalogo.md) |

## Estado

El front está terminado: **48 páginas, 44 indexables, sin enlaces rotos.**

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # compila a dist/
npm run revisar  # revisa dist/
```

`revisar` comprueba enlaces, medidas de títulos y descripciones, títulos
repetidos, encabezados, imágenes sin alt, datos estructurados, el mapa del sitio
y las reglas de abajo. Hoy pasa limpio, y conviene correrlo en cada publicación
desde WordPress.

Lo que falta es **contenido y datos del cliente, no código**. Lo más urgente, en
orden:

1. Conectar el formulario de contacto, que hoy no manda nada.
2. El número de WhatsApp y el correo de ventas reales.
3. El contenido real del catálogo, las fichas y los proyectos.
4. Las fotos reales de producto y de proyecto.
5. Los datos fiscales para las páginas legales, que además tiene que revisar un
   abogado en cuanto el formulario funcione.

La lista completa está en [pendientes.md](pendientes.md).

## Reglas que no se negocian

Están explicadas en los documentos, pero conviene tenerlas a la mano:

1. **El mobiliario se presenta como de Neucast.** Nunca se menciona proveedor,
   fabricante, distribución ni comercializadora, y tampoco se dice que Neucast
   fabrique. El origen de la pieza no se toca.
2. **Nunca se inventan cifras.** Si no hay dato confirmado, no va.
3. **Sin guiones largos** en el texto visible.
4. **Los botones dicen la acción concreta**, no "ver más".
5. **Todo lo que se superpone difumina el fondo**, no solo lo oscurece.

`npm run revisar` comprueba las tres últimas de forma automática.
