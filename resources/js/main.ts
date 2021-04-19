import { setUpControl, setColourScheme } from './colour-scheme';
import './toc';

document.addEventListener('DOMContentLoaded', () => {
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
});
