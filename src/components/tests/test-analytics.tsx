'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline'

type AnalyticsData = {
  averageScore: number
  highestScore: number
  lowestScore: number
  totalTests: number
  improvementTrend: number
  recentPerformance: number
  scorePercentage: number
  emoji: string
}

export default function TestAnalytics() {
  const { data: analytics, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ['test-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/tests/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-effect border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">0</div>
            <p className="text-xs text-gray-400 mt-1">No tests recorded yet</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">-</div>
            <p className="text-xs text-gray-400 mt-1">Add tests to see analytics</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Highest Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">-</div>
            <p className="text-xs text-gray-400 mt-1">Add tests to see analytics</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">📊</div>
            <p className="text-xs text-gray-400 mt-1">Add tests to see performance</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="glass-effect border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{analytics.totalTests}</div>
          <p className="text-xs text-gray-400 mt-1">Tests completed</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">{analytics.averageScore}</div>
            <div className="text-sm text-gray-400">/720</div>
          </div>
          <p className="text-xs text-gray-400 mt-1">{analytics.scorePercentage}% average</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Highest Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">{analytics.highestScore}</div>
            <div className="text-sm text-gray-400">/720</div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {Math.round((analytics.highestScore / 720) * 100)}% best performance
          </p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{analytics.emoji}</div>
            <div className="flex items-center space-x-1">
              {analytics.improvementTrend > 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-400" />
              ) : analytics.improvementTrend < 0 ? (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-400" />
              ) : null}
              <span className={`text-sm font-medium ${
                analytics.improvementTrend > 0 ? 'text-green-400' : 
                analytics.improvementTrend < 0 ? 'text-red-400' : 'text-gray-400'
              }`}>
                {analytics.improvementTrend > 0 ? '+' : ''}{analytics.improvementTrend}%
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {analytics.improvementTrend > 0 ? 'Improving' : 
             analytics.improvementTrend < 0 ? 'Needs focus' : 'Stable'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}