(() => {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const links = document.getElementById('nav-links');
  if (header && toggle && links) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.textContent = '☰';
      links.classList.remove('open');
      document.body.classList.remove('nav-open');
    };
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    toggle.addEventListener('click', () => {
      if (toggle.getAttribute('aria-expanded') === 'true') { close(); return; }
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
      toggle.textContent = '×';
      links.classList.add('open');
      document.body.classList.add('nav-open');
    });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        close(); toggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (getComputedStyle(toggle).display === 'none') close();
    }, { passive: true });
  }
  const year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();
})();
