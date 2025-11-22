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
  index?: number
}

export default function SubjectCard({
  id,
  name,
  completionPercentage,
  totalChapters,
  totalLectures,
  completedLectures,
  totalQuestions,
  emoji,
  index = 0
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
    if (percentage < 75) return 'from-red-500/80 to-red-400'
    if (percentage < 85) return 'from-yellow-500/80 to-yellow-400'
    if (percentage < 95) return 'from-green-500/80 to-green-400'
    return 'from-pink-500/80 to-pink-400'
  }

  const getGlowColor = (percentage: number) => {
    if (percentage < 75) return 'rgba(239, 68, 68, 0.2)'
    if (percentage < 85) return 'rgba(234, 179, 8, 0.2)'
    if (percentage < 95) return 'rgba(34, 197, 94, 0.2)'
    return 'rgba(244, 114, 182, 0.2)'
  }

  const progressColorClass = getProgressColor(completionPercentage)
  const progressBarColorClass = getProgressBarColor(completionPercentage)
  const glowColor = getGlowColor(completionPercentage)

  // Animation for completion > 95%
  const shouldAnimate = completionPercentage > 95

  // Staggered entrance animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className={`
        glass-effect rounded-2xl p-6 cursor-pointer relative overflow-hidden
        border ${progressColorClass.split(' ')[1]} ${progressColorClass.split(' ')[2]}
        transition-all duration-300
      `}
      style={{
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px ${glowColor}`
      }}
    >
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
            ease: 'linear'
          }}
        />
      </div>

      {/* Header with Subject Name and Emoji */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-xl font-semibold text-white tracking-tight">
          {name}
        </h3>
        <motion.div
          className="text-3xl"
          animate={shouldAnimate ? {
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{
            duration: 0.6,
            repeat: shouldAnimate ? Infinity : 0,
            repeatDelay: 3,
            ease: [0.34, 1.56, 0.64, 1]
          }}
        >
          {emoji}
        </motion.div>
      </div>

      {/* Progress Circle and Percentage */}
      <div className="flex items-center justify-center mb-6 relative z-10">
        <div className="relative w-28 h-28">
          {/* Background Circle */}
          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-gray-700/50"
            />
            {/* Progress Circle with gradient */}
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: `${2 * Math.PI * 42}` }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 42 * (1 - completionPercentage / 100)}` }}
              className={progressColorClass.split(' ')[0]}
              strokeLinecap="round"
              transition={{
                duration: 1.5,
                delay: index * 0.1 + 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                filter: `drop-shadow(0 0 8px ${glowColor})`
              }}
            />
          </svg>
          {/* Percentage Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className={`text-2xl font-bold ${progressColorClass.split(' ')[0]}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1 + 0.5,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            >
              {Math.round(completionPercentage)}%
            </motion.span>
          </div>
        </div>
      </div>

      {/* Progress Bar with liquid animation */}
      <div className="mb-6 relative z-10">
        <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className={`h-2.5 rounded-full bg-gradient-to-r ${progressBarColorClass}`}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `${completionPercentage}%`, opacity: 1 }}
            transition={{
              duration: 1.2,
              delay: index * 0.1 + 0.4,
              ease: [0.16, 1, 0.3, 1]
            }}
            style={{
              boxShadow: `0 0 12px ${glowColor}`
            }}
          />
        </div>
      </div>

      {/* Stats with refined spacing */}
      <div className="space-y-3 text-sm relative z-10">
        <div className="flex justify-between text-gray-400">
          <span className="font-medium">Chapters</span>
          <span className="text-white font-semibold">{totalChapters}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span className="font-medium">Lectures</span>
          <span className="text-white font-semibold">{completedLectures}/{totalLectures}</span>
        </div>
        <div className="flex justify-between text-gray-400">
          <span className="font-medium">Questions</span>
          <span className="text-white font-semibold">{totalQuestions.toLocaleString()}</span>
        </div>
      </div>

      {/* Status Message - Minimal and clean */}
      <motion.div
        className="mt-5 pt-5 border-t border-gray-700/50 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.8 }}
      >
        <p className={`text-sm text-center font-medium ${progressColorClass.split(' ')[0]}`}>
          {completionPercentage < 75 && "Keep pushing forward"}
          {completionPercentage >= 75 && completionPercentage < 85 && "Good progress"}
          {completionPercentage >= 85 && completionPercentage < 95 && "Excellent work"}
          {completionPercentage >= 95 && "Outstanding achievement"}
        </p>
      </motion.div>
    </motion.div>
  )
}