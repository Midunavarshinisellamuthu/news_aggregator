"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGamification } from "@/hooks/use-gamification"
import { useState, useEffect } from "react"
import { VoiceReader } from "@/components/voice-reader"
import { 
  Clock, 
  ExternalLink, 
  Bookmark, 
  BookmarkCheck, 
  TrendingUp, 
  AlertCircle, 
  Languages, 
  Share2, 
  Eye, 
  FileText, 
  X, 
  Download, 
  Check, 
  WifiOff,
  Wifi
} from "lucide-react"
import type { LanguageOption } from "@/lib/constants"
import { ShareDropdown } from "./share-dropdown"
import { Article } from "@/hooks/use-bookmarks"
import { useBookmarksDB } from "@/hooks/use-bookmarks-db"
import { toast } from "sonner"

// Helper function to strip HTML tags
function stripHtmlTags(html: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&nbsp;/g, ' ') // Replace HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim()
}

export function NewsCard({
  article,
  language,
}: {
  article: Article
  language: LanguageOption
}) {
  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
  } = useBookmarksDB()
  
  const [isOffline, setIsOffline] = useState(false)
  
  // Check if article is bookmarked
  const isArticleBookmarked = isBookmarked(article.link)
  
  // Handle online/offline status
  useEffect(() => {
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine)
    }
    
    // Set initial status
    setIsOffline(!navigator.onLine)
    
    // Add event listeners
    window.addEventListener('online', handleStatusChange)
    window.addEventListener('offline', handleStatusChange)
    
    return () => {
      window.removeEventListener('online', handleStatusChange)
      window.removeEventListener('offline', handleStatusChange)
    }
  }, [])
  const { recordArticleRead } = useGamification()
  const [reading, setReading] = useState(false)
  const [translating, setTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [summary, setSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  const rawText = translatedText || article.summary || article.contentSnippet || article.content || ""
  const displayText = stripHtmlTags(rawText)
  const displayTitle = translatedTitle || article.title
  
  const translateArticle = async () => {
    if (language.code === 'en' || translating) {
      console.log('Skipping translation - already in English or translation in progress')
      return
    }
    
    console.log('Starting translation to', language.code)
    setTranslating(true)
    
    try {
      // First check if we already have a translation
      if (translatedTitle && translatedText) {
        return; // Already translated
      }

      // Translate title
      const titleResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: article.title,
          source: 'en',
          target: language.code.split('-')[0]
        })
      })
      
      if (!titleResponse.ok) {
        throw new Error('Failed to translate title')
      }
      
      const titleData = await titleResponse.json()
      console.log('Title translation response:', { 
        success: titleResponse.ok, 
        status: titleResponse.status,
        data: titleData 
      })

      // Translate content
      const contentToTranslate = article.summary || article.contentSnippet || article.content || ''
      console.log('Translating content, length:', contentToTranslate.length)
      const contentResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: contentToTranslate,
          source: 'en',
          target: language.code.split('-')[0]
        })
      })
      
      if (!contentResponse.ok) {
        throw new Error('Failed to translate content')
      }
      
      const contentData = await contentResponse.json()

      // Only update if we got valid responses
      if (titleData?.translated) {
        setTranslatedTitle(titleData.translated)
      }
      if (contentData?.translated) {
        setTranslatedText(contentData.translated)
      }
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setTranslating(false)
    }
  }
  
  const resetTranslation = () => {
    setTranslatedText(null)
    setTranslatedTitle(null)
  }

  const handleReadArticle = () => {
    recordArticleRead(article, 30)
  }
  
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isArticleBookmarked) {
      await removeBookmark(article.link)
    } else {
      await addBookmark({
        title: article.title,
        description: article.contentSnippet || article.summary || '',
        link: article.link,
        image: article.image,
        source: article.source,
        category: article.category?.[0] || 'General',
        sentiment: article.sentiment?.label || 'neutral',
      })
    }
  }

  const generateSummary = async () => {
    if (summaryLoading || summary) return

    setSummaryLoading(true)
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          content: article.summary || article.contentSnippet || article.content || '',
          source: article.source
        })
      })

      const data = await response.json()

      if (data.success) {
        setSummary(data.summary)
        setShowSummary(true)
      } else {
        console.error('Summary generation failed:', data.error)
        // Show fallback message
        setSummary('Unable to generate AI summary. Please read the full article for complete information.')
        setShowSummary(true)
      }
    } catch (error) {
      console.error('Summary generation error:', error)
      setSummary('Unable to generate summary at this time. Please read the full article.')
      setShowSummary(true)
    } finally {
      setSummaryLoading(false)
    }
  }

  const toggleSummary = () => {
    if (!summary) {
      generateSummary()
    } else {
      setShowSummary(!showSummary)
    }
  }

  return (
    <Card className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-2">
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="text-pretty text-lg font-bold leading-tight text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-3 group-hover:underline"
            onClick={handleReadArticle}
          >
            {displayTitle}
          </a>
          <div className="flex shrink-0 items-center gap-2">
            {article.isBreaking && (
              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse flex items-center gap-1 px-3 py-1 text-xs font-medium">
                <AlertCircle className="h-3 w-3" />
                Breaking
              </Badge>
            )}
            {article.sentiment?.label && (
              <Badge
                variant="outline"
                className={
                  article.sentiment.label === "positive"
                    ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-300 dark:from-emerald-950 dark:to-green-950 dark:text-emerald-300 dark:border-emerald-700 px-3 py-1"
                    : article.sentiment.label === "negative"
                      ? "bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border-rose-300 dark:from-rose-950 dark:to-red-950 dark:text-rose-300 dark:border-rose-700 px-3 py-1"
                      : "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-600 border-slate-300 dark:from-slate-900 dark:to-gray-900 dark:text-slate-400 dark:border-slate-700 px-3 py-1"
                }
              >
                {article.sentiment.label === "positive" && <TrendingUp className="h-3 w-3 mr-1" />}
                <span className="capitalize font-medium">{article.sentiment.label}</span>
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="font-semibold text-blue-600 dark:text-blue-400">{article.source || "News Source"}</span>
          </div>
          {article.pubDate && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(article.pubDate).toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        {article.image && (
          <div className="relative overflow-hidden rounded-xl">
            <img 
              src={article.image || "/placeholder.svg"} 
              alt="" 
              className="h-52 w-full object-cover transition-all duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute top-4 right-4">
              <div className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg">
                <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <p className="text-pretty text-base leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
            {displayText || "No preview available."}
          </p>
        </div>

        {/* AI Summary Section */}
        {showSummary && summary && (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">AI Summary</h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    1-minute read • {summary.split(' ').length} words
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSummary(false)}
                className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {(translatedText || translatedTitle) && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200 dark:border-blue-800">
            <Languages className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Translated to {language.label}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
        {/* Action Buttons - Reorganized for better visibility */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {/* Primary Actions Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Left side buttons */}
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <Button
                size="sm"
                variant={isArticleBookmarked ? "default" : "outline"}
                onClick={handleBookmarkClick}
                aria-pressed={isArticleBookmarked}
                className={`transition-all duration-200 rounded-lg font-medium ${
                  isArticleBookmarked
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
                    : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'
                }`}
              >
                {isArticleBookmarked ? (
                  <><BookmarkCheck className="h-4 w-4 mr-1" />Saved</>
                ) : (
                  <><Bookmark className="h-4 w-4 mr-1" />Save</>
                )}
              </Button>

              {/* AI Summary Button */}
              <Button
                size="sm"
                variant={showSummary ? "default" : "outline"}
                onClick={toggleSummary}
                disabled={summaryLoading}
                className={`transition-all duration-200 rounded-lg font-medium ${
                  showSummary
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                    : 'border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800'
                }`}
              >
                {summaryLoading ? (
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1" />
                ) : (
                  <FileText className="h-4 w-4 mr-1" />
                )}
                {summaryLoading ? 'Generating...' : showSummary ? 'Hide Summary' : 'AI Summary'}
              </Button>

              <VoiceReader
                text={displayTitle + ". " + displayText}
                language={language}
                reading={reading}
                setReading={setReading}
              />

              <Button
                size="sm"
                variant="ghost"
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                title="Share article"
              >
                <Share2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              </Button>
            </div>

            {/* Read Full Article Button - Always Visible on right */}
            <div className="flex justify-center sm:justify-end">
              <a href={article.link} target="_blank" rel="noreferrer">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 group/btn px-4 min-w-[100px]"
                >
                  <span>Read More</span>
                  <ExternalLink className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </a>
            </div>
          </div>
          
          {/* Translation Row - Only show when needed */}
          {language.code !== 'en' && (
            <div className="flex items-center justify-center">
              {!translatedText && !translatedTitle ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={translateArticle}
                  disabled={translating}
                  className="flex items-center gap-2 rounded-lg border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                >
                  {translating ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Languages className="h-4 w-4" />
                  )}
                  <span className="font-medium">{translating ? 'Translating...' : `Translate to ${language.label}`}</span>
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={resetTranslation}
                  className="flex items-center gap-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  <Languages className="h-4 w-4" />
                  <span className="font-medium">Show Original</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
