"use client"

import { INDIAN_STATES, NEWS_CATEGORIES, type LanguageOption, LANGUAGES } from "@/lib/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Filter, MapPin, Globe, Tag, Settings } from "lucide-react"

export function FiltersBar({
  category,
  onCategoryChange,
  stateCode,
  onStateChange,
  language,
  onLanguageChange,
}: {
  category: string
  onCategoryChange: (v: string) => void
  stateCode: string
  onStateChange: (v: string) => void
  language: LanguageOption
  onLanguageChange: (v: LanguageOption) => void
}) {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
              <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Filter & Customize</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Personalize your news experience</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Translation available</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/50">
                <Tag className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              Category
            </label>
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger aria-label="Select category" className="h-11 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700">
                <SelectItem value="all" className="rounded-lg">All Categories</SelectItem>
                {NEWS_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="rounded-lg">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/50">
                <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              State
            </label>
            <Select value={stateCode} onValueChange={onStateChange}>
              <SelectTrigger aria-label="Select Indian state" className="h-11 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] rounded-xl border-slate-200 dark:border-slate-700">
                <SelectItem value="all" className="rounded-lg">All States</SelectItem>
                {INDIAN_STATES.map((s) => (
                  <SelectItem key={s.code} value={s.code} className="rounded-lg">
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <div className="p-1 rounded bg-purple-100 dark:bg-purple-900/50">
                <Globe className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              </div>
              Language
            </label>
            <Select
              value={language.code}
              onValueChange={(code) => {
                const found = LANGUAGES.find((l) => l.code === code) || LANGUAGES[0]
                onLanguageChange(found)
              }}
            >
              <SelectTrigger aria-label="Select language" className="h-11 border-slate-200 dark:border-slate-700 rounded-xl focus:border-blue-500 focus:ring-blue-500/20">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700">
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code} className="rounded-lg">
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  )
}
