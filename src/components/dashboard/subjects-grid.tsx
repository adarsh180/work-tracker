'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import SubjectCard from './subject-card'

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
  
  const { data: subjects = [], isLoading: loading, error } = useQuery<SubjectSummary[]>({
    queryKey: ['subjects-dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/subjects/dashboard')
      if (!response.ok) throw new Error('Failed to fetch subjects')
      return response.json()
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    staleTime: 1000, // Consider data stale after 1 second
    refetchOnWindowFocus: true // Refetch when window gains focus
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
        <div className="text-red-400 mb-2">⚠️ Error Loading Subjects</div>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-white flex items-center gap-3"
        >
          <span>Subject Progress for</span>
          <motion.span
            className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
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
            Misti
          </motion.span>
          <motion.span
            animate={{ rotate: [0, 20, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💕
          </motion.span>
        </motion.h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {subjects.length} subjects • Click to view details
          </div>
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
            }}
            className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full hover:bg-primary/30 transition-colors"
            title="Refresh progress data"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            id={subject.id}
            name={subject.name}
            completionPercentage={subject.completionPercentage}
            totalChapters={subject.totalChapters}
            totalLectures={subject.totalLectures}
            completedLectures={subject.completedLectures}
            totalQuestions={subject.totalQuestions}
            emoji={subject.emoji}
          />
        ))}
      </div>

      {/* Overall Progress Summary */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Overall Progress Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {Math.round(subjects.reduce((acc, s) => acc + s.completionPercentage, 0) / subjects.length || 0)}%
            </div>
            <div className="text-gray-400 text-sm">Average Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {subjects.reduce((acc, s) => acc + s.completedLectures, 0)}
            </div>
            <div className="text-gray-400 text-sm">Lectures Done</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {subjects.reduce((acc, s) => acc + s.totalQuestions, 0).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {subjects.reduce((acc, s) => acc + s.totalChapters, 0)}
            </div>
            <div className="text-gray-400 text-sm">Total Chapters</div>
          </div>
        </div>
      </div>
    </div>
  )
}