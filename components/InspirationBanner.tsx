'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Target, Heart, Zap } from 'lucide-react';

const inspirationalQuotes = [
  {
    text: "Every question you solve today brings you closer to AIIMS Delhi! 🏥",
    author: "Your Future Self",
    icon: Target,
    color: "from-blue-500 to-blue-600"
  },
  {
    text: "Divyani, your dedication today shapes your tomorrow as a doctor! 👩‍⚕️",
    author: "Motivation",
    icon: Heart,
    color: "from-pink-500 to-pink-600"
  },
  {
    text: "550+ questions = 🔥 Fire Day! You're building unstoppable momentum!",
    author: "Progress Tracker",
    icon: Zap,
    color: "from-orange-500 to-orange-600"
  },
  {
    text: "Third time's the charm! Your persistence will pay off in NEET 2026! ⭐",
    author: "Belief System",
    icon: Star,
    color: "from-purple-500 to-purple-600"
  },
  {
    text: "Each DPP, each assignment, each revision - they're all stepping stones to AIIMS! 🎯",
    author: "Success Mindset",
    icon: Target,
    color: "from-green-500 to-green-600"
  }
];

const goalReminders = [
  "🎯 Target: AIIMS Delhi",
  "📅 NEET UG 2026",
  "🔥 Daily Goal: 550+ Questions",
  "📚 14-Hour Study Plan",
  "💪 Third Year, Final Push!"
];

export default function InspirationBanner() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentGoal, setCurrentGoal] = useState(0);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 8000);

    const goalInterval = setInterval(() => {
      setCurrentGoal((prev) => (prev + 1) % goalReminders.length);
    }, 4000);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(goalInterval);
    };
  }, []);

  const quote = inspirationalQuotes[currentQuote];
  const IconComponent = quote.icon;

  return (
    <div className="space-y-4">
      {/* Main Inspiration Quote */}
      <motion.div
        key={currentQuote}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-gradient-to-r ${quote.color} rounded-xl shadow-lg p-6 text-white relative overflow-hidden`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4">
            <IconComponent className="w-24 h-24" />
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start space-x-3">
            <IconComponent className="w-6 h-6 mt-1 animate-pulse" />
            <div className="flex-1">
              <motion.p 
                className="text-lg font-medium leading-relaxed mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {quote.text}
              </motion.p>
              <motion.p 
                className="text-sm opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                — {quote.author}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Animated dots indicator */}
        <div className="absolute bottom-3 left-6 flex space-x-1">
          {inspirationalQuotes.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentQuote ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Goal Reminder Ticker */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-hidden">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-400">GOAL REMINDER</span>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <motion.div
              key={currentGoal}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="text-white font-medium"
            >
              {goalReminders[currentGoal]}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}