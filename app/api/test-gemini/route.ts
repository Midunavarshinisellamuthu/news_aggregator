import "server-only"

const GEMINI_API_KEY =  "AIzaSyCHRTOi6tbDttBMoVlx7-muFhkNKPWdPwc"

export async function GET() {
  try {
    console.log('Testing Gemini API...')
    
    const prompt = "Translate 'Hello world' to Hindi. Only return the translated text."
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
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

    console.log(`Gemini test response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini test error: ${errorText}`)
      return Response.json({ 
        success: false, 
        error: `API Error: ${response.status}`,
        details: errorText
      })
    }

    const data = await response.json()
    console.log('Gemini test response:', JSON.stringify(data, null, 2))
    
    const translatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    
    return Response.json({ 
      success: true,
      original: "Hello world",
      translated: translatedText,
      fullResponse: data
    })
    
  } catch (error) {
    console.error('Gemini test failed:', error)
    return Response.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    })
  }
}
