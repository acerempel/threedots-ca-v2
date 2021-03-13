import slugify from 'slug';

const tocTemplate = document.createElement('template');
tocTemplate.innerHTML = `
<link rel="stylesheet" href="/css/main.css">
<nav class="flex column">
  <slot name="title"></slot>
</nav>
`;

export default class extends HTMLElement {
  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(tocTemplate.content);
  }

  connectedCallback() {
    let headings = document.getElementById(this.getAttribute('for')).querySelectorAll('h2');
    let nav = this.shadowRoot.lastElementChild;
    for (let heading of headings) {
      let id;
      if (!heading.id) {
        id = slugify(heading.textContent);
        heading.id = id;
      } else {
        id = heading.id;
      }
      let link = document.createElement('a');
      link.href = '#' + id;
      link.innerHTML = heading.innerHTML;
      nav.appendChild(link);
    }
  }
}
