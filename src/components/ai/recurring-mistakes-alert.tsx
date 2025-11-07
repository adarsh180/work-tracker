'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, Target, CheckCircle } from 'lucide-react'

export default function RecurringMistakesAlert() {
  const { data: mistakes = [], isLoading } = useQuery({
    queryKey: ['mistake-patterns'],
    queryFn: async () => {
      const response = await fetch('/api/mistakes/patterns')
      if (!response.ok) throw new Error('Failed to fetch mistake patterns')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 30000
  })

  const resolveMistake = async (mistakeId: string) => {
    try {
      await fetch('/api/mistakes/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mistakeId })
      })
      // Refetch data
      window.location.reload()
    } catch (error) {
      console.error('Error resolving mistake:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className="glass-effect border-yellow-400/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (mistakes.length === 0) {
    return (
      <Card className="glass-effect border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
            Great Job, Misti! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">No recurring mistakes detected. Keep up the excellent work!</p>
        </CardContent>
      </Card>
    )
  }

  const criticalMistakes = mistakes.filter((m: any) => m.frequency >= 5)
  const moderateMistakes = mistakes.filter((m: any) => m.frequency >= 3 && m.frequency < 5)

  return (
    <div className="space-y-4">
      {/* Critical Mistakes Alert */}
      {criticalMistakes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <Card className="glass-effect border-red-400/50 bg-red-500/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-400 animate-pulse" />
                🚨 Critical: Repeated Mistakes Detected!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-500/20 rounded-lg border border-red-400/30">
                <p className="text-red-200 font-semibold mb-2">
                  Misti, you're repeating the same mistakes! This is costing you marks in NEET 2026.
                </p>
                <p className="text-red-300 text-sm">
                  These patterns need immediate attention to reach your 690+ target.
                </p>
              </div>

              <div className="space-y-3">
                {criticalMistakes.map((mistake: any) => (
                  <div key={mistake.id} className="p-3 bg-background-secondary/50 rounded-lg border border-red-400/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-400 font-bold">#{mistake.frequency}</span>
                        <span className="text-white font-medium">{mistake.mistakeType.replace('_', ' ').toUpperCase()}</span>
                        <span className="text-gray-400">in {mistake.subject}</span>
                      </div>
                      <button
                        onClick={() => resolveMistake(mistake.id)}
                        className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                      >
                        Mark Fixed
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-300 mb-2">
                      <strong>Solutions:</strong>
                    </div>
                    <ul className="text-xs text-gray-400 space-y-1">
                      {(mistake.solutions as string[]).map((solution: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-yellow-400 mr-2">•</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Moderate Mistakes */}
      {moderateMistakes.length > 0 && (
        <Card className="glass-effect border-yellow-400/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-yellow-400" />
              ⚠️ Patterns to Watch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moderateMistakes.map((mistake: any) => (
              <div key={mistake.id} className="p-3 bg-background-secondary/30 rounded-lg border border-yellow-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400 font-bold">#{mistake.frequency}</span>
                    <span className="text-white">{mistake.mistakeType.replace('_', ' ')}</span>
                    <span className="text-gray-400">in {mistake.subject}</span>
                  </div>
                  <button
                    onClick={() => resolveMistake(mistake.id)}
                    className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                  >
                    Mark Fixed
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Action Plan */}
      <Card className="glass-effect border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="mr-2 h-5 w-5 text-blue-400" />
            💪 Action Plan for Misti
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-400/20">
              <h4 className="text-blue-300 font-semibold mb-2">Immediate Actions:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Practice 10 questions daily on your weak mistake types</li>
                <li>• Review mistakes immediately after each study session</li>
                <li>• Set up mistake-specific revision time (30 min daily)</li>
                <li>• Use timer to avoid overthinking (2 min per question max)</li>
              </ul>
            </div>
            
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-400/20">
              <h4 className="text-purple-300 font-semibold mb-2">Weekly Goals:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Reduce each mistake type frequency by 50%</li>
                <li>• Track improvement in mistake analysis popup</li>
                <li>• Focus extra time on subjects with most mistakes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}