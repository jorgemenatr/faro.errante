// Consulta cada sitio de scripts/herramientas.json y guarda su vista previa
// (título, descripción e imagen) para la sección de herramientas.
//
// Uso: node scripts/previews.mjs
// Genera herramientas-data.js y descarga las imágenes en assets/img/herramientas/

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const carpetaImg = join(raiz, 'assets/img/herramientas');
const UA = 'Mozilla/5.0 (compatible; FaroErranteBot/1.0; vista previa de enlaces)';

const herramientas = JSON.parse(await readFile(join(raiz, 'scripts/herramientas.json'), 'utf8'));
await mkdir(carpetaImg, { recursive: true });

function decodificar(s = '') {
  return s
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, ' ').trim();
}

function meta(html, nombres) {
  for (const nombre of nombres) {
    const re = new RegExp(`<meta[^>]+(?:property|name)=["']${nombre}["'][^>]*>`, 'i');
    const tag = html.match(re)?.[0];
    const contenido = tag?.match(/content=["']([^"']*)["']/i)?.[1];
    if (contenido) return decodificar(contenido);
  }
  return '';
}

async function obtener(url, opciones = {}) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: opciones.accept ?? '*/*' }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res;
}

const resultado = [];
for (const h of herramientas) {
  const dominio = new URL(h.url).hostname.replace(/^www\./, '');
  const slug = dominio.replace(/[^a-z0-9]+/gi, '-');
  const item = { nombre: h.nombre ?? '', url: h.url, dominio, categoria: h.categoria, nota: h.nota, titulo: '', descripcion: '', imagen: '', icono: '' };
  try {
    const res = await obtener(h.url, { accept: 'text/html' });
    const html = await res.text();
    item.titulo = meta(html, ['og:title', 'twitter:title']) || decodificar(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]);
    item.descripcion = meta(html, ['og:description', 'twitter:description', 'description']);
    const img = meta(html, ['og:image', 'og:image:url', 'twitter:image', 'twitter:image:src']);
    if (img) {
      const urlImg = new URL(img, res.url).href;
      const resImg = await obtener(urlImg, { accept: 'image/*' });
      const tipo = resImg.headers.get('content-type') ?? '';
      const ext = tipo.includes('png') ? 'png' : tipo.includes('webp') ? 'webp' : tipo.includes('gif') ? 'gif' : 'jpg';
      const archivo = `${slug}.${ext}`;
      await writeFile(join(carpetaImg, archivo), Buffer.from(await resImg.arrayBuffer()));
      item.imagen = `assets/img/herramientas/${archivo}`;
    }
    // Ícono del sitio: apple-touch-icon si existe, si no el favicon
    const iconos = [...html.matchAll(/<link[^>]+rel=["']([^"']*icon[^"']*)["'][^>]*>/gi)];
    const preferido = iconos.find((m) => /apple-touch-icon/i.test(m[1])) ?? iconos.find((m) => /\bicon\b/i.test(m[1]));
    const hrefIcono = preferido?.[0].match(/href=["']([^"']+)["']/i)?.[1] ?? '/favicon.ico';
    try {
      const resIco = await obtener(new URL(hrefIcono, res.url).href, { accept: 'image/*' });
      const tipoIco = resIco.headers.get('content-type') ?? '';
      if (tipoIco.startsWith('image/')) {
        const extIco = tipoIco.includes('png') ? 'png' : tipoIco.includes('svg') ? 'svg' : tipoIco.includes('jpeg') ? 'jpg' : 'ico';
        const archivoIco = `${slug}-icono.${extIco}`;
        await writeFile(join(carpetaImg, archivoIco), Buffer.from(await resIco.arrayBuffer()));
        item.icono = `assets/img/herramientas/${archivoIco}`;
      }
    } catch {
      // Sin ícono: la tarjeta muestra la inicial del sitio
    }
    console.log(`✓ ${dominio}${item.imagen ? '' : ' (sin imagen)'}`);
  } catch (e) {
    console.warn(`✗ ${dominio}: ${e.message}. Se usará solo la nota.`);
  }
  item.nombre ||= item.titulo || dominio;
  resultado.push(item);
}

const js = `// Archivo generado por scripts/previews.mjs. No lo edites a mano:\n// cambia scripts/herramientas.json y vuelve a correr el script.\nwindow.HERRAMIENTAS = ${JSON.stringify(resultado, null, 2)};\n`;
await writeFile(join(raiz, 'herramientas-data.js'), js);
console.log(`\nListo: ${resultado.length} herramientas en herramientas-data.js`);
