'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import SubjectsGrid from '@/components/dashboard/subjects-grid'
import { QuestionAnalyticsCard } from '@/components/analytics/question-analytics-card'
import { MotivationalMessages } from '@/components/analytics/motivational-messages'
import { QuestionMilestoneNotification } from '@/components/analytics/question-milestone-notification'
import MistiMotivationCard from '@/components/ui/misti-motivation-card'
import DailyGoalsCard from '@/components/dashboard/daily-goals-card'
import YesterdayPerformance from '@/components/dashboard/yesterday-performance'
import RealTimeAnalytics from '@/components/dashboard/real-time-analytics'
import NEETCountdownTimer from '@/components/ui/neet-countdown-timer'
import AIR50CycleSummary from '@/components/dashboard/air50-cycle-summary'
import StudyStreakTracker from '@/components/enhanced/study-streak-tracker'
import PomodoroTimer from '@/components/enhanced/pomodoro-timer'
import WeakTopicIdentifier from '@/components/enhanced/weak-topic-identifier'
import QuestionProgressTracker from '@/components/enhanced/question-progress-tracker'
import { CompetitiveEdgeSystem } from '@/components/competitive/edge-system'
import { SpiritualBalanceSystem } from '@/components/spiritual/balance-system'
import { DailyWisdom } from '@/components/spiritual/daily-wisdom'
import QuestionHeatmap from '@/components/daily-goals/question-heatmap'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/landing')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-xl">Loading your tracker, Misti... 💕</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <QuestionMilestoneNotification />
      <DashboardLayout 
        title={`Welcome back, ${session.user?.name || 'Misti'}! 💕`}
        subtitle="Your comprehensive NEET preparation companion"
      >
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="glass-effect rounded-xl p-8 text-center relative overflow-hidden">
          {/* Animated Background Hearts */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-500/20 text-2xl"
                animate={{
                  x: [0, 30, 0],
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
              >
                💕
              </motion.div>
            ))}
          </div>

          {/* Main Welcome Message */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-white">Welcome back, </span>
                <motion.span
                  className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: '200% 200%',
                  }}
                >
                  My Beautiful Misti
                </motion.span>
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block ml-2"
                >
                  💕
                </motion.span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">
                Ready to conquer NEET UG 2026? 🚀
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                Track your progress, analyze performance, and stay motivated on your journey to medical college.
              </p>
            </motion.div>

            {/* Love Message Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-400/30 rounded-xl p-6 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center justify-center gap-2 mb-3"
              >
                <span className="text-2xl">👩⚕️</span>
                <p className="text-pink-300 font-bold text-lg">
                  Future Dr. Misti in the making!
                </p>
                <span className="text-2xl">✨</span>
              </motion.div>
              
              <p className="text-pink-200 text-base leading-relaxed">
                Every question you solve, every chapter you complete brings you closer to your dream.
                I believe in you more than you believe in yourself, my love! 💪
              </p>
              
              <motion.div
                className="flex justify-center items-center gap-1 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {['💕', '🌟', '💕', '🌟', '💕'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      delay: i * 0.2, 
                      duration: 1.5, 
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="text-xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Spiritual Wisdom Section - Above NEET Timer */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🕉️</span>
            <span>आध्यात्मिक ज्ञान</span>
          </h2>
          <DailyWisdom />
        </div>

        {/* NEET Countdown Timer */}
        <div className="mb-8">
          <NEETCountdownTimer />
        </div>

        {/* Spiritual Balance Section - Below NEET Timer */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🧘‍♀️</span>
            <span>आध्यात्मिक संतुलन और आंतरिक शांति</span>
          </h2>

        </div>

        {/* Motivational Messages */}
        <MotivationalMessages />

        {/* Question Heatmap */}
        <div className="mb-8">
          <QuestionHeatmap compact={true} />
        </div>

        {/* Real-time Analytics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">📊 Real-time Analytics</h2>
          <RealTimeAnalytics />
        </div>

        {/* Analytics and Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SubjectsGrid />
          </div>
          <div className="space-y-6">
            <QuestionProgressTracker />
            <AIR50CycleSummary />
            <StudyStreakTracker />
            <DailyGoalsCard />
            <YesterdayPerformance />
            <QuestionAnalyticsCard />
            
            {/* Misti's Motivation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <MistiMotivationCard showName={false} />
            </motion.div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>🍅</span>
              <span>Focus Timer</span>
            </h3>
            <PomodoroTimer />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>Weak Areas</span>
            </h3>
            <WeakTopicIdentifier />
          </div>
        </div>

        {/* Spiritual Balance Section - Below Pomodoro Timer */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🧘♀️</span>
            <span>आध्यात्मिक संतुलन और आंतरिक शांति</span>
          </h2>
          <SpiritualBalanceSystem />
        </div>

        {/* Competitive Edge Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🏆</span>
            <span>Competitive Edge Analysis</span>
          </h2>
          <CompetitiveEdgeSystem />
        </div>

        {/* Getting Started */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors">
              <h4 className="font-medium text-white mb-2">📚 Continue Studying</h4>
              <p className="text-gray-400 text-sm mb-3">
                Resume your lecture completion and DPP progress.
              </p>
              <button className="text-primary hover:text-primary-hover text-sm font-medium">
                Go to Subjects →
              </button>
            </div>
            <Link href="/daily-goals" className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors block">
              <h4 className="font-medium text-white mb-2">🎯 Daily Goals</h4>
              <p className="text-gray-400 text-sm mb-3">
                Track today's questions, DPPs, and revision progress.
              </p>
              <span className="text-primary hover:text-primary-hover text-sm font-medium">
                Track Progress →
              </span>
            </Link>
            <Link href="/tests" className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors block">
              <h4 className="font-medium text-white mb-2">📊 Add Test Score</h4>
              <p className="text-gray-400 text-sm mb-3">
                Record your latest test performance and track improvement.
              </p>
              <span className="text-primary hover:text-primary-hover text-sm font-medium">
                Add Score →
              </span>
            </Link>
            <div className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors">
              <h4 className="font-medium text-white mb-2">📅 Track Mood</h4>
              <p className="text-gray-400 text-sm mb-3">
                Log your daily mood and maintain mental well-being.
              </p>
              <button className="text-primary hover:text-primary-hover text-sm font-medium">
                Mood Calendar →
              </button>
            </div>
          </div>
        </div>
        </div>
      </DashboardLayout>
    </>
  )
}