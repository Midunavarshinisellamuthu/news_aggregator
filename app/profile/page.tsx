"use client"

import { useGamification } from "@/hooks/use-gamification"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Trophy,
  Flame,
  BookOpen,
  Clock,
  Target,
  Award,
  Calendar,
  TrendingUp,
  Star,
  Zap,
  Crown,
  Gift,
  CheckCircle2
} from "lucide-react"
import { useEffect } from "react"

export default function ProfilePage() {
  const {
    stats,
    dailyProgress,
    achievements,
    newAchievements,
    clearNewAchievements,
    getAchievementProgress
  } = useGamification()

  // Clear new achievements notification after 5 seconds
  useEffect(() => {
    if (newAchievements.length > 0) {
      const timer = setTimeout(clearNewAchievements, 5000)
      return () => clearTimeout(timer)
    }
  }, [newAchievements, clearNewAchievements])

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getStreakStatus = () => {
    const today = new Date().toDateString()
    const lastRead = stats.lastReadDate

    if (!lastRead) return { status: 'inactive', message: 'Start reading to begin your streak!' }

    const lastReadDate = new Date(lastRead)
    const todayDate = new Date(today)
    const diffTime = Math.abs(todayDate.getTime() - lastReadDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return { status: 'active', message: 'Keep it up! 🔥' }
    } else if (diffDays === 0) {
      return { status: 'today', message: 'Read today to maintain streak!' }
    } else {
      return { status: 'broken', message: `Streak ended ${diffDays - 1} days ago` }
    }
  }

  const streakInfo = getStreakStatus()

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                  Your Profile
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Track your reading journey
                </p>
              </div>
            </div>

            {/* New Achievements Alert */}
            {newAchievements.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
                <Gift className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {newAchievements.length} new achievement{newAchievements.length > 1 ? 's' : ''} unlocked!
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Reading Streak */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                  <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span>Reading Streak</span>
                    {streakInfo.status === 'active' && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
                        <Flame className="h-3 w-3" />
                        Active
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                    {streakInfo.message}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    {stats.currentStreak}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Current Streak</p>
                </div>
                <div className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {stats.longestStreak}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Longest Streak</p>
                </div>
                <div className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {Math.floor(stats.totalReadingTime / 60)}h
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Reading Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                Reading Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {stats.articlesRead}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Articles Read</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {formatTime(stats.totalReadingTime)}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total Time</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {stats.favoriteCategory || 'None'}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Favorite Category</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    {stats.achievements.length}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
                  <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="reading">Reading</TabsTrigger>
                  <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                  <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>

                {(['all', 'reading', 'loyalty', 'knowledge', 'engagement'] as const).map((category) => (
                  <TabsContent key={category} value={category} className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements
                        .filter(achievement =>
                          category === 'all' || achievement.category === category
                        )
                        .map((achievement) => {
                          const isUnlocked = stats.achievements.includes(achievement.id)
                          const progress = getAchievementProgress(achievement)

                          return (
                            <Card
                              key={achievement.id}
                              className={`relative transition-all duration-200 ${
                                isUnlocked
                                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                                  : 'hover:shadow-md'
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className={`text-2xl ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
                                    {achievement.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-sm">
                                        {achievement.title}
                                      </h4>
                                      {isUnlocked && (
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                      {achievement.description}
                                    </p>

                                    {!isUnlocked && (
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span className="text-slate-500">
                                            {progress.current} / {progress.target}
                                          </span>
                                          <span className="text-slate-500">
                                            {Math.round((progress.current / progress.target) * 100)}%
                                          </span>
                                        </div>
                                        <Progress
                                          value={(progress.current / progress.target) * 100}
                                          className="h-1"
                                        />
                                      </div>
                                    )}

                                    {isUnlocked && (
                                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                        Unlocked
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyProgress.slice(-7).reverse().map((day) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {new Date(day.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-blue-500" />
                        <span className="text-sm font-medium">{day.articlesRead}</span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {formatTime(day.readingTime)}
                    </div>
                  </div>
                ))}

                {dailyProgress.length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start reading to see your activity here!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
