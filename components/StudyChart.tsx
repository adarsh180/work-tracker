'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { SubjectProgress } from '@/types';

interface StudyChartProps {
  data: SubjectProgress[];
  type: 'line' | 'bar' | 'pie';
}

const COLORS = ['#3B82F6', '#10B981', '#059669', '#7C3AED'];

export default function StudyChart({ data, type }: StudyChartProps) {
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const dayName = date.toLocaleDateString('en', { weekday: 'short' });
    
    const dayData: any = { day: dayName };
    data.forEach(subject => {
      dayData[subject.subject] = subject.weeklyProgress[i] || 0;
    });
    return dayData;
  });

  const pieData = data.map((subject, index) => ({
    name: subject.subject,
    value: subject.totalHours,
    color: COLORS[index]
  }));

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            {data.map((subject, index) => (
              <Line
                key={subject.subject}
                type="monotone"
                dataKey={subject.subject}
                stroke={COLORS[index]}
                strokeWidth={3}
                dot={{ fill: COLORS[index], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: COLORS[index], strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            {data.map((subject, index) => (
              <Bar
                key={subject.subject}
                dataKey={subject.subject}
                fill={COLORS[index]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
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
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value}h`, 'Study Hours']}
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
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
    >
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  );
}