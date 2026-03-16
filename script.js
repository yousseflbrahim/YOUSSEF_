document.addEventListener('DOMContentLoaded', () => {

  /* ── Animated fill line ── */
  const sequence = document.querySelector('.Sequence');
  if (sequence) {
    const line = document.createElement('div');
    line.className = 'timeline-line';
    sequence.prepend(line);
  }

  /* ── Timeline dots on the line ── */
  function placeDots() {
    // امسح النقاط القديمة
    document.querySelectorAll('.timeline-dot').forEach(d => d.remove());

    const seqRect = sequence.getBoundingClientRect();
    const scrollTop = window.scrollY;

    items.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      // موقع النقطة = أعلى الكارت + 22px (مع الـ scroll)
      const dotTop = (itemRect.top + scrollTop) - (seqRect.top + scrollTop) + 20;

      const dot = document.createElement('div');
      dot.className = 'timeline-dot';
      dot.style.top = dotTop + 'px';
      sequence.appendChild(dot);
    });
  }

  // شغّل بعد ما الصفحة تتحمل كامل
  window.addEventListener('load', placeDots);
  window.addEventListener('resize', placeDots);

  /* ── Scroll observer ── */
  const sectionTitle = document.querySelector('section > h1');
  const items = document.querySelectorAll('.frist');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        // اظهر النقطة المقابلة
        const dots = document.querySelectorAll('.timeline-dot');
        const itemIndex = Array.from(items).indexOf(e.target);
        if (dots[itemIndex]) dots[itemIndex].classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  if (sectionTitle) observer.observe(sectionTitle);
  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.12}s`;
    observer.observe(item);
  });

  /* ── Grow center line ── */
  const timelineLine = document.querySelector('.timeline-line');
  const growLine = () => {
    if (!sequence || !timelineLine) return;
    const rect = sequence.getBoundingClientRect();
    const winH = window.innerHeight;
    const start = winH * 0.85;
    if (rect.top > start) { timelineLine.style.height = '0%'; return; }
    const progress = Math.min((start - rect.top) / sequence.offsetHeight, 1);
    timelineLine.style.height = (progress * 100) + '%';
  };
  window.addEventListener('scroll', growLine, { passive: true });
  growLine();

  /* ══════════════════════════════
     THEME TOGGLE
  ══════════════════════════════ */
  const themeBtn = document.getElementById('themeBtn');
  const iconMoon = themeBtn.querySelector('.icon-moon');
  const iconSun  = themeBtn.querySelector('.icon-sun');

  const applyTheme = (theme) => {
    document.body.classList.toggle('light', theme === 'light');
    iconMoon.style.display = theme === 'light' ? 'none'  : 'block';
    iconSun.style.display  = theme === 'light' ? 'block' : 'none';
    localStorage.setItem('theme', theme);
  };
  applyTheme(localStorage.getItem('theme') || 'dark');
  themeBtn.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
  });

  /* ══════════════════════════════
     LANGUAGE TOGGLE
  ══════════════════════════════ */
  const langBtn = document.getElementById('langBtn');
  const html    = document.documentElement;

  const applyLang = (lang) => {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    langBtn.textContent = lang === 'ar' ? 'EN' : 'ض';
    document.querySelectorAll('[data-ar]').forEach(el => {
      el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en;
    });
    document.title = lang === 'ar' ? 'يوسف إبراهيم' : 'Youssef Ibrahim';
    localStorage.setItem('lang', lang);
  };
  applyLang(localStorage.getItem('lang') || 'ar');
  langBtn.addEventListener('click', () => {
    applyLang(html.getAttribute('lang') === 'ar' ? 'en' : 'ar');
  });
});