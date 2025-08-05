'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Target, Flame, CheckCircle, Clock, Brain, TrendingUp } from 'lucide-react';

interface DailyDashboardProps {
  onUpdate?: () => void;
}

export default function DailyDashboard({ onUpdate }: DailyDashboardProps) {
  const [todayPlan, setTodayPlan] = useState<any>(null);
  const [todayLog, setTodayLog] = useState<any>(null);
  const [streak, setStreak] = useState<any>({ current_streak: 0, longest_streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const [planRes, logRes, streakRes] = await Promise.all([
        fetch('/api/study-plan/today'),
        fetch('/api/daily-log/today'),
        fetch('/api/streak')
      ]);

      const [plan, log, streakData] = await Promise.all([
        planRes.json(),
        logRes.json(),
        streakRes.json()
      ]);

      setTodayPlan(plan);
      setTodayLog(log);
      setStreak(streakData);
    } catch (error) {
      console.error('Error fetching today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTodayLog = async (updates: any) => {
    try {
      const response = await fetch('/api/daily-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...todayLog,
          ...updates,
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        const updated = await response.json();
        setTodayLog(updated);
        onUpdate?.();
      }
    } catch (error) {
      console.error('Error updating daily log:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = (todayLog?.phy_qs || 0) + (todayLog?.chem_qs || 0) + 
                       (todayLog?.bot_qs || 0) + (todayLog?.zoo_qs || 0);
  const isFireDay = totalQuestions >= 250;
  const progressPercentage = todayPlan?.target_questions ? 
    Math.min((totalQuestions / todayPlan.target_questions) * 100, 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Today's Focus</h2>
            <p className="text-gray-400 text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Streak Display */}
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <Flame className={`w-5 h-5 ${streak.current_streak > 0 ? 'text-orange-400' : 'text-gray-500'}`} />
              <span className="text-2xl font-bold text-white">{streak.current_streak}</span>
            </div>
            <p className="text-xs text-gray-400">Day Streak</p>
          </div>

          {/* Fire Day Indicator */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isFireDay ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-400'
          }`}>
            {isFireDay ? '🔥 FIRE DAY!' : 'Regular Day'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Daily Progress</span>
          <span className="text-white font-medium">
            {totalQuestions}/{todayPlan?.target_questions || 400} questions
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Total till date: {todayLog?.total_lifetime_questions || 0} questions
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className={`h-3 rounded-full ${
              isFireDay ? 'bg-gradient-to-r from-orange-500 to-red-500' : 
              'bg-gradient-to-r from-blue-500 to-purple-500'
            } shadow-glow`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {Math.round(progressPercentage)}% complete
        </p>
      </div>

      {/* Today's Plan */}
      {todayPlan && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2 text-blue-400" />
            Today's Study Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400">Morning Focus</div>
              <div className="text-white font-medium">{todayPlan.morning_focus || 'Not set'}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400">Afternoon Focus</div>
              <div className="text-white font-medium">{todayPlan.afternoon_focus || 'Not set'}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-sm text-gray-400">Evening Focus</div>
              <div className="text-white font-medium">{todayPlan.evening_focus || 'Not set'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { subject: 'Physics', key: 'phy_qs', color: 'blue', emoji: '⚡' },
          { subject: 'Chemistry', key: 'chem_qs', color: 'green', emoji: '🧪' },
          { subject: 'Botany', key: 'bot_qs', color: 'emerald', emoji: '🌱' },
          { subject: 'Zoology', key: 'zoo_qs', color: 'purple', emoji: '🦋' }
        ].map(({ subject, key, color, emoji }) => (
          <div key={subject} className="bg-gray-700 rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="text-2xl font-bold text-white mb-1">
              {todayLog?.[key] || 0}
            </div>
            <div className="text-xs text-gray-400">{subject}</div>
            <button
              onClick={() => updateTodayLog({ 
                [key]: (todayLog?.[key] || 0) + 10 
              })}
              className={`mt-2 px-2 py-1 bg-${color}-500 text-white rounded text-xs hover:bg-${color}-600 transition-colors`}
            >
              +10
            </button>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => updateTodayLog({ revision_done: !todayLog?.revision_done })}
          className={`p-3 rounded-lg text-sm font-medium transition-all ${
            todayLog?.revision_done 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <CheckCircle className="w-4 h-4 mx-auto mb-1" />
          Revision
        </button>

        <button
          onClick={() => updateTodayLog({ 
            errors_fixed: (todayLog?.errors_fixed || 0) + 1 
          })}
          className="p-3 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
        >
          <Brain className="w-4 h-4 mx-auto mb-1" />
          Fix Error ({todayLog?.errors_fixed || 0})
        </button>

        <button
          onClick={() => window.location.href = '/tests'}
          className="p-3 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
        >
          <TrendingUp className="w-4 h-4 mx-auto mb-1" />
          Take Test
        </button>

        <button
          onClick={() => window.location.href = '/predictor'}
          className="p-3 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
        >
          <Target className="w-4 h-4 mx-auto mb-1" />
          Check Progress
        </button>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
        <p className="text-center text-white font-medium">
          {isFireDay 
            ? "🔥 Amazing! You're having a FIRE DAY! Keep this momentum going!" 
            : totalQuestions > 100 
              ? "💪 Great progress! Push a little more to make it a fire day!" 
              : "🌟 Every question counts! Start strong and build momentum!"}
        </p>
      </div>
    </motion.div>
  );
}