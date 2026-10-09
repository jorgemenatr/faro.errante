# Orden del Faro Errante

Sitio estático (HTML + CSS + JS, sin dependencias). Abre `index.html` en el navegador o sirve la carpeta con cualquier servidor estático:

```
npx http-server .
```

## Imágenes

Coloca las imágenes en `assets/img/` con estos nombres. Mientras falte alguna, el sitio muestra un fondo de respaldo.

| Archivo | Uso | Proporción |
|---|---|---|
| `hero.jpg` | Hero (escritorio) | 21:9 |
| `hero-mobile.jpg` | Hero (celular, va arriba del texto) | 4:5 |
| `card-mesas.jpg` | Tarjeta Mesas de juego | 3:2 |
| `card-personaje.jpg` | Tarjeta Mi personaje | 3:2 |
| `card-gremio.jpg` | Tarjeta Gremio | 3:2 |
| `card-recursos.jpg` | Tarjeta Recursos | 3:2 |
| `texture.jpg` | Textura de fondo (mosaico) | 1:1 |
| `logo.png` | Emblema (header, pie y favicon) | 1:1 |
| `og.jpg` | Imagen al compartir en redes | 1.91:1 |

### Fotos de ejemplo de las mesas

Las fotos en `assets/img/mesas/` vienen de Wikimedia Commons. Su licencia pide dar crédito, por eso cada tarjeta lo muestra.

| Archivo | Original | Autor | Licencia |
|---|---|---|---|
| `puente.jpg` | [DnD Game 02](https://commons.wikimedia.org/wiki/File:DnD_Game_02.jpg) | Nicole Hill | CC BY-SA 4.0 |
| `faro.jpg` | [Dice and Spanish-language character sheet during an RPG session](https://commons.wikimedia.org/wiki/File:Dice_and_Spanish-language_character_sheet_during_an_RPG_session.jpg) | Jorge Leal | CC BY 2.0 |
| `grieta.jpg` | [D&D Game 1](https://commons.wikimedia.org/wiki/File:D%26D_Game_1.jpg) | Philip Mitchell | CC BY-SA 3.0 |
| `biblioteca.jpg` | [DnD Game 05](https://commons.wikimedia.org/wiki/File:DnD_Game_05.jpg) | Nicole Hill | CC BY-SA 4.0 |
| `rio.jpg` | [Miniatures by C Jones](https://commons.wikimedia.org/wiki/File:Miniatures_by_C_Jones.jpg) | RightCowLeftCoast | CC BY-SA 4.0 |
| `niebla.jpg` | [Role playing gamers](https://commons.wikimedia.org/wiki/File:Role_playing_gamers.jpg) | Diacritica | CC BY-SA 3.0 |

### Fotos de la galería del gremio

La galería de `gremio.html` usa las fotos de las mesas y estas tres, también de Wikimedia Commons:

| Archivo | Original | Autor | Licencia |
|---|---|---|---|
| `gremio/mapa-y-ficha.jpg` | [DnD Game 01](https://commons.wikimedia.org/wiki/File:DnD_Game_01.jpg) | Nicole Hill | CC BY-SA 4.0 |
| `gremio/mapa-dibujado.jpg` | [DnD Game 04](https://commons.wikimedia.org/wiki/File:DnD_Game_04.jpg) | Nicole Hill | CC BY-SA 4.0 |
| `gremio/ropecon.jpg` | [Fantasy tabletop role playing game at RopeCon 2019](https://commons.wikimedia.org/wiki/File:Fantasy_tabletop_role_playing_game_at_RopeCon_2019.jpg) | JIP | CC BY-SA 4.0 |

## Redes sociales

Los enlaces de Instagram, Facebook y Discord se configuran en un solo lugar: el objeto `REDES` al inicio de `script.js`. Se aplican en el pie de página y en la página del gremio.

## Recursos

- **Descargables:** los PDF editables están en `assets/recursos/`. Se generan con `python3 scripts/generar_pdfs.py` (requiere `reportlab`). Para cambiar la lista, edita `DESCARGAS` en `recursos.js`.
- **Libros de D&D:** edita `LIBROS` en `recursos.js`. Solo enlazamos a dónde conseguirlos; no subimos copias en PDF de libros con derechos de autor.
- **Herramientas del gremio:** agrega o quita sitios en `scripts/herramientas.json` y corre:

  ```
  node scripts/previews.mjs
  ```

  El script entra a cada sitio, toma su título, descripción, imagen de vista previa e ícono, y genera `herramientas-data.js`. Si un sitio bloquea la consulta, la tarjeta se muestra solo con la nota del gremio.
