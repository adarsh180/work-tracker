'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, BarChart3, PieChart, TrendingUp, Trophy, Calendar, Target, Save, CheckCircle } from 'lucide-react';
import TestChart from '@/components/TestChart';
import FormattedText from '@/components/FormattedText';
import { getEmojiForPercentage } from '@/lib/subjects-data';

export default function TestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    testType: 'weekly',
    testName: '',
    score: '',
    maxScore: '720'
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/tests');
      const data = await response.json();
      setTests(data);
      generateAIAnalysis(data);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIAnalysis = async (testsData: any[]) => {
    if (testsData.length === 0) return;
    
    try {
      const analysis = {
        totalTests: testsData.length,
        averageScore: testsData.reduce((sum, t) => sum + (t.score / t.max_score) * 100, 0) / testsData.length,
        testTypes: {
          weekly: testsData.filter(t => t.test_type === 'weekly').length,
          rankBooster: testsData.filter(t => t.test_type === 'rank_booster').length,
          fullLength: testsData.filter(t => t.test_type === 'full_length').length
        },
        subjects: ['physics', 'chemistry', 'botany', 'zoology'].map(subject => ({
          name: subject,
          tests: testsData.filter(t => t.subject === subject).length,
          avgScore: testsData.filter(t => t.subject === subject).reduce((sum, t, _, arr) => 
            arr.length > 0 ? sum + (t.score / t.max_score) * 100 / arr.length : 0, 0)
        }))
      };

      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testAnalysis: analysis })
      });
      
      const data = await response.json();
      setAiAnalysis(data.feedback || 'Continue taking regular tests to track your progress!');
    } catch (error) {
      console.error('Error generating AI analysis:', error);
    }
  };

  const addTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: formData.testType,
          testName: formData.testName,
          score: parseInt(formData.score),
          maxScore: parseInt(formData.maxScore)
        })
      });
      
      if (response.ok) {
        setFormData({ testType: 'weekly', testName: '', score: '', maxScore: '720' });
        setIsFormOpen(false);
        await fetchTests();
        
        // Trigger dashboard update
        localStorage.setItem('lastUpdate', Date.now().toString());
        window.dispatchEvent(new Event('storage'));
        
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error adding test:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveAllTests = async () => {
    setSaving(true);
    try {
      // Re-generate AI analysis with current data
      await generateAIAnalysis(tests);
      
      // Trigger dashboard update
      localStorage.setItem('lastUpdate', Date.now().toString());
      window.dispatchEvent(new Event('storage'));
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving tests:', error);
    } finally {
      setSaving(false);
    }
  };

  const filteredTests = selectedType === 'all' 
    ? tests 
    : tests.filter(test => test.test_type === selectedType);

  const stats = {
    total: tests.length,
    average: tests.length > 0 ? tests.reduce((sum, t) => sum + (t.score / t.max_score) * 100, 0) / tests.length : 0,
    best: tests.length > 0 ? Math.max(...tests.map(t => (t.score / t.max_score) * 100)) : 0,
    weekly: tests.filter(t => t.test_type === 'weekly').length,
    rankBooster: tests.filter(t => t.test_type === 'rank_booster').length,
    fullLength: tests.filter(t => t.test_type === 'full_length').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                  Test Performance
                </h1>
                <p className="text-gray-600">Comprehensive test analysis and tracking</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={saveAllTests}
                disabled={!hasUnsavedChanges || saving}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  hasUnsavedChanges && !saving
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save & Analyze</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Saved</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Test</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI Analysis */}
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-2 mb-3">
                <Trophy className="w-5 h-5" />
                <h2 className="text-xl font-bold">AI Test Analysis</h2>
              </div>
              <FormattedText text={aiAnalysis} className="text-white leading-relaxed" />
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-4 text-center"
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="text-2xl font-bold text-gray-800">{Math.round(stats.average)}%</span>
              <span className="text-xl">{getEmojiForPercentage(stats.average)}</span>
            </div>
            <div className="text-sm text-gray-600">Average</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-4 text-center"
          >
            <div className="flex items-center justify-center space-x-1">
              <span className="text-2xl font-bold text-gray-800">{Math.round(stats.best)}%</span>
              <span className="text-xl">🏆</span>
            </div>
            <div className="text-sm text-gray-600">Best Score</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-4 text-center"
          >
            <div className="text-2xl font-bold text-gray-800">{stats.fullLength}</div>
            <div className="text-sm text-gray-600">Full Length</div>
          </motion.div>
        </div>

        {/* Test Type Filter */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: 'All Tests' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'rank_booster', label: 'Rank Booster' },
            { key: 'full_length', label: 'Full Length' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedType === key
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Performance Analytics</h2>
            <div className="flex space-x-2">
              {[
                { type: 'line' as const, icon: TrendingUp, label: 'Trend' },
                { type: 'bar' as const, icon: BarChart3, label: 'Scores' },
                { type: 'pie' as const, icon: PieChart, label: 'Distribution' }
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    chartType === type
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <TestChart tests={filteredTests} type={chartType} />
        </div>

        {/* Test List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Test History</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTests.map((test, index) => {
              const percentage = (test.score / test.max_score) * 100;
              const emoji = getEmojiForPercentage(percentage);
              
              return (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.test_type === 'weekly' ? 'bg-blue-100 text-blue-800' :
                      test.test_type === 'rank_booster' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {test.test_type === 'weekly' ? 'Weekly' :
                       test.test_type === 'rank_booster' ? 'Rank Booster' : 'Full Length'}
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
                </motion.div>
              );
            })}
            
            {filteredTests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tests found. Add your first test to start tracking!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Add Test Modal */}
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add Test Result</h2>
              
              <form onSubmit={addTest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
                  <select
                    value={formData.testType}
                    onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="weekly">Weekly Test</option>
                    <option value="rank_booster">Rank Booster</option>
                    <option value="full_length">Full Length Test</option>
                    <option value="aits">AITS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Test Name</label>
                  <input
                    type="text"
                    value={formData.testName}
                    onChange={(e) => { setFormData({ ...formData, testName: e.target.value }); setHasUnsavedChanges(true); }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="e.g., Physics Weekly Test 1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                    <input
                      type="number"
                      value={formData.score}
                      onChange={(e) => { setFormData({ ...formData, score: e.target.value }); setHasUnsavedChanges(true); }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="650"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                    <input
                      type="number"
                      value={formData.maxScore}
                      onChange={(e) => { setFormData({ ...formData, maxScore: e.target.value }); setHasUnsavedChanges(true); }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="720"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Add Test</span>
                    )}
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
      </div>
    </div>
  );
}