'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight, Stethoscope, Calendar as CalendarIcon, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CalendarEntry {
  id?: number;
  date: string;
  status: 'good' | 'average' | 'bad';
  notes?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'good' | 'average' | 'bad'>('good');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCalendarEntries();
    
    // Check for date parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const dateParam = urlParams.get('date');
    if (dateParam) {
      const paramDate = new Date(dateParam);
      setCurrentDate(paramDate);
      setSelectedDate(dateParam);
      
      // Auto-open modal for the selected date
      setTimeout(() => {
        handleDateClick(paramDate.getDate());
      }, 500);
    }
  }, [currentDate]);

  const fetchCalendarEntries = async () => {
    try {
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
      
      const response = await fetch(
        `/api/calendar?userId=1&startDate=${startOfYear.toISOString().split('T')[0]}&endDate=${endOfYear.toISOString().split('T')[0]}`
      );
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Error fetching calendar entries:', error);
    }
  };

  const handleDateClick = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
    
    const existingEntry = entries.find(entry => entry.date === dateStr);
    
    setSelectedDate(dateStr);
    setSelectedStatus(existingEntry?.status || 'good');
    setNotes(existingEntry?.notes || '');
    setModalOpen(true);
  };

  const saveEntry = async () => {
    if (!selectedDate) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          date: selectedDate,
          status: selectedStatus,
          notes: notes
        })
      });

      if (response.ok) {
        // Update entries immediately for instant visual feedback
        const newEntry = { date: selectedDate, status: selectedStatus, notes };
        setEntries(prev => {
          const filtered = prev.filter(e => e.date !== selectedDate);
          return [...filtered, newEntry];
        });
        
        setModalOpen(false);
        setSelectedDate(null);
        setNotes('');
        
        // Fetch fresh data and trigger updates
        await fetchCalendarEntries();
        window.dispatchEvent(new CustomEvent('calendarUpdate', { detail: { timestamp: Date.now() } }));
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setSaving(false);
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
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
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
      case 'bad': return '😔→💪';
      default: return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return 'Excellent Study Day!';
      case 'average': return 'Decent Progress';
      case 'bad': return 'Tomorrow Will Be Better!';
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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth();
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                         currentDate.getFullYear() === today.getFullYear();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <div className="flex items-center space-x-3">
                <Stethoscope className="w-8 h-8 text-pink-400" />
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 animate-pulse-glow">
                    Study Calendar
                  </h1>
                  <p className="text-gray-300">Track your daily NEET preparation journey</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <p className="text-sm text-gray-400">NEET UG 2026 Preparation</p>
            </div>
          </div>
        </motion.div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300">Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>

          <button
            onClick={() => navigateMonth('next')}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <span className="text-gray-300">Next</span>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6"
        >
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNamesShort.map(day => (
              <div key={day} className="text-center py-3 font-semibold text-gray-300 bg-gray-700 rounded-lg">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-20"></div>;
              }

              const entry = getEntryForDate(day);
              const isToday = isCurrentMonth && day === today.getDate();
              const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < today;
              
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day)}
                  className={`h-20 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200 relative ${
                    isToday ? 'ring-2 ring-blue-400' : ''
                  } ${entry ? getStatusColor(entry.status) : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  <span className={`text-lg font-bold ${entry ? 'text-white' : 'text-gray-300'}`}>
                    {day}
                  </span>
                  
                  {entry && entry.notes && (
                    <div className="w-2 h-2 bg-white rounded-full absolute bottom-1 right-1"></div>
                  )}
                  
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Legend</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-500/20 rounded-lg border border-green-500/30">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">😊</span>
              </div>
              <div>
                <div className="font-semibold text-green-400">Excellent Day</div>
                <div className="text-sm text-gray-400">Completed all tasks, studied well</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">😐</span>
              </div>
              <div>
                <div className="font-semibold text-yellow-400">Average Day</div>
                <div className="text-sm text-gray-400">Some progress, room for improvement</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">😔→💪</span>
              </div>
              <div>
                <div className="font-semibold text-red-400">Challenging Day</div>
                <div className="text-sm text-gray-400">Tomorrow will be better!</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="p-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      How was your study day?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'good', emoji: '😊', text: 'Excellent', color: 'green' },
                        { value: 'average', emoji: '😐', text: 'Average', color: 'yellow' },
                        { value: 'bad', emoji: '😔→💪', text: 'Challenging', color: 'red' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSelectedStatus(option.value as any)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            selectedStatus === option.value
                              ? `border-${option.color}-500 bg-${option.color}-500/20`
                              : 'border-gray-600 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.emoji}</div>
                          <div className={`text-sm font-medium ${
                            selectedStatus === option.value ? `text-${option.color}-400` : 'text-gray-400'
                          }`}>
                            {option.text}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                      placeholder="What did you accomplish today? Any challenges?"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={saveEntry}
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Entry</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="flex-1 bg-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-500 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}