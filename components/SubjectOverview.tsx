'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SubjectProgress } from '@/types';
import { getEmojiForPercentage } from '@/lib/subjects-data';

interface SubjectOverviewProps {
  subjects: SubjectProgress[];
}

const subjectColors = {
  Physics: 'from-blue-500 to-blue-600',
  Chemistry: 'from-green-500 to-green-600',
  Botany: 'from-emerald-500 to-emerald-600',
  Zoology: 'from-purple-500 to-purple-600',
};

export default function SubjectOverview({ subjects }: SubjectOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {subjects?.map((subject, index) => {
        const colorClass = subjectColors[subject.subject as keyof typeof subjectColors];
        const emoji = getEmojiForPercentage(subject.completionPercentage);
        
        return (
          <motion.div
            key={subject.subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/subject/${subject.subject.toLowerCase()}`}>
              <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl animate-pulse-glow">{emoji}</div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{subject.subject}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-semibold text-white">
                      {Math.round(subject.completionPercentage)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${colorClass} rounded-full shadow-glow`}
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.completionPercentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{subject.completedTopics}/{subject.totalTopics} chapters</span>
                    <span>{subject.totalHours}h studied</span>
                  </div>
                  
                  {subject.averageScore > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avg Score</span>
                      <span className="font-semibold text-white">{subject.averageScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}