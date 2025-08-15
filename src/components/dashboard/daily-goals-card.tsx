'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { FlagIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

type DailyGoalSummary = {
  totalQuestions: number
  totalDpp: number
  totalRevision: number
  emoji: string
  motivationalMessage: string
}

type QuestionStats = {
  daily: number
  weekly: number
  monthly: number
  lifetime: number
  weeklyGoal: number
  monthlyGoal: number
  dailyGoalAchieved: boolean
  weeklyProgress: number
  monthlyProgress: number
}

export default function DailyGoalsCard() {
  const { data: summary } = useQuery<DailyGoalSummary>({
    queryKey: ['daily-goal-summary'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/summary')
      if (!response.ok) throw new Error('Failed to fetch summary')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  })

  const { data: stats } = useQuery<QuestionStats>({
    queryKey: ['question-stats'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000 // Consider data stale after 10 seconds
  })

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'text-green-400'
    if (progress >= 75) return 'text-yellow-400'
    if (progress >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  const getProgressBg = (progress: number) => {
    if (progress >= 100) return 'bg-green-400'
    if (progress >= 75) return 'bg-yellow-400'
    if (progress >= 50) return 'bg-orange-400'
    return 'bg-red-400'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass-effect border-gray-700 hover:border-primary/50 transition-all duration-300 group">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FlagIcon className="h-5 w-5 text-primary" />
              <span>Daily Goals</span>
            </div>
            <Link 
              href="/daily-goals"
              className="text-gray-400 hover:text-primary transition-colors group-hover:translate-x-1 transform duration-200"
            >
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Today's Performance */}
          {summary && (
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-pink-500/10 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{summary.emoji}</span>
                <div>
                  <div className="text-lg font-bold text-white">
                    {summary.totalQuestions} Questions
                  </div>
                  <div className="text-sm text-gray-300">
                    {summary.totalDpp} DPPs • {summary.totalRevision}h Revision
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bars */}
          {stats && (
            <div className="space-y-3">
              {/* Weekly Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Weekly Progress</span>
                  <span className={getProgressColor(stats.weeklyProgress)}>
                    {stats.weekly}/{stats.weeklyGoal}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${getProgressBg(stats.weeklyProgress)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.weeklyProgress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              {/* Monthly Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Monthly Progress</span>
                  <span className={getProgressColor(stats.monthlyProgress)}>
                    {stats.monthly}/{stats.monthlyGoal}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${getProgressBg(stats.monthlyProgress)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(stats.monthlyProgress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-700">
              <div className="text-center">
                <div className="text-lg font-bold text-white">{stats.daily}</div>
                <div className="text-xs text-gray-400">Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">{stats.weekly}</div>
                <div className="text-xs text-gray-400">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {stats.lifetime > 999 ? `${(stats.lifetime / 1000).toFixed(1)}k` : stats.lifetime}
                </div>
                <div className="text-xs text-gray-400">Lifetime</div>
              </div>
            </div>
          )}

          {/* Motivational Message */}
          {summary && summary.motivationalMessage && (
            <div className="text-center p-2 bg-background-secondary/30 rounded-lg">
              <p className="text-sm text-gray-300 italic">
                "{summary.motivationalMessage}"
              </p>
            </div>
          )}

          {/* Call to Action */}
          <Link 
            href="/daily-goals"
            className="block w-full text-center py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg transition-colors text-sm font-medium"
          >
            Track Today's Progress
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}