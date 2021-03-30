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
  setUpControl("fonts", loadFancyFonts, (control: HTMLInputElement, value: string) => { value === 'fancy' && (control.checked = true) });

  document.addEventListener("click", function(event: MouseEvent) {
    const closestDropdown = (event?.target as Element).closest(".dropdown");
    if (closestDropdown) return;
    const selector = ".dropdown[open]";
    for (const dropdown of document.querySelectorAll(selector)) {
      (dropdown as HTMLDetailsElement).open = false;
    }
  });

  if ('customElements' in window) {
    customElements.define('table-of-contents', TOC);
  }
});
