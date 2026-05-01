/* =====================================================
   HARI HARA SOLAR — script.js
   ===================================================== */

/* ── Navbar scroll ───────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });

/* ── Mobile drawer (slides from right) ───────────── */
function openDrawer() {
  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerBd').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerBd').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── Hero slideshow ──────────────────────────────── */
(function initSlideshow() {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function start() { timer = setInterval(() => goTo(current + 1), 4500); }
  function stop()  { clearInterval(timer); }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stop(); goTo(i); start(); });
  });

  start();
})();

/* ── WhatsApp hero form ──────────────────────────── */
document.getElementById('heroForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name  = this.elements['name'].value.trim();
  const phone = this.elements['phone'].value.trim();
  const area  = this.elements['area'].value.trim();
  const type  = this.elements['type'].value;

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  let msg = `Hi Hari Hara Solar! 👋\n\nI'm interested in a solar installation quote.\n\n`;
  msg += `🔹 Name: ${name}\n`;
  msg += `🔹 Phone: ${phone}\n`;
  if (area) msg += `🔹 Area: ${area}\n`;
  if (type) msg += `🔹 Type: ${type}\n`;
  msg += `\nKindly share the details and pricing. Thank you!`;

  window.open(`https://wa.me/919000239813?text=${encodeURIComponent(msg)}`, '_blank');

  const btn = this.querySelector('.form-submit');
  const orig = btn.innerHTML;
  btn.textContent = '✓ Opening WhatsApp…';
  btn.disabled = true;
  setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; this.reset(); }, 3500);
});

/* ── Image lightbox ──────────────────────────────── */
const modal       = document.getElementById('imgModal');
const modalImg    = document.getElementById('modalImg');
const modalCaption= document.getElementById('modalCaption');

function openModal(src, caption) {
  modalImg.src = src;
  modalImg.alt = caption || '';
  modalCaption.textContent = caption || '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modalImg.src = ''; }, 300);
}

/* Wire up project image clicks */
document.querySelectorAll('.proj-item').forEach(item => {
  const img     = item.querySelector('img');
  const name    = item.querySelector('.proj-name')?.textContent || '';
  const loc     = item.querySelector('.proj-loc')?.textContent || '';
  item.style.cursor = 'zoom-in';
  item.addEventListener('click', () => openModal(img.src, [name, loc].filter(Boolean).join(' · ')));
});

/* Wire up service image clicks */
document.querySelectorAll('.srv-card').forEach(card => {
  const img = card.querySelector('.srv-visual img');
  const title = card.querySelector('.srv-body h3')?.textContent || '';
  const badge = card.querySelector('.srv-badge')?.textContent || '';
  if (!img) return;

  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => openModal(img.src, [badge, title].filter(Boolean).join(' · ')));
});

/* Keyboard: Escape closes any open overlay */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeModal();
  closeDrawer();
});

/* ── Scroll-reveal ───────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('on');
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r')
  .forEach(el => revealObs.observe(el));

/* ── Stagger animations ──────────────────────────── */
function staggerObserve(containerSel, itemSel, delay = 110) {
  const container = document.querySelector(containerSel);
  if (!container) return;
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll(itemSel)
        .forEach((el, i) => setTimeout(() => el.classList.add('on'), i * delay));
    });
  }, { threshold: 0.1 }).observe(container);
}

staggerObserve('#whyGrid',      '.why-item',  100);
staggerObserve('#servicesGrid', '.srv-card',  110);
staggerObserve('#projGrid',     '.proj-item', 130);

/* ── Stat counter animation ──────────────────────── */
function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  const t0  = performance.now();
  const dur = 1800;
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

const statsRow = document.querySelector('.stats-row');
if (statsRow) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
    });
  }, { threshold: 0.35 }).observe(statsRow);
}

/* ── Smooth scroll ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    closeDrawer();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
