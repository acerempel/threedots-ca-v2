import type {Handler} from '@netlify/functions'
import {request} from 'undici'

interface FormSubmission {
  payload: {
    data: {
      name: string,
      author?: string,
      content: string,
      content_type: "html" | "plain",
      page_url: string,
    }
  }
  site: Object
}

export const handler: Handler = async (event, _context) => {
  const submission: FormSubmission = JSON.parse(event.body)
  console.log(submission.payload)
  const data = submission.payload.data
  data.author = data.name
  try {
    const response = await request("https://comments.threedots.ca/comments", {
      method: "POST",
      headers: {
        'Origin': 'https://www.threedots.ca',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const statusCode = response.statusCode
    const body = await response.body.text()
    console.log({
      statusCode,
      headers: response.headers,
      body,
    })
    const headers = {}
    for (const [name, value] of Object.entries(response.headers)) {
      if (typeof value === 'string') {
        headers[name] = value
      }
    }
    return { statusCode, body, headers, }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      body: err.toString(),
    }
  }
}
