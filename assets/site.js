/* 웹 교재 동작: 슬라이드 크기 맞춤, 복사 버튼, 발표 모드 */

/* ===== 강사 설정 ===== */
const CONFIG = {
  // 강사 제공 관찰노트 폼의 사본 링크(…/copy). 비워 두면 안내 문구만 표시
  observeFormCopyUrl: ''
};

(function () {
  /* 슬라이드 크기 맞춤 */
  function fit(stage) {
    const canvas = stage.querySelector('.w-canvas');
    canvas.style.transform = 'scale(' + stage.clientWidth / 1920 + ')';
  }
  const stages = Array.from(document.querySelectorAll('.w-main .w-stage'));
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(function (entries) { entries.forEach(function (e) { fit(e.target); }); });
    stages.forEach(function (s) { ro.observe(s); });
  } else {
    window.addEventListener('resize', function () { stages.forEach(fit); });
  }
  stages.forEach(fit);

  /* 알림 */
  const toastEl = document.querySelector('.w-toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('w-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('w-on'); }, 2200);
  }

  /* 복사 */
  function textOf(key) {
    const card = document.getElementById(key);
    const pre = card && card.querySelector('pre');
    return pre ? pre.textContent : null;
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function handle(key) {
    if (key === 'form-observe-copy') {
      if (CONFIG.observeFormCopyUrl) {
        window.open(CONFIG.observeFormCopyUrl, '_blank', 'noopener');
      } else {
        toast('사본 링크가 아직 연결되지 않았습니다');
      }
      return;
    }
    const text = textOf(key);
    if (!text) { toast('복사할 내용을 찾지 못했습니다'); return; }
    copyText(text).then(function (ok) {
      toast(ok ? '복사했습니다' : '복사하지 못했습니다. 상자 안 글을 직접 선택해 복사하세요');
    });
  }

  if (CONFIG.observeFormCopyUrl) {
    document.querySelectorAll('[data-link="form-observe-copy"]').forEach(function (a) {
      a.href = CONFIG.observeFormCopyUrl;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-link-note]').forEach(function (p) { p.hidden = true; });
  }

  /* 발표 모드 */
  const slides = Array.from(document.querySelectorAll('.w-slide'));
  const show = document.querySelector('.w-show');
  const showStage = show.querySelector('.w-show-stage');
  const showCanvas = show.querySelector('.w-canvas');
  const showCount = show.querySelector('.w-show-count');
  let cur = 0;

  function fitShow() {
    const s = Math.min(window.innerWidth / 1920, (window.innerHeight - 72) / 1080);
    showStage.style.width = 1920 * s + 'px';
    showStage.style.height = 1080 * s + 'px';
    showCanvas.style.transform = 'scale(' + s + ')';
  }
  function render() {
    showCanvas.innerHTML = slides[cur].querySelector('.w-canvas').innerHTML;
    showCount.textContent = (cur + 1) + ' / ' + slides.length;
    fitShow();
  }
  function openShow(n) {
    cur = Math.max(0, Math.min(slides.length - 1, n - 1));
    show.hidden = false;
    document.body.classList.add('w-showing');
    render();
    if (show.requestFullscreen) { show.requestFullscreen().catch(function () {}); }
  }
  function closeShow() {
    show.hidden = true;
    document.body.classList.remove('w-showing');
    if (document.fullscreenElement) { document.exitFullscreen().catch(function () {}); }
    slides[cur].scrollIntoView({ block: 'start' });
  }
  function go(d) {
    cur = Math.max(0, Math.min(slides.length - 1, cur + d));
    render();
  }

  document.addEventListener('click', function (e) {
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) { e.preventDefault(); handle(copyBtn.dataset.copy); return; }
    const link = e.target.closest('[data-link]');
    if (link && !CONFIG.observeFormCopyUrl) { e.preventDefault(); handle(link.dataset.link); return; }
    const present = e.target.closest('[data-present]');
    if (present) { openShow(Number(present.dataset.present)); return; }
    const ctl = e.target.closest('[data-show]');
    if (ctl) {
      if (ctl.dataset.show === 'prev') go(-1);
      else if (ctl.dataset.show === 'next') go(1);
      else closeShow();
    }
  });
  window.addEventListener('keydown', function (e) {
    if (show.hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
    else if (e.key === 'Escape') { closeShow(); }
  });
  window.addEventListener('resize', function () { if (!show.hidden) fitShow(); });

  /* 주소 끝 #키로 들어오면 해당 복사 카드 강조 */
  function flash() {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (el && el.classList.contains('w-copy')) {
      el.classList.add('w-flash');
      setTimeout(function () { el.classList.remove('w-flash'); }, 2400);
    }
  }
  window.addEventListener('hashchange', flash);
  flash();

  /* 왼쪽 목차: 열고 닫기, 현재 위치 표시 */
  const side = document.getElementById('w-side');
  const menuBtn = document.querySelector('.w-menu');
  function setMenu(open) {
    side.classList.toggle('w-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  menuBtn.addEventListener('click', function () { setMenu(!side.classList.contains('w-open')); });
  side.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });

  const links = {};
  side.querySelectorAll('a[data-target]').forEach(function (a) { links[a.dataset.target] = a; });
  let curLink = null;
  function mark(id) {
    const a = links[id];
    if (!a || a === curLink) return;
    if (curLink) curLink.classList.remove('w-cur');
    a.classList.add('w-cur');
    curLink = a;
    const r = a.getBoundingClientRect(), sr = side.getBoundingClientRect();
    if (r.top < sr.top + 40 || r.bottom > sr.bottom - 40) {
      side.scrollTop += r.top - sr.top - sr.height / 3;
    }
  }
  let ticking = false;
  function update() {
    ticking = false;
    let best = slides[0];
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].getBoundingClientRect().top <= 140) best = slides[i]; else break;
    }
    if (best) mark(best.id);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  side.addEventListener('click', function (e) {
    const a = e.target.closest('a[data-target^="slide-"]');
    if (a) setTimeout(function () { mark(a.dataset.target); }, 700);
  });
  update();
})();
