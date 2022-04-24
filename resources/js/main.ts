import { setUpControl, setColourScheme } from './colour-scheme';
import { enable_comments, disable_comments } from "./comments";

document.addEventListener('DOMContentLoaded', async () => {
  const setValue = (control: HTMLInputElement, val: string) => { control.value = val };
  const loadFancyFonts = (val: string) => {
    const submit = document.getElementById('comment-submit')
    if (val === 'fancy') {
      document.body.classList.remove('fonts-default');
      if (submit) {
        submit.style.setProperty('position', 'relative')
        submit.style.setProperty('top', '1px')
      }
    } else {
      document.body.classList.add('fonts-default');
      if (submit) {
        submit.style.removeProperty('position')
        submit.style.removeProperty('top')
      }
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

  const elem = document.getElementById('all-posts');
  const toc = document.getElementById('toc');
  if (toc && elem) {
    (await import('./toc')).renderTOC(elem, toc)
  }
});
