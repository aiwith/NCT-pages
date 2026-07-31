(function () {
  const wrap = document.getElementById('peek1');
  const outer = wrap.querySelector('.peek-outer');
  const track = wrap.querySelector('.peek-track');
  const slides = Array.from(wrap.querySelectorAll('.peek-slide'));
  const prevBtn = wrap.querySelector('.prev');
  const nextBtn = wrap.querySelector('.next');
  const dotsEl = wrap.querySelector('.peek-dots');
  const counter = wrap.querySelector('.peek-counter');
  let idx = 0; const total = slides.length;
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'peek-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i)); dotsEl.appendChild(d);
  });
  function syncVideos(slide) {
    const main = slide.querySelector('.video-main-source video');
    const variants = Array.from(slide.querySelectorAll('.video-variant-item video'));
    if (!main) return;

    // 원본 비디오를 기준으로 동기화 이벤트 연결
    const sync = () => {
      variants.forEach(vid => {
        if (Math.abs(vid.currentTime - main.currentTime) > 0.1) {
          vid.currentTime = main.currentTime;
        }
        if (main.paused && !vid.paused) vid.pause();
        if (!main.paused && vid.paused) vid.play().catch(() => {});
      });
    };

    main.addEventListener('play', () => variants.forEach(v => v.play().catch(() => {})));
    main.addEventListener('pause', () => variants.forEach(v => v.pause()));
    main.addEventListener('seeking', () => variants.forEach(v => v.currentTime = main.currentTime));
    main.addEventListener('timeupdate', sync);
  }

  function goTo(n) {
    idx = n;
    track.style.transform = `translateX(${-idx * 100}%)`;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === idx);
      const vids = s.querySelectorAll('video');
      if (i === idx) {
        vids.forEach(v => v.play().catch(() => {}));
      } else {
        vids.forEach(v => {
          v.pause();
          v.currentTime = 0;
        });
      }
    });
    dotsEl.querySelectorAll('.peek-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    counter.textContent = `${idx + 1} / ${total}`;
    prevBtn.disabled = idx === 0; nextBtn.disabled = idx === total - 1;
  }

  slides.forEach(s => syncVideos(s));
  prevBtn.addEventListener('click', () => { if (idx > 0) goTo(idx - 1); });
  nextBtn.addEventListener('click', () => { if (idx < total - 1) goTo(idx + 1); });
  let sx = 0;
  outer.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  outer.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (dx < -50 && idx < total - 1) goTo(idx + 1); if (dx > 50 && idx > 0) goTo(idx - 1); });
  goTo(0); window.addEventListener('resize', () => goTo(idx));
})();

document.querySelectorAll('.plain-carousel').forEach(carousel => {
  const track = carousel.querySelector('.plain-track');
  const slides = carousel.querySelectorAll('.plain-slide');
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');
  const dotsEl = carousel.querySelector('.plain-dots');
  const counter = carousel.querySelector('.plain-counter');
  let idx = 0; const total = slides.length;
  slides.forEach((_, i) => {
    const d = document.createElement('div'); d.className = 'plain-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i)); dotsEl.appendChild(d);
  });
  function goTo(n) {
    idx = n; track.style.transform = `translateX(${-idx * 100}%)`;
    dotsEl.querySelectorAll('.plain-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    counter.textContent = `${idx + 1} / ${total}`; prevBtn.disabled = idx === 0; nextBtn.disabled = idx === total - 1;
  }
  prevBtn.addEventListener('click', () => { if (idx > 0) goTo(idx - 1); });
  nextBtn.addEventListener('click', () => { if (idx < total - 1) goTo(idx + 1); });
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (dx < -50 && idx < total - 1) goTo(idx + 1); if (dx > 50 && idx > 0) goTo(idx - 1); });
  goTo(0);
});

const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
let manualOverride = false;

function applyTimeTheme() {
  if (manualOverride) return;
  // Force light mode as per user request
  html.setAttribute('data-theme', 'light');
  toggle.textContent = '☀️';
}
applyTimeTheme();

window.copyBibtex = function() {
  const codeEl = document.querySelector('#bibCode pre code');
  const raw = codeEl ? codeEl.innerText : '';
  navigator.clipboard.writeText(raw);
  const btn = document.getElementById('bibCopyBtn');
  btn.textContent = 'Copied!'; btn.classList.add('copied');
  setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
};

toggle.addEventListener('click', () => {
  manualOverride = true;
  const isLight = html.getAttribute('data-theme') === 'light';
  if (isLight) {
    html.removeAttribute('data-theme');
    toggle.textContent = '🌙';
  } else {
    html.setAttribute('data-theme', 'light');
    toggle.textContent = '☀️';
  }
});
