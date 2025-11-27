'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import SubjectCard from './subject-card'
import { useEffect, useRef } from 'react'
import { useProductionSync } from '@/hooks/use-production-sync'

interface SubjectSummary {
  id: string
  name: string
  totalChapters: number
  completionPercentage: number
  totalLectures: number
  completedLectures: number
  totalQuestions: number
  emoji: string
}

export default function SubjectsGrid() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { triggerSync } = useProductionSync()

  // Listen for chapter updates and invalidate queries
  useEffect(() => {
    const handleChapterUpdate = () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      updateTimeoutRef.current = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
        queryClient.refetchQueries({ queryKey: ['subjects-dashboard'] })
      }, 500)
    }

    window.addEventListener('chapterProgressUpdated', handleChapterUpdate)
    window.addEventListener('lectureCompleted', handleChapterUpdate)
    window.addEventListener('dppCompleted', handleChapterUpdate)
    window.addEventListener('assignmentCompleted', handleChapterUpdate)

    return () => {
      window.removeEventListener('chapterProgressUpdated', handleChapterUpdate)
      window.removeEventListener('lectureCompleted', handleChapterUpdate)
      window.removeEventListener('dppCompleted', handleChapterUpdate)
      window.removeEventListener('assignmentCompleted', handleChapterUpdate)
    }
  }, [queryClient])

  const { data: subjects = [], isLoading: loading, error } = useQuery<SubjectSummary[]>({
    queryKey: ['subjects-dashboard'],
    queryFn: async () => {
      // Vercel-optimized fetch with cache busting
      const timestamp = Date.now()
      const response = await fetch(`/api/subjects/dashboard?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      if (!response.ok) throw new Error('Failed to fetch subjects')
      return response.json()
    },
    refetchInterval: 3000, // 3 seconds for Vercel serverless functions
    staleTime: 0, // Always consider data stale
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchIntervalInBackground: false, // Disable for Vercel performance
    retry: 2, // Reduced retries for Vercel
    retryDelay: attemptIndex => Math.min(2000 * 2 ** attemptIndex, 10000)
  })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-effect rounded-xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-700 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-effect rounded-xl p-6 text-center">
        <div className="text-red-400 mb-2">Error Loading Subjects</div>
        <p className="text-gray-400 text-sm">{error instanceof Error ? error.message : 'An error occurred'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (subjects.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No Subjects Found
        </h3>
        <p className="text-gray-400 mb-4">
          It looks like your subjects haven&apos;t been set up yet. The system should automatically create Physics, Chemistry, Botany, and Zoology subjects with their chapters.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  const avgProgress = Math.round(subjects.reduce((acc, s) => acc + s.completionPercentage, 0) / subjects.length || 0)
  const getProgressMessage = (progress: number) => {
    if (progress >= 90) return { msg: "Misti, tum almost doctor ho! 👩⚕️", emoji: "🔥" }
    if (progress >= 70) return { msg: "Bahut accha chal raha hai! 💪", emoji: "✨" }
    if (progress >= 50) return { msg: "Keep going, meri jaan! 💕", emoji: "🌟" }
    return { msg: "Shuru karte hain, slowly! 🌱", emoji: "💖" }
  }

  const progressMsg = getProgressMessage(avgProgress)

  return (
    <div className="space-y-8">
      {/* Romantic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-rose-500/20 backdrop-blur-xl border border-white/10 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-400/10" />
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent mb-2">
              Tumhara NEET Journey
            </h2>
            <p className="text-white/80 flex items-center gap-2">
              <span className="text-2xl">{progressMsg.emoji}</span>
              {progressMsg.msg}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => triggerSync()}
            className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
          >
            Refresh 🔄
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group"
          >
            <SubjectCard
              id={subject.id}
              name={subject.name}
              completionPercentage={subject.completionPercentage}
              totalChapters={subject.totalChapters}
              totalLectures={subject.totalLectures}
              completedLectures={subject.completedLectures}
              totalQuestions={subject.totalQuestions}
              emoji={subject.emoji}
              index={index}
            />
          </motion.div>
        ))}
      </div>

      {/* Romantic Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-purple-600/20" />
        <div className="relative p-8">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              💕
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Misti ka Overall Progress
            </h3>
            <p className="text-white/70">
              Har subject mein tumhara pyaar dikh raha hai
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-2">
                {avgProgress}%
              </div>
              <div className="text-pink-200 text-sm font-medium">Average Progress</div>
              <div className="text-xs text-pink-300/70 mt-1">Tumhara overall</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">
                {subjects.reduce((acc, s) => acc + s.completedLectures, 0)}
              </div>
              <div className="text-green-200 text-sm font-medium">Lectures Done</div>
              <div className="text-xs text-green-300/70 mt-1">Kitna padha hai!</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-2">
                {subjects.reduce((acc, s) => acc + s.totalQuestions, 0).toLocaleString()}
              </div>
              <div className="text-yellow-200 text-sm font-medium">Total Questions</div>
              <div className="text-xs text-yellow-300/70 mt-1">Kitne sawal!</div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-400/30"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent mb-2">
                {subjects.reduce((acc, s) => acc + s.totalChapters, 0)}
              </div>
              <div className="text-purple-200 text-sm font-medium">Total Chapters</div>
              <div className="text-xs text-purple-300/70 mt-1">Poora syllabus</div>
            </motion.div>
          </div>
          
          <div className="text-center mt-8 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-400/20">
            <p className="text-lg text-pink-200 italic">
              "Har chapter jo complete hota hai,<br />
              <span className="text-white font-semibold">Dr. Misti ke sapne ko aur paas le aata hai."</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}