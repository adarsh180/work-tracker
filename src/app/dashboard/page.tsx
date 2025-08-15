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

export default function Dashboard() {
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
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="mb-6"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="text-white">Welcome back, </span>
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    My Beautiful Misti
                  </span>
                  <span className="inline-block ml-2">💕</span>
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
            </div>
          </div>

          {/* Motivational Messages */}
          <MotivationalMessages />

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
              <DailyGoalsCard />
              <YesterdayPerformance />
              <QuestionAnalyticsCard />
              <MistiMotivationCard showName={false} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-effect rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/daily-goals" className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors block">
                <h4 className="font-medium text-white mb-2">🎯 Daily Goals</h4>
                <p className="text-gray-400 text-sm mb-3">Track today's questions, DPPs, and revision progress.</p>
                <span className="text-primary hover:text-primary-hover text-sm font-medium">Track Progress →</span>
              </Link>
              <Link href="/tests" className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors block">
                <h4 className="font-medium text-white mb-2">📊 Add Test Score</h4>
                <p className="text-gray-400 text-sm mb-3">Record your latest test performance and track improvement.</p>
                <span className="text-primary hover:text-primary-hover text-sm font-medium">Add Score →</span>
              </Link>
              <Link href="/subjects/physics" className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors block">
                <h4 className="font-medium text-white mb-2">📚 Study Physics</h4>
                <p className="text-gray-400 text-sm mb-3">Continue with physics lectures and DPP.</p>
                <span className="text-primary hover:text-primary-hover text-sm font-medium">Study Now →</span>
              </Link>
              <Link href="/mood" className="bg-background-secondary/50 rounded-lg p-4 border border-gray-700 hover:border-primary/30 transition-colors block">
                <h4 className="font-medium text-white mb-2">📅 Track Mood</h4>
                <p className="text-gray-400 text-sm mb-3">Log your daily mood and maintain mental well-being.</p>
                <span className="text-primary hover:text-primary-hover text-sm font-medium">Mood Calendar →</span>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  )
}