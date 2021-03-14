import slugify from 'slug';

const tocTemplate = document.createElement('template');
tocTemplate.innerHTML = `
<link rel="stylesheet" href="/css/main.css">
<style>:host { display: block } a[aria-current = "true"] { font-weight: 500; }</style>
<nav class="flex column link-plain">
  <slot name="title"></slot>
</nav>
`;

const hasAriaCurrent = 'ariaCurrent' in document.createElement('a');

const setAriaCurrent = hasAriaCurrent
  ? el => el.ariaCurrent = "true"
  : el => el.setAttribute("aria-current", "true");

const removeAriaCurrent = hasAriaCurrent
  ? el => el.ariaCurrent = "false"
  : el => el.removeAttribute("aria-current");

export default class extends HTMLElement {
  constructor() {
    super();
    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(tocTemplate.content);
    this.knownHeadings = new Map();
    this.currentHeading = null;
  }

  connectedCallback() {
    let headings = document.getElementById(this.getAttribute('for')).querySelectorAll('h2');
    let nav = this.shadowRoot.lastElementChild;
    let preceding = null;
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
      link.className = 'mt-1/8 light';
      link.innerHTML = heading.innerHTML;
      nav.appendChild(link);
      let knownHeading = { target: heading, link, preceding };
      this.knownHeadings.set(heading, knownHeading);
      preceding = knownHeading;
    }
    if ('IntersectionObserver' in window) {
      let headingObserverCallback = (entries, _observer) => {
        let incumbentEntry = null;
        /* relevantEntry is, if at least one entry is intersecting, the
           intersecting entry closest to the top of the viewport, otherwise the
           entry closest to the top of the viewport. */
        let lookingForIncumbent = true;
        let relevantEntry = entries.reduce(
          (acc, next) => {
            if (lookingForIncumbent && next === this.currentHeading?.target) {
              incumbentEntry = next;
              lookingForIncumbent = false;
            }
            if (next.isIntersecting && !acc?.isIntersecting) {
              return next;
            } else if (next.isIntersecting /* && acc && acc.isIntersecting */) {
              return next.boundingClientRect.top < acc.boundingClientRect.top ? next : acc;
            } else /* if (!next.isIntersecting) */ {
              return acc;
            };
          }, null);
        if (relevantEntry?.isIntersecting) {
          this.setCurrentHeading(relevantEntry);
        } else if (incumbentEntry && incumbentEntry.boundingClientRect.top > 0) {
          // not intersecting, but positive: below the viewport
          this.setCurrentHeading(this.currentHeading.preceding);
        }; // otherwise, current heading does not change.
      }
      let headingObserverOptions = {
        threshold: 1.0,
        rootMargin: "0px 0px 0px 25%",
      };
      let headingObserver = new IntersectionObserver(headingObserverCallback, headingObserverOptions);
      for (let heading of headings) {
        headingObserver.observe(heading);
      }
    }
  }

  setCurrentHeading(newHeadingEntry) {
    if (this.currentHeading) removeAriaCurrent(this.currentHeading.link);
    let newCurrentHeading = newHeadingEntry && this.knownHeadings.get(newHeadingEntry.target);
    if (newCurrentHeading) { setAriaCurrent(newCurrentHeading.link) };
    this.currentHeading = newCurrentHeading;

  }

}
