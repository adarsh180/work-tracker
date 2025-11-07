'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useMistakeAnalysis } from '@/hooks/use-mistake-analysis'
import EnhancedMistakePopup from '@/components/ai/enhanced-mistake-popup'
import { useRealTimeSync } from '@/hooks/use-real-time-sync'
import { Lock, CheckCircle } from 'lucide-react'

export default function MandatoryDailyGoals() {
  const [goals, setGoals] = useState({
    physicsQuestions: 0,
    chemistryQuestions: 0,
    botanyQuestions: 0,
    zoologyQuestions: 0
  })
  
  const [pendingSave, setPendingSave] = useState(false)
  const [analysisCompleted, setAnalysisCompleted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [sessionData, setSessionData] = useState({})
  const realTimeSync = useRealTimeSync()

  const handleSaveAttempt = () => {
    const totalQuestions = Object.values(goals).reduce((sum, val) => sum + val, 0)
    
    if (totalQuestions === 0) {
      alert('Please enter at least some questions before saving!')
      return
    }

    // Set pending save state and show popup
    setPendingSave(true)
    setSessionData(goals)
    setShowPopup(true)
  }

  const handleMistakeSubmit = async (mistakeData: any) => {
    try {
      // First save the daily goals
      const goalsResponse = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          ...goals
        })
      })

      if (!goalsResponse.ok) throw new Error('Failed to save goals')

      // Then submit mistake analysis
      const analysisResponse = await fetch('/api/mistakes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: 'daily_study',
          sessionData: goals,
          mistakeData
        })
      })

      if (!analysisResponse.ok) throw new Error('Failed to analyze mistakes')

      // Success - update UI
      setAnalysisCompleted(true)
      setPendingSave(false)
      setShowPopup(false)
      
      // Real-time sync will handle cache invalidation
      
      // Show success message
      alert('✅ Progress saved successfully with AI analysis!')
      
    } catch (error) {
      console.error('Error saving progress:', error)
      alert('❌ Error saving progress. Please try again.')
      setPendingSave(false)
    }
  }

  const closePopup = () => {
    // Cannot close popup without completing analysis
    alert('⚠️ You must complete the mistake analysis to save your progress!')
  }

  const totalQuestions = Object.values(goals).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-pink-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <span className="mr-2">🎯</span>
              Daily Goals for Misti
            </span>
            {analysisCompleted && (
              <div className="flex items-center text-green-400">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">Analysis Complete</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Physics Questions</label>
              <input
                type="number"
                value={goals.physicsQuestions}
                onChange={(e) => setGoals(prev => ({ ...prev, physicsQuestions: Number(e.target.value) }))}
                className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                min="0"
                disabled={pendingSave}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Chemistry Questions</label>
              <input
                type="number"
                value={goals.chemistryQuestions}
                onChange={(e) => setGoals(prev => ({ ...prev, chemistryQuestions: Number(e.target.value) }))}
                className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                min="0"
                disabled={pendingSave}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Botany Questions</label>
              <input
                type="number"
                value={goals.botanyQuestions}
                onChange={(e) => setGoals(prev => ({ ...prev, botanyQuestions: Number(e.target.value) }))}
                className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                min="0"
                disabled={pendingSave}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Zoology Questions</label>
              <input
                type="number"
                value={goals.zoologyQuestions}
                onChange={(e) => setGoals(prev => ({ ...prev, zoologyQuestions: Number(e.target.value) }))}
                className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                min="0"
                disabled={pendingSave}
              />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">
                  Total: {totalQuestions} Questions
                </div>
                <div className="text-sm text-gray-300">
                  Target: 1000 questions/day
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {totalQuestions > 0 ? Math.round((totalQuestions / 1000) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-400">Progress</div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveAttempt}
            disabled={pendingSave || totalQuestions === 0}
            className={`w-full py-4 font-semibold rounded-lg transition-all flex items-center justify-center ${
              pendingSave
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                : totalQuestions === 0
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
            }`}
          >
            {pendingSave ? (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Waiting for Mistake Analysis...
              </>
            ) : totalQuestions === 0 ? (
              'Enter Questions to Save Progress'
            ) : (
              'Save Progress & Analyze Mistakes 🚀'
            )}
          </button>

          {pendingSave && (
            <div className="text-center text-yellow-300 text-sm">
              ⚠️ Complete the mistake analysis popup to save your progress!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mandatory Mistake Analysis Popup */}
      <EnhancedMistakePopup
        isOpen={showPopup}
        onClose={closePopup}
        sessionType="daily_study"
        sessionData={sessionData}
        onSubmit={handleMistakeSubmit}
      />
    </div>
  )
}