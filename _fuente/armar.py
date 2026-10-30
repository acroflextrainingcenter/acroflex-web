"""Arma las páginas de la web de Acroflex.

Las páginas nuevas están en _fuente/paginas/<nombre>.html: la primera línea es
`titulo | descripcion | seccion del menu` y el resto es el contenido de <main>.
Este script les pone la cabecera, el menú, el pie legal y los scripts, y deja
el resultado en la raíz (<nombre>.html). La tienda y las páginas legales solo
reciben el menú nuevo (entre <!-- MENU --> y <!-- /MENU -->).

Uso: python3 _fuente/armar.py
"""
import pathlib, re

RAIZ = pathlib.Path(__file__).resolve().parent.parent
FUENTE = RAIZ / "_fuente"
WA = "https://wa.me/51993813336?text=Hola%20Acroflex%20%F0%9F%A4%B8%20Quiero%20informaci%C3%B3n%20para%20inscribirme"
WA_SVG = '<svg viewBox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>'

MENU = [
    ("inicio", "index.html", "Inicio"),
    ("cursos", None, "Cursos"),
    ("horarios", "horarios.html", "Horarios"),
    ("precios", "paquetes.html", "Precios"),
    ("nosotros", "nosotros.html", "Nosotros"),
    ("contacto", "contacto.html", "Contacto"),
]
CURSOS = [
    ("curso-jovenes-adultos.html", "Jóvenes y Adultos", "Desde 14 años"),
    ("curso-flexipower.html", "FlexiPower", "Desde 15 años"),
    ("curso-teens.html", "Teens", "De 7 a 13 años"),
    ("clases-1a1.html", "Clases 1:1", "Personalizadas"),
]

FUENTES = '<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n<link href="https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;800&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />'


def menu(activo, archivo=""):
    items = []
    for clave, href, texto in MENU:
        if clave == "cursos":
            actual = ' aria-current="page"'
            subs = "".join(
                f'<a href="{h}"{actual if h == archivo else ""}>{t}<small>{d}</small></a>' for h, t, d in CURSOS
            )
            items.append(f'<div class="sub"><button class="sub-btn" type="button">Cursos ▾</button><div class="sub-menu">{subs}</div></div>')
        else:
            cur = ' aria-current="page"' if clave == activo else ""
            items.append(f'<a href="{href}"{cur}>{texto}</a>')
    return (
        '<!-- MENU -->\n<header class="top">\n  <div class="wrap top-in">\n'
        '    <a class="top-logo" href="index.html" aria-label="Acroflex, inicio"><img src="logo.png" alt="Acroflex Training Center" width="54" height="54" /></a>\n'
        f'    <nav class="menu" aria-label="Menú principal">{"".join(items)}</nav>\n'
        '    <a class="btn btn-orange top-cta" href="paquetes.html">Inscríbete</a>\n'
        '    <button class="menu-btn" type="button" aria-label="Abrir menú" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>\n'
        '  </div>\n</header>\n<!-- /MENU -->'
    )


def flotantes():
    wa_blanco = WA_SVG.replace("<svg", '<svg fill="#fff" width="24" height="24"')
    return (
        f'<a class="wa-flota" href="{WA}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">{WA_SVG}</a>\n'
        '<div class="barra-movil">\n  <a class="btn btn-orange" href="paquetes.html">Ver precios e inscribirme</a>\n'
        f'  <a class="btn wa" href="{WA}" target="_blank" rel="noopener" aria-label="WhatsApp">{wa_blanco}</a>\n</div>'
    )


def armar_pagina(fuente):
    texto = fuente.read_text()
    cabecera, cuerpo = texto.split("\n", 1)
    titulo, descripcion, activo = [x.strip() for x in cabecera.split("|")]
    pie = (FUENTE / "pie.html").read_text()
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<!-- ESCONDIDA DE GOOGLE mientras se rediseña: quitar esta línea al lanzar la web -->
<meta name="robots" content="noindex, nofollow" />
<title>{titulo}</title>
<meta name="description" content="{descripcion}" />
<link rel="icon" href="logo.png" />
{FUENTES}
<link rel="stylesheet" href="sitio.css" />
<link rel="stylesheet" href="web.css" />
</head>
<body>
<!-- Generada con _fuente/armar.py desde _fuente/paginas/{fuente.name}: editar allá -->
{menu(activo, fuente.name)}
<main>
{cuerpo.strip()}
</main>
{pie.strip()}
{flotantes()}
<script src="web.js"></script>
</body>
</html>
"""
    (RAIZ / fuente.name).write_text(html)
    print("armada", fuente.name)


def poner_menu(nombre, activo):
    p = RAIZ / nombre
    s = p.read_text()
    nuevo = menu(activo, nombre)
    if "<!-- MENU -->" in s:
        s = re.sub(r"<!-- MENU -->.*?<!-- /MENU -->", lambda m: nuevo, s, count=1, flags=re.S)
    else:
        s = re.sub(r'<header class="af-top">.*?</header>', lambda m: nuevo, s, count=1, flags=re.S)
    s = re.sub(r'<link href="https://fonts.googleapis.com/css2[^"]*" rel="stylesheet" />', lambda m: FUENTES.split("\n")[-1], s, count=1)
    if 'href="web.css"' not in s:
        s = s.replace('<link rel="stylesheet" href="sitio.css" />', '<link rel="stylesheet" href="sitio.css" />\n<link rel="stylesheet" href="web.css" />', 1)
    if 'src="web.js"' not in s:
        s = s.replace("</body>", f"{flotantes()}\n<script src=\"web.js\"></script>\n</body>", 1)
    p.write_text(s)
    print("menú en", nombre)


for f in sorted((FUENTE / "paginas").glob("*.html")):
    armar_pagina(f)
poner_menu("paquetes.html", "precios")
for n in ["terminos.html", "devoluciones.html", "privacidad.html", "libro-de-reclamaciones.html"]:
    poner_menu(n, "")
