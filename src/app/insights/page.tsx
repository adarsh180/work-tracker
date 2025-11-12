'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import AIRPredictionDashboard from '@/components/ai/air-prediction-dashboard'
import EnhancedMenstrualTracker from '@/components/ai/enhanced-menstrual-tracker'
import CycleOptimizedScheduler from '@/components/ai/cycle-optimized-scheduler'
import EnergyMoodPredictor from '@/components/ai/energy-mood-predictor'
import CycleStudyTechniques from '@/components/ai/cycle-study-techniques'
import HormonalOptimizationPanel from '@/components/ai/hormonal-optimization-panel'
import EmergencySupportSystem from '@/components/ai/emergency-support-system'
import RigorousRankingDashboard from '@/components/ai/rigorous-ranking-dashboard'
import AISuggestionsSection from '@/components/ai/ai-suggestions-section'
import SmartStudyPlanner from '@/components/enhanced/smart-study-planner'
import MemoryRetentionSystem from '@/components/enhanced/memory-retention-system'
import ProgressAnalytics from '@/components/enhanced/progress-analytics'
import { CompetitiveEdgeSystem } from '@/components/competitive/edge-system'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<'prediction' | 'biology' | 'cycle-schedule' | 'energy-prediction' | 'study-techniques' | 'hormonal' | 'emergency' | 'ai-suggestions' | 'schedule' | 'memory' | 'progress' | 'competitive'>('prediction')

  return (
    <DashboardLayout 
      title="AI Success Engine 🚀"
      subtitle="Advanced intelligence to help Misti achieve AIR under 50 in NEET UG 2026"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="w-full">
          <div className="flex flex-wrap justify-stretch bg-gray-800/40 p-2 rounded-xl border border-gray-600/30 shadow-lg">
            <button
              onClick={() => setActiveTab('prediction')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'prediction'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🎯 AIR Prediction
            </button>
            <button
              onClick={() => setActiveTab('biology')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'biology'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🌸 Cycle Tracker
            </button>
            <button
              onClick={() => setActiveTab('cycle-schedule')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'cycle-schedule'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🗓️ AI Schedule
            </button>
            <button
              onClick={() => setActiveTab('energy-prediction')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'energy-prediction'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🔮 Energy Predictor
            </button>
            <button
              onClick={() => setActiveTab('study-techniques')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'study-techniques'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              📚 Study Techniques
            </button>
            <button
              onClick={() => setActiveTab('hormonal')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'hormonal'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🧬 Hormonal Boost
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'emergency'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🆘 Emergency Support
            </button>
            <button
              onClick={() => setActiveTab('ai-suggestions')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'ai-suggestions'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🤖 AI Suggestions
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'schedule'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              📅 Smart Schedule
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'memory'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🧠 Memory System
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'progress'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              📈 Progress Analytics
            </button>
            <button
              onClick={() => setActiveTab('competitive')}
              className={`flex-1 min-w-0 px-4 py-3 mx-1 rounded-lg transition-all duration-300 text-sm font-semibold text-center ${
                activeTab === 'competitive'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl transform scale-105 border border-blue-400/50'
                  : 'text-gray-300 bg-gray-700/50 hover:text-white hover:bg-gray-600/70 hover:shadow-md hover:scale-102 border border-gray-600/30'
              }`}
            >
              🏆 Competitive Edge
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'prediction' && (
          <div className="space-y-6">
            <AIRPredictionDashboard />
            <RigorousRankingDashboard />
          </div>
        )}
        {activeTab === 'biology' && <EnhancedMenstrualTracker />}
        {activeTab === 'cycle-schedule' && <CycleOptimizedScheduler />}
        {activeTab === 'energy-prediction' && <EnergyMoodPredictor />}
        {activeTab === 'study-techniques' && <CycleStudyTechniques />}
        {activeTab === 'hormonal' && <HormonalOptimizationPanel />}
        {activeTab === 'emergency' && <EmergencySupportSystem />}
        {activeTab === 'ai-suggestions' && <AISuggestionsSection predictedAIR={1250} />}
        {activeTab === 'schedule' && <SmartStudyPlanner />}
        {activeTab === 'memory' && <MemoryRetentionSystem />}
        {activeTab === 'progress' && <ProgressAnalytics />}
        {activeTab === 'competitive' && <CompetitiveEdgeSystem />}
      </div>
    </DashboardLayout>
  )
}