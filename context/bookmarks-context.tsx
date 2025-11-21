"use client"

import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

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

type BookmarksContextType = {
  bookmarks: Record<string, Article>
  bookmarksList: Article[]
  isBookmarked: (link: string) => boolean
  toggleBookmark: (article: Article) => void
  addBookmark: (article: Article) => void
  removeBookmark: (link: string) => void
  offlineArticles: Article[]
  isArticleOffline: (link: string) => boolean
  saveForOffline: (article: Article) => Promise<boolean>
  removeOfflineArticle: (link: string) => Promise<boolean>
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, Article>>({})
  const [offlineArticles, setOfflineArticles] = useState<Article[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("news-hub-bookmarks")
      if (raw) {
        setMap(JSON.parse(raw))
      }
      setIsInitialized(true)
    } catch (error) {
      console.error("Error loading bookmarks:", error)
      setIsInitialized(true)
    }
  }, [])

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    if (!isInitialized) return
    
    try {
      localStorage.setItem("news-hub-bookmarks", JSON.stringify(map))
    } catch (error) {
      console.error("Error saving bookmarks:", error)
    }
  }, [map, isInitialized])

  // Load offline articles from IndexedDB
  useEffect(() => {
    if (typeof window === 'undefined') return
    
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

  const isBookmarked = (link: string) => {
    return !!map[link]
  }

  const value = useMemo(() => ({
    bookmarks: map,
    bookmarksList: Object.values(map).sort((a, b) => 
      (b.savedAt || '').localeCompare(a.savedAt || '')
    ),
    isBookmarked,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    offlineArticles: [...offlineArticles].sort((a, b) => 
      (b.savedAt || '').localeCompare(a.savedAt || '')
    ),
    isArticleOffline,
    saveForOffline,
    removeOfflineArticle,
  }), [map, offlineArticles])

  return (
    <BookmarksContext.Provider value={value}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const context = useContext(BookmarksContext)
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarksProvider')
  }
  return context
}
