// Server-Sent Events for breaking updates.
import "server-only"

export const runtime = "nodejs"

async function getBreakingSample(params: URLSearchParams) {
  // Call our own API to reuse logic; in production you'd refactor shared logic.
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/news?${params.toString()}`
  try {
    const r = await fetch(url, { cache: "no-store" })
    const data = await r.json()
    const breaking = (data?.articles || []).filter((a: any) => a.isBreaking)
    if (breaking.length > 0) {
      return breaking[Math.floor(Math.random() * breaking.length)]
    }
  } catch {}
  return null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      // Heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "heartbeat", ts: Date.now() })}\n\n`))
      }, 15000)

      // Periodically check for breaking news and emit
      const interval = setInterval(async () => {
        const sample = await getBreakingSample(searchParams)
        if (sample) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "breaking", article: sample })}\n\n`))
        }
      }, 30000)

      // Send one initial ping
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "ready" })}\n\n`))

      // Close after 5 minutes to avoid hanging
      const timeout = setTimeout(
        () => {
          clearInterval(interval)
          clearInterval(heartbeat)
          controller.close()
        },
        5 * 60 * 1000,
      )

      // Clean up if client disconnects
      // @ts-ignore
      req.signal?.addEventListener("abort", () => {
        clearTimeout(timeout)
        clearInterval(interval)
        clearInterval(heartbeat)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
