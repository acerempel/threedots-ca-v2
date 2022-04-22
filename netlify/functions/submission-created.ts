import type {Handler} from '@netlify/functions'

interface FormSubmission {
  payload: {
    author: string,
    content: string,
    content_type: "html" | "plain",
    page_url: string,
  }
  site: Object
}

export const handler: Handler = async (event, _context) => {
  const submission: FormSubmission = JSON.parse(event.body)
  const payload = submission.payload
  try {
    const response = await fetch("https://comments.threedots.ca/comments", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://www.threedots.ca',
      },
      body: JSON.stringify(payload),
    })
    return {
      statusCode: response.status,
      body: await response.text(),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString(),
    }
  }
}