"use client"

import { useState, useEffect, useMemo } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
  Clock,
  Users,
  Globe,
  Tag,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw
} from "lucide-react"

// Mock data for trends (in a real app, this would come from analytics API)
const generateMockTrendsData = () => {
  const categories = ['politics', 'sports', 'tech', 'economics', 'crime']
  const sources = [
    'The Hindu', 'Times of India', 'Indian Express', 'Economic Times',
    'NDTV', 'CNN News18', 'PTI News', 'ANI News'
  ]

  // Generate data for the last 7 days
  const data = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const dateStr = date.toISOString().split('T')[0]

    // Generate category data
    const categoryData = categories.map(category => ({
      category,
      count: Math.floor(Math.random() * 50) + 10,
      previousCount: Math.floor(Math.random() * 50) + 10
    }))

    // Generate source data
    const sourceData = sources.map(source => ({
      source,
      count: Math.floor(Math.random() * 20) + 5
    }))

    // Generate hourly activity (24 hours)
    const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor(Math.random() * 30) + 5
    }))

    data.push({
      date: dateStr,
      categories: categoryData,
      sources: sourceData,
      hourly: hourlyData,
      totalArticles: categoryData.reduce((sum, cat) => sum + cat.count, 0)
    })
  }

  return data
}

interface TrendsData {
  date: string
  categories: { category: string; count: number; previousCount: number }[]
  sources: { source: string; count: number }[]
  hourly: { hour: number; count: number }[]
  totalArticles: number
}

export default function TrendsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const [trendsData, setTrendsData] = useState<TrendsData[]>([])

  // Mock data loading
  useEffect(() => {
    setTrendsData(generateMockTrendsData())
  }, [selectedPeriod])

  // Calculate trends
  const trendsAnalysis = useMemo(() => {
    if (!trendsData.length) return null

    // Category trends
    const categoryTotals = trendsData[0]?.categories.map(cat => {
      const total = trendsData.reduce((sum, day) => {
        const dayCat = day.categories.find(c => c.category === cat.category)
        return sum + (dayCat?.count || 0)
      }, 0)

      const previousTotal = trendsData[0]?.categories.find(c => c.category === cat.category)?.previousCount || 0
      const change = total - previousTotal
      const changePercent = previousTotal > 0 ? (change / previousTotal) * 100 : 0

      return {
        category: cat.category,
        total,
        change,
        changePercent,
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      }
    }) || []

    // Top sources
    const sourceTotals = trendsData[0]?.sources
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) || []

    // Peak hours
    const allHourlyData = trendsData.flatMap(day => day.hourly)
    const peakHours = allHourlyData
      .reduce((acc, hour) => {
        acc[hour.hour] = (acc[hour.hour] || 0) + hour.count
        return acc
      }, {} as Record<number, number>)

    const topPeakHours = Object.entries(peakHours)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))

    // Trending keywords (mock)
    const trendingKeywords = [
      { keyword: 'election', mentions: 245, trend: 'up' },
      { keyword: 'cricket', mentions: 189, trend: 'up' },
      { keyword: 'budget', mentions: 156, trend: 'stable' },
      { keyword: 'technology', mentions: 134, trend: 'up' },
      { keyword: 'weather', mentions: 98, trend: 'down' }
    ]

    return {
      categoryTotals,
      sourceTotals,
      topPeakHours,
      trendingKeywords,
      totalArticles: trendsData.reduce((sum, day) => sum + day.totalArticles, 0)
    }
  }, [trendsData])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const formatCategoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                  Trends Dashboard
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Analyze news patterns and insights
                </p>
              </div>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2">
              <Button
                variant={selectedPeriod === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('7d')}
                className="rounded-lg"
              >
                7 Days
              </Button>
              <Button
                variant={selectedPeriod === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('30d')}
                className="rounded-lg"
              >
                30 Days
              </Button>
              <Button
                variant={selectedPeriod === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('90d')}
                className="rounded-lg"
              >
                90 Days
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Articles</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {trendsAnalysis?.totalArticles || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Categories</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {trendsAnalysis?.categoryTotals.length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <Tag className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Top Sources</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {trendsAnalysis?.sourceTotals.length || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Peak Hours</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {trendsAnalysis?.topPeakHours[0]?.hour || 0}:00
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendsAnalysis?.categoryTotals.map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="font-medium capitalize">{formatCategoryName(cat.category)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg">{cat.total}</span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(cat.trend)}
                            <span className={`text-sm font-medium ${getTrendColor(cat.trend)}`}>
                              {cat.change > 0 ? '+' : ''}{cat.change} ({cat.changePercent.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top News Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendsAnalysis?.sourceTotals.map((source, index) => (
                      <div key={source.source} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium">{source.source}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{source.count}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">articles</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Peak Activity Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendsAnalysis?.topPeakHours.map((peak, index) => (
                      <div key={peak.hour} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-orange-500" />
                          <span className="font-medium">
                            {peak.hour}:00 - {peak.hour + 1}:00
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{peak.count}</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">avg articles/hour</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trending Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendsAnalysis?.trendingKeywords.map((keyword) => (
                      <div key={keyword.keyword} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <span className="font-medium">#{keyword.keyword}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">{keyword.mentions}</span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(keyword.trend)}
                            <Badge
                              variant="outline"
                              className={`${keyword.trend === 'up' ? 'border-green-300 text-green-700' :
                                keyword.trend === 'down' ? 'border-red-300 text-red-700' :
                                'border-gray-300 text-gray-700'}`}
                            >
                              {keyword.trend}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
