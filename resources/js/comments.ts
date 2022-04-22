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
  if (!section) {
    console.log("No comments on this page!")
    return
  }
  const comments_list = document.getElementById('comments-list')
  const comments_heading = document.getElementById('comments-section-heading')
  if (! comments_list || ! comments_heading) { throw new Error("no comments list or heading!") }
  section.hidden = false
  observer = observer || new IntersectionObserver(observer_callback(comments_list), { threshold: 1 })
  observer.observe(comments_heading)
}

export const disable_comments = () => {
  const section = document.getElementById('comments-section')
  if (!section) {
    console.log("Disabling, comments, but none on this page!")
    return
  }
  section.hidden = true
  if (observer) { observer.disconnect() }
}
