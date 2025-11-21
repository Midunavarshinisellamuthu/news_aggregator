'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'

export interface BookmarkedArticle {
  _id?: string
  title: string
  description?: string
  link: string
  image?: string
  source?: string
  category?: string
  sentiment?: string
}

export function useBookmarksDB() {
  const { user, token, isAuthenticated } = useAuth()
  const [bookmarks, setBookmarks] = useState<Record<string, BookmarkedArticle>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [bookmarksList, setBookmarksList] = useState<BookmarkedArticle[]>([])

  const fetchBookmarks = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/bookmarks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        console.error('Failed to fetch bookmarks')
        return
      }

      const data = await res.json()
      const bookmarkMap: Record<string, BookmarkedArticle> = {}

      data.bookmarks?.forEach((bookmark: any) => {
        bookmarkMap[bookmark.link] = {
          _id: bookmark._id,
          title: bookmark.title,
          description: bookmark.description,
          link: bookmark.link,
          image: bookmark.image,
          source: bookmark.source,
          category: bookmark.category,
          sentiment: bookmark.sentiment,
        }
      })

      setBookmarks(bookmarkMap)
      setBookmarksList(Object.values(bookmarkMap))
      console.log('Bookmarks loaded successfully:', Object.values(bookmarkMap).length)
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  // Fetch bookmarks from database when user logs in
  useEffect(() => {
    if (isAuthenticated && token) {
      console.log('Fetching bookmarks for authenticated user')
      fetchBookmarks()
    } else {
      console.log('Clearing bookmarks - user not authenticated')
      setBookmarks({})
      setBookmarksList([])
    }
  }, [isAuthenticated, token, fetchBookmarks])

  const addBookmark = useCallback(
    async (article: BookmarkedArticle) => {
      if (!isAuthenticated || !token) {
        toast.error('Please log in to save bookmarks')
        return false
      }

      try {
        const res = await fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: article.title,
            description: article.description,
            link: article.link,
            image: article.image,
            source: article.source,
            category: article.category,
            sentiment: article.sentiment,
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to add bookmark')
        }

        const data = await res.json()
        setBookmarks((prev) => ({
          ...prev,
          [article.link]: article,
        }))
        setBookmarksList((prev) => [...prev, article])
        toast.success('Article saved!')
        return true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save article'
        toast.error(message)
        return false
      }
    },
    [isAuthenticated, token]
  )

  const removeBookmark = useCallback(
    async (link: string) => {
      if (!isAuthenticated || !token) return false

      const bookmark = bookmarks[link]
      if (!bookmark?._id) return false

      try {
        const res = await fetch(`/api/bookmarks?id=${bookmark._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to remove bookmark')
        }

        setBookmarks((prev) => {
          const next = { ...prev }
          delete next[link]
          return next
        })
        setBookmarksList((prev) => prev.filter((b) => b.link !== link))
        toast.success('Article removed from bookmarks')
        return true
      } catch (error) {
        console.error('Error removing bookmark:', error)
        toast.error('Failed to remove bookmark')
        return false
      }
    },
    [bookmarks, isAuthenticated, token]
  )

  const isBookmarked = useCallback(
    (link: string) => {
      return !!bookmarks[link]
    },
    [bookmarks]
  )

  const toggleBookmark = useCallback(
    async (article: BookmarkedArticle) => {
      if (isBookmarked(article.link)) {
        await removeBookmark(article.link)
      } else {
        await addBookmark(article)
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  )

  return {
    bookmarks,
    bookmarksList,
    isLoading,
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isAuthenticated,
  }
}
