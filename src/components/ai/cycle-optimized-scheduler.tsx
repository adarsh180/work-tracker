'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function CycleOptimizedScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const { data: schedule, isLoading } = useQuery({
    queryKey: ['cycle-schedule', selectedDate],
    queryFn: async () => {
      const response = await fetch(`/api/cycle-optimization/schedule?date=${selectedDate}`)
      if (!response.ok) throw new Error('Failed to fetch schedule')
      return response.json()
    }
  })

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'text-red-400 bg-red-400/10 border-red-400/30'
      case 'follicular': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'ovulation': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'luteal': return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const getPhaseEmoji = (phase: string) => {
    switch (phase) {
      case 'menstrual': return '🔴'
      case 'follicular': return '🌱'
      case 'ovulation': return '⭐'
      case 'luteal': return '🌙'
      default: return '📅'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'light': return 'text-blue-400 bg-blue-400/10'
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10'
      case 'intense': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-effect border-pink-400/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const scheduleData = schedule?.data

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">🗓️</span>
            AI-Powered Cycle Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
          />
        </CardContent>
      </Card>

      {scheduleData && (
        <>
          {/* Cycle Status */}
          <Card className={`glass-effect border ${getPhaseColor(scheduleData.cyclePhase).split(' ')[2]}`}>
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>🌸 Today's Cycle Status</span>
                <span className="text-2xl">{getPhaseEmoji(scheduleData.cyclePhase)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-background-secondary/30 rounded-lg">
                  <div className={`text-lg font-bold ${getPhaseColor(scheduleData.cyclePhase).split(' ')[0]}`}>
                    {scheduleData.cyclePhase.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">Current Phase</div>
                </div>
                <div className="text-center p-3 bg-background-secondary/30 rounded-lg">
                  <div className="text-lg font-bold text-white">
                    {scheduleData.energyLevel}/10
                  </div>
                  <div className="text-xs text-gray-400">Energy Level</div>
                </div>
                <div className="text-center p-3 bg-background-secondary/30 rounded-lg">
                  <div className={`text-lg font-bold ${getDifficultyColor(scheduleData.difficultyFocus).split(' ')[0]}`}>
                    {scheduleData.difficultyFocus.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">Study Focus</div>
                </div>
                <div className="text-center p-3 bg-background-secondary/30 rounded-lg">
                  <div className="text-lg font-bold text-primary">
                    {scheduleData.totalStudyHours}h
                  </div>
                  <div className="text-xs text-gray-400">Total Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Blocks */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">📚 Optimized Study Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduleData.studyBlocks.map((block: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${getDifficultyColor(block.difficulty)} border-opacity-30`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">
                          {block.subject} - {block.type.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-300">{block.topic}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {block.startTime} - {block.endTime} ({Math.round(block.duration)} min)
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(block.difficulty)}`}>
                        {block.difficulty}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mock Test Slot */}
          {scheduleData.mockTestSlot && (
            <Card className="glass-effect border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <span className="mr-2">🎯</span>
                  Peak Performance Mock Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <div className="text-yellow-400 font-semibold">
                    Optimal Mock Test Time: {new Date(scheduleData.mockTestSlot).toLocaleTimeString()}
                  </div>
                  <div className="text-gray-300 text-sm mt-2">
                    Your cycle phase indicates peak cognitive performance. Perfect time for a full NEET mock test!
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Phase-Specific Tips */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">💡 Phase-Specific Study Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getPhaseRecommendations(scheduleData.cyclePhase).map((tip: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-pink-400 text-sm mt-1">•</span>
                    <span className="text-gray-300 text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function getPhaseRecommendations(phase: string): string[] {
  const recommendations = {
    menstrual: [
      'Focus on light revision and previous year questions',
      'Take frequent breaks every 45 minutes',
      'Avoid starting new difficult topics',
      'Stay hydrated and maintain comfortable temperature',
      'Use this time for organizing notes and flashcards'
    ],
    follicular: [
      'Perfect time for learning new Physics and Chemistry concepts',
      'Tackle the most challenging topics in your syllabus',
      'Extended study sessions (4-6 hours) are optimal',
      'High-intensity problem solving and numerical practice',
      'Memorize complex formulas and reaction mechanisms'
    ],
    ovulation: [
      'PEAK PERFORMANCE TIME - attempt toughest questions',
      'Take full-length NEET mock tests',
      'Marathon study sessions are possible (8-10 hours)',
      'Focus on speed and accuracy in problem solving',
      'Perfect time for competitive practice and group studies'
    ],
    luteal: [
      'Focus on consolidation and revision of learned concepts',
      'Practice previous year questions and mock tests',
      'Moderate study sessions (3-4 hours) work best',
      'Avoid starting completely new topics',
      'Use creative study methods like mind maps and diagrams'
    ]
  }

  return recommendations[phase as keyof typeof recommendations] || []
}