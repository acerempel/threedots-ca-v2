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

  setUpControl("colour-scheme", setColourScheme, setValue);
  setUpControl("fonts", loadFancyFonts, (control: HTMLInputElement, value: string) => { value === 'fancy' && (control.checked = true) });

  const setOpen = (event: MediaQueryList | MediaQueryListEvent) => {
    document.querySelectorAll(".lg\\:open").forEach((element) => {
      (element as HTMLDetailsElement).open = event.matches;
    })
  };

  const isLargeViewport = window.matchMedia('(min-width: 960px)');
  setOpen(isLargeViewport);
  isLargeViewport.addEventListener('change', setOpen);

  document.addEventListener("click", function(event: MouseEvent) {
    const closestDropdown = (event?.target as Element).closest(".dropdown");
    if (closestDropdown) return;
    const selector = isLargeViewport.matches ? ".dropdown[open]:not(.lg\\:open)" : ".dropdown[open]";
    for (const dropdown of document.querySelectorAll(selector)) {
      (dropdown as HTMLDetailsElement).open = false;
    }
  });

  if ('customElements' in window) {
    customElements.define('table-of-contents', TOC);
  }
});
