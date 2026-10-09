// Fotos de sesiones jugadas. Agrega las más recientes al inicio.
// `credito` es el autor y la licencia de la foto, cuando la licencia lo pide.
const SESIONES = [
  {
    imagen: 'assets/img/gremio/mapa-y-ficha.jpg',
    titulo: 'El mapa de los túneles',
    fecha: '2026-10-03',
    dm: 'Andrea Salinas',
    credito: 'Foto: Nicole Hill · CC BY-SA 4.0',
  },
  {
    imagen: 'assets/img/mesas/grieta.jpg',
    titulo: 'Primer descenso a la grieta',
    fecha: '2026-09-27',
    dm: 'Mariana Pérez',
    credito: 'Foto: Philip Mitchell · CC BY-SA 3.0',
  },
  {
    imagen: 'assets/img/mesas/niebla.jpg',
    titulo: 'Noche de one-shots',
    fecha: '2026-09-26',
    dm: 'Luis Ortega',
    credito: 'Foto: Diacritica · CC BY-SA 3.0',
  },
  {
    imagen: 'assets/img/mesas/rio.jpg',
    titulo: 'Emboscada en la orilla',
    fecha: '2026-09-20',
    dm: 'Daniel Ruiz',
    credito: 'Foto: RightCowLeftCoast · CC BY-SA 4.0',
  },
  {
    imagen: 'assets/img/gremio/mapa-dibujado.jpg',
    titulo: 'La cripta dibujada a mano',
    fecha: '2026-09-13',
    dm: 'Sofía Treviño',
    credito: 'Foto: Nicole Hill · CC BY-SA 4.0',
  },
  {
    imagen: 'assets/img/gremio/ropecon.jpg',
    titulo: 'Mesa abierta en la convención',
    fecha: '2026-09-06',
    dm: 'Daniel Ruiz',
    credito: 'Foto: JIP · CC BY-SA 4.0',
  },
  {
    imagen: 'assets/img/mesas/faro.jpg',
    titulo: 'Sesión de bienvenida',
    fecha: '2026-08-30',
    dm: 'Luis Ortega',
    credito: 'Foto: Jorge Leal · CC BY 2.0',
  },
];

// Dungeon Masters del gremio.
const DMS = [
  { nombre: 'Andrea Salinas', juega: 'Valdoren', niveles: 'T1 · T2', estilo: 'Intriga política y ciudades con secretos.' },
  { nombre: 'Mariana Pérez', juega: 'Neverwinter', niveles: 'T2', estilo: 'Horror lento y exploración de ruinas.' },
  { nombre: 'Daniel Ruiz', juega: 'Expediciones de Chult', niveles: 'T1', estilo: 'Viajes largos, selva y supervivencia.' },
  { nombre: 'Luis Ortega', juega: 'One-shots', niveles: 'T1', estilo: 'Mesas para quien juega por primera vez.' },
  { nombre: 'Sofía Treviño', juega: 'One-shots', niveles: 'T3', estilo: 'Acertijos, magia rara y finales abiertos.' },
];

const fmtFecha = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
function aFecha(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function crear(tag, clase, texto) {
  const n = document.createElement(tag);
  if (clase) n.className = clase;
  if (texto != null) n.textContent = texto;
  return n;
}

// Galería
const galeria = document.querySelector('[data-galeria]');
SESIONES.forEach((s, i) => {
  const li = crear('li', 'galeria-item');
  const btn = crear('button', 'galeria-btn');
  btn.type = 'button';
  btn.setAttribute('aria-label', `Ver foto: ${s.titulo}`);
  const img = new Image();
  img.src = s.imagen;
  img.alt = '';
  img.loading = i < 3 ? 'eager' : 'lazy';
  img.decoding = 'async';
  const pie = crear('span', 'galeria-pie');
  pie.append(crear('span', 'galeria-titulo', s.titulo), crear('span', 'galeria-fecha', fmtFecha.format(aFecha(s.fecha))));
  btn.append(img, pie);
  btn.addEventListener('click', () => abrirVisor(i));
  li.append(btn);
  galeria.append(li);
});

// Visor de fotos
const visor = document.querySelector('[data-visor]');
const visorImg = document.querySelector('[data-visor-img]');
const visorPie = document.querySelector('[data-visor-caption]');
let actual = 0;

function mostrar(i) {
  actual = (i + SESIONES.length) % SESIONES.length;
  const s = SESIONES[actual];
  visorImg.src = s.imagen;
  visorImg.alt = s.titulo;
  visorPie.replaceChildren(
    crear('strong', null, s.titulo),
    crear('span', null, `${fmtFecha.format(aFecha(s.fecha))} · DM: ${s.dm}`),
  );
  if (s.credito) visorPie.append(crear('span', 'visor-credito', s.credito));
}
function abrirVisor(i) {
  mostrar(i);
  if (typeof visor.showModal === 'function') visor.showModal();
}
document.querySelector('[data-visor-cerrar]').addEventListener('click', () => visor.close());
document.querySelector('[data-visor-prev]').addEventListener('click', () => mostrar(actual - 1));
document.querySelector('[data-visor-next]').addEventListener('click', () => mostrar(actual + 1));
visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); });
visor.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') mostrar(actual - 1);
  if (e.key === 'ArrowRight') mostrar(actual + 1);
});

// Dungeon Masters
const listaDms = document.querySelector('[data-dms]');
DMS.forEach((d) => {
  const li = crear('li', 'dm');
  const iniciales = d.nombre.split(' ').map((p) => p[0]).slice(0, 2).join('');
  const sello = crear('span', 'dm-sello', iniciales);
  sello.setAttribute('aria-hidden', 'true');
  const cuerpo = crear('div', 'dm-cuerpo');
  cuerpo.append(
    crear('h3', 'dm-nombre', d.nombre),
    crear('p', 'dm-juega', `${d.juega} · ${d.niveles}`),
    crear('p', 'dm-estilo', d.estilo),
  );
  li.append(sello, cuerpo);
  listaDms.append(li);
});
