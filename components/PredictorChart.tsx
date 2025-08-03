'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';

interface PredictorChartProps {
  data: any;
  type: 'progress' | 'subjects' | 'radial' | 'pie';
}

const COLORS = ['#3B82F6', '#10B981', '#059669', '#7C3AED'];

export default function PredictorChart({ data, type }: PredictorChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'progress':
        const progressData = [
          { name: 'Questions', value: data.totalQuestionsAttempted, max: 150000 },
          { name: 'Tests', value: data.totalTests, max: 100 },
          { name: 'Lectures', value: data.completedLectures, max: 500 },
          { name: 'DPPs', value: data.completedDPPs, max: 500 },
          { name: 'Assignments', value: data.completedAssignments, max: 200 }
        ].map(item => ({
          ...item,
          percentage: Math.min((item.value / item.max) * 100, 100)
        }));

        return (
          <BarChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              formatter={(value: number, name: string) => [
                name === 'percentage' ? `${value.toFixed(1)}%` : value,
                name === 'percentage' ? 'Progress' : 'Count'
              ]}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'subjects':
        const subjectData = data.subjects.map((subject: any, index: number) => ({
          name: subject.name.charAt(0).toUpperCase() + subject.name.slice(1),
          questions: subject.totalQuestions || subject.practiceQuestions || 0,
          tests: subject.subjectTests || 0,
          score: subject.avgSubjectScore || 0,
          color: COLORS[index]
        }));

        return (
          <BarChart data={subjectData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar dataKey="questions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'radial':
        const radialData = [{
          name: 'Progress',
          value: data.progressPercentage,
          fill: data.progressPercentage >= 73 ? '#10B981' : data.progressPercentage >= 47 ? '#F59E0B' : '#EF4444'
        }];

        return (
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
            <RadialBar dataKey="value" cornerRadius={10} fill={radialData[0].fill} />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-gray-800">
              {Math.round(data.progressPercentage)}%
            </text>
          </RadialBarChart>
        );

      case 'pie':
        const pieData = data.subjects.map((subject: any, index: number) => ({
          name: subject.name.charAt(0).toUpperCase() + subject.name.slice(1),
          value: subject.totalQuestions || subject.practiceQuestions || 0,
          color: COLORS[index]
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value, 'Questions']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
          </PieChart>
        );

      default:
        return <div>No chart available</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );
}