import { render } from 'solid-js/web';

import { TOC } from './toc/view';

const elem = document.getElementById('all-posts');
const toc = document.getElementById('toc');
if (toc && elem) render(() => <TOC forElem={elem} />, toc);
