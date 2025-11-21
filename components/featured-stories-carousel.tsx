"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Clock, 
  TrendingUp,
  Zap,
  Eye,
  Share2,
  Bookmark
} from "lucide-react"
import useSWR from "swr"
import Link from "next/link"

interface FeaturedStory {
  id: string
  title: string
  description: string
  imageUrl: string
  source: string
  category: string
  publishedAt: string
  link: string
  isBreaking: boolean
  readTime: number
  views: number
  priority: number
}

interface FeaturedStoriesResponse {
  stories: FeaturedStory[]
  timestamp: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    breaking: 'bg-red-500 text-white',
    politics: 'bg-blue-500 text-white',
    business: 'bg-green-500 text-white',
    sports: 'bg-orange-500 text-white',
    technology: 'bg-purple-500 text-white',
    entertainment: 'bg-pink-500 text-white',
    health: 'bg-teal-500 text-white',
    general: 'bg-slate-500 text-white'
  }
  return colors[category.toLowerCase()] || colors.general
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export function FeaturedStoriesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const { data, error, isLoading } = useSWR<FeaturedStoriesResponse>(
    "/api/featured-stories",
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: true,
    }
  )

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying || !data?.stories?.length) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === data.stories.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, data?.stories?.length])

  const handlePrevious = () => {
    if (!data?.stories?.length) return
    setCurrentIndex(currentIndex === 0 ? data.stories.length - 1 : currentIndex - 1)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }

  const handleNext = () => {
    if (!data?.stories?.length) return
    setCurrentIndex(currentIndex === data.stories.length - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false) // Stop auto-play when user interacts
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unable to load featured stories
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.stories?.length) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardContent className="p-6">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No featured stories available
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentStory = data.stories[currentIndex]

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          
          {/* Featured Story */}
          <div className="relative h-80 overflow-hidden">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${currentStory.imageUrl || '/placeholder.jpg'})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              
              {/* Story Badges */}
              <div className="flex items-center gap-2 mb-3">
                {currentStory.isBreaking && (
                  <Badge className="bg-red-600 text-white animate-pulse">
                    <Zap className="h-3 w-3 mr-1" />
                    BREAKING
                  </Badge>
                )}
                <Badge className={getCategoryColor(currentStory.category)}>
                  {currentStory.category}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(currentStory.publishedAt)}
                </div>
              </div>

              {/* Story Title */}
              <h3 className="text-2xl font-bold leading-tight mb-2 line-clamp-2">
                {currentStory.title}
              </h3>

              {/* Story Description */}
              <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-2">
                {currentStory.description}
              </p>

              {/* Story Meta & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-white/70">
                  <span className="font-medium">{currentStory.source}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {currentStory.views?.toLocaleString() || '0'}
                  </div>
                  <span>{currentStory.readTime || 3} min read</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <Bookmark className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Link href={currentStory.link} target="_blank">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Read Full
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 rounded-full p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {data.stories.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>

          {/* Story Counter */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentIndex + 1} / {data.stories.length}
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>Featured Stories</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live Updates</span>
              </div>
            </div>
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`text-xs px-2 py-1 rounded ${
                isAutoPlaying 
                  ? 'text-green-600 bg-green-50 dark:bg-green-900/30' 
                  : 'text-slate-600 bg-slate-100 dark:bg-slate-700'
              }`}
            >
              {isAutoPlaying ? '⏸️ Auto' : '▶️ Manual'}
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}