'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, Calendar } from 'lucide-react';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_streak_date: string;
  total_fire_days: number;
}

export default function StreakDisplay() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreakData();
    
    // Listen for streak updates
    const handleStreakUpdate = () => {
      fetchStreakData();
    };
    
    const handleDailyUpdate = () => {
      // Delay to ensure database is updated
      setTimeout(() => {
        fetchStreakData();
      }, 1000);
    };
    
    window.addEventListener('streakUpdate', handleStreakUpdate);
    window.addEventListener('dailyLogUpdate', handleDailyUpdate);
    window.addEventListener('weeklyDataUpdate', handleDailyUpdate);
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchStreakData();
    }, 60000);
    
    return () => {
      window.removeEventListener('streakUpdate', handleStreakUpdate);
      window.removeEventListener('dailyLogUpdate', handleDailyUpdate);
      window.removeEventListener('weeklyDataUpdate', handleDailyUpdate);
      clearInterval(interval);
    };
  }, []);

  const fetchStreakData = async () => {
    try {
      const response = await fetch('/api/streak?userId=1');
      const data = await response.json();
      setStreakData(data);
    } catch (error) {
      console.error('Error fetching streak data:', error);
      // Set default values instead of mock data
      setStreakData({
        current_streak: 0,
        longest_streak: 0,
        last_streak_date: null,
        total_fire_days: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilNEET = () => {
    const neetDate = new Date('2026-05-03');
    const today = new Date();
    const diffTime = neetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStreakPercentage = () => {
    const daysUntilNEET = getDaysUntilNEET();
    const maxPossibleStreak = Math.min(streakData?.current_streak || 0, daysUntilNEET);
    return Math.min((maxPossibleStreak / daysUntilNEET) * 100, 100);
  };

  if (loading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-700 rounded mb-4"></div>
        <div className="h-16 bg-gray-700 rounded"></div>
      </div>
    );
  }

  const daysUntilNEET = getDaysUntilNEET();
  const streakPercentage = getStreakPercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Flame className={`w-6 h-6 ${(streakData?.current_streak || 0) > 0 ? 'text-orange-400 animate-pulse' : 'text-gray-500'}`} />
          <h3 className="text-lg font-bold text-white">Fire Streak</h3>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-400">
            {streakData?.current_streak || 0}
          </div>
          <p className="text-xs text-gray-400">days</p>
        </div>
      </div>

      {/* Streak Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Progress to NEET 2026</span>
          <span>{Math.round(streakPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full shadow-glow relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${streakPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {streakData?.current_streak > 0 && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-lg font-bold text-yellow-400">
              {streakData?.longest_streak || 0}
            </span>
          </div>
          <p className="text-xs text-gray-400">Best Streak</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-lg font-bold text-red-400">
              {streakData?.total_fire_days || 0}
            </span>
          </div>
          <p className="text-xs text-gray-400">Total Fire</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-lg font-bold text-blue-400">
              {daysUntilNEET}
            </span>
          </div>
          <p className="text-xs text-gray-400">Days Left</p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className={`mt-4 p-3 rounded-lg border transition-all duration-500 ${
        streakData?.current_streak >= 30
          ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/50'
          : streakData?.current_streak >= 7
          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40'
          : 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30'
      }`}>
        <p className={`text-sm text-center font-medium ${
          streakData?.current_streak >= 30 ? 'text-purple-300' :
          streakData?.current_streak >= 7 ? 'text-yellow-300' : 'text-orange-300'
        }`}>
          {streakData?.current_streak === 0 
            ? "Start your fire streak today! 250+ questions = 🔥, 550+ = 🚀"
            : streakData.current_streak === 1
            ? "Great start! Keep the fire burning! 🔥"
            : streakData.current_streak < 7
            ? `${streakData.current_streak} days strong! Building momentum! 🚀`
            : streakData.current_streak < 30
            ? `${streakData.current_streak} days of fire! You're unstoppable! 💪`
            : streakData.current_streak < 100
            ? `${streakData.current_streak} days streak! NEET champion in the making! 👑`
            : `${streakData.current_streak} days! You're a LEGEND! AIIMS Delhi awaits! 🏆🚀`
          }
        </p>
        
        {streakData?.current_streak >= 30 && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-2 text-center"
          >
            <span className="text-xs text-purple-200 bg-purple-600/30 px-2 py-1 rounded-full">
              🎆 LEGENDARY STREAK! 🎆
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}