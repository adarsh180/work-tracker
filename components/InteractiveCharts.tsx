'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Target, Calendar } from 'lucide-react';

interface InteractiveChartsProps {
  data: any;
}

export default function InteractiveCharts({ data }: InteractiveChartsProps) {
  const [activeChart, setActiveChart] = useState<'weekly' | 'monthly' | 'subjects' | 'radar' | 'calendar' | 'progress'>('weekly');

  const chartOptions = [
    { key: 'weekly', label: 'Weekly Trends', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
    { key: 'monthly', label: 'Monthly Analysis', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
    { key: 'subjects', label: 'Subject Performance', icon: PieChartIcon, color: 'from-purple-500 to-pink-500' },
    { key: 'radar', label: 'Overall Analysis', icon: Target, color: 'from-orange-500 to-red-500' },
    { key: 'calendar', label: 'Mood Trends', icon: Calendar, color: 'from-indigo-500 to-purple-500' },
    { key: 'progress', label: 'Chapter Progress', icon: Activity, color: 'from-teal-500 to-blue-500' }
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88', '#ff0088'];

  // Prepare radar chart data
  const radarData = [
    { subject: 'Questions', A: Math.min((data.totalQuestionsAttempted / 50000) * 100, 100) },
    { subject: 'Consistency', A: data.consistencyScore },
    { subject: 'Test Score', A: data.averageScore },
    { subject: 'Chapter Progress', A: data.progressPercentage },
    { subject: 'Error Management', A: data.errorFixRate },
    { subject: 'Streak', A: Math.min((data.currentStreak / 30) * 100, 100) }
  ];

  // Prepare subject pie chart data
  const subjectPieData = Object.entries(data.subjectAnalysis).map(([subject, analysis]: [string, any]) => ({
    name: subject.charAt(0).toUpperCase() + subject.slice(1),
    value: analysis.questions,
    percentage: ((analysis.questions / data.totalQuestionsAttempted) * 100).toFixed(1)
  }));

  // Calendar mood data
  const calendarMoodData = [
    { name: 'Good Days', value: data.calendarAnalysis.goodDays, color: '#10B981' },
    { name: 'Average Days', value: data.calendarAnalysis.averageDays, color: '#F59E0B' },
    { name: 'Bad Days', value: data.calendarAnalysis.badDays, color: '#EF4444' }
  ];

  // Chapter progress data
  const chapterProgressData = [
    { name: 'Lectures', completed: data.chapterAnalysis.completedLectures, total: data.chapterAnalysis.totalChapters },
    { name: 'DPPs', completed: data.chapterAnalysis.completedDPPs, total: data.chapterAnalysis.totalChapters },
    { name: 'Assignment 1', completed: data.chapterAnalysis.normalAssignment1, total: data.chapterAnalysis.totalChapters },
    { name: 'Assignment 2', completed: data.chapterAnalysis.normalAssignment2, total: data.chapterAnalysis.totalChapters },
    { name: 'Kattar Assignment', completed: data.chapterAnalysis.kattarAssignments, total: data.chapterAnalysis.totalChapters }
  ].map(item => ({
    ...item,
    percentage: ((item.completed / item.total) * 100).toFixed(1)
  }));

  const renderChart = () => {
    switch (activeChart) {
      case 'weekly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="questions" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                name="Questions"
              />
              <Line 
                type="monotone" 
                dataKey="avgDaily" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                name="Avg Daily"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data.monthlyAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="questions" 
                stackId="1"
                stroke="#10B981" 
                fill="#10B981"
                fillOpacity={0.6}
                name="Questions"
              />
              <Area 
                type="monotone" 
                dataKey="fireDays" 
                stackId="2"
                stroke="#F59E0B" 
                fill="#F59E0B"
                fillOpacity={0.6}
                name="Fire Days"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'subjects':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subjectPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              {Object.entries(data.subjectAnalysis).map(([subject, analysis]: [string, any], index) => (
                <div key={subject} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white capitalize">{subject}</h4>
                    <span className="text-sm text-gray-400">
                      {((analysis.questions / data.totalQuestionsAttempted) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <div>Questions: {analysis.questions.toLocaleString()}</div>
                    <div>Chapters: {analysis.chapters}/{analysis.totalChapters}</div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${(analysis.chapters / analysis.totalChapters) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
              />
              <Radar
                name="Performance"
                dataKey="A"
                stroke="#8B5CF6"
                fill="#8B5CF6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
              />
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'calendar':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={calendarMoodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {calendarMoodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Mood Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-400">😊 Good Days</span>
                    <span className="text-white">{data.calendarAnalysis.goodDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-400">😐 Average Days</span>
                    <span className="text-white">{data.calendarAnalysis.averageDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-400">😔 Bad Days</span>
                    <span className="text-white">{data.calendarAnalysis.badDays}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-3">
                    <div className="flex justify-between">
                      <span className="text-purple-400">Overall Mood Score</span>
                      <span className="text-white font-bold">{data.calendarAnalysis.moodScore.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chapterProgressData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }} 
                formatter={(value, name) => [`${value}%`, 'Completion']}
              />
              <Bar 
                dataKey="percentage" 
                fill="#06B6D4"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
      {/* Chart Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {chartOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.key}
              onClick={() => setActiveChart(option.key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                activeChart === option.key
                  ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Container */}
      <motion.div
        key={activeChart}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 rounded-lg p-4"
      >
        <h3 className="text-xl font-bold text-white mb-4 capitalize">
          {chartOptions.find(opt => opt.key === activeChart)?.label}
        </h3>
        {renderChart()}
      </motion.div>

      {/* Chart Insights */}
      <motion.div
        key={`${activeChart}-insights`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 p-4 bg-gray-700 rounded-lg"
      >
        <h4 className="font-semibold text-white mb-2">Key Insights</h4>
        <div className="text-sm text-gray-300">
          {activeChart === 'weekly' && (
            <p>Your weekly question count shows {data.weeklyTrends.slice(-1)[0]?.questions > data.weeklyTrends.slice(-2)[0]?.questions ? 'an upward' : 'a declining'} trend. 
            Maintain consistency for better results.</p>
          )}
          {activeChart === 'monthly' && (
            <p>Monthly analysis shows {data.monthlyAnalysis.slice(-1)[0]?.fireDays} fire days this month. 
            Target 20+ fire days monthly for optimal preparation.</p>
          )}
          {activeChart === 'subjects' && (
            <p>Subject distribution shows balanced preparation across all areas. 
            Focus more on subjects with lower question counts.</p>
          )}
          {activeChart === 'radar' && (
            <p>Overall performance radar indicates strengths and areas for improvement. 
            Work on dimensions scoring below 70%.</p>
          )}
          {activeChart === 'calendar' && (
            <p>Mood tracking shows {data.calendarAnalysis.moodScore.toFixed(1)}% positive sentiment. 
            Maintain good study habits for consistent mood.</p>
          )}
          {activeChart === 'progress' && (
            <p>Chapter completion varies across different components. 
            Focus on completing pending assignments and DPPs.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}