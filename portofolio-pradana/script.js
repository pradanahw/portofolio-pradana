// ===== Mode toggle (security <-> creator), persisted per tab session =====
(function () {
  const html = document.documentElement;
  const sw = document.getElementById('modeSwitch');
  if (!sw) return;

  const labelSecurity = document.getElementById('labelSecurity');
  const labelCreator = document.getElementById('labelCreator');

  function applyMode(mode) {
    html.setAttribute('data-mode', mode);
    const isCreator = mode === 'creator';
    if (labelSecurity) labelSecurity.classList.toggle('active', !isCreator);
    if (labelCreator) labelCreator.classList.toggle('active', isCreator);
    document.querySelectorAll('[data-mode-text-security]').forEach(function (el) {
      el.textContent = isCreator
        ? el.getAttribute('data-mode-text-creator')
        : el.getAttribute('data-mode-text-security');
    });
    try { sessionStorage.setItem('mphw-mode', mode); } catch (e) {}
  }

  let mode = 'security';
  try { mode = sessionStorage.getItem('mphw-mode') || 'security'; } catch (e) {}
  applyMode(mode);

  function toggle() {
    mode = mode === 'security' ? 'creator' : 'security';
    applyMode(mode);
  }

  sw.addEventListener('click', toggle);
  sw.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
})();

// ===== Scroll reveal =====
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// ===== Subtle blob cursor parallax (desktop only) =====
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const blobs = document.querySelectorAll('.blob[data-parallax]');
  if (!blobs.length) return;
  window.addEventListener('mousemove', function (e) {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);
    blobs.forEach(function (b) {
      const depth = parseFloat(b.getAttribute('data-parallax')) || 10;
      b.style.transform = 'translate(' + (x * depth) + 'px,' + (y * depth) + 'px)';
    });
  });
})();
