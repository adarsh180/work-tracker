'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { TrophyIcon, ChartBarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

type AIRPrediction = {
  predictedAIR: number
  confidence: number
  factors: {
    progressScore: number
    testTrend: number
    consistency: number
    biologicalFactor: number
    externalFactor: number
  }
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
  comprehensiveData?: any
  aiInsights?: {
    motivation: string
    schedulePlanner: string
    weakAreaAnalysis: string
    strategicSuggestions: string
    timelineOptimization: string
  }
}

export default function AIRPredictionDashboard() {
  const { data: prediction, isLoading } = useQuery<AIRPrediction>({
    queryKey: ['air-prediction'],
    queryFn: async () => {
      const response = await fetch('/api/air-prediction')
      if (!response.ok) throw new Error('Failed to fetch prediction')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 60000, // Refresh every minute for real-time updates
    staleTime: 30000 // Consider data stale after 30 seconds
  })

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'low': return '✅'
      case 'medium': return '⚠️'
      case 'high': return '🚨'
      default: return '📊'
    }
  }

  const getAIRColor = (air: number) => {
    if (air <= 50) return 'text-green-400'
    if (air <= 100) return 'text-yellow-400'
    if (air <= 500) return 'text-orange-400'
    return 'text-red-400'
  }

  if (isLoading) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prediction) return null

  return (
    <div className="space-y-6">
      {/* Main Prediction */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-effect border-primary/30 bg-gradient-to-br from-primary/10 to-purple-500/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <TrophyIcon className="h-6 w-6" />
              <span>AIR Prediction for NEET UG 2026</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getAIRColor(prediction.predictedAIR)}`}>
                  {prediction.predictedAIR.toLocaleString()}
                </div>
                <div className="text-gray-300 text-sm">Predicted AIR</div>
                <div className="text-xs text-gray-400 mt-1">
                  {prediction.predictedAIR <= 50 ? '🎯 Target Achieved!' : 
                   prediction.predictedAIR <= 100 ? '🔥 Very Close!' : 
                   prediction.predictedAIR <= 500 ? '💪 Good Progress!' : '📈 Keep Going!'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">
                  {Math.round(prediction.confidence * 100)}%
                </div>
                <div className="text-gray-300 text-sm">Confidence</div>
                <div className="text-xs text-gray-400 mt-1">
                  {prediction.confidence > 0.8 ? 'High Accuracy' : 
                   prediction.confidence > 0.6 ? 'Good Accuracy' : 'Moderate Accuracy'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2">{getRiskIcon(prediction.riskLevel)}</div>
                <div className={`font-semibold ${getRiskColor(prediction.riskLevel)}`}>
                  {prediction.riskLevel.toUpperCase()} RISK
                </div>
                <div className="text-xs text-gray-400 mt-1">Success Probability</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Factor Analysis */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5" />
            <span>Performance Factors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(prediction.factors).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
              const percentage = Math.round(value)
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{label}</span>
                    <span className="text-white font-medium">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        percentage >= 80 ? 'bg-green-400' :
                        percentage >= 60 ? 'bg-yellow-400' :
                        percentage >= 40 ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {prediction.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-background-secondary/30 rounded-lg"
              >
                <span className="text-primary text-lg">💡</span>
                <p className="text-gray-300 text-sm">{rec}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>



      {/* Days to NEET */}
      <Card className="glass-effect border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-white mb-2">
            {Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days
          </div>
          <div className="text-gray-400">Until NEET UG 2026</div>
          <div className="text-sm text-pink-300 mt-2">
            Every day counts towards Dr. Misti! 👩⚕️✨
          </div>
          {prediction?.comprehensiveData && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {prediction.comprehensiveData.totalQuestionsLifetime?.toLocaleString() || 0}
                </div>
                <div className="text-gray-400">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {Math.round(prediction.comprehensiveData.consistencyScore || 0)}%
                </div>
                <div className="text-gray-400">Consistency</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}