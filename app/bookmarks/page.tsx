"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useBookmarksDB } from "@/hooks/use-bookmarks-db"
import { NewsCard } from "@/components/news-card"
import { LANGUAGES } from "@/lib/constants"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bookmark, ArrowLeft, Heart, Newspaper, LogIn } from "lucide-react"

export default function BookmarksPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { bookmarksList: list } = useBookmarksDB()
  const language = LANGUAGES[0] // default English

  if (!isAuthenticated) {
    return (
      <main className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Please Sign In</h1>
            <p className="text-slate-600 dark:text-slate-400">You need to be logged in to view your bookmarks</p>
          </div>
          <Button
            onClick={() => router.push('/login')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bookmark className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Your Bookmarks</h1>
              </div>
              <p className="text-muted-foreground">
                {list.length} {list.length === 1 ? 'article' : 'articles'} saved for later reading
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to News
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No bookmarks yet</h3>
              <p className="text-muted-foreground mb-4">Start saving articles you want to read later</p>
              <Link href="/">
                <Button className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  Browse News
                </Button>
              </Link>
            </div>
          ) : (
            list.map((article) => (
              <NewsCard
                key={article.link}
                article={article}
                language={language}
              />
            ))
          )}
        </div>
      </div>
    </main>
  )
}
