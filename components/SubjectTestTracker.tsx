'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, Calendar } from 'lucide-react';
import { getEmojiForPercentage } from '@/lib/subjects-data';

interface SubjectTestTrackerProps {
  tests: any[];
  onAddTest: (test: any) => void;
  subject: string;
}

export default function SubjectTestTracker({ tests, onAddTest, subject }: SubjectTestTrackerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    testName: '',
    questionsAttempted: '',
    score: '',
    maxScore: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTest({
      subject,
      testName: formData.testName,
      questionsAttempted: parseInt(formData.questionsAttempted),
      score: parseInt(formData.score),
      maxScore: parseInt(formData.maxScore)
    });
    setFormData({ testName: '', questionsAttempted: '', score: '', maxScore: '' });
    setIsFormOpen(false);
  };

  const averageScore = tests.length > 0 
    ? tests.reduce((sum, test) => sum + (test.score / test.max_score) * 100, 0) / tests.length 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 mt-6 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 animate-pulse">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Subject Tests</h2>
            <p className="text-sm text-gray-400">{tests.length} tests completed</p>
          </div>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Test</span>
        </button>
      </div>

      {tests.length > 0 && (
        <div className="mb-6">
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl font-bold text-white">{Math.round(averageScore)}%</span>
              <span className="text-2xl animate-pulse-glow">{getEmojiForPercentage(averageScore)}</span>
            </div>
            <p className="text-sm text-gray-400">Average Score</p>
          </div>
        </div>
      )}

      <div className="space-y-4 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {tests.map((test, index) => {
            const percentage = (test.score / test.max_score) * 100;
            const emoji = getEmojiForPercentage(percentage);

            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-600 bg-gray-700 rounded-lg p-4 hover:shadow-glow transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{test.test_name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(test.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{test.questions_attempted} questions</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl animate-pulse">{emoji}</span>
                      <div>
                        <div className="text-lg font-bold text-white">
                          {test.score}/{test.max_score}
                        </div>
                        <div className="text-sm text-gray-400">
                          {Math.round(percentage)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {tests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-400"
          >
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-600 animate-pulse" />
            <p>No subject tests recorded yet. Add your first test!</p>
          </motion.div>
        )}
      </div>

      {/* Add Test Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Add Subject Test</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Test Name
                  </label>
                  <input
                    type="text"
                    value={formData.testName}
                    onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Chapter Test - Thermodynamics"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Questions Attempted
                  </label>
                  <input
                    type="number"
                    value={formData.questionsAttempted}
                    onChange={(e) => setFormData({ ...formData, questionsAttempted: e.target.value })}
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="30"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Score
                    </label>
                    <input
                      type="number"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="25"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Score
                    </label>
                    <input
                      type="number"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="30"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-glow"
                  >
                    Add Test
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 bg-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-500 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}