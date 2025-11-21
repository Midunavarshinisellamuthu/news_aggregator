"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  RefreshCw, 
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Globe,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react"

interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  lastUpdated: string
  market: string
  currency: string
  open?: number
  high?: number
  low?: number
  volume?: number
  previousClose?: number
}

interface StockResponse {
  data: StockData[]
  timestamp: string
  count: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function formatPrice(price: number, currency: string) {
  if (currency === 'INR') {
    return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatChange(change: number, changePercent: number, currency: string) {
  const sign = change >= 0 ? '+' : ''
  const symbol = currency === 'INR' ? '₹' : '$'
  return `${sign}${symbol}${Math.abs(change).toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`
}

function StockItem({ stock }: { stock: StockData }) {
  const isPositive = stock.change >= 0
  const isNeutral = stock.change === 0
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
            {stock.name}
          </h4>
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {stock.market}
          </Badge>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {stock.symbol}
        </p>
      </div>
      
      <div className="text-right ml-3">
        <div className="font-bold text-sm text-slate-900 dark:text-white">
          {formatPrice(stock.price, stock.currency)}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${
          isPositive 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : isNeutral
            ? 'text-slate-500 dark:text-slate-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {isPositive ? (
            <ArrowUp className="h-3 w-3" />
          ) : isNeutral ? (
            <Minus className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          <span className="truncate">
            {formatChange(stock.change, stock.changePercent, stock.currency)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function StockWidget() {
  const [activeTab, setActiveTab] = useState<"indian" | "global">("indian")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  
  const { data, error, isLoading, mutate } = useSWR<StockResponse>(
    `/api/stocks?market=${activeTab}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  )

  // Update last refresh time
  useEffect(() => {
    if (data) {
      setLastUpdate(new Date())
    }
  }, [data])

  const handleRefresh = () => {
    mutate()
    setLastUpdate(new Date())
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "indian" | "global")
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unable to load stock data
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
              <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Stock Market
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live market data
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <TabsTrigger 
              value="indian" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Indian</span>
              <span className="sm:hidden">IN</span>
            </TabsTrigger>
            <TabsTrigger 
              value="global"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Global</span>
              <span className="sm:hidden">US</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="indian" className="space-y-3 mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.data?.map((stock) => (
                  <StockItem key={stock.symbol} stock={stock} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="global" className="space-y-3 mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.data?.map((stock) => (
                  <StockItem key={stock.symbol} stock={stock} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer with last update time */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Activity className="h-3 w-3" />
            <span>Live Updates</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>
              {lastUpdate.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}