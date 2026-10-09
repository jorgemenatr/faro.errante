// Formatos del gremio para descargar.
const DESCARGAS = [
  {
    titulo: 'Hoja de personaje editable',
    descripcion: 'Escribe directo en el PDF desde tu computadora o tablet: atributos, habilidades, combate, equipo y conjuros.',
    archivo: 'assets/recursos/hoja-de-personaje.pdf',
    miniatura: 'assets/img/recursos/hoja-de-personaje.jpg',
    detalles: ['PDF', '2 páginas', 'Campos editables'],
  },
  {
    titulo: 'Bitácora de aventura terminada',
    descripcion: 'El DM la llena al terminar cada sesión. Sirve para que los descubrimientos, rumores y botín lleguen a las demás mesas.',
    archivo: 'assets/recursos/bitacora-de-aventura.pdf',
    miniatura: 'assets/img/recursos/bitacora-de-aventura.jpg',
    detalles: ['PDF', '1 página', 'Campos editables'],
  },
];

// Libros de D&D. `siglas` y `color` dan forma a la portada tipográfica.
const LIBROS = [
  {
    siglas: 'PHB',
    titulo: "Player's Handbook",
    titulo_es: 'Manual del Jugador',
    anio: '2024',
    color: '#6e2f2a',
    idiomas: ['Español', 'Inglés'],
    descripcion: 'Todo para crear y jugar tu personaje: clases, especies, trasfondos, dotes y conjuros.',
    enlaces: [
      { etiqueta: 'D&D Beyond', url: 'https://www.dndbeyond.com/sources/dnd/phb-2024' },
      { etiqueta: 'Información en español', url: 'https://wpn.wizards.com/es/products/2024-players-handbook' },
    ],
  },
  {
    siglas: 'DMG',
    titulo: "Dungeon Master's Guide",
    titulo_es: 'Guía del Dungeon Master',
    anio: '2024',
    color: '#2c4566',
    idiomas: ['Español', 'Inglés'],
    descripcion: 'Cómo dirigir partidas, crear aventuras y mundos, y repartir tesoros y objetos mágicos.',
    enlaces: [
      { etiqueta: 'D&D Beyond', url: 'https://www.dndbeyond.com/sources/dnd/dmg-2024' },
      { etiqueta: 'Información en español', url: 'https://wpn.wizards.com/es/products/2024-dungeon-masters-guide' },
    ],
  },
  {
    siglas: 'MM',
    titulo: 'Monster Manual',
    titulo_es: 'Manual de Monstruos',
    anio: '2025',
    color: '#3b5537',
    idiomas: ['Español', 'Inglés'],
    descripcion: 'Más de 500 criaturas con sus estadísticas, listas para usar en cualquier encuentro.',
    enlaces: [
      { etiqueta: 'D&D Beyond', url: 'https://www.dndbeyond.com/sources/dnd/mm-2024' },
      { etiqueta: 'Información en español', url: 'https://wpn.wizards.com/es/products/2024-monster-manual' },
    ],
  },
  {
    siglas: 'Reglas',
    titulo: 'Free Rules',
    titulo_es: 'Reglas gratuitas',
    anio: '2024',
    color: '#5a4a2a',
    idiomas: ['Inglés'],
    gratis: true,
    descripcion: 'Las reglas básicas de la versión 2024 para leer en línea, sin costo. Ideal si vas empezando.',
    enlaces: [{ etiqueta: 'Leer en D&D Beyond', url: 'https://www.dndbeyond.com/sources/dnd/free-rules' }],
  },
  {
    siglas: 'SRD',
    titulo: 'System Reference Document 5.2',
    titulo_es: 'Documento de referencia',
    anio: '2025',
    color: '#3f4552',
    idiomas: ['Inglés'],
    gratis: true,
    descripcion: 'La parte de las reglas que Wizards publica con licencia libre (CC BY 4.0). Se puede descargar en PDF.',
    enlaces: [{ etiqueta: 'Descargar en D&D Beyond', url: 'https://www.dndbeyond.com/srd' }],
  },
];

function nodo(tag, clase, texto) {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto != null) n.textContent = texto;
  return n;
}
function icono(id) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'ico');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(ns, 'use');
  use.setAttribute('href', `#${id}`);
  svg.append(use);
  return svg;
}
function enlaceExterno(url, texto, clase) {
  const a = nodo('a', clase);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.append(texto);
  return a;
}

// Descargables
const listaDescargas = document.querySelector('[data-descargas]');
DESCARGAS.forEach((d) => {
  const li = nodo('li', 'descarga');
  const mini = nodo('div', 'descarga-mini');
  const img = new Image();
  img.src = d.miniatura;
  img.alt = `Vista previa de ${d.titulo}`;
  img.loading = 'lazy';
  mini.append(img);

  const cuerpo = nodo('div', 'descarga-cuerpo');
  const detalles = nodo('p', 'descarga-detalles');
  d.detalles.forEach((t) => detalles.append(nodo('span', null, t)));
  const btn = nodo('a', 'btn btn-primary');
  btn.href = d.archivo;
  btn.download = '';
  btn.append(icono('i-download'), 'Descargar');
  cuerpo.append(detalles, nodo('h3', 'descarga-titulo', d.titulo), nodo('p', 'descarga-desc', d.descripcion), btn);
  li.append(mini, cuerpo);
  listaDescargas.append(li);
});

// Libros
const listaLibros = document.querySelector('[data-libros]');
LIBROS.forEach((l) => {
  const li = nodo('li', 'libro');
  const portada = nodo('div', 'libro-portada');
  portada.style.setProperty('--libro', l.color);
  portada.append(nodo('span', 'libro-siglas', l.siglas), nodo('span', 'libro-anio', l.anio));
  if (l.gratis) portada.append(nodo('span', 'libro-gratis', 'Gratis'));

  const cuerpo = nodo('div', 'libro-cuerpo');
  const idiomas = nodo('p', 'libro-idiomas');
  l.idiomas.forEach((i) => idiomas.append(nodo('span', 'etiqueta', i)));
  const enlaces = nodo('div', 'libro-enlaces');
  l.enlaces.forEach((e) => {
    const a = enlaceExterno(e.url, e.etiqueta, 'libro-enlace');
    a.append(icono('i-external'));
    enlaces.append(a);
  });
  cuerpo.append(
    nodo('h3', 'libro-titulo', l.titulo_es),
    nodo('p', 'libro-original', `${l.titulo} (${l.anio})`),
    idiomas,
    nodo('p', 'libro-desc', l.descripcion),
    enlaces,
  );
  li.append(portada, cuerpo);
  listaLibros.append(li);
});

// Herramientas (datos generados por scripts/previews.mjs)
const HERR = window.HERRAMIENTAS ?? [];
const listaHerr = document.querySelector('[data-herramientas]');
const filtrosHerr = document.querySelector('[data-filtros-herr]');

HERR.forEach((h) => {
  const li = nodo('li', 'herr');
  li.dataset.categoria = h.categoria;

  const cabeza = nodo('div', 'herr-cabeza');
  const ico = nodo('span', 'herr-icono');
  if (h.icono) {
    const img = new Image();
    img.src = h.icono;
    img.alt = '';
    img.addEventListener('error', () => { img.remove(); ico.textContent = h.nombre[0]; });
    ico.append(img);
  } else {
    ico.textContent = h.nombre[0];
  }
  const nombre = nodo('div');
  nombre.append(nodo('h3', 'herr-nombre', h.nombre), nodo('p', 'herr-cat', h.categoria));
  cabeza.append(ico, nombre);

  // Vista previa del enlace, como cuando compartes un link en un chat
  const preview = enlaceExterno(h.url, '', 'herr-preview');
  preview.setAttribute('aria-label', `Abrir ${h.nombre} (${h.dominio})`);
  if (h.imagen) {
    const img = new Image();
    img.src = h.imagen;
    img.alt = '';
    img.loading = 'lazy';
    img.className = 'herr-og';
    img.addEventListener('error', () => img.remove());
    preview.append(img);
  }
  const texto = nodo('span', 'herr-preview-texto');
  if (h.titulo) texto.append(nodo('span', 'herr-preview-titulo', h.titulo));
  if (h.descripcion) texto.append(nodo('span', 'herr-preview-desc', h.descripcion));
  const dom = nodo('span', 'herr-dominio');
  dom.append(h.dominio, icono('i-external'));
  texto.append(dom);
  preview.append(texto);

  li.append(cabeza, nodo('p', 'herr-nota', h.nota), preview);
  listaHerr.append(li);
});

const categorias = ['Todas', ...new Set(HERR.map((h) => h.categoria))];
categorias.forEach((c, i) => {
  const b = nodo('button', 'filter', c);
  b.type = 'button';
  b.setAttribute('aria-pressed', String(i === 0));
  b.addEventListener('click', () => {
    filtrosHerr.querySelectorAll('.filter').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    listaHerr.querySelectorAll('.herr').forEach((el) => {
      el.hidden = c !== 'Todas' && el.dataset.categoria !== c;
    });
  });
  filtrosHerr.append(b);
});
