import type {Handler} from '@netlify/functions'
import {request} from 'undici'

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
    const response = await request("https://comments.threedots.ca/comments", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    console.log(response)
    const headers = {}
    for (const [name, value] of Object.entries(response.headers)) {
      if (typeof value === 'string') {
        headers[name] = value
      }
    }
    return {
      statusCode: response.statusCode,
      body: await response.body.text(),
      headers,
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      body: err.toString(),
    }
  }
}
