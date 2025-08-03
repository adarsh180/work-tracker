'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertTriangle, Trophy, Sparkles } from 'lucide-react';
import { AIFeedback } from '@/types';
import FormattedText from './FormattedText';

interface AIFeedbackPanelProps {
  feedback: AIFeedback[];
  onRefresh: () => void;
}

const feedbackIcons = {
  suggestion: Brain,
  warning: AlertTriangle,
  achievement: Trophy,
  motivation: Sparkles,
};

const feedbackColors = {
  suggestion: 'from-blue-500 to-blue-600',
  warning: 'from-yellow-500 to-yellow-600',
  achievement: 'from-green-500 to-green-600',
  motivation: 'from-purple-500 to-purple-600',
};

export default function AIFeedbackPanel({ feedback, onRefresh }: AIFeedbackPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">AI Insights</h2>
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-glow animate-pulse"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {feedback.map((item, index) => {
            const Icon = feedbackIcons[item.type as keyof typeof feedbackIcons] || Brain;
            const colorClass = feedbackColors[item.type as keyof typeof feedbackColors] || 'from-blue-500 to-blue-600';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-600 bg-gray-700 hover:shadow-glow transition-all duration-200"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass} flex-shrink-0 animate-pulse`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <FormattedText 
                      text={item.message} 
                      className="text-gray-200 text-sm leading-relaxed"
                    />
                    <div className="flex items-center justify-between mt-2">
                      {item.subject && (
                        <span className="text-xs px-2 py-1 bg-gray-600 text-gray-200 rounded-full">
                          {item.subject}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {feedback.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-600 animate-pulse" />
            <p className="text-gray-400">No AI insights yet. Start studying to get personalized feedback!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}