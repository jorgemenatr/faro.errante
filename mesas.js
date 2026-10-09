// Mesas de la semana.
// Para agregar una mesa, copia un bloque y cambia los datos.
// `imagen` es opcional: si no hay imagen o no carga, la tarjeta se muestra sin foto.
const MESAS = [
  {
    fecha: '2026-10-09',
    hora: '19:00',
    titulo: 'El puente de los ahorcados',
    campana: 'Valdoren',
    descripcion: 'La Marca Carmesí cerró el puente norte y nadie sabe por qué. El grupo tendrá que cruzarlo antes del toque de queda, cueste lo que cueste.',
    dm: 'Andrea Salinas',
    ubicacion: 'Casa del Gremio · Mesa 1',
    nivel: 'T1',
    imagen: 'assets/img/mesas/puente.jpg',
  },
  {
    fecha: '2026-10-10',
    hora: '11:00',
    titulo: 'El faro sin guardián',
    campana: 'One-shot',
    descripcion: 'Una sesión ideal para quien juega por primera vez. El faro de la bahía lleva tres noches apagado y los barcos ya no regresan.',
    dm: 'Luis Ortega',
    ubicacion: 'Casa del Gremio · Mesa 2',
    nivel: 'T1',
  },
  {
    fecha: '2026-10-10',
    hora: '17:00',
    titulo: 'La grieta despierta',
    campana: 'Neverwinter',
    descripcion: 'Algo respira desde el fondo del abismo del distrito viejo. El consejo de la ciudad pide voluntarios para bajar a averiguar qué es.',
    dm: 'Mariana Pérez',
    ubicacion: 'Casa del Gremio · Mesa 1',
    nivel: 'T2',
    imagen: 'assets/img/mesas/grieta.jpg',
  },
  {
    fecha: '2026-10-11',
    hora: '16:00',
    titulo: 'Río arriba por el Soshenstar',
    campana: 'Expediciones de Chult',
    descripcion: 'La expedición remonta el río en canoa hacia las ruinas de Mbala. Hay rumores de un tiranosaurio que vigila la orilla oeste.',
    dm: 'Daniel Ruiz',
    ubicacion: 'Ludoteca del centro · Sala grande',
    nivel: 'T1',
    imagen: 'assets/img/mesas/rio.jpg',
  },
  {
    fecha: '2026-10-13',
    hora: '20:00',
    titulo: 'La biblioteca que respira',
    campana: 'One-shot',
    descripcion: 'Una biblioteca arcana reaparece cada cien años durante una sola noche. Esta vez el grupo está dentro cuando sus puertas se cierran.',
    dm: 'Sofía Treviño',
    ubicacion: 'En línea · Discord del gremio',
    nivel: 'T3',
  },
  {
    fecha: '2026-10-15',
    hora: '19:30',
    titulo: 'Contrabandistas de niebla',
    campana: 'Valdoren',
    descripcion: 'Un cargamento sin sello llega al puerto en plena niebla. Hay que descubrir quién lo espera antes de que la guardia lo encuentre.',
    dm: 'Andrea Salinas',
    ubicacion: 'Casa del Gremio · Mesa 1',
    nivel: 'T2',
    imagen: 'assets/img/mesas/niebla.jpg',
  },
];

const VERSION = 'D&D 5.5e';
const NIVELES = { T1: 'Niv. 1–4', T2: 'Niv. 5–10', T3: 'Niv. 11–16' };

const lista = document.querySelector('[data-mesas]');
const vacio = document.querySelector('[data-empty]');

function aFecha(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const fmtDia = new Intl.DateTimeFormat('es-MX', { weekday: 'short' });
const fmtMes = new Intl.DateTimeFormat('es-MX', { month: 'short' });
const fmtLargo = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
const limpiar = (s) => s.replace('.', '');

function el(tag, clase, texto) {
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

function dato(id, etiqueta, valor) {
  const fila = el('div', 'mesa-dato');
  fila.append(icono(id));
  const dt = el('dt', null, etiqueta);
  const dd = el('dd', null, valor);
  fila.append(dt, dd);
  return fila;
}

function tarjeta(m) {
  const fecha = aFecha(m.fecha);
  const card = el('article', 'mesa');
  card.dataset.tier = m.nivel;

  // Talón con día y hora
  const talon = el('div', 'mesa-talon');
  const time = el('time');
  time.dateTime = `${m.fecha}T${m.hora}`;
  time.setAttribute('aria-label', `${fmtLargo.format(fecha)}, ${m.hora}`);
  time.append(
    el('span', 'talon-dia', limpiar(fmtDia.format(fecha))),
    el('span', 'talon-num', String(fecha.getDate())),
    el('span', 'talon-mes', limpiar(fmtMes.format(fecha))),
    el('span', 'talon-hora', m.hora),
  );
  talon.append(time);

  // Contenido
  const cuerpo = el('div', 'mesa-cuerpo');
  const etiquetas = el('div', 'mesa-etiquetas');
  etiquetas.append(
    el('span', `tier tier-${m.nivel.toLowerCase()}`, `${m.nivel} · ${NIVELES[m.nivel]}`),
    el('span', 'etiqueta', VERSION),
  );
  if (m.campana) etiquetas.append(el('span', 'etiqueta etiqueta-campana', m.campana));

  const datos = el('dl', 'mesa-datos');
  datos.append(
    dato('i-mask', 'Dungeon Master', m.dm),
    dato('i-pin', 'Ubicación', m.ubicacion),
  );

  cuerpo.append(etiquetas, el('h2', 'mesa-titulo', m.titulo), el('p', 'mesa-desc', m.descripcion), datos);
  card.append(talon, cuerpo);

  // Imagen opcional: si falla, la tarjeta queda en su versión sin foto
  if (m.imagen) {
    const fig = el('figure', 'mesa-media');
    const img = new Image();
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      fig.remove();
      card.classList.remove('con-foto');
    });
    img.src = m.imagen;
    fig.append(img);
    card.classList.add('con-foto');
    card.append(fig);
  }

  return card;
}

const ordenadas = [...MESAS].sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`));
ordenadas.forEach((m) => lista.append(tarjeta(m)));

// Rango de la semana
if (ordenadas.length) {
  const ini = aFecha(ordenadas[0].fecha);
  const fin = aFecha(ordenadas[ordenadas.length - 1].fecha);
  const mismoMes = ini.getMonth() === fin.getMonth();
  const rango = mismoMes
    ? `Del ${ini.getDate()} al ${fin.getDate()} de ${new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(fin)}`
    : `Del ${new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(ini)} al ${new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' }).format(fin)}`;
  const n = ordenadas.length;
  document.querySelector('[data-week-label]').textContent = `${rango} · ${n} ${n === 1 ? 'mesa' : 'mesas'}`;
}

// Filtros por nivel
const botones = document.querySelectorAll('[data-filters] .filter');
const contar = (t) => (t === 'todas' ? MESAS.length : MESAS.filter((m) => m.nivel === t).length);
document.querySelectorAll('[data-count]').forEach((s) => { s.textContent = contar(s.dataset.count); });

botones.forEach((b) => {
  b.addEventListener('click', () => {
    const tier = b.dataset.tier;
    botones.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    let visibles = 0;
    lista.querySelectorAll('.mesa').forEach((c) => {
      const ver = tier === 'todas' || c.dataset.tier === tier;
      c.hidden = !ver;
      if (ver) visibles += 1;
    });
    vacio.hidden = visibles > 0;
  });
});
