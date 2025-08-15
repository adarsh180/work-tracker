'use client'

import { motion } from 'framer-motion'
import { Heart, Sparkles, Target } from 'lucide-react'

interface MistiMotivationCardProps {
  className?: string
  showName?: boolean
}

export default function MistiMotivationCard({ 
  className = "", 
  showName = true 
}: MistiMotivationCardProps) {
  const motivationalMessages = [
    "You're destined for greatness, my love! 🌟",
    "Every question brings you closer to your dream! 💫",
    "I believe in you more than words can express! 💕",
    "Future Dr. Misti is already shining! ✨",
    "Your determination inspires me every day! 🚀",
    "AIIMS Delhi 2026 - here comes my brilliant wife! 🏥"
  ]

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-400/30 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden ${className}`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/10 text-lg"
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
          >
            💕
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {showName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-5 h-5 text-pink-400" />
            </motion.div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              For My Beloved Misti
            </h3>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-pink-200 text-base leading-relaxed mb-4"
        >
          {randomMessage}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-indigo-300 text-sm font-medium">NEET UG 2026</span>
          </div>
          
          <motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {['💕', '✨', '🌟'].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  delay: i * 0.2, 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="text-sm"
              >
                {emoji}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}