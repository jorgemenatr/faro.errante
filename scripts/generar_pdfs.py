"""Genera los PDF editables de la página de recursos.

Uso: python3 scripts/generar_pdfs.py
Crea assets/recursos/hoja-de-personaje.pdf y assets/recursos/bitacora-de-aventura.pdf
"""
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white

TINTA = HexColor('#1b2333')
AMBAR = HexColor('#b97a1f')
LINEA = HexColor('#c9c2b4')
SUAVE = HexColor('#6b6458')
CAMPO = HexColor('#f6f2ea')
W, H = letter
M = 36


def encabezado(c, titulo, sub):
    c.setFillColor(TINTA)
    c.rect(0, H - 64, W, 64, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont('Times-Roman', 22)
    c.drawString(M, H - 40, titulo)
    c.setFillColor(HexColor('#e3a74e'))
    c.setFont('Helvetica', 7.5)
    c.drawRightString(W - M, H - 30, 'ORDEN DEL FARO ERRANTE')
    c.setFillColor(HexColor('#a3adbb'))
    c.drawRightString(W - M, H - 42, sub)


def etiqueta(c, x, y, texto):
    c.setFillColor(SUAVE)
    c.setFont('Helvetica', 6.5)
    c.drawString(x, y, texto.upper())


def campo(c, nombre, x, y, w, h, etq=None, multi=False, size=9):
    if etq:
        etiqueta(c, x, y + h + 3, etq)
    flags = 'multiline' if multi else ''
    c.acroForm.textfield(
        name=nombre, x=x, y=y, width=w, height=h, borderWidth=0.6,
        borderColor=LINEA, fillColor=CAMPO, textColor=TINTA, forceBorder=True,
        fontName='Helvetica', fontSize=0 if multi else size, fieldFlags=flags,
        tooltip=etq or nombre,
    )


def casilla(c, nombre, x, y, tip):
    c.acroForm.checkbox(name=nombre, x=x, y=y, size=9, borderWidth=0.6, borderColor=LINEA,
                        fillColor=CAMPO, buttonStyle='check', tooltip=tip)


def titulo_seccion(c, x, y, texto, w):
    c.setFillColor(AMBAR)
    c.setFont('Helvetica-Bold', 7.5)
    c.drawString(x, y, texto.upper())
    c.setStrokeColor(LINEA)
    c.setLineWidth(0.6)
    c.line(x, y - 4, x + w, y - 4)


def hoja_de_personaje(ruta):
    c = canvas.Canvas(ruta, pagesize=letter)
    c.setTitle('Hoja de personaje · Orden del Faro Errante')
    c.setAuthor('Orden del Faro Errante')

    # Página 1
    encabezado(c, 'Hoja de personaje', 'D&D 5.5E')
    y = H - 100
    campo(c, 'nombre', M, y, 250, 20, 'Nombre del personaje', size=12)
    campo(c, 'jugador', M + 262, y, 130, 20, 'Jugador')
    campo(c, 'nivel', M + 404, y, 44, 20, 'Nivel')
    campo(c, 'xp', M + 460, y, 80, 20, 'Experiencia')
    y -= 38
    campo(c, 'clase', M, y, 128, 20, 'Clase')
    campo(c, 'subclase', M + 136, y, 128, 20, 'Subclase')
    campo(c, 'especie', M + 272, y, 128, 20, 'Especie')
    campo(c, 'trasfondo', M + 408, y, 132, 20, 'Trasfondo')

    # Atributos
    attrs = ['Fuerza', 'Destreza', 'Constitución', 'Inteligencia', 'Sabiduría', 'Carisma']
    y_attr = y - 30
    titulo_seccion(c, M, y_attr, 'Atributos', 92)
    yy = y_attr - 16
    for a in attrs:
        clave = a.lower().replace('ó', 'o').replace('í', 'i')
        c.setStrokeColor(LINEA)
        c.roundRect(M, yy - 62, 92, 60, 6, stroke=1, fill=0)
        etiqueta(c, M + 8, yy - 12, a)
        campo(c, f'mod_{clave}', M + 22, yy - 40, 48, 22, size=14)
        campo(c, f'pun_{clave}', M + 30, yy - 58, 32, 14, size=8)
        yy -= 68

    # Salvaciones y habilidades
    x2 = M + 108
    titulo_seccion(c, x2, y_attr, 'Tiradas de salvación', 160)
    ys = y_attr - 20
    for a in attrs:
        clave = a.lower().replace('ó', 'o').replace('í', 'i')
        casilla(c, f'sal_comp_{clave}', x2, ys - 2, f'Competencia en salvación de {a}')
        campo(c, f'sal_{clave}', x2 + 14, ys - 3, 28, 12, size=8)
        c.setFillColor(TINTA); c.setFont('Helvetica', 8.5)
        c.drawString(x2 + 48, ys, a)
        ys -= 16
    ys -= 10
    titulo_seccion(c, x2, ys, 'Habilidades', 160)
    ys -= 20
    habilidades = [('Acrobacias', 'Des'), ('Arcanos', 'Int'), ('Atletismo', 'Fue'), ('Engaño', 'Car'),
                   ('Historia', 'Int'), ('Interpretación', 'Car'), ('Intimidación', 'Car'), ('Investigación', 'Int'),
                   ('Juego de manos', 'Des'), ('Medicina', 'Sab'), ('Naturaleza', 'Int'), ('Percepción', 'Sab'),
                   ('Perspicacia', 'Sab'), ('Persuasión', 'Car'), ('Religión', 'Int'), ('Sigilo', 'Des'),
                   ('Supervivencia', 'Sab'), ('Trato con animales', 'Sab')]
    for nombre, at in habilidades:
        k = ''.join(ch for ch in nombre.lower() if ch.isalnum())
        casilla(c, f'hab_comp_{k}', x2, ys - 2, f'Competencia en {nombre}')
        campo(c, f'hab_{k}', x2 + 14, ys - 3, 28, 12, size=8)
        c.setFillColor(TINTA); c.setFont('Helvetica', 8.5)
        c.drawString(x2 + 48, ys, nombre)
        c.setFillColor(SUAVE); c.setFont('Helvetica', 6.5)
        c.drawRightString(x2 + 160, ys, at.upper())
        ys -= 15.2

    # Combate
    x3 = M + 286
    titulo_seccion(c, x3, y_attr, 'Combate', 254)
    yc = y_attr - 46
    for i, (k, e) in enumerate([('ca', 'CA'), ('iniciativa', 'Iniciativa'), ('velocidad', 'Velocidad'), ('competencia', 'Bono comp.')]):
        campo(c, k, x3 + i * 64, yc, 58, 26, e, size=13)
    yc -= 44
    campo(c, 'pg_max', x3, yc, 80, 26, 'PG máximos', size=13)
    campo(c, 'pg_actuales', x3 + 88, yc, 80, 26, 'PG actuales', size=13)
    campo(c, 'pg_temp', x3 + 176, yc, 78, 26, 'PG temporales', size=13)
    yc -= 40
    campo(c, 'dados_golpe', x3, yc, 124, 20, 'Dados de golpe')
    campo(c, 'percepcion_pasiva', x3 + 132, yc, 122, 20, 'Percepción pasiva')
    yc -= 30
    etiqueta(c, x3, yc + 4, 'Salvaciones contra muerte')
    c.setFillColor(TINTA); c.setFont('Helvetica', 8)
    c.drawString(x3, yc - 10, 'Éxitos')
    c.drawString(x3 + 132, yc - 10, 'Fallos')
    for i in range(3):
        casilla(c, f'muerte_exito_{i+1}', x3 + 40 + i * 14, yc - 12, f'Éxito {i+1}')
        casilla(c, f'muerte_fallo_{i+1}', x3 + 170 + i * 14, yc - 12, f'Fallo {i+1}')
    yc -= 36
    titulo_seccion(c, x3, yc, 'Armas y trucos de daño', 254)
    yc -= 14
    etiqueta(c, x3, yc, 'Nombre'); etiqueta(c, x3 + 120, yc, 'Bono'); etiqueta(c, x3 + 166, yc, 'Daño y tipo')
    yc -= 20
    for i in range(5):
        campo(c, f'arma_{i+1}_nombre', x3, yc, 114, 16)
        campo(c, f'arma_{i+1}_bono', x3 + 120, yc, 40, 16)
        campo(c, f'arma_{i+1}_dano', x3 + 166, yc, 88, 16)
        yc -= 21
    yc -= 12
    campo(c, 'rasgos_clase', x3, M + 10, 254, yc - M - 14, 'Rasgos de clase', multi=True)

    c.setFillColor(SUAVE); c.setFont('Helvetica', 6.5)
    c.drawString(M, 18, 'Página 1 de 2 · Hoja editable: escribe directamente en los campos.')
    c.showPage()

    # Página 2
    encabezado(c, 'Hoja de personaje', 'D&D 5.5E · PÁGINA 2')
    y = H - 100
    campo(c, 'rasgos_especie', M, y - 120, 262, 132, 'Rasgos de especie', multi=True)
    campo(c, 'dotes', M + 278, y - 120, 262, 132, 'Dotes', multi=True)
    y -= 156
    campo(c, 'competencias', M, y - 96, 262, 108, 'Competencias de armas, armaduras y herramientas', multi=True)
    campo(c, 'idiomas', M + 278, y - 96, 262, 108, 'Idiomas', multi=True)
    y -= 132
    campo(c, 'equipo', M, y - 132, 262, 144, 'Equipo', multi=True)
    etiqueta(c, M + 278, y + 15, 'Monedas')
    for i, mon in enumerate(['PC', 'PP', 'PE', 'PO', 'PPT']):
        campo(c, f'moneda_{mon.lower()}', M + 278 + i * 53, y - 8, 47, 20)
        c.setFillColor(SUAVE); c.setFont('Helvetica', 6.5)
        c.drawCentredString(M + 278 + i * 53 + 23, y - 18, mon)
    campo(c, 'objetos_magicos', M + 278, y - 132, 262, 96, 'Objetos mágicos y sintonía', multi=True)
    y -= 168
    campo(c, 'conjuros', M, y - 110, 262, 122, 'Conjuros (aptitud, CD, bono de ataque y lista)', multi=True)
    campo(c, 'historia', M + 278, y - 110, 262, 122, 'Historia, apariencia y notas', multi=True)
    c.setFillColor(SUAVE); c.setFont('Helvetica', 6.5)
    c.drawString(M, 18, 'Página 2 de 2 · Orden del Faro Errante')
    c.showPage()
    c.save()


def bitacora(ruta):
    c = canvas.Canvas(ruta, pagesize=letter)
    c.setTitle('Bitácora de aventura terminada · Orden del Faro Errante')
    c.setAuthor('Orden del Faro Errante')
    encabezado(c, 'Bitácora de aventura terminada', 'SE ENTREGA AL FINAL DE CADA SESIÓN')
    y = H - 100
    campo(c, 'titulo', M, y, 330, 20, 'Título de la aventura', size=12)
    campo(c, 'fecha', M + 342, y, 90, 20, 'Fecha')
    campo(c, 'dm', M + 444, y, 96, 20, 'Dungeon Master')
    y -= 38
    campo(c, 'zona', M, y, 260, 20, 'Zona explorada')
    campo(c, 'nivel', M + 272, y, 80, 20, 'Nivel (T1–T3)')
    campo(c, 'duracion', M + 364, y, 80, 20, 'Duración')
    campo(c, 'regreso', M + 456, y, 84, 20, '¿Regresaron?')
    y -= 30
    titulo_seccion(c, M, y, 'Grupo', W - 2 * M)
    y -= 16
    etiqueta(c, M, y, 'Jugador'); etiqueta(c, M + 190, y, 'Personaje'); etiqueta(c, M + 380, y, 'Clase y nivel')
    y -= 20
    for i in range(6):
        campo(c, f'jugador_{i+1}', M, y, 182, 16)
        campo(c, f'personaje_{i+1}', M + 190, y, 182, 16)
        campo(c, f'clase_{i+1}', M + 380, y, 160, 16)
        y -= 20
    y -= 18
    campo(c, 'resumen', M, y - 110, W - 2 * M, 122, 'Resumen: qué pasó en la sesión', multi=True)
    y -= 146
    campo(c, 'descubrimientos', M, y - 84, 262, 96, 'Descubrimientos para el mapa compartido', multi=True)
    campo(c, 'rumores', M + 278, y - 84, 262, 96, 'Rumores y ganchos para otras mesas', multi=True)
    y -= 120
    campo(c, 'botin', M, y - 72, 262, 84, 'Botín y recompensas', multi=True)
    campo(c, 'consecuencias', M + 278, y - 72, 262, 84, 'Bajas, heridas y consecuencias', multi=True)
    y -= 106
    campo(c, 'xp', M, y, 120, 20, 'XP por personaje')
    campo(c, 'firma', M + 132, y, 408, 20, 'Notas del DM')
    c.setFillColor(SUAVE); c.setFont('Helvetica', 6.5)
    c.drawString(M, 18, 'En West Marches lo que descubre un grupo lo usan los demás. Llena esta bitácora y compártela en el canal del gremio.')
    c.showPage()
    c.save()


if __name__ == '__main__':
    hoja_de_personaje('assets/recursos/hoja-de-personaje.pdf')
    bitacora('assets/recursos/bitacora-de-aventura.pdf')
    print('PDFs generados en assets/recursos/')
