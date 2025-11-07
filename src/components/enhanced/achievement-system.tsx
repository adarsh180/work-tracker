'use client'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'

export default function AchievementSystem() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: achievements, refetch } = useQuery({
    queryKey: ['achievements', user?.email],
    queryFn: async () => {
      const response = await fetch('/api/achievements')
      if (!response.ok) throw new Error('Failed to fetch achievements')
      return response.json()
    },
    enabled: !!user?.email,
    refetchInterval: 10000, // Refetch every 10 seconds
    staleTime: 5000 // Consider stale after 5 seconds
  })

  const categories = ['all', 'progress', 'consistency', 'performance', 'milestones']
  
  const filteredAchievements = achievements?.filter((achievement: any) => 
    selectedCategory === 'all' || achievement.category === selectedCategory
  ) || []

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-400'
      case 'epic': return 'from-purple-400 to-pink-400'
      case 'rare': return 'from-blue-400 to-cyan-400'
      case 'uncommon': return 'from-green-400 to-emerald-400'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400/50'
      case 'epic': return 'border-purple-400/50'
      case 'rare': return 'border-blue-400/50'
      case 'uncommon': return 'border-green-400/50'
      default: return 'border-gray-400/50'
    }
  }

  const completedCount = achievements?.filter((a: any) => a.isCompleted).length || 0
  const totalCount = achievements?.length || 0
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-effect rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span>🏆</span>
            <span>Achievements</span>
            <motion.span
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💕
            </motion.span>
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-yellow-400">{completedCount}/{totalCount}</div>
            <div className="text-sm text-gray-400">Unlocked</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Category Filter and Refresh */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-background-secondary text-gray-400 hover:text-white'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => refetch()}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-medium transition-colors"
          >
            🔄 Update Progress
          </motion.button>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAchievements.map((achievement: any, index: number) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-effect rounded-xl p-4 border-2 ${getRarityBorder(achievement.rarity)} ${
                achievement.isCompleted ? 'opacity-100' : 'opacity-60'
              }`}
            >
              {/* Achievement Icon */}
              <div className="text-center mb-3">
                <motion.div
                  animate={achievement.isCompleted ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-4xl mb-2"
                >
                  {achievement.icon}
                </motion.div>
                
                {/* Rarity Badge */}
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                  {achievement.rarity.toUpperCase()}
                </div>
              </div>

              {/* Achievement Info */}
              <div className="text-center">
                <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>
                
                {/* Progress Bar */}
                {!achievement.isCompleted && achievement.progress !== undefined && (
                  <div className="mb-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.round(achievement.progress * 100)}% Complete
                    </div>
                  </div>
                )}

                {/* Completion Date */}
                {achievement.isCompleted && achievement.unlockedAt && (
                  <div className="text-xs text-green-400 mb-2">
                    Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}

                {/* Points */}
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-white font-medium">{achievement.points} pts</span>
                </div>

                {/* Completion Status */}
                {achievement.isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2 text-green-400 font-bold text-sm"
                  >
                    ✅ UNLOCKED!
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="glass-effect rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No achievements in this category yet
          </h3>
          <p className="text-gray-400">
            Keep studying to unlock amazing achievements! 💪
          </p>
        </div>
      )}

      {/* Motivational Footer */}
      <div className="glass-effect rounded-xl p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-400/20">
        <div className="text-center">
          <h3 className="text-lg font-bold text-pink-300 mb-2">
            🌟 Keep Going, Misti! 🌟
          </h3>
          <p className="text-pink-200 text-sm">
            Every achievement unlocked brings you closer to your dream of becoming Dr. Misti! 
            You're doing amazing! 💕
          </p>
        </div>
      </div>
    </div>
  )
}