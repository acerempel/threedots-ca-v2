import slugify from 'slug';

export default class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    let headings = document.getElementById(this.getAttribute('for')).querySelectorAll('h2');
    let nav = document.createElement('nav');
    nav.style.setProperty('display', 'flex');
    nav.style.setProperty('flex-direction', 'column');
    let title = this.getAttribute('title');
    if (title) {
      let titleElement = document.createElement('h2');
      titleElement.textContent = title;
      this.shadowRoot.appendChild(titleElement);
    }
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
    this.shadowRoot.appendChild(nav);
  }
}
