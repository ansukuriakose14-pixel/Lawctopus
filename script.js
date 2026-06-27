// ── Sticky header
window.addEventListener('scroll', () => {
  document.getElementById('main-header').classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ── Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMenu(open) {
  navToggle.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

navToggle.addEventListener('click', () => {
  toggleMenu(!mobileMenu.classList.contains('open'));
});

// Close menu when a link is clicked
document.querySelectorAll('.mobile-link, .mobile-menu .btn-nav').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleMenu(false);
});

// Close if clicking outside the menu
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) toggleMenu(false);
});

// ── Scroll reveal
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Counter animation
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimal = parseInt(el.dataset.decimal || 0);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const val = target * eased;
    el.textContent = (decimal ? val.toFixed(decimal) : Math.floor(val).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('.count-up').forEach(el => counterObs.observe(el));

// ── Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[style*="animation"]').forEach(el => el.style.animation = 'none');
}

// ── Tilt on cards (desktop only — skip on touch devices)
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

if (!isTouchDevice()) {
  document.querySelectorAll('.feature-card, .timeline-card, .faculty-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ── Pause testimonial marquee on hover / touch
const track = document.getElementById('testiTrack');
if (track) {
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  // Touch: tap to pause/resume
  let paused = false;
  track.addEventListener('touchstart', () => {
    paused = !paused;
    track.style.animationPlayState = paused ? 'paused' : 'running';
  }, { passive: true });
}

// ── Prevent horizontal scroll leak from float cards on small screens
window.addEventListener('resize', () => {
  if (window.innerWidth < 768) {
    document.querySelectorAll('.float-card-students').forEach(el => el.style.display = 'none');
  }
}, { passive: true });