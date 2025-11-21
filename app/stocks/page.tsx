'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUp, ArrowDown, ArrowRight, LineChart, BarChart2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  open?: number
  high?: number
  low?: number
  volume?: number
  previousClose?: number
  lastUpdated: string
  market: string
  currency: string
}

interface StockResponse {
  data: StockData[]
  timestamp: string
  count: number
}

export default function StocksPage() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null)
  const [timeRange, setTimeRange] = useState('1d')

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('/api/stocks?detail=true')
        if (!response.ok) {
          throw new Error('Failed to fetch stock data')
        }
        const result: StockResponse = await response.json()
        setStocks(result.data)
        if (result.data.length > 0) {
          setSelectedStock(result.data[0])
        }
      } catch (err) {
        console.error('Error fetching stock data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStockData()
    const interval = setInterval(fetchStockData, 30000) // Refresh every 30 seconds for real-time updates
    return () => clearInterval(interval)
  }, [])

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range)
    // In a real app, you would fetch new chart data based on the time range
  }

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stock Market</h1>
            <p className="text-muted-foreground">Real-time stock market data and analysis</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button
              variant={timeRange === '1d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange('1d')}
            >
              1D
            </Button>
            <Button
              variant={timeRange === '1w' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange('1w')}
            >
              1W
            </Button>
            <Button
              variant={timeRange === '1m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange('1m')}
            >
              1M
            </Button>
            <Button
              variant={timeRange === '1y' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange('1y')}
            >
              1Y
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold">Indian & Global Markets</h2>
            <div className="space-y-2">
              {stocks.map((stock) => {
                const isPositive = stock.change >= 0
                const isNeutral = stock.change === 0
                
                return (
                  <Card 
                    key={stock.symbol}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedStock?.symbol === stock.symbol ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedStock(stock)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{stock.name}</h3>
                          <p className="text-sm text-muted-foreground">{stock.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(stock.price, stock.currency)}
                          </p>
                          <p 
                            className={`text-sm ${
                              isNeutral ? 'text-gray-500' : isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {isNeutral ? (
                              <span className="inline-flex items-center">
                                <ArrowRight className="h-3 w-3 mr-1" />
                                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                              </span>
                            ) : isPositive ? (
                              <span className="inline-flex items-center">
                                <ArrowUp className="h-3 w-3 mr-1" />
                                +{stock.change.toFixed(2)} (+{stock.changePercent.toFixed(2)}%)
                              </span>
                            ) : (
                              <span className="inline-flex items-center">
                                <ArrowDown className="h-3 w-3 mr-1" />
                                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Stock Detail View */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStock ? (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {selectedStock.name} ({selectedStock.symbol})
                        </CardTitle>
                        <p className="text-muted-foreground">
                          Updated: {new Date(selectedStock.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">
                          {formatPrice(selectedStock.price, selectedStock.currency)}
                        </p>
                        <p 
                          className={`text-lg font-medium ${
                            selectedStock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {selectedStock.change >= 0 ? '+' : ''}
                          {selectedStock.change.toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}
                          {selectedStock.changePercent.toFixed(2)}%)
                          {selectedStock.change >= 0 ? (
                            <ArrowUp className="inline h-5 w-5 ml-1" />
                          ) : (
                            <ArrowDown className="inline h-5 w-5 ml-1" />
                          )}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-center p-6
                      ">
                        <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Interactive chart will be displayed here</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          (In a production app, this would show real-time price charts)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <h3 className="font-medium flex items-center">
                        <BarChart2 className="h-4 w-4 mr-2 text-blue-500" />
                        Key Statistics
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedStock.open && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Open</span>
                            <span className="font-medium">
                              {formatPrice(selectedStock.open, selectedStock.currency)}
                            </span>
                          </div>
                        )}
                        {selectedStock.previousClose && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Previous Close</span>
                            <span className="font-medium">
                              {formatPrice(selectedStock.previousClose, selectedStock.currency)}
                            </span>
                          </div>
                        )}
                        {selectedStock.low && selectedStock.high && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Day's Range</span>
                            <span className="font-medium">
                              {formatPrice(selectedStock.low, selectedStock.currency)} - {formatPrice(selectedStock.high, selectedStock.currency)}
                            </span>
                          </div>
                        )}
                        {selectedStock.volume && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Volume</span>
                            <span className="font-medium">
                              {selectedStock.volume.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Market</span>
                          <span className="font-medium">
                            {selectedStock.market}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Currency</span>
                          <span className="font-medium">
                            {selectedStock.currency}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <h3 className="font-medium flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                        Performance
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Day's Change</span>
                          <span className={`font-medium ${
                            selectedStock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                          }`}>
                            {selectedStock.change >= 0 ? '+' : ''}
                            {selectedStock.change.toFixed(2)} ({selectedStock.changePercent >= 0 ? '+' : ''}
                            {selectedStock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                        {selectedStock.high && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">52 Week High (Est.)</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {formatPrice(selectedStock.high * 1.15, selectedStock.currency)}
                            </span>
                          </div>
                        )}
                        {selectedStock.low && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">52 Week Low (Est.)</span>
                            <span className="font-medium text-red-600 dark:text-red-400">
                              {formatPrice(selectedStock.low * 0.85, selectedStock.currency)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Market Cap (Est.)</span>
                          <span className="font-medium">
                            {selectedStock.currency === 'INR' ? '₹' : '$'}{Math.round(selectedStock.price * (selectedStock.currency === 'INR' ? 100 : 1.2)).toLocaleString()}B
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="h-96 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Select a stock to view details</h3>
                  <p className="text-muted-foreground mt-1">Click on any stock from the list to see its performance</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
