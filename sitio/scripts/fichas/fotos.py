"""Fotos ligeras para los catálogos en PDF.

    python3 scripts/fichas/fotos.py <entrada> <salida> <tipo> [marca]
    python3 scripts/fichas/fotos.py --lote trabajos.json

tipo:
  recorte   foto de producto: se achica y se aplana sobre el gris de la
            plantilla (#EDECE7), así deja de ser PNG con transparencia y pasa
            a JPEG, que pesa mucho menos.
  ambiente  foto de ambiente o de portada: se achica y se comprime.

marca: texto opcional. Si viene, se altera un pixel de forma distinta por
pieza. Solo para medir con el catálogo de maqueta, donde varias piezas
comparten la misma foto: sin esto, el PDF guarda una sola copia de cada foto
repetida y el peso medido sale más bajo que el real.

Las fichas individuales no pasan por aquí: llevan las fotos tal como se
aprobaron.
"""
import sys
import zlib
from PIL import Image

GRIS = (0xED, 0xEC, 0xE7)
MEDIDAS = {
    "recorte": (900, 72),
    "miniatura": (420, 72),  # recorte chico para la rejilla del catálogo general
    "ambiente": (1400, 66),
    "portada": (1800, 68),
}


def preparar(entrada, salida, tipo, marca=""):
    lado, calidad = MEDIDAS[tipo]
    im = Image.open(entrada)
    if tipo in ("recorte", "miniatura"):
        im = im.convert("RGBA")
        fondo = Image.new("RGBA", im.size, GRIS + (255,))
        fondo.alpha_composite(im)
        im = fondo.convert("RGB")
    else:
        im = im.convert("RGB")
    im.thumbnail((lado, lado), Image.LANCZOS)
    if marca:
        n = zlib.crc32(marca.encode())
        im.putpixel((n % im.width, (n // 7) % im.height), (n % 256, (n >> 8) % 256, (n >> 16) % 256))
    im.save(salida, "JPEG", quality=calidad, optimize=True, progressive=True)


def main():
    # en lote: un JSON con [[entrada, salida, tipo, marca], ...]
    if sys.argv[1] == "--lote":
        import json
        with open(sys.argv[2]) as f:
            for trabajo in json.load(f):
                preparar(*trabajo)
        return
    preparar(*sys.argv[1:5])


if __name__ == "__main__":
    main()
