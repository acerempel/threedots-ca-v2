import type {Handler} from '@netlify/functions'
import {fetch} from 'undici'

interface FormSubmission {
  payload: {
    data: {
      author: string,
      content: string,
      content_type: "html" | "plain",
      page_url: string,
    }
  }
  site: Object
}

export const handler: Handler = async (event, _context) => {
  const submission: FormSubmission = JSON.parse(event.body)
  console.log(submission)
  const data = submission.payload.data
  try {
    const response = await fetch("https://comments.threedots.ca/comments", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://www.threedots.ca',
      },
      body: JSON.stringify(data),
    })
    console.log(response)
    return {
      statusCode: response.status,
      body: await response.text(),
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      body: err.toString(),
    }
  }
}
