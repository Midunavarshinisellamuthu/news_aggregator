"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { Badge } from "@/components/ui/badge"
import { NewsCard } from "@/components/news-card"
import { FiltersBar } from "@/components/filters-bar"
import { WeatherWidget } from "@/components/weather-widget"
import { StockWidget } from "@/components/stock-widget"
import { QuickStatsWidget } from "@/components/quick-stats-widget"
import { CryptoWidget } from "@/components/crypto-widget"
import { TrendingTopicsWidget } from "@/components/trending-topics-widget"
import { FeaturedStoriesCarousel } from "@/components/featured-stories-carousel"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/context/auth-context"
import { useGamification } from "@/hooks/use-gamification"
import { useBookmarksDB } from "@/hooks/use-bookmarks-db"
import { Search, Newspaper, Bookmark, Zap, RefreshCw, TrendingUp, BarChart3, Users, Globe2, Sparkles, Flame, Trophy, Shield, LogOut, Loader2 } from "lucide-react"
import type { LanguageOption } from "@/lib/constants"

// Fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>("all")
  const [stateCode, setStateCode] = useState<string>("all")
  const [language, setLanguage] = useState<LanguageOption>({ code: "en", label: "English" })
  const [realtime, setRealtime] = useState(true)

  const params = useMemo(() => {
    const usp = new URLSearchParams()
    if (query.trim()) usp.set("q", query.trim())
    if (category !== "all") usp.set("category", category)
    if (stateCode !== "all") usp.set("state", stateCode)
    return usp.toString()
  }, [query, category, stateCode])

  const { data, isLoading, mutate } = useSWR<{ articles: any[]; updatedAt: string }>(
    isAuthenticated ? `/api/news${params ? `?${params}` : ""}` : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: true },
  )

  const { bookmarksList, isBookmarked, addBookmark, removeBookmark } = useBookmarksDB()
  const { stats } = useGamification()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  // SSE: Real-time breaking news alerts
  useEffect(() => {
    if (!realtime) return
    const url = `/api/news/stream${params ? `?${params}` : ""}`
    const es = new EventSource(url)
    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data)
        if (payload.type === "breaking" && payload.article) {
          const a = payload.article
          toast(`Breaking: ${a.title}`, {
            description: a.source || "News Hub",
            action: {
              label: "Open",
              onClick: () => window.open(a.link, "_blank"),
            },
          })
          // Optional: optimistic update (prepend)
          mutate(
            (prev) =>
              prev
                ? {
                    ...prev,
                    articles: [
                      {
                        ...a,
                        isBreaking: true,
                      },
                      ...prev.articles,
                    ],
                  }
                : prev,
            { revalidate: false },
          )
          // Browser notifications (if permitted)
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("Breaking News", { body: a.title })
            }
          }
        }
      } catch {
        // ignore malformed events
      }
    }
    es.onerror = () => {
      es.close()
    }
    return () => es.close()
  }, [params, realtime, mutate])

  const onSearch = () => mutate()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // Show loading state during auth check
  if (authLoading) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </main>
    )
  }

  // Show nothing while redirecting to login
  if (!isAuthenticated) {
    return null
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                  NewsHub
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Professional News Aggregator</p>
              </div>
            </Link>
            
            {/* Navigation */}
            <nav className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-6 mr-6">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">{data?.articles?.length || 0}</span>
                  <span>Articles</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Globe2 className="h-4 w-4" />
                  <span className="font-medium">25+</span>
                  <span>Sources</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                  <Flame className="h-4 w-4" />
                  <span className="font-medium">{stats.currentStreak} day streak</span>
                </div>
              </div>

              <Link href="/reliability">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Reliability</span>
                </Button>
              </Link>

              <Link href="/stocks">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Stocks</span>
                </Button>
              </Link>

              <Link href="/trends">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Trends</span>
                </Button>
              </Link>

              <Link href="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Trophy className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Profile</span>
                </Button>
              </Link>

              <Link href="/bookmarks">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Bookmarks</span>
                </Button>
              </Link>

              <ThemeToggle />

              <Button
                variant={realtime ? "default" : "outline"}
                size="sm"
                onClick={() => setRealtime((s) => !s)}
                aria-pressed={realtime}
                className={`flex items-center gap-2 font-medium ${
                  realtime
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
                    : 'border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                <Zap className={`h-4 w-4 ${realtime ? 'animate-pulse' : ''}`} />
                <span className="hidden sm:inline">{realtime ? "Live" : "Offline"}</span>
              </Button>

              {/* User Info and Logout */}
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
                <div className="hidden sm:text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Three Column Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Sidebar */}
          <aside className="xl:col-span-3 order-2 xl:order-1">
            <div className="sticky top-24 space-y-6">
              <QuickStatsWidget />
              <CryptoWidget />
            </div>
          </aside>

          {/* Center Content */}
          <main className="xl:col-span-6 order-1 xl:order-2">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium dark:bg-blue-950/50 dark:text-blue-300">
                  <Sparkles className="h-4 w-4" />
                  <span>Real-time News Intelligence</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-white dark:via-slate-200 dark:to-slate-400">
                  Latest Indian News
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Stay informed with comprehensive coverage from India's most trusted news sources, 
                  powered by advanced filtering and real-time updates.
                </p>
              </div>
              
              {/* Enhanced Search Bar */}
              <div className="relative">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search breaking news, politics, business, sports..."
                      aria-label="Search news"
                      className="pl-12 h-12 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-400 rounded-xl shadow-sm"
                    />
                  </div>
                  <Button 
                    onClick={onSearch} 
                    size="lg" 
                    className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
              
              <FiltersBar
                category={category}
                onCategoryChange={setCategory}
                stateCode={stateCode}
                onStateChange={setStateCode}
                language={language}
                onLanguageChange={setLanguage}
              />
              
              {/* Featured Stories Carousel */}
              <FeaturedStoriesCarousel />
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="xl:col-span-3 order-3">
            <div className="sticky top-24 space-y-6">
              <WeatherWidget />
              <StockWidget />
              <TrendingTopicsWidget />
            </div>
          </aside>
          
        </div>
      </div>

      {/* News Section - Original Layout */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-8">
          <Tabs defaultValue="latest" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <TabsTrigger 
                  value="latest" 
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
                >
                  <TrendingUp className="h-4 w-4" />
                  Latest News
                </TabsTrigger>
                <TabsTrigger 
                  value="top" 
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
                >
                  <Zap className="h-4 w-4" />
                  Breaking
                </TabsTrigger>
              </TabsList>
              
              {!isLoading && data?.articles && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <RefreshCw className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {data.articles.length} articles
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Updated: {new Date(data.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
              
            {/* Professional News Grid - Original 3 Column Layout */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {isLoading &&
                Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="group">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="h-48 animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600" />
                      <div className="p-6 space-y-3">
                        <div className="h-5 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                        <div className="h-5 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 w-4/5" />
                        <div className="h-4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 w-3/5" />
                        <div className="flex gap-2 pt-2">
                          <div className="h-8 w-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                          <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {!isLoading &&
                (data?.articles ?? []).map((a, idx) => (
                  <NewsCard
                    key={`${a.link}-${idx}`}
                    article={a}
                    language={language}
                  />
                ))}
              
              {!isLoading && (!data?.articles || data.articles.length === 0) && (
                <div className="col-span-full">
                  <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                      <Newspaper className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No articles found</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      We couldn't find any articles matching your criteria. Try adjusting your search terms or filters.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </section>

      <Toaster richColors />
      
      {/* Professional Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Newspaper className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">NewsHub</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                Your trusted source for comprehensive Indian news coverage. 
                Powered by advanced AI and real-time data from 25+ premium sources.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>Real-time Updates</li>
                <li>Multi-language Support</li>
                <li>State-wise Filtering</li>
                <li>Sentiment Analysis</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Coverage</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li>25+ News Sources</li>
                <li>All Indian States</li>
                <li>10+ Languages</li>
                <li>Breaking News Alerts</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2024 NewsHub. Made with ❤️ in India 🇮🇳
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>Trusted by thousands</span>
              <span>•</span>
              <span>Updated every minute</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}