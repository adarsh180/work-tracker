'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import DailyGoalsForm from '@/components/daily-goals/daily-goals-form'
import QuestionStats from '@/components/daily-goals/question-stats'
import RecentGoals from '@/components/daily-goals/recent-goals'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function DailyGoalsPage() {
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'history'>('today')

  return (
    <DashboardLayout 
      title="Daily Goals"
      subtitle="Track your daily NEET preparation progress with gamification"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-background-secondary/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'today'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Today's Goals</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'stats'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>Statistics</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            <span>History</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'today' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DailyGoalsForm />
            </div>
            <div>
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Daily Targets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background-secondary/30 rounded-lg">
                      <span className="text-gray-300">Daily Questions</span>
                      <span className="text-primary font-semibold">250+</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background-secondary/30 rounded-lg">
                      <span className="text-gray-300">Excellence Level</span>
                      <span className="text-pink-400 font-semibold">500+</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background-secondary/30 rounded-lg">
                      <span className="text-gray-300">Weekly Goal</span>
                      <span className="text-green-400 font-semibold">2000+</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background-secondary/30 rounded-lg">
                      <span className="text-gray-300">Monthly Goal</span>
                      <span className="text-yellow-400 font-semibold">7500+</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-white font-medium mb-3">Performance Levels</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🔥</span>
                        <span className="text-gray-300">500+ questions</span>
                        <span className="text-red-400 font-medium">FIRE!</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">😘</span>
                        <span className="text-gray-300">300+ questions</span>
                        <span className="text-pink-400 font-medium">Amazing</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">😊</span>
                        <span className="text-gray-300">250+ questions</span>
                        <span className="text-green-400 font-medium">Great</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">😐</span>
                        <span className="text-gray-300">150+ questions</span>
                        <span className="text-yellow-400 font-medium">Good</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">😟</span>
                        <span className="text-gray-300">1+ questions</span>
                        <span className="text-orange-400 font-medium">Keep going</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <QuestionStats />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <RecentGoals />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}