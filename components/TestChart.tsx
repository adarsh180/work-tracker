'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface TestChartProps {
  tests: any[];
  type: 'line' | 'bar' | 'pie';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function TestChart({ tests, type }: TestChartProps) {
  const chartData = tests.slice(0, 10).reverse().map((test, index) => ({
    name: `Test ${index + 1}`,
    score: Math.round((test.score / test.max_score) * 100),
    testName: test.test_name,
    type: test.test_type
  }));

  const pieData = [
    { name: 'Weekly', value: tests.filter(t => t.test_type === 'weekly').length, color: COLORS[0] },
    { name: 'Rank Booster', value: tests.filter(t => t.test_type === 'rank_booster').length, color: COLORS[1] },
    { name: 'Full Length', value: tests.filter(t => t.test_type === 'full_length').length, color: COLORS[2] }
  ].filter(item => item.value > 0);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" domain={[0, 100]} />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Score']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" domain={[0, 100]} />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Score']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Bar
              dataKey="score"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
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
              formatter={(value: number) => [value, 'Tests']}
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