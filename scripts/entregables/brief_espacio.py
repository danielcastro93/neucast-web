"""Brief de un espacio instalado: el formato que llena el cliente para que
podamos escribir el detalle de un proyecto en el sitio.

    python3 scripts/entregables/brief_espacio.py <carpeta-de-salida>

Un Word con el logotipo y los colores de Neucast. Pide exactamente lo que
pinta la plantilla de proyecto (src/data/proyectos.js): cabecera, resumen,
introducción, capítulos, frases destacadas, fotos con su pie, escenas con las
piezas señaladas y la lista de piezas instaladas. Un brief por espacio.
"""
import os
import sys

from docx import Document
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
salida = sys.argv[1] if len(sys.argv) > 1 else "."
os.makedirs(salida, exist_ok=True)

TINTA = RGBColor(0x1D, 0x1D, 0x1B)
GRIS = RGBColor(0x5F, 0x5E, 0x59)
VERDE = RGBColor(0x48, 0x54, 0x2B)
FUENTE = "Helvetica Neue"

doc = Document()
for s in doc.sections:
    s.page_height, s.page_width = Cm(29.7), Cm(21)
    s.left_margin = s.right_margin = Cm(2)
    s.top_margin, s.bottom_margin = Cm(1.8), Cm(1.8)

estilo = doc.styles["Normal"]
estilo.font.name = FUENTE
estilo.font.size = Pt(10)
estilo.font.color.rgb = TINTA
estilo.element.rPr.rFonts.set(qn("w:eastAsia"), FUENTE)


def sombrear(celda, hexcolor):
    tc = celda._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), hexcolor)
    tc.append(shd)


def bordes(tabla, color="E3E1DB"):
    tbl = tabla._tbl
    pr = tbl.tblPr
    b = OxmlElement("w:tblBorders")
    for lado in ("top", "left", "bottom", "right", "insideH", "insideV"):
        e = OxmlElement(f"w:{lado}")
        e.set(qn("w:val"), "single")
        e.set(qn("w:sz"), "4")
        e.set(qn("w:color"), color)
        b.append(e)
    pr.append(b)


def parrafo(texto="", tam=10, color=TINTA, negrita=False, antes=0, despues=6, mayus=False, espaciado=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(antes)
    p.paragraph_format.space_after = Pt(despues)
    r = p.add_run(texto.upper() if mayus else texto)
    r.font.size = Pt(tam)
    r.font.color.rgb = color
    r.font.bold = negrita
    r.font.name = FUENTE
    if espaciado is not None:
        rPr = r._element.get_or_add_rPr()
        sp = OxmlElement("w:spacing")
        sp.set(qn("w:val"), str(espaciado))
        rPr.append(sp)
    return p


def rotulo(texto, antes=14):
    return parrafo(texto, tam=7.5, color=VERDE, antes=antes, despues=2, mayus=True, espaciado=60)


def titulo(texto, tam=18, antes=2, despues=6):
    return parrafo(texto, tam=tam, negrita=True, antes=antes, despues=despues)


def nota(texto):
    return parrafo(texto, tam=9, color=GRIS, despues=8)


def campos(filas, ancho_etiqueta=5.2):
    """Tabla de dos columnas: qué pedimos (gris) y espacio para contestar."""
    t = doc.add_table(rows=0, cols=2)
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    bordes(t)
    for etiqueta, ayuda, alto in filas:
        c = t.add_row().cells
        c[0].width = Cm(ancho_etiqueta)
        c[1].width = Cm(17 - ancho_etiqueta)
        sombrear(c[0], "F6F5F2")
        p = c[0].paragraphs[0]
        r = p.add_run(etiqueta)
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.name = FUENTE
        if ayuda:
            p2 = c[0].add_paragraph()
            r2 = p2.add_run(ayuda)
            r2.font.size = Pt(8)
            r2.font.color.rgb = GRIS
            r2.font.name = FUENTE
        for _ in range(alto):
            c[1].add_paragraph()
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return t


# ---------- cabecera ----------
logo = os.path.join(RAIZ, "public", "img", "logo-neucast.png")
if os.path.exists(logo):
    doc.add_picture(logo, height=Cm(1.1))
rotulo("Brief de un espacio instalado", antes=10)
titulo("Cuéntanos este proyecto", tam=22, despues=4)
nota(
    "Con esto escribimos la página del proyecto en neucast.com.mx. Llena un brief por cada espacio. "
    "No hace falta redactar bonito: con datos sueltos y frases cortas nosotros armamos el texto. "
    "Si algo no aplica o no lo saben, déjenlo en blanco. No inventamos cifras: lo que no esté confirmado no se publica."
)

# ---------- 1. datos del espacio ----------
rotulo("01")
titulo("El espacio")
campos([
    ("Nombre del proyecto", "Como quieren que aparezca. Ejemplo: Una cafetería para 300 personas", 2),
    ("Tipo de espacio", "Cafetería y comedor, piso de trabajo, recepción y lounge, sala de consejo, oficina completa, terraza…", 1),
    ("Ciudad", "", 1),
    ("Cliente o giro", "Si se puede decir el nombre, bien. Si no, el giro: despacho, corporativo, escuela…", 1),
    ("Cuándo se instaló", "Mes y año aproximados", 1),
    ("Cuánta gente lo usa", "Solo si el dato es real: puestos, comensales, personas por turno", 1),
])

# ---------- 2. la historia ----------
rotulo("02")
titulo("La historia del proyecto")
nota("Es lo que hace que un proyecto se lea y no solo se vea. Tres preguntas.")
campos([
    ("Qué pidió el cliente", "El problema o la necesidad con la que llegó. Ejemplo: el comedor solo se usaba dos horas al día", 4),
    ("Qué se resolvió y cómo", "Qué decisiones se tomaron: distribución, alturas, materiales, colores, flujo de la gente", 5),
    ("Qué cambió después", "Qué pasa hoy en ese espacio que antes no pasaba", 3),
    ("Una frase que resuma el proyecto", "Si la tienen. Si no, la proponemos nosotros", 2),
    ("Algo que no se vea en las fotos", "Plazo de instalación, un reto de obra, una pieza hecha a la medida, lo que cuidaron especialmente", 3),
])

# ---------- 3. las piezas ----------
rotulo("03")
titulo("Las piezas instaladas")
nota("Una por renglón. El nombre del catálogo de Neucast si ya existe; si no, el tipo de mueble y su descripción.")
t = doc.add_table(rows=1, cols=4)
t.alignment = WD_TABLE_ALIGNMENT.CENTER
bordes(t)
for i, h in enumerate(["Pieza (tipo y nombre)", "Cantidad", "Acabado o color", "En qué zona del espacio"]):
    c = t.rows[0].cells[i]
    sombrear(c, "1D1D1B")
    r = c.paragraphs[0].add_run(h.upper())
    r.font.size = Pt(7.5)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    r.font.name = FUENTE
for _ in range(8):
    t.add_row()
doc.add_paragraph()

# ---------- 4. fotos ----------
rotulo("04")
titulo("Las fotos")
nota(
    "Mándenlas aparte, en una carpeta con el nombre del proyecto, en la mayor resolución que tengan "
    "(de 2400 px de ancho en adelante, sin logotipos ni marcas de agua). Aquí solo díganos cuáles son."
)
campos([
    ("Foto de portada", "La que mejor resume el espacio. Horizontal. Nombre del archivo", 1),
    ("Fotos generales", "Vistas amplias del espacio. Nombre de los archivos", 2),
    ("Fotos de detalle", "Acabados, uniones, texturas, una pieza de cerca. Nombre de los archivos", 2),
    ("Foto del espacio en uso", "Con gente, si tienen permiso de publicarla", 1),
    ("Video", "Si existe un recorrido o un clip corto, el enlace o el archivo", 1),
    ("Pie de cada foto", "Una línea por foto: qué se ve y qué pieza aparece. Ejemplo: Barra alta con bancos Mirador junto a la ventana", 4),
])

# ---------- 5. escenas con puntos ----------
rotulo("05")
titulo("Las fotos con piezas señaladas")
nota(
    "En el sitio, algunas fotos llevan puntos sobre los muebles: al tocarlos se abre la pieza del catálogo. "
    "Elijan una o dos fotos donde se vean bien varias piezas y díganos cuáles aparecen. La posición de los puntos la ponemos nosotros."
)
campos([
    ("Foto 1", "Nombre del archivo y piezas que se ven en ella", 3),
    ("Foto 2", "Nombre del archivo y piezas que se ven en ella", 3),
])

# ---------- 6. permisos ----------
rotulo("06")
titulo("Permisos")
campos([
    ("¿Podemos publicar el nombre del cliente?", "Sí / No / Solo el giro", 1),
    ("¿Las fotos son de Neucast o del cliente?", "Y si hace falta pedirle permiso al cliente para publicarlas", 1),
    ("¿Hay algo que no deba aparecer?", "Logotipos del cliente, personas identificables, zonas privadas", 2),
])

p = parrafo("Neucast · neucast.com.mx · Vista previa del sitio: https://danielcastro93.github.io/neucast-web/proyectos/", tam=8, color=RGBColor(0x95, 0x94, 0x8E), antes=16)
p.alignment = WD_ALIGN_PARAGRAPH.LEFT

ruta = os.path.join(salida, "neucast-brief-espacio-instalado.docx")
doc.save(ruta)
print("✓", ruta)
