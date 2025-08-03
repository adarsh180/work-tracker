'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3, PieChart, TrendingUp, Clock, Target, BookOpen, Sparkles, Brain } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import DailyQuote from '@/components/DailyQuote';
import SubjectOverview from '@/components/SubjectOverview';
import TestOverviewCard from '@/components/TestOverviewCard';
import PredictorCard from '@/components/PredictorCard';
import StudyChart from '@/components/StudyChart';
import AIFeedbackPanel from '@/components/AIFeedbackPanel';

import { DashboardData, AIFeedback } from '@/types';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AIFeedback[]>([]);
  const [dailyQuote, setDailyQuote] = useState<string>('');
  const [tests, setTests] = useState<any[]>([]);
  const [predictorData, setPredictorData] = useState<any>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [analyticsRes, feedbackRes, quoteRes, testsRes, predictorRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/ai-feedback'),
        fetch('/api/daily-quote'),
        fetch('/api/tests'),
        fetch('/api/predictor')
      ]);
      
      const analytics = await analyticsRes.json();
      const feedback = await feedbackRes.json();
      const quote = await quoteRes.json();
      const testsData = await testsRes.json();
      const predictor = await predictorRes.json();
      
      setDashboardData(analytics);
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
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse-glow">Misti!</span>
              </h1>
              <p className="text-gray-300">Track your NEET preparation journey with AI-powered insights</p>
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
              <h2 className="text-2xl font-bold text-white mb-6">Test Overview</h2>
              <TestOverviewCard 
                totalTests={Array.isArray(tests) ? tests.length : 0}
                averageScore={Array.isArray(tests) && tests.length > 0 ? tests.reduce((sum, t) => sum + (t.score / t.max_score) * 100, 0) / tests.length : 0}
                bestScore={Array.isArray(tests) && tests.length > 0 ? Math.max(...tests.map(t => (t.score / t.max_score) * 100)) : 0}
                recentTests={Array.isArray(tests) ? tests.slice(0, 5) : []}
              />
            </motion.div>
            
            {predictorData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">NEET Predictor</h2>
                <PredictorCard 
                  totalQuestions={predictorData.totalQuestionsAttempted}
                  progressPercentage={predictorData.progressPercentage}
                  emoji={predictorData.questionEmoji}
                  daysRemaining={predictorData.daysRemaining}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Charts and AI Feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Study Analytics</h2>
                <div className="flex space-x-2">
                  {[
                    { type: 'line' as const, icon: TrendingUp, label: 'Trend' },
                    { type: 'bar' as const, icon: BarChart3, label: 'Daily' },
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
              <StudyChart data={dashboardData.subjectProgress} type={chartType} />
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