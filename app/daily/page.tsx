'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Target, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DailyTracker from '@/components/DailyTracker';
import WeeklyStreak from '@/components/WeeklyStreak';
import InspirationBanner from '@/components/InspirationBanner';
import CountdownTimer from '@/components/CountdownTimer';

export default function DailyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse-glow">
                  Daily Dashboard
                </h1>
                <p className="text-gray-300">Divyani's NEET UG 2026 Preparation</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="w-5 h-5 text-red-400" />
                <span className="text-lg font-bold text-white">AIIMS Delhi</span>
              </div>
              <p className="text-sm text-gray-400">Target College</p>
            </div>
          </div>
        </motion.div>

        {/* Top Section - Inspiration & Countdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <InspirationBanner />
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CountdownTimer />
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Tracker - Takes 2 columns */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <DailyTracker />
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Weekly Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <WeeklyStreak />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Quick Stats</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Study Plan</span>
                  <span className="text-white font-medium">14 hrs/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Target Questions</span>
                  <span className="text-white font-medium">550+/day</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Preparation Year</span>
                  <span className="text-white font-medium">3rd Dropper</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Exam Date</span>
                  <span className="text-white font-medium">May 3, 2026</span>
                </div>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
            >
              <h3 className="text-lg font-bold text-white mb-4">Quick Access</h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/tests')}
                  className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white"
                >
                  📊 Test Performance
                </button>
                <button
                  onClick={() => router.push('/predictor')}
                  className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white"
                >
                  🎯 NEET Predictor
                </button>
                <button
                  onClick={() => router.push('/subject/physics')}
                  className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white"
                >
                  📚 Subject Progress
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}