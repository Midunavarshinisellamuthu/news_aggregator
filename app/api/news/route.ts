import "server-only"
import Parser from "rss-parser"
import Sentiment from "sentiment"
import { STATE_NEWS_CONFIG, getStateConfig } from "@/lib/state-news-sources"

const parser = new Parser({
  customFields: {
    item: ["image", "content:encoded"],
  },
})

// Category keywords for enhanced filtering
const CATEGORY_KEYWORDS = {
  sports: [
    'cricket', 'football', 'soccer', 'hockey', 'tennis', 'badminton', 'kabaddi', 'wrestling',
    'olympics', 'championship', 'tournament', 'match', 'game', 'player', 'team', 'score',
    'sports', 'athlete', 'coach', 'stadium', 'league', 'world cup', 'ipl', 'premier league',
    'sports news', 'sport', 'cricketer', 'footballer', 'hockey player', 'tennis player',
    'ipl match', 'cricket match', 'football match', 'sports event', 'athletics', 'boxing',
    'basketball', 'volleyball', 'table tennis', 'chess', 'golf', 'swimming', 'cycling',
    'badminton player', 'wrestler', 'olympic', 'champion', 'medal', 'trophy', 'cup',
    'stadium', 'ground', 'field', 'court', 'rink', 'track', 'pool', 'gymnasium',
    'sports minister', 'sports authority', 'sports federation', 'sports association'
  ],
  tech: [
    'technology', 'startup', 'app', 'software', 'artificial intelligence', 'ai', 'machine learning',
    'blockchain', 'cryptocurrency', 'gadgets', 'smartphone', 'computer', 'internet', 'digital',
    'innovation', 'tech', 'coding', 'programming', 'cybersecurity', 'cloud', 'data',
    'mobile', 'web', 'application', 'platform', 'algorithm', 'database', 'server',
    'network', 'wifi', 'broadband', '5g', '4g', 'telecom', 'communication', 'electronics',
    'hardware', 'processor', 'chip', 'semiconductor', 'robotics', 'automation', 'iot',
    'internet of things', 'vr', 'virtual reality', 'ar', 'augmented reality', 'metaverse',
    'big data', 'analytics', 'api', 'framework', 'library', 'code', 'developer', 'engineer',
    'tech company', 'silicon valley', 'startup funding', 'venture capital', 'ipo',
    'tech news', 'gadget', 'device', 'laptop', 'tablet', 'smartwatch', 'wearable',
    'operating system', 'windows', 'linux', 'android', 'ios', 'app store', 'google play',
    'cyber security', 'hacking', 'malware', 'virus', 'firewall', 'encryption', 'privacy'
  ],
  economics: [
    'economy', 'business', 'market', 'stock', 'share', 'finance', 'banking', 'investment',
    'budget', 'tax', 'revenue', 'gdp', 'growth', 'inflation', 'recession', 'trade', 'commerce',
    'economic', 'financial', 'monetary', 'fiscal', 'policy', 'reserve bank', 'rbi', 'sebi',
    'stock market', 'sensex', 'nifty', 'bse', 'nse', 'share market', 'trading', 'broker',
    'mutual fund', 'etf', 'bond', 'debenture', 'equity', 'debt', 'portfolio', 'dividend',
    'profit', 'loss', 'earnings', 'revenue', 'turnover', 'balance sheet', 'income statement',
    'budget deficit', 'fiscal deficit', 'current account', 'trade deficit', 'surplus',
    'foreign exchange', 'forex', 'currency', 'rupee', 'dollar', 'euro', 'yen', 'pound',
    'interest rate', 'repo rate', 'bank rate', 'crr', 'slr', 'liquidity', 'credit',
    'loan', 'mortgage', 'emi', 'credit card', 'debit card', 'payment', 'transaction',
    'fintech', 'digital banking', 'mobile banking', 'online banking', 'net banking',
    'economic growth', 'development', 'infrastructure', 'industry', 'manufacturing', 'service sector',
    'agriculture', 'farming', 'crop', 'yield', 'production', 'supply chain', 'logistics',
    'export', 'import', 'trade agreement', 'fta', 'wto', 'world bank', 'imf', 'adb'
  ],
  politics: [
    'government', 'election', 'party', 'minister', 'parliament', 'policy', 'law', 'bill',
    'opposition', 'ruling', 'democracy', 'vote', 'campaign', 'politics', 'political',
    'politician', 'mla', 'mp', 'mps', 'legislator', 'assembly', 'lok sabha', 'rajya sabha',
    'vidhan sabha', 'legislative', 'legislation', 'act', 'ordinance', 'notification', 'gazette',
    'cabinet', 'council of ministers', 'prime minister', 'pm', 'chief minister', 'cm',
    'governor', 'president', 'vice president', 'speaker', 'chairman', 'leader', 'secretary',
    'bjp', 'congress', 'inc', 'bsp', 'sp', 'aap', 'tmc', 'dmk', 'aiadmk', 'jdu', 'rjd',
    'shiv sena', 'ncp', 'cpi', 'cpim', 'tmc', 'bjd', 'ysrcp', 'tdp', 'jds', 'political party',
    'coalition', 'alliance', 'nda', 'upa', 'mahagathbandhan', 'front', 'bloc', 'faction',
    'election commission', 'ec', 'eci', 'polling', 'booth', 'voter', 'constituency', 'ward',
    'municipality', 'corporation', 'panchayat', 'gram sabha', 'local body', 'urban local body',
    'rural development', 'panchayati raj', 'decentralization', 'governance', 'administration',
    'bureaucracy', 'bureaucrat', 'ias', 'ips', 'irs', 'civil service', 'public service',
    'policy making', 'decision making', 'reform', 'scheme', 'program', 'initiative', 'project',
    'manifesto', 'agenda', 'ideology', 'left', 'right', 'center', 'liberal', 'conservative',
    'nationalism', 'secularism', 'communalism', 'caste', 'religion', 'minority', 'majority',
    'reservation', 'quota', 'affirmative action', 'social justice', 'equality', 'inequality',
    'corruption', 'scam', 'vigilance', 'cbi', 'ed', 'income tax', 'raid', 'probe', 'inquiry',
    'supreme court', 'high court', 'district court', 'tribunal', 'judiciary', 'justice', 'judge',
    'lawyer', 'advocate', 'bar council', 'legal', 'constitution', 'fundamental rights', 'directive principles',
    'federalism', 'center-state relations', 'autonomy', 'special status', 'article 370', 'article 35a',
    'national security', 'defense', 'military', 'army', 'navy', 'air force', 'paramilitary',
    'border', 'terrorism', 'naxalism', 'maoism', 'insurgency', 'militancy', 'extremism',
    'foreign policy', 'diplomacy', 'international relations', 'summit', 'treaty', 'agreement',
    'united nations', 'un', 'uno', 'security council', 'general assembly', 'human rights', 'climate change',
    'environment', 'pollution', 'global warming', 'sustainable development', 'sdg', 'agenda 2030'
  ],
  crime: [
    'crime', 'criminal', 'police', 'arrest', 'investigation', 'murder', 'robbery', 'theft',
    'fraud', 'scam', 'court', 'trial', 'conviction', 'sentence', 'prison', 'jail',
    'crime news', 'criminal case', 'police investigation', 'arrested', 'accused', 'suspect',
    'witness', 'evidence', 'forensic', 'postmortem', 'autopsy', 'inquest', 'magistrate',
    'judicial custody', 'police custody', 'bail', 'bond', 'surety', 'warrant', 'summons',
    'charge sheet', 'chargesheet', 'fir', 'first information report', 'complaint', 'plaintiff',
    'defendant', 'prosecution', 'defense', 'lawyer', 'advocate', 'public prosecutor', 'pp',
    'sessions court', 'district court', 'high court', 'supreme court', 'apex court', 'bench',
    'judgment', 'verdict', 'order', 'decree', 'appeal', 'revision', 'review', 'petition',
    'plea', 'application', 'motion', 'stay', 'injunction', 'interim order', 'status quo',
    'murder case', 'homicide', 'manslaughter', 'culpable homicide', 'dowry death', 'honor killing',
    'rape', 'sexual assault', 'molestation', 'harassment', 'eve teasing', 'stalking', 'voyeurism',
    'kidnapping', 'abduction', 'trafficking', 'human trafficking', 'child trafficking', 'organ trafficking',
    'robbery', 'dacoity', 'burglary', 'house breaking', 'theft', 'auto theft', 'chain snatching',
    'pickpocketing', 'shoplifting', 'cyber crime', 'online fraud', 'phishing', 'hacking',
    'identity theft', 'credit card fraud', 'bank fraud', 'insurance fraud', 'tax evasion',
    'money laundering', 'hawala', 'black money', 'benami', 'shell company', 'fake currency',
    'counterfeit', 'forgery', 'cheating', 'breach of trust', 'criminal breach of trust',
    'misappropriation', 'embezzlement', 'corruption', 'bribe', 'bribery', 'graft', 'kickback',
    'vigilance', 'anti-corruption', 'cbi', 'ed', 'enforcement directorate', 'sfio', 'serious fraud investigation office',
    'narcotics', 'drugs', 'drug trafficking', 'ndps', 'narcotic drugs and psychotropic substances',
    'liquor', 'alcohol', 'prohibition', 'excise', 'bootlegging', 'illicit liquor', 'spurious liquor',
    'gambling', 'betting', 'lottery', 'casino', 'online gambling', 'match fixing', 'spot fixing',
    'domestic violence', 'dowry', 'cruelty', 'matrimonial dispute', 'maintenance', 'alimony',
    'child custody', 'guardianship', 'adoption', 'juvenile', 'minor', 'child', 'protection',
    'poco', 'prevention of children from sexual offences', 'child abuse', 'child labor', 'bonded labor',
    'hit and run', 'rash driving', 'drunken driving', 'drunk driving', 'road accident', 'traffic violation',
    'arms', 'weapons', 'firearms', 'ammunition', 'explosives', 'bomb', 'grenade', 'terrorist',
    'terrorism', 'terror', 'extremist', 'militant', 'insurgent', 'naxal', 'maoist', 'left wing extremism',
    'encounter', 'fake encounter', 'custodial death', 'custodial violence', 'police brutality',
    'lynching', 'mob violence', 'communal violence', 'riot', 'clash', 'conflict', 'dispute',
    'assault', 'battery', 'hurt', 'grievous hurt', 'wounding', 'injury', 'bodily harm',
    'attempt to murder', 'conspiracy', 'abetment', 'criminal conspiracy', 'joint liability',
    'accomplice', 'accessory', 'principal offender', 'kingpin', 'mastermind', 'organized crime',
    'gang', 'gangster', 'underworld', 'don', 'mafia', 'syndicate', 'cartel', 'smuggling',
    'wildlife crime', 'poaching', 'illegal hunting', 'forest', 'sanctuary', 'national park',
    'environmental crime', 'pollution', 'illegal mining', 'sand mafia', 'land mafia', 'water mafia',
    'cyberbullying', 'trolling', 'online harassment', 'revenge porn', 'deepfake', 'morphing',
    'intellectual property', 'copyright', 'trademark', 'patent', 'piracy', 'infringement',
    'economic offence', 'financial crime', 'white collar crime', 'corporate crime', 'insider trading',
    'securities fraud', 'market manipulation', 'ponzi scheme', 'chit fund', 'pyramid scheme',
    'fake news', 'misinformation', 'disinformation', 'propaganda', 'hate speech', 'sedition'
  ]
}

function categorizeArticle(title: string, text: string, sourceCategory?: string): string[] {
  const content = `${title} ${text}`.toLowerCase()
  const categories: string[] = []

  // If source has a category, include it
  if (sourceCategory) {
    categories.push(sourceCategory)
  }

  // Check for category keywords with improved matching
  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    // Count keyword matches for better accuracy
    const matches = keywords.filter(keyword => {
      // Use word boundary matching for better accuracy
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      return regex.test(content)
    })

    // Only categorize if we have at least 2 keyword matches or 1 strong match
    if (matches.length >= 2 || (matches.length === 1 && matches[0].length > 10)) {
      categories.push(category)
    }
  })

  // Special handling for articles that might fit multiple categories
  // Remove duplicates and prioritize based on keyword count
  const categoryCount: Record<string, number> = {}
  categories.forEach(cat => {
    categoryCount[cat] = (categoryCount[cat] || 0) + 1
  })

  // Return categories sorted by relevance (most matches first)
  return Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .map(([category]) => category)
    .slice(0, 3) // Limit to top 3 most relevant categories
}

const sentiment = new Sentiment()

// Get RSS sources based on selected state with proper categories
function getRssSources(stateCode: string): { name: string; url: string; category?: string; stateCode?: string }[] {
  const nationalSources: { name: string; url: string; category: string }[] = [
    // Major National Newspapers - General/Politics
    { name: "The Hindu - India", url: "https://www.thehindu.com/news/national/feeder/default.rss", category: "politics" },
    { name: "The Hindu - World", url: "https://www.thehindu.com/news/international/feeder/default.rss", category: "politics" },
    { name: "Indian Express - India", url: "https://indianexpress.com/section/india/feed/", category: "politics" },
    { name: "Indian Express - World", url: "https://indianexpress.com/section/world/feed/", category: "politics" },
    { name: "Times of India - India", url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms", category: "politics" },
    { name: "Times of India - World", url: "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms", category: "politics" },
    { name: "Hindustan Times - India", url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml", category: "politics" },
    { name: "Hindustan Times - World", url: "https://www.hindustantimes.com/feeds/rss/world-news/rssfeed.xml", category: "politics" },

    // News Agencies - General/Politics
    { name: "PTI News", url: "https://www.ptinews.com/rss/national.xml", category: "politics" },
    { name: "ANI News", url: "https://www.aninews.in/rss/", category: "politics" },

    // TV News Channels - General/Politics
    { name: "NDTV - India", url: "https://feeds.feedburner.com/ndtvnews-india-news", category: "politics" },
    { name: "NDTV - World", url: "https://feeds.feedburner.com/ndtvnews-world-news", category: "politics" },
    { name: "CNN News18", url: "https://www.news18.com/rss/india.xml", category: "politics" },
    { name: "India Today", url: "https://www.indiatoday.in/rss/1206514", category: "politics" },
    { name: "Republic World", url: "https://www.republicworld.com/feeds/india-news.xml", category: "politics" },

    // Business & Economy
    { name: "Economic Times", url: "https://economictimes.indiatimes.com/rssfeedsdefault.cms", category: "economics" },
    { name: "Business Standard", url: "https://www.business-standard.com/rss/home_page_top_stories.rss", category: "economics" },
    { name: "Mint", url: "https://www.livemint.com/rss/news", category: "economics" },

    // Regional & Specialized - General/Politics
    { name: "The Wire", url: "https://thewire.in/feed", category: "politics" },
    { name: "Scroll.in", url: "https://scroll.in/feed", category: "politics" },
    { name: "News18 Hindi", url: "https://hindi.news18.com/rss/india.xml", category: "politics" },
    { name: "Aaj Tak", url: "https://www.aajtak.in/rss/india.xml", category: "politics" },

    // Sports
    { name: "Times of India Sports", url: "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms", category: "sports" },
    { name: "Indian Express Sports", url: "https://indianexpress.com/section/sports/feed/", category: "sports" },

    // Technology
    { name: "Times of India Tech", url: "https://timesofindia.indiatimes.com/rssfeeds/66949542.cms", category: "tech" },
    { name: "Indian Express Tech", url: "https://indianexpress.com/section/technology/feed/", category: "tech" },
  ]

  // If a specific state is selected, prioritize state-specific sources
  if (stateCode !== "all") {
    const stateConfig = getStateConfig(stateCode)
    if (stateConfig) {
      // Add state-specific sources with state code but no default category
      const stateSources = stateConfig.sources.map(src => ({
        ...src,
        stateCode: stateCode
        // Remove hardcoded category to allow proper content-based categorization
      }))
      // Return state sources first, then national sources
      return [...stateSources, ...nationalSources]
    }
  }

  return nationalSources
}

// Simple extractive summary: pick 2-3 informative sentences
function summarize(text: string, maxSentences = 3) {
  const clean = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const sentences = clean.split(/(?<=[.?!])\s+/).filter((s) => s.length > 30)
  return sentences.slice(0, maxSentences).join(" ")
}

function labelSentiment(score: number): "positive" | "neutral" | "negative" {
  if (score > 1) return "positive"
  if (score < -1) return "negative"
  return "neutral"
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") || "").toLowerCase()
  const category = (searchParams.get("category") || "all").toLowerCase()
  const state = (searchParams.get("state") || "all") // Keep original case for state codes

  // Get appropriate RSS sources based on state selection
  const SOURCES = getRssSources(state)
  
  // Get state configuration for better filtering
  const stateConfig = state !== "all" ? getStateConfig(state) : null

  // Fetch all RSS feeds in parallel with timeout and error handling
  const feeds = await Promise.allSettled(
    SOURCES.map(async (src) => {
      try {
        // Add timeout to prevent hanging on slow RSS feeds
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const feed = await parser.parseURL(src.url)
        clearTimeout(timeoutId)
        return { src, feed }
      } catch (error) {
        console.warn(`Failed to fetch RSS from ${src.name}: ${error}`)
        throw error
      }
    }),
  )

  const now = Date.now()
  const articles = []

  for (const res of feeds) {
    if (res.status !== "fulfilled") continue
    const { src, feed } = res.value
    for (const item of feed.items.slice(0, 20)) {
      const text = (item.contentSnippet || item.content || "").toString()
      const title = (item.title || "").toString()
      const link = (item.link || "").toString()
      const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : undefined
      const full = (item["content:encoded"] || item.content || "").toString()

      // Categorize the article first
      const articleCategories = categorizeArticle(title, text, (src as any).category)

      // Filters
      const matchesQuery = q ? title.toLowerCase().includes(q) || text.toLowerCase().includes(q) : true

      // Category filter - now uses both source-based categorization and keyword matching
      const matchesCategory = category === "all" || articleCategories.includes(category)

      // Enhanced state filter with keywords and city names
      let matchesState = true
      if (state !== "all" && stateConfig) {
        const lowerTitle = title.toLowerCase()
        const lowerText = text.toLowerCase()
        const fullContent = `${lowerTitle} ${lowerText}`

        // Check if this is from a state-specific RSS source
        const isStateSource = (src as any).stateCode === state

        if (isStateSource) {
          // If it's from a state-specific source, include it by default
          matchesState = true
        } else {
          // For national sources, check if it mentions the state, its keywords, or cities
          matchesState =
            // Check state name (exact match)
            fullContent.includes(stateConfig.name.toLowerCase()) ||
            // Check state keywords (political parties, leaders, etc.)
            stateConfig.keywords.some(keyword => {
              const keywordLower = keyword.toLowerCase()
              // Use word boundary matching for better accuracy
              const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
              return regex.test(fullContent)
            }) ||
            // Check major cities (with word boundaries for better matching)
            stateConfig.cities.some(city => {
              const cityLower = city.toLowerCase()
              const regex = new RegExp(`\\b${cityLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
              return regex.test(fullContent)
            })
        }

        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log(`Article: "${title.substring(0, 50)}..." | State: ${state} | Matches: ${matchesState} | Source: ${src.name} | IsStateSource: ${isStateSource}`)
        }
      }

      // Additional fallback: if no categories found, try to infer from title patterns
      if (articleCategories.length === 0) {
        const fallbackCategories = []
        if (/\b(cricket|football|match|player|team|sports?)\b/i.test(title)) fallbackCategories.push('sports')
        if (/\b(tech|startup|app|software|ai|blockchain)\b/i.test(title)) fallbackCategories.push('tech')
        if (/\b(economy|business|market|stock|finance)\b/i.test(title)) fallbackCategories.push('economics')
        if (/\b(politics?|government|election|minister)\b/i.test(title)) fallbackCategories.push('politics')
        if (/\b(crime|police|arrest|court|murder)\b/i.test(title)) fallbackCategories.push('crime')

        if (fallbackCategories.length > 0) {
          articleCategories.push(...fallbackCategories)
        }
      }

      if (!(matchesQuery && matchesCategory && matchesState)) continue

      // Sentiment
      const senti = sentiment.analyze(`${title}. ${text}`)
      const sentimentLabel = labelSentiment(senti.score)

      // Summary
      const summary = summarize(full || text)

      // Rough "breaking" flag: published within last 15 minutes
      const isBreaking = pubDate ? now - new Date(pubDate).getTime() < 15 * 60 * 1000 : false

      articles.push({
        title,
        link,
        contentSnippet: text,
        pubDate,
        source: src.name || feed.title,
        image: null,
        category: articleCategories,
        sentiment: { score: senti.score, comparative: senti.comparative, label: sentimentLabel },
        summary,
        isBreaking,
        stateCode: (src as any).stateCode || null,
      })
    }
  }

  // Sort recent first
  articles.sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())

  return Response.json({ articles, updatedAt: new Date().toISOString() }, { status: 200 })
}
