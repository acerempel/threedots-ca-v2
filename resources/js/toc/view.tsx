import { createSignal, For, onMount } from 'solid-js';

import { headingObserverCallback, headingObserverOptions } from './observer';
import { Heading, HeadingId } from './heading';

export const TOC = (props: { forElem: Element }) => {
  const headings = collectHeadings(props.forElem);

  const [currentHeading, setCurrentHeading] = createSignal<HeadingId>(null);

  const setPrecedingHeading = () => {
    const curHead = headings.find(heading => heading.id === currentHeading());
    const prevHead =
      curHead && curHead.index > 0
      ? headings[curHead.index - 1].id
      : null;
    setCurrentHeading(prevHead);
  }

  onMount(() => {
    if ('IntersectionObserver' in window) {
      let headingObserver = new IntersectionObserver(
        headingObserverCallback(setCurrentHeading, currentHeading, setPrecedingHeading),
        headingObserverOptions);
      for (let heading of headings) {
        headingObserver.observe(heading.target);
      }
    }
  });

  const isAriaCurrent = (heading: Heading) => heading.id === currentHeading() ? "true" : "false";

  return <ol class="list-none space-y-1/4">
    <For each={headings}>
      {(heading) => <li>
        <a href={'#' + heading.id} aria-current={isAriaCurrent(heading)}>{heading.text}</a>
      </li>}
    </For>
  </ol>;
}

function collectHeadings(fromElem: Element): Heading[] {
  const headingElems: NodeListOf<Element> = fromElem.querySelectorAll('h2');
  const headings: Heading[] = Array(headingElems.length);
  let index = 0;

  for (let headingElem of headingElems) {
    if (!headingElem.id) continue;
    const heading: Heading = {
      id: headingElem.id,
      text: headingElem.textContent!,
      target: headingElem,
      index,
    }
    headings[index] = heading;
    index += 1;
  }

  return headings;
}
