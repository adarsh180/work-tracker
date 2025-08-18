'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { motion } from 'framer-motion'

type DailyTrend = {
  date: string
  totalQuestions: number
  physicsQuestions: number
  chemistryQuestions: number
  botanyQuestions: number
  zoologyQuestions: number
}

type WeeklyTrend = {
  weekStart: string
  weekEnd: string
  totalQuestions: number
  weekNumber: number
}

type MonthlyTrend = {
  month: string
  year: number
  totalQuestions: number
  monthName: string
}

export default function DailyGoalsCharts() {
  const [activeChart, setActiveChart] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const { data: dailyTrend, isLoading: dailyLoading } = useQuery<DailyTrend[]>({
    queryKey: ['daily-goals-trend'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/trend?period=daily')
      if (!response.ok) throw new Error('Failed to fetch daily trend')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const { data: weeklyTrend, isLoading: weeklyLoading } = useQuery<WeeklyTrend[]>({
    queryKey: ['weekly-goals-trend'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/trend?period=weekly')
      if (!response.ok) throw new Error('Failed to fetch weekly trend')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const { data: monthlyTrend, isLoading: monthlyLoading } = useQuery<MonthlyTrend[]>({
    queryKey: ['monthly-goals-trend'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/trend?period=monthly')
      if (!response.ok) throw new Error('Failed to fetch monthly trend')
      const result = await response.json()
      return result.data
    },
    refetchInterval: 2000,
    staleTime: 500
  })

  const renderChart = (data: any[], type: 'daily' | 'weekly' | 'monthly') => {
    if (!data || data.length === 0) {
      return (
        <div className="h-80 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No data available yet</p>
            <p className="text-sm mt-2">Add some daily goals to see your progress!</p>
          </div>
        </div>
      )
    }

    const containerWidth = 800
    const containerHeight = 320
    const padding = { top: 20, right: 40, bottom: 60, left: 60 }
    const chartWidth = containerWidth - padding.left - padding.right
    const chartHeight = containerHeight - padding.top - padding.bottom

    const maxQuestions = Math.max(...data.map(d => d.totalQuestions), 100)
    const minQuestions = 0
    const questionRange = maxQuestions - minQuestions || 1

    const points = data.map((item, index) => {
      const x = padding.left + (index / (data.length - 1 || 1)) * chartWidth
      const y = padding.top + ((maxQuestions - item.totalQuestions) / questionRange) * chartHeight
      return { x, y, data: item }
    })

    const pathData = points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L'
      return `${path} ${command} ${point.x} ${point.y}`
    }, '')

    const getLabel = (item: any, type: string) => {
      if (type === 'daily') return new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      if (type === 'weekly') return `W${item.weekNumber}`
      if (type === 'monthly') return item.monthName
      return ''
    }

    const getTooltip = (item: any, type: string) => {
      if (type === 'daily') return `${new Date(item.date).toLocaleDateString()}: ${item.totalQuestions} questions`
      if (type === 'weekly') return `Week ${item.weekNumber}: ${item.totalQuestions} questions`
      if (type === 'monthly') return `${item.monthName} ${item.year}: ${item.totalQuestions} questions`
      return ''
    }

    const yAxisTicks = [0, Math.floor(maxQuestions * 0.25), Math.floor(maxQuestions * 0.5), Math.floor(maxQuestions * 0.75), maxQuestions]
    const xAxisTicks = data.length > 10 ? data.filter((_, i) => i % Math.ceil(data.length / 8) === 0) : data

    return (
      <div className="bg-gradient-to-br from-background-secondary/20 to-background-secondary/5 rounded-xl p-6">
        <div className="relative overflow-hidden">
          <svg width={containerWidth} height={containerHeight} className="w-full h-auto" viewBox={`0 0 ${containerWidth} ${containerHeight}`}>
            {/* Background gradient */}
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Chart area background */}
            <rect 
              x={padding.left} 
              y={padding.top} 
              width={chartWidth} 
              height={chartHeight} 
              fill="url(#chartGradient)" 
              rx="8"
            />
            
            {/* Grid lines */}
            {yAxisTicks.map(questions => {
              const y = padding.top + ((maxQuestions - questions) / questionRange) * chartHeight
              return (
                <line 
                  key={questions}
                  x1={padding.left} 
                  y1={y} 
                  x2={padding.left + chartWidth} 
                  y2={y} 
                  stroke="#374151" 
                  strokeWidth="0.5" 
                  opacity="0.3"
                />
              )
            })}
            
            {/* Y-axis */}
            <line 
              x1={padding.left} 
              y1={padding.top} 
              x2={padding.left} 
              y2={padding.top + chartHeight} 
              stroke="#6B7280" 
              strokeWidth="2"
            />
            
            {/* X-axis */}
            <line 
              x1={padding.left} 
              y1={padding.top + chartHeight} 
              x2={padding.left + chartWidth} 
              y2={padding.top + chartHeight} 
              stroke="#6B7280" 
              strokeWidth="2"
            />
            
            {/* Y-axis labels */}
            {yAxisTicks.map(questions => {
              const y = padding.top + ((maxQuestions - questions) / questionRange) * chartHeight
              return (
                <text 
                  key={questions}
                  x={padding.left - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-xs fill-gray-300 font-medium"
                >
                  {questions}
                </text>
              )
            })}
            
            {/* X-axis labels */}
            {xAxisTicks.map((item, index) => {
              const originalIndex = data.indexOf(item)
              const x = padding.left + (originalIndex / (data.length - 1 || 1)) * chartWidth
              return (
                <text 
                  key={index}
                  x={x} 
                  y={padding.top + chartHeight + 20} 
                  textAnchor="middle" 
                  className="text-xs fill-gray-300 font-medium"
                >
                  {getLabel(item, type)}
                </text>
              )
            })}
            
            {/* Area under curve */}
            <path
              d={`${pathData} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`}
              fill="url(#chartGradient)"
              opacity="0.3"
            />
            
            {/* Performance line */}
            <path
              d={pathData}
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
            
            {/* Data points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#1E293B"
                  stroke="#3B82F6"
                  strokeWidth="3"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="#3B82F6"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill="transparent"
                  className="hover:fill-blue-500/20 cursor-pointer transition-all"
                >
                  <title>{getTooltip(point.data, type)}</title>
                </circle>
              </g>
            ))}
            
            {/* Axis labels */}
            <text 
              x={padding.left + chartWidth / 2} 
              y={containerHeight - 10} 
              textAnchor="middle" 
              className="text-sm fill-gray-400 font-medium"
            >
              {type === 'daily' ? 'Days' : type === 'weekly' ? 'Weeks' : 'Months'}
            </text>
            
            <text 
              x={20} 
              y={padding.top + chartHeight / 2} 
              textAnchor="middle" 
              className="text-sm fill-gray-400 font-medium"
              transform={`rotate(-90, 20, ${padding.top + chartHeight / 2})`}
            >
              Questions
            </text>
          </svg>
        </div>

        {/* Enhanced Comparison Stats */}
        {data.length >= 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-700">
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-sm text-blue-300 mb-2 font-medium">First Entry</div>
              <div className="text-2xl font-bold text-white mb-1">{data[0].totalQuestions}</div>
              <div className="text-xs text-gray-400">{getLabel(data[0], type)}</div>
            </motion.div>
            
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-lg border border-purple-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-sm text-purple-300 mb-2 font-medium">Latest Entry</div>
              <div className="text-2xl font-bold text-white mb-1">{data[data.length - 1].totalQuestions}</div>
              <div className="text-xs text-gray-400">{getLabel(data[data.length - 1], type)}</div>
            </motion.div>
            
            <motion.div 
              className={`text-center p-4 rounded-lg border ${
                data[data.length - 1].totalQuestions > data[0].totalQuestions 
                  ? 'bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20' 
                  : data[data.length - 1].totalQuestions < data[0].totalQuestions
                  ? 'bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20'
                  : 'bg-gradient-to-br from-gray-500/10 to-gray-600/5 border-gray-500/20'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`text-sm mb-2 font-medium ${
                data[data.length - 1].totalQuestions > data[0].totalQuestions 
                  ? 'text-green-300' 
                  : data[data.length - 1].totalQuestions < data[0].totalQuestions
                  ? 'text-red-300'
                  : 'text-gray-300'
              }`}>Improvement</div>
              <div className={`text-2xl font-bold mb-1 ${
                data[data.length - 1].totalQuestions > data[0].totalQuestions 
                  ? 'text-green-400' 
                  : data[data.length - 1].totalQuestions < data[0].totalQuestions
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}>
                {data[data.length - 1].totalQuestions > data[0].totalQuestions ? '+' : ''}
                {data[data.length - 1].totalQuestions - data[0].totalQuestions}
              </div>
              <div className="text-xs text-gray-400">questions</div>
            </motion.div>
          </div>
        )}
      </div>
    )
  }

  const isLoading = dailyLoading || weeklyLoading || monthlyLoading

  if (isLoading) {
    return (
      <Card className="glass-effect border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Progress Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-gray-400">Loading charts...</div>
          </div>
        </CardContent>
      </Card>
    )
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
            <span>Progress Charts</span>
            <div className="flex space-x-1 bg-background-secondary/50 p-1 rounded-lg">
              {[
                { key: 'daily', label: 'Daily' },
                { key: 'weekly', label: 'Weekly' },
                { key: 'monthly', label: 'Monthly' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveChart(tab.key as any)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    activeChart === tab.key
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white hover:bg-background-secondary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeChart === 'daily' && renderChart(dailyTrend || [], 'daily')}
            {activeChart === 'weekly' && renderChart(weeklyTrend || [], 'weekly')}
            {activeChart === 'monthly' && renderChart(monthlyTrend || [], 'monthly')}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}