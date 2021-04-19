import type { HeadingId } from './heading';

export const headingObserverCallback =
  ( setCurrentHeading: (id: HeadingId) => void,
    currentHeading: () => HeadingId,
    setPrecedingHeading: () => void,
  ) => (entries: Array<IntersectionObserverEntry>, _observer: IntersectionObserver) => {

  let incumbentEntry: IntersectionObserverEntry | null = null;
  /* relevantEntry is, if at least one entry is intersecting, the
     intersecting entry closest to the top of the viewport, otherwise the
     entry closest to the top of the viewport. */
  let lookingForIncumbent = true;

  const reducer = (acc : IntersectionObserverEntry | null, next: IntersectionObserverEntry, _index: number, _array: Array<IntersectionObserverEntry>) => {
    if (lookingForIncumbent && next.target.id === currentHeading()) {
      incumbentEntry = next;
      lookingForIncumbent = false;
    }
    if (next.isIntersecting && !acc?.isIntersecting) {
      return next;
    } else if (next.isIntersecting /* && acc && acc.isIntersecting */) {
      return next.boundingClientRect.top < acc!.boundingClientRect.top ? next : acc;
    } else /* if (!next.isIntersecting) */ {
      return acc;
    };
  }

  let relevantEntry = entries.reduce(reducer, null);
  if (relevantEntry?.isIntersecting) {
    setCurrentHeading(relevantEntry.target.id);
  } else if (incumbentEntry && (incumbentEntry as IntersectionObserverEntry).boundingClientRect.top > 0) {
    // not intersecting, but positive: below the viewport
    setPrecedingHeading();
  }; // otherwise, current heading does not change.
}

export const headingObserverOptions = {
  threshold: 1.0,
  rootMargin: "0px 0px -25% 0px",
};
