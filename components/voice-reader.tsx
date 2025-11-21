"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import type { LanguageOption } from "@/lib/constants"

export function VoiceReader({
  text,
  language,
  reading,
  setReading,
}: {
  text: string
  language: LanguageOption
  reading: boolean
  setReading: (v: boolean) => void
}) {
  const speak = () => {
    if (typeof window === "undefined") return
    const utter = new SpeechSynthesisUtterance(text)
    // Try to match voice by language code; fallback to default.
    const voices = window.speechSynthesis.getVoices()
    const match = voices.find((v) => v.lang?.toLowerCase().startsWith(language.code.toLowerCase()))
    if (match) utter.voice = match
    utter.lang = language.code
    utter.onend = () => setReading(false)
    setReading(true)
    window.speechSynthesis.speak(utter)
  }

  const stop = () => {
    if (typeof window === "undefined") return
    window.speechSynthesis.cancel()
    setReading(false)
  }

  return (
    <>
      {reading ? (
        <Button size="sm" variant="secondary" onClick={stop} className="flex items-center gap-1">
          <VolumeX className="h-3 w-3" />
          Stop
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={speak} className="flex items-center gap-1">
          <Volume2 className="h-3 w-3" />
          Listen
        </Button>
      )}
    </>
  )
}
