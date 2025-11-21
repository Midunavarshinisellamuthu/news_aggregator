"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Bitcoin, 
  TrendingUp, 
  TrendingDown, 
  ArrowUp, 
  ArrowDown,
  RefreshCw,
  DollarSign,
  Coins,
  Activity,
  Clock,
  Star
} from "lucide-react"
import useSWR from "swr"

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

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const formatPrice = (price: number) => {
  if (price < 0.01) {
    return `$${price.toFixed(6)}`
  } else if (price < 1) {
    return `$${price.toFixed(4)}`
  } else if (price < 100) {
    return `$${price.toFixed(2)}`
  } else {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
}

const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`
  } else {
    return `$${marketCap.toLocaleString()}`
  }
}

function CryptoItem({ crypto }: { crypto: CryptoData }) {
  const isPositive = crypto.price_change_percentage_24h >= 0
  const isNeutral = crypto.price_change_percentage_24h === 0

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-full flex items-center justify-center">
          {crypto.symbol.toLowerCase() === 'btc' && <Bitcoin className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
          {crypto.symbol.toLowerCase() !== 'btc' && <Coins className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
              {crypto.name}
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">
            {crypto.symbol}
          </p>
        </div>
      </div>
      
      <div className="text-right ml-2">
        <div className="font-bold text-sm text-slate-900 dark:text-white">
          {formatPrice(crypto.current_price)}
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
            <div className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          <span>
            {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
            {crypto.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export function CryptoWidget() {
  const [activeTab, setActiveTab] = useState<"top" | "watchlist">("top")
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const { data, error, isLoading, mutate } = useSWR<CryptoResponse>(
    `/api/crypto?category=${activeTab}`,
    fetcher,
    {
      refreshInterval: 60000, // Refresh every 60 seconds
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
    setActiveTab(value as "top" | "watchlist")
  }

  if (error) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <Bitcoin className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Unable to load crypto data
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
            <div className="p-2 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-lg">
              <Bitcoin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Cryptocurrency
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live crypto prices
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
              value="top" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Top Coins</span>
              <span className="sm:hidden">Top</span>
            </TabsTrigger>
            <TabsTrigger 
              value="watchlist"
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Watchlist</span>
              <span className="sm:hidden">Watch</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top" className="space-y-3 mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.data?.slice(0, 5).map((crypto) => (
                  <CryptoItem key={crypto.id} crypto={crypto} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlist" className="space-y-3 mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {data?.data?.filter(crypto => 
                  ['bitcoin', 'ethereum', 'cardano'].includes(crypto.id)
                ).map((crypto) => (
                  <CryptoItem key={crypto.id} crypto={crypto} />
                ))}
                {(!data?.data || data.data.length === 0) && (
                  <div className="text-center py-4">
                    <Star className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No watchlist items yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Market Overview */}
        {data?.data && data.data.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Market Overview
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-slate-500 dark:text-slate-400">Total Market Cap</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {formatMarketCap(data.data.reduce((sum, crypto) => sum + crypto.market_cap, 0))}
                </div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-slate-400">24h Volume</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {formatMarketCap(data.data.reduce((sum, crypto) => sum + crypto.volume_24h, 0))}
                </div>
              </div>
            </div>
          </div>
        )}

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