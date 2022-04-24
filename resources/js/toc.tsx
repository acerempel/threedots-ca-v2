import { render } from 'solid-js/web';

import { TOC } from './toc/view';

export function renderTOC(elem: HTMLElement, toc: HTMLElement) {
  render(() => <TOC forElem={elem} />, toc);
}
