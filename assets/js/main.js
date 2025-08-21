// ==============================
// Toggle menú móvil
// ==============================
const body = document.body;
const nav = document.querySelector('#navmenu');
const toggle = document.querySelector('.mobile-nav-toggle');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    body.classList.toggle('mobile-nav-active');
    // Cambia icono hamburguesa ↔ cerrar
    toggle.classList.toggle('bi-list');
    toggle.classList.toggle('bi-x');
  });
}

// Toggle submenús en móvil
document.querySelectorAll('.navmenu .dropdown > a').forEach(a => {
  a.addEventListener('click', (e) => {
    if (body.classList.contains('mobile-nav-active')) {
      e.preventDefault();
      const submenu = a.nextElementSibling; // el <ul> interno
      submenu.classList.toggle('dropdown-active');
    }
  });
});

// Cerrar al hacer click fuera (opcional)
document.addEventListener('click', (e) => {
  if (body.classList.contains('mobile-nav-active') &&
      !e.target.closest('#navmenu') &&
      !e.target.closest('.mobile-nav-toggle')) {
    body.classList.remove('mobile-nav-active');
    toggle.classList.add('bi-list');
    toggle.classList.remove('bi-x');
  }
});

// ==============================
// Subrayado animado en tabs/nav
// ==============================
const underline = document.createElement("span");
underline.classList.add("nav-underline");
document.querySelector(".nav-tabs")?.appendChild(underline);

function moveUnderline(el) {
  const rect = el.getBoundingClientRect();
  const parentRect = el.parentElement.getBoundingClientRect();
  underline.style.width = rect.width + "px";
  underline.style.left = (rect.left - parentRect.left) + "px";
}

// Inicializar con el activo al cargar
const activeTab = document.querySelector(".nav-tabs .nav-link.active");
if (activeTab) moveUnderline(activeTab);

// Cambiar cuando se haga click en un tab
document.querySelectorAll(".nav-tabs .nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // quitar clase active
    document.querySelectorAll(".nav-tabs .nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    moveUnderline(link);
  });
});

(() => {
  const viewport = document.querySelector('#features .tabs-viewport');
  const track = document.querySelector('#features #featTabs');
  const prev = document.querySelector('#features .tabs-arrow.prev');
  const next = document.querySelector('#features .tabs-arrow.next');
  if (!viewport || !track || !prev || !next) return;

  const updateArrows = () => {
    const max = track.scrollWidth - track.clientWidth;
    prev.style.opacity = track.scrollLeft <= 2 ? '.35' : '1';
    prev.style.pointerEvents = track.scrollLeft <= 2 ? 'none' : 'auto';
    next.style.opacity = track.scrollLeft >= max - 2 ? '.35' : '1';
    next.style.pointerEvents = track.scrollLeft >= max - 2 ? 'none' : 'auto';
  };
  const scrollAmount = () => Math.max(160, Math.round(viewport.clientWidth * 0.7));

  prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left:  scrollAmount(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);

  // Ignora el PRIMER "shown" (Bootstrap lo dispara al cargar)
  let skippedFirstShown = false;
  document.addEventListener('shown.bs.tab', (e) => {
    if (!skippedFirstShown) { skippedFirstShown = true; updateArrows(); return; }
    e.target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    updateArrows();
  });

  // Arranca mostrando el inicio, sin centrado
  track.scrollTo({ left: 0 });
  updateArrows();
})();
(function(){
    const root   = document.querySelector('[data-carousel]');
    const track  = root.querySelector('[data-track]');
    const prev   = root.querySelector('[data-prev]');
    const next   = root.querySelector('[data-next]');
    const dotsEl = document.querySelector('[data-dots]');
    const slides = Array.from(track.querySelectorAll('.slide'));

    const slideWidth = () =>
      track.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);

    // Dots
    slides.forEach((_, i)=>{
      const b=document.createElement('button'); b.type='button';
      b.setAttribute('aria-label','Ir al grupo '+(i+1));
      b.addEventListener('click',()=> track.scrollTo({left: i * slideWidth(), behavior:'smooth'}));
      dotsEl.appendChild(b);
    });

    const setActive = () => {
      const idx = Math.round(track.scrollLeft / slideWidth());
      dotsEl.querySelectorAll('button').forEach((d,i)=> d.setAttribute('aria-current', i===idx?'true':'false'));
    };
    setActive();

    next.addEventListener('click',()=> track.scrollBy({left: slideWidth(), behavior:'smooth'}));
    prev.addEventListener('click',()=> track.scrollBy({left: -slideWidth(), behavior:'smooth'}));

    let ticking=false;
    track.addEventListener('scroll',()=>{
      if(ticking) return; ticking=true;
      requestAnimationFrame(()=>{ setActive(); ticking=false; });
    });

    new ResizeObserver(()=> setActive()).observe(track);
  })();