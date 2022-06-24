import { setUpControl, setColourScheme } from './colour-scheme';

document.addEventListener('DOMContentLoaded', async () => {
  const setValue = (control: HTMLInputElement, val: string) => { control.value = val };

  setUpControl("colour-scheme", setColourScheme, setValue);

  const elem = document.getElementById('all-posts');
  const toc = document.getElementById('toc');
  if (toc && elem) {
    (await import('./toc')).renderTOC(elem, toc)
  }
});
