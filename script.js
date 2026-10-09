// Redes sociales del gremio. Cambia aquí los enlaces y se actualizan en todo el sitio.
const REDES = {
  instagram: '',
  facebook: '',
  discord: '',
};

document.querySelectorAll('[data-social]').forEach((a) => {
  const url = REDES[a.dataset.social];
  if (url) {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  }
});

// Menú en pantallas chicas
const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

function setNav(open) {
  document.body.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
}

toggle.addEventListener('click', () => {
  setNav(!document.body.classList.contains('nav-open'));
});

nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) setNav(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setNav(false);
});

document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) setNav(false);
});

// Aparición suave de tarjetas y bloques al hacer scroll
const revealables = document.querySelectorAll('.card, .steps-panel, .wm-intro, .wm-point, .section-head');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  revealables.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
    io.observe(el);
  });
}

// Puntitos del carrusel de West Marches (solo se ven en el cel)
const wmPoints = document.querySelector('[data-wm-points]');
const wmDots = document.querySelectorAll('[data-wm-dots] span');
if (wmPoints && wmDots.length) {
  wmPoints.addEventListener('scroll', () => {
    const items = wmPoints.children;
    const max = wmPoints.scrollWidth - wmPoints.clientWidth;
    const i = max > 0 ? Math.round((wmPoints.scrollLeft / max) * (items.length - 1)) : 0;
    wmDots.forEach((d, n) => d.classList.toggle('is-active', n === i));
  }, { passive: true });
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();
