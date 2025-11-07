'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'

export default function QuestionProgressTracker() {
  const { user } = useAuth()

  const { data: stats } = useQuery({
    queryKey: ['question-stats', user?.email],
    queryFn: async () => {
      const response = await fetch('/api/achievement-update', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to fetch stats')
      const result = await response.json()
      return result.stats
    },
    enabled: !!user?.email,
    refetchInterval: 30000 // Refresh every 30 seconds
  })

  if (!stats) {
    return (
      <div className="glass-effect rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
        <div className="h-32 bg-gray-700 rounded"></div>
      </div>
    )
  }

  const progress = (stats.totalQuestionsSolved / 200000) * 100
  const daysLeft = Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const dailyTarget = Math.ceil(stats.questionsRemaining / Math.max(1, daysLeft))

  const getProgressColor = () => {
    if (progress >= 75) return 'from-green-400 to-emerald-400'
    if (progress >= 50) return 'from-yellow-400 to-orange-400'
    if (progress >= 25) return 'from-blue-400 to-cyan-400'
    return 'from-red-400 to-pink-400'
  }

  const getUrgencyMessage = () => {
    if (progress >= 90) return '🎉 ALMOST THERE! Final push to 200K!'
    if (progress >= 75) return '🔥 EXCELLENT! You\'re on track!'
    if (progress >= 50) return '💪 GOOD PROGRESS! Keep pushing!'
    if (progress >= 25) return '⚡ STEP UP! Need more intensity!'
    return '🚨 URGENT! Far behind target!'
  }

  return (
    <div className="glass-effect rounded-xl p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.h3 
          className="text-2xl font-bold text-white mb-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎯 200K Lifetime Question Target
        </motion.h3>
        <p className="text-gray-400">Total questions solved from beginning to NEET 2026</p>
      </div>

      {/* Main Progress Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-gray-700"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              strokeLinecap="round"
              animate={{ strokeDashoffset: `${2 * Math.PI * 40 * (1 - progress / 100)}` }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className="text-pink-400" />
                <stop offset="100%" className="text-purple-400" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-white">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-background-secondary/30 rounded-lg">
          <div className="text-xl font-bold text-green-400">
            {stats.totalQuestionsSolved.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Total Solved (All Time)</div>
        </div>
        <div className="text-center p-3 bg-background-secondary/30 rounded-lg">
          <div className="text-xl font-bold text-red-400">
            {stats.questionsRemaining.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Remaining</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">📝 DPP Questions:</span>
          <span className="text-white font-medium">{stats.completedDppQuestions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">📚 Assignment Questions:</span>
          <span className="text-white font-medium">{stats.completedAssignmentQuestions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">⚡ Kattar Questions:</span>
          <span className="text-white font-medium">{stats.completedKattarQuestions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">🎯 Daily Goal Questions:</span>
          <span className="text-white font-medium">{stats.lifetimeQuestions.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">📊 Test Questions:</span>
          <span className="text-white font-medium">{stats.testQuestions.toLocaleString()}</span>
        </div>
      </div>

      {/* Daily Target Alert */}
      <div className={`p-4 rounded-lg border-2 mb-4 ${
        dailyTarget > 600 ? 'bg-red-400/10 border-red-400/30' :
        dailyTarget > 400 ? 'bg-yellow-400/10 border-yellow-400/30' :
        'bg-green-400/10 border-green-400/30'
      }`}>
        <div className="text-center">
          <div className="text-lg font-bold text-white mb-1">
            {dailyTarget} questions/day needed
          </div>
          <div className="text-sm text-gray-300">
            {daysLeft} days left until NEET 2026
          </div>
        </div>
      </div>

      {/* Urgency Message */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-center p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20"
      >
        <p className="text-pink-300 font-medium text-sm">
          {getUrgencyMessage()}
        </p>
      </motion.div>

      {/* Motivational Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Lifetime total: All questions from day 1 to NEET 2026! Every question counts towards Dr. Misti! 💕
        </p>
      </div>
    </div>
  )
}