'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const examDate = new Date('2026-05-03T14:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = examDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6" />
          <h2 className="text-xl font-bold">NEET 2026</h2>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <Clock className="w-4 h-4" />
          <span>2:00 PM - 5:00 PM</span>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-sm opacity-90 mb-2">Sunday, 3rd May 2026</p>
        <p className="text-lg font-semibold">Time Remaining</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Days', value: timeLeft.days },
          { label: 'Hours', value: timeLeft.hours },
          { label: 'Minutes', value: timeLeft.minutes },
          { label: 'Seconds', value: timeLeft.seconds }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <motion.div
              key={item.value}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white bg-opacity-20 rounded-lg p-3 mb-2"
            >
              <div className="text-2xl font-bold">{item.value.toString().padStart(2, '0')}</div>
            </motion.div>
            <div className="text-xs opacity-80">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}