// State-specific RSS feeds and keywords for Indian states
export interface StateNewsConfig {
  code: string
  name: string
  keywords: string[]
  cities: string[]
  sources: { name: string; url: string }[]
}

export const STATE_NEWS_CONFIG: StateNewsConfig[] = [
  {
    code: "TN",
    name: "Tamil Nadu",
    keywords: ["tamil nadu", "chennai", "madras", "dmk", "aiadmk", "stalin", "palaniswami", "tamil", "tn govt", "chief minister tamil nadu"],
    cities: ["chennai", "coimbatore", "madurai", "tiruchirappalli", "trichy", "salem", "tirunelveli", "erode", "vellore", "thoothukudi", "thanjavur", "tirupur", "dindigul"],
    sources: [
      { name: "The Hindu - Tamil Nadu", url: "https://www.thehindu.com/news/national/tamil-nadu/feeder/default.rss" },
      { name: "Times of India - Chennai", url: "https://timesofindia.indiatimes.com/rssfeeds/2950623.cms" },
      { name: "Indian Express - Tamil Nadu", url: "https://indianexpress.com/section/cities/chennai/feed/" },
      { name: "The New Indian Express - Tamil Nadu", url: "https://www.newindianexpress.com/states/tamil-nadu.rss" },
      { name: "Deccan Chronicle - Tamil Nadu", url: "https://www.deccanchronicle.com/rss_feed/tamil-nadu" },
    ]
  },
  {
    code: "MH",
    name: "Maharashtra",
    keywords: ["maharashtra", "mumbai", "bombay", "pune", "nagpur", "shiv sena", "ncp", "uddhav thackeray", "eknath shinde", "fadnavis", "mh govt", "maharashtra government"],
    cities: ["mumbai", "pune", "nagpur", "thane", "nashik", "aurangabad", "solapur", "amravati", "kolhapur", "sangli", "satara", "ahmednagar"],
    sources: [
      { name: "Times of India - Mumbai", url: "https://timesofindia.indiatimes.com/rssfeeds/442002.cms" },
      { name: "Indian Express - Mumbai", url: "https://indianexpress.com/section/cities/mumbai/feed/" },
      { name: "Indian Express - Pune", url: "https://indianexpress.com/section/cities/pune/feed/" },
      { name: "Mid Day Mumbai", url: "https://www.mid-day.com/Resources/midday/rss/mumbai-news.xml" },
      { name: "Mumbai Mirror", url: "https://mumbaimirror.indiatimes.com/rssfeeds/442003.cms" },
    ]
  },
  {
    code: "KA",
    name: "Karnataka",
    keywords: ["karnataka", "bengaluru", "bangalore", "mysore", "mysuru", "mangalore"],
    cities: ["bengaluru", "mysuru", "mangaluru", "hubli", "belgaum"],
    sources: [
      { name: "The Hindu - Karnataka", url: "https://www.thehindu.com/news/national/karnataka/feeder/default.rss" },
      { name: "Times of India - Bangalore", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128833038.cms" },
      { name: "Deccan Herald - Karnataka", url: "https://www.deccanherald.com/karnataka.rss" },
    ]
  },
  {
    code: "DL",
    name: "Delhi",
    keywords: ["delhi", "new delhi", "ncr", "noida", "gurgaon", "kejriwal"],
    cities: ["new delhi", "delhi", "noida", "gurgaon", "faridabad"],
    sources: [
      { name: "The Hindu - Delhi", url: "https://www.thehindu.com/news/cities/Delhi/feeder/default.rss" },
      { name: "Times of India - Delhi", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128839596.cms" },
      { name: "Hindustan Times - Delhi", url: "https://www.hindustantimes.com/feeds/rss/delhi-news/rssfeed.xml" },
    ]
  },
  {
    code: "WB",
    name: "West Bengal",
    keywords: ["west bengal", "kolkata", "calcutta", "mamata", "tmc", "trinamool"],
    cities: ["kolkata", "howrah", "durgapur", "asansol", "siliguri"],
    sources: [
      { name: "Times of India - Kolkata", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128830821.cms" },
      { name: "Telegraph India - West Bengal", url: "https://www.telegraphindia.com/feeds/west-bengal-rss.xml" },
    ]
  },
  {
    code: "GJ",
    name: "Gujarat",
    keywords: ["gujarat", "ahmedabad", "surat", "vadodara", "rajkot"],
    cities: ["ahmedabad", "surat", "vadodara", "rajkot", "gandhinagar"],
    sources: [
      { name: "Times of India - Ahmedabad", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128821153.cms" },
      { name: "Gujarat Samachar", url: "https://www.gujaratsamachar.com/rss/top-stories" },
    ]
  },
  {
    code: "RJ",
    name: "Rajasthan",
    keywords: ["rajasthan", "jaipur", "jodhpur", "udaipur", "ajmer"],
    cities: ["jaipur", "jodhpur", "udaipur", "ajmer", "kota"],
    sources: [
      { name: "Times of India - Jaipur", url: "https://timesofindia.indiatimes.com/rssfeeds/3012544.cms" },
      { name: "Rajasthan Patrika", url: "https://www.patrika.com/rss/rajasthan-news" },
    ]
  },
  {
    code: "UP",
    name: "Uttar Pradesh",
    keywords: ["uttar pradesh", "lucknow", "kanpur", "agra", "varanasi", "yogi"],
    cities: ["lucknow", "kanpur", "agra", "varanasi", "allahabad", "noida"],
    sources: [
      { name: "Times of India - Lucknow", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128819658.cms" },
      { name: "Hindustan Times - UP", url: "https://www.hindustantimes.com/feeds/rss/uttar-pradesh/rssfeed.xml" },
    ]
  },
  {
    code: "BR",
    name: "Bihar",
    keywords: ["bihar", "patna", "gaya", "nitish kumar", "tejashwi"],
    cities: ["patna", "gaya", "bhagalpur", "muzaffarpur"],
    sources: [
      { name: "Times of India - Patna", url: "https://timesofindia.indiatimes.com/rssfeeds/-2128817995.cms" },
      { name: "Hindustan Times - Bihar", url: "https://www.hindustantimes.com/feeds/rss/bihar/rssfeed.xml" },
    ]
  },
  {
    code: "MP",
    name: "Madhya Pradesh",
    keywords: ["madhya pradesh", "bhopal", "indore", "jabalpur", "gwalior"],
    cities: ["bhopal", "indore", "jabalpur", "gwalior", "ujjain"],
    sources: [
      { name: "Times of India - Bhopal", url: "https://timesofindia.indiatimes.com/rssfeeds/1898055.cms" },
    ]
  },
  {
    code: "AP",
    name: "Andhra Pradesh",
    keywords: ["andhra pradesh", "amaravati", "vizag", "vijayawada", "jagan", "naidu"],
    cities: ["visakhapatnam", "vijayawada", "guntur", "tirupati"],
    sources: [
      { name: "The Hindu - Andhra Pradesh", url: "https://www.thehindu.com/news/national/andhra-pradesh/feeder/default.rss" },
    ]
  },
  {
    code: "TG",
    name: "Telangana",
    keywords: ["telangana", "hyderabad", "secunderabad", "kcr", "ktr"],
    cities: ["hyderabad", "warangal", "nizamabad", "karimnagar"],
    sources: [
      { name: "The Hindu - Telangana", url: "https://www.thehindu.com/news/national/telangana/feeder/default.rss" },
      { name: "Telangana Today", url: "https://telanganatoday.com/feed" },
    ]
  },
  {
    code: "KL",
    name: "Kerala",
    keywords: ["kerala", "thiruvananthapuram", "kochi", "kozhikode", "pinarayi"],
    cities: ["thiruvananthapuram", "kochi", "kozhikode", "thrissur"],
    sources: [
      { name: "The Hindu - Kerala", url: "https://www.thehindu.com/news/national/kerala/feeder/default.rss" },
      { name: "Manorama Online", url: "https://www.manoramaonline.com/news/kerala.rss" },
    ]
  },
  {
    code: "OR",
    name: "Odisha",
    keywords: ["odisha", "orissa", "bhubaneswar", "cuttack", "naveen patnaik"],
    cities: ["bhubaneswar", "cuttack", "puri", "rourkela"],
    sources: [
      { name: "Odisha TV", url: "https://odishatv.in/feed" },
    ]
  },
  {
    code: "PB",
    name: "Punjab",
    keywords: ["punjab", "chandigarh", "amritsar", "ludhiana", "bhagwant mann"],
    cities: ["chandigarh", "ludhiana", "amritsar", "jalandhar"],
    sources: [
      { name: "Tribune India - Punjab", url: "https://www.tribuneindia.com/rss/punjab" },
    ]
  },
  {
    code: "HR",
    name: "Haryana",
    keywords: ["haryana", "gurgaon", "gurugram", "faridabad", "khattar"],
    cities: ["gurgaon", "faridabad", "ambala", "karnal"],
    sources: [
      { name: "Tribune India - Haryana", url: "https://www.tribuneindia.com/rss/haryana" },
    ]
  },
  {
    code: "JH",
    name: "Jharkhand",
    keywords: ["jharkhand", "ranchi", "jamshedpur", "dhanbad", "hemant soren"],
    cities: ["ranchi", "jamshedpur", "dhanbad", "bokaro"],
    sources: [
      { name: "Telegraph India - Jharkhand", url: "https://www.telegraphindia.com/feeds/jharkhand-rss.xml" },
    ]
  },
  {
    code: "AS",
    name: "Assam",
    keywords: ["assam", "guwahati", "dispur", "himanta biswa sarma"],
    cities: ["guwahati", "dispur", "dibrugarh", "jorhat"],
    sources: [
      { name: "The Assam Tribune", url: "https://assamtribune.com/feed" },
    ]
  }
]

// Helper function to get state config by code
export function getStateConfig(stateCode: string): StateNewsConfig | undefined {
  return STATE_NEWS_CONFIG.find(s => s.code === stateCode)
}

// Helper function to get all state RSS sources
export function getAllStateRssSources(): { name: string; url: string; stateCode: string }[] {
  const sources: { name: string; url: string; stateCode: string }[] = []
  STATE_NEWS_CONFIG.forEach(state => {
    state.sources.forEach(source => {
      sources.push({ ...source, stateCode: state.code })
    })
  })
  return sources
}
