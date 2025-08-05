'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3, PieChart, TrendingUp, Clock, Target, BookOpen, Sparkles, Brain } from 'lucide-react';
import DailyDashboard from '@/components/DailyDashboard';
import CountdownTimer from '@/components/CountdownTimer';
import DailyQuote from '@/components/DailyQuote';
import SubjectOverview from '@/components/SubjectOverview';
import TestOverviewCard from '@/components/TestOverviewCard';
import PredictorCard from '@/components/PredictorCard';
import StudyChart from '@/components/StudyChart';
import AIFeedbackPanel from '@/components/AIFeedbackPanel';
import CalendarCard from '@/components/CalendarCard';
import StreakDisplay from '@/components/StreakDisplay';

import { DashboardData, AIFeedback } from '@/types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback[]>([]);
  const [dailyQuote, setDailyQuote] = useState<string>('');
  const [tests, setTests] = useState<any[]>([]);
  const [predictorData, setPredictorData] = useState<any>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [dailyChartType, setDailyChartType] = useState<'line' | 'bar'>('line');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [analyticsRes, feedbackRes, quoteRes, testsRes, predictorRes, dailyLogsRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/ai-feedback'),
        fetch('/api/daily-quote'),
        fetch('/api/tests'),
        fetch('/api/predictor'),
        fetch('/api/daily-log?days=7')
      ]);
      
      const analytics = await analyticsRes.json();
      const feedback = await feedbackRes.json();
      const quote = await quoteRes.json();
      const testsData = await testsRes.json();
      const predictor = await predictorRes.json();
      const dailyLogs = await dailyLogsRes.json();
      
      setDashboardData({
        ...analytics,
        dailyLogs
      });
      setAiFeedback(feedback);
      setDailyQuote(quote.quote);
      setTests(testsData);
      setPredictorData(predictor);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshQuote = async () => {
    try {
      const response = await fetch('/api/daily-quote', { method: 'POST' });
      const data = await response.json();
      setDailyQuote(data.quote);
    } catch (error) {
      console.error('Error refreshing quote:', error);
    }
  };

  const generateAIFeedback = async () => {
    try {
      await fetch('/api/ai-feedback', { method: 'POST' });
      fetchData();
    } catch (error) {
      console.error('Error generating AI feedback:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const handleStorageChange = () => {
      fetchData();
    };
    
    const handleChapterUpdate = () => {
      fetchData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    window.addEventListener('chapterUpdate', handleChapterUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
      window.removeEventListener('chapterUpdate', handleChapterUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full shadow-glow"
        />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Welcome to Your NEET Prep Dashboard!</h2>
          <p className="text-gray-300 mb-6">Start tracking your NEET preparation journey.</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse-glow">Divyani!</span>
              </h1>
              <p className="text-gray-300">Track your NEET preparation journey with AI-powered insights</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.href = '/daily'}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-glow hover:shadow-lg"
              >
                <span>📅</span>
                <span>Daily Tracker</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/error-log'}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-glow hover:shadow-lg"
              >
                <span>⚠️</span>
                <span>Error Log</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Countdown and Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-glow">
            <CountdownTimer />
          </div>
          <div className="animate-pulse-glow">
            <DailyQuote quote={dailyQuote} onRefresh={refreshQuote} />
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Subjects Covered</p>
                <p className="text-3xl font-bold text-white">4</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subject, Test, and Predictor Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Subject Progress Overview</h2>
              <SubjectOverview subjects={dashboardData.subjectProgress} />
            </motion.div>
          </div>
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Study Calendar</h2>
              <CalendarCard />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Test Overview</h2>
              <TestOverviewCard 
                totalTests={Array.isArray(tests) ? tests.length : 0}
                averageScore={Array.isArray(tests) && tests.length > 0 ? tests.reduce((sum, t) => sum + (t.score / t.max_score) * 100, 0) / tests.length : 0}
                bestScore={Array.isArray(tests) && tests.length > 0 ? Math.max(...tests.map(t => (t.score / t.max_score) * 100)) : 0}
                recentTests={Array.isArray(tests) ? tests.slice(0, 5) : []}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Fire Streak</h2>
              <StreakDisplay />
            </motion.div>
            
            {predictorData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="cursor-pointer"
                onClick={() => window.location.href = '/predictor'}
              >
                <h2 className="text-2xl font-bold text-white mb-6">NEET Success Predictor</h2>
                <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{predictorData.questionEmoji}</span>
                      <div>
                        <h3 className="text-lg font-bold text-white">Success Probability</h3>
                        <p className="text-gray-400 text-sm">AI-Powered Analysis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">{predictorData.successProbability}%</div>
                      <p className="text-xs text-gray-400">NEET Success</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Preparation Level</span>
                      <span>{predictorData.successProbability}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${predictorData.successProbability}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="text-lg font-bold text-blue-400">{predictorData.rankPrediction?.category || 'Calculating...'}</div>
                      <p className="text-xs text-gray-400">Predicted Rank</p>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="text-lg font-bold text-pink-400">{predictorData.aiimsDelhiProbability}%</div>
                      <p className="text-xs text-gray-400">AIIMS Delhi</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <span className="text-xs text-gray-500">Click to view detailed analysis</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Daily Dashboard */}
        <div className="mb-8">
          <DailyDashboard onUpdate={() => fetchData()} />
        </div>

        {/* Charts and AI Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Subject Progress Charts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Subject Progress Analytics</h2>
                <div className="flex space-x-2">
                  {[
                    { type: 'line' as const, icon: TrendingUp, label: 'Trend' },
                    { type: 'bar' as const, icon: BarChart3, label: 'Progress' },
                    { type: 'pie' as const, icon: PieChart, label: 'Distribution' }
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setChartType(type)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        chartType === type
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      title={label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <StudyChart data={dashboardData.subjectProgress || []} type={chartType} />
            </motion.div>

            {/* Daily Logs Charts */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Daily Question Analytics</h2>
                <div className="flex space-x-2">
                  {[
                    { type: 'line' as const, icon: TrendingUp, label: 'Trend' },
                    { type: 'bar' as const, icon: BarChart3, label: 'Daily' }
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={`daily-${type}`}
                      onClick={() => setDailyChartType(type)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        dailyChartType === type
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-glow'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      title={label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
              <StudyChart data={dashboardData.dailyLogs || []} type={dailyChartType} />
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">AI Insights</h2>
                </div>
                <button
                  onClick={generateAIFeedback}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-glow animate-pulse"
                >
                  Get Insights
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {aiFeedback.length > 0 ? (
                  aiFeedback.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-gray-600 bg-gray-700 hover:shadow-glow transition-all duration-200"
                    >
                      <p className="text-gray-200 text-sm leading-relaxed">{item.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        {item.subject && (
                          <span className="text-xs px-2 py-1 bg-gray-600 text-gray-200 rounded-full">
                            {item.subject}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Brain className="w-12 h-12 mx-auto mb-3 text-gray-600 animate-pulse" />
                    <p className="text-gray-400">Click "Get Insights" to analyze your progress!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}