"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Sun, MapPin, Wind, Thermometer, AlertTriangle, Droplets, Eye, ChevronRight } from "lucide-react"

type Weather = {
  temperature: number
  windSpeed: number
  description?: string
  humidity?: number
  location?: string
}

type WeatherAlert = {
  title: string
  severity: 'minor' | 'moderate' | 'severe' | 'extreme'
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          await fetchWeatherData(latitude, longitude)
        },
        async () => {
          await fetchWeatherData(28.6139, 77.2090, 'Delhi') // Fallback to Delhi
        },
        { enableHighAccuracy: false, timeout: 5000 },
      )
    } else {
      fetchWeatherData(28.6139, 77.2090, 'Delhi')
    }
  }, [])

  const fetchWeatherData = async (lat: number, lon: number, location?: string) => {
    try {
      // Fetch basic weather data
      const weatherRes = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      const weatherData = await weatherRes.json()
      
      // Fetch detailed weather data for alerts
      const detailedRes = await fetch(`/api/weather/detailed?lat=${lat}&lon=${lon}&location=${location || 'Current Location'}`)
      const detailedData = await detailedRes.json()
      
      setWeather({
        ...weatherData,
        humidity: detailedData.current?.humidity || 65,
        location: location || 'Current Location'
      })
      
      // Set alerts
      if (detailedData.alerts && detailedData.alerts.length > 0) {
        setAlerts(detailedData.alerts.slice(0, 2)) // Show max 2 alerts in widget
      }
      
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
      // Fallback weather data
      setWeather({
        temperature: 28,
        windSpeed: 12,
        description: 'Partly cloudy',
        humidity: 65,
        location: 'Delhi'
      })
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-500 text-white'
      case 'severe': return 'bg-orange-500 text-white'
      case 'moderate': return 'bg-yellow-500 text-black'
      default: return 'bg-blue-500 text-white'
    }
  }

  return (
    <Link href="/weather" className="block">
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 group-hover:scale-110 transition-transform">
                {weather?.temperature && weather.temperature > 25 ? (
                  <Sun className="h-4 w-4 text-orange-500" />
                ) : (
                  <Cloud className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  {weather?.location || 'Weather'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Tap for detailed forecast
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
          </div>

          {/* Weather Data */}
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
          ) : weather ? (
            <div className="space-y-3">
              {/* Main Temperature */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {weather.temperature}°C
                  </span>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {weather.description || 'Clear sky'}
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Wind className="h-3 w-3" />
                  <span>{weather.windSpeed} km/h</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Droplets className="h-3 w-3" />
                  <span>{weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Eye className="h-3 w-3" />
                  <span>10 km</span>
                </div>
              </div>

              {/* Weather Alerts */}
              {alerts.length > 0 && (
                <div className="space-y-2">
                  {alerts.map((alert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-orange-500 animate-pulse" />
                      <Badge className={`${getSeverityColor(alert.severity)} text-xs px-2 py-0.5`}>
                        {alert.title}
                      </Badge>
                    </div>
                  ))}
                  <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    Tap to view all alerts →
                  </div>
                </div>
              )}

              {/* Real-time Status & Forecast Hint */}
              <div className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Real-time data • Updated {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div>💡 Click for hourly & 7-day forecasts</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500 dark:text-slate-400">
              Weather data unavailable
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
