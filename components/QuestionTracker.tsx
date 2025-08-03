'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, X } from 'lucide-react';

interface QuestionTrackerProps {
  chapter: any;
  onUpdate: (chapterName: string, questionsSolved: number) => void;
}

export default function QuestionTracker({ chapter, onUpdate }: QuestionTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [questions, setQuestions] = useState(chapter.questionsSolved || 0);

  const handleSave = () => {
    onUpdate(chapter.name, questions);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-700 border border-gray-600 rounded-lg p-4 mt-4 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-white">Questions Solved</h4>
          <p className="text-sm text-gray-400">Track practice questions for this chapter</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <input
                type="number"
                value={questions}
                onChange={(e) => setQuestions(parseInt(e.target.value) || 0)}
                className="w-20 p-2 border border-gray-600 bg-gray-800 text-white rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <button
                onClick={handleSave}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-glow"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold text-blue-400 animate-pulse">{chapter.questionsSolved || 0}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-glow"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}