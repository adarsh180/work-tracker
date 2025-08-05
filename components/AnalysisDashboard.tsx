'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Award, AlertTriangle, CheckCircle, Target, Calendar, Brain, Zap } from 'lucide-react';

interface AnalysisDashboardProps {
  data: any;
}

export default function AnalysisDashboard({ data }: AnalysisDashboardProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-red-400" />;
      default: return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Award className="w-6 h-6 text-yellow-400" />;
      case 'good': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'average': return <Target className="w-6 h-6 text-blue-400" />;
      default: return <AlertTriangle className="w-6 h-6 text-red-400" />;
    }
  };

  const strengthsAndWeaknesses = () => {
    const metrics = [
      { name: 'Question Volume', score: Math.min((data.totalQuestionsAttempted / 50000) * 100, 100) },
      { name: 'Consistency', score: data.consistencyScore },
      { name: 'Test Performance', score: data.averageScore },
      { name: 'Chapter Progress', score: data.progressPercentage },
      { name: 'Error Management', score: data.errorFixRate },
      { name: 'Streak Maintenance', score: Math.min((data.currentStreak / 30) * 100, 100) }
    ];

    const strengths = metrics.filter(m => m.score >= 70).sort((a, b) => b.score - a.score);
    const weaknesses = metrics.filter(m => m.score < 70).sort((a, b) => a.score - b.score);

    return { strengths, weaknesses };
  };

  const { strengths, weaknesses } = strengthsAndWeaknesses();

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {getStatusIcon(data.status)}
            <div>
              <h3 className="text-xl font-bold text-white">Overall Assessment</h3>
              <p className="text-gray-400 capitalize">{data.status.replace('_', ' ')} preparation level</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{data.successProbability}%</div>
            <p className="text-gray-400 text-sm">Success Probability</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {data.rankPrediction.category}
            </div>
            <p className="text-gray-400 text-sm">Predicted Rank Range</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-pink-400 mb-1">
              {data.aiimsDelhiProbability}%
            </div>
            <p className="text-gray-400 text-sm">AIIMS Delhi Chance</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {data.daysRemaining}
            </div>
            <p className="text-gray-400 text-sm">Days Remaining</p>
          </div>
        </div>
      </motion.div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Strengths</h3>
          </div>
          
          <div className="space-y-3">
            {strengths.length > 0 ? strengths.map((strength, index) => (
              <motion.div
                key={strength.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <span className="text-green-400 font-medium">{strength.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400 font-bold">{strength.score.toFixed(1)}%</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </motion.div>
            )) : (
              <p className="text-gray-400 text-sm">Work on building your strengths by improving performance metrics.</p>
            )}
          </div>
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-bold text-white">Areas for Improvement</h3>
          </div>
          
          <div className="space-y-3">
            {weaknesses.length > 0 ? weaknesses.map((weakness, index) => (
              <motion.div
                key={weakness.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <span className="text-red-400 font-medium">{weakness.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-red-400 font-bold">{weakness.score.toFixed(1)}%</span>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
              </motion.div>
            )) : (
              <p className="text-gray-400 text-sm">Great! All your metrics are performing well. Keep up the excellent work!</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Performance Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Performance Trends</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Test Performance</span>
              {getTrendIcon(data.performanceTrend)}
            </div>
            <div className="text-xl font-bold text-white">{data.recentPerformance}%</div>
            <p className="text-gray-400 text-xs">Recent average</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Daily Questions</span>
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">{data.avgDailyQuestions}</div>
            <p className="text-gray-400 text-xs">Average per day</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Current Streak</span>
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-xl font-bold text-white">{data.currentStreak}</div>
            <p className="text-gray-400 text-xs">Days in a row</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Fire Days</span>
              <Calendar className="w-5 h-5 text-red-400" />
            </div>
            <div className="text-xl font-bold text-white">{data.fireDays}</div>
            <p className="text-gray-400 text-xs">250+ questions</p>
          </div>
        </div>
      </motion.div>

      {/* Subject Performance Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Subject Performance Comparison</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(data.subjectAnalysis).map(([subject, analysis]: [string, any]) => {
            const completion = analysis.totalChapters > 0 ? (analysis.chapters / analysis.totalChapters) * 100 : 0;
            const questionShare = (analysis.questions / data.totalQuestionsAttempted) * 100;
            
            return (
              <div key={subject} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white capitalize">{subject}</h4>
                  <span className="text-sm text-gray-400">{completion.toFixed(1)}% complete</span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Questions</span>
                    <span className="text-white">{analysis.questions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Share</span>
                    <span className="text-white">{questionShare.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Chapters</span>
                    <span className="text-white">{analysis.chapters}/{analysis.totalChapters}</span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Calendar Mood Analysis */}
      {data.calendarAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Study Mood Analysis</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">😊</div>
              <div className="text-xl font-bold text-green-400">{data.calendarAnalysis.goodDays}</div>
              <p className="text-green-300 text-sm">Good Days</p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">😐</div>
              <div className="text-xl font-bold text-yellow-400">{data.calendarAnalysis.averageDays}</div>
              <p className="text-yellow-300 text-sm">Average Days</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">😔</div>
              <div className="text-xl font-bold text-red-400">{data.calendarAnalysis.badDays}</div>
              <p className="text-red-300 text-sm">Challenging Days</p>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-xl font-bold text-purple-400">{data.calendarAnalysis.moodScore.toFixed(1)}%</div>
              <p className="text-purple-300 text-sm">Mood Score</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}