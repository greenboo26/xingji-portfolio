'use strict';
(() => {

const preview = document.querySelector('.needs-orbit-preview');
if (!preview) return;
new ResizeObserver(([entry]) => preview.style.setProperty('--scale', entry.contentRect.width / 544)).observe(preview);
const planets = [...preview.querySelectorAll('.needs-orbit-planet')];
for (const planet of planets) {
  planet.addEventListener('click', () => {
    const show = planet.getAttribute('aria-expanded') !== 'true';
    for (const button of planets) {
      const expanded = button === planet && show;
      button.setAttribute('aria-expanded', String(expanded));
      document.getElementById(button.getAttribute('aria-controls')).hidden = !expanded;
    }
  });
}

})();
