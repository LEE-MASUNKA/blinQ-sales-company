/* ============================================================
   BLINQ ESTATES MARKETPLACE — app.js
   Vanilla JS: nav, search, calculator, modal, carousel, counters
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initCursorGlow();
  initCommissionCalculator();
  initPropertyFilters();
  initFavorites();
  initPropertyModal();
  initTestimonialCarousel();
  initCounters();
  initScrollReveal();
  initBackToTop();
  initForms();
  initMortgageCalc();
  init3DTilt();
  initSmoothScroll();
  initSearchForm();
});

/* ---------- Navbar sticky + active section ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }, { passive: true });
}

/* ---------- Mobile drawer ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');

  const open = () => {
    drawer.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  drawer.querySelectorAll('.drawer-link, .drawer-cta').forEach(a => a.addEventListener('click', close));
}

/* ---------- Cursor glow ---------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* ---------- Commission Calculator (core business logic) ---------- */
function initCommissionCalculator() {
  const input = document.getElementById('calcPrice');
  const sellerEl = document.getElementById('sellerGets');
  const platformEl = document.getElementById('platformGets');
  if (!input) return;

  const format = n => 'KSh ' + Math.round(n).toLocaleString('en-KE');

  const update = () => {
    const price = Math.max(0, parseFloat(input.value) || 0);
    sellerEl.textContent = format(price * 0.8);
    platformEl.textContent = format(price * 0.2);
  };

  input.addEventListener('input', update);
  update();
}

/* ---------- Property filters ---------- */
function initPropertyFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.property-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const seller = card.dataset.seller;
        const type = card.dataset.type;
        const show = filter === 'all' ||
          (filter === 'blinq' && seller === 'blinq') ||
          (filter === 'marketplace' && seller === 'marketplace') ||
          type === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---------- Favorites ---------- */
function initFavorites() {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      icon.classList.toggle('far');
      icon.classList.toggle('fas');
      showToast(btn.classList.contains('active') ? 'Added to favorites' : 'Removed from favorites', 'info');
    });
  });
}

/* ---------- Property data + Modal ---------- */
const PROPERTY_DATA = {
  1: {
    title: 'Azure Heights Villa',
    location: 'Karen, Nairobi',
    price: 'KSh 45,000,000',
    beds: 5, baths: 6, sqft: '4,200',
    desc: 'Stunning contemporary villa with panoramic views, infinity pool, smart-home systems, and landscaped gardens. Perfect for luxury living in the heart of Karen.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Infinity Pool', 'Smart Home', 'Garden', 'Garage', 'Security', 'Generator'],
    amenities: ['Wi-Fi', 'Parking', 'Gym', 'CCTV', 'Backup Power', 'Staff Quarters']
  },
  2: {
    title: 'Skyline Residences',
    location: 'Westlands, Nairobi',
    price: 'KSh 18,500,000',
    beds: 3, baths: 3, sqft: '1,850',
    desc: 'Modern high-rise apartment with floor-to-ceiling windows, open-plan living, and premium finishes. Steps from Westlands business district.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Balcony', 'Open Plan', 'Lift', 'Concierge'],
    amenities: ['Parking', 'Gym', 'Pool', '24/7 Security']
  },
  3: {
    title: 'Mugumo Signature Estate',
    location: 'Mugumo Estate, Kiambu',
    price: 'KSh 72,000,000',
    beds: 6, baths: 7, sqft: '6,800',
    desc: 'Grand estate home with expansive grounds, private wing, home cinema, and panoramic countryside views. Full Blinq construction quality.',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Private Wing', 'Cinema', 'Wine Cellar', 'Staff Quarters', 'Borehole'],
    amenities: ['Generator', 'CCTV', 'Garden', 'Parking for 6']
  },
  4: {
    title: 'Kimbo Green Townhomes',
    location: 'Kimbo, Ruiru',
    price: 'KSh 28,000,000',
    beds: 4, baths: 4, sqft: '2,600',
    desc: 'Contemporary townhouse in a gated community with modern finishes, private garden, and excellent connectivity to Thika Road.',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Gated Community', 'Private Garden', 'Modern Kitchen'],
    amenities: ['Parking', 'Security', 'Play Area']
  },
  5: {
    title: 'The Observatory Penthouse',
    location: 'Upper Hill, Nairobi',
    price: 'KSh 32,000,000',
    beds: 4, baths: 4, sqft: '3,100',
    desc: 'Exclusive penthouse with 360° city views, private rooftop terrace, and designer interiors. The pinnacle of urban luxury.',
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Rooftop Terrace', 'City Views', 'Designer Kitchen', 'Smart Home'],
    amenities: ['Concierge', 'Gym', 'Parking', 'Lift']
  },
  6: {
    title: 'Nyali Oceanfront Villa',
    location: 'Nyali, Mombasa',
    price: 'KSh 55,000,000',
    beds: 5, baths: 5, sqft: '5,400',
    desc: 'Breathtaking oceanfront villa with direct beach access, infinity pool overlooking the Indian Ocean, and tropical landscaping.',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cd00?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Beach Access', 'Infinity Pool', 'Ocean View', 'Guest Cottage'],
    amenities: ['Generator', 'CCTV', 'Staff Quarters', 'Boat Mooring']
  }
};

let galleryIndex = 0;
let currentImages = [];

function initPropertyModal() {
  const modal = document.getElementById('propertyModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalClose');

  document.querySelectorAll('.view-details').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.id));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  document.getElementById('galleryPrev').addEventListener('click', () => shiftGallery(-1));
  document.getElementById('galleryNext').addEventListener('click', () => shiftGallery(1));

  document.getElementById('scheduleViewing').addEventListener('click', () => {
    showToast('Viewing request sent! We will contact you shortly.', 'success');
  });
}

function openModal(id) {
  const data = PROPERTY_DATA[id];
  if (!data) return;
  const modal = document.getElementById('propertyModal');

  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalLocation').innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + data.location;
  document.getElementById('modalPrice').textContent = data.price;
  document.getElementById('modalDesc').textContent = data.desc;
  document.getElementById('modalMeta').innerHTML =
    `<span><i class="fas fa-bed"></i> ${data.beds} Beds</span>
     <span><i class="fas fa-bath"></i> ${data.baths} Baths</span>
     <span><i class="fas fa-ruler-combined"></i> ${data.sqft} sqft</span>`;

  document.getElementById('modalFeatures').innerHTML = data.features.map(f =>
    `<span><i class="fas fa-check-circle"></i> ${f}</span>`).join('');
  document.getElementById('modalAmenities').innerHTML = data.amenities.map(a =>
    `<span><i class="fas fa-star"></i> ${a}</span>`).join('');

  currentImages = data.images;
  galleryIndex = 0;
  renderGallery();

  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('propertyModal');
  modal.classList.remove('open');
  setTimeout(() => { modal.hidden = true; document.body.style.overflow = ''; }, 350);
}

function renderGallery() {
  const main = document.getElementById('modalMainImg');
  const thumbs = document.getElementById('galleryThumbs');
  main.src = currentImages[galleryIndex];
  main.alt = 'Property image ' + (galleryIndex + 1);
  thumbs.innerHTML = currentImages.map((src, i) =>
    `<img src="${src}" alt="Thumb ${i+1}" class="${i === galleryIndex ? 'active' : ''}" data-idx="${i}" />`
  ).join('');
  thumbs.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => { galleryIndex = +img.dataset.idx; renderGallery(); });
  });
}

function shiftGallery(dir) {
  galleryIndex = (galleryIndex + dir + currentImages.length) % currentImages.length;
  renderGallery();
}

/* ---------- Testimonial carousel ---------- */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const slides = track.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('testDots');
  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('button');

  function goTo(i) {
    index = i;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
    resetTimer();
  }

  function next() { goTo((index + 1) % slides.length); }
  function prev() { goTo((index - 1 + slides.length) % slides.length); }

  document.getElementById('testNext').addEventListener('click', next);
  document.getElementById('testPrev').addEventListener('click', prev);

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }
  resetTimer();

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) diff > 0 ? prev() : next();
  }, { passive: true });
}

/* ---------- Animated counters ---------- */
function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = target * eased;
        el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stat-num, .live-num').forEach(el => observer.observe(el));
}

/* ---------- Scroll reveal ---------- */
function initScrollReveal() {
  const els = document.querySelectorAll('.property-card, .project-card, .feature-card, .live-stat, .sell-form-wrapper, .commission-panel');
  els.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Forms ---------- */
function initForms() {
  const listForm = document.getElementById('listPropertyForm');
  if (listForm) {
    listForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!listForm.checkValidity()) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      showToast('Listing submitted successfully! Our team will review it shortly.', 'success');
      listForm.reset();
    });
  }

  const contactForm = document.getElementById('contactSellerForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Message sent to seller!', 'success');
      contactForm.reset();
    });
  }

  const newsForm = document.getElementById('newsletterForm');
  if (newsForm) {
    newsForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Subscribed to Blinq updates!', 'success');
      newsForm.reset();
    });
  }
}

/* ---------- Mortgage calculator ---------- */
function initMortgageCalc() {
  const amount = document.getElementById('mortgageAmount');
  const rate = document.getElementById('mortgageRate');
  const years = document.getElementById('mortgageYears');
  const result = document.getElementById('mortgageResult');
  if (!amount) return;

  const calc = () => {
    const P = parseFloat(amount.value) || 0;
    const r = (parseFloat(rate.value) || 0) / 100 / 12;
    const n = (parseFloat(years.value) || 1) * 12;
    let monthly = 0;
    if (r === 0) monthly = P / n;
    else monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    result.textContent = 'KSh ' + Math.round(monthly).toLocaleString('en-KE');
  };

  [amount, rate, years].forEach(el => el.addEventListener('input', calc));
  calc();
}

/* ---------- 3D card tilt ---------- */
function init3DTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Smooth scroll for anchor links ---------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ---------- Search form ---------- */
function initSearchForm() {
  const form = document.getElementById('searchForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const location = document.getElementById('searchLocation').value;
    const type = document.getElementById('searchType').value;
    const beds = document.getElementById('searchBeds').value;
    const min = parseFloat(document.getElementById('searchMin').value) || 0;
    const max = parseFloat(document.getElementById('searchMax').value) || Infinity;

    document.querySelectorAll('.property-card').forEach(card => {
      const cLoc = card.dataset.location || '';
      const cType = card.dataset.type || '';
      const cBeds = parseInt(card.dataset.beds) || 0;
      const cPrice = parseFloat(card.dataset.price) || 0;
      const match =
        (!location || cLoc === location) &&
        (!type || cType === type) &&
        (!beds || cBeds >= parseInt(beds)) &&
        cPrice >= min && cPrice <= max;
      card.style.display = match ? '' : 'none';
    });

    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
    showToast('Search results updated', 'info');
  });
}

/* ---------- Toast notifications ---------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
