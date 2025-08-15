'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/dashboard-layout'
import TestEntryForm from '@/components/tests/test-entry-form'
import TestPerformanceChart from '@/components/tests/test-performance-chart'
import TestAnalytics from '@/components/tests/test-analytics'
import RecentTestsList from '@/components/tests/recent-tests-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function TestsPage() {
  const [activeTab, setActiveTab] = useState<'entry' | 'analytics'>('entry')

  return (
    <DashboardLayout 
      title="Test Performance"
      subtitle="Track your test scores and analyze performance trends"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-background-secondary/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('entry')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'entry'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Test Score</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:text-white hover:bg-background-secondary'
            }`}
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>Performance Analytics</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'entry' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <TestEntryForm />
            </div>
            <div>
              <Card className="glass-effect border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium text-white">Weekly Tests:</span> Regular practice tests to assess weekly progress
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium text-white">Rank Booster:</span> Targeted tests for specific topics
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium text-white">Test Series:</span> Comprehensive subject-wise tests
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium text-white">AITS:</span> All India Test Series for national ranking
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <p className="text-gray-300 text-sm">
                          <span className="font-medium text-white">Full Length:</span> Complete NEET mock tests (720 marks)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="text-white font-medium mb-2">Performance Indicators</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">😢</span>
                        <span className="text-gray-400">&lt; 75%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">😟</span>
                        <span className="text-gray-400">75-85%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">😊</span>
                        <span className="text-gray-400">85-95%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">😘</span>
                        <span className="text-gray-400">&gt; 95%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <TestAnalytics />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TestPerformanceChart />
              <RecentTestsList />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}