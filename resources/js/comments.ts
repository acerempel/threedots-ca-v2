const load_comments = async (comments_list: HTMLElement) => {
  const url = `https://comments.threedots.ca/comments?page_url=${window.location.pathname}`
    try {
    const response = await fetch(url, {
      headers: {'Accept': 'application/json'},
    })
    const data = await response.json()
    display_comments(comments_list, data)
  } catch (err) {
    console.error(`Fetching comments failed: ${err}`)
    comments_list.innerHTML = `<p>There was a problem fetching comments!</p>`
  }
}

interface Comment {
  author: String,
  date: String,
  content: String,
}

const display_comments = (comments_list: HTMLElement, data: Comment[]) => {
  if (data.length === 0) {
    comments_list.innerHTML = "<p>No comments yet!</p>"
  } else {
    const template = document.getElementById('comment-template')! as HTMLTemplateElement
    const fragment = document.createDocumentFragment()
    for (const comment of data) {
      const container = document.createElement('div')
      container.innerHTML = `
      <span slot="author">${comment.author}</span>
      <span slot="date">${comment.date}</span>
      ${comment.content}
      `
      const shadow = container.attachShadow({ mode: 'open' })
      shadow.appendChild(template.content.cloneNode(true))
      fragment.appendChild(container)
    }
    comments_list.appendChild(fragment)
  }
  comments_list.appendChild((document.getElementById('comment-form-template') as HTMLTemplateElement).content)
}

const observer_callback = (list: HTMLElement): IntersectionObserverCallback => {
  return (entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        load_comments(list)
        observer.unobserve(entry.target)
      }
    }
  }
}

let observer: IntersectionObserver | null;

export const enable_comments = () => {
  const section = document.getElementById('comments-section')
  if (!section) { return }
  const comments_list = document.getElementById('comments-list')
  const comments_heading = document.getElementById('comments-section-heading')
  if (! comments_list || ! comments_heading) { throw new Error("no comments list or heading!") }
  section.hidden = false
  observer = observer || new IntersectionObserver(observer_callback(comments_list), { threshold: 1 })
  observer.observe(comments_heading)
}

export const disable_comments = () => {
  const section = document.getElementById('comments-section')
  if (!section) { return }
  section.hidden = true
  if (observer) { observer.disconnect() }
}
