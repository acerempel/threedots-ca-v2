import { setUpControl, setColourScheme } from './colour-scheme';
import './toc';

declare global {
    interface Window {
        enable_comments: () => void
        disable_comments: () => void
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const setValue = (control: HTMLInputElement, val: string) => { control.value = val };
  const loadFancyFonts = (val: string) => {
    if (val === 'fancy') {
      document.body.classList.remove('fonts-default');
    } else {
      document.body.classList.add('fonts-default');
    }
  };

    const setCommentsEnabled = (state: string) => {
        if (state === 'on') {
            window.enable_comments()
        } else {
            window.disable_comments()
        }
  }

  setUpControl("colour-scheme", setColourScheme, setValue);
  setUpControl("fonts", loadFancyFonts, setValue);
  setUpControl("comments-option", setCommentsEnabled, (control, value) => { control.checked = value === 'on' })
});
