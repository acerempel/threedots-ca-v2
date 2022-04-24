import {createEffect, createResource, For, Match, Switch} from "solid-js"
import { render } from 'solid-js/web'

export function display_comments(root: HTMLElement) {
  render(Comments, root)
}

const Comments = () => {
  const [data, _] = createResource(fetch_comments)
  createEffect(() => {
    let error = data.error
    if (error) { console.error(error) }
  })
  return (
    <Switch fallback={<CommentList comments={data()} />}>
      <Match when={data.loading}>
        <p>Loading comments …</p>
      </Match>
      <Match when={data.error}>
        <p>There was a problem loading comments!</p>
      </Match>
    </Switch>
  )
}

const CommentList = (props: {comments?: Comment[]}) => {
  const formatter = new Intl.DateTimeFormat([], { dateStyle: 'long' })
  return (
    <For each={props.comments} fallback={<p>No comments yet!</p>}>
      {(comment) =>
        <article>
          <header>{comment.author} | <time datetime={comment.date}>{formatter.format(Date.parse(comment.date))}</time></header>
          <div innerHTML={comment.content}></div>
        </article>
      }
    </For>
  )
}

const fetch_comments = async (): Promise<Comment[]> => {
  const url = `https://comments.threedots.ca/comments?page_url=${window.location.pathname}`
  const response = await fetch(url, {
    headers: {'Accept': 'application/json'},
  })
  return await response.json()
}

export interface Comment {
  author: string,
  date: string,
  content: string,
}
