import "server-only"

const GEMINI_API_KEY = "AIzaSyCHRTOi6tbDttBMoVlx7-muFhkNKPWdPwc"

interface SummaryRequest {
  title: string
  content: string
  source?: string
}

export async function POST(request: Request) {
  try {
    const { title, content, source }: SummaryRequest = await request.json()

    if (!title || !content) {
      return Response.json({
        success: false,
        error: "Title and content are required"
      }, { status: 400 })
    }

    console.log(`Generating summary for: ${title.substring(0, 50)}...`)

    // Create a focused prompt for 1-minute article summaries
    const prompt = `Please provide a concise 1-minute summary of this news article. Focus on the key facts, main points, and essential information that someone could read in about 60 seconds.

Title: ${title}
Source: ${source || 'News Article'}

Article Content:
${content}

Guidelines for summary:
- Keep it to 3-4 sentences maximum (150-200 words)
- Focus on who, what, when, where, why, and how
- Include the most important facts and outcomes
- Maintain neutral, journalistic tone
- Start with the most important information
- Only return the summary text, no additional commentary

Summary:`

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
        }],
        generationConfig: {
          temperature: 0.3, // Lower temperature for more factual summaries
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300, // Limit to ensure concise summaries
        }
      })
    })

    console.log(`Gemini summary response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini summary error: ${errorText}`)

      // Return fallback summary if API fails
      return Response.json({
        success: true,
        summary: generateFallbackSummary(title, content),
        isFallback: true,
        error: `API Error: ${response.status}`
      })
    }

    const data = await response.json()
    console.log('Gemini summary response:', JSON.stringify(data, null, 2))

    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

    if (!summary) {
      console.warn('No summary generated, using fallback')
      return Response.json({
        success: true,
        summary: generateFallbackSummary(title, content),
        isFallback: true
      })
    }

    return Response.json({
      success: true,
      summary,
      wordCount: summary.split(' ').length,
      readingTime: Math.ceil(summary.split(' ').length / 200) // Assuming 200 words per minute
    })

  } catch (error) {
    console.error('Article summary generation failed:', error)

    // Return fallback summary on any error
    return Response.json({
      success: true,
      summary: generateFallbackSummary('Article', 'Content not available'),
      isFallback: true,
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}

// Fallback summary generator for when API fails
function generateFallbackSummary(title: string, content: string): string {
  // Extract first few sentences as fallback
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 3)
  const fallbackSummary = sentences.join('. ').trim()

  if (fallbackSummary.length > 100) {
    return fallbackSummary.substring(0, 200) + '...'
  }

  // If no good content, create a generic summary
  if (fallbackSummary.length < 50) {
    return `${title} - This article provides important information about current events. Please read the full article for complete details and context.`
  }

  return fallbackSummary
}
