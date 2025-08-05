'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CalendarEntry {
  date: string;
  status: 'good' | 'average' | 'bad';
  notes?: string;
}

export default function CalendarCard() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendarEntries();
    
    // Listen for calendar updates
    const handleCalendarUpdate = () => {
      fetchCalendarEntries();
    };
    
    window.addEventListener('calendarUpdate', handleCalendarUpdate);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchCalendarEntries, 30000);
    
    return () => {
      window.removeEventListener('calendarUpdate', handleCalendarUpdate);
      clearInterval(interval);
    };
  }, [currentDate]);

  const fetchCalendarEntries = async () => {
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      const response = await fetch(
        `/api/calendar?userId=1&startDate=${startOfMonth.toISOString().split('T')[0]}&endDate=${endOfMonth.toISOString().split('T')[0]}`,
        {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching calendar entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEntryForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
    return entries.find(entry => entry.date === dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'average': return 'bg-yellow-500';
      case 'bad': return 'bg-red-500';
      default: return 'bg-gray-700';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'good': return '😊';
      case 'average': return '😐';
      case 'bad': return '😔';
      default: return '';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth();
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300 cursor-pointer"
      onClick={() => router.push('/calendar')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Stethoscope className="w-5 h-5 text-pink-400" />
          <h3 className="text-lg font-bold text-white">Study Calendar</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateMonth('prev');
            }}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </button>
          
          <span className="text-sm font-medium text-white min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateMonth('next');
            }}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-xs text-gray-400 text-center py-1 font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-8"></div>;
            }

            const entry = getEntryForDate(day);
            const isToday = isCurrentMonth && day === today.getDate();
            
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`h-8 flex items-center justify-center text-xs rounded relative cursor-pointer ${
                  isToday ? 'ring-2 ring-blue-400' : ''
                } ${entry ? getStatusColor(entry.status) : 'bg-gray-700'} 
                hover:scale-110 transition-all duration-200`}
                onClick={(e) => {
                  e.stopPropagation();
                  const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    .toISOString().split('T')[0];
                  router.push(`/calendar?date=${dateStr}`);
                }}
              >
                <span className={`font-medium ${entry ? 'text-white' : 'text-gray-300'}`}>
                  {day}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Mood Summary */}
      <div className="mt-4 p-3 bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-300">This Month</span>
          <span className="text-xs text-gray-400">{entries.length} days tracked</span>
        </div>
        <div className="flex items-center justify-center space-x-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">{entries.filter(e => e.status === 'good').length} 😊</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-400">{entries.filter(e => e.status === 'average').length} 😐</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">{entries.filter(e => e.status === 'bad').length} 😔</span>
          </div>
        </div>
      </div>

      {/* Click to expand hint */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">Click to view full calendar</span>
      </div>
    </motion.div>
  );
}