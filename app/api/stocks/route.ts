import { NextResponse } from 'next/server'

// Mock data for Indian and major stock indices
const mockStockData = [
  // Indian Stock Indices
  {
    symbol: '^NSEI',
    name: 'Nifty 50',
    price: 19674.25,
    change: 125.30,
    changePercent: 0.64,
    open: 19580.15,
    high: 19725.80,
    low: 19545.60,
    volume: 23456789,
    previousClose: 19548.95,
    lastUpdated: new Date().toISOString(),
    market: 'NSE',
    currency: 'INR'
  },
  {
    symbol: '^BSESN',
    name: 'Sensex',
    price: 65875.47,
    change: 412.83,
    changePercent: 0.63,
    open: 65580.20,
    high: 65920.35,
    low: 65485.90,
    volume: 12345678,
    previousClose: 65462.64,
    lastUpdated: new Date().toISOString(),
    market: 'BSE',
    currency: 'INR'
  },
  {
    symbol: 'RELIANCE.NS',
    name: 'Reliance Industries',
    price: 2456.85,
    change: 23.40,
    changePercent: 0.96,
    open: 2445.20,
    high: 2468.90,
    low: 2435.15,
    volume: 3456789,
    previousClose: 2433.45,
    lastUpdated: new Date().toISOString(),
    market: 'NSE',
    currency: 'INR'
  },
  {
    symbol: 'TCS.NS',
    name: 'Tata Consultancy Services',
    price: 3567.75,
    change: -18.25,
    changePercent: -0.51,
    open: 3590.50,
    high: 3595.80,
    low: 3552.30,
    volume: 1234567,
    previousClose: 3586.00,
    lastUpdated: new Date().toISOString(),
    market: 'NSE',
    currency: 'INR'
  },
  {
    symbol: 'HDFCBANK.NS',
    name: 'HDFC Bank',
    price: 1598.45,
    change: 12.85,
    changePercent: 0.81,
    open: 1590.20,
    high: 1605.90,
    low: 1585.75,
    volume: 2345678,
    previousClose: 1585.60,
    lastUpdated: new Date().toISOString(),
    market: 'NSE',
    currency: 'INR'
  },
  {
    symbol: 'INFY.NS',
    name: 'Infosys',
    price: 1456.30,
    change: -8.90,
    changePercent: -0.61,
    open: 1468.75,
    high: 1472.40,
    low: 1448.20,
    volume: 1876543,
    previousClose: 1465.20,
    lastUpdated: new Date().toISOString(),
    market: 'NSE',
    currency: 'INR'
  },
  // Global Indices for comparison
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    price: 4450.38,
    change: 12.34,
    changePercent: 0.28,
    open: 4432.15,
    high: 4465.72,
    low: 4428.91,
    volume: 1234567890,
    previousClose: 4438.04,
    lastUpdated: new Date().toISOString(),
    market: 'NYSE',
    currency: 'USD'
  },
  {
    symbol: '^DJI',
    name: 'Dow Jones',
    price: 34567.25,
    change: 98.76,
    changePercent: 0.29,
    open: 34500.12,
    high: 34620.45,
    low: 34450.33,
    volume: 987654321,
    previousClose: 34468.49,
    lastUpdated: new Date().toISOString(),
    market: 'NYSE',
    currency: 'USD'
  }
]

// Function to simulate real-time price changes
function simulateRealTimeData(stock: any) {
  const volatility = 0.002 // 0.2% max change per update
  const randomChange = (Math.random() - 0.5) * volatility * stock.price
  const newPrice = Math.max(0, stock.price + randomChange)
  const change = newPrice - stock.previousClose
  const changePercent = (change / stock.previousClose) * 100

  return {
    ...stock,
    price: Math.round(newPrice * 100) / 100,
    change: Math.round(change * 100) / 100,
    changePercent: Math.round(changePercent * 100) / 100,
    lastUpdated: new Date().toISOString()
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const detail = searchParams.get('detail')
    const market = searchParams.get('market') // 'indian' or 'global'

    // Simulate real-time price changes
    const liveData = mockStockData.map(simulateRealTimeData)

    // Filter by market if specified
    let filteredData = liveData
    if (market === 'indian') {
      filteredData = liveData.filter(stock => 
        stock.market === 'NSE' || stock.market === 'BSE'
      )
    } else if (market === 'global') {
      filteredData = liveData.filter(stock => 
        stock.market === 'NYSE' || stock.market === 'NASDAQ'
      )
    }

    // Return detailed or minimal data based on request
    const data = filteredData.map(stock => {
      if (detail === 'true') {
        return stock
      }
      // Return minimal data for the ticker
      const { symbol, name, price, change, changePercent, lastUpdated, market, currency } = stock
      return { symbol, name, price, change, changePercent, lastUpdated, market, currency }
    })

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json({
      data,
      timestamp: new Date().toISOString(),
      count: data.length
    })
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    )
  }
}
