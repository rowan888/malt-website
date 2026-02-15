const fs = require('fs');
const path = require('path');

// ========================================
// MALT. — Build Script
// Reads _data files, injects into index.html → _site/
// ========================================

const ROOT = __dirname;
const OUT = path.join(ROOT, '_site');

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, filePath), 'utf8'));
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// --- Read data ---
const hero = readJSON('_data/hero.json');
const about = readJSON('_data/about.json');
const contact = readJSON('_data/contact.json');
const gallery = readJSON('_data/gallery.json');

// Read all event files from folder
const eventsDir = path.join(ROOT, '_data', 'events');
const events = fs.readdirSync(eventsDir)
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(eventsDir, f), 'utf8')))
  .sort((a, b) => (a.order || 0) - (b.order || 0));

// --- Generate HTML fragments ---
const eventsHTML = events.map(e => `
        <article class="event-card">
          <div class="event-date">
            <span class="event-day">${escapeHTML(e.day)}</span>
            <span class="event-month">${escapeHTML(e.month)}</span>
          </div>
          <div class="event-info">
            <h3>${escapeHTML(e.title)}</h3>
            <p>${escapeHTML(e.description)}</p>
            <span class="event-time">${escapeHTML(e.time)}</span>
          </div>
        </article>`).join('\n');

const galleryHTML = gallery.images.map(img => `
        <div class="gallery-item${img.featured ? ' gallery-item--large' : ''}">
          <img src="${img.image}" alt="${escapeHTML(img.alt)}" />
        </div>`).join('\n');

// --- Read template and inject ---
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Hero – tagline
html = html.replace(
  /(<p class="hero-tagline[^"]*">)([\s\S]*?)(<\/p>)/,
  `$1${hero.tagline}$3`
);
// Hero – subtitle
html = html.replace(
  /(<p class="hero-sub[^"]*">)([\s\S]*?)(<\/p>)/,
  `$1${escapeHTML(hero.subtitle)}$3`
);

// About – text block (heading + paragraphs)
html = html.replace(
  /(<div class="about-text[^"]*">)([\s\S]*?)(<\/div>\s*<div class="about-image">)/,
  `$1\n          <h2 class="section-heading">${about.heading}</h2>\n          <p>${escapeHTML(about.paragraph1)}</p>\n          <p>${escapeHTML(about.paragraph2)}</p>\n        $3`
);
// About – image
html = html.replace(
  /(<div class="about-image">\s*<img\s+src=")[^"]*(")/, 
  `$1${about.image}$2`
);

// Events – replace entire events-grid contents
html = html.replace(
  /(<div class="events-grid">)([\s\S]*?)(\s*<\/div>\s*<\/div>\s*<\/section>\s*<!-- Gallery -->)/,
  `$1\n${eventsHTML}\n      $3`
);

// Gallery – replace entire gallery-grid contents
html = html.replace(
  /(<div class="gallery-grid"[^>]*>)([\s\S]*?)(\s*<\/div>\s*<\/div>\s*<\/section>\s*<!-- Find Us -->)/,
  `$1\n${galleryHTML}\n      $3`
);

// Find Us – heading
html = html.replace(
  /(<div class="find-info">\s*<h2 class="section-heading[^"]*">)([\s\S]*?)(<\/h2>)/,
  `$1${contact.heading}$3`
);
// Find Us – address
html = html.replace(
  /(<h4>Address<\/h4>\s*<p>)([\s\S]*?)(<\/p>)/,
  `$1${escapeHTML(contact.address1)}<br />${escapeHTML(contact.address2)}$3`
);
// Find Us – hours
html = html.replace(
  /(<h4>Hours<\/h4>\s*<p>)([\s\S]*?)(<\/p>)/,
  `$1${escapeHTML(contact.hours1)}<br />${escapeHTML(contact.hours2)}$3`
);
// Find Us – contact email
html = html.replace(
  /(<h4>Contact<\/h4>\s*<p>)([\s\S]*?)(<\/p>)/,
  `$1${escapeHTML(contact.email)}$3`
);
// Find Us – Instagram URL
if (contact.instagram_url) {
  html = html.replace(
    /(<a href=")#(" aria-label="Instagram">)/,
    `$1${contact.instagram_url}$2`
  );
}

// --- Write output ---
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);

// Copy static files
['style.css', 'script.js'].forEach(file => {
  if (fs.existsSync(path.join(ROOT, file))) {
    fs.copyFileSync(path.join(ROOT, file), path.join(OUT, file));
  }
});

// Copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

copyDir(path.join(ROOT, 'images'), path.join(OUT, 'images'));
copyDir(path.join(ROOT, 'admin'), path.join(OUT, 'admin'));

console.log('✅ Build complete → _site/');
