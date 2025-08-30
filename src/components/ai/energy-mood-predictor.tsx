'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function EnergyMoodPredictor() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState('')

  const { data: predictions, isLoading } = useQuery({
    queryKey: ['energy-mood-predictions'],
    queryFn: async () => {
      const response = await fetch('/api/cycle-optimization/predictions')
      if (!response.ok) throw new Error('Failed to fetch predictions')
      return response.json()
    }
  })

  const updateActualMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/cycle-optimization/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to update actual values')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-mood-predictions'] })
    }
  })

  const getEnergyColor = (level: number) => {
    if (level >= 8) return 'text-green-400'
    if (level >= 6) return 'text-yellow-400'
    if (level >= 4) return 'text-orange-400'
    return 'text-red-400'
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'text-red-400'
      case 'follicular': return 'text-green-400'
      case 'ovulation': return 'text-yellow-400'
      case 'luteal': return 'text-purple-400'
      default: return 'text-gray-400'
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

  if (isLoading) {
    return (
      <Card className="glass-effect border-purple-400/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const predictionsData = predictions?.data || []

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">🔮</span>
            7-Day Energy & Mood Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictionsData.map((prediction: any, index: number) => {
              const date = new Date(prediction.date)
              const isToday = date.toDateString() === new Date().toDateString()
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${isToday ? 'border-pink-400/50 bg-pink-400/5' : 'border-gray-700 bg-background-secondary/30'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getPhaseEmoji(prediction.cyclePhase)}</span>
                      <div>
                        <div className="font-semibold text-white">
                          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          {isToday && <span className="ml-2 text-pink-400 text-sm">(Today)</span>}
                        </div>
                        <div className={`text-sm ${getPhaseColor(prediction.cyclePhase)}`}>
                          {prediction.cyclePhase.charAt(0).toUpperCase() + prediction.cyclePhase.slice(1)} Phase - Day {prediction.cycleDay}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.round(prediction.confidence * 100)}% confidence
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getEnergyColor(prediction.predictedEnergy)}`}>
                        {prediction.predictedEnergy}/10
                      </div>
                      <div className="text-xs text-gray-400">Energy</div>
                      {prediction.actualEnergy && (
                        <div className="text-xs text-gray-500 mt-1">
                          Actual: {prediction.actualEnergy}/10
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getEnergyColor(prediction.predictedMood)}`}>
                        {prediction.predictedMood}/10
                      </div>
                      <div className="text-xs text-gray-400">Mood</div>
                      {prediction.actualMood && (
                        <div className="text-xs text-gray-500 mt-1">
                          Actual: {prediction.actualMood}/10
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getEnergyColor(prediction.predictedFocus)}`}>
                        {prediction.predictedFocus}/10
                      </div>
                      <div className="text-xs text-gray-400">Focus</div>
                      {prediction.actualFocus && (
                        <div className="text-xs text-gray-500 mt-1">
                          Actual: {prediction.actualFocus}/10
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Study Recommendations */}
                  <div className="mt-3 p-3 bg-background-secondary/50 rounded-lg">
                    <div className="text-sm text-gray-300">
                      <strong>Study Recommendation:</strong> {getStudyRecommendation(prediction.predictedEnergy, prediction.cyclePhase)}
                    </div>
                  </div>

                  {/* Actual Values Input for Today */}
                  {isToday && !prediction.actualEnergy && (
                    <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
                      <div className="text-sm text-blue-300 mb-2">How are you feeling today? (Help improve predictions)</div>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          onChange={(e) => {
                            const energy = parseInt(e.target.value)
                            if (energy) {
                              updateActualMutation.mutate({
                                date: prediction.date,
                                actualEnergy: energy,
                                actualMood: 5, // Default values
                                actualFocus: 5
                              })
                            }
                          }}
                          className="px-2 py-1 bg-background-secondary border border-gray-600 rounded text-white text-xs"
                        >
                          <option value="">Energy</option>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>{n}/10</option>
                          ))}
                        </select>
                        <select
                          onChange={(e) => {
                            const mood = parseInt(e.target.value)
                            if (mood) {
                              updateActualMutation.mutate({
                                date: prediction.date,
                                actualEnergy: 5, // Default values
                                actualMood: mood,
                                actualFocus: 5
                              })
                            }
                          }}
                          className="px-2 py-1 bg-background-secondary border border-gray-600 rounded text-white text-xs"
                        >
                          <option value="">Mood</option>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>{n}/10</option>
                          ))}
                        </select>
                        <select
                          onChange={(e) => {
                            const focus = parseInt(e.target.value)
                            if (focus) {
                              updateActualMutation.mutate({
                                date: prediction.date,
                                actualEnergy: 5, // Default values
                                actualMood: 5,
                                actualFocus: focus
                              })
                            }
                          }}
                          className="px-2 py-1 bg-background-secondary border border-gray-600 rounded text-white text-xs"
                        >
                          <option value="">Focus</option>
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n}>{n}/10</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Prediction Accuracy */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">📊 Prediction Accuracy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {calculateAccuracy(predictionsData)}%
            </div>
            <div className="text-gray-400 text-sm">
              AI prediction accuracy based on your feedback
            </div>
            <div className="text-xs text-gray-500 mt-2">
              The more you track, the better predictions become!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getStudyRecommendation(energy: number, phase: string): string {
  if (energy >= 9) return 'Perfect for intensive study sessions and mock tests'
  if (energy >= 7) return 'Good for learning new concepts and problem solving'
  if (energy >= 5) return 'Suitable for revision and practice questions'
  if (energy >= 3) return 'Light study recommended - focus on easy topics'
  return 'Rest day recommended - light revision only'
}

function calculateAccuracy(predictions: any[]): number {
  const withActuals = predictions.filter(p => p.actualEnergy && p.actualMood && p.actualFocus)
  if (withActuals.length === 0) return 0

  let totalAccuracy = 0
  withActuals.forEach(p => {
    const energyAccuracy = 100 - Math.abs(p.predictedEnergy - p.actualEnergy) * 10
    const moodAccuracy = 100 - Math.abs(p.predictedMood - p.actualMood) * 10
    const focusAccuracy = 100 - Math.abs(p.predictedFocus - p.actualFocus) * 10
    totalAccuracy += (energyAccuracy + moodAccuracy + focusAccuracy) / 3
  })

  return Math.round(totalAccuracy / withActuals.length)
}