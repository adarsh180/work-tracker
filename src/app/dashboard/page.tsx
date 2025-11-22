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
import BackupManager from '@/components/backup/backup-manager'
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

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.replace('/landing')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <div className="text-foreground text-xl font-medium">Loading your tracker, Misti... 💕</div>
        </motion.div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const quickActions = [
    {
      href: '/daily-goals',
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: 'Daily Goals',
      description: 'Track questions & progress',
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      emoji: '🎯'
    },
    {
      href: '/tests',
      icon: <AcademicCapIcon className="h-6 w-6" />,
      title: 'Test Scores',
      description: 'Record performance',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      emoji: '📊'
    },
    {
      href: '/subjects/physics',
      icon: <SparklesIcon className="h-6 w-6" />,
      title: 'Study Now',
      description: 'Continue learning',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      emoji: '📚'
    },
    {
      href: '/mood',
      icon: <HeartIcon className="h-6 w-6" />,
      title: 'Mood Tracker',
      description: 'Log your wellbeing',
      color: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-500/30',
      emoji: '💖'
    },
    {
      href: '/pomodoro',
      icon: <ClockIcon className="h-6 w-6" />,
      title: 'Focus Timer',
      description: 'Start study session',
      color: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      emoji: '⏱️'
    }
  ]

  return (
    <>
      <QuestionMilestoneNotification />
      <DashboardLayout 
        title={`Welcome back, ${session.user?.name || 'Misti'}! 💕`}
        subtitle="Your comprehensive NEET preparation companion"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Hero Welcome Section - Apple-inspired */}
          <motion.div variants={itemVariants}>
            <div className="relative overflow-hidden rounded-3xl bg-mesh-gradient">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-purple/10" />
              <div className="relative glass-effect border-white/[0.08] p-8 md:p-12">
                <div className="max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="text-4xl"
                      >
                        👋
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-semibold text-foreground-secondary">
                        Welcome back,
                      </h2>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
                      {session.user?.name || 'Misti'}
                    </h1>
                    <p className="text-lg md:text-xl text-foreground-secondary max-w-2xl leading-relaxed mb-8">
                      Ready to conquer NEET UG 2026? Track your progress, analyze performance, and stay motivated on your journey to becoming Dr. Misti.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/insights">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-semibold shadow-card hover:shadow-card-hover transition-all"
                        >
                          <RocketLaunchIcon className="h-5 w-5" />
                          AI Insights
                        </motion.button>
                      </Link>
                      <Link href="/analytics">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="inline-flex items-center gap-2 px-6 py-3 glass-effect rounded-2xl font-semibold text-foreground hover:bg-white/[0.12] transition-all"
                        >
                          <ChartBarIcon className="h-5 w-5" />
                          View Analytics
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Backup Manager */}
          <motion.div variants={itemVariants}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Data Backup</h2>
              <p className="text-sm text-foreground-tertiary mt-1">Protect your NEET preparation data</p>
            </div>
            <BackupManager />
          </motion.div>

          {/* Motivational Messages */}
          <motion.div variants={itemVariants}>
            <MotivationalMessages />
          </motion.div>

          {/* Quick Actions Grid - Apple Card Style */}
          <motion.div variants={itemVariants}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRightIcon className="h-5 w-5 text-foreground-tertiary" />
              </motion.div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {quickActions.map((action, index) => (
                <Link key={action.href} href={action.href}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative overflow-hidden rounded-3xl"
                    >
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-50`} />
                    <div className={`relative glass-effect border ${action.borderColor} p-6 h-full transition-all`}>
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-2xl bg-white/[0.08] group-hover:bg-white/[0.12] transition-all">
                            {action.icon}
                          </div>
                          <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                            className="text-2xl"
                          >
                            {action.emoji}
                          </motion.span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {action.title}
                        </h3>
                        <p className="text-sm text-foreground-tertiary mb-4 flex-grow">
                          {action.description}
                        </p>
                        <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                          <span>Open</span>
                          <ArrowRightIcon className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </div>
                  </div>
                </motion.div>
              </Link>
              ))}
            </div>
          </motion.div>

          {/* Real-time Analytics Section */}
          <motion.div variants={itemVariants}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">Real-time Analytics</h2>
              <p className="text-sm text-foreground-tertiary mt-1">Live performance metrics</p>
            </div>
            <RealTimeAnalytics />
          </motion.div>

          {/* Main Content Grid - Bento Box Layout */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Subjects Grid - Takes 8 columns */}
              <div className="xl:col-span-8">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Subject Progress</h2>
                  <p className="text-sm text-foreground-tertiary mt-1">Track your NEET syllabus completion</p>
                </div>
                <SubjectsGrid />
              </div>

              {/* Sidebar - Takes 4 columns */}
              <div className="xl:col-span-4 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Today's Goals</h2>
                  <DailyGoalsCard />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Yesterday</h2>
                  <YesterdayPerformance />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Analytics Row */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Question Analytics</h2>
                <QuestionAnalyticsCard />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Motivation</h2>
                <MistiMotivationCard showName={false} />
              </div>
            </div>
          </motion.div>

        </motion.div>
      </DashboardLayout>
    </>
  )
}