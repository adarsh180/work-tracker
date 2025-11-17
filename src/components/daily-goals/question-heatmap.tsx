'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface HeatmapData {
  date: string
  count: number
  color: string
  dayOfWeek: number
  week: number
}

interface HeatmapResponse {
  startDate: string
  endDate: string
  heatmapData: HeatmapData[]
  totalDays: number
  totalWeeks: number
}

const colorMap = {
  'blank': 'bg-gray-800/30',
  'deep-red': 'bg-red-800',
  'light': 'bg-green-300',
  'mid': 'bg-green-500',
  'darker': 'bg-green-700',
  'darkest': 'bg-green-900'
}

interface QuestionHeatmapProps {
  compact?: boolean
}

export default function QuestionHeatmap({ compact = false }: QuestionHeatmapProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['daily-goals-heatmap'],
    queryFn: async () => {
      const response = await fetch('/api/daily-goals/heatmap')
      if (!response.ok) throw new Error('Failed to fetch heatmap data')
      const result = await response.json()
      return result.data as HeatmapResponse
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) {
    const loadingCellSize = compact ? 'w-2 h-2' : 'w-3 h-3'
    const loadingSpacing = compact ? 'mb-0.5 mr-0.5' : 'mb-1 mr-1'
    const loadingWeeks = compact ? 52 : 80
    
    return (
      <div className="glass-effect rounded-xl p-6">
        <div className="animate-pulse">
          {!compact && <div className="h-4 bg-gray-700 rounded w-48 mb-4"></div>}
          <div className="flex">
            {Array.from({ length: loadingWeeks }).map((_, weekIndex) => (
              <div key={weekIndex} className={`flex flex-col ${loadingSpacing.split(' ')[1]}`}>
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div key={dayIndex} className={`${loadingCellSize} bg-gray-800 rounded-sm ${loadingSpacing.split(' ')[0]}`}></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Group data by weeks for GitHub-style layout
  const weeks = data.heatmapData.reduce((acc, day) => {
    if (!acc[day.week]) acc[day.week] = Array(7).fill(null)
    acc[day.week][day.dayOfWeek] = day
    return acc
  }, {} as Record<number, (HeatmapData | null)[]>)

  const weekNumbers = Object.keys(weeks).map(Number).sort((a, b) => a - b)
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const cellSize = compact ? 'w-2 h-2' : 'w-3 h-3'
  const spacing = compact ? 'mb-0.5 mr-0.5' : 'mb-1 mr-1'
  const maxWeeks = compact ? 52 : weekNumbers.length
  const displayWeeks = weekNumbers.slice(0, maxWeeks)

  return (
    <div className="glass-effect rounded-xl p-6">
      {!compact && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <span>🔥</span>
            <span>Question Streak Heatmap</span>
          </h3>
          <p className="text-gray-400 text-sm">
            May 4, 2025 - December 31, 2026 • Daily question progress visualization
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month labels */}
          <div className={`flex mb-2 ${compact ? 'ml-6' : 'ml-8'}`}>
            {displayWeeks.map((weekNum, index) => {
              const firstDayOfWeek = weeks[weekNum]?.find(day => day !== null)
              const cellWidth = compact ? 'w-2' : 'w-3'
              const marginRight = compact ? 'mr-0.5' : 'mr-1'
              
              if (!firstDayOfWeek) {
                return <div key={weekNum} className={`${cellWidth} ${marginRight}`}></div>
              }
              
              const date = new Date(firstDayOfWeek.date)
              const isFirstWeekOfMonth = index === 0 || 
                (weeks[displayWeeks[index - 1]]?.find(d => d !== null) && 
                 new Date(weeks[displayWeeks[index - 1]].find(d => d !== null)!.date).getMonth() !== date.getMonth())
              
              if (!isFirstWeekOfMonth) {
                return <div key={weekNum} className={`${cellWidth} ${marginRight}`}></div>
              }
              
              return (
                <div key={weekNum} className={`text-xs text-gray-400 ${cellWidth} ${marginRight} text-left`}>
                  {monthLabels[date.getMonth()]}
                </div>
              )
            })}
          </div>

          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col mr-2">
              {dayLabels.map((day, index) => {
                const cellHeight = compact ? 'h-2' : 'h-3'
                const marginBottom = compact ? 'mb-0.5' : 'mb-1'
                const width = compact ? 'w-4' : 'w-6'
                
                return (
                  <div key={day} className={`${cellHeight} ${marginBottom} text-xs text-gray-400 ${width} flex items-center`}>
                    {index % 2 === 1 ? (compact ? day.slice(0, 1) : day) : ''}
                  </div>
                )
              })}
            </div>

            {/* Heatmap grid */}
            <div className="flex">
              {displayWeeks.map(weekNum => {
                const marginRight = compact ? 'mr-0.5' : 'mr-1'
                return (
                  <div key={weekNum} className={`flex flex-col ${marginRight}`}>
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const dayData = weeks[weekNum]?.[dayIndex]
                      const colorClass = dayData ? colorMap[dayData.color as keyof typeof colorMap] : 'bg-gray-800/30'
                      const marginBottom = compact ? 'mb-0.5' : 'mb-1'
                      
                      return (
                        <motion.div
                          key={`${weekNum}-${dayIndex}`}
                          className={`${cellSize} rounded-sm ${marginBottom} ${colorClass} cursor-pointer border border-gray-700/50`}
                          whileHover={{ scale: compact ? 1.5 : 1.3 }}
                          title={dayData ? `${dayData.date}: ${dayData.count} questions` : 'No data'}
                        />
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className={`flex items-center justify-between ${compact ? 'mt-2' : 'mt-4'} text-xs text-gray-400`}>
            <span>Less</span>
            <div className="flex items-center gap-1">
              {Object.entries(colorMap).filter(([key]) => key !== 'blank').map(([key, colorClass]) => (
                <div key={key} className={`${compact ? 'w-2 h-2' : 'w-3 h-3'} rounded-sm ${colorClass}`}></div>
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  )
}