"use client"

import { useState, useEffect, useCallback } from 'react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'reading' | 'engagement' | 'knowledge' | 'loyalty'
  requirement: number
  reward?: string
}

export interface UserStats {
  articlesRead: number
  currentStreak: number
  longestStreak: number
  totalReadingTime: number
  favoriteCategory: string
  achievements: string[]
  lastReadDate: string | null
}

export interface DailyProgress {
  date: string
  articlesRead: number
  readingTime: number
  categories: string[]
}

const ACHIEVEMENTS: Achievement[] = [
  // Reading Streaks
  {
    id: 'first_article',
    title: 'First Steps',
    description: 'Read your first article',
    icon: '📖',
    category: 'reading',
    requirement: 1
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day reading streak',
    icon: '⚡',
    category: 'loyalty',
    requirement: 7
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Maintain a 30-day reading streak',
    icon: '🏆',
    category: 'loyalty',
    requirement: 30
  },
  {
    id: 'century_reader',
    title: 'Century Reader',
    description: 'Read 100 articles',
    icon: '💯',
    category: 'reading',
    requirement: 100
  },
  {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Read 500 articles',
    icon: '🧠',
    category: 'knowledge',
    requirement: 500
  },
  {
    id: 'news_addict',
    title: 'News Addict',
    description: 'Read 1000 articles',
    icon: '📰',
    category: 'knowledge',
    requirement: 1000
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Read articles before 8 AM',
    icon: '🌅',
    category: 'engagement',
    requirement: 5
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Read articles after 10 PM',
    icon: '🦉',
    category: 'engagement',
    requirement: 5
  },
  {
    id: 'diverse_reader',
    title: 'Diverse Reader',
    description: 'Read from all available categories',
    icon: '🌈',
    category: 'knowledge',
    requirement: 5 // categories
  },
  {
    id: 'speed_reader',
    title: 'Speed Reader',
    description: 'Read 10 articles in one day',
    icon: '💨',
    category: 'reading',
    requirement: 1
  }
]

export function useGamification() {
  const [stats, setStats] = useState<UserStats>({
    articlesRead: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalReadingTime: 0,
    favoriteCategory: '',
    achievements: [],
    lastReadDate: null
  })

  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([])
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('newsHub_stats')
    const savedProgress = localStorage.getItem('newsHub_dailyProgress')

    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }

    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress))
    }
  }, [])

  // Save to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem('newsHub_stats', JSON.stringify(stats))
  }, [stats])

  useEffect(() => {
    localStorage.setItem('newsHub_dailyProgress', JSON.stringify(dailyProgress))
  }, [dailyProgress])

  // Check and update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString()
    const lastRead = stats.lastReadDate

    if (!lastRead) {
      // First time reading
      setStats(prev => ({
        ...prev,
        currentStreak: 1,
        lastReadDate: today
      }))
      return
    }

    const lastReadDate = new Date(lastRead)
    const todayDate = new Date(today)
    const diffTime = Math.abs(todayDate.getTime() - lastReadDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      // Consecutive day
      const newStreak = stats.currentStreak + 1
      setStats(prev => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastReadDate: today
      }))
    } else if (diffDays > 1) {
      // Streak broken
      setStats(prev => ({
        ...prev,
        currentStreak: 1,
        lastReadDate: today
      }))
    }
  }, [stats.lastReadDate, stats.currentStreak])

  // Record article read
  const recordArticleRead = useCallback((article: any, readingTime: number = 30) => {
    const today = new Date().toDateString()
    const categories = article.category || []

    // Update streak
    updateStreak()

    // Update daily progress
    setDailyProgress(prev => {
      const todayProgress = prev.find(p => p.date === today)

      if (todayProgress) {
        return prev.map(p =>
          p.date === today
            ? {
                ...p,
                articlesRead: p.articlesRead + 1,
                readingTime: p.readingTime + readingTime,
                categories: [...new Set([...p.categories, ...categories])]
              }
            : p
        )
      } else {
        return [...prev, {
          date: today,
          articlesRead: 1,
          readingTime,
          categories
        }]
      }
    })

    // Update overall stats
    setStats(prev => {
      const categoryCount = categories.reduce((acc: Record<string, number>, cat: string) => {
        acc[cat] = (acc[cat] || 0) + 1
        return acc
      }, {})

      const favoriteCategory = Object.entries(categoryCount)
        .sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || prev.favoriteCategory

      return {
        ...prev,
        articlesRead: prev.articlesRead + 1,
        totalReadingTime: prev.totalReadingTime + readingTime,
        favoriteCategory
      }
    })

    // Check for new achievements
    checkAchievements()
  }, [updateStreak])

  // Check for newly unlocked achievements
  const checkAchievements = useCallback(() => {
    const unlockedAchievements = ACHIEVEMENTS.filter(achievement => {
      if (stats.achievements.includes(achievement.id)) {
        return false // Already unlocked
      }

      switch (achievement.id) {
        case 'first_article':
          return stats.articlesRead >= achievement.requirement
        case 'week_warrior':
        case 'month_master':
          return stats.currentStreak >= achievement.requirement
        case 'century_reader':
        case 'knowledge_seeker':
        case 'news_addict':
          return stats.articlesRead >= achievement.requirement
        case 'early_bird':
          return dailyProgress.some(p => {
            const date = new Date(p.date)
            return date.getHours() < 8
          })
        case 'night_owl':
          return dailyProgress.some(p => {
            const date = new Date(p.date)
            return date.getHours() >= 22
          })
        case 'diverse_reader':
          const uniqueCategories = new Set(dailyProgress.flatMap(p => p.categories))
          return uniqueCategories.size >= achievement.requirement
        case 'speed_reader':
          return dailyProgress.some(p => p.articlesRead >= 10)
        default:
          return false
      }
    })

    if (unlockedAchievements.length > 0) {
      setNewAchievements(unlockedAchievements)
      setStats(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...unlockedAchievements.map(a => a.id)]
      }))
    }
  }, [stats.achievements, stats.articlesRead, stats.currentStreak, dailyProgress])

  // Clear new achievements notification
  const clearNewAchievements = useCallback(() => {
    setNewAchievements([])
  }, [])

  // Get achievement progress
  const getAchievementProgress = useCallback((achievement: Achievement) => {
    switch (achievement.id) {
      case 'first_article':
      case 'century_reader':
      case 'knowledge_seeker':
      case 'news_addict':
        return { current: stats.articlesRead, target: achievement.requirement }
      case 'week_warrior':
      case 'month_master':
        return { current: stats.currentStreak, target: achievement.requirement }
      case 'early_bird':
      case 'night_owl':
        const relevantDays = dailyProgress.filter(p => {
          const date = new Date(p.date)
          const hour = date.getHours()
          return achievement.id === 'early_bird' ? hour < 8 : hour >= 22
        }).length
        return { current: relevantDays, target: achievement.requirement }
      case 'diverse_reader':
        const uniqueCategories = new Set(dailyProgress.flatMap(p => p.categories))
        return { current: uniqueCategories.size, target: achievement.requirement }
      case 'speed_reader':
        const maxDaily = Math.max(...dailyProgress.map(p => p.articlesRead), 0)
        return { current: maxDaily, target: 10 }
      default:
        return { current: 0, target: achievement.requirement }
    }
  }, [stats.articlesRead, stats.currentStreak, dailyProgress])

  return {
    stats,
    dailyProgress,
    achievements: ACHIEVEMENTS,
    newAchievements,
    recordArticleRead,
    clearNewAchievements,
    getAchievementProgress
  }
}
