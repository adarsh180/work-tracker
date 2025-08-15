'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { CalendarIcon } from '@heroicons/react/24/outline'

type MoodEntry = {
  id: string
  date: string
  mood: 'sad' | 'neutral' | 'happy'
}

export default function MoodPage() {
  const queryClient = useQueryClient()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const { data: moodEntries = [] } = useQuery<MoodEntry[]>({
    queryKey: ['mood-entries'],
    queryFn: async () => {
      const response = await fetch('/api/mood')
      if (!response.ok) throw new Error('Failed to fetch mood entries')
      const result = await response.json()
      return result.data
    }
  })

  const handleMoodSelect = async (mood: 'sad' | 'neutral' | 'happy') => {
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, mood })
      })

      if (!response.ok) throw new Error('Failed to save mood')
      
      queryClient.invalidateQueries({ queryKey: ['mood-entries'] })
    } catch (error) {
      console.error('Error saving mood:', error)
    }
  }

  const getMoodForDate = (date: string) => {
    return moodEntries.find(entry => entry.date.split('T')[0] === date)?.mood
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'sad': return 'bg-red-500'
      case 'neutral': return 'bg-yellow-500'
      case 'happy': return 'bg-green-500'
      default: return 'bg-gray-700'
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'sad': return '😢'
      case 'neutral': return '😐'
      case 'happy': return '😊'
      default: return '📅'
    }
  }

  // Generate calendar days for current month
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  return (
    <DashboardLayout title="Mood Calendar" subtitle="Track your daily mood during NEET preparation">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-gray-400 text-sm font-medium p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    if (!day) return <div key={index} />
                    
                    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const mood = getMoodForDate(dateStr)
                    const isSelected = selectedDate === dateStr
                    const isToday = dateStr === today.toISOString().split('T')[0]

                    return (
                      <motion.button
                        key={day}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`
                          aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium
                          ${isSelected ? 'border-primary bg-primary/20' : 'border-gray-600 hover:border-gray-500'}
                          ${isToday ? 'ring-2 ring-primary/50' : ''}
                          ${mood ? getMoodColor(mood) + '/20' : 'bg-background-secondary/30'}
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-white">{day}</span>
                          {mood && (
                            <span className="text-xs">{getMoodEmoji(mood)}</span>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Today's Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm">
                    How are you feeling today, Misti?
                  </p>
                  <div className="space-y-3">
                    {[
                      { mood: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-500' },
                      { mood: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-yellow-500' },
                      { mood: 'sad', emoji: '😢', label: 'Sad', color: 'bg-red-500' }
                    ].map(({ mood, emoji, label, color }) => (
                      <motion.button
                        key={mood}
                        onClick={() => handleMoodSelect(mood as any)}
                        className={`
                          w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all
                          ${getMoodForDate(selectedDate) === mood 
                            ? `${color}/20 border-current` 
                            : 'border-gray-600 hover:border-gray-500 bg-background-secondary/30'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-white font-medium">{label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Mood Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['happy', 'neutral', 'sad'].map(mood => {
                    const count = moodEntries.filter(entry => entry.mood === mood).length
                    const percentage = moodEntries.length > 0 ? (count / moodEntries.length) * 100 : 0
                    
                    return (
                      <div key={mood} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getMoodEmoji(mood)}</span>
                          <span className="text-gray-300 capitalize">{mood}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getMoodColor(mood)}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}