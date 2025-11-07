'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { MistiRankPredictionEngine, type MistiProfile, type RankPredictionResult } from '@/lib/misti-rank-prediction-engine'

export default function MistiRankPrediction() {
  const [prediction, setPrediction] = useState<RankPredictionResult | null>(null)
  const [realTimeInsights, setRealTimeInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const mistiProfile: MistiProfile = {
    category: 'General',
    homeState: 'Bihar',
    coachingInstitute: 'Physics Wallah Online',
    preparationYears: 3,
    attemptNumber: 3,
    class12Percentage: 79,
    board: 'State Board',
    schoolRank: 'Top 5',
    foundationStrength: 'Mid-Great',
    mockScoreRange: { min: 530, max: 640, target: 690 },
    currentStudyHours: { current: 8, upcoming: 14 },
    questionSolvingCapacity: { current: 400, upcoming: 1000 },
    questionSolvingSpeed: { min: 60, max: 120 },
    sleepHours: 5.5,
    sleepQuality: 8,
    menstrualCycle: {
      length: 5.5,
      heavyFlowDays: [2],
      painDays: [2, 3],
      lowEnergyDays: [2, 3]
    },
    stressTriggers: ['family_pressure', 'target_completion', 'time_pressure', 'multiple_attempts'],
    familyPressure: 'High',
    bestPerformingSlots: ['morning', 'evening'],
    problematicSlots: ['afternoon'],
    subjectPreference: ['Biology', 'Chemistry', 'Physics'],
    weaknessType: 'pattern_confusion',
    errorTypes: ['silly_mistakes', 'overthinking', 'panic_response'],
    revisionFrequency: 'below_average',
    dietType: 'vegetarian_with_junk',
    fitnessLevel: 'good'
  }

  const generatePrediction = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/rank-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) throw new Error('Failed to generate prediction')
      
      const result = await response.json()
      setPrediction(result.data.prediction)
      setRealTimeInsights(result.data.realTimeInsights)
    } catch (error) {
      console.error('Error generating prediction:', error)
      alert('Error generating prediction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRankColor = (rank: number) => {
    if (rank <= 1000) return 'text-green-400'
    if (rank <= 15000) return 'text-yellow-400'
    if (rank <= 50000) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreColor = (score: number) => {
    if (score >= 650) return 'text-green-400'
    if (score >= 600) return 'text-yellow-400'
    if (score >= 550) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="glass-effect border-pink-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <span className="mr-2">🎯</span>
              Misti's AI Rank Prediction - 96% Accuracy Model
            </span>
            <button
              onClick={generatePrediction}
              disabled={loading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              {loading ? 'Analyzing...' : 'Generate Prediction'}
            </button>
          </CardTitle>
        </CardHeader>
      </Card>

      {loading && (
        <Card className="glass-effect border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">Analyzing Misti's real-time data...</p>
            <p className="text-gray-400 text-sm mt-2">Processing mistake patterns, test scores, and daily performance</p>
          </CardContent>
        </Card>
      )}

      {prediction && (
        <div className="space-y-6">
          {/* Real-time Data Quality */}
          {realTimeInsights && (
            <Card className="glass-effect border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-white">📡 Real-time Data Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{realTimeInsights.dataQuality}</div>
                    <div className="text-gray-400">Data Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-400">{realTimeInsights.mistakePatterns}</div>
                    <div className="text-gray-400">Mistake Patterns</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${realTimeInsights.improvementTrend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {realTimeInsights.improvementTrend > 0 ? '+' : ''}{realTimeInsights.improvementTrend.toFixed(1)}%
                    </div>
                    <div className="text-gray-400">Improvement Trend</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-400">{realTimeInsights.consistencyScore.toFixed(0)}%</div>
                    <div className="text-gray-400">Consistency</div>
                  </div>
                </div>
                {realTimeInsights.riskFactors.length > 0 && (
                  <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-400/20">
                    <div className="text-red-400 font-semibold mb-2">⚠️ Risk Factors Detected:</div>
                    <div className="text-red-300 text-sm">
                      {realTimeInsights.riskFactors.map((risk: string) => risk.replace('_', ' ')).join(', ')}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Executive Summary */}
          <Card className="glass-effect border-green-400/30">
            <CardHeader>
              <CardTitle className="text-white">📊 AI Rank Prediction (Real-time Data)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(prediction.predictedScore.mostLikely)}`}>
                    {prediction.predictedScore.mostLikely}/720
                  </div>
                  <div className="text-gray-400 text-sm">Predicted Score</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Range: {prediction.predictedScore.confidenceRange.min}-{prediction.predictedScore.confidenceRange.max}
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${getRankColor(prediction.predictedRank.mostLikely)}`}>
                    {prediction.predictedRank.mostLikely.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">Predicted Rank</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Range: {prediction.predictedRank.confidenceRange.min.toLocaleString()}-{prediction.predictedRank.confidenceRange.max.toLocaleString()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-400 mb-2">
                    {prediction.confidenceLevel}%
                  </div>
                  <div className="text-gray-400 text-sm">Confidence Level</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Based on comprehensive analysis
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* College Probabilities */}
          <Card className="glass-effect border-blue-400/30">
            <CardHeader>
              <CardTitle className="text-white">🏥 College Admission Probabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">AIR 1-1000 (Top Colleges)</span>
                    <span className="text-green-400 font-bold">{prediction.probabilities.air1to1000}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">AIR 1000-5000</span>
                    <span className="text-yellow-400 font-bold">{prediction.probabilities.air1000to5000}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">AIR 5000-15000</span>
                    <span className="text-orange-400 font-bold">{prediction.probabilities.air5000to15000}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Government Medical</span>
                    <span className="text-green-400 font-bold">{prediction.probabilities.governmentMedical}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Private Medical</span>
                    <span className="text-blue-400 font-bold">{prediction.probabilities.privateMedical}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Bihar State Quota</span>
                    <span className="text-purple-400 font-bold">{prediction.probabilities.biharStateQuota}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths & Weaknesses */}
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">💪 Strengths & Weaknesses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-green-400 font-semibold mb-2">Strengths:</h4>
                  <ul className="space-y-1">
                    {prediction.detailedAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-400 font-semibold mb-2">Critical Weaknesses:</h4>
                  <ul className="space-y-1">
                    {prediction.detailedAnalysis.criticalWeaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-red-400 mr-2">⚠</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="glass-effect border-red-400/30">
              <CardHeader>
                <CardTitle className="text-white">⚠️ Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-red-400 font-semibold mb-2">High Risk Factors:</h4>
                  <ul className="space-y-1">
                    {prediction.riskAssessment.highRisk.map((risk, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-red-400 mr-2">🔴</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-2">Medium Risk:</h4>
                  <ul className="space-y-1">
                    {prediction.riskAssessment.mediumRisk.map((risk, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-start">
                        <span className="text-yellow-400 mr-2">🟡</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improvement Roadmap */}
          <Card className="glass-effect border-purple-400/30">
            <CardHeader>
              <CardTitle className="text-white">🗺️ Improvement Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-purple-400 font-semibold mb-3">Next 30 Days</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">
                      <strong>Daily Targets:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>Physics: {prediction.improvementRoadmap.next30Days.dailyTargets.physics} questions</li>
                        <li>Chemistry: {prediction.improvementRoadmap.next30Days.dailyTargets.chemistry} questions</li>
                        <li>Biology: {prediction.improvementRoadmap.next30Days.dailyTargets.biology} questions</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-blue-400 font-semibold mb-3">Next 90 Days</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">
                      <strong>Score Target:</strong> {prediction.improvementRoadmap.next90Days.scoreTarget}/720
                    </div>
                    <div className="text-sm text-gray-300">
                      <strong>Revision Cycles:</strong> {prediction.improvementRoadmap.next90Days.revisionCycles}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-green-400 font-semibold mb-3">Final 180 Days</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">
                      <strong>Final Target:</strong> {prediction.improvementRoadmap.final180Days.scoreTarget}/720
                    </div>
                    <div className="text-sm text-gray-300">
                      <strong>Peak Performance:</strong> {prediction.improvementRoadmap.final180Days.peakPerformanceWeeks}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Immediate Actions */}
          <Card className="glass-effect border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white">🚀 Immediate Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prediction.detailedAnalysis.immediateActions.map((action, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-background-secondary/30 rounded-lg">
                    <span className="text-yellow-400 text-lg">⚡</span>
                    <span className="text-gray-300 text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}