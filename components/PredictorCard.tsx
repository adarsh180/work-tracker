'use client';

import { motion } from 'framer-motion';
import { Target, TrendingUp, Award, AlertTriangle, CheckCircle, Flame, Brain } from 'lucide-react';

interface PredictorData {
  totalQuestionsAttempted: number;
  averageScore: number;
  progressPercentage: number;
  daysRemaining: number;
  consistencyScore: number;
  fireDays: number;
  superFireDays: number;
  avgDailyQuestions: number;
  currentStreak: number;
  longestStreak: number;
  totalTests: number;
  recentPerformance: number;
  performanceTrend: string;
  totalErrors: number;
  fixedErrors: number;
  errorFixRate: number;
  subjectAnalysis: any;
  successProbability: number;
  rankPrediction: {
    min: number;
    max: number;
    category: string;
  };
  aiimsDelhiProbability: number;
  recommendations: string[];
  status: string;
  questionEmoji: string;
}

interface PredictorCardProps {
  data: PredictorData;
}

export default function PredictorCard({ data }: PredictorCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'from-green-500 to-emerald-600';
      case 'good': return 'from-blue-500 to-cyan-600';
      case 'average': return 'from-yellow-500 to-orange-600';
      case 'needs_improvement': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <Award className="w-6 h-6" />;
      case 'good': return <CheckCircle className="w-6 h-6" />;
      case 'average': return <TrendingUp className="w-6 h-6" />;
      case 'needs_improvement': return <AlertTriangle className="w-6 h-6" />;
      default: return <Target className="w-6 h-6" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'excellent': return 'Outstanding! AIIMS Delhi is within reach! 🏆';
      case 'good': return 'Great progress! Keep pushing for top ranks! 💪';
      case 'average': return 'Good foundation! Focus on weak areas! 📚';
      case 'needs_improvement': return 'Time to accelerate! You can do this! 🚀';
      default: return 'Keep working towards your goal! 🎯';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Success Prediction Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${getStatusColor(data.status)} rounded-xl shadow-lg p-6 text-white relative overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-8xl">
            {data.questionEmoji}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(data.status)}
              <div>
                <h3 className="text-2xl font-bold">NEET Success Predictor</h3>
                <p className="text-sm opacity-90">AI-Powered Analysis for Divyani</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-4xl font-bold">{data.successProbability}%</div>
              <p className="text-sm opacity-90">Success Probability</p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Preparation Level</span>
              <span>{data.successProbability}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <motion.div
                className="bg-white h-3 rounded-full shadow-glow"
                initial={{ width: 0 }}
                animate={{ width: `${data.successProbability}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <p className="text-center font-medium">
            {getStatusMessage(data.status)}
          </p>
        </div>
      </motion.div>

      {/* Rank Prediction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Rank Prediction</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {data.rankPrediction.category}
            </div>
            <p className="text-gray-300">Predicted NEET Rank</p>
          </div>

          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {data.aiimsDelhiProbability}%
            </div>
            <p className="text-gray-300">AIIMS Delhi Probability</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Key Performance Metrics</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {data.totalQuestionsAttempted.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">Total Questions</p>
          </div>

          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {data.consistencyScore}%
            </div>
            <p className="text-xs text-gray-400">Consistency</p>
          </div>

          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">
              {data.currentStreak}
            </div>
            <p className="text-xs text-gray-400">Current Streak</p>
          </div>

          <div className="text-center p-3 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-red-400">
              {data.fireDays}
            </div>
            <p className="text-xs text-gray-400">Fire Days</p>
          </div>
        </div>
      </motion.div>

      {/* Subject Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Subject-wise Analysis</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data.subjectAnalysis).map(([subject, analysis]: [string, any]) => {
            const completion = analysis.totalChapters > 0 ? (analysis.chapters / analysis.totalChapters) * 100 : 0;
            const subjectEmojis = {
              physics: '⚡',
              chemistry: '🧪',
              botany: '🌱',
              zoology: '🦋'
            };

            return (
              <div key={subject} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{subjectEmojis[subject as keyof typeof subjectEmojis]}</span>
                    <span className="font-semibold text-white capitalize">{subject}</span>
                  </div>
                  <span className="text-sm text-gray-400">{Math.round(completion)}%</span>
                </div>
                
                <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{analysis.questions.toLocaleString()} questions</span>
                  <span>{analysis.chapters}/{analysis.totalChapters} chapters</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Flame className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
        </div>

        <div className="space-y-3">
          {data.recommendations.length > 0 ? (
            data.recommendations.map((recommendation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
              >
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm">{recommendation}</p>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-gray-300 text-sm">Excellent! You're on track with your preparation! 🎉</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Performance Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Performance Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-cyan-400 mb-2">
              {data.avgDailyQuestions}
            </div>
            <p className="text-gray-300 text-sm">Avg Daily Questions</p>
          </div>

          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {data.errorFixRate}%
            </div>
            <p className="text-gray-300 text-sm">Error Fix Rate</p>
          </div>

          <div className="text-center p-4 bg-gray-700 rounded-lg">
            <div className={`text-2xl font-bold mb-2 ${
              data.performanceTrend === 'improving' ? 'text-green-400' :
              data.performanceTrend === 'declining' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {data.performanceTrend === 'improving' ? '📈' :
               data.performanceTrend === 'declining' ? '📉' : '➡️'}
            </div>
            <p className="text-gray-300 text-sm capitalize">{data.performanceTrend}</p>
          </div>
        </div>
      </motion.div>

      {/* Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-lg p-6 text-white text-center"
      >
        <div className="text-6xl font-bold mb-2">{data.daysRemaining}</div>
        <p className="text-xl">Days to NEET UG 2026</p>
        <p className="text-sm opacity-90 mt-2">Every day counts! Make it a fire day! 🔥</p>
      </motion.div>
    </div>
  );
}