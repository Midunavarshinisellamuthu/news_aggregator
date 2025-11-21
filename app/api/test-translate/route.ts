import { NextResponse } from "next/server"


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


const GEMINI_API_KEY = "AIzaSyCHRTOi6tbDttBMoVlx7-muFhkNKPWdPwc"

export async function GET() {
  const testText = "Hello, how are you?"
  const targetLang = "ta" 
  
  try {
    console.log('Starting test translation...')
    
    const prompt = `Translate the following text from English to Tamil. 
    IMPORTANT: Provide ONLY the translated text, no explanations or additional comments.
    Text: "${testText}"`
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'API request failed',
        status: response.status,
        details: error
      }, { status: 500 })
    }

    const data = await response.json()
    console.log('Gemini API response:', JSON.stringify(data, null, 2))
    
    let translatedText = ''
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      translatedText = data.candidates[0].content.parts[0].text.trim()
    }
    
    return NextResponse.json({
      success: true,
      original: testText,
      translated: translatedText,
      targetLanguage: 'Tamil',
      rawResponse: data // Include full response for debugging
    })
    
  } catch (error) {
    console.error('Test translation failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      original: testText,
      targetLanguage: 'Tamil'
    }, { status: 500 })
  }
}
