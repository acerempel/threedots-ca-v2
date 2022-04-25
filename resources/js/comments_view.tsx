import {batch, createEffect, createResource, createSignal, For, Match, onMount, Show, Switch} from "solid-js"
import { render } from 'solid-js/web'

export function display_comments(root: HTMLElement) {
  render(Comments, root)
}

const Comments = () => {
  const [data, { refetch }] = createResource(fetch_comments)
  createEffect(() => {
    let error = data.error
    if (error) { console.error(error) }
  })
  return (
    <Switch fallback={<CommentsRegion comments={data()} refetch={refetch as () => Promise<Comment[]>} />}>
      <Match when={data.loading}>
        <p>Loading comments …</p>
      </Match>
      <Match when={data.error}>
        <p>There was a problem loading comments!</p>
      </Match>
    </Switch>
  )
}

const CommentsRegion = (props: {comments?: Comment[], refetch: () => Promise<Comment[]>}) => {
  return <>
    <CommentList comments={props.comments} />
    <CommentForm refetch={props.refetch} />
  </>
}

const CommentList = (props: {comments?: Comment[]}) => {
  const formatter = new Intl.DateTimeFormat([], { dateStyle: 'long' })
  return (
    <div class="space-y-1/2">
      <For each={props.comments} fallback={<p>No comments yet!</p>}>
        {(comment) =>
          <article>
            <header>{comment.author} | <time datetime={comment.date}>{formatter.format(Date.parse(comment.date))}</time></header>
            <div innerHTML={comment.content}></div>
          </article>
        }
      </For>
    </div>
  )
}

enum Status {
  NotSent, Waiting, Failure, Success
}

const CommentForm = (props: {refetch: () => Promise<Comment[]>}) => {
  const url = location.pathname
  const { refetch } = props

  const [submission, setSubmissionStatus] = createSignal<Status>(Status.NotSent)
  const [author, setAuthor] = createSignal('')
  const authorKey = 'comment-author'

  onMount(() => {
    const prevAuthor = localStorage.getItem(authorKey)
    prevAuthor && setAuthor(prevAuthor)
  })

  createEffect(() => {
    localStorage.setItem(authorKey, author())
  })

  const submitHandler = (event: SubmitEvent) => {
    event.preventDefault()
    if (submission() === Status.Waiting) { return }
    const form = event.target as HTMLFormElement
    const data = new FormData(form)
    const body = new URLSearchParams(data as any).toString()
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }).then((response) => {
      if (response.ok) {
        (form.elements.namedItem('content')! as HTMLTextAreaElement).value = ''
        batch(() => {
          setAuthor((data.get('name') ?? '') as string)
          setSubmissionStatus(Status.Success)
        })
        refetch()
      } else {
        setSubmissionStatus(Status.Failure)
      }
    }).catch((reason) => {
      console.error(reason)
      setSubmissionStatus(Status.Failure)
    })
  }

  return (
    <form class="flex column mt-1/2" name="comment" method="post" onSubmit={submitHandler}>
      <Switch>
        <Match when={submission() === Status.Failure}>
          <p class="mt-1/2">Your comment encountered an obstacle on its way to being submitted!</p>
        </Match>
        <Match when={submission() === Status.Success}>
          <p class="mt-1/2">Your comment was submitted!</p>
        </Match>
      </Switch>
      <input type="hidden" name="form-name" value="comment" />
      <label class="font-size-1 mt-1/2" for="comment_author">Name</label>
      <input
        type="text" name="name" autocomplete="name"
        id="comment_author" class="mt-1/4 border bw-1px bp-1/4 rounded-sm control-outline"
        value={author()}
       />
      <input type="hidden" name="content_type" value="plain" />
      <input type="hidden" name="page_url" value={url} />
      <label class="font-size-1 mt-1/2" for="comment_content">Comment</label>
      <textarea class="mt-1/4 border bw-1px bp-1/4 rounded-sm control-outline" id="comment_content" name="content"></textarea>
      <button
        class="unstyled w-max mt-1/2 control-outline border bw-1px bp-1/4 pr-1/2 pl-1/2 rounded-md font-size-1 semibold"
        type="submit"
        disabled={submission() === Status.Waiting}
      >
        <span>Submit</span>
      </button>
    </form>
  )
}

const commentsHost = "https://comments.threedots.ca"

const fetch_comments = async (): Promise<Comment[]> => {
  const url = `${commentsHost}/comments?page_url=${window.location.pathname}`
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
