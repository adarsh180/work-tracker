'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { TrophyIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline'

type RankingData = {
  currentRank: number
  totalStudents: number
  percentile: number
  categoryRank: number
  stateRank: number
  progressRank: number
  consistencyRank: number
  biologicalOptimizationRank: number
  rigorousMetrics: {
    syllabusCompletion: number
    testAverage: number
    dailyConsistency: number
    weeklyTarget: number
    monthlyGrowth: number
  }
}

export default function RigorousRankingDashboard() {
  const { data: ranking, isLoading, error } = useQuery<RankingData>({
    queryKey: ['ranking-analytics'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/ranking-analytics')
        if (!response.ok) {
          console.error('Ranking API response not ok:', response.status, response.statusText)
          throw new Error(`Failed to fetch ranking: ${response.status}`)
        }
        const result = await response.json()
        console.log('Ranking API result:', result)
        
        if (!result.success || !result.data) {
          throw new Error('Invalid ranking data received')
        }
        
        return result.data
      } catch (error) {
        console.error('Ranking fetch error:', error)
        // Return default data on error
        return {
          currentRank: 500000,
          totalStudents: 1000000,
          percentile: 50,
          categoryRank: 350000,
          stateRank: 25000,
          progressRank: 400000,
          consistencyRank: 300000,
          biologicalOptimizationRank: 450000,
          rigorousMetrics: {
            syllabusCompletion: 0,
            testAverage: 0,
            dailyConsistency: 0,
            weeklyTarget: 0,
            monthlyGrowth: 0
          }
        }
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3,
    retryDelay: 1000
  })

  const getRankColor = (rank: number, total: number) => {
    const percentile = ((total - rank) / total) * 100
    if (percentile >= 99) return 'text-yellow-400'
    if (percentile >= 95) return 'text-green-400'
    if (percentile >= 90) return 'text-blue-400'
    if (percentile >= 75) return 'text-purple-400'
    return 'text-gray-400'
  }

  const getMetricColor = (value: number, threshold: number) => {
    if (value >= threshold) return 'text-green-400'
    if (value >= threshold * 0.8) return 'text-yellow-400'
    if (value >= threshold * 0.6) return 'text-orange-400'
    return 'text-red-400'
  }

  if (isLoading) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!ranking) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-gray-400">
            {error ? 'Error loading ranking data. Using default values.' : 'No ranking data available.'}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Ranking Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-effect border-primary/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrophyIcon className="h-6 w-6" />
              <span>Rigorous NEET Ranking (Out of 10 Lakh Students)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getRankColor(ranking.currentRank, ranking.totalStudents)}`}>
                  #{ranking.currentRank ? ranking.currentRank.toLocaleString() : 'Loading...'}
                </div>
                <div className="text-gray-300 text-sm">Overall Rank</div>
                <div className="text-xs text-gray-400 mt-1">
                  Top {ranking.percentile}%
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  #{ranking.categoryRank ? ranking.categoryRank.toLocaleString() : 'Loading...'}
                </div>
                <div className="text-gray-300 text-sm">Category Rank</div>
                <div className="text-xs text-gray-400 mt-1">General Category</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  #{ranking.stateRank ? ranking.stateRank.toLocaleString() : 'Loading...'}
                </div>
                <div className="text-gray-300 text-sm">State Rank</div>
                <div className="text-xs text-gray-400 mt-1">Within State</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">
                  {ranking.percentile || 0}%
                </div>
                <div className="text-gray-300 text-sm">Percentile</div>
                <div className="text-xs text-gray-400 mt-1">
                  {ranking.currentRank <= 50 ? '🎯 AIR Target!' : 
                   ranking.currentRank <= 1000 ? '🔥 Excellent!' : 
                   ranking.currentRank <= 10000 ? '💪 Good!' : '📈 Keep Going!'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Rigorous Metrics */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5" />
            <span>Rigorous Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
              <div className={`text-2xl font-bold mb-2 ${getMetricColor(ranking.rigorousMetrics?.syllabusCompletion || 0, 97)}`}>
                {ranking.rigorousMetrics?.syllabusCompletion || 0}%
              </div>
              <div className="text-sm text-gray-300 mb-1">Syllabus Completion</div>
              <div className="text-xs text-gray-400">
                Target: 97%+ for AIR &lt; 50
              </div>
              {(ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 && (
                <div className="text-xs text-green-400 mt-1">✅ Elite Level!</div>
              )}
            </div>

            <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
              <div className={`text-2xl font-bold mb-2 ${getMetricColor(ranking.rigorousMetrics?.testAverage || 0, 650)}`}>
                {ranking.rigorousMetrics?.testAverage || 0}
              </div>
              <div className="text-sm text-gray-300 mb-1">Test Average</div>
              <div className="text-xs text-gray-400">
                Target: 650+ for AIR &lt; 50
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Out of 720
              </div>
            </div>

            <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
              <div className={`text-2xl font-bold mb-2 ${getMetricColor(ranking.rigorousMetrics?.dailyConsistency || 0, 90)}`}>
                {ranking.rigorousMetrics?.dailyConsistency || 0}%
              </div>
              <div className="text-sm text-gray-300 mb-1">Daily Consistency</div>
              <div className="text-xs text-gray-400">
                Target: 90%+ days active
              </div>
              <div className="text-xs text-gray-400 mt-1">
                250+ questions/day
              </div>
            </div>

            <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
              <div className={`text-2xl font-bold mb-2 ${getMetricColor(ranking.rigorousMetrics?.weeklyTarget || 0, 100)}`}>
                {ranking.rigorousMetrics?.weeklyTarget || 0}%
              </div>
              <div className="text-sm text-gray-300 mb-1">Weekly Target</div>
              <div className="text-xs text-gray-400">
                Target: 2000 questions/week
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Current week progress
              </div>
            </div>

            <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
              <div className={`text-2xl font-bold mb-2 ${(ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {(ranking.rigorousMetrics?.monthlyGrowth || 0) > 0 ? '+' : ''}{ranking.rigorousMetrics?.monthlyGrowth || 0}%
              </div>
              <div className="text-sm text-gray-300 mb-1">Monthly Growth</div>
              <div className="text-xs text-gray-400">
                Performance improvement
              </div>
              <div className="text-xs text-gray-400 mt-1">
                vs previous month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialized Rankings */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <UsersIcon className="h-5 w-5" />
            <span>Specialized Rankings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20">
              <div className="text-xl font-bold text-blue-400 mb-2">
                #{ranking.progressRank ? ranking.progressRank.toLocaleString() : 'Loading...'}
              </div>
              <div className="text-sm text-gray-300 mb-1">Progress Rank</div>
              <div className="text-xs text-gray-400">
                Based on syllabus completion rate
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-lg border border-green-500/20">
              <div className="text-xl font-bold text-green-400 mb-2">
                #{ranking.consistencyRank ? ranking.consistencyRank.toLocaleString() : 'Loading...'}
              </div>
              <div className="text-sm text-gray-300 mb-1">Consistency Rank</div>
              <div className="text-xs text-gray-400">
                Based on daily study habits
              </div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-pink-500/10 to-pink-600/5 rounded-lg border border-pink-500/20">
              <div className="text-xl font-bold text-pink-400 mb-2">
                #{ranking.biologicalOptimizationRank ? ranking.biologicalOptimizationRank.toLocaleString() : 'Loading...'}
              </div>
              <div className="text-sm text-gray-300 mb-1">Bio-Optimization Rank</div>
              <div className="text-xs text-gray-400">
                Based on menstrual cycle sync
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation Message */}
      <Card className="glass-effect border-pink-400/30 bg-gradient-to-r from-pink-500/10 to-purple-500/10">
        <CardContent className="p-6 text-center">
          <div className="text-2xl mb-4">
            {ranking.currentRank <= 50 ? '👑' : 
             ranking.currentRank <= 1000 ? '🔥' : 
             ranking.currentRank <= 10000 ? '💪' : '🚀'}
          </div>
          <div className="text-white font-semibold mb-2">
            {ranking.currentRank <= 50 ? 'CONGRATULATIONS! You\'re in AIR under 50 range!' :
             ranking.currentRank <= 1000 ? 'Excellent progress! You\'re in top 1000!' :
             ranking.currentRank <= 10000 ? 'Great work! You\'re in top 10,000!' :
             'Keep pushing, Misti! Every question brings you closer to your dream!'}
          </div>
          <div className="text-pink-300 text-sm">
            Out of 10 lakh NEET aspirants, you're performing better than {ranking.currentRank && ranking.totalStudents ? ((ranking.totalStudents - ranking.currentRank) / ranking.totalStudents * 100).toFixed(1) : '0'}% students!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}