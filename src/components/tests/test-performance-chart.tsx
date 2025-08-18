'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type PerformanceTrend = {
  date: string
  score: number
  percentage: number
  testType: string
  testNumber: string
}

export default function TestPerformanceChart() {
  const [selectedTestType, setSelectedTestType] = useState<string>('all')
  
  const { data: trendData, isLoading, error } = useQuery<PerformanceTrend[]>({
    queryKey: ['test-performance-trend', selectedTestType],
    queryFn: async () => {
      const url = selectedTestType === 'all' 
        ? '/api/tests/trend' 
        : `/api/tests/trend?testType=${encodeURIComponent(selectedTestType)}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch performance trend')
      }
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const testTypes = ['all', 'Weekly Test', 'Rank Booster', 'Test Series', 'AITS', 'Full Length Test']

  if (isLoading) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !trendData || trendData.length === 0) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p>No test data available yet</p>
              <p className="text-sm mt-2">Add some test scores to see your progress!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate chart dimensions and scaling
  const chartWidth = 600
  const chartHeight = 200
  const padding = 40
  const innerWidth = chartWidth - 2 * padding
  const innerHeight = chartHeight - 2 * padding

  // Find min and max values for scaling
  const maxScore = Math.max(...trendData.map(d => d.score), 720)
  const minScore = Math.min(...trendData.map(d => d.score), 0)
  const scoreRange = maxScore - minScore || 1

  // Create points for the line
  const points = trendData.map((data, index) => {
    const x = padding + (index / (trendData.length - 1 || 1)) * innerWidth
    const y = padding + ((maxScore - data.score) / scoreRange) * innerHeight
    return { x, y, data }
  })

  // Create path string for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L'
    return `${path} ${command} ${point.x} ${point.y}`
  }, '')

  // Get emoji for current performance
  const getPerformanceEmoji = (percentage: number) => {
    if (percentage < 75) return '😢'
    if (percentage < 85) return '😟'
    if (percentage < 95) return '😊'
    return '😘'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect border-gray-700 hover:border-primary/30 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Performance Trend</span>
          <select
            value={selectedTestType}
            onChange={(e) => setSelectedTestType(e.target.value)}
            className="text-sm bg-background-secondary border border-gray-600 rounded px-2 py-1 text-white"
          >
            {testTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Tests' : type}
              </option>
            ))}
          </select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="relative overflow-hidden rounded-lg">
            <svg 
              width={chartWidth} 
              height={chartHeight} 
              className="w-full h-auto max-w-full" 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width={chartWidth} height={chartHeight} fill="url(#grid)" />
              
              {/* Y-axis labels */}
              {[0, 180, 360, 540, 720].map(score => {
                const y = padding + ((maxScore - score) / scoreRange) * innerHeight
                return (
                  <g key={score}>
                    <line 
                      x1={padding - 5} 
                      y1={y} 
                      x2={padding} 
                      y2={y} 
                      stroke="#9CA3AF" 
                      strokeWidth="1"
                    />
                    <text 
                      x={padding - 10} 
                      y={y + 4} 
                      textAnchor="end" 
                      className="text-xs fill-gray-400"
                    >
                      {score}
                    </text>
                  </g>
                )
              })}
              
              {/* Performance line */}
              <path
                d={pathData}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points - ensure they stay within bounds */}
              {points.map((point, index) => {
                // Clamp points within chart area
                const clampedX = Math.max(padding, Math.min(point.x, chartWidth - padding))
                const clampedY = Math.max(padding, Math.min(point.y, chartHeight - padding))
                
                return (
                  <g key={index}>
                    <circle
                      cx={clampedX}
                      cy={clampedY}
                      r="4"
                      fill="#3B82F6"
                      stroke="#1E293B"
                      strokeWidth="2"
                    />
                    {/* Tooltip on hover */}
                    <circle
                      cx={clampedX}
                      cy={clampedY}
                      r="8"
                      fill="transparent"
                      className="hover:fill-blue-500/20 cursor-pointer"
                    >
                      <title>
                        {point.data.testNumber} ({point.data.testType}): {point.data.score}/720 ({point.data.percentage}%) on {new Date(point.data.date).toLocaleDateString()}
                      </title>
                    </circle>
                  </g>
                )
              })}
              
              {/* X-axis */}
              <line 
                x1={padding} 
                y1={chartHeight - padding} 
                x2={chartWidth - padding} 
                y2={chartHeight - padding} 
                stroke="#9CA3AF" 
                strokeWidth="1"
              />
              
              {/* Y-axis */}
              <line 
                x1={padding} 
                y1={padding} 
                x2={padding} 
                y2={chartHeight - padding} 
                stroke="#9CA3AF" 
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* Performance comparison */}
          {trendData.length >= 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">First Test</div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg font-semibold text-white">
                    {trendData[0].score}
                  </span>
                  <span className="text-2xl">
                    {getPerformanceEmoji(trendData[0].percentage)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {trendData[0].percentage}%
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Latest Test</div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg font-semibold text-white">
                    {trendData[trendData.length - 1].score}
                  </span>
                  <span className="text-2xl">
                    {getPerformanceEmoji(trendData[trendData.length - 1].percentage)}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {trendData[trendData.length - 1].percentage}%
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Improvement</div>
                <div className="flex items-center justify-center space-x-1">
                  <span className={`text-lg font-semibold ${
                    trendData[trendData.length - 1].score > trendData[0].score 
                      ? 'text-green-400' 
                      : trendData[trendData.length - 1].score < trendData[0].score
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}>
                    {trendData[trendData.length - 1].score > trendData[0].score ? '+' : ''}
                    {trendData[trendData.length - 1].score - trendData[0].score}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  points change
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      </Card>
    </motion.div>
  )
}