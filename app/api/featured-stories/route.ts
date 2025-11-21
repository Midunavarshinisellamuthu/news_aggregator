import { NextRequest, NextResponse } from 'next/server'

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

// Mock featured stories data - in production, this would come from your main news API
const mockFeaturedStories: FeaturedStory[] = [
  {
    id: '1',
    title: 'Supreme Court Declares Electoral Bonds Scheme Unconstitutional',
    description: 'In a landmark judgment, the Supreme Court has struck down the electoral bonds scheme, calling it a violation of the right to information and transparency in political funding.',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop',
    source: 'The Hindu',
    category: 'politics',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    link: '#',
    isBreaking: true,
    readTime: 5,
    views: 45600,
    priority: 1
  },
  {
    id: '2',
    title: 'India GDP Growth Surpasses Expectations at 7.8% in Q4 2024',
    description: 'Indias economy shows remarkable resilience with GDP growth exceeding forecasts, driven by strong consumer demand and robust manufacturing sector performance.',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
    source: 'Business Standard',
    category: 'business',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    link: '#',
    isBreaking: false,
    readTime: 4,
    views: 32400,
    priority: 2
  },
  {
    id: '3',
    title: 'ISRO Successfully Launches Chandrayaan-4 Mission to Moon',
    description: 'Indian Space Research Organisation achieves another milestone with the successful launch of Chandrayaan-4, aiming to establish a permanent lunar research station.',
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop',
    source: 'NDTV',
    category: 'technology',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    link: '#',
    isBreaking: false,
    readTime: 6,
    views: 28900,
    priority: 3
  },
  {
    id: '4',
    title: 'IPL 2024 Final: Chennai Super Kings vs Mumbai Indians',
    description: 'The most anticipated cricket match of the year is set for tonight as CSK and MI clash in the IPL 2024 final at the Narendra Modi Stadium in Ahmedabad.',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=400&fit=crop',
    source: 'ESPN Cricinfo',
    category: 'sports',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    link: '#',
    isBreaking: true,
    readTime: 3,
    views: 67800,
    priority: 4
  },
  {
    id: '5',
    title: 'New AI Regulation Framework Approved by Indian Parliament',
    description: 'India becomes one of the first countries to implement comprehensive AI governance rules, focusing on ethical AI development and data protection.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    source: 'TechCrunch India',
    category: 'technology',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    link: '#',
    isBreaking: false,
    readTime: 7,
    views: 19500,
    priority: 5
  },
  {
    id: '6',
    title: 'Mumbai Monsoon: Heavy Rainfall Causes Widespread Flooding',
    description: 'Mumbai experiences its heaviest rainfall in five years, causing significant flooding across the city and disrupting daily life for millions.',
    imageUrl: 'https://images.unsplash.com/photo-1527766833261-b09c3163a791?w=800&h=400&fit=crop',
    source: 'Mumbai Mirror',
    category: 'general',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    link: '#',
    isBreaking: true,
    readTime: 4,
    views: 41200,
    priority: 6
  }
]

export async function GET(request: NextRequest) {
  try {
    // In production, you would:
    // 1. Fetch from your main news database
    // 2. Apply priority scoring algorithm
    // 3. Select top 5-6 stories based on engagement, recency, and importance
    // 4. Ensure variety in categories
    
    // Add some randomization to simulate real-time changes
    const randomizedStories = mockFeaturedStories.map(story => ({
      ...story,
      views: Math.max(1000, story.views + Math.floor(Math.random() * 2000) - 1000),
      publishedAt: story.isBreaking 
        ? new Date(Date.now() - Math.floor(Math.random() * 2 * 60 * 60 * 1000)).toISOString()
        : story.publishedAt
    }))

    // Sort by priority and breaking news status
    const sortedStories = randomizedStories.sort((a, b) => {
      if (a.isBreaking && !b.isBreaking) return -1
      if (!a.isBreaking && b.isBreaking) return 1
      return a.priority - b.priority
    })

    // Return top 5 stories for the carousel
    const featuredStories = sortedStories.slice(0, 5)

    const response: FeaturedStoriesResponse = {
      stories: featuredStories,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
      },
    })

  } catch (error) {
    console.error('Error fetching featured stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured stories' },
      { status: 500 }
    )
  }
}

// Helper function to calculate story priority (for production use)
export function calculateStoryPriority(story: any): number {
  let priority = 0
  
  // Recency factor (newer = higher priority)
  const ageInHours = (Date.now() - new Date(story.publishedAt).getTime()) / (1000 * 60 * 60)
  priority += Math.max(0, 24 - ageInHours) * 2
  
  // Engagement factor
  priority += Math.log(story.views || 1) * 3
  
  // Breaking news bonus
  if (story.isBreaking) priority += 50
  
  // Category importance (politics and business get higher priority)
  const categoryWeights: { [key: string]: number } = {
    politics: 10,
    business: 8,
    technology: 7,
    sports: 6,
    general: 5,
    entertainment: 4,
    health: 6
  }
  priority += categoryWeights[story.category.toLowerCase()] || 3
  
  return Math.round(priority)
}