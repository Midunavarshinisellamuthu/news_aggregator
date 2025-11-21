import { NextRequest, NextResponse } from 'next/server'

interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  volume_24h: number
  last_updated: string
  image?: string
}

interface CryptoResponse {
  data: CryptoData[]
  timestamp: string
}

// Mock data - in a real app, you'd fetch from CoinGecko API or similar
const mockCryptoData: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    current_price: 65420.50,
    price_change_24h: 1247.85,
    price_change_percentage_24h: 1.95,
    market_cap: 1284592847392,
    volume_24h: 28472958391,
    last_updated: new Date().toISOString()
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    current_price: 2587.42,
    price_change_24h: -43.12,
    price_change_percentage_24h: -1.64,
    market_cap: 311784523847,
    volume_24h: 12847592847,
    last_updated: new Date().toISOString()
  },
  {
    id: 'binancecoin',
    symbol: 'BNB',
    name: 'BNB',
    current_price: 592.15,
    price_change_24h: 8.94,
    price_change_percentage_24h: 1.53,
    market_cap: 86284759382,
    volume_24h: 1847592847,
    last_updated: new Date().toISOString()
  },
  {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    current_price: 0.5247,
    price_change_24h: 0.0234,
    price_change_percentage_24h: 4.67,
    market_cap: 29847592847,
    volume_24h: 847592847,
    last_updated: new Date().toISOString()
  },
  {
    id: 'cardano',
    symbol: 'ADA',
    name: 'Cardano',
    current_price: 0.3654,
    price_change_24h: -0.0089,
    price_change_percentage_24h: -2.37,
    market_cap: 12847592847,
    volume_24h: 384759284,
    last_updated: new Date().toISOString()
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    current_price: 142.67,
    price_change_24h: 5.23,
    price_change_percentage_24h: 3.81,
    market_cap: 67482959384,
    volume_24h: 2847592847,
    last_updated: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'top'

    // Add some randomization to simulate real-time price changes
    const randomizedData = mockCryptoData.map(crypto => ({
      ...crypto,
      current_price: crypto.current_price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
      price_change_24h: crypto.price_change_24h + (Math.random() - 0.5) * 20,
      price_change_percentage_24h: crypto.price_change_percentage_24h + (Math.random() - 0.5) * 2,
      last_updated: new Date().toISOString()
    }))

    let filteredData = randomizedData

    if (category === 'watchlist') {
      // Return only user's watchlist items (BTC, ETH, ADA for demo)
      filteredData = randomizedData.filter(crypto => 
        ['bitcoin', 'ethereum', 'cardano'].includes(crypto.id)
      )
    } else {
      // Return top cryptocurrencies
      filteredData = randomizedData.slice(0, 6)
    }

    const response: CryptoResponse = {
      data: filteredData,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })

  } catch (error) {
    console.error('Error fetching crypto data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency data' },
      { status: 500 }
    )
  }
}

// In a real app, you might want to integrate with CoinGecko API
export async function fetchFromCoinGecko() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('CoinGecko API request failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error)
    throw error
  }
}