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

document.querySelector('[data-year]').textContent = new Date().getFullYear();
