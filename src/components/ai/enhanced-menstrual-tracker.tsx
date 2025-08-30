'use client'

import { useState, useMemo, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { MenstrualCyclePredictor } from '@/lib/menstrual-cycle-predictor'

export default function EnhancedMenstrualTracker() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'tracker' | 'calendar' | 'insights'>('tracker')
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [periodEndDate, setPeriodEndDate] = useState('')
  const [hasTrackedPeriod, setHasTrackedPeriod] = useState(false)
  const [aiInsights, setAiInsights] = useState<string>('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [cycleLength, setCycleLength] = useState(28)
  const [periodLength, setPeriodLength] = useState(5)

  // Fetch existing cycles
  const { data: cycles } = useQuery({
    queryKey: ['menstrual-cycles'],
    queryFn: async () => {
      const response = await fetch('/api/menstrual-cycle')
      if (!response.ok) throw new Error('Failed to fetch cycles')
      const result = await response.json()
      return result.data
    }
  })

  // Save cycle mutation
  const saveCycle = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/menstrual-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to save cycle')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menstrual-cycles'] })
    }
  })

  // Initialize data from database
  useEffect(() => {
    if (!isInitialized && cycles && cycles.length > 0) {
      const latestCycle = cycles[0]
      setLastPeriodDate(latestCycle.cycleStartDate.split('T')[0])
      setCycleLength(latestCycle.cycleLength)
      setPeriodLength(latestCycle.periodLength)
      setHasTrackedPeriod(true)
      setIsInitialized(true)
    }
  }, [cycles, isInitialized])

  // Calculate predictions only if period is tracked
  const cyclePrediction = useMemo(() => {
    if (!hasTrackedPeriod || !lastPeriodDate) {
      return {
        currentPhase: 'unknown' as any,
        currentDay: 0,
        nextPeriodDate: new Date(),
        ovulationDate: new Date(),
        fertilityWindow: { start: new Date(), end: new Date() },
        cycleHealth: 'unknown' as any,
        pregnancyChance: 'unknown' as any,
        studyImpact: {
          energyLevel: 0,
          focusLevel: 0,
          memoryRetention: 0,
          recommendations: ['Please track your menstrual cycle to get personalized insights']
        }
      }
    }
    return MenstrualCyclePredictor.predictCurrentCycle(
      new Date(lastPeriodDate),
      cycleLength,
      periodLength
    )
  }, [lastPeriodDate, cycleLength, periodLength, hasTrackedPeriod])

  const cycleCalendar = useMemo(() => {
    return MenstrualCyclePredictor.generateCycleCalendar(
      new Date(lastPeriodDate),
      cycleLength,
      periodLength,
      3
    )
  }, [lastPeriodDate, cycleLength, periodLength])

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

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'irregular': return 'text-yellow-400'
      case 'concerning': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getPregnancyColor = (chance: string) => {
    switch (chance) {
      case 'very-high': return 'text-red-500'
      case 'high': return 'text-orange-400'
      case 'moderate': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      case 'very-low': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-background-secondary/50 p-1 rounded-lg">
        {[
          { key: 'tracker', label: '📊 Tracker' },
          { key: 'calendar', label: '📅 Calendar' },
          { key: 'insights', label: '🔬 Insights' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.key
                ? 'bg-pink-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tracker Tab */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {/* Current Status */}
          <Card className="glass-effect border-pink-400/30">
            <CardHeader>
              <CardTitle className="text-white">🌸 Current Cycle Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
                  <div className="text-3xl mb-2">{getPhaseEmoji(cyclePrediction.currentPhase)}</div>
                  <div className={`font-semibold ${getPhaseColor(cyclePrediction.currentPhase)}`}>
                    {cyclePrediction.currentPhase.charAt(0).toUpperCase() + cyclePrediction.currentPhase.slice(1)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Day {cyclePrediction.currentDay}</div>
                </div>
                
                <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-semibold text-white">
                    {cyclePrediction.studyImpact.energyLevel}/10
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Energy Level</div>
                </div>
                
                <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
                  <div className="text-3xl mb-2">🧠</div>
                  <div className="font-semibold text-white">
                    {cyclePrediction.studyImpact.focusLevel}/10
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Focus Level</div>
                </div>
                
                <div className="text-center p-4 bg-background-secondary/30 rounded-lg">
                  <div className="text-3xl mb-2">💭</div>
                  <div className="font-semibold text-white">
                    {cyclePrediction.studyImpact.memoryRetention}/10
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Memory</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period Tracking */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">📅 Period Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasTrackedPeriod ? (
                <div className="text-center p-6 bg-pink-500/10 rounded-lg border border-pink-400/20">
                  <div className="text-4xl mb-4">🌸</div>
                  <h3 className="text-white font-semibold mb-2">Track Your Menstrual Cycle</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Get personalized NEET study insights based on your cycle
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Last Period Start Date</label>
                      <input
                        type="date"
                        value={lastPeriodDate}
                        onChange={(e) => setLastPeriodDate(e.target.value)}
                        className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Period End Date</label>
                      <input
                        type="date"
                        value={periodEndDate}
                        onChange={(e) => setPeriodEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (lastPeriodDate && periodEndDate) {
                        const startDate = new Date(lastPeriodDate)
                        const endDate = new Date(periodEndDate)
                        const calculatedPeriodLength = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
                        
                        // Save to database
                        saveCycle.mutate({
                          cycleStartDate: lastPeriodDate,
                          periodEndDate: periodEndDate,
                          cycleLength: cycleLength,
                          periodLength: calculatedPeriodLength,
                          energyLevel: 5,
                          symptoms: [],
                          notes: 'Initial cycle tracking'
                        })
                        
                        setPeriodLength(calculatedPeriodLength)
                        setHasTrackedPeriod(true)
                      }
                    }}
                    disabled={!lastPeriodDate || !periodEndDate || saveCycle.isPending}
                    className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {saveCycle.isPending ? 'Saving...' : 'Start Tracking'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Last Period Start</label>
                      <input
                        type="date"
                        value={lastPeriodDate}
                        onChange={(e) => setLastPeriodDate(e.target.value)}
                        className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Cycle Length</label>
                      <input
                        type="number"
                        min="21"
                        max="35"
                        value={cycleLength}
                        onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)}
                        className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Period Length</label>
                      <input
                        type="number"
                        min="3"
                        max="8"
                        value={periodLength}
                        onChange={(e) => setPeriodLength(parseInt(e.target.value) || 5)}
                        className="w-full px-3 py-2 bg-background-secondary border border-gray-600 rounded text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        // Save updated cycle data
                        saveCycle.mutate({
                          cycleStartDate: lastPeriodDate,
                          cycleLength: cycleLength,
                          periodLength: periodLength,
                          energyLevel: 5,
                          symptoms: [],
                          notes: 'Updated cycle data'
                        })
                      }}
                      disabled={saveCycle.isPending}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                    >
                      {saveCycle.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        // Add new period entry instead of resetting
                        const today = new Date().toISOString().split('T')[0]
                        setLastPeriodDate(today)
                        setPeriodEndDate('')
                        // Keep tracking enabled to add new cycle
                      }}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded text-sm"
                    >
                      Add New Period
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <Card className="glass-effect border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📅 3-Month Cycle Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="font-semibold text-gray-400 p-2">{day}</div>
              ))}
              {cycleCalendar.slice(0, 42).map((day, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border ${
                    day.phase === 'menstrual' ? 'bg-red-500/20 border-red-400' :
                    day.phase === 'follicular' ? 'bg-green-500/20 border-green-400' :
                    day.phase === 'ovulation' ? 'bg-yellow-500/20 border-yellow-400' :
                    'bg-purple-500/20 border-purple-400'
                  }`}
                >
                  <div className="text-white font-medium">{day.date.getDate()}</div>
                  <div className="text-xs">{getPhaseEmoji(day.phase)}</div>
                  <div className="text-xs text-gray-300">E:{day.energyLevel}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Cycle Health */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">🏥 Cycle Health Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Cycle Health:</span>
                    <span className={`font-semibold ${getHealthColor(cyclePrediction.cycleHealth)}`}>
                      {cyclePrediction.cycleHealth.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Next Period:</span>
                    <span className="text-white font-medium">
                      {cyclePrediction.nextPeriodDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Ovulation Date:</span>
                    <span className="text-yellow-400 font-medium">
                      {cyclePrediction.ovulationDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Pregnancy Chance:</span>
                    <span className={`font-semibold ${getPregnancyColor(cyclePrediction.pregnancyChance)}`}>
                      {cyclePrediction.pregnancyChance.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Fertility Window:</span>
                    <span className="text-orange-400 font-medium text-sm">
                      {cyclePrediction.fertilityWindow.start.toLocaleDateString()} - {cyclePrediction.fertilityWindow.end.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Impact */}
          <Card className="glass-effect border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>📚 NEET Prep Impact Analysis</span>
                {hasTrackedPeriod && (
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/menstrual-insights', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            currentPhase: cyclePrediction.currentPhase,
                            cycleDay: cyclePrediction.currentDay,
                            energyLevel: cyclePrediction.studyImpact.energyLevel,
                            focusLevel: cyclePrediction.studyImpact.focusLevel,
                            memoryRetention: cyclePrediction.studyImpact.memoryRetention,
                            cycleHealth: cyclePrediction.cycleHealth,
                            pregnancyChance: cyclePrediction.pregnancyChance,
                            studyHours: 6,
                            testScores: [650, 680, 620],
                            dailyQuestions: 300
                          })
                        })
                        const result = await response.json()
                        setAiInsights(result.data)
                      } catch (error) {
                        console.error('Failed to get AI insights:', error)
                      }
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                  >
                    🤖 Get AI Insights
                  </button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hasTrackedPeriod ? (
                  <>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-background-secondary/30 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">
                          {cyclePrediction.studyImpact.energyLevel}/10
                        </div>
                        <div className="text-sm text-gray-300">Energy Impact</div>
                      </div>
                      <div className="p-3 bg-background-secondary/30 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">
                          {cyclePrediction.studyImpact.focusLevel}/10
                        </div>
                        <div className="text-sm text-gray-300">Focus Impact</div>
                      </div>
                      <div className="p-3 bg-background-secondary/30 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">
                          {cyclePrediction.studyImpact.memoryRetention}/10
                        </div>
                        <div className="text-sm text-gray-300">Memory Impact</div>
                      </div>
                    </div>
                    
                    {aiInsights && (
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-400/20">
                        <h4 className="text-purple-300 font-medium mb-3">🤖 AI-Powered Insights</h4>
                        <div className="text-gray-300 text-sm whitespace-pre-line">{aiInsights}</div>
                      </div>
                    )}
                    
                    <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20">
                      <h4 className="text-pink-300 font-medium mb-3">📋 Personalized Study Recommendations</h4>
                      <div className="space-y-2">
                        {cyclePrediction.studyImpact.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-pink-400 text-sm">•</span>
                            <span className="text-gray-300 text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8 text-gray-400">
                    <div className="text-4xl mb-4">📊</div>
                    <p>Track your menstrual cycle to see personalized NEET preparation insights</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}