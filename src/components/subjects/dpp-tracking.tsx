'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSubjectChanges } from '@/contexts/subject-changes-context'
import DppQuestionInput from './dpp-question-input'

interface DppTrackingProps {
  chapterId: string
  dppCount: number // Equal to lecture count
  dppCompleted: boolean[]
  dppQuestionCounts: number[]
  onUpdate: () => void
}

export default function DppTracking({
  chapterId,
  dppCount,
  dppCompleted,
  dppQuestionCounts,
  onUpdate
}: DppTrackingProps) {
  const [loading, setLoading] = useState<number | null>(null)

  const { addChange } = useSubjectChanges()
  const [localDpp, setLocalDpp] = useState(dppCompleted)
  
  // Update local state when props change (on login/data load)
  useEffect(() => {
    setLocalDpp(dppCompleted)
  }, [dppCompleted])

  const handleDppToggle = (dppIndex: number) => {
    const newDpp = [...localDpp]
    newDpp[dppIndex] = !newDpp[dppIndex]
    setLocalDpp(newDpp)
    
    // Add to pending changes
    addChange({
      chapterId,
      field: 'dppCompleted',
      value: newDpp
    })
  }

  const completedCount = localDpp.filter(Boolean).length
  const progressPercentage = dppCount > 0 ? (completedCount / dppCount) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white flex items-center">
          <span className="text-green-400 mr-2">📝</span>
          Daily Practice Problems ({completedCount}/{dppCount})
        </h4>
        <div className="text-right">
          <div className="text-sm text-gray-400">Progress</div>
          <div className="text-lg font-semibold text-green-400">
            {Math.round(progressPercentage)}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          className="h-2 rounded-full bg-green-400"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* DPP Checkboxes */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        {Array.from({ length: dppCount }, (_, index) => {
          const isCompleted = localDpp[index] || false
          const isLoading = loading === index

          return (
            <motion.button
              key={index}
              onClick={() => handleDppToggle(index)}
              disabled={isLoading}
              className={`
                relative aspect-square rounded-lg border-2 transition-all duration-200
                flex items-center justify-center text-sm font-medium
                ${isCompleted 
                  ? 'bg-green-400/20 border-green-400 text-green-400' 
                  : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-green-400/50 hover:text-green-400'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
              `}
              whileHover={!isLoading ? { scale: 1.05 } : {}}
              whileTap={!isLoading ? { scale: 0.95 } : {}}
            >
              {isLoading ? (
                <div className="w-3 h-3 border border-green-400 border-t-transparent rounded-full animate-spin" />
              ) : isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400"
                >
                  ✓
                </motion.div>
              ) : (
                <span className="text-xs">D{index + 1}</span>
              )}
              
              {/* Question count input for completed DPPs */}
              {isCompleted && (
                <div className="absolute -bottom-8 left-0 right-0">
                  <DppQuestionInput
                    chapterId={chapterId}
                    dppIndex={index}
                    currentCount={dppQuestionCounts[index] || 0}
                    isCompleted={isCompleted}
                  />
                </div>
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
              const newDpp = Array(dppCount).fill(true)
              setLocalDpp(newDpp)
              addChange({
                chapterId,
                field: 'dppCompleted',
                value: newDpp
              })
            }}
            className="text-xs px-3 py-1 bg-green-400/20 text-green-400 rounded-full hover:bg-green-400/30 transition-colors"
          >
            Mark All Complete
          </button>
          <button
            onClick={() => {
              const newDpp = Array(dppCount).fill(false)
              setLocalDpp(newDpp)
              addChange({
                chapterId,
                field: 'dppCompleted',
                value: newDpp
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
              {progressPercentage >= 100 ? '🎉 All DPP Complete!' : 
               progressPercentage >= 75 ? '🔥 Almost done!' :
               progressPercentage >= 50 ? '💪 Great progress!' :
               '📝 Keep practicing!'}
            </span>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="text-green-400 text-sm">💡</div>
          <div className="text-xs text-green-400">
            <strong>Daily Practice Problems (DPP):</strong> These are practice questions that correspond to each lecture. 
            Completing DPP helps reinforce the concepts learned in lectures and improves problem-solving skills.
          </div>
        </div>
      </div>
    </div>
  )
}