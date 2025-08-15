'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface RevisionScoringProps {
  chapterId: string
  revisionScore: number
  onUpdate: () => void
}

export default function RevisionScoring({
  chapterId,
  revisionScore,
  onUpdate
}: RevisionScoringProps) {
  const [loading, setLoading] = useState(false)
  const [currentScore, setCurrentScore] = useState(revisionScore)

  const handleScoreUpdate = async (newScore: number) => {
    try {
      setLoading(true)
      setCurrentScore(newScore)
      
      const response = await fetch(`/api/chapters/${chapterId}/revision`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          revisionScore: newScore
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update revision score')
      }

      // Trigger parent component update
      onUpdate()
    } catch (error) {
      console.error('Error updating revision score:', error)
      // Revert to previous score on error
      setCurrentScore(revisionScore)
      // TODO: Add toast notification for error
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score < 6) return 'text-red-400'
    return 'text-green-400'
  }

  const getScoreStatus = (score: number) => {
    if (score < 6) return { text: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' }
    return { text: 'Good', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' }
  }

  const scoreStatus = getScoreStatus(currentScore)
  const shouldAnimate = currentScore === 10

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white flex items-center">
          <span className="text-yellow-400 mr-2">📚</span>
          Revision Quality Score
        </h4>
        <div className="text-right">
          <div className="text-sm text-gray-400">Current Score</div>
          <div className={`text-2xl font-bold ${getScoreColor(currentScore)} flex items-center`}>
            {currentScore}/10
            {shouldAnimate && (
              <motion.span
                className="ml-2 text-pink-400"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                😘
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {/* Score Status Badge */}
      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${scoreStatus.bg} ${scoreStatus.border}`}>
        <div className={`w-2 h-2 rounded-full ${scoreStatus.color.replace('text-', 'bg-')} mr-2`} />
        <span className={`text-sm font-medium ${scoreStatus.color}`}>
          {scoreStatus.text}
        </span>
      </div>

      {/* Score Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>Poor (1)</span>
          <span>Excellent (10)</span>
        </div>
        
        <div className="relative">
          <input
            type="range"
            min="1"
            max="10"
            value={currentScore}
            onChange={(e) => {
              const newScore = parseInt(e.target.value)
              setCurrentScore(newScore)
            }}
            onMouseUp={(e) => {
              const newScore = parseInt((e.target as HTMLInputElement).value)
              if (newScore !== revisionScore) {
                handleScoreUpdate(newScore)
              }
            }}
            onTouchEnd={(e) => {
              const newScore = parseInt((e.target as HTMLInputElement).value)
              if (newScore !== revisionScore) {
                handleScoreUpdate(newScore)
              }
            }}
            disabled={loading}
            className={`
              w-full h-2 rounded-lg appearance-none cursor-pointer
              ${currentScore < 6 ? 'bg-red-400/20' : 'bg-green-400/20'}
              slider
            `}
            style={{
              background: `linear-gradient(to right, 
                ${currentScore < 6 ? '#ef4444' : '#22c55e'} 0%, 
                ${currentScore < 6 ? '#ef4444' : '#22c55e'} ${(currentScore / 10) * 100}%, 
                #374151 ${(currentScore / 10) * 100}%, 
                #374151 100%)`
            }}
          />
          
          {/* Score markers */}
          <div className="flex justify-between mt-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i + 1}
                className={`text-xs ${
                  i + 1 <= currentScore 
                    ? (currentScore < 6 ? 'text-red-400' : 'text-green-400')
                    : 'text-gray-600'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Score Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {[2, 4, 6, 8, 10].map((score) => (
          <button
            key={score}
            onClick={() => handleScoreUpdate(score)}
            disabled={loading}
            className={`
              py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
              ${currentScore === score
                ? (score < 6 ? 'bg-red-400 text-white' : 'bg-green-400 text-white')
                : (score < 6 
                    ? 'bg-red-400/20 text-red-400 hover:bg-red-400/30' 
                    : 'bg-green-400/20 text-green-400 hover:bg-green-400/30'
                  )
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
            `}
          >
            {score}
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-2">
          <div className="w-4 h-4 border border-primary border-t-transparent rounded-full animate-spin mr-2" />
          <span className="text-sm text-gray-400">Updating score...</span>
        </div>
      )}

      {/* Score Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-red-400 text-sm">⚠️</div>
            <div className="text-xs text-red-400">
              <strong>Needs Improvement (1-5):</strong> Chapter requires more revision. 
              Consider reviewing concepts, solving more problems, or seeking help.
            </div>
          </div>
        </div>
        
        <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="text-green-400 text-sm">✅</div>
            <div className="text-xs text-green-400">
              <strong>Good (6-10):</strong> Chapter is well-revised and understood. 
              You&apos;re confident with the concepts and problem-solving approach.
            </div>
          </div>
        </div>
      </div>

      {/* Revision Tips */}
      <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="text-yellow-400 text-sm">💡</div>
          <div className="text-xs text-yellow-400">
            <strong>Revision Tips:</strong>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Score 1-3: Start with basic concepts and theory</li>
              <li>Score 4-5: Practice more problems and identify weak areas</li>
              <li>Score 6-7: Focus on advanced problems and time management</li>
              <li>Score 8-9: Perfect your approach and solve challenging questions</li>
              <li>Score 10: Maintain your level with periodic review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}