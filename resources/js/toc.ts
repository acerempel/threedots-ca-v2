import { render } from 'solid-js/web';

import { TOC } from './toc/view';

const elem = document.getElementById('all-posts');
if (elem) render(() => TOC(elem), document.getElementById('toc')!);
