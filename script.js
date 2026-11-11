const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const root = document.documentElement;

function readTheme() {
  try { return localStorage.getItem('sumith-portfolio-theme') === 'light' ? 'light' : 'dark'; }
  catch { return 'dark'; }
}
root.dataset.theme = readTheme();

function updateThemeControl() {
  const isDark = root.dataset.theme === 'dark';
  themeToggle?.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  themeToggle?.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  const label = themeToggle?.querySelector('.theme-label');
  if (label) label.textContent = isDark ? 'LIGHT MODE' : 'DARK MODE';
  const icon = themeToggle?.querySelector('.theme-icon');
  if (icon) icon.textContent = isDark ? '☼' : '◐';
  themeMeta?.setAttribute('content', isDark ? '#101010' : '#f0efea');
}
updateThemeControl();

themeToggle?.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('sumith-portfolio-theme', root.dataset.theme); } catch {}
  updateThemeControl();
});

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav?.classList.toggle('open', open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
  });
});

function revealElements() {
  const elements = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
    observer.observe(element);
  });
}
revealElements();
window.addEventListener('portfolio:rendered', revealElements);
