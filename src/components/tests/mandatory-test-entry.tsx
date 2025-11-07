'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import EnhancedMistakePopup from '@/components/ai/enhanced-mistake-popup'
import { useRealTimeSync } from '@/hooks/use-real-time-sync'
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function MandatoryTestEntry() {
  const [testData, setTestData] = useState({
    testType: '',
    testNumber: '',
    score: 0,
    testDate: new Date().toISOString().split('T')[0]
  })
  
  const [pendingSave, setPendingSave] = useState(false)
  const [analysisCompleted, setAnalysisCompleted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const realTimeSync = useRealTimeSync()

  const handleSaveAttempt = () => {
    if (!testData.testType || !testData.testNumber || testData.score === 0) {
      alert('Please fill all test details before saving!')
      return
    }

    if (testData.score > 720) {
      alert('Score cannot be more than 720!')
      return
    }

    // Set pending save state and show popup
    setPendingSave(true)
    setShowPopup(true)
  }

  const handleMistakeSubmit = async (mistakeData: any) => {
    try {
      // First save the test performance
      const testResponse = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '1', // Misti's ID
          testType: testData.testType,
          testNumber: testData.testNumber,
          score: testData.score,
          testDate: new Date(testData.testDate)
        })
      })

      if (!testResponse.ok) throw new Error('Failed to save test')

      // Then submit mistake analysis
      const analysisResponse = await fetch('/api/mistakes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType: 'test',
          sessionData: {
            testScore: testData.score,
            testType: `${testData.testType} - ${testData.testNumber}`
          },
          mistakeData
        })
      })

      if (!analysisResponse.ok) throw new Error('Failed to analyze mistakes')

      // Success - update UI
      setAnalysisCompleted(true)
      setPendingSave(false)
      setShowPopup(false)
      
      // Reset form
      setTestData({
        testType: '',
        testNumber: '',
        score: 0,
        testDate: new Date().toISOString().split('T')[0]
      })
      
      // Real-time sync will handle cache invalidation
      
      // Show success message
      alert('✅ Test score saved successfully with AI analysis!')
      
    } catch (error) {
      console.error('Error saving test:', error)
      alert('❌ Error saving test score. Please try again.')
      setPendingSave(false)
    }
  }

  const closePopup = () => {
    // Cannot close popup without completing analysis
    alert('⚠️ You must complete the mistake analysis to save your test score!')
  }

  const getScoreColor = (score: number) => {
    if (score >= 650) return 'text-green-400'
    if (score >= 600) return 'text-yellow-400'
    if (score >= 550) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 690) return '🎉 Excellent! Target achieved!'
    if (score >= 650) return '🔥 Great score! Close to target!'
    if (score >= 600) return '👍 Good progress! Keep pushing!'
    if (score >= 550) return '📈 Improving! Focus on weak areas!'
    return '💪 Keep working hard! You can do it!'
  }

  return (
    <div className="space-y-6">
      <Card className="glass-effect border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <span className="mr-2">📊</span>
              Test Performance Entry
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Test Type</label>
              <select
                value={testData.testType}
                onChange={(e) => setTestData(prev => ({ ...prev, testType: e.target.value }))}
                className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                disabled={pendingSave}
              >
                <option value="">Select Test Type</option>
                <option value="Physics Wallah Mock">Physics Wallah Mock</option>
                <option value="Weekly Test">Weekly Test</option>
                <option value="Monthly Test">Monthly Test</option>
                <option value="Full Syllabus Test">Full Syllabus Test</option>
                <option value="Subject Test">Subject Test</option>
                <option value="Practice Test">Practice Test</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Test Number</label>
              <input
                type="text"
                value={testData.testNumber}
                onChange={(e) => setTestData(prev => ({ ...prev, testNumber: e.target.value }))}
                placeholder="e.g., Test-01, Mock-15"
                className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                disabled={pendingSave}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Score (out of 720)</label>
              <input
                type="number"
                value={testData.score}
                onChange={(e) => setTestData(prev => ({ ...prev, score: Number(e.target.value) }))}
                className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                min="0"
                max="720"
                disabled={pendingSave}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">Test Date</label>
              <input
                type="date"
                value={testData.testDate}
                onChange={(e) => setTestData(prev => ({ ...prev, testDate: e.target.value }))}
                className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                disabled={pendingSave}
              />
            </div>
          </div>

          {/* Score Analysis */}
          {testData.score > 0 && (
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className={`text-2xl font-bold ${getScoreColor(testData.score)}`}>
                    {testData.score}/720
                  </div>
                  <div className="text-sm text-gray-300">
                    Percentage: {Math.round((testData.score / 720) * 100)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    Target: 690+
                  </div>
                  <div className="text-sm text-gray-400">
                    Gap: {Math.max(0, 690 - testData.score)} marks
                  </div>
                </div>
              </div>
              <div className="text-center text-white font-medium">
                {getScoreMessage(testData.score)}
              </div>
            </div>
          )}

          {/* Warning for Low Scores */}
          {testData.score > 0 && testData.score < 550 && (
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-400/30">
              <div className="flex items-center text-red-400 mb-2">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span className="font-semibold">Performance Alert</span>
              </div>
              <p className="text-red-300 text-sm">
                This score is significantly below your 690+ target. The mistake analysis will help identify critical areas for improvement.
              </p>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveAttempt}
            disabled={pendingSave || !testData.testType || !testData.testNumber || testData.score === 0}
            className={`w-full py-4 font-semibold rounded-lg transition-all flex items-center justify-center ${
              pendingSave
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                : (!testData.testType || !testData.testNumber || testData.score === 0)
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
            }`}
          >
            {pendingSave ? (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Waiting for Mistake Analysis...
              </>
            ) : (!testData.testType || !testData.testNumber || testData.score === 0) ? (
              'Fill All Details to Save Test Score'
            ) : (
              'Save Test Score & Analyze Mistakes 🚀'
            )}
          </button>

          {pendingSave && (
            <div className="text-center text-yellow-300 text-sm">
              ⚠️ Complete the mistake analysis popup to save your test score!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mandatory Mistake Analysis Popup */}
      <EnhancedMistakePopup
        isOpen={showPopup}
        onClose={closePopup}
        sessionType="test"
        sessionData={{
          testScore: testData.score,
          testType: `${testData.testType} - ${testData.testNumber}`
        }}
        onSubmit={handleMistakeSubmit}
      />
    </div>
  )
}