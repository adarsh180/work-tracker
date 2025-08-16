'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuestionAnalyticsSync } from '@/hooks/use-question-analytics'
import { useSubjectChanges } from '@/contexts/subject-changes-context'

interface QuestionsTrackingProps {
  chapterId: string
  assignmentQuestions: number
  assignmentCompleted: boolean[]
  kattarQuestions: number
  kattarCompleted: boolean[]
  onUpdate: () => void
}

export default function QuestionsTracking({
  chapterId,
  assignmentQuestions,
  assignmentCompleted,
  kattarQuestions,
  kattarCompleted,
  onUpdate
}: QuestionsTrackingProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [assignmentCount, setAssignmentCount] = useState(assignmentQuestions.toString())
  const [kattarCount, setKattarCount] = useState(kattarQuestions.toString())
  
  // Local state following same pattern as lectures
  const [localAssignmentCompleted, setLocalAssignmentCompleted] = useState<boolean[]>(assignmentCompleted)
  const [localKattarCompleted, setLocalKattarCompleted] = useState<boolean[]>(kattarCompleted)
  
  const { syncQuestionCounts } = useQuestionAnalyticsSync()
  const { addChange } = useSubjectChanges()
  
  // Update local state when props change
  useEffect(() => {
    setLocalAssignmentCompleted(assignmentCompleted)
    setLocalKattarCompleted(kattarCompleted)
  }, [assignmentCompleted, kattarCompleted])

  const handleQuestionToggle = (type: 'assignment' | 'kattar', questionIndex: number) => {
    if (type === 'assignment') {
      const newCompleted = [...localAssignmentCompleted]
      newCompleted[questionIndex] = !newCompleted[questionIndex]
      setLocalAssignmentCompleted(newCompleted)
      
      // Add to pending changes like lectures
      addChange({
        chapterId,
        field: 'assignmentCompleted',
        value: newCompleted
      })
    } else {
      const newCompleted = [...localKattarCompleted]
      newCompleted[questionIndex] = !newCompleted[questionIndex]
      setLocalKattarCompleted(newCompleted)
      
      // Add to pending changes like lectures
      addChange({
        chapterId,
        field: 'kattarCompleted',
        value: newCompleted
      })
    }
  }

  const handleCountUpdate = async (type: 'assignment' | 'kattar', count: number) => {
    try {
      setLoading(`${type}-count`)
      
      const response = await fetch(`/api/chapters/${chapterId}/questions/count`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          count
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to update ${type} question count`)
      }

      // Trigger parent component update
      onUpdate()
    } catch (error) {
      console.error(`Error updating ${type} question count:`, error)
      // TODO: Add toast notification for error
    } finally {
      setLoading(null)
    }
  }

  const assignmentCompletedCount = localAssignmentCompleted.filter(Boolean).length
  const assignmentProgress = assignmentQuestions > 0 ? (assignmentCompletedCount / assignmentQuestions) * 100 : 0

  const kattarCompletedCount = localKattarCompleted.filter(Boolean).length
  const kattarProgress = kattarQuestions > 0 ? (kattarCompletedCount / kattarQuestions) * 100 : 0

  const renderQuestionSection = (
    type: 'assignment' | 'kattar',
    title: string,
    emoji: string,
    color: string,
    count: number,
    completed: boolean[],
    progress: number,
    completedCount: number,
    countState: string,
    setCountState: (value: string) => void
  ) => (
    <div className="space-y-4">
      {/* Header with Progress */}
      <div className="flex items-center justify-between">
        <h5 className="text-md font-semibold text-white flex items-center">
          <span className={`${color} mr-2`}>{emoji}</span>
          {title} ({completedCount}/{count})
        </h5>
        <div className="text-right">
          <div className="text-sm text-gray-400">Progress</div>
          <div className={`text-lg font-semibold ${color}`}>
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Question Count Input */}
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-400 whitespace-nowrap">
          Number of questions:
        </label>
        <input
          type="number"
          min="0"
          max="1000"
          value={countState}
          onChange={(e) => setCountState(e.target.value)}
          onBlur={() => {
            const newCount = parseInt(countState) || 0
            if (newCount !== count) {
              handleCountUpdate(type, newCount)
            }
          }}
          className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-primary focus:outline-none"
          disabled={loading === `${type}-count`}
        />
        {loading === `${type}-count` && (
          <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Progress Bar */}
      {count > 0 && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Question Checkboxes */}
      {count > 0 && (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {Array.from({ length: count }, (_, index) => {
            const isCompleted = (type === 'assignment' ? localAssignmentCompleted : localKattarCompleted)[index] || false
            const isLoading = false // No individual loading states

            return (
              <motion.button
                key={index}
                onClick={() => handleQuestionToggle(type, index)}
                disabled={false}
                className={`
                  relative aspect-square rounded-lg border-2 transition-all duration-200
                  flex items-center justify-center text-sm font-medium
                  ${isCompleted 
                    ? `${color.replace('text-', 'bg-')}/20 border-${color.split('-')[1]}-400 ${color}` 
                    : `bg-gray-700/50 border-gray-600 text-gray-400 hover:border-${color.split('-')[1]}-400/50 hover:${color}`
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                `}
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={color}
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
      )}

      {/* Quick Actions */}
      {count > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Mark all as complete
                const newCompleted = new Array(count).fill(true)
                if (type === 'assignment') {
                  setLocalAssignmentCompleted(newCompleted)
                  addChange({
                    chapterId,
                    field: 'assignmentCompleted',
                    value: newCompleted
                  })
                } else {
                  setLocalKattarCompleted(newCompleted)
                  addChange({
                    chapterId,
                    field: 'kattarCompleted',
                    value: newCompleted
                  })
                }
              }}
              className={`text-xs px-3 py-1 ${color.replace('text-', 'bg-')}/20 ${color} rounded-full hover:${color.replace('text-', 'bg-')}/30 transition-colors`}
            >
              Mark All Complete
            </button>
            <button
              onClick={() => {
                // Mark all as incomplete
                const newCompleted = new Array(count).fill(false)
                if (type === 'assignment') {
                  setLocalAssignmentCompleted(newCompleted)
                  addChange({
                    chapterId,
                    field: 'assignmentCompleted',
                    value: newCompleted
                  })
                } else {
                  setLocalKattarCompleted(newCompleted)
                  addChange({
                    chapterId,
                    field: 'kattarCompleted',
                    value: newCompleted
                  })
                }
              }}
              className="text-xs px-3 py-1 bg-gray-600/50 text-gray-400 rounded-full hover:bg-gray-600/70 transition-colors"
            >
              Reset All
            </button>
          </div>
          
          <div className="text-xs text-gray-400">
            {completedCount > 0 && (
              <span>
                {progress >= 100 ? '🎉 All done!' : 
                 progress >= 75 ? '🔥 Almost there!' :
                 progress >= 50 ? '💪 Good work!' :
                 '📚 Keep going!'}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Assignment Questions */}
      {renderQuestionSection(
        'assignment',
        'Assignment Questions',
        '📋',
        'text-purple-400',
        assignmentQuestions,
        localAssignmentCompleted,
        assignmentProgress,
        assignmentCompletedCount,
        assignmentCount,
        setAssignmentCount
      )}

      {/* Kattar Questions */}
      {renderQuestionSection(
        'kattar',
        'Kattar Questions',
        '⚡',
        'text-orange-400',
        kattarQuestions,
        localKattarCompleted,
        kattarProgress,
        kattarCompletedCount,
        kattarCount,
        setKattarCount
      )}
      


      {/* Info Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-400/10 border border-purple-400/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-purple-400 text-sm">📋</div>
            <div className="text-xs text-purple-400">
              <strong>Assignment Questions:</strong> These are practice problems assigned by your coaching institute or textbook. 
              Set the count, tick the checkboxes, then use the floating Save button to update your progress.
            </div>
          </div>
        </div>
        
        <div className="bg-orange-400/10 border border-orange-400/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-orange-400 text-sm">⚡</div>
            <div className="text-xs text-orange-400">
              <strong>Kattar Questions:</strong> These are challenging, high-difficulty questions that test your deep understanding. 
              Perfect for building problem-solving confidence. Use the floating Save button to save changes.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}