const observer_callback = (list: HTMLElement): IntersectionObserverCallback => {
  return async (entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        (await import('./comments_view')).display_comments(list)
        observer.unobserve(entry.target)
      }
    }
  }
}

let observer: IntersectionObserver | null;

export const enable_comments = () => {
  const section = document.getElementById('comments-section')
  if (! section) { return }
  section.hidden = false
  const comments_region = document.getElementById('comments-region')
  const comments_heading = document.getElementById('comments-section-heading')
  if (! comments_region || ! comments_heading) { throw new Error("no comments region or heading!") }
  observer = observer || new IntersectionObserver(observer_callback(comments_region), { threshold: 1 })
  observer.observe(comments_heading)
}

export const disable_comments = () => {
  const section = document.getElementById('comments-section')
  if (! section) {
    console.warn("Disabling comments, but none on this page!")
    return
  }
  section.hidden = true
  if (observer) { observer.disconnect() }
}
