'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import AIRPredictionDashboard from '@/components/ai/air-prediction-dashboard'
import EnhancedMenstrualTracker from '@/components/ai/enhanced-menstrual-tracker'
import RigorousRankingDashboard from '@/components/ai/rigorous-ranking-dashboard'
import AISuggestionsSection from '@/components/ai/ai-suggestions-section'
import SmartStudyPlanner from '@/components/enhanced/smart-study-planner'
import MemoryRetentionSystem from '@/components/enhanced/memory-retention-system'
import ProgressAnalytics from '@/components/enhanced/progress-analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<'prediction' | 'biology' | 'ai-suggestions' | 'schedule' | 'memory' | 'progress'>('prediction')

  return (
    <DashboardLayout 
      title="AI Success Engine 🚀"
      subtitle="Advanced intelligence to help Misti achieve AIR under 50 in NEET UG 2026"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-background-secondary/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('prediction')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'prediction'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            🎯 AIR Prediction
          </button>
          <button
            onClick={() => setActiveTab('biology')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'biology'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            🌸 Biology Sync
          </button>
          <button
            onClick={() => setActiveTab('ai-suggestions')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'ai-suggestions'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            🤖 AI Suggestions
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'schedule'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            📅 Smart Schedule
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'memory'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            🧠 Memory System
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'progress'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            📈 Progress Analytics
          </button>
        </div>

        {/* Content */}
        {activeTab === 'prediction' && (
          <div className="space-y-6">
            <AIRPredictionDashboard />
            <RigorousRankingDashboard />
          </div>
        )}
        {activeTab === 'biology' && <EnhancedMenstrualTracker />}
        {activeTab === 'ai-suggestions' && <AISuggestionsSection predictedAIR={1250} />}
        {activeTab === 'schedule' && <SmartStudyPlanner />}
        {activeTab === 'memory' && <MemoryRetentionSystem />}
        {activeTab === 'progress' && <ProgressAnalytics />}
      </div>
    </DashboardLayout>
  )
}