import { setUpControl, setColourScheme } from './colour-scheme.js';
import TOC from './toc.js';

document.addEventListener('DOMContentLoaded', () => {
  let setValue = (control, val) => { control.value = val };
  let loadFancyFonts = (val) => {
    if (val === 'fancy') {
      if (!window.fancyFontsLoaded) window.loadFancyFonts();
      document.body.classList.remove('fonts-default');
    } else {
      document.body.classList.add('fonts-default');
    }
  };
  setUpControl("colour-scheme", setColourScheme, setValue);
  setUpControl("fonts", loadFancyFonts, (control, value) => { value === 'fancy' && (control.checked = true) });
  document.addEventListener("click", function(event) {
    let closestDropdown = event.target.closest(".dropdown");
    if (closestDropdown) return;
    for (let dropdown of document.querySelectorAll('.dropdown[open]')) {
      dropdown.open = false;
    }
  });

  if ('customElements' in window) {
    customElements.define('table-of-contents', TOC);
  }

  const setOpen = (event) => {
    document.querySelectorAll(".lg\\:open").forEach((element) => {
      element.open = event.matches;
    })
  };

  const isLargeViewport = window.matchMedia('(min-width: 1024px)');
  setOpen(isLargeViewport);
  isLargeViewport.addEventListener('change', setOpen);
});
