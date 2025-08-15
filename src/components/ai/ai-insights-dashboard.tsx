'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAIInsights } from '@/hooks/use-ai-insights';
import { Brain, Calendar, Target, TrendingUp, Loader2, AlertCircle } from 'lucide-react';

export function AIInsightsDashboard() {
  const {
    insights,
    schedule,
    motivationalMessage,
    weakAreaFocus,
    loading,
    error,
    generateInsights,
    clearError,
  } = useAIInsights();

  const [activeTab, setActiveTab] = useState<'insights' | 'schedule' | 'motivation' | 'weak-areas'>('insights');

  const handleGenerateInsights = async (type: 'study-insights' | 'optimal-schedule' | 'motivational-boost' | 'weak-area-focus') => {
    clearError();
    await generateInsights(type);
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getConsistencyColor = (consistency: 'high' | 'medium' | 'low') => {
    switch (consistency) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-blue-400" />
          AI Study Insights
        </h1>
        <p className="text-gray-400">
          Get personalized recommendations powered by AI to optimize your NEET preparation
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={activeTab === 'insights' ? 'default' : 'outline'}
          onClick={() => setActiveTab('insights')}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Study Insights
        </Button>
        <Button
          variant={activeTab === 'schedule' ? 'default' : 'outline'}
          onClick={() => setActiveTab('schedule')}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Optimal Schedule
        </Button>
        <Button
          variant={activeTab === 'motivation' ? 'default' : 'outline'}
          onClick={() => setActiveTab('motivation')}
          className="flex items-center gap-2"
        >
          <Target className="h-4 w-4" />
          Motivation Boost
        </Button>
        <Button
          variant={activeTab === 'weak-areas' ? 'default' : 'outline'}
          onClick={() => setActiveTab('weak-areas')}
          className="flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4" />
          Weak Areas
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content based on active tab */}
      {activeTab === 'insights' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Study Pattern Analysis
              <Button
                onClick={() => handleGenerateInsights('study-insights')}
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Generate Insights'
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              AI-powered analysis of your study patterns and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {insights ? (
              <>
                {/* Overall Assessment */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Overall Assessment</h3>
                  <p className="text-gray-300">{insights.overallAssessment}</p>
                </div>

                {/* Subject Analysis */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Subject Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-green-400 font-medium">Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        {insights.subjectAnalysis.strengths.map((subject, index) => (
                          <Badge key={index} className="bg-green-500/20 text-green-400">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-red-400 font-medium">Areas for Improvement</h4>
                      <div className="flex flex-wrap gap-2">
                        {insights.subjectAnalysis.weaknesses.map((subject, index) => (
                          <Badge key={index} className="bg-red-500/20 text-red-400">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{insights.subjectAnalysis.details}</p>
                </div>

                {/* Study Patterns */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Study Patterns</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Consistency</p>
                      <p className={`font-semibold ${getConsistencyColor(insights.studyPatterns.consistency)}`}>
                        {insights.studyPatterns.consistency.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Question Volume</p>
                      <p className={`font-semibold ${
                        insights.studyPatterns.questionVolume === 'above_target' ? 'text-green-400' :
                        insights.studyPatterns.questionVolume === 'on_target' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {insights.studyPatterns.questionVolume.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Revision Quality</p>
                      <p className={`font-semibold ${
                        insights.studyPatterns.revisionQuality === 'excellent' ? 'text-green-400' :
                        insights.studyPatterns.revisionQuality === 'good' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {insights.studyPatterns.revisionQuality.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{insights.studyPatterns.insights}</p>
                </div>

                {/* Recommendations */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Recommendations</h3>
                  <div className="space-y-3">
                    {insights.recommendations.map((rec, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-white">{rec.action}</h4>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-1">
                          <strong>Timeframe:</strong> {rec.timeframe}
                        </p>
                        <p className="text-sm text-gray-300">{rec.expectedImpact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Motivational Message</h3>
                  <p className="text-gray-300">{insights.motivationalMessage}</p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Click "Generate Insights" to get AI-powered study analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'schedule' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Optimal Study Schedule
              <Button
                onClick={() => handleGenerateInsights('optimal-schedule')}
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Generate Schedule'
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Personalized daily and weekly study schedule based on your progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {schedule ? (
              <div className="space-y-6">
                {/* Daily Schedule */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Daily Schedule</h3>
                  <div className="space-y-2">
                    {schedule.dailySchedule.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="text-blue-400 font-mono text-sm">{slot.timeSlot}</span>
                          <span className="text-white">{slot.activity}</span>
                          <Badge variant="outline" className="text-xs">
                            {slot.subject}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={
                            slot.focus === 'theory' ? 'bg-blue-500/20 text-blue-400' :
                            slot.focus === 'practice' ? 'bg-green-500/20 text-green-400' :
                            slot.focus === 'revision' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-purple-500/20 text-purple-400'
                          }>
                            {slot.focus}
                          </Badge>
                          <span className="text-gray-400 text-sm">{slot.duration}m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Focus */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Weekly Focus</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(schedule.weeklyFocus).map(([day, focus]) => (
                      <div key={day} className="text-center p-3 bg-gray-700/30 rounded-lg">
                        <p className="text-sm text-gray-400 capitalize">{day}</p>
                        <p className="text-white font-medium">{focus}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Adjustments */}
                {schedule.priorityAdjustments.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Priority Adjustments</h3>
                    <div className="space-y-2">
                      {schedule.priorityAdjustments.map((adj, index) => (
                        <div key={index} className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                          <h4 className="font-medium text-yellow-400">{adj.subject}</h4>
                          <p className="text-sm text-gray-300 mb-1">{adj.reason}</p>
                          <p className="text-sm text-white">{adj.adjustment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {schedule.tips.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Study Tips</h3>
                    <ul className="space-y-2">
                      {schedule.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span className="text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Click "Generate Schedule" to get your personalized study plan</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'motivation' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Motivational Boost
              <Button
                onClick={() => handleGenerateInsights('motivational-boost')}
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Get Motivation'
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Personalized encouragement based on your recent achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {motivationalMessage ? (
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-lg p-6">
                <div className="text-center">
                  <Target className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-lg text-white leading-relaxed">{motivationalMessage}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Click "Get Motivation" for a personalized boost</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'weak-areas' && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Weak Area Focus Plan
              <Button
                onClick={() => handleGenerateInsights('weak-area-focus')}
                disabled={loading}
                size="sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Analyze Weak Areas'
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              Targeted improvement plan for your weakest subjects and chapters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weakAreaFocus ? (
              <div className="space-y-6">
                {/* Risk Assessment */}
                <div className="text-center p-4 rounded-lg border" style={{
                  backgroundColor: weakAreaFocus.riskAssessment === 'high' ? 'rgba(239, 68, 68, 0.1)' :
                                   weakAreaFocus.riskAssessment === 'medium' ? 'rgba(245, 158, 11, 0.1)' :
                                   'rgba(34, 197, 94, 0.1)',
                  borderColor: weakAreaFocus.riskAssessment === 'high' ? 'rgba(239, 68, 68, 0.3)' :
                               weakAreaFocus.riskAssessment === 'medium' ? 'rgba(245, 158, 11, 0.3)' :
                               'rgba(34, 197, 94, 0.3)'
                }}>
                  <h3 className="text-lg font-semibold text-white mb-2">Risk Assessment</h3>
                  <Badge className={
                    weakAreaFocus.riskAssessment === 'high' ? 'bg-red-500' :
                    weakAreaFocus.riskAssessment === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }>
                    {weakAreaFocus.riskAssessment.toUpperCase()} RISK
                  </Badge>
                </div>

                {/* Urgent Actions */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Urgent Actions Required</h3>
                  <div className="space-y-3">
                    {weakAreaFocus.urgentActions
                      .sort((a, b) => a.priority - b.priority)
                      .map((action, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-white">{action.subject} - {action.chapter}</h4>
                            <Badge className="mt-1 text-xs" style={{
                              backgroundColor: action.priority <= 2 ? 'rgba(239, 68, 68, 0.2)' :
                                             action.priority <= 3 ? 'rgba(245, 158, 11, 0.2)' :
                                             'rgba(34, 197, 94, 0.2)',
                              color: action.priority <= 2 ? '#ef4444' :
                                     action.priority <= 3 ? '#f59e0b' :
                                     '#22c55e'
                            }}>
                              Priority {action.priority}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {action.issue.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-2">{action.action}</p>
                        <p className="text-sm text-gray-400">
                          <strong>Time Required:</strong> {action.timeRequired}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weekly Targets */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Weekly Targets</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <p className="text-2xl font-bold text-blue-400">{weakAreaFocus.weeklyTargets.lectureCompletion}</p>
                      <p className="text-sm text-gray-400">Lectures to Complete</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <p className="text-2xl font-bold text-green-400">{weakAreaFocus.weeklyTargets.questionsToSolve}</p>
                      <p className="text-sm text-gray-400">Questions to Solve</p>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <p className="text-2xl font-bold text-yellow-400">{weakAreaFocus.weeklyTargets.chaptersToRevise}</p>
                      <p className="text-sm text-gray-400">Chapters to Revise</p>
                    </div>
                  </div>
                </div>

                {/* Recovery Strategy */}
                <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Recovery Strategy</h3>
                  <p className="text-gray-300">{weakAreaFocus.recoveryStrategy}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Click "Analyze Weak Areas" to get targeted improvement recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}