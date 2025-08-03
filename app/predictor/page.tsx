'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Target, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import PredictorChart from '@/components/PredictorChart';
import FormattedText from '@/components/FormattedText';

export default function PredictorPage() {
  const router = useRouter();
  const [predictorData, setPredictorData] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [chartType, setChartType] = useState<'progress' | 'subjects' | 'radial' | 'pie'>('progress');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictorData();
  }, []);

  const fetchPredictorData = async () => {
    try {
      const response = await fetch('/api/predictor');
      const data = await response.json();
      setPredictorData(data);
      generateAIAnalysis();
    } catch (error) {
      console.error('Error fetching predictor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIAnalysis = async () => {
    try {
      const response = await fetch('/api/predictor', { method: 'POST' });
      const data = await response.json();
      setAiAnalysis(data.analysis);
    } catch (error) {
      console.error('Error generating AI analysis:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!predictorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-6">Start studying and taking tests to see predictions.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
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
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-600">
                NEET Predictor
              </h1>
              <p className="text-gray-600">AI-powered analysis of your preparation progress</p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-3xl font-bold text-purple-600">{predictorData.totalQuestionsAttempted.toLocaleString()}</span>
              <span className="text-3xl">{predictorData.questionEmoji}</span>
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
            <div className="text-xs text-gray-500 mt-1">Target: 150,000</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">{predictorData.totalTests + predictorData.totalSubjectTests}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
            <div className="text-xs text-gray-500 mt-1">{predictorData.totalTests} main + {predictorData.totalSubjectTests} subject</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(predictorData.averageTestScore)}%</div>
            <div className="text-sm text-gray-600">Avg Test Score</div>
            <div className="text-xs text-gray-500 mt-1">Across all subjects</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-red-600 mb-2">{predictorData.daysRemaining}</div>
            <div className="text-sm text-gray-600">Days Left</div>
            <div className="text-xs text-gray-500 mt-1">Until NEET 2026</div>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Overall Progress</h3>
            <PredictorChart data={predictorData} type="radial" />
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                {predictorData.totalQuestionsAttempted.toLocaleString()} / 150,000 questions
              </p>
            </div>
          </motion.div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Breakdown</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{predictorData.completedLectures}</div>
                  <div className="text-sm text-gray-600">Lectures</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{predictorData.completedDPPs}</div>
                  <div className="text-sm text-gray-600">DPPs</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{predictorData.completedAssignments}</div>
                  <div className="text-sm text-gray-600">Assignments</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{(predictorData.practiceQuestions + predictorData.subjectTestQuestions).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Practice Qs</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI Analysis */}
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5" />
                <h2 className="text-xl font-bold">AI Predictor Analysis</h2>
              </div>
              <FormattedText text={aiAnalysis} className="text-white leading-relaxed" />
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Progress Analytics</h2>
            <div className="flex space-x-2">
              {[
                { type: 'progress' as const, icon: BarChart3, label: 'Progress' },
                { type: 'subjects' as const, icon: TrendingUp, label: 'Subjects' },
                { type: 'radial' as const, icon: Target, label: 'Overall' },
                { type: 'pie' as const, icon: PieChart, label: 'Distribution' }
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    chartType === type
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          <PredictorChart data={predictorData} type={chartType} />
        </div>

        {/* Subject-wise Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Subject-wise Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictorData.subjects.map((subject: any, index: number) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-800 mb-3 capitalize">{subject.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{subject.totalQuestions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject Tests:</span>
                    <span className="font-medium">{subject.subjectTests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lectures:</span>
                    <span className="font-medium">{subject.lectures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">DPPs:</span>
                    <span className="font-medium">{subject.dpps}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Score:</span>
                    <span className="font-medium">{Math.round(subject.avgSubjectScore)}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}