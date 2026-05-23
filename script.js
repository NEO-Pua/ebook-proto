/* =====================================================
   KAMADO — Interactive Prototype
   ===================================================== */

// ----- LOADER -----
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1200);
});

// ----- NAV SCROLL EFFECT -----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ----- MOBILE MENU -----
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn?.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});
closeMenu?.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
});
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ----- LANGUAGE SWITCHER -----
const translations = {
  EN: {
    eyebrow: 'Spring Edition · No. 04',
    sub: 'A 248-page tome with 36 short films · by Chef Yuki Tanaka',
    primary: 'Read the preview',
    ghost: 'Open the film',
  },
  JA: {
    eyebrow: '春の特集 · 第 04 号',
    sub: '田中由紀シェフによる248ページの本、36本のショート映像付き',
    primary: 'プレビューを読む',
    ghost: '映像を見る',
  },
  ZH: {
    eyebrow: '春季特辑 · 第 04 号',
    sub: '田中由纪主厨编著 · 248页精装 · 36支短片',
    primary: '阅读预览',
    ghost: '观看影片',
  }
};

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`.lang-btn[data-lang="${btn.dataset.lang}"]`).forEach(b => b.classList.add('active'));

    const lang = btn.dataset.lang;
    if (!lang || !translations[lang]) return;

    const t = translations[lang];
    const eyebrow = document.querySelector('.hero-eyebrow span:last-child');
    const sub = document.querySelector('.hero-sub');
    const primary = document.querySelector('.hero-cta .btn-primary span');
    const ghost = document.querySelector('.hero-cta .btn-ghost');

    if (eyebrow) eyebrow.textContent = t.eyebrow;
    if (sub) sub.textContent = t.sub;
    if (primary) primary.textContent = t.primary;
    if (ghost) ghost.textContent = t.ghost;
  });
});

// ----- HERO SLIDER -----
const heroImages = document.querySelectorAll('.hero-image');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

function setSlide(i) {
  heroImages.forEach(img => img.classList.remove('hero-image-active'));
  dots.forEach(d => d.classList.remove('active'));
  if (heroImages[i]) heroImages[i].classList.add('hero-image-active');
  if (dots[i]) dots[i].classList.add('active');
  currentSlide = i;
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => setSlide(i));
});

setInterval(() => {
  setSlide((currentSlide + 1) % heroImages.length);
}, 6000);

// ----- BOOK RAIL SCROLL -----
const rail = document.getElementById('bookRail');
const railPrev = document.getElementById('railPrev');
const railNext = document.getElementById('railNext');
const railProgress = document.getElementById('railProgress');

function updateRailProgress() {
  if (!rail || !railProgress) return;
  const scrollMax = rail.scrollWidth - rail.clientWidth;
  const pct = scrollMax > 0 ? (rail.scrollLeft / scrollMax) * 100 : 0;
  railProgress.style.width = Math.max(10, pct) + '%';
}

rail?.addEventListener('scroll', updateRailProgress, { passive: true });

railPrev?.addEventListener('click', () => {
  rail.scrollBy({ left: -360, behavior: 'smooth' });
});
railNext?.addEventListener('click', () => {
  rail.scrollBy({ left: 360, behavior: 'smooth' });
});

updateRailProgress();

// ----- CART -----
const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartCount = document.getElementById('cartCount');
let cartItems = 2;

cartBtn?.addEventListener('click', () => {
  cartDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeCart() {
  cartDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

function addToCart(btn) {
  cartItems += 1;
  cartCount.textContent = cartItems;

  // Tiny pop animation on count
  cartCount.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.5)' },
      { transform: 'scale(1)' }
    ],
    { duration: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  );

  // Fly-to-cart effect from book card
  if (btn) {
    const card = btn.closest('.book-card');
    const cover = card?.querySelector('.book-cover img');
    if (cover) flyToCart(cover);
  }

  showToast();
}

function addToCartFromDetail() {
  cartItems += 1;
  cartCount.textContent = cartItems;
  cartCount.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }],
    { duration: 400 }
  );
  showToast();
  setTimeout(() => {
    closeBookDetail();
    cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }, 600);
}

// Fly-to-cart visual
function flyToCart(sourceImg) {
  const rect = sourceImg.getBoundingClientRect();
  const cartRect = cartBtn.getBoundingClientRect();

  const ghost = sourceImg.cloneNode();
  ghost.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    object-fit: cover;
    border-radius: 2px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    z-index: 600;
    pointer-events: none;
    transition: all 0.8s cubic-bezier(0.65, 0, 0.35, 1);
  `;
  document.body.appendChild(ghost);

  // Force reflow before animating
  ghost.offsetHeight;

  ghost.style.top = (cartRect.top + cartRect.height / 2) + 'px';
  ghost.style.left = (cartRect.left + cartRect.width / 2) + 'px';
  ghost.style.width = '0px';
  ghost.style.height = '0px';
  ghost.style.opacity = '0';
  ghost.style.transform = 'rotate(20deg)';

  setTimeout(() => ghost.remove(), 900);
}

// Wire up cart-item remove buttons
document.querySelectorAll('.cart-remove').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    item.style.transition = 'opacity 0.3s, transform 0.3s, max-height 0.4s';
    item.style.opacity = '0';
    item.style.transform = 'translateX(40px)';
    item.style.maxHeight = '0';
    setTimeout(() => {
      item.remove();
      cartItems = Math.max(0, cartItems - 1);
      cartCount.textContent = cartItems;
    }, 400);
  });
});

// ----- TOAST -----
const toast = document.getElementById('toast');
let toastTimer;
function showToast(message = 'Added to your library bag') {
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// ----- BOOK DETAIL MODAL -----
const bookDetail = document.getElementById('bookDetail');

function openBookDetail() {
  bookDetail.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeBookDetail() {
  bookDetail.classList.remove('open');
  document.body.style.overflow = '';
}

// Click on book cards (excluding inner buttons)
document.querySelectorAll('.book-card').forEach(card => {
  card.addEventListener('click', () => openBookDetail());
});

// Thumbnail switcher inside detail
document.querySelectorAll('.book-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    document.querySelectorAll('.book-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    const cover = document.querySelector('.book-cover-large img');
    const thumbImg = thumb.querySelector('img');
    if (cover && thumbImg) {
      cover.style.opacity = '0';
      setTimeout(() => {
        cover.src = thumbImg.src.replace('w=200', 'w=900');
        cover.style.opacity = '1';
      }, 200);
    }
  });
});

// ----- READER MODAL -----
const readerModal = document.getElementById('readerModal');
const themeBtn = document.getElementById('themeBtn');

function openReader() {
  closeBookDetail();
  setTimeout(() => {
    readerModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    updateReaderUI(); // sync title/progress on open
  }, 100);
}
function closeReader() {
  readerModal.classList.remove('open');
  document.body.style.overflow = '';
}

// ----- READER STATE & NAVIGATION -----
const readerEl = document.querySelector('.reader');
const readerPages = Array.from(document.querySelectorAll('.reader-page'));
const readerPrev = document.getElementById('readerPrev');
const readerNext = document.getElementById('readerNext');
const readerEyebrow = document.getElementById('readerEyebrow');
const readerName = document.getElementById('readerName');
const readerProgressLabel = document.getElementById('readerProgressLabel');
const readerProgressFill = document.getElementById('readerProgressFill');
const readerProgressBtn = document.getElementById('readerProgressBtn');
const readerBody = document.getElementById('readerBody');
const modeBtn = document.getElementById('modeBtn');
const directionBtn = document.getElementById('directionBtn');
const coverStartBtn = document.getElementById('coverStartBtn');
const pageJump = document.getElementById('pageJump');
const pageJumpList = document.getElementById('pageJumpList');
const pageJumpClose = document.getElementById('pageJumpClose');

let currentPageIdx = 0;
let currentMode = 'page';        // 'page' or 'scroll'
let currentDirection = 'rtl';    // 'rtl' or 'ltr'
let scrollObserver = null;
let isAutoScrolling = false;

// Restore from localStorage
try {
  const savedMode = localStorage.getItem('kamado-reader-mode');
  if (savedMode === 'page' || savedMode === 'scroll') currentMode = savedMode;
  const savedDir = localStorage.getItem('kamado-reader-direction');
  if (savedDir === 'rtl' || savedDir === 'ltr') currentDirection = savedDir;
} catch {}

if (readerEl) {
  readerEl.dataset.mode = currentMode;
  readerEl.dataset.direction = currentDirection;
}

function updateReaderUI() {
  if (!readerPages.length) return;
  const total = readerPages.length;
  const page = readerPages[currentPageIdx];
  if (!page) return;

  const isCover = page.dataset.cover === 'true';
  const chNum = page.dataset.chapterNum || '';
  const chTitle = page.dataset.chapterTitle || '';
  const pageNum = page.dataset.pageNum || '';

  if (readerEyebrow) {
    readerEyebrow.textContent = isCover
      ? 'KAMADO · Spring Edition No.04'
      : `The Quiet Art · Chapter ${chNum}`;
  }
  if (readerName) readerName.textContent = chTitle;

  if (readerProgressLabel) {
    if (isCover) {
      readerProgressLabel.textContent = 'Cover · tap to jump';
    } else {
      readerProgressLabel.textContent = `Ch.${chNum} · p. ${pageNum}`;
    }
  }
  if (readerProgressFill) {
    const pct = total > 1 ? (currentPageIdx / (total - 1)) * 100 : 0;
    readerProgressFill.style.width = Math.max(2, pct) + '%';
  }

  if (readerPrev) readerPrev.disabled = currentPageIdx === 0;
  if (readerNext) readerNext.disabled = currentPageIdx === total - 1;

  // Update active state on jump list
  if (pageJumpList) {
    pageJumpList.querySelectorAll('.page-jump-item').forEach((item, i) => {
      item.classList.toggle('active', i === currentPageIdx);
    });
  }
}

function setActivePage(idx) {
  readerPages.forEach((p, i) => p.classList.toggle('active', i === idx));
}

function goToPage(targetIdx) {
  if (targetIdx < 0 || targetIdx >= readerPages.length) return;
  currentPageIdx = targetIdx;

  if (currentMode === 'page') {
    setActivePage(targetIdx);
    const active = readerPages[targetIdx];
    if (active) active.scrollTop = 0;
  } else {
    // Scroll mode: scroll the target page into view
    const target = readerPages[targetIdx];
    if (target && readerBody) {
      isAutoScrolling = true;
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      setTimeout(() => { isAutoScrolling = false; }, 80);
    }
  }
  updateReaderUI();
}

function nextPage() { goToPage(currentPageIdx + 1); }
function prevPage() { goToPage(currentPageIdx - 1); }

readerPrev?.addEventListener('click', (e) => { e.stopPropagation(); prevPage(); });
readerNext?.addEventListener('click', (e) => { e.stopPropagation(); nextPage(); });

// Cover "Begin reading" button -> jump to chapter 1
coverStartBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  goToPage(1);
});

// ----- KEYBOARD (direction-aware) -----
document.addEventListener('keydown', (e) => {
  if (!readerModal?.classList.contains('open')) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  // Page jump escape closes only the jump
  if (e.key === 'Escape' && pageJump?.classList.contains('open')) {
    closePageJump();
    e.stopImmediatePropagation();
    return;
  }

  if (e.key === 'Home') { e.preventDefault(); goToPage(0); return; }
  if (e.key === 'End')  { e.preventDefault(); goToPage(readerPages.length - 1); return; }

  // Arrow / paging keys only in page mode
  if (currentMode !== 'page') return;

  if (e.key === 'ArrowRight') {
    e.preventDefault();
    currentDirection === 'rtl' ? prevPage() : nextPage();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    currentDirection === 'rtl' ? nextPage() : prevPage();
  } else if (e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    nextPage();
  } else if (e.key === 'PageUp') {
    e.preventDefault();
    prevPage();
  }
});

// ----- SWIPE GESTURES (direction-aware, page mode only) -----
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

readerBody?.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
}, { passive: true });

readerBody?.addEventListener('touchend', (e) => {
  if (currentMode !== 'page') return;
  if (e.changedTouches.length !== 1) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  const dt = Date.now() - touchStartTime;

  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5 || dt > 700) return;

  if (currentDirection === 'rtl') {
    // RTL manga: swipe right = next (page comes from the right of reading flow, i.e., the prev visual page becomes next)
    if (dx > 0) nextPage();
    else prevPage();
  } else {
    if (dx < 0) nextPage();
    else prevPage();
  }
}, { passive: true });

// ----- TAP ON PAGE HALVES (direction-aware, page mode only) -----
readerBody?.addEventListener('click', (e) => {
  if (currentMode !== 'page') return;
  // If jump panel is open, first tap just closes it
  if (pageJump?.classList.contains('open')) {
    closePageJump();
    return;
  }
  // Skip clicks on interactive content
  if (e.target.closest('button, a, input, video, .reader-film, .reader-recipe-card, .cover-content')) return;
  // Skip during text selection
  const sel = window.getSelection && window.getSelection();
  if (sel && sel.toString()) return;

  const rect = readerBody.getBoundingClientRect();
  const xRel = e.clientX - rect.left;
  const isLeftHalf = xRel < rect.width / 2;

  if (currentDirection === 'rtl') {
    isLeftHalf ? nextPage() : prevPage();
  } else {
    isLeftHalf ? prevPage() : nextPage();
  }
});

// ----- MODE TOGGLE -----
modeBtn?.addEventListener('click', () => {
  currentMode = currentMode === 'page' ? 'scroll' : 'page';
  if (readerEl) readerEl.dataset.mode = currentMode;
  try { localStorage.setItem('kamado-reader-mode', currentMode); } catch {}

  if (currentMode === 'page') {
    if (scrollObserver) scrollObserver.disconnect();
    setActivePage(currentPageIdx);
    showToast('Page mode · Manga style');
  } else {
    setupScrollObserver();
    requestAnimationFrame(() => {
      const target = readerPages[currentPageIdx];
      if (target) {
        isAutoScrolling = true;
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        setTimeout(() => { isAutoScrolling = false; }, 80);
      }
    });
    showToast('Scroll mode · Webtoon style');
  }
});

// ----- DIRECTION TOGGLE -----
directionBtn?.addEventListener('click', () => {
  if (currentMode === 'scroll') return;
  currentDirection = currentDirection === 'rtl' ? 'ltr' : 'rtl';
  if (readerEl) readerEl.dataset.direction = currentDirection;
  try { localStorage.setItem('kamado-reader-direction', currentDirection); } catch {}
  showToast(currentDirection === 'rtl' ? 'Right-to-left · Manga' : 'Left-to-right');
});

// ----- SCROLL MODE: detect current page via IntersectionObserver -----
function setupScrollObserver() {
  if (scrollObserver) scrollObserver.disconnect();
  if (!('IntersectionObserver' in window)) return;

  scrollObserver = new IntersectionObserver((entries) => {
    if (isAutoScrolling) return;
    let best = null;
    let bestRatio = 0;
    entries.forEach(entry => {
      if (entry.intersectionRatio > bestRatio) {
        bestRatio = entry.intersectionRatio;
        best = entry.target;
      }
    });
    if (best && bestRatio > 0.35) {
      const idx = readerPages.indexOf(best);
      if (idx !== -1 && idx !== currentPageIdx) {
        currentPageIdx = idx;
        updateReaderUI();
      }
    }
  }, {
    root: readerBody,
    threshold: [0.35, 0.5, 0.65]
  });

  readerPages.forEach(p => scrollObserver.observe(p));
}

// ----- PAGE JUMP UI -----
function buildPageJumpList() {
  if (!pageJumpList) return;
  pageJumpList.innerHTML = '';
  readerPages.forEach((page, i) => {
    const btn = document.createElement('button');
    btn.className = 'page-jump-item' + (i === currentPageIdx ? ' active' : '');

    const isCover = page.dataset.cover === 'true';
    const num = page.dataset.pageNum || '';
    const chNum = page.dataset.chapterNum || '';
    const title = page.dataset.chapterTitle || '';

    const numLabel = isCover ? 'Cover' : 'p. ' + num;
    const titleLabel = isCover ? 'Book Cover' : `Ch.${chNum} · ${title}`;

    btn.innerHTML = `<span class="num">${numLabel}</span><span class="title">${titleLabel}</span>`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToPage(i);
      closePageJump();
    });
    pageJumpList.appendChild(btn);
  });
}

function openPageJump() {
  if (!pageJump) return;
  buildPageJumpList();
  pageJump.classList.add('open');
}

function closePageJump() {
  pageJump?.classList.remove('open');
}

readerProgressBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (pageJump?.classList.contains('open')) closePageJump();
  else openPageJump();
});

pageJumpClose?.addEventListener('click', (e) => {
  e.stopPropagation();
  closePageJump();
});

// Click outside the jump panel closes it
document.addEventListener('click', (e) => {
  if (!pageJump?.classList.contains('open')) return;
  if (e.target.closest('.page-jump') || e.target.closest('#readerProgressBtn')) return;
  closePageJump();
});

// ----- INITIALIZE READER -----
if (currentMode === 'scroll') {
  setupScrollObserver();
}
updateReaderUI();

themeBtn?.addEventListener('click', () => {
  const reader = document.querySelector('.reader');
  if (!reader) return;
  const next = reader.dataset.theme === 'light' ? 'dark' : 'light';
  reader.dataset.theme = next;
  themeBtn.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('kamado-reader-theme', next); } catch {}
});

// Restore theme preference on page load
try {
  const savedTheme = localStorage.getItem('kamado-reader-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    const reader = document.querySelector('.reader');
    if (reader) reader.dataset.theme = savedTheme;
  }
} catch {}

// ----- FILMS -----
function playFilm(btn) {
  const card = btn.closest('.film-card, .reader-film');
  if (!card) return;

  // Visual feedback only — this is a prototype
  btn.animate(
    [
      { transform: 'translate(-50%, -50%) scale(1)' },
      { transform: 'translate(-50%, -50%) scale(0.9)' },
      { transform: 'translate(-50%, -50%) scale(1.15)' },
      { transform: 'translate(-50%, -50%) scale(1)' }
    ],
    { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
  );

  showToast('Streaming · signed URL generated');
}

// Make sure film card click goes to play
document.querySelectorAll('.film-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const btn = card.querySelector('.film-play');
    if (btn && e.target !== btn) playFilm(btn);
  });
});

// ----- SEARCH (mock) -----
document.getElementById('searchBtn')?.addEventListener('click', () => {
  showToast('Search · Catalog, recipes, films');
});

// ----- ACCOUNT (mock) -----
document.getElementById('accountBtn')?.addEventListener('click', () => {
  showToast('My Library · 7 editions, 4 in progress');
});

// ----- NEWSLETTER -----
function handleSubscribe(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  showToast('Thank you · The next letter will arrive in June');
  input.value = '';
}

// ----- SCROLL REVEAL -----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Auto-reveal book cards, film cards, journal cards, etc.
const autoReveal = document.querySelectorAll(
  '.book-card, .film-card, .journal-card, .cat-tile, .editorial-lead, .editorial-meta, .feature-text, .chef-text, .chef-image'
);
autoReveal.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ----- ESC TO CLOSE MODALS -----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBookDetail();
    closeReader();
    closeCart();
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ----- SUBTLE PARALLAX ON HERO -----
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const offset = window.scrollY * 0.3;
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg && window.scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${offset}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// ----- SUBTLE CURSOR EFFECT ON BIG ITEMS -----
document.querySelectorAll('.cat-tile, .chef-image').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    const img = el.querySelector('img');
    if (img) img.style.transform = `scale(1.08) translate(${x}px, ${y}px)`;
  });
  el.addEventListener('mouseleave', () => {
    const img = el.querySelector('img');
    if (img) img.style.transform = '';
  });
});

console.log('%c KAMADO ', 'background: #2C1810; color: #E5C476; font-family: serif; font-size: 18px; padding: 8px 16px;');
console.log('%c A library of cookbooks · Prototype 1.0 ', 'color: #A77840; font-style: italic; padding: 4px 0;');
