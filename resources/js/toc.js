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
    this.visibleHeadings = new Map();
    this.currentHeading = null;
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
    if ('IntersectionObserver' in window) {
      let headingObserverCallback = function (entries, _observer) {
        let highestIntersectingEntry = entries.reduce(
          (acc, next) => {
            if (next.isIntersecting && !acc.isIntersecting) {
              return next;
            } else if (next.isIntersecting /* && acc.isIntersecting */) {
              return next.boundingClientRect.top > acc.boundingClientRect.top ? next : acc;
            } else /* if (!next.isIntersecting) */ {
              return acc;
            };
          });
        if (highestIntersectingEntry.isIntersecting) {
          this.setCurrentHeading(highestIntersectingEntry);
        } else {

        };
        for (let entry of entries) {
          if (entry.isIntersecting) {
            let previousOffset = this.visibleHeadings.get(entry.target);
            if (previousOffset) {}
            this.visibleHeadings.set(entry.target, entry.boundingClientRect.top);
          } else {
            this.visibleHeadings.delete(entry.target);
          }
        }
      }
      let headingObserverOptions = {
        threshold: 1.0,
        rootMargin: "0px 0px 0px 32px",
      };
      let headingObserver = new IntersectionObserver(headingObserverCallback, headingObserverOptions);
      for (let heading of headings) {
        headingObserver.observe(heading);
      }
    }
  }

  activeHeading
}
