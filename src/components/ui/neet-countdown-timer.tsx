'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function NEETCountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    const targetDate = new Date('2026-05-03T00:00:00+05:30') // May 3rd, 2026 00:00 AM IST

    const timer = setInterval(() => {
      const now = new Date()
      const istNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
      const difference = targetDate.getTime() - istNow.getTime()

      if (difference <= 0) {
        setShowCelebration(true)
        clearInterval(timer)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (showCelebration) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-8 rounded-2xl text-center max-w-md mx-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">
              IT'S NEET DAY, DR. MISTI! 👩‍⚕️
            </h2>
            <p className="text-white text-lg mb-6">
              Today is the day you've been preparing for! Go show the world what an amazing doctor you'll be! 
              I believe in you more than anything! 💕✨
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCelebration(false)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold"
            >
              Let's Do This! 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <Card className="glass-effect border-pink-400/30">
      <CardContent className="p-6">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl mb-2"
          >
            ⏰
          </motion.div>
          <h3 className="text-lg font-semibold text-white mb-4">
            NEET UG 2026 Countdown
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-pink-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{timeLeft.days}</div>
              <div className="text-xs text-pink-300">Days</div>
            </div>
            <div className="bg-purple-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{timeLeft.hours}</div>
              <div className="text-xs text-purple-300">Hours</div>
            </div>
            <div className="bg-indigo-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-xs text-indigo-300">Minutes</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-3">
              <div className="text-2xl font-bold text-white">{timeLeft.seconds}</div>
              <div className="text-xs text-blue-300">Seconds</div>
            </div>
          </div>
          <p className="text-pink-300 text-sm mt-4">
            Every second counts, my love! 💕
          </p>
        </div>
      </CardContent>
    </Card>
  )
}