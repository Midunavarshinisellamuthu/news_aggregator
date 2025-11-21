import "server-only"

// Language mapping for translation APIs
const LANGUAGE_NAMES: Record<string, string> = {
  'hi': 'Hindi',
  'ta': 'Tamil', 
  'bn': 'Bengali',
  'te': 'Telugu',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'mr': 'Marathi',
  'gu': 'Gujarati',
  'pa': 'Punjabi',
  'en': 'English'
}

// Working translation using MyMemory API (completely free, no key needed)
async function translateText(text: string, sourceLang: string, targetLang: string) {
  try {
    const targetLanguageName = LANGUAGE_NAMES[targetLang] || targetLang
    
    console.log(`🔄 Translating to ${targetLanguageName} using MyMemory API`)
    
    // MyMemory API - free and reliable
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsHub/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translatedText = data.responseData.translatedText
      console.log(`✅ Translation successful: ${translatedText.substring(0, 100)}...`)
      return translatedText
    } else {
      throw new Error('No translation received from MyMemory')
    }
  } catch (error) {
    console.error('❌ Translation failed:', error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { q, source = 'en', target = 'ta' } = body
    
    console.log(`🌍 Translation request: "${q?.substring(0, 50)}..." (${source} → ${target})`)
    
    if (!q || q.trim() === '') {
      return Response.json({ 
        translated: "", 
        success: true, 
        message: "No text to translate"
      })
    }
    
    if (source === target) {
      return Response.json({ 
        translated: q, 
        success: true, 
        message: "Same language - no translation needed"
      })
    }

    // Normalize language codes
    const normalizedSource = source.split('-')[0]
    const normalizedTarget = target.split('-')[0]
    
    const sourceCode = LANGUAGE_NAMES[normalizedSource] ? normalizedSource : 'en'
    const targetCode = LANGUAGE_NAMES[normalizedTarget] ? normalizedTarget : 'en'
    
    try {
      const translatedText = await translateText(q, sourceCode, targetCode)
      
      return Response.json({ 
        translated: translatedText, 
        success: true,
        service: 'MyMemory Translation API',
        originalLength: q.length,
        translatedLength: translatedText.length,
        sourceLanguage: sourceCode,
        targetLanguage: targetCode,
        languageName: LANGUAGE_NAMES[targetCode],
        message: `✅ Successfully translated to ${LANGUAGE_NAMES[targetCode]}`
      })
      
    } catch (translationError) {
      console.error('🚫 Translation failed:', translationError)
      
      // Return original text as fallback
      return Response.json({ 
        translated: q, 
        success: false,
        service: 'Fallback - Original text',
        error: translationError instanceof Error ? translationError.message : "Translation service unavailable",
        originalLength: q.length,
        translatedLength: q.length,
        sourceLanguage: sourceCode,
        targetLanguage: targetCode,
        languageName: LANGUAGE_NAMES[targetCode],
        message: `⚠️ Translation to ${LANGUAGE_NAMES[targetCode]} failed. Showing original text.`
      })
    }
    
  } catch (error) {
    console.error('😱 API error:', error)
    
    return Response.json({ 
      translated: "", 
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Translation service error"
    })
  }
}
