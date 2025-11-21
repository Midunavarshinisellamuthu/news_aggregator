import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    // This would typically come from your database
    // For demo purposes, we'll return mock data
    
    const mockStats: DailyStats = {
      articlesRead: 24,
      timeSpent: 127, // 2 hours 7 minutes
      breakingNewsCount: 8,
      topCategories: [
        { category: 'politics', count: 12, percentage: 35 },
        { category: 'business', count: 8, percentage: 24 },
        { category: 'sports', count: 6, percentage: 18 },
        { category: 'technology', count: 4, percentage: 12 },
        { category: 'entertainment', count: 3, percentage: 9 }
      ],
      recentActivity: [
        {
          action: 'Read article',
          article: 'Supreme Court hearing on electoral bonds case',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          category: 'politics'
        },
        {
          action: 'Bookmarked',
          article: 'India GDP growth forecast revised upward',
          timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
          category: 'business'
        },
        {
          action: 'Shared article',
          article: 'IPL 2024: Mumbai Indians vs Chennai Super Kings',
          timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
          category: 'sports'
        },
        {
          action: 'Read article',
          article: 'New AI regulations announced by government',
          timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
          category: 'technology'
        }
      ],
      streakDays: 7,
      totalSessions: 3,
      avgReadTime: 185 // 3 minutes 5 seconds per article
    }

    // Add some randomization to make it feel more real-time
    const randomizedStats = {
      ...mockStats,
      articlesRead: mockStats.articlesRead + Math.floor(Math.random() * 5),
      timeSpent: mockStats.timeSpent + Math.floor(Math.random() * 15),
      breakingNewsCount: mockStats.breakingNewsCount + Math.floor(Math.random() * 3),
      avgReadTime: mockStats.avgReadTime + Math.floor(Math.random() * 30) - 15
    }

    return NextResponse.json(randomizedStats)

  } catch (error) {
    console.error('Error fetching daily stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily stats' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle activity tracking
    const body = await request.json()
    const { action, articleId, category } = body

    // In a real app, you would save this to your database
    console.log('Activity tracked:', { action, articleId, category, timestamp: new Date() })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error tracking activity:', error)
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    )
  }
}