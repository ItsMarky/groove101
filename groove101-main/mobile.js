// Keep the compact navigation usable with keyboards and after screen rotation.
(() => {
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;
  const close = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.textContent = '☰';
    links.classList.remove('open');
    document.body.classList.remove('nav-open');
  };
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (toggle.getAttribute('aria-expanded') === 'true' && getComputedStyle(toggle).display === 'none') close();
  });
})();
