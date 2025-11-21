"use client"

import { useState, useEffect } from 'react'

export interface SourceReliability {
  source: string
  score: number // 0-100
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'
  factCheckAccuracy: number
  biasRating: 'left' | 'center-left' | 'center' | 'center-right' | 'right'
  transparencyScore: number
  lastUpdated: string
  totalFactChecks: number
  verifiedClaims: number
  falseClaims: number
}

export interface FactCheckRecord {
  source: string
  claim: string
  verdict: 'true' | 'false' | 'misleading' | 'unverified'
  date: string
  factChecker: string
}

// Mock reliability data based on real news source reputations
const MOCK_RELIABILITY_DATA: SourceReliability[] = [
  {
    source: "The Hindu",
    score: 92,
    grade: "A+",
    factCheckAccuracy: 95,
    biasRating: "center-left",
    transparencyScore: 88,
    lastUpdated: "2024-01-15",
    totalFactChecks: 245,
    verifiedClaims: 232,
    falseClaims: 13
  },
  {
    source: "Times of India",
    score: 78,
    grade: "B+",
    factCheckAccuracy: 82,
    biasRating: "center",
    transparencyScore: 74,
    lastUpdated: "2024-01-14",
    totalFactChecks: 189,
    verifiedClaims: 155,
    falseClaims: 34
  },
  {
    source: "Indian Express",
    score: 89,
    grade: "A",
    factCheckAccuracy: 91,
    biasRating: "center",
    transparencyScore: 87,
    lastUpdated: "2024-01-15",
    totalFactChecks: 203,
    verifiedClaims: 185,
    falseClaims: 18
  },
  {
    source: "Economic Times",
    score: 85,
    grade: "A",
    factCheckAccuracy: 88,
    biasRating: "center-right",
    transparencyScore: 82,
    lastUpdated: "2024-01-13",
    totalFactChecks: 156,
    verifiedClaims: 137,
    falseClaims: 19
  },
  {
    source: "NDTV",
    score: 76,
    grade: "B+",
    factCheckAccuracy: 79,
    biasRating: "center-left",
    transparencyScore: 73,
    lastUpdated: "2024-01-12",
    totalFactChecks: 178,
    verifiedClaims: 141,
    falseClaims: 37
  },
  {
    source: "CNN News18",
    score: 71,
    grade: "B",
    factCheckAccuracy: 74,
    biasRating: "center",
    transparencyScore: 68,
    lastUpdated: "2024-01-11",
    totalFactChecks: 145,
    verifiedClaims: 107,
    falseClaims: 38
  },
  {
    source: "PTI News",
    score: 94,
    grade: "A+",
    factCheckAccuracy: 96,
    biasRating: "center",
    transparencyScore: 92,
    lastUpdated: "2024-01-15",
    totalFactChecks: 298,
    verifiedClaims: 286,
    falseClaims: 12
  },
  {
    source: "ANI News",
    score: 88,
    grade: "A",
    factCheckAccuracy: 90,
    biasRating: "center",
    transparencyScore: 86,
    lastUpdated: "2024-01-14",
    totalFactChecks: 234,
    verifiedClaims: 210,
    falseClaims: 24
  },
  {
    source: "Republic World",
    score: 58,
    grade: "C+",
    factCheckAccuracy: 62,
    biasRating: "right",
    transparencyScore: 54,
    lastUpdated: "2024-01-10",
    totalFactChecks: 123,
    verifiedClaims: 76,
    falseClaims: 47
  },
  {
    source: "India Today",
    score: 82,
    grade: "A",
    factCheckAccuracy: 85,
    biasRating: "center",
    transparencyScore: 79,
    lastUpdated: "2024-01-13",
    totalFactChecks: 167,
    verifiedClaims: 142,
    falseClaims: 25
  }
]

export function useReliability() {
  const [reliabilityData, setReliabilityData] = useState<SourceReliability[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setReliabilityData(MOCK_RELIABILITY_DATA)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getReliabilityScore = (sourceName: string): SourceReliability | null => {
    return reliabilityData.find(source =>
      source.source.toLowerCase() === sourceName.toLowerCase()
    ) || null
  }

  const getReliabilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 80) return 'text-blue-600 dark:text-blue-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 60) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getReliabilityBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700'
    if (score >= 80) return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700'
    if (score >= 70) return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700'
    if (score >= 60) return 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700'
    return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700'
  }

  const getBiasColor = (bias: string) => {
    switch (bias) {
      case 'left':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
      case 'center-left':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'
      case 'center':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300'
      case 'center-right':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
      case 'right':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'text-green-600 dark:text-green-400'
      case 'A':
        return 'text-green-500 dark:text-green-400'
      case 'B+':
        return 'text-blue-600 dark:text-blue-400'
      case 'B':
        return 'text-blue-500 dark:text-blue-400'
      case 'C+':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'C':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'D':
        return 'text-orange-600 dark:text-orange-400'
      case 'F':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  // Calculate reliability score based on multiple factors
  const calculateReliabilityScore = (
    factCheckAccuracy: number,
    transparencyScore: number,
    totalFactChecks: number,
    verifiedClaims: number,
    falseClaims: number
  ): number => {
    // Weight factors
    const accuracyWeight = 0.4
    const transparencyWeight = 0.3
    const volumeWeight = 0.2
    const consistencyWeight = 0.1

    const accuracyScore = factCheckAccuracy / 100
    const transparencyScoreNormalized = transparencyScore / 100
    const volumeScore = Math.min(totalFactChecks / 100, 1) // Cap at 100 fact checks
    const consistencyScore = verifiedClaims / (verifiedClaims + falseClaims)

    return Math.round(
      (accuracyScore * accuracyWeight +
       transparencyScoreNormalized * transparencyWeight +
       volumeScore * volumeWeight +
       consistencyScore * consistencyWeight) * 100
    )
  }

  // Get reliability grade based on score
  const getReliabilityGrade = (score: number): SourceReliability['grade'] => {
    if (score >= 95) return 'A+'
    if (score >= 90) return 'A'
    if (score >= 85) return 'A'
    if (score >= 80) return 'B+'
    if (score >= 75) return 'B'
    if (score >= 70) return 'B'
    if (score >= 65) return 'C+'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  // Get top reliable sources
  const getTopReliableSources = (limit: number = 5): SourceReliability[] => {
    return [...reliabilityData]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  // Get reliability stats
  const getReliabilityStats = () => {
    const totalSources = reliabilityData.length
    const avgScore = reliabilityData.reduce((sum, source) => sum + source.score, 0) / totalSources
    const highReliabilityCount = reliabilityData.filter(source => source.score >= 80).length
    const lowReliabilityCount = reliabilityData.filter(source => source.score < 60).length

    return {
      totalSources,
      avgScore: Math.round(avgScore),
      highReliabilityCount,
      lowReliabilityCount,
      highReliabilityPercentage: Math.round((highReliabilityCount / totalSources) * 100),
      lowReliabilityPercentage: Math.round((lowReliabilityCount / totalSources) * 100)
    }
  }

  return {
    reliabilityData,
    isLoading,
    getReliabilityScore,
    getReliabilityColor,
    getReliabilityBadgeColor,
    getBiasColor,
    getGradeColor,
    calculateReliabilityScore,
    getReliabilityGrade,
    getTopReliableSources,
    getReliabilityStats
  }
}
