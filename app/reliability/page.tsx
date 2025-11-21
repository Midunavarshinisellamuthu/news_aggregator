"use client"

import { useReliability } from "@/hooks/use-reliability"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Award,
  Target,
  Users,
  RefreshCw,
  Star,
  Eye,
  Scale
} from "lucide-react"

export default function ReliabilityPage() {
  const {
    reliabilityData,
    isLoading,
    getReliabilityColor,
    getReliabilityBadgeColor,
    getBiasColor,
    getGradeColor,
    getTopReliableSources,
    getReliabilityStats
  } = useReliability()

  const stats = getReliabilityStats()
  const topSources = getTopReliableSources()

  const getBiasLabel = (bias: string) => {
    switch (bias) {
      case 'left':
        return 'Left-leaning'
      case 'center-left':
        return 'Center-left'
      case 'center':
        return 'Center'
      case 'center-right':
        return 'Center-right'
      case 'right':
        return 'Right-leaning'
      default:
        return 'Neutral'
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-400 to-blue-500">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
                  Source Reliability
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Fact-checked news source ratings
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="rounded-lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Scores
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Sources</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSources}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Reliability</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.avgScore}%</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">High Reliability</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.highReliabilityCount}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">({stats.highReliabilityPercentage}%)</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Low Reliability</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.lowReliabilityCount}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">({stats.lowReliabilityPercentage}%)</p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="all-sources" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all-sources">All Sources</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
              <TabsTrigger value="methodology">Methodology</TabsTrigger>
            </TabsList>

            <TabsContent value="all-sources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All News Sources Reliability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reliabilityData
                      .sort((a, b) => b.score - a.score)
                      .map((source) => (
                        <Card key={source.source} className="border-l-4 border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="text-lg font-semibold">{source.source}</h3>
                                  <Badge className={getReliabilityBadgeColor(source.score)}>
                                    Grade {source.grade}
                                  </Badge>
                                  <Badge className={getBiasColor(source.biasRating)}>
                                    {getBiasLabel(source.biasRating)}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Reliability Score</p>
                                    <p className={`text-2xl font-bold ${getReliabilityColor(source.score)}`}>
                                      {source.score}%
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Fact Check Accuracy</p>
                                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                                      {source.factCheckAccuracy}%
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Transparency</p>
                                    <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                                      {source.transparencyScore}%
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Checks</p>
                                    <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                                      {source.totalFactChecks}
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Verified Claims</span>
                                    <span className="font-medium text-green-600">
                                      {source.verifiedClaims}
                                    </span>
                                  </div>
                                  <Progress
                                    value={(source.verifiedClaims / source.totalFactChecks) * 100}
                                    className="h-2"
                                  />

                                  <div className="flex justify-between text-sm">
                                    <span>False Claims</span>
                                    <span className="font-medium text-red-600">
                                      {source.falseClaims}
                                    </span>
                                  </div>
                                  <Progress
                                    value={(source.falseClaims / source.totalFactChecks) * 100}
                                    className="h-2"
                                  />
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                  Last updated: {new Date(source.lastUpdated).toLocaleDateString()}
                                </p>
                              </div>

                              <div className="text-right">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 flex items-center justify-center mb-2">
                                  <span className={`text-2xl font-bold ${getGradeColor(source.grade)}`}>
                                    {source.grade}
                                  </span>
                                </div>
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mx-auto"></div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="top-rated" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-yellow-500" />
                    Most Reliable Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topSources.map((source, index) => (
                      <div key={source.source} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{source.source}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {source.totalFactChecks} fact checks • {source.factCheckAccuracy}% accuracy
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {source.score}%
                          </div>
                          <Badge className={getReliabilityBadgeColor(source.score)}>
                            {source.grade}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="methodology" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-6 w-6 text-blue-500" />
                    Reliability Scoring Methodology
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Scoring Components</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                          <span>Fact Check Accuracy</span>
                          <Badge variant="outline">40% weight</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                          <span>Transparency Score</span>
                          <Badge variant="outline">30% weight</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                          <span>Volume of Fact Checks</span>
                          <Badge variant="outline">20% weight</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                          <span>Claim Consistency</span>
                          <Badge variant="outline">10% weight</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Grade Scale</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-green-600 dark:text-green-400 font-medium">A+ (95-100%)</span>
                          <span className="text-sm text-slate-500">Excellent</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-500 dark:text-green-400 font-medium">A (85-94%)</span>
                          <span className="text-sm text-slate-500">Very Good</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">B (70-84%)</span>
                          <span className="text-sm text-slate-500">Good</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-yellow-600 dark:text-yellow-400 font-medium">C (60-69%)</span>
                          <span className="text-sm text-slate-500">Fair</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-red-600 dark:text-red-400 font-medium">D/F (0-59%)</span>
                          <span className="text-sm text-slate-500">Poor</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-semibold mb-3">Data Sources</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Reliability scores are calculated using data from multiple independent fact-checking organizations
                      including FactCheck.org, PolitiFact, Snopes, and other verified sources. Scores are updated
                      regularly based on new fact-checking data and source transparency reports.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Shield className="h-4 w-4" />
                      <span>All scores are independently verified and regularly audited</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
