'use client';

import { motion } from 'framer-motion';
import { BookOpen, Clock, Target, TrendingUp } from 'lucide-react';
import { SubjectProgress } from '@/types';

interface SubjectCardProps {
  subject: SubjectProgress;
  index: number;
}

const subjectColors = {
  Physics: 'from-blue-500 to-blue-600',
  Chemistry: 'from-green-500 to-green-600',
  Botany: 'from-emerald-500 to-emerald-600',
  Zoology: 'from-purple-500 to-purple-600',
};

export default function SubjectCard({ subject, index }: SubjectCardProps) {
  const progressPercentage = (subject.completedTopics / subject.totalTopics) * 100;
  const colorClass = subjectColors[subject.subject as keyof typeof subjectColors];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className={`w-full h-2 bg-gray-200 rounded-full mb-4`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 1, delay: index * 0.2 }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{subject.subject}</h3>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClass}`}>
          <BookOpen className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{subject.totalHours}h</span>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{subject.averageScore}%</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {subject.completedTopics}/{subject.totalTopics} topics
        </span>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-600">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}