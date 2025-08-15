'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSubjectChanges } from '@/contexts/subject-changes-context'

interface LectureTrackingProps {
  chapterId: string
  lectureCount: number
  lecturesCompleted: boolean[]
  onUpdate: () => void
}

export default function LectureTracking({
  chapterId,
  lectureCount,
  lecturesCompleted,
  onUpdate
}: LectureTrackingProps) {
  const [loading, setLoading] = useState<number | null>(null)

  const { addChange } = useSubjectChanges()
  const [localLectures, setLocalLectures] = useState(lecturesCompleted)
  
  // Update local state when props change (on login/data load)
  useEffect(() => {
    setLocalLectures(lecturesCompleted)
  }, [lecturesCompleted])

  const handleLectureToggle = (lectureIndex: number) => {
    const newLectures = [...localLectures]
    newLectures[lectureIndex] = !newLectures[lectureIndex]
    setLocalLectures(newLectures)
    
    // Add to pending changes
    addChange({
      chapterId,
      field: 'lecturesCompleted',
      value: newLectures
    })
  }

  const completedCount = localLectures.filter(Boolean).length
  const progressPercentage = lectureCount > 0 ? (completedCount / lectureCount) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white flex items-center">
          <span className="text-blue-400 mr-2">📚</span>
          Lectures ({completedCount}/{lectureCount})
        </h4>
        <div className="text-right">
          <div className="text-sm text-gray-400">Progress</div>
          <div className="text-lg font-semibold text-blue-400">
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className="h-2 rounded-full bg-blue-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Lecture Checkboxes */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {Array.from({ length: lectureCount }, (_, index) => {
          const isCompleted = localLectures[index] || false
          const isLoading = loading === index

          return (
            <motion.button
              key={index}
              onClick={() => handleLectureToggle(index)}
              disabled={isLoading}
              className={`
                relative aspect-square rounded-lg border-2 transition-all duration-200
                flex items-center justify-center text-sm font-medium
                ${isCompleted 
                  ? 'bg-blue-400/20 border-blue-400 text-blue-400' 
                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-blue-400/50 hover:text-blue-400'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-blue-400"
                >
                  ✓
                </motion.div>
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const newLectures = Array(lectureCount).fill(true)
              setLocalLectures(newLectures)
              addChange({
                chapterId,
                field: 'lecturesCompleted',
                value: newLectures
              })
            }}
            className="text-xs px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full hover:bg-blue-400/30 transition-colors"
          >
            Mark All Complete
          </button>
          <button
            onClick={() => {
              const newLectures = Array(lectureCount).fill(false)
              setLocalLectures(newLectures)
              addChange({
                chapterId,
                field: 'lecturesCompleted',
                value: newLectures
              })
            }}
            className="text-xs px-3 py-1 bg-gray-600/50 text-gray-400 rounded-full hover:bg-gray-600/70 transition-colors"
          >
            Reset All
          </button>
        </div>
        
        <div className="text-xs text-gray-400">
          {completedCount > 0 && (
            <span>
              {progressPercentage >= 100 ? '🎉 Complete!' : 
               progressPercentage >= 75 ? '🔥 Almost there!' :
               progressPercentage >= 50 ? '💪 Good progress!' :
               '🚀 Keep going!'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}