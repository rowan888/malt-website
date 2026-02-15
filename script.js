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
    '.section-label, .section-heading, .about-text, .about-image, .gallery-item, .info-block, .socials, .find-map'
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

  // --- Load events from data file ---
  const eventsGrid = document.getElementById('events-grid');

  fetch('/data/events.json')
    .then(res => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(events => {
      eventsGrid.innerHTML = events.map(event => `
        <article class="event-card fade-in">
          <div class="event-date">
            <span class="event-day">${event.day}</span>
            <span class="event-month">${event.month}</span>
          </div>
          <div class="event-info">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <span class="event-time">${event.time}</span>
          </div>
        </article>
      `).join('');

      eventsGrid.querySelectorAll('.event-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
      });
    })
    .catch(() => {
      // Keep the static HTML fallback — just observe existing cards
      eventsGrid.querySelectorAll('.event-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
      });
    });

  // --- Load gallery from data file ---
  const galleryGrid = document.getElementById('gallery-grid');

  fetch('/data/gallery.json')
    .then(res => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(images => {
      galleryGrid.innerHTML = images.map((item, i) => `
        <div class="gallery-item${item.featured ? ' gallery-item--large' : ''} fade-in">
          <img src="${item.image}" alt="${item.alt}" />
        </div>
      `).join('');

      galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
        observer.observe(item);
      });
    })
    .catch(() => {
      // Keep the static HTML fallback — just observe existing items
      galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
        item.classList.add('fade-in');
        observer.observe(item);
      });
    });

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
