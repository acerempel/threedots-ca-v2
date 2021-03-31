import { setUpControl, setColourScheme } from './colour-scheme';
import { TOC } from './toc';

declare function lff(): void;
declare function ffl(): boolean;

document.addEventListener('DOMContentLoaded', () => {
  const setValue = (control: HTMLInputElement, val: string) => { control.value = val };
  const loadFancyFonts = (val: string) => {
    if (val === 'fancy') {
      if (!ffl()) lff();
      document.body.classList.remove('fonts-default');
    } else {
      document.body.classList.add('fonts-default');
    }
  };

  const setLineHeight = (lh: string) => {
    document.documentElement.style.setProperty('--base-line-height', lh + 'rem');
  }

  setUpControl("colour-scheme", setColourScheme, setValue);
  setUpControl("line-height", setLineHeight, setValue);
  setUpControl("fonts", loadFancyFonts, setValue);

  document.addEventListener("click", function(event: MouseEvent) {
    const closestDropdown = (event?.target as Element).closest(".drawer");
    if (closestDropdown) return;
    for (const toggle of document.querySelectorAll('.drawer-toggle[aria-expanded = "true"]')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.getElementById(toggle.getAttribute('aria-controls')!)!.classList.add('hidden')
      toggle.setAttribute('aria-expanded', 'false')
    }
  });

  for (const toggle of document.querySelectorAll('.drawer-toggle')) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const drawer = document.getElementById(toggle.getAttribute('aria-controls')!)!;
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      drawer.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
    })
  }

  if ('customElements' in window) {
    customElements.define('table-of-contents', TOC);
  }
});
