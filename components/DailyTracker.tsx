'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Flame, Calendar, Target, BookOpen, Brain, Zap } from 'lucide-react';
import SuperFireCelebration from './SuperFireCelebration';

interface DailyLog {
  id?: number;
  date: string;
  bot_qs: number;
  zoo_qs: number;
  phy_qs: number;
  chem_qs: number;
  bot_class: boolean;
  zoo_class: boolean;
  phy_class: boolean;
  chem_class: boolean;
  bot_dpp: boolean;
  zoo_dpp: boolean;
  phy_dpp: boolean;
  chem_dpp: boolean;
  bot_assignment: boolean;
  zoo_assignment: boolean;
  phy_assignment: boolean;
  chem_assignment: boolean;
  revision_done: boolean;
  errors_fixed: number;
  total_questions: number;
}

export default function DailyTracker() {
  const [todayLog, setTodayLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    bot_qs: 0,
    zoo_qs: 0,
    phy_qs: 0,
    chem_qs: 0,
    bot_class: false,
    zoo_class: false,
    phy_class: false,
    chem_class: false,
    bot_dpp: false,
    zoo_dpp: false,
    phy_dpp: false,
    chem_dpp: false,
    bot_assignment: false,
    zoo_assignment: false,
    phy_assignment: false,
    chem_assignment: false,
    revision_done: false,
    errors_fixed: 0,
    total_questions: 0
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    fetchTodayLog();
  }, []);

  const fetchTodayLog = async () => {
    try {
      const response = await fetch('/api/today?userId=1', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data) {
        setTodayLog(data);
      }
    } catch (error) {
      console.error('Error fetching today log:', error);
    }
  };

  const saveLog = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          date: todayLog.date,
          botQs: todayLog.bot_qs,
          zooQs: todayLog.zoo_qs,
          phyQs: todayLog.phy_qs,
          chemQs: todayLog.chem_qs,
          botClass: todayLog.bot_class,
          zooClass: todayLog.zoo_class,
          phyClass: todayLog.phy_class,
          chemClass: todayLog.chem_class,
          botDpp: todayLog.bot_dpp,
          zooDpp: todayLog.zoo_dpp,
          phyDpp: todayLog.phy_dpp,
          chemDpp: todayLog.chem_dpp,
          botAssignment: todayLog.bot_assignment,
          zooAssignment: todayLog.zoo_assignment,
          phyAssignment: todayLog.phy_assignment,
          chemAssignment: todayLog.chem_assignment,
          revisionDone: todayLog.revision_done,
          errorsFixed: todayLog.errors_fixed
        })
      });

      if (response.ok) {
        // Update streak based on total questions (fire day if >= 250, super fire if >= 550)
        const isFireDay = totalQuestions >= 250;
        const isSuperFireDay = totalQuestions >= 550;
        
        await fetch('/api/streak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 1,
            isFireDay,
            isSuperFireDay,
            totalQuestions
          })
        });
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        
        // Show celebration for Super Fire Day
        if (isSuperFireDay && !showCelebration) {
          setShowCelebration(true);
        }
        
        // Trigger multiple update events for real-time refresh
        const updateEvents = ['streakUpdate', 'dailyLogUpdate', 'weeklyDataUpdate'];
        updateEvents.forEach(eventName => {
          window.dispatchEvent(new CustomEvent(eventName, { detail: { timestamp: Date.now() } }));
        });
        
        // Refresh today's log data immediately
        fetchTodayLog();
        
        // Force a second update after a brief delay to ensure all components refresh
        setTimeout(() => {
          updateEvents.forEach(eventName => {
            window.dispatchEvent(new CustomEvent(eventName, { detail: { timestamp: Date.now() } }));
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error saving log:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateLog = (field: keyof DailyLog, value: any) => {
    setTodayLog(prev => {
      const updated = { ...prev, [field]: value };
      updated.total_questions = updated.bot_qs + updated.zoo_qs + updated.phy_qs + updated.chem_qs;
      return updated;
    });
  };

  const totalQuestions = todayLog.bot_qs + todayLog.zoo_qs + todayLog.phy_qs + todayLog.chem_qs;
  const isFireDay = totalQuestions >= 250;
  const isSuperFireDay = totalQuestions >= 550;

  const daysToNEET = Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const subjects = [
    { 
      name: 'Botany', 
      key: 'bot', 
      color: 'from-green-500 to-green-600',
      icon: '🌱'
    },
    { 
      name: 'Zoology', 
      key: 'zoo', 
      color: 'from-emerald-500 to-emerald-600',
      icon: '🦋'
    },
    { 
      name: 'Physics', 
      key: 'phy', 
      color: 'from-blue-500 to-blue-600',
      icon: '⚡'
    },
    { 
      name: 'Chemistry', 
      key: 'chem', 
      color: 'from-purple-500 to-purple-600',
      icon: '🧪'
    }
  ];

  return (
    <>
      <SuperFireCelebration 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)} 
      />
      
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Daily Tracker</h2>
            <p className="text-gray-400">Divyani's NEET Preparation</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-5 h-5 text-red-400" />
            <span className="text-2xl font-bold text-red-400">{daysToNEET}</span>
          </div>
          <p className="text-sm text-gray-400">days to NEET UG 2026</p>
        </div>
      </div>

      {/* Questions Counter */}
      <div className="mb-6">
        <div className={`flex items-center justify-center space-x-3 p-4 rounded-lg transition-all duration-500 ${
          isSuperFireDay 
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 shadow-2xl shadow-purple-500/50 animate-pulse'
            : isFireDay 
            ? 'bg-gradient-to-r from-orange-600 to-red-600 shadow-lg shadow-orange-500/50'
            : 'bg-gray-700'
        }`}>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-3xl font-bold text-white">{totalQuestions}</span>
              {isSuperFireDay && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-4xl">🚀</span>
                </motion.div>
              )}
              {isFireDay && !isSuperFireDay && <Flame className="w-8 h-8 text-orange-500 animate-pulse" />}
            </div>
            <p className="text-sm text-gray-200">Total Questions Today</p>
            
            {isSuperFireDay && (
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="mt-3 space-y-2"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold rounded-full flex items-center justify-center space-x-2">
                  <span className="text-lg">🏆</span>
                  <span>SUPER FIRE DAY! UNSTOPPABLE!</span>
                  <span className="text-lg">🚀</span>
                </div>
                <p className="text-xs text-yellow-200 animate-pulse">
                  You're absolutely crushing it! AIIMS Delhi is getting closer! 💪
                </p>
              </motion.div>
            )}
            
            {isFireDay && !isSuperFireDay && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mt-2 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center space-x-1"
              >
                <Flame className="w-3 h-3" />
                <span>FIRE DAY! 🔥</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {subjects.map((subject) => (
          <motion.div
            key={subject.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl">{subject.icon}</span>
              <h3 className="font-semibold text-white">{subject.name}</h3>
            </div>

            {/* Questions Input */}
            <div className="mb-3">
              <label className="block text-xs text-gray-400 mb-1">Questions</label>
              <input
                type="number"
                value={todayLog[`${subject.key}_qs` as keyof DailyLog] as number}
                onChange={(e) => updateLog(`${subject.key}_qs` as keyof DailyLog, parseInt(e.target.value) || 0)}
                className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              {['class', 'dpp', 'assignment'].map((type) => {
                const field = `${subject.key}_${type}` as keyof DailyLog;
                const isChecked = todayLog[field] as boolean;
                
                return (
                  <button
                    key={type}
                    onClick={() => updateLog(field, !isChecked)}
                    className="flex items-center space-x-2 w-full text-left hover:bg-gray-600 p-1 rounded transition-colors"
                  >
                    {isChecked ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-sm capitalize ${isChecked ? 'text-green-400' : 'text-gray-300'}`}>
                      {type === 'dpp' ? 'DPP' : type}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Trackers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-white">Revision</h3>
          </div>
          <button
            onClick={() => updateLog('revision_done', !todayLog.revision_done)}
            className="flex items-center space-x-2 hover:bg-gray-600 p-2 rounded transition-colors w-full"
          >
            {todayLog.revision_done ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            <span className={`${todayLog.revision_done ? 'text-green-400' : 'text-gray-300'}`}>
              Daily Revision Complete
            </span>
          </button>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-white">Errors Fixed</h3>
          </div>
          <input
            type="number"
            value={todayLog.errors_fixed}
            onChange={(e) => updateLog('errors_fixed', parseInt(e.target.value) || 0)}
            className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white focus:ring-2 focus:ring-yellow-500"
            placeholder="0"
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveLog}
        disabled={saving}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          saveSuccess
            ? 'bg-green-500 text-white shadow-glow'
            : saving
            ? 'bg-gray-600 text-gray-300'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow hover:shadow-lg'
        }`}
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Saving...</span>
          </>
        ) : saveSuccess ? (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Saved Successfully!</span>
          </>
        ) : (
          <>
            <BookOpen className="w-5 h-5" />
            <span>Save Today's Progress</span>
          </>
        )}
      </button>
    </div>
    </>
  );
}