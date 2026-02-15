// ========================================
// MALT. — Scripts
// ========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Navbar scroll effect + dynamic logo reveal ---
  const nav = document.querySelector('.nav');
  const navLogo = document.querySelector('.nav-logo');
  const heroLogo = document.querySelector('.hero-logo');

  // Watch the hero logo — when it leaves view, reveal nav logo
  const heroLogoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLogo.classList.remove('visible');
      } else {
        navLogo.classList.add('visible');
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px 0px 0px 0px'
  });

  heroLogoObserver.observe(heroLogo);

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // --- Mobile menu toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Fade-in on scroll ---
  const fadeTargets = document.querySelectorAll(
    '.section-label, .section-heading, .about-text, .about-image, .event-card, .gallery-item, .info-block, .socials, .find-map'
  );

  fadeTargets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeTargets.forEach(el => observer.observe(el));

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
