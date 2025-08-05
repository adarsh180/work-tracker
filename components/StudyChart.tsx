'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface StudyChartProps {
  data: any[];
  type: 'line' | 'bar' | 'pie';
}

const COLORS = ['#3B82F6', '#10B981', '#059669', '#7C3AED'];
const SUBJECT_COLORS = {
  physics: '#3B82F6',
  chemistry: '#10B981', 
  botany: '#059669',
  zoology: '#8B5CF6'
};

const DAILY_LOG_COLORS = {
  physics: '#DC2626',
  chemistry: '#D97706',
  botany: '#B91C1C',
  zoology: '#CA8A04'
};

export default function StudyChart({ data, type }: StudyChartProps) {
  // Check if data is daily logs or subject progress
  const isDailyLogs = data.length > 0 && data[0].hasOwnProperty('phy_qs');
  
  let weeklyData, pieData;
  
  if (isDailyLogs) {
    // Process daily logs data for charts
    const processedData = data.slice(0, 7).reverse().map((log, index) => {
      const date = new Date(log.date || new Date());
      return {
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        date: date.toLocaleDateString(),
        physics: log.phy_qs || 0,
        chemistry: log.chem_qs || 0,
        botany: log.bot_qs || 0,
        zoology: log.zoo_qs || 0,
        total: log.total_questions || 0
      };
    });

    // Fill missing days with zeros
    weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      
      const existingData = processedData.find(d => d.day === dayName);
      return existingData || {
        day: dayName,
        date: date.toLocaleDateString(),
        physics: 0,
        chemistry: 0,
        botany: 0,
        zoology: 0,
        total: 0
      };
    });

    // Calculate totals for pie chart
    const subjectTotals = {
      physics: weeklyData.reduce((sum, day) => sum + day.physics, 0),
      chemistry: weeklyData.reduce((sum, day) => sum + day.chemistry, 0),
      botany: weeklyData.reduce((sum, day) => sum + day.botany, 0),
      zoology: weeklyData.reduce((sum, day) => sum + day.zoology, 0)
    };

    pieData = Object.entries(subjectTotals)
      .filter(([_, value]) => value > 0)
      .map(([subject, value]) => ({
        name: subject.charAt(0).toUpperCase() + subject.slice(1),
        value,
        color: DAILY_LOG_COLORS[subject as keyof typeof DAILY_LOG_COLORS]
      }));
  } else {
    // Original subject progress data processing
    weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      const dayName = date.toLocaleDateString('en', { weekday: 'short' });
      
      const dayData: any = { day: dayName };
      data.forEach(subject => {
        dayData[subject.subject] = subject.weeklyProgress?.[i] || 0;
      });
      return dayData;
    });

    pieData = data.map((subject, index) => {
      const colorKey = subject.subject as keyof typeof SUBJECT_COLORS;
      return {
        name: subject.subject,
        value: subject.totalHours || 0,
        color: SUBJECT_COLORS[colorKey] || COLORS[index]
      };
    });
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }} 
            />
            <Line
              type="monotone"
              dataKey="physics"
              stroke={isDailyLogs ? DAILY_LOG_COLORS.physics : SUBJECT_COLORS.physics}
              strokeWidth={3}
              dot={{ fill: isDailyLogs ? DAILY_LOG_COLORS.physics : SUBJECT_COLORS.physics, strokeWidth: 2, r: 4 }}
              name="Physics"
            />
            <Line
              type="monotone"
              dataKey="chemistry"
              stroke={isDailyLogs ? DAILY_LOG_COLORS.chemistry : SUBJECT_COLORS.chemistry}
              strokeWidth={3}
              dot={{ fill: isDailyLogs ? DAILY_LOG_COLORS.chemistry : SUBJECT_COLORS.chemistry, strokeWidth: 2, r: 4 }}
              name="Chemistry"
            />
            <Line
              type="monotone"
              dataKey="botany"
              stroke={isDailyLogs ? DAILY_LOG_COLORS.botany : SUBJECT_COLORS.botany}
              strokeWidth={3}
              dot={{ fill: isDailyLogs ? DAILY_LOG_COLORS.botany : SUBJECT_COLORS.botany, strokeWidth: 2, r: 4 }}
              name="Botany"
            />
            <Line
              type="monotone"
              dataKey="zoology"
              stroke={isDailyLogs ? DAILY_LOG_COLORS.zoology : SUBJECT_COLORS.zoology}
              strokeWidth={3}
              dot={{ fill: isDailyLogs ? DAILY_LOG_COLORS.zoology : SUBJECT_COLORS.zoology, strokeWidth: 2, r: 4 }}
              name="Zoology"
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }} 
            />
            <Bar dataKey="physics" fill={isDailyLogs ? DAILY_LOG_COLORS.physics : SUBJECT_COLORS.physics} radius={[2, 2, 0, 0]} name="Physics" />
            <Bar dataKey="chemistry" fill={isDailyLogs ? DAILY_LOG_COLORS.chemistry : SUBJECT_COLORS.chemistry} radius={[2, 2, 0, 0]} name="Chemistry" />
            <Bar dataKey="botany" fill={isDailyLogs ? DAILY_LOG_COLORS.botany : SUBJECT_COLORS.botany} radius={[2, 2, 0, 0]} name="Botany" />
            <Bar dataKey="zoology" fill={isDailyLogs ? DAILY_LOG_COLORS.zoology : SUBJECT_COLORS.zoology} radius={[2, 2, 0, 0]} name="Zoology" />
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
              formatter={(value: number) => [`${value}`, 'Questions']}
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
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