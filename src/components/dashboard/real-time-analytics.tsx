'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { ChartBarIcon, BookOpenIcon, CalendarIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'

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
  const queryClient = useQueryClient()

  // Listen for chapter updates and invalidate queries
  useEffect(() => {
    const handleChapterUpdate = () => {
      // Force immediate refetch for real-time updates
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
      queryClient.refetchQueries({ queryKey: ['dashboard-analytics'] })
    }

    window.addEventListener('chapterProgressUpdated', handleChapterUpdate)
    
    return () => {
      window.removeEventListener('chapterProgressUpdated', handleChapterUpdate)
    }
  }, [queryClient])

  const { data: analytics, isLoading } = useQuery<DashboardAnalytics>({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      // Vercel-optimized fetch with cache busting
      const timestamp = Date.now()
      const response = await fetch(`/api/dashboard/analytics?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 3000, // 3 seconds for Vercel optimization
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false, // Disable for Vercel performance
    retry: 2,
    retryDelay: attemptIndex => Math.min(2000 * 2 ** attemptIndex, 10000)
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

  const getMotivationalMessage = (progress: number) => {
    if (progress >= 90) return "Misti, tum genius ho! 🔥"
    if (progress >= 70) return "Bahut badhiya chal raha hai! ✨"
    if (progress >= 50) return "Keep it up, meri jaan! 💪"
    return "Slow and steady, my love! 🌱"
  }

  const getQuestionMessage = (count: number) => {
    if (count >= 1000) return "Wow! Question solving machine! 🚀"
    if (count >= 500) return "Great progress, Misti! 📚"
    if (count >= 100) return "Good start, keep going! 💫"
    return "Let's solve more together! 💕"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Enhanced Subject Progress */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl border border-pink-400/30 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-rose-400/10 group-hover:from-pink-400/20 group-hover:to-rose-400/20 transition-all" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5 text-pink-300" />
                <span className="text-sm font-medium text-pink-200">Subject Progress</span>
              </div>
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl"
              >
                {getProgressEmoji(analytics.subjectProgress.overall)}
              </motion.span>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-1">
                {analytics.subjectProgress.overall.toFixed(1)}%
              </div>
              <div className="text-xs text-pink-300/80">
                {getMotivationalMessage(analytics.subjectProgress.overall)}
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-pink-200">
                <span>Physics</span>
                <span className="font-semibold">{analytics.subjectProgress.physics.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-pink-200">
                <span>Chemistry</span>
                <span className="font-semibold">{analytics.subjectProgress.chemistry.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-pink-200">
                <span>Biology</span>
                <span className="font-semibold">{((analytics.subjectProgress.botany + analytics.subjectProgress.zoology) / 2).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Question Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 group-hover:from-blue-400/20 group-hover:to-cyan-400/20 transition-all" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-blue-300" />
                <span className="text-sm font-medium text-blue-200">Questions Solved</span>
              </div>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                📊
              </motion.span>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-1">
                {analytics.questionStats.lifetime.toLocaleString()}
              </div>
              <div className="text-xs text-blue-300/80">
                {getQuestionMessage(analytics.questionStats.lifetime)}
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-blue-200">
                <span>Aaj ke goals</span>
                <span className="font-semibold">{analytics.questionStats.daily}</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span>Chapter Q's</span>
                <span className="font-semibold">{analytics.questionStats.chapterwise}</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span>Is hafte</span>
                <span className="font-semibold">{analytics.questionStats.weekly}</span>
              </div>
              <div className="flex justify-between text-blue-200">
                <span>Is mahine</span>
                <span className="font-semibold">{analytics.questionStats.monthly}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Test Performance */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-400/30 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 group-hover:from-purple-400/20 group-hover:to-indigo-400/20 transition-all" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LightBulbIcon className="h-5 w-5 text-purple-300" />
                <span className="text-sm font-medium text-purple-200">Test Performance</span>
              </div>
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                {analytics.testPerformance.improvement > 0 ? '📈' : 
                 analytics.testPerformance.improvement < 0 ? '📉' : '➡️'}
              </motion.span>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent mb-1">
                {analytics.testPerformance.averageScore}
              </div>
              <div className="text-xs text-purple-300/80">
                {analytics.testPerformance.improvement > 0 ? "Badh raha hai score! 🚀" : "Consistent raho, Misti! 💪"}
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-purple-200">
                <span>Total Tests</span>
                <span className="font-semibold">{analytics.testPerformance.totalTests}</span>
              </div>
              <div className="flex justify-between text-purple-200">
                <span>Last Score</span>
                <span className="font-semibold">{analytics.testPerformance.lastScore}/720</span>
              </div>
              <div className="flex justify-between text-purple-200">
                <span>Improvement</span>
                <span className={`font-semibold ${
                  analytics.testPerformance.improvement > 0 ? 'text-green-300' : 
                  analytics.testPerformance.improvement < 0 ? 'text-red-300' : 'text-purple-200'
                }`}>
                  {analytics.testPerformance.improvement > 0 ? '+' : ''}{analytics.testPerformance.improvement}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Mood Insights */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-400/30 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 group-hover:from-yellow-400/20 group-hover:to-orange-400/20 transition-all" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium text-yellow-200">Mood Tracking</span>
              </div>
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl"
              >
                😊
              </motion.span>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-1">
                {analytics.moodInsights.totalEntries > 0 
                  ? Math.round((analytics.moodInsights.happyDays / analytics.moodInsights.totalEntries) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-yellow-300/80">
                {analytics.moodInsights.happyDays > analytics.moodInsights.totalEntries * 0.7 ? 
                  "Khushi se bhari hui! 🌟" : "Mood better karte hain! 💕"}
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-yellow-200">
                <span>Khushi ke din</span>
                <span className="font-semibold">{analytics.moodInsights.happyDays}</span>
              </div>
              <div className="flex justify-between text-yellow-200">
                <span>Total Entries</span>
                <span className="font-semibold">{analytics.moodInsights.totalEntries}</span>
              </div>
              <div className="flex justify-between text-yellow-200">
                <span>Current Streak</span>
                <span className="font-semibold">{analytics.moodInsights.currentStreak} din</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}