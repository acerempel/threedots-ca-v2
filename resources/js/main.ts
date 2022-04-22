import { setUpControl, setColourScheme } from './colour-scheme';
import { enable_comments, disable_comments } from "./comments";
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

  const setCommentsEnabled = (state: string) => {
        if (state === 'on') {
            enable_comments()
        } else {
            disable_comments()
        }
  }

  setUpControl("colour-scheme", setColourScheme, setValue);
  setUpControl("fonts", loadFancyFonts, setValue);
  setUpControl("comments-option", setCommentsEnabled, (control, value) => { control.checked = value === 'on' })
});
