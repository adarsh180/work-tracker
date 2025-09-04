'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface SubjectCardProps {
  id: string
  name: string
  completionPercentage: number
  totalChapters: number
  totalLectures: number
  completedLectures: number
  totalQuestions: number
  emoji: string
}

export default function SubjectCard({
  id,
  name,
  completionPercentage,
  totalChapters,
  totalLectures,
  completedLectures,
  totalQuestions,
  emoji
}: SubjectCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/subjects/${id}`)
  }

  // Determine colors based on completion percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 75) return 'text-red-400 border-red-400/30 bg-red-400/10'
    if (percentage < 85) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
    if (percentage < 95) return 'text-green-400 border-green-400/30 bg-green-400/10'
    return 'text-pink-400 border-pink-400/30 bg-pink-400/10'
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 75) return 'bg-red-400'
    if (percentage < 85) return 'bg-yellow-400'
    if (percentage < 95) return 'bg-green-400'
    return 'bg-pink-400'
  }

  const progressColorClass = getProgressColor(completionPercentage)
  const progressBarColorClass = getProgressBarColor(completionPercentage)

  // Animation for kiss emoji when completion > 95%
  const shouldAnimate = completionPercentage > 95

  return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCardClick}
        className={`
          glass-effect rounded-xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer
          border ${progressColorClass.split(' ')[1]} ${progressColorClass.split(' ')[2]}
        `}
      >
        {/* Header with Subject Name and Emoji */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">
            {name}
          </h3>
          <motion.div
            className="text-3xl"
            animate={shouldAnimate ? {
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            } : {}}
            transition={{
              duration: 0.6,
              repeat: shouldAnimate ? Infinity : 0,
              repeatDelay: 2
            }}
          >
            {emoji}
          </motion.div>
        </div>

        {/* Progress Circle and Percentage */}
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-24 h-24">
            {/* Background Circle */}
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-700"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                className={progressColorClass.split(' ')[0]}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 0.5s ease-in-out'
                }}
              />
            </svg>
            {/* Percentage Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${progressColorClass.split(' ')[0]}`}>
                {Math.round(completionPercentage)}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${progressBarColorClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Chapters:</span>
            <span className="text-white">{totalChapters}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Lectures:</span>
            <span className="text-white">{completedLectures}/{totalLectures}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Questions:</span>
            <span className="text-white">{totalQuestions.toLocaleString()}</span>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className={`text-sm text-center ${progressColorClass.split(' ')[0]}`}>
            {completionPercentage < 75 && "Keep pushing! You&apos;ve got this! 💪"}
            {completionPercentage >= 75 && completionPercentage < 85 && "Good progress! Stay focused! 🎯"}
            {completionPercentage >= 85 && completionPercentage < 95 && "Excellent work! Almost there! ⭐"}
            {completionPercentage >= 95 && "Outstanding! You&apos;re crushing it! 🏆"}
          </p>
        </div>
      </motion.div>
  )
}