'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ChartBarIcon, BookOpenIcon, CalendarIcon, LightBulbIcon } from '@heroicons/react/24/outline'

type DashboardAnalytics = {
  subjectProgress: {
    physics: number
    chemistry: number
    botany: number
    zoology: number
    overall: number
  }
  questionStats: {
    daily: number
    weekly: number
    monthly: number
    lifetime: number
    chapterwise: number
  }
  testPerformance: {
    totalTests: number
    averageScore: number
    lastScore: number
    improvement: number
  }
  moodInsights: {
    happyDays: number
    totalEntries: number
    currentStreak: number
  }
}

export default function RealTimeAnalytics() {
  const { data: analytics, isLoading } = useQuery<DashboardAnalytics>({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/analytics')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000, // Refresh every 2 seconds for real-time updates
    staleTime: 500 // Consider data stale after 0.5 seconds
  })

  if (isLoading || !analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="glass-effect border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-600 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const getProgressEmoji = (progress: number) => {
    if (progress >= 95) return '😘'
    if (progress >= 85) return '😊'
    if (progress >= 75) return '😐'
    return '😢'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Subject Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center space-x-2 text-sm">
              <BookOpenIcon className="h-4 w-4" />
              <span>Subject Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">
                  {analytics.subjectProgress.overall.toFixed(1)}%
                </span>
                <span className="text-2xl">
                  {getProgressEmoji(analytics.subjectProgress.overall)}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Physics</span>
                  <span>{analytics.subjectProgress.physics.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Chemistry</span>
                  <span>{analytics.subjectProgress.chemistry.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Biology</span>
                  <span>{((analytics.subjectProgress.botany + analytics.subjectProgress.zoology) / 2).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Question Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center space-x-2 text-sm">
              <ChartBarIcon className="h-4 w-4" />
              <span>Questions Solved</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">
                  {analytics.questionStats.lifetime.toLocaleString()}
                </span>
                <span className="text-lg">📊</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Today (Goals)</span>
                  <span>{analytics.questionStats.daily}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Chapter Q's</span>
                  <span>{analytics.questionStats.chapterwise}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>This Week</span>
                  <span>{analytics.questionStats.weekly}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>This Month</span>
                  <span>{analytics.questionStats.monthly}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center space-x-2 text-sm">
              <LightBulbIcon className="h-4 w-4" />
              <span>Test Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">
                  {analytics.testPerformance.averageScore}
                </span>
                <span className="text-lg">
                  {analytics.testPerformance.improvement > 0 ? '📈' : 
                   analytics.testPerformance.improvement < 0 ? '📉' : '➡️'}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Total Tests</span>
                  <span>{analytics.testPerformance.totalTests}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Last Score</span>
                  <span>{analytics.testPerformance.lastScore}/720</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Improvement</span>
                  <span className={analytics.testPerformance.improvement > 0 ? 'text-green-400' : 
                                 analytics.testPerformance.improvement < 0 ? 'text-red-400' : 'text-gray-400'}>
                    {analytics.testPerformance.improvement > 0 ? '+' : ''}{analytics.testPerformance.improvement}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mood Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center space-x-2 text-sm">
              <CalendarIcon className="h-4 w-4" />
              <span>Mood Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">
                  {analytics.moodInsights.totalEntries > 0 
                    ? Math.round((analytics.moodInsights.happyDays / analytics.moodInsights.totalEntries) * 100)
                    : 0}%
                </span>
                <span className="text-lg">😊</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Happy Days</span>
                  <span>{analytics.moodInsights.happyDays}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Total Entries</span>
                  <span>{analytics.moodInsights.totalEntries}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Current Streak</span>
                  <span>{analytics.moodInsights.currentStreak} days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}