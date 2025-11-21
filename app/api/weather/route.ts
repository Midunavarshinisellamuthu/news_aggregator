import "server-only"

// Uses Open-Meteo (no API key) as a dynamic weather endpoint.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "28.6139") // Delhi default
  const lon = Number.parseFloat(searchParams.get("lon") || "77.2090")

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&windspeed_unit=kmh`
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    const data = await res.json()
    const current = data.current_weather
    return Response.json({
      temperature: current?.temperature ?? null,
      windSpeed: current?.windspeed ?? null,
    })
  } catch (e) {
    return Response.json({ temperature: null, windSpeed: null }, { status: 200 })
  }
}
