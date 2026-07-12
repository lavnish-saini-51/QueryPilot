/**
 * Streams a natural language query response via SSE using fetch + ReadableStream.
 * onEvent is called for each parsed event: { type, message|content }
 */
export const streamQuery = async ({ connectionId, question }, onEvent) => {
  const token = localStorage.getItem('token')
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const response = await fetch(`${baseURL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ connectionId, question }),
  })

  if (!response.ok || !response.body) {
    const errData = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(errData.message || 'Request failed')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n\n')
    buffer = lines.pop()

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const parsed = JSON.parse(line.slice(6))
          onEvent(parsed)
        } catch (e) {
          console.error('Failed to parse SSE chunk', e)
        }
      }
    }
  }
}