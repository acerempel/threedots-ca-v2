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
    <Switch fallback={<CommentsRegion comments={data()} />}>
      <Match when={data.loading}>
        <p>Loading comments …</p>
      </Match>
      <Match when={data.error}>
        <p>There was a problem loading comments!</p>
      </Match>
    </Switch>
  )
}

const CommentsRegion = (props: {comments?: Comment[]}) => {
  const url = location.pathname
  return <>
    <h2 id="comments-section-heading" class="semibold font-size-3">Comments</h2>
    <div class="space-y-1/2">
      <CommentList comments={props.comments} />
    </div>
    <form class="flex column mt-1" name="comment" method="post" action={url}>
      <label class="font-size-1 mt-1/2" for="comment_author">Name</label>
      <input
        type="text" name="name" autocomplete="name"
        id="comment_author" class="border bw-1px bp-1/4 rounded-sm control-outline"
       />
      <input type="hidden" name="content_type" value="plain" />
      <input type="hidden" name="page_url" value={url} />
      <label class="font-size-1 mt-1/2" for="comment_content">Comment</label>
      <textarea class="border bw-1px bp-1/4 rounded-sm control-outline" id="comment_content" name="content"></textarea>
      <button class="unstyled w-max mt-1/2 control-outline border bw-1px bp-1/4 pr-1/2 pl-1/2 rounded-md font-size-1 semibold" type="submit">
        <span>Submit</span>
      </button>
    </form>
  </>
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
