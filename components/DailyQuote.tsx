'use client';

import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

interface DailyQuoteProps {
  quote: string;
  onRefresh: () => void;
}

export default function DailyQuote({ quote, onRefresh }: DailyQuoteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Quote className="w-6 h-6" />
            <h2 className="text-xl font-bold">Daily Motivation</h2>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
        
        <motion.p
          key={quote}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-lg font-medium leading-relaxed italic"
        >
          "{quote}"
        </motion.p>
        
        <div className="mt-4 text-right">
          <span className="text-sm opacity-80">- AI Motivational Coach</span>
        </div>
      </div>
    </motion.div>
  );
}