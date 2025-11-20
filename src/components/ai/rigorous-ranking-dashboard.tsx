'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { LoadingSpinner, Badge } from '@/components/ui/enhanced-components'
import { ProgressRing, AnimatedCounter } from '@/components/ui/premium-charts'
import { 
  TrophyIcon, 
  UsersIcon, 
  ChartBarIcon,
  SparklesIcon,
  FireIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  BoltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import { CalendarIcon } from 'lucide-react'

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
      <Card variant="premium" hover="both" asMotion>
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <LoadingSpinner size="lg" variant="orbit" />
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground mb-2">
                Calculating Your Rankings
              </div>
              <div className="text-sm text-foreground-tertiary">
                Analyzing performance across 10 lakh students...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!ranking) {
    return (
      <Card variant="premium" hover="both" asMotion>
        <CardContent className="p-12 text-center">
          <div className="text-foreground-tertiary">
            {error ? 'Error loading ranking data. Using default values.' : 'No ranking data available.'}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRankConfig = (rank: number, total: number) => {
    const percentile = ((total - rank) / total) * 100
    if (percentile >= 99.99) return { 
      gradient: 'from-yellow-500 to-orange-500', 
      icon: <TrophyIcon className="h-8 w-8" />, 
      label: 'LEGENDARY',
      bg: 'from-yellow-500/20 to-orange-500/20',
      border: 'border-yellow-500/30'
    }
    if (percentile >= 99) return { 
      gradient: 'from-green-500 to-emerald-500', 
      icon: <StarIcon className="h-8 w-8" />, 
      label: 'ELITE',
      bg: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30'
    }
    if (percentile >= 95) return { 
      gradient: 'from-blue-500 to-cyan-500', 
      icon: <RocketLaunchIcon className="h-8 w-8" />, 
      label: 'EXCELLENT',
      bg: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-500/30'
    }
    if (percentile >= 90) return { 
      gradient: 'from-purple-500 to-pink-500', 
      icon: <SparklesIcon className="h-8 w-8" />, 
      label: 'GREAT',
      bg: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-500/30'
    }
    return { 
      gradient: 'from-gray-500 to-gray-600', 
      icon: <BoltIcon className="h-8 w-8" />, 
      label: 'GOOD',
      bg: 'from-gray-500/20 to-gray-600/20',
      border: 'border-gray-500/30'
    }
  }

  const rankConfig = getRankConfig(ranking.currentRank, ranking.totalStudents)

  return (
    <div className="space-y-6">
      {/* Hero Ranking Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className={`absolute inset-0 bg-gradient-to-br ${rankConfig.bg}`} />
        <div className={`relative glass-effect border ${rankConfig.border} p-8 md:p-12`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-4 rounded-3xl bg-white/[0.08]"
              >
                <TrophyIcon className="h-10 w-10 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold gradient-text">NEET Rankings</h2>
                <p className="text-foreground-tertiary text-sm mt-1">Out of 10 Lakh Students</p>
              </div>
            </div>
            <Badge variant="warning" size="lg" className="hidden md:flex">
              {rankConfig.label}
            </Badge>
          </div>

          {/* Main Rank Display */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Rank */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4">
                {rankConfig.icon}
              </div>
              <div className={`text-5xl font-bold mb-3 bg-gradient-to-r ${rankConfig.gradient} bg-clip-text text-transparent`}>
                #<AnimatedCounter value={ranking.currentRank || 0} />
              </div>
              <div className="text-sm font-semibold text-foreground mb-2">Overall Rank</div>
              <div className="text-xs text-foreground-tertiary">
                Top {ranking.percentile}%
              </div>
            </motion.div>

            {/* Category Rank */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4">
                <UsersIcon className="h-8 w-8 text-blue-500 mx-auto" />
              </div>
              <div className="text-5xl font-bold text-blue-500 mb-3">
                #<AnimatedCounter value={ranking.categoryRank || 0} />
              </div>
              <div className="text-sm font-semibold text-foreground mb-2">Category Rank</div>
              <div className="text-xs text-foreground-tertiary">General Category</div>
            </motion.div>

            {/* State Rank */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4">
                <AcademicCapIcon className="h-8 w-8 text-green-500 mx-auto" />
              </div>
              <div className="text-5xl font-bold text-green-500 mb-3">
                #<AnimatedCounter value={ranking.stateRank || 0} />
              </div>
              <div className="text-sm font-semibold text-foreground mb-2">State Rank</div>
              <div className="text-xs text-foreground-tertiary">Within State</div>
            </motion.div>

            {/* Percentile */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="text-center p-6 rounded-3xl glass-effect"
            >
              <div className="mb-4 flex justify-center">
                <ProgressRing
                  progress={ranking.percentile || 0}
                  size={80}
                  strokeWidth={8}
                  color="#bf5af2"
                  showValue={false}
                />
              </div>
              <div className="text-5xl font-bold text-accent-purple-500 mb-3">
                {ranking.percentile || 0}%
              </div>
              <div className="text-sm font-semibold text-foreground mb-2">Percentile</div>
              <div className="text-xs text-foreground-tertiary">
                {ranking.currentRank <= 50 ? 'AIR Target!' : 
                 ranking.currentRank <= 1000 ? 'Excellent!' : 
                 ranking.currentRank <= 10000 ? 'Good!' : 'Keep Going!'}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Rigorous Performance Metrics */}
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/20">
              <ChartBarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="gradient-text text-xl">Performance Metrics</div>
              <div className="text-xs text-foreground-tertiary font-normal mt-1">
                Rigorous standards for AIR &lt; 50
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Syllabus Completion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${(ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 ? 'from-green-500/20 to-emerald-500/20' : 'from-yellow-500/20 to-orange-500/20'}`} />
              <div className={`relative glass-effect border ${(ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 ? 'border-green-500/30' : 'border-yellow-500/30'} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <ProgressRing
                    progress={ranking.rigorousMetrics?.syllabusCompletion || 0}
                    size={60}
                    strokeWidth={6}
                    color={(ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 ? '#10b981' : '#f59e0b'}
                    showValue={false}
                  />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {ranking.rigorousMetrics?.syllabusCompletion || 0}%
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Syllabus Completion</div>
                <div className="text-xs text-foreground-tertiary">Target: 97%+ for AIR &lt; 50</div>
                {(ranking.rigorousMetrics?.syllabusCompletion || 0) >= 97 && (
                  <Badge variant="success" size="sm" className="mt-2">Elite Level!</Badge>
                )}
              </div>
            </motion.div>

            {/* Test Average */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${(ranking.rigorousMetrics?.testAverage || 0) >= 650 ? 'from-blue-500/20 to-cyan-500/20' : 'from-orange-500/20 to-red-500/20'}`} />
              <div className={`relative glass-effect border ${(ranking.rigorousMetrics?.testAverage || 0) >= 650 ? 'border-blue-500/30' : 'border-orange-500/30'} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <AcademicCapIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <ProgressRing
                    progress={((ranking.rigorousMetrics?.testAverage || 0) / 720) * 100}
                    size={60}
                    strokeWidth={6}
                    color={(ranking.rigorousMetrics?.testAverage || 0) >= 650 ? '#3b82f6' : '#f97316'}
                    showValue={false}
                  />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {ranking.rigorousMetrics?.testAverage || 0}
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Test Average</div>
                <div className="text-xs text-foreground-tertiary">Target: 650+ / 720</div>
              </div>
            </motion.div>

            {/* Daily Consistency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${(ranking.rigorousMetrics?.dailyConsistency || 0) >= 90 ? 'from-purple-500/20 to-pink-500/20' : 'from-gray-500/20 to-gray-600/20'}`} />
              <div className={`relative glass-effect border ${(ranking.rigorousMetrics?.dailyConsistency || 0) >= 90 ? 'border-purple-500/30' : 'border-gray-500/30'} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <FireIcon className="h-6 w-6 text-purple-500" />
                  </div>
                  <ProgressRing
                    progress={ranking.rigorousMetrics?.dailyConsistency || 0}
                    size={60}
                    strokeWidth={6}
                    color={(ranking.rigorousMetrics?.dailyConsistency || 0) >= 90 ? '#a855f7' : '#6b7280'}
                    showValue={false}
                  />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {ranking.rigorousMetrics?.dailyConsistency || 0}%
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Daily Consistency</div>
                <div className="text-xs text-foreground-tertiary">Target: 90%+ days active</div>
              </div>
            </motion.div>

            {/* Weekly Target */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
              <div className="relative glass-effect border border-cyan-500/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <CalendarIcon className="h-6 w-6 text-cyan-500" />
                  </div>
                  <ProgressRing
                    progress={ranking.rigorousMetrics?.weeklyTarget || 0}
                    size={60}
                    strokeWidth={6}
                    color="#06b6d4"
                    showValue={false}
                  />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2">
                  {ranking.rigorousMetrics?.weeklyTarget || 0}%
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Weekly Target</div>
                <div className="text-xs text-foreground-tertiary">2000 questions/week</div>
              </div>
            </motion.div>

            {/* Monthly Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${(ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? 'from-green-500/20 to-emerald-500/20' : 'from-red-500/20 to-pink-500/20'}`} />
              <div className={`relative glass-effect border ${(ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? 'border-green-500/30' : 'border-red-500/30'} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-white/[0.08]">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <div className={`text-3xl ${(ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {(ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? '↗' : '↘'}
                  </div>
                </div>
                <div className={`text-4xl font-bold mb-2 ${(ranking.rigorousMetrics?.monthlyGrowth || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {(ranking.rigorousMetrics?.monthlyGrowth || 0) > 0 ? '+' : ''}{ranking.rigorousMetrics?.monthlyGrowth || 0}%
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">Monthly Growth</div>
                <div className="text-xs text-foreground-tertiary">vs previous month</div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Specialized Rankings */}
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-accent-purple/20">
              <UsersIcon className="h-6 w-6 text-accent-purple-500" />
            </div>
            <div>
              <div className="gradient-text text-xl">Specialized Rankings</div>
              <div className="text-xs text-foreground-tertiary font-normal mt-1">
                Category-specific performance ranks
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progress Rank */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20" />
              <div className="relative glass-effect border border-blue-500/30 p-6 text-center">
                <div className="mb-4">
                  <RocketLaunchIcon className="h-10 w-10 text-blue-500 mx-auto" />
                </div>
                <div className="text-4xl font-bold text-blue-500 mb-3">
                  #<AnimatedCounter value={ranking.progressRank || 0} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">Progress Rank</div>
                <div className="text-xs text-foreground-tertiary">
                  Based on syllabus completion rate
                </div>
              </div>
            </motion.div>

            {/* Consistency Rank */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20" />
              <div className="relative glass-effect border border-green-500/30 p-6 text-center">
                <div className="mb-4">
                  <FireIcon className="h-10 w-10 text-green-500 mx-auto" />
                </div>
                <div className="text-4xl font-bold text-green-500 mb-3">
                  #<AnimatedCounter value={ranking.consistencyRank || 0} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">Consistency Rank</div>
                <div className="text-xs text-foreground-tertiary">
                  Based on daily study habits
                </div>
              </div>
            </motion.div>

            {/* Bio-Optimization Rank */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-rose-500/20" />
              <div className="relative glass-effect border border-pink-500/30 p-6 text-center">
                <div className="mb-4">
                  <SparklesIcon className="h-10 w-10 text-pink-500 mx-auto" />
                </div>
                <div className="text-4xl font-bold text-pink-500 mb-3">
                  #<AnimatedCounter value={ranking.biologicalOptimizationRank || 0} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-2">Bio-Optimization</div>
                <div className="text-xs text-foreground-tertiary">
                  Based on menstrual cycle sync
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Motivation Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20" />
        <div className="relative glass-effect border border-pink-500/30 p-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            {rankConfig.icon}
          </motion.div>
          <div className="text-2xl font-bold gradient-text mb-3">
            {ranking.currentRank <= 50 ? 'CONGRATULATIONS! You\'re in AIR under 50 range!' :
             ranking.currentRank <= 1000 ? 'Excellent progress! You\'re in top 1000!' :
             ranking.currentRank <= 10000 ? 'Great work! You\'re in top 10,000!' :
             'Keep pushing, Misti! Every question brings you closer to your dream!'}
          </div>
          <div className="text-foreground-secondary text-lg mb-4">
            Out of 10 lakh NEET aspirants, you're performing better than{' '}
            <span className="font-bold text-primary">
              {ranking.currentRank && ranking.totalStudents ? ((ranking.totalStudents - ranking.currentRank) / ranking.totalStudents * 100).toFixed(1) : '0'}%
            </span>{' '}
            students!
          </div>
          <Badge variant="warning" size="lg">
            {rankConfig.label} PERFORMER
          </Badge>
        </div>
      </motion.div>
    </div>
  )
}