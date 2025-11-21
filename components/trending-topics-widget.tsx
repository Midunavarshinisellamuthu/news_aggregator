"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  Hash, 
  Flame, 
  RefreshCw,
  Users,
  MessageSquare,
  Clock,
  Eye,
  ArrowUpRight,
  Zap,
  Target,
  Activity
} from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

interface TrendingTopic {
  id: string
  title: string
  hashtag: string
  category: string
  mentionCount: number
  engagementScore: number
  trendingScore: number
  lastUpdated: string
  isRising: boolean
  changePercent: number
  description?: string
  relatedKeywords: string[]
}

interface TrendingResponse {
  topics: TrendingTopic[]
  timestamp: string
  totalEngagement: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    politics: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    business: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    sports: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    technology: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    entertainment: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    health: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
    general: 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-300'
  }
  return colors[category.toLowerCase()] || colors.general
}

function TrendingTopicItem({ topic, index }: { topic: TrendingTopic; index: number }) {
  return (
    <Link 
      href={`/search?q=${encodeURIComponent(topic.hashtag)}`}
      className="block hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 rounded-lg transition-colors group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                index === 0 ? 'bg-red-500' :
                index === 1 ? 'bg-orange-500' :
                index === 2 ? 'bg-yellow-500' : 'bg-slate-400'
              }`} />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                #{index + 1}
              </span>
            </div>
            {topic.isRising && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +{topic.changePercent}%
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {topic.title}
            </h4>
            
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {topic.hashtag}
                </span>
              </div>
              <Badge className={`text-xs px-2 py-0.5 ${getCategoryColor(topic.category)}`}>
                {topic.category}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{formatNumber(topic.mentionCount)} mentions</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{formatNumber(topic.engagementScore)} views</span>
              </div>
            </div>
          </div>
        </div>
        
        <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex-shrink-0" />
      </div>
    </Link>
  )
}

export function TrendingTopicsWidget() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const { data, error, isLoading, mutate } = useSWR<TrendingResponse>(
    "/api/trending",
    fetcher,
    {
      refreshInterval: 120000, // Refresh every 2 minutes
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  // Update last refresh time
  useEffect(() => {
    if (data) {
      setLastUpdate(new Date())
    }
  }, [data])

  const handleRefresh = () => {
    mutate()
    setLastUpdate(new Date())
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unable to load trending topics
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-lg">
              <Flame className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Trending Topics
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                What's happening now
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Refresh topics"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg animate-pulse">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="flex gap-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.topics ? (
          <>
            {/* Top Trending Topics */}
            <div className="space-y-1">
              {data.topics.slice(0, 8).map((topic, index) => (
                <TrendingTopicItem key={topic.id} topic={topic} index={index} />
              ))}
            </div>

            <Separator />

            {/* Trending Stats */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Trending Insights
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Total Topics</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {data.topics.length}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Rising</div>
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    {data.topics.filter(t => t.isRising).length}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Top Category</div>
                  <div className="font-semibold text-slate-900 dark:text-white capitalize">
                    {data.topics[0]?.category || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">Engagement</div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {formatNumber(data.totalEngagement)}
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Hashtags */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Popular Hashtags
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.topics.slice(0, 6).map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/search?q=${encodeURIComponent(topic.hashtag)}`}
                    className="group"
                  >
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-1 hover:bg-blue-100 hover:text-blue-800 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      {topic.hashtag}
                      {topic.isRising && (
                        <TrendingUp className="h-2.5 w-2.5 ml-1 text-green-500" />
                      )}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <Link 
                href="/trending"
                className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
              >
                <span>View all trending topics</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-slate-500 dark:text-slate-400">
            No trending topics available
          </div>
        )}

        {/* Footer with last update time */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Activity className="h-3 w-3" />
            <span>Live Trends</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>
              {lastUpdate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}