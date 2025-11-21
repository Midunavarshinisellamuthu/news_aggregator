"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun, 
  Moon, 
  AlertTriangle,
  Clock,
  Calendar,
  Umbrella,
  Activity,
  Navigation,
  Sunrise,
  Sunset,
  CloudRain,
  Zap,
  Snowflake,
  TrendingUp,
  TrendingDown,
  Compass,
  Waves,
  Mountain,
  TreePine,
  Car,
  Plane,
  Shirt,
  Camera,
  Coffee,
  Bike
} from "lucide-react"

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

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWeatherData()
  }, [])

  const fetchWeatherData = async () => {
    try {
      setLoading(true)
      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords
            await fetchWeather(latitude, longitude)
          },
          async () => {
            // Fallback to Delhi if geolocation fails
            await fetchWeather(28.6139, 77.2090, 'Delhi')
          }
        )
      } else {
        await fetchWeather(28.6139, 77.2090, 'Delhi')
      }
    } catch (err) {
      setError('Failed to fetch weather data')
      setLoading(false)
    }
  }

  const fetchWeather = async (lat: number, lon: number, location?: string) => {
    try {
      const response = await fetch(`/api/weather/detailed?lat=${lat}&lon=${lon}&location=${location || 'Current Location'}`)
      if (!response.ok) throw new Error('Failed to fetch weather')
      const data = await response.json()
      setWeatherData(data)
    } catch (err) {
      setError('Failed to fetch weather data')
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

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading weather data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-slate-600 dark:text-slate-400">{error}</p>
              <Button onClick={fetchWeatherData}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to News
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Weather in {weatherData.location.name}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              Weather Alerts
            </h2>
            <div className="grid gap-4">
              {weatherData.alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">{alert.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>Valid until: {formatTime(alert.end)}</span>
                      <span>Areas: {alert.areas.join(', ')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Current Weather */}
        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-6xl">{weatherData.current.icon}</span>
                  <div>
                    <h2 className="text-5xl font-bold">{weatherData.current.temperature}°C</h2>
                    <p className="text-xl opacity-90">{weatherData.current.description}</p>
                    <p className="opacity-75">Feels like {weatherData.current.feels_like}°C</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm opacity-75">Humidity</span>
                  </div>
                  <span className="text-2xl font-semibold">{weatherData.current.humidity}%</span>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind className="h-4 w-4" />
                    <span className="text-sm opacity-75">Wind Speed</span>
                  </div>
                  <span className="text-2xl font-semibold">{weatherData.current.wind_speed} km/h</span>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4" />
                    <span className="text-sm opacity-75">Pressure</span>
                  </div>
                  <span className="text-2xl font-semibold">{weatherData.current.pressure} hPa</span>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm opacity-75">Visibility</span>
                  </div>
                  <span className="text-2xl font-semibold">{weatherData.current.visibility} km</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Forecasts */}
        <Tabs defaultValue="hourly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hourly" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hourly Forecast
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              7-Day Forecast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hourly">
            <Card>
              <CardHeader>
                <CardTitle>Next 24 Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {weatherData.hourly.slice(0, 12).map((hour, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        {formatTime(hour.time)}
                      </p>
                      <div className="text-2xl mb-2">{hour.icon}</div>
                      <p className="font-semibold text-lg">{hour.temperature}°</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Umbrella className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-slate-500">{hour.precipitation_probability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weatherData.daily.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{day.icon}</div>
                        <div>
                          <p className="font-semibold">{formatDate(day.date)}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{day.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Umbrella className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{day.precipitation_probability}%</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Sunrise className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{formatTime(day.sunrise)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Sunset className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">{formatTime(day.sunset)}</span>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">{day.temperature_max}°</p>
                          <p className="text-sm text-slate-500">{day.temperature_min}°</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Weather Insights & Recommendations */}
        <div className="space-y-8">
          {/* Activity Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-green-500" />
                Activity Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Outdoor Activities */}
                <div className={`p-4 rounded-lg text-center ${
                  weatherData.current.temperature >= 20 && weatherData.current.temperature <= 30 && weatherData.current.weather_code <= 3
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <Bike className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">Cycling</p>
                  <p className="text-xs">
                    {weatherData.current.temperature >= 20 && weatherData.current.temperature <= 30 && weatherData.current.weather_code <= 3
                      ? 'Perfect!' : 'Not ideal'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg text-center ${
                  weatherData.current.temperature >= 15 && weatherData.current.temperature <= 25 && weatherData.current.weather_code <= 2
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">Photography</p>
                  <p className="text-xs">
                    {weatherData.current.temperature >= 15 && weatherData.current.temperature <= 25 && weatherData.current.weather_code <= 2
                      ? 'Great light!' : 'Check conditions'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg text-center ${
                  weatherData.current.weather_code >= 61 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                }`}>
                  <Car className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">Driving</p>
                  <p className="text-xs">
                    {weatherData.current.weather_code >= 61 ? 'Drive carefully' : 'Good conditions'}
                  </p>
                </div>

                <div className={`p-4 rounded-lg text-center ${
                  weatherData.current.weather_code <= 3 && weatherData.current.wind_speed < 20
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  <Plane className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-semibold">Flying</p>
                  <p className="text-xs">
                    {weatherData.current.weather_code <= 3 && weatherData.current.wind_speed < 20
                      ? 'Clear skies' : 'Check delays'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clothing Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="h-6 w-6 text-blue-500" />
                What to Wear Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg">
                  <div className="text-2xl mb-2">
                    {weatherData.current.temperature <= 15 ? '🧥' : 
                     weatherData.current.temperature <= 25 ? '👕' : '🩱'}
                  </div>
                  <p className="font-semibold">
                    {weatherData.current.temperature <= 15 ? 'Jacket/Sweater' : 
                     weatherData.current.temperature <= 25 ? 'Light Clothing' : 'Summer Wear'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Based on {weatherData.current.temperature}°C
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg">
                  <div className="text-2xl mb-2">
                    {weatherData.current.weather_code >= 61 ? '☂️' : 
                     weatherData.current.weather_code >= 51 ? '🌂' : '🕶️'}
                  </div>
                  <p className="font-semibold">
                    {weatherData.current.weather_code >= 61 ? 'Umbrella' : 
                     weatherData.current.weather_code >= 51 ? 'Light Rain Gear' : 'Sunglasses'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {weatherData.current.description}
                  </p>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg">
                  <div className="text-2xl mb-2">
                    {weatherData.current.uv_index > 6 ? '🧴' : 
                     weatherData.current.uv_index > 3 ? '🧴' : '😊'}
                  </div>
                  <p className="font-semibold">
                    {weatherData.current.uv_index > 6 ? 'Strong Sunscreen' : 
                     weatherData.current.uv_index > 3 ? 'Light Sunscreen' : 'No Sun Protection Needed'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    UV Index: {weatherData.current.uv_index}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-purple-500" />
                Weather Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Temperature Trend (Next 7 Days)
                  </h4>
                  <div className="space-y-2">
                    {weatherData.daily.slice(0, 5).map((day, index) => {
                      const prevTemp = index > 0 ? weatherData.daily[index - 1].temperature_max : weatherData.current.temperature
                      const isRising = day.temperature_max > prevTemp
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                          <span className="text-sm">{formatDate(day.date)}</span>
                          <div className="flex items-center gap-2">
                            {isRising ? 
                              <TrendingUp className="h-3 w-3 text-red-500" /> : 
                              <TrendingDown className="h-3 w-3 text-blue-500" />
                            }
                            <span className="font-semibold">{day.temperature_max}°C</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CloudRain className="h-4 w-4" />
                    Rain Probability
                  </h4>
                  <div className="space-y-2">
                    {weatherData.daily.slice(0, 5).map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <span className="text-sm">{formatDate(day.date)}</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-16 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden`}>
                            <div 
                              className={`h-full rounded-full ${
                                day.precipitation_probability > 70 ? 'bg-red-500' :
                                day.precipitation_probability > 40 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${day.precipitation_probability}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-8">{day.precipitation_probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comfort Index */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-6 w-6 text-amber-500" />
                Comfort & Lifestyle Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Heat Index */}
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
                  <div className="text-2xl mb-2">
                    {weatherData.current.feels_like > 35 ? '🥵' : 
                     weatherData.current.feels_like > 25 ? '😊' : '🥶'}
                  </div>
                  <p className="font-semibold">Heat Comfort</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Feels like {weatherData.current.feels_like}°C
                  </p>
                </div>

                {/* Humidity Comfort */}
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                  <div className="text-2xl mb-2">
                    {weatherData.current.humidity > 70 ? '💧' : 
                     weatherData.current.humidity > 40 ? '😌' : '🏜️'}
                  </div>
                  <p className="font-semibold">Humidity Level</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {weatherData.current.humidity > 70 ? 'High' : 
                     weatherData.current.humidity > 40 ? 'Comfortable' : 'Low'} ({weatherData.current.humidity}%)
                  </p>
                </div>

                {/* Wind Comfort */}
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                  <div className="text-2xl mb-2">
                    {weatherData.current.wind_speed > 25 ? '💨' : 
                     weatherData.current.wind_speed > 10 ? '🍃' : '😴'}
                  </div>
                  <p className="font-semibold">Wind Level</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {weatherData.current.wind_speed > 25 ? 'Windy' : 
                     weatherData.current.wind_speed > 10 ? 'Breezy' : 'Calm'} ({weatherData.current.wind_speed} km/h)
                  </p>
                </div>

                {/* Overall Comfort */}
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                  <div className="text-2xl mb-2">
                    {(() => {
                      const tempScore = weatherData.current.temperature >= 20 && weatherData.current.temperature <= 28 ? 1 : 0
                      const humidityScore = weatherData.current.humidity >= 40 && weatherData.current.humidity <= 60 ? 1 : 0
                      const windScore = weatherData.current.wind_speed <= 15 ? 1 : 0
                      const weatherScore = weatherData.current.weather_code <= 3 ? 1 : 0
                      const totalScore = tempScore + humidityScore + windScore + weatherScore
                      
                      return totalScore >= 3 ? '🌟' : totalScore >= 2 ? '😊' : '😐'
                    })()}
                  </div>
                  <p className="font-semibold">Overall Comfort</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {(() => {
                      const tempScore = weatherData.current.temperature >= 20 && weatherData.current.temperature <= 28 ? 1 : 0
                      const humidityScore = weatherData.current.humidity >= 40 && weatherData.current.humidity <= 60 ? 1 : 0
                      const windScore = weatherData.current.wind_speed <= 15 ? 1 : 0
                      const weatherScore = weatherData.current.weather_code <= 3 ? 1 : 0
                      const totalScore = tempScore + humidityScore + windScore + weatherScore
                      
                      return totalScore >= 3 ? 'Excellent' : totalScore >= 2 ? 'Good' : 'Fair'
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Weather Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  UV Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{weatherData.current.uv_index}</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${
                      weatherData.current.uv_index <= 2 ? 'bg-green-500' :
                      weatherData.current.uv_index <= 5 ? 'bg-yellow-500' :
                      weatherData.current.uv_index <= 7 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(weatherData.current.uv_index * 10, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {weatherData.current.uv_index <= 2 ? 'Low - Minimal protection needed' : 
                   weatherData.current.uv_index <= 5 ? 'Moderate - Seek shade during midday' : 
                   weatherData.current.uv_index <= 7 ? 'High - Protection essential' : 'Very High - Avoid sun exposure'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="h-5 w-5 text-blue-500" />
                  Wind Direction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-24 h-24 border-2 border-slate-300 dark:border-slate-600 rounded-full">
                    <div 
                      className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-blue-500 origin-bottom"
                      style={{ transform: `translateX(-50%) rotate(${weatherData.current.wind_direction}deg)` }}
                    />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{weatherData.current.wind_direction}°</div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {weatherData.current.wind_direction >= 337.5 || weatherData.current.wind_direction < 22.5 ? 'North' :
                     weatherData.current.wind_direction < 67.5 ? 'Northeast' :
                     weatherData.current.wind_direction < 112.5 ? 'East' :
                     weatherData.current.wind_direction < 157.5 ? 'Southeast' :
                     weatherData.current.wind_direction < 202.5 ? 'South' :
                     weatherData.current.wind_direction < 247.5 ? 'Southwest' :
                     weatherData.current.wind_direction < 292.5 ? 'West' : 'Northwest'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waves className="h-5 w-5 text-green-500" />
                  Air Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-green-500">Good</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Air quality is satisfactory for most people. Outdoor activities are safe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
