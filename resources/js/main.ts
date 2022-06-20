import { setUpControl, setColourScheme } from './colour-scheme';

document.addEventListener('DOMContentLoaded', async () => {
  const setValue = (control: HTMLInputElement, val: string) => { control.value = val };
  const loadFancyFonts = (val: string) => {
    if (val === 'fancy') {
      document.body.classList.remove('fonts-default');
    } else {
      document.body.classList.add('fonts-default');
    }
  };

  setUpControl("colour-scheme", setColourScheme, setValue);
  setUpControl("fonts", loadFancyFonts, setValue);

  const elem = document.getElementById('all-posts');
  const toc = document.getElementById('toc');
  if (toc && elem) {
    (await import('./toc')).renderTOC(elem, toc)
  }
});
