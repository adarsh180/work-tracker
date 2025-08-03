'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trophy, TrendingUp, ChevronRight } from 'lucide-react';
import { getEmojiForPercentage } from '@/lib/subjects-data';

interface TestOverviewCardProps {
  totalTests: number;
  averageScore: number;
  bestScore: number;
  recentTests: any[];
}

export default function TestOverviewCard({ totalTests, averageScore, bestScore, recentTests }: TestOverviewCardProps) {
  const emoji = getEmojiForPercentage(averageScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
    >
      <Link href="/tests">
        <div className="cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Test Performance</h3>
                <p className="text-sm text-gray-400">{totalTests} tests completed</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-2xl font-bold text-white">{Math.round(averageScore)}%</span>
                <span className="text-2xl animate-pulse-glow">{emoji}</span>
              </div>
              <p className="text-xs text-gray-400">Average Score</p>
            </div>
            
            <div className="text-center p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <span className="text-2xl font-bold text-white">{Math.round(bestScore)}%</span>
                <span className="text-xl animate-pulse">🏆</span>
              </div>
              <p className="text-xs text-gray-400">Best Score</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-300 text-sm">Recent Tests</h4>
            {recentTests.slice(0, 3).map((test, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-400 truncate">{test.test_name}</span>
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-white">{Math.round((test.score / test.max_score) * 100)}%</span>
                  <span className="animate-pulse">{getEmojiForPercentage((test.score / test.max_score) * 100)}</span>
                </div>
              </div>
            ))}
            {totalTests === 0 && (
              <p className="text-sm text-gray-500 text-center py-2">No tests recorded yet</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}