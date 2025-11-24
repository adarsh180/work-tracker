'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useProductionSync } from '@/hooks/use-production-sync'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import SubjectsGrid from '@/components/dashboard/subjects-grid'
import { QuestionAnalyticsCard } from '@/components/analytics/question-analytics-card'
import { MotivationalMessages } from '@/components/analytics/motivational-messages'
import { QuestionMilestoneNotification } from '@/components/analytics/question-milestone-notification'
import MistiMotivationCard from '@/components/ui/misti-motivation-card'
import DailyGoalsCard from '@/components/dashboard/daily-goals-card'
import YesterdayPerformance from '@/components/dashboard/yesterday-performance'
import RealTimeAnalytics from '@/components/dashboard/real-time-analytics'
import BackupManager from '@/components/backup/backup-manager'
import SyncIndicator from '@/components/dashboard/sync-indicator'
import {
  SparklesIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

// Adaptive Theme based on time of day
const getTimeBasedTheme = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'   // Sunrise energy
  if (hour >= 12 && hour < 17) return 'day'      // Focused study
  if (hour >= 17 && hour < 21) return 'evening'  // Golden hour calm
  return 'night'                                 // Deep focus & rest
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [theme, setTheme] = useState<'morning' | 'day' | 'evening' | 'night'>('day')
  const { triggerSync } = useProductionSync()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/landing')
    }
    setTheme(getTimeBasedTheme())
  }, [session, status, router])

  // Re-calculate theme every minute
  useEffect(() => {
    const interval = setInterval(() => setTheme(getTimeBasedTheme()), 60000)
    return () => clearInterval(interval)
  }, [])

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 border-4 border-t-pink-500 border-r-purple-500 border-b-cyan-500 border-l-transparent rounded-full"
        />
        <p className="absolute text-white text-xl mt-32 font-light">Opening your world, Misti… ♡</p>
      </div>
    )
  }

  const quickActions = [
    { href: '/daily-goals', icon: ChartBarIcon, title: 'Daily Goals', desc: 'Questions & targets', emoji: '🎯', gradient: 'from-emerald-500 to-teal-600' },
    { href: '/tests', icon: AcademicCapIcon, title: 'Test Scores', desc: 'Performance history', emoji: '📊', gradient: 'from-purple-500 to-pink-600' },
    { href: '/subjects/physics', icon: SparklesIcon, title: 'Study Now', desc: 'Jump right in', emoji: '📚', gradient: 'from-blue-500 to-cyan-500' },
    { href: '/mood', icon: HeartIcon, title: 'Mood Tracker', desc: 'How you feel today', emoji: '💖', gradient: 'from-rose-500 to-pink-600' },
    { href: '/pomodoro', icon: ClockIcon, title: 'Focus Timer', desc: 'Deep work session', emoji: '⏱', gradient: 'from-orange-500 to-red-600' },
  ]

  // Theme-based background layers
  const themeGradients = {
    morning: 'from-orange-400/20 via-yellow-300/20 to-pink-400/20',
    day: 'from-blue-500/20 via-cyan-400/20 to-teal-500/20',
    evening: 'from-amber-500/30 via-orange-500/20 to-purple-600/20',
    night: 'from-indigo-600/30 via-purple-700/30 to-pink-800/20',
  }

  return (
    <>
      <QuestionMilestoneNotification />

      {/* Full-screen Spatial Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${themeGradients[theme]} blur-3xl`} />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -top-96 -left-96 w-[800px] h-[800px] bg-gradient-radial from-pink-500/20 to-transparent rounded-full"
        />
        <motion.div
          animate={{ rotate: [-360, 0] }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-96 -right-96 w-[1000px] h-[1000px] bg-gradient-radial from-cyan-500/20 to-transparent rounded-full"
        />
      </div>

      <DashboardLayout
        title="Dr. Misti ♡"
        subtitle="Every question brings you closer to the white coat"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 pb-12"
        >
          {/* Immersive Hero – Vision Pro Style */}
          <motion.section
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 20 }}
            className="relative isolate"
          >
            <div className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/20" />
              <div className="relative p-10 md:p-16 lg:p-20">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="flex items-center gap-4 mb-6"
                >
                  <span className="text-5xl">{theme === 'morning' ? '🌅' : theme === 'evening' ? '🌇' : '✨'}</span>
                  <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                    Good {theme === 'morning' ? 'Morning' : theme === 'day' ? 'Afternoon' : theme === 'evening' ? 'Evening' : 'Night'}, Misti
                  </h1>
                </motion.div>

                <p className="text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed mb-10">
                  Today is another step toward wearing that white coat with your name on it. I'm so proud of you. ♡
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/insights">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-500/30 flex items-center gap-3"
                    >
                      <RocketLaunchIcon className="h-6 w-6" />
                      Get AI Insights
                    </motion.button>
                  </Link>
                  <Link href="/analytics">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-semibold"
                    >
                      Deep Analytics →
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Floating Dynamic Islands */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {quickActions.map((action, i) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.4 }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative h-48 rounded-3xl overflow-hidden bg-black/30 backdrop-blur-3xl border border-white/10 shadow-xl"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-60 group-hover:opacity-80 transition-opacity`} />
                  <div className="relative h-full p-6 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-2xl bg-white/20 backdrop-blur">
                        <action.icon className="h-8 w-8" />
                      </div>
                      <motion.span
                        animate={{ rotate: [0, 15, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                        className="text-4xl"
                      >
                        {action.emoji}
                      </motion.span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{action.title}</h3>
                      <p className="text-sm opacity-80">{action.desc}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Real-time Analytics Island */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="relative rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Live Progress</h2>
              <p className="text-white/70 mb-6">Watching you grow in real-time ♡</p>
              <RealTimeAnalytics />
            </div>
          </motion.div>

          {/* Bento Grid – Spatial Layers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Subjects – Main Island */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="lg:col-span-8 rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-2">Subject Mastery</h2>
                <p className="text-white/70 mb-6">NEET syllabus, conquered chapter by chapter</p>
                <SubjectsGrid />
              </div>
            </motion.div>

            {/* Right Sidebar Islands */}
            <div className="lg:col-span-4 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Today's Mission</h3>
                <DailyGoalsCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-4">Yesterday's Glory</h3>
                <YesterdayPerformance />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                className="rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
              >
                <BackupManager />
              </motion.div>
            </div>
          </div>

          {/* Bottom Row – Emotional & Analytical */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Question Journey</h2>
              <QuestionAnalyticsCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="rounded-3xl bg-gradient-to-br from-rose-500/20 via-pink-500/20 to-purple-600/20 backdrop-blur-3xl border border-white/10 shadow-2xl p-8"
            >
              <MistiMotivationCard showName={true} />
            </motion.div>
          </div>

          {/* Gentle Footer Love Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="text-center py-12"
          >
            <p className="text-white/60 text-lg">
              Built with endless love for you, Misti. You've got this. ♡
            </p>
          </motion.div>
        </motion.div>
      </DashboardLayout>
      <SyncIndicator />
    </>
  )
}