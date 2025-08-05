'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Target, TrendingUp, BarChart3, Activity } from 'lucide-react';
import PredictorCard from '@/components/PredictorCard';
import InteractiveCharts from '@/components/InteractiveCharts';
import AnalysisDashboard from '@/components/AnalysisDashboard';

export default function PredictorPage() {
  const router = useRouter();
  const [predictorData, setPredictorData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictorData();
  }, []);

  const fetchPredictorData = async () => {
    try {
      const response = await fetch('/api/predictor');
      const data = await response.json();
      setPredictorData(data);
    } catch (error) {
      console.error('Error fetching predictor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full shadow-glow"
        />
      </div>
    );
  }

  if (!predictorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Data Available</h2>
          <p className="text-gray-400 mb-6">Start studying and tracking your progress to see predictions.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse-glow">
                  NEET Success Predictor
                </h1>
                <p className="text-gray-300">AI-powered analysis of Divyani's NEET preparation</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Predictor Analysis */}
        <PredictorCard data={predictorData} />
        
        {/* Interactive Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Interactive Analytics</h2>
          </div>
          <InteractiveCharts data={predictorData} />
        </motion.div>
        
        {/* Detailed Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">Study Consistency</h3>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-2">{predictorData.consistencyScore}%</div>
            <p className="text-gray-400 text-sm">Last 30 days performance</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${predictorData.consistencyScore}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Chapter Progress</h3>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2">{predictorData.progressPercentage}%</div>
            <p className="text-gray-400 text-sm">Overall completion rate</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${predictorData.progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Error Management</h3>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-2">{predictorData.errorFixRate}%</div>
            <p className="text-gray-400 text-sm">Mistakes resolved rate</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${predictorData.errorFixRate}%` }}
              />
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="w-6 h-6 text-orange-400" />
              <h3 className="text-lg font-bold text-white">Performance Trend</h3>
            </div>
            <div className="text-2xl font-bold text-orange-400 mb-2">
              {predictorData.performanceTrend === 'improving' ? '📈 Up' :
               predictorData.performanceTrend === 'declining' ? '📉 Down' : '➡️ Stable'}
            </div>
            <p className="text-gray-400 text-sm">Recent test performance</p>
            <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
              predictorData.performanceTrend === 'improving' ? 'bg-green-500/20 text-green-400' :
              predictorData.performanceTrend === 'declining' ? 'bg-red-500/20 text-red-400' :
              'bg-yellow-500/20 text-yellow-400'
            }`}>
              {predictorData.performanceTrend.charAt(0).toUpperCase() + predictorData.performanceTrend.slice(1)}
            </div>
          </div>
        </motion.div>
        
        {/* Comprehensive Analysis Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Comprehensive Analysis</h2>
          </div>
          <AnalysisDashboard data={predictorData} />
        </motion.div>
      </div>
    </div>
  );
}