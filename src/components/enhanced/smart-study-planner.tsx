'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

type StudyBlock = {
  id: string
  subject: string
  chapter?: string
  startTime: string
  endTime: string
  duration: number
  type: 'study' | 'break' | 'revision' | 'test'
  priority: 'high' | 'medium' | 'low'
  completed: boolean
}

type SmartPlan = {
  id: string
  date: string
  totalStudyHours: number
  energyLevel: number
  focusLevel: number
  schedule: StudyBlock[]
  completed: boolean
  aiGenerated: boolean
}

export default function SmartStudyPlanner() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [energyLevel, setEnergyLevel] = useState(7)
  const [availableHours, setAvailableHours] = useState(8)
  const [weakAreas, setWeakAreas] = useState<string[]>(['Physics'])

  const { data: currentPlan, isLoading } = useQuery<SmartPlan>({
    queryKey: ['smart-study-plan', selectedDate, energyLevel, availableHours, weakAreas],
    queryFn: async () => {
      const response = await fetch('/api/smart-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          energyLevel,
          availableHours,
          weakAreas,
          menstrualPhase: 'normal'
        })
      })
      if (!response.ok) throw new Error('Failed to fetch plan')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 30000,
    enabled: !!selectedDate
  })

  const updateBlock = useMutation({
    mutationFn: async ({ blockId, completed }: { blockId: string; completed: boolean }) => {
      if (!currentPlan?.id) {
        console.error('No plan ID available for update')
        throw new Error('No plan ID')
      }
      
      console.log('Updating block:', { planId: currentPlan.id, blockId, completed })
      
      const response = await fetch('/api/smart-study-plan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: currentPlan.id,
          blockId,
          completed
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update failed:', errorText)
        throw new Error(`Failed to update block: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Update successful:', result)
      return result
    },
    onSuccess: () => {
      console.log('Invalidating queries after successful update')
      queryClient.invalidateQueries({ queryKey: ['smart-study-plan', selectedDate, energyLevel, availableHours, weakAreas] })
    },
    onError: (error) => {
      console.error('Update block mutation error:', error)
    }
  })

  const getBlockColor = (block: StudyBlock) => {
    if (block.completed) return 'bg-green-500/20 border-green-400'
    switch (block.type) {
      case 'study': return block.priority === 'high' ? 'bg-red-500/20 border-red-400' : 'bg-blue-500/20 border-blue-400'
      case 'break': return 'bg-gray-500/20 border-gray-400'
      case 'revision': return 'bg-yellow-500/20 border-yellow-400'
      case 'test': return 'bg-purple-500/20 border-purple-400'
      default: return 'bg-gray-500/20 border-gray-400'
    }
  }

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'study': return '📚'
      case 'break': return '☕'
      case 'revision': return '🔄'
      case 'test': return '📝'
      default: return '📖'
    }
  }

  const completedBlocks = currentPlan?.schedule.filter(b => b.completed).length || 0
  const totalBlocks = currentPlan?.schedule.length || 0
  const progressPercentage = totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 0

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>🧠</span>
            <span>AI Study Planner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Energy Level: {energyLevel}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Available Hours</label>
              <input
                type="number"
                min="1"
                max="16"
                value={availableHours}
                onChange={(e) => setAvailableHours(parseInt(e.target.value) || 8)}
                className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Weak Areas</label>
              <select
                multiple
                value={weakAreas}
                onChange={(e) => setWeakAreas(Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentPlan && (
        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>📊 Today's Progress</span>
              <span className="text-sm text-gray-400">
                {completedBlocks}/{totalBlocks} blocks completed
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {/* Praise Message */}
              {(() => {
                const completedHours = currentPlan.schedule
                  .filter(block => block.completed && block.type === 'study')
                  .reduce((sum, block) => sum + (block.duration / 60), 0)
                const targetHours = 14
                const completionRate = (completedHours / targetHours) * 100
                
                let praiseMessage = ''
                let praiseColor = ''
                
                if (completionRate >= 85) {
                  praiseMessage = `🎉 AMAZING! ${completedHours.toFixed(1)}h/${targetHours}h completed! You're absolutely crushing it, Dr. Misti! 👩⚕️✨`
                  praiseColor = 'text-green-400'
                } else if (completionRate >= 70) {
                  praiseMessage = `🔥 EXCELLENT! ${completedHours.toFixed(1)}h/${targetHours}h completed! You're doing incredibly well! 💪`
                  praiseColor = 'text-blue-400'
                } else if (completionRate >= 50) {
                  praiseMessage = `💪 GREAT WORK! ${completedHours.toFixed(1)}h/${targetHours}h completed! Keep this momentum going! 🌟`
                  praiseColor = 'text-yellow-400'
                } else if (completedHours > 0) {
                  praiseMessage = `🚀 GOOD START! ${completedHours.toFixed(1)}h/${targetHours}h completed! Every hour counts towards your dream! 📚`
                  praiseColor = 'text-purple-400'
                }
                
                return praiseMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20 mb-4"
                  >
                    <div className={`font-medium ${praiseColor}`}>{praiseMessage}</div>
                  </motion.div>
                )
              })()}
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">14h</div>
                  <div className="text-sm text-gray-400">Target</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {currentPlan.schedule
                      .filter(block => block.completed && block.type === 'study')
                      .reduce((sum, block) => sum + (block.duration / 60), 0)
                      .toFixed(1)}h
                  </div>
                  <div className="text-sm text-gray-400">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm text-gray-400">Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{currentPlan.energyLevel}/10</div>
                  <div className="text-sm text-gray-400">Energy</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card className="glass-effect border-gray-700">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : currentPlan ? (
        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>⏰</span>
              <span>AI-Generated Schedule</span>
              {currentPlan.aiGenerated && (
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">AI</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentPlan.schedule.map((block, index) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all ${getBlockColor(block)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getTypeEmoji(block.type)}</span>
                      <div>
                        <div className="font-semibold text-white">
                          {block.subject} {block.chapter && `- ${block.chapter}`}
                        </div>
                        <div className="text-sm text-gray-400">
                          {block.startTime} - {block.endTime} ({block.duration} min)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        block.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                        block.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {block.priority}
                      </span>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation()
                          if (currentPlan?.id && !updateBlock.isPending) {
                            updateBlock.mutate({ 
                              blockId: block.id, 
                              completed: !block.completed 
                            })
                          }
                        }}
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
                          block.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-400 hover:border-green-400 hover:bg-green-500/10'
                        } ${updateBlock.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {block.completed && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-effect border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <p className="text-gray-400">Configure your preferences above to generate an AI study plan</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}