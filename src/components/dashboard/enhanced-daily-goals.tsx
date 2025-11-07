'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useRealTimeSync } from '@/hooks/use-real-time-sync'

export default function EnhancedDailyGoals() {
  const [goals, setGoals] = useState({
    physicsQuestions: 0,
    chemistryQuestions: 0,
    botanyQuestions: 0,
    zoologyQuestions: 0
  })
  
  const [hasUpdatedToday, setHasUpdatedToday] = useState(false)
  const realTimeSync = useRealTimeSync()

  // Background analysis without popup
  const runBackgroundAnalysis = async (sessionData: any) => {
    try {
      await fetch('/api/mistake-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: 'daily_study',
          sessionData,
          mistakeData: {
            mistakeCategories: [],
            specificMistakes: [],
            improvementAreas: [],
            timeWasted: 0,
            stressLevel: 5,
            energyLevel: 7,
            focusLevel: 6,
            subjectSpecificMistakes: {},
            mistakeContext: {
              timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon',
              questionDifficulty: 'medium',
              topicArea: 'General'
            }
          }
        })
      })
    } catch (error) {
      console.error('Background analysis failed:', error)
    }
  }

  const handleSaveGoals = async () => {
    try {
      // Save daily goals
      const response = await fetch('/api/daily-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          ...goals
        })
      })

      if (!response.ok) throw new Error('Failed to save goals')

      // Run background analysis without popup
      const totalQuestions = Object.values(goals).reduce((sum, val) => sum + val, 0)
      
      if (totalQuestions > 50 && !hasUpdatedToday) {
        // Run silent analysis in background
        await runBackgroundAnalysis({
          ...goals,
          currentSubject: 'Mixed'
        })
        setHasUpdatedToday(true)
      }

    } catch (error) {
      console.error('Error saving goals:', error)
    }
  }



  return (
    <div className="space-y-6">
      <Card className="glass-effect border-pink-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">🎯</span>
            Daily Goals for Misti
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
              />
            </div>
          </div>

          <button
            onClick={handleSaveGoals}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            Save Today's Progress 🚀
          </button>
        </CardContent>
      </Card>


    </div>
  )
}