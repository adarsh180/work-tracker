'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import DailyGoalsForm from '@/components/daily-goals/daily-goals-form'
import QuestionStats from '@/components/daily-goals/question-stats'
import RecentGoals from '@/components/daily-goals/recent-goals'
import DailyGoalsCharts from '@/components/daily-goals/daily-goals-charts'
import QuestionHeatmap from '@/components/daily-goals/question-heatmap'
import { Card, CardContent, CardHeader, CardTitle, StatsCard } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, Progress } from '@/components/ui/enhanced-components'
import { ProgressRing, AnimatedCounter } from '@/components/ui/premium-charts'
import { Grid, TabsLayout } from '@/components/ui/premium-layouts'
import {
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  FireIcon,
  TrophyIcon,
  StarIcon,
  RocketLaunchIcon,
  BoltIcon,
  HeartIcon,
  SparklesIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

type TabKey = 'today' | 'stats' | 'history'

export default function DailyGoalsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('today')

  const performanceLevels = [
    {
      emoji: '🔥',
      threshold: 500,
      label: 'FIRE!',
      color: 'error',
      description: 'Legendary performance',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      emoji: '😘',
      threshold: 300,
      label: 'Amazing',
      color: 'warning',
      description: 'Outstanding work',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      emoji: '😊',
      threshold: 250,
      label: 'Great',
      color: 'success',
      description: 'Excellent progress',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      emoji: '😐',
      threshold: 150,
      label: 'Good',
      color: 'info',
      description: 'Steady progress',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      emoji: '😟',
      threshold: 1,
      label: 'Keep going',
      color: 'primary',
      description: 'Every step counts',
      gradient: 'from-purple-500 to-indigo-500'
    }
  ]

  const dailyTargets = [
    {
      label: 'Daily Questions',
      target: 250,
      icon: <AcademicCapIcon className="h-5 w-5" />,
      color: 'primary',
      description: 'Minimum daily target'
    },
    {
      label: 'Excellence Level',
      target: 500,
      icon: <StarIcon className="h-5 w-5" />,
      color: 'warning',
      description: 'Peak performance'
    },
    {
      label: 'Weekly Goal',
      target: 6800,
      icon: <TrophyIcon className="h-5 w-5" />,
      color: 'success',
      description: 'Weekly milestone'
    },
    {
      label: 'Monthly Goal',
      target: 27500,
      icon: <RocketLaunchIcon className="h-5 w-5" />,
      color: 'error',
      description: 'Monthly achievement'
    }
  ]

  return (
    <DashboardLayout
      title="Daily Goals"
      subtitle="Track your daily NEET preparation progress with gamification"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-glow">
                <TrophyIcon className="h-10 w-10 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <SparklesIcon className="h-4 w-4 text-yellow-900" />
              </motion.div>
            </motion.div>

            <div>
              <motion.h1
                className="text-4xl md:text-6xl font-bold gradient-text"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Daily Goals
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center justify-center gap-2 mt-3"
              >
                {['🎯', '📚', '💪', '🏆', '⭐', '🔥', '💎'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      delay: i * 0.2,
                      duration: 2,
                      repeat: Infinity
                    }}
                    className="text-2xl"
                  >
                    {emoji}
                  </motion.span>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-foreground-secondary max-w-3xl mx-auto leading-relaxed"
          >
            Track your daily NEET preparation progress with
            <motion.span
              className="font-bold text-primary mx-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              gamification
            </motion.span>
            and achieve excellence
          </motion.p>
        </motion.div>

        {/* Premium Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <TabsLayout
            activeTab={activeTab}
            onTabChange={(tabId: string) => setActiveTab(tabId as TabKey)}
            variant="pills"
            tabs={[
              {
                id: 'today',
                label: "Today's Goals",
                icon: <PlusIcon className="h-4 w-4" />,
                content: renderTodayTab()
              },
              {
                id: 'stats',
                label: 'Statistics',
                icon: <ChartBarIcon className="h-4 w-4" />,
                content: renderStatsTab()
              },
              {
                id: 'history',
                label: 'History',
                icon: <CalendarIcon className="h-4 w-4" />,
                content: renderHistoryTab()
              }
            ]}
          />
        </motion.div>
      </motion.div>
    </DashboardLayout >
  )

  function renderTodayTab() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <Grid cols={3} gap="lg" responsive={{ sm: 1, lg: 3 }}>
          <div className="lg:col-span-2">
            <DailyGoalsForm />
          </div>

          <div className="space-y-6">
            {/* Daily Targets Card */}
            <Card variant="premium" hover="both" asMotion>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <TrophyIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="gradient-text">Daily Targets</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyTargets.map((target, index) => (
                    <motion.div
                      key={target.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-4 hover:shadow-glow transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${target.color === 'primary' ? 'bg-primary/20' :
                            target.color === 'success' ? 'bg-success/20' :
                              target.color === 'warning' ? 'bg-warning/20' :
                                'bg-error/20'
                            }`}>
                            {target.icon}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{target.label}</div>
                            <div className="text-xs text-foreground-muted">{target.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${target.color === 'primary' ? 'text-primary' :
                            target.color === 'success' ? 'text-success-500' :
                              target.color === 'warning' ? 'text-warning-500' :
                                'text-error-500'
                            }`}>
                            {target.target.toLocaleString()}+
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Levels Card */}
            <Card variant="premium" hover="both" asMotion>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-warning/20">
                    <FireIcon className="h-5 w-5 text-warning-500" />
                  </div>
                  <span className="gradient-text">Performance Levels</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceLevels.map((level, index) => (
                    <motion.div
                      key={level.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`glass-card p-4 bg-gradient-to-r ${level.gradient} bg-opacity-5 border border-opacity-20 hover:shadow-glow transition-all duration-300`}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.2
                          }}
                          className="text-3xl"
                        >
                          {level.emoji}
                        </motion.div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-foreground">{level.threshold}+ questions</span>
                            <Badge variant={level.color as any} size="sm">
                              {level.label}
                            </Badge>
                          </div>
                          <div className="text-sm text-foreground-secondary">{level.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </motion.div>
    )
  }

  function renderStatsTab() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <QuestionHeatmap />
        <QuestionStats />
      </motion.div>
    )
  }

  function renderHistoryTab() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <QuestionHeatmap />
        <DailyGoalsCharts />
        <RecentGoals />
      </motion.div>
    )
  }
}