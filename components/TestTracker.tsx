'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, TrendingUp, Calendar } from 'lucide-react';
import { getEmojiForPercentage } from '@/lib/subjects-data';

interface TestTrackerProps {
  tests: any[];
  onAddTest: (test: any) => void;
  subject: string;
}

export default function TestTracker({ tests, onAddTest, subject }: TestTrackerProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    testType: 'weekly',
    testName: '',
    score: '',
    maxScore: '720'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTest({
      subject,
      testType: formData.testType,
      testName: formData.testName,
      score: parseInt(formData.score),
      maxScore: parseInt(formData.maxScore)
    });
    setFormData({ testType: 'weekly', testName: '', score: '', maxScore: '720' });
    setIsFormOpen(false);
  };

  const getTestTypeColor = (type: string) => {
    switch (type) {
      case 'weekly': return 'from-blue-500 to-blue-600';
      case 'rank_booster': return 'from-green-500 to-green-600';
      case 'full_length': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTestTypeLabel = (type: string) => {
    switch (type) {
      case 'weekly': return 'Weekly Test';
      case 'rank_booster': return 'Rank Booster';
      case 'full_length': return 'Full Length';
      default: return type;
    }
  };

  const averageScore = tests.length > 0 
    ? tests.reduce((sum, test) => sum + (test.score / test.max_score) * 100, 0) / tests.length 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Test Performance</h2>
            <p className="text-sm text-gray-600">{tests.length} tests completed</p>
          </div>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Test</span>
        </button>
      </div>

      {tests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Average Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-800">{Math.round(averageScore)}%</span>
              <span className="text-xl">{getEmojiForPercentage(averageScore)}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Best Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-800">
                {Math.round(Math.max(...tests.map(t => (t.score / t.max_score) * 100)))}%
              </span>
              <span className="text-xl">🏆</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {tests.map((test, index) => {
            const percentage = (test.score / test.max_score) * 100;
            const emoji = getEmojiForPercentage(percentage);
            const colorClass = getTestTypeColor(test.test_type);

            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${colorClass} text-white text-xs font-medium`}>
                      {getTestTypeLabel(test.test_type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{test.test_name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(test.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <div className="text-lg font-bold text-gray-800">
                          {test.score}/{test.max_score}
                        </div>
                        <div className="text-sm text-gray-600">
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
            className="text-center py-8 text-gray-500"
          >
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No tests recorded yet. Add your first test to track performance!</p>
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
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add Test Result</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Type
                  </label>
                  <select
                    value={formData.testType}
                    onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="weekly">Weekly Test</option>
                    <option value="rank_booster">Rank Booster</option>
                    <option value="full_length">Full Length Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name
                  </label>
                  <input
                    type="text"
                    value={formData.testName}
                    onChange={(e) => setFormData({ ...formData, testName: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Physics Weekly Test 1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score
                    </label>
                    <input
                      type="number"
                      value={formData.score}
                      onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="650"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Score
                    </label>
                    <input
                      type="number"
                      value={formData.maxScore}
                      onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="720"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium"
                  >
                    Add Test
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
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