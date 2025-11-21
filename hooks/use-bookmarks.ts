"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export type Article = {
  title: string
  link: string
  contentSnippet?: string
  content?: string
  pubDate?: string
  source?: string
  image?: string | null
  category?: string[]
  state?: string
  sentiment?: { score: number; comparative: number; label: "positive" | "neutral" | "negative" }
  summary?: string
  isBreaking?: boolean
  savedAt?: string
  isOffline?: boolean
}

const STORAGE_KEYS = {
  BOOKMARKS: "news-hub-bookmarks",
  OFFLINE_ARTICLES: "news-hub-offline-articles"
}

// Initialize IndexedDB for offline storage
const initDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!window.indexedDB) {
      return reject(new Error("IndexedDB is not supported in this browser"))
    }

    const request = indexedDB.open("NewsHubDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      
      if (!db.objectStoreNames.contains('articles')) {
        const store = db.createObjectStore('articles', { keyPath: 'link' })
        store.createIndex('savedAt', 'savedAt', { unique: false })
      }
    }
  })
}

export function useBookmarks() {
  const [map, setMap] = useState<Record<string, Article>>({})
  const [offlineArticles, setOfflineArticles] = useState<Article[]>([])

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS)
      if (raw) setMap(JSON.parse(raw))
    } catch (error) {
      console.error("Error loading bookmarks:", error)
    }
  }, [])

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(map))
    } catch (error) {
      console.error("Error saving bookmarks:", error)
    }
  }, [map])

  // Load offline articles from IndexedDB
  useEffect(() => {
    const loadOfflineArticles = async () => {
      try {
        const db = await initDB()
        const transaction = db.transaction(['articles'], 'readonly')
        const store = transaction.objectStore('articles')
        const request = store.getAll()

        request.onsuccess = () => {
          setOfflineArticles(request.result || [])
        }
      } catch (error) {
        console.error("Error loading offline articles:", error)
      }
    }

    loadOfflineArticles()
  }, [])

  // Add or remove bookmark
  const toggleBookmark = (article: Article) => {
    if (map[article.link]) {
      removeBookmark(article.link)
      toast({
        title: "Removed from bookmarks",
        description: article.title,
      })
    } else {
      addBookmark(article)
      toast({
        title: "Added to bookmarks",
        description: article.title,
      })
    }
  }

  const addBookmark = (article: Article) => {
    setMap((prev) => ({
      ...prev,
      [article.link]: { ...article, savedAt: new Date().toISOString() }
    }))
  }

  const removeBookmark = (link: string) => {
    setMap((prev) => {
      const next = { ...prev }
      delete next[link]
      return next
    })
  }

  // Save article for offline reading
  const saveForOffline = async (article: Article) => {
    try {
      const db = await initDB()
      const transaction = db.transaction(['articles'], 'readwrite')
      const store = transaction.objectStore('articles')
      
      // Add savedAt timestamp
      const articleWithTimestamp = {
        ...article,
        savedAt: new Date().toISOString(),
        isOffline: true
      }
      
      await store.put(articleWithTimestamp)
      
      // Update local state
      setOfflineArticles(prev => {
        const existingIndex = prev.findIndex(a => a.link === article.link)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = articleWithTimestamp
          return updated
        }
        return [...prev, articleWithTimestamp]
      })

      toast({
        title: "Saved for offline",
        description: "You can read this article without an internet connection.",
      })
      
      return true
    } catch (error) {
      console.error("Error saving article for offline:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save article for offline reading.",
      })
      return false
    }
  }

  // Remove article from offline storage
  const removeOfflineArticle = async (link: string) => {
    try {
      const db = await initDB()
      const transaction = db.transaction(['articles'], 'readwrite')
      const store = transaction.objectStore('articles')
      
      await store.delete(link)
      
      // Update local state
      setOfflineArticles(prev => prev.filter(article => article.link !== link))
      
      return true
    } catch (error) {
      console.error("Error removing offline article:", error)
      return false
    }
  }

  // Check if article is saved for offline
  const isArticleOffline = (link: string) => {
    return offlineArticles.some(article => article.link === link)
  }

  return {
    // Bookmark state and actions
    bookmarks: map,
    bookmarksList: useMemo(() => Object.values(map).sort((a, b) => 
      (b.savedAt || '').localeCompare(a.savedAt || '')
    ), [map]),
    isBookmarked: (link: string) => !!map[link],
    toggleBookmark,
    addBookmark,
    removeBookmark,
    
    // Offline reading state and actions
    offlineArticles: useMemo(() => 
      [...offlineArticles].sort((a, b) => 
        (b.savedAt || '').localeCompare(a.savedAt || '')
      ), 
      [offlineArticles]
    ),
    isArticleOffline,
    saveForOffline,
    removeOfflineArticle,
  }
}
