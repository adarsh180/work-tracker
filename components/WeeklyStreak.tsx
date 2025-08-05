'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flame, TrendingUp } from 'lucide-react';

interface DailyLog {
  date: string;
  total_questions: number;
  bot_class: boolean;
  zoo_class: boolean;
  phy_class: boolean;
  chem_class: boolean;
  bot_dpp: boolean;
  zoo_dpp: boolean;
  phy_dpp: boolean;
  chem_dpp: boolean;
  revision_done: boolean;
}

export default function WeeklyStreak() {
  const [weeklyLogs, setWeeklyLogs] = useState<DailyLog[]>([]);
  const [streakData, setStreakData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchWeeklyLogs();
    fetchStreakData();
    
    // Listen for real-time updates
    const handleDataUpdate = () => {
      fetchWeeklyLogs();
      fetchStreakData();
    };
    
    const handleStreakUpdate = () => {
      fetchStreakData();
    };
    
    const handleWeeklyUpdate = () => {
      fetchWeeklyLogs();
    };
    
    window.addEventListener('dailyLogUpdate', handleDataUpdate);
    window.addEventListener('streakUpdate', handleStreakUpdate);
    window.addEventListener('weeklyDataUpdate', handleWeeklyUpdate);
    
    // Auto-refresh every 10 seconds for immediate updates
    const interval = setInterval(() => {
      fetchWeeklyLogs();
      fetchStreakData();
    }, 10000);
    
    return () => {
      window.removeEventListener('dailyLogUpdate', handleDataUpdate);
      window.removeEventListener('streakUpdate', handleStreakUpdate);
      window.removeEventListener('weeklyDataUpdate', handleWeeklyUpdate);
      clearInterval(interval);
    };
  }, []);

  const fetchWeeklyLogs = async () => {
    if (!loading) setUpdating(true);
    try {
      const response = await fetch('/api/logs?userId=1&days=7', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      setWeeklyLogs(data);
    } catch (error) {
      console.error('Error fetching weekly logs:', error);
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  };

  const fetchStreakData = async () => {
    try {
      const response = await fetch('/api/streak?userId=1', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      setStreakData(data);
    } catch (error) {
      console.error('Error fetching streak data:', error);
    }
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getProgressScore = (log: DailyLog) => {
    const classScore = (log.bot_class ? 1 : 0) + (log.zoo_class ? 1 : 0) + (log.phy_class ? 1 : 0) + (log.chem_class ? 1 : 0);
    const dppScore = (log.bot_dpp ? 1 : 0) + (log.zoo_dpp ? 1 : 0) + (log.phy_dpp ? 1 : 0) + (log.chem_dpp ? 1 : 0);
    const revisionScore = log.revision_done ? 1 : 0;
    const questionScore = Math.min(log.total_questions / 250, 1);
    
    return (classScore + dppScore + revisionScore + questionScore) / 10;
  };

  const getColorForScore = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    if (score >= 0.4) return 'bg-orange-500';
    if (score > 0) return 'bg-red-500';
    return 'bg-gray-600';
  };

  const isFireDay = (questions: number) => questions >= 250;
  const isSuperFireDay = (questions: number) => questions >= 550;

  const totalQuestions = weeklyLogs.reduce((sum, log) => sum + log.total_questions, 0);
  const avgQuestions = weeklyLogs.length > 0 ? Math.round(totalQuestions / weeklyLogs.length) : 0;
  const fireDaysThisWeek = weeklyLogs.filter(log => isFireDay(log.total_questions)).length;
  const superFireDaysThisWeek = weeklyLogs.filter(log => isSuperFireDay(log.total_questions)).length;

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="flex space-x-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">7-Day Streak</h3>
          {updating && (
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <Flame className={`w-4 h-4 ${streakData?.current_streak > 0 ? 'text-orange-400 animate-pulse' : 'text-gray-500'}`} />
              <span className={`text-lg font-bold ${streakData?.current_streak > 0 ? 'text-orange-400' : 'text-gray-400'}`}>
                {streakData?.current_streak || 0}
              </span>
            </div>
            <p className="text-xs text-gray-400">current streak</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <Flame className="w-4 h-4 text-red-500" />
              <span className="text-lg font-bold text-red-500">{fireDaysThisWeek}</span>
            </div>
            <p className="text-xs text-gray-400">fire days</p>
          </div>
          
          {superFireDaysThisWeek > 0 && (
            <div className="text-center">
              <div className="flex items-center space-x-1">
                <span className="text-lg">🚀</span>
                <span className="text-lg font-bold text-purple-400">{superFireDaysThisWeek}</span>
              </div>
              <p className="text-xs text-gray-400">super fire</p>
            </div>
          )}
          
          <div className="text-center">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-lg font-bold text-green-400">{avgQuestions}</span>
            </div>
            <p className="text-xs text-gray-400">avg/day</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between space-x-1">
        {[...Array(7)].map((_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - index));
          const dateStr = date.toISOString().split('T')[0];
          
          const log = weeklyLogs.find(l => l.date === dateStr);
          const score = log ? getProgressScore(log) : 0;
          const questions = log?.total_questions || 0;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex-1 text-center"
            >
              <div className="text-xs text-gray-400 mb-1">
                {getDayName(dateStr)}
              </div>
              
              <div
                className={`w-full h-8 rounded ${getColorForScore(score)} relative group cursor-pointer transition-all duration-200 hover:scale-110 ${
                  isSuperFireDay(questions) 
                    ? 'ring-2 ring-purple-400 shadow-xl shadow-purple-400/70 bg-gradient-to-r from-purple-500 to-pink-500'
                    : isFireDay(questions) 
                    ? 'ring-2 ring-orange-400 shadow-lg shadow-orange-400/50' 
                    : ''
                }`}
                title={`${questions} questions, ${Math.round(score * 100)}% complete${
                  isSuperFireDay(questions) ? ' - SUPER FIRE DAY! 🚀' : 
                  isFireDay(questions) ? ' - FIRE DAY! 🔥' : ''
                }`}
              >
                {isSuperFireDay(questions) && (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.4, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <div className="relative">
                      <span className="text-lg">🚀</span>
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -inset-1 bg-purple-400 rounded-full blur-sm"
                      />
                    </div>
                  </motion.div>
                )}
                
                {isFireDay(questions) && !isSuperFireDay(questions) && (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-1 -right-1"
                  >
                    <Flame className="w-4 h-4 text-orange-500" />
                  </motion.div>
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {questions} questions
                  <br />
                  {Math.round(score * 100)}% complete
                  {isSuperFireDay(questions) && (
                    <>
                      <br />
                      <span className="text-purple-400 font-bold">🚀 SUPER FIRE DAY!</span>
                    </>
                  )}
                  {isFireDay(questions) && !isSuperFireDay(questions) && (
                    <>
                      <br />
                      <span className="text-orange-400 font-bold">🔥 FIRE DAY!</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className={`text-xs mt-1 ${
                isSuperFireDay(questions) ? 'text-purple-400 font-bold' :
                isFireDay(questions) ? 'text-orange-400 font-bold' : 'text-gray-500'
              }`}>
                {questions}
                {isSuperFireDay(questions) && ' 🚀'}
                {isFireDay(questions) && !isSuperFireDay(questions) && ' 🔥'}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span>Less</span>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-600 rounded"></div>
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <div className="w-3 h-3 bg-orange-500 rounded"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <div className="w-3 h-3 bg-green-500 rounded"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}