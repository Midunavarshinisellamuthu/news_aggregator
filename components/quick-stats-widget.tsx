"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Users, 
  Eye, 
  BookOpen,
  Zap,
  Calendar,
  Target,
  Timer,
  Activity
} from "lucide-react"
import useSWR from "swr"

interface DailyStats {
  articlesRead: number
  timeSpent: number // in minutes
  breakingNewsCount: number
  topCategories: Array<{
    category: string
    count: number
    percentage: number
  }>
  recentActivity: Array<{
    action: string
    article: string
    timestamp: Date
    category: string
  }>
  streakDays: number
  totalSessions: number
  avgReadTime: number // in seconds per article
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function QuickStatsWidget() {
  const [currentTime, setCurrentTime] = useState(new Date())

  const { data: stats, error, isLoading } = useSWR<DailyStats>(
    "/api/stats/daily",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  )

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatAvgReadTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    }
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}m ${Math.round(secs)}s`
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unable to load stats
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Today's Activity
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Articles</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {stats.articlesRead}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Time</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatTime(stats.timeSpent)}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Breaking</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {stats.breakingNewsCount}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">Streak</span>
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {stats.streakDays}d
                </div>
              </div>
            </div>

            <Separator />

            {/* Top Categories */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Top Categories
              </h4>
              <div className="space-y-2">
                {stats.topCategories.slice(0, 3).map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                        {category.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {category.count}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {category.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Recent Activity */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Activity
              </h4>
              <div className="space-y-2">
                {stats.recentActivity.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {activity.action}
                      </p>
                      <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                        {activity.article}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {activity.category}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {new Date(activity.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Additional Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="text-slate-500 dark:text-slate-400">Sessions</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {stats.totalSessions}
                </div>
              </div>
              <div className="text-center">
                <div className="text-slate-500 dark:text-slate-400">Avg Read</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {formatAvgReadTime(stats.avgReadTime)}
                </div>
              </div>
            </div>

            {/* Live Status */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Live tracking • Updates every 30s
              </span>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-slate-500 dark:text-slate-400">
            No activity data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}