'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Target, ChevronRight } from 'lucide-react';

interface PredictorCardProps {
  totalQuestions: number;
  progressPercentage: number;
  emoji: string;
  daysRemaining: number;
}

export default function PredictorCard({ totalQuestions, progressPercentage, emoji, daysRemaining }: PredictorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
    >
      <Link href="/predictor">
        <div className="cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">NEET Predictor</h3>
                <p className="text-sm text-gray-400">AI-powered analysis</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </div>

          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-purple-900/50 to-purple-800/50 rounded-lg border border-purple-600/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-purple-300">{(totalQuestions || 0).toLocaleString()}</span>
                <span className="text-3xl animate-pulse-glow">{emoji}</span>
              </div>
              <p className="text-sm text-gray-300">Questions Solved</p>
              <p className="text-xs text-gray-500">Target: 252,000</p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Math.round(progressPercentage || 0)}%</div>
                <div className="text-xs text-gray-400">Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 animate-pulse">{daysRemaining || 0}</div>
                <div className="text-xs text-gray-400">Days Left</div>
              </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full shadow-glow"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage || 0, 100)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}