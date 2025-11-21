import { NextRequest } from 'next/server'

// Enhanced weather data interface
interface WeatherData {
  current: {
    temperature: number
    feels_like: number
    humidity: number
    pressure: number
    visibility: number
    uv_index: number
    wind_speed: number
    wind_direction: number
    weather_code: number
    description: string
    icon: string
  }
  hourly: Array<{
    time: string
    temperature: number
    precipitation_probability: number
    weather_code: number
    description: string
    icon: string
  }>
  daily: Array<{
    date: string
    temperature_max: number
    temperature_min: number
    precipitation_probability: number
    weather_code: number
    description: string
    icon: string
    sunrise: string
    sunset: string
  }>
  alerts: Array<{
    id: string
    title: string
    description: string
    severity: 'minor' | 'moderate' | 'severe' | 'extreme'
    start: string
    end: string
    areas: string[]
  }>
  location: {
    name: string
    country: string
    latitude: number
    longitude: number
    timezone: string
  }
}

// Calculate UV index based on time of day and latitude
function calculateUVIndex(isDay: boolean, latitude: number): number {
  if (!isDay) return 0 // No UV at night
  
  // Simple UV calculation based on latitude and assuming midday
  const latitudeFactor = Math.cos((latitude * Math.PI) / 180)
  const baseUV = 8 * latitudeFactor // Max UV around 8 for most locations
  
  // Add some variation based on current time (simplified)
  const hour = new Date().getHours()
  let timeFactor = 1
  
  if (hour >= 10 && hour <= 14) {
    timeFactor = 1 // Peak UV hours
  } else if (hour >= 8 && hour <= 16) {
    timeFactor = 0.7 // Moderate UV hours
  } else {
    timeFactor = 0.3 // Low UV hours
  }
  
  return Math.max(1, Math.round(baseUV * timeFactor))
}

// Weather code to description mapping
const weatherDescriptions: { [key: number]: { description: string; icon: string } } = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '⛈️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  80: { description: 'Rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' }
}

// Generate real-time alerts based on actual weather conditions
function generateAlerts(weatherCode: number, location: string, temperature: number, windSpeed: number): WeatherData['alerts'] {
  const alerts: WeatherData['alerts'] = []
  
  // Rain alerts
  if (weatherCode >= 61 && weatherCode <= 65) {
    alerts.push({
      id: 'rain-alert-1',
      title: 'Heavy Rain Warning',
      description: `Heavy rainfall expected in ${location}. Expect 25-50mm of rain in the next 6 hours. Avoid low-lying areas and drive carefully.`,
      severity: weatherCode >= 63 ? 'severe' : 'moderate',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      areas: [location, 'Surrounding areas']
    })
  }
  
  // Thunderstorm alerts
  if (weatherCode >= 95) {
    alerts.push({
      id: 'thunder-alert-1',
      title: 'Severe Thunderstorm Warning',
      description: `Severe thunderstorms with heavy rain and strong winds expected in ${location}. Stay indoors and avoid outdoor activities.`,
      severity: 'severe',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      areas: [location, 'Metropolitan area']
    })
  }
  
  // Heat wave alert based on actual temperature
  if (temperature > 35) {
    alerts.push({
      id: 'heat-alert-1',
      title: 'Heat Wave Advisory',
      description: `High temperatures of ${temperature}°C recorded in ${location}. Stay hydrated, avoid prolonged sun exposure, and seek air-conditioned spaces.`,
      severity: temperature > 40 ? 'severe' : 'moderate',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      areas: [location, 'Surrounding areas']
    })
  }
  
  // High wind alert
  if (windSpeed > 25) {
    alerts.push({
      id: 'wind-alert-1',
      title: 'High Wind Warning',
      description: `Strong winds of ${windSpeed} km/h recorded in ${location}. Secure loose objects and avoid outdoor activities.`,
      severity: windSpeed > 40 ? 'severe' : 'moderate',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      areas: [location, 'Metropolitan area']
    })
  }
  
  return alerts
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat') || '28.6139' // Default to Delhi
    const lon = searchParams.get('lon') || '77.2090'
    
    // Fetch weather data from Open-Meteo API (free, no API key required)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,pressure_msl,surface_pressure,cloud_cover,visibility,evapotranspiration,et0_fao_evapotranspiration,vapour_pressure_deficit,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_1cm,soil_moisture_1_3cm,soil_moisture_3_9cm,soil_moisture_9_27cm,soil_moisture_27_81cm&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&timezone=Asia%2FKolkata`
    
    const response = await fetch(weatherUrl)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data')
    }
    
    // Get actual location name using reverse geocoding
    let locationName = searchParams.get('location') || 'Current Location'
    
    // If no location name provided, try to get it from coordinates
    if (!searchParams.get('location') || searchParams.get('location') === 'Current Location') {
      try {
        const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        const geoData = await geoResponse.json()
        if (geoData.city || geoData.locality) {
          locationName = geoData.city || geoData.locality
          if (geoData.principalSubdivision) {
            locationName += `, ${geoData.principalSubdivision}`
          }
        }
      } catch (error) {
        console.log('Reverse geocoding failed, using fallback location name')
        locationName = 'Current Location'
      }
    }
    
    // Process current weather
    const current = data.current
    const currentWeather = weatherDescriptions[current.weather_code] || weatherDescriptions[0]
    
    // Process hourly forecast (next 24 hours)
    const hourly = data.hourly.time.slice(0, 24).map((time: string, index: number) => {
      const weatherCode = data.hourly.weather_code[index]
      const weather = weatherDescriptions[weatherCode] || weatherDescriptions[0]
      
      return {
        time,
        temperature: Math.round(data.hourly.temperature_2m[index]),
        precipitation_probability: data.hourly.precipitation_probability[index] || 0,
        weather_code: weatherCode,
        description: weather.description,
        icon: weather.icon
      }
    })
    
    // Process daily forecast (next 7 days)
    const daily = data.daily.time.map((date: string, index: number) => {
      const weatherCode = data.daily.weather_code[index]
      const weather = weatherDescriptions[weatherCode] || weatherDescriptions[0]
      
      return {
        date,
        temperature_max: Math.round(data.daily.temperature_2m_max[index]),
        temperature_min: Math.round(data.daily.temperature_2m_min[index]),
        precipitation_probability: data.daily.precipitation_probability_max[index] || 0,
        weather_code: weatherCode,
        description: weather.description,
        icon: weather.icon,
        sunrise: data.daily.sunrise[index],
        sunset: data.daily.sunset[index]
      }
    })
    
    // Generate alerts based on current conditions
    const alerts = generateAlerts(
      current.weather_code, 
      locationName, 
      Math.round(current.temperature_2m), 
      Math.round(current.wind_speed_10m)
    )
    
    const weatherData: WeatherData = {
      current: {
        temperature: Math.round(current.temperature_2m),
        feels_like: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        pressure: Math.round(current.pressure_msl),
        visibility: Math.round((data.hourly.visibility?.[0] || 10000) / 1000), // Convert meters to km
        uv_index: Math.round(data.daily.uv_index_max?.[0] || calculateUVIndex(current.is_day, parseFloat(lat))),
        wind_speed: Math.round(current.wind_speed_10m),
        wind_direction: current.wind_direction_10m,
        weather_code: current.weather_code,
        description: currentWeather.description,
        icon: currentWeather.icon
      },
      hourly,
      daily,
      alerts,
      location: {
        name: locationName,
        country: 'India',
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        timezone: 'Asia/Kolkata'
      }
    }
    
    return Response.json(weatherData)
  } catch (error) {
    console.error('Weather API error:', error)
    return Response.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}
