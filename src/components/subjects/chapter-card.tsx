'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Chapter } from '@prisma/client'
import LectureTracking from './lecture-tracking'
import DppTracking from './dpp-tracking'
import QuestionsTracking from './questions-tracking'
import RevisionScoring from './revision-scoring'

type ChapterWithProgress = Chapter & {
  progress: {
    lectureProgress: number
    dppProgress: number
    assignmentProgress: number
    kattarProgress: number
    overallProgress: number
    needsImprovement: boolean
  }
}

interface ChapterCardProps {
  chapter: ChapterWithProgress
  onUpdate: () => void
}

export default function ChapterCard({ chapter, onUpdate }: ChapterCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  const { progress } = chapter

  // Get progress color based on completion percentage
  const getProgressColor = (percentage: number) => {
    if (percentage < 75) return 'text-red-400 bg-red-400/10 border-red-400/30'
    if (percentage < 85) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    if (percentage < 95) return 'text-green-400 bg-green-400/10 border-green-400/30'
    return 'text-pink-400 bg-pink-400/10 border-pink-400/30'
  }

  const getProgressBarColor = (percentage: number) => {
    if (percentage < 75) return 'bg-red-400'
    if (percentage < 85) return 'bg-yellow-400'
    if (percentage < 95) return 'bg-green-400'
    return 'bg-pink-400'
  }

  const getChapterEmoji = (percentage: number) => {
    if (percentage < 75) return '😢'
    if (percentage < 85) return '😟'
    if (percentage < 95) return '😊'
    return '😘'
  }

  const progressColorClass = getProgressColor(progress.overallProgress)
  const progressBarColorClass = getProgressBarColor(progress.overallProgress)
  const shouldAnimate = progress.overallProgress > 95

  return (
    <motion.div
      className={`glass-effect rounded-xl border ${progressColorClass.split(' ')[2]} transition-all duration-300`}
      layout
    >
      {/* Chapter Header */}
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              className="text-2xl"
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
              {getChapterEmoji(progress.overallProgress)}
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {chapter.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{chapter.lectureCount} lectures</span>
                <span>•</span>
                <span>Revision: {chapter.revisionScore}/10</span>
                {progress.needsImprovement && (
                  <>
                    <span>•</span>
                    <span className="text-red-400">Needs Improvement</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Progress Circle */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  className="text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 35}`}
                  strokeDashoffset={`${2 * Math.PI * 35 * (1 - progress.overallProgress / 100)}`}
                  className={progressColorClass.split(' ')[0]}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 0.5s ease-in-out'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-sm font-bold ${progressColorClass.split(' ')[0]}`}>
                  {Math.round(progress.overallProgress)}%
                </span>
              </div>
            </div>

            {/* Expand/Collapse Icon */}
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${progressBarColorClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress.overallProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4 text-center">
          <div>
            <div className={`text-sm font-medium ${progressColorClass.split(' ')[0]}`}>
              {Math.round(progress.lectureProgress)}%
            </div>
            <div className="text-xs text-gray-400">Lectures</div>
          </div>
          <div>
            <div className={`text-sm font-medium ${progressColorClass.split(' ')[0]}`}>
              {Math.round(progress.dppProgress)}%
            </div>
            <div className="text-xs text-gray-400">DPP</div>
          </div>
          <div>
            <div className={`text-sm font-medium ${progressColorClass.split(' ')[0]}`}>
              {Math.round(progress.assignmentProgress)}%
            </div>
            <div className="text-xs text-gray-400">Assignments</div>
          </div>
          <div>
            <div className={`text-sm font-medium ${progressColorClass.split(' ')[0]}`}>
              {Math.round(progress.kattarProgress)}%
            </div>
            <div className="text-xs text-gray-400">Kattar</div>
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-gray-700">
              <div className="pt-6 space-y-6">
                {/* Lecture Tracking */}
                <LectureTracking
                  chapterId={chapter.id}
                  lectureCount={chapter.lectureCount}
                  lecturesCompleted={Array.isArray(chapter.lecturesCompleted) ? chapter.lecturesCompleted as boolean[] : []}
                  onUpdate={onUpdate}
                />

                {/* DPP Tracking */}
                <DppTracking
                  chapterId={chapter.id}
                  dppCount={chapter.lectureCount} // DPP count equals lecture count
                  dppCompleted={Array.isArray(chapter.dppCompleted) ? chapter.dppCompleted as boolean[] : []}
                  dppQuestionCounts={Array.isArray(chapter.dppQuestionCounts) ? chapter.dppQuestionCounts as number[] : []}
                  onUpdate={onUpdate}
                />

                {/* Questions Tracking */}
                <QuestionsTracking
                  chapterId={chapter.id}
                  assignmentQuestions={chapter.assignmentQuestions}
                  assignmentCompleted={Array.isArray(chapter.assignmentCompleted) ? chapter.assignmentCompleted as boolean[] : []}
                  kattarQuestions={chapter.kattarQuestions}
                  kattarCompleted={Array.isArray(chapter.kattarCompleted) ? chapter.kattarCompleted as boolean[] : []}
                  onUpdate={onUpdate}
                />

                {/* Revision Scoring */}
                <RevisionScoring
                  chapterId={chapter.id}
                  revisionScore={chapter.revisionScore}
                  onUpdate={onUpdate}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}