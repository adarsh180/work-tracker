'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface WeeklyAchievementPopupProps {
  isOpen: boolean
  onClose: () => void
  achievementLevel: 2000 | 6800
  questionCount: number
}

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayText}</span>
}

export default function WeeklyAchievementPopup({ isOpen, onClose, achievementLevel, questionCount }: WeeklyAchievementPopupProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  const achievement2000Letters = [
    `Meri consistent Misti,

🏆 ${questionCount} questions is week! Aapne 2000+ weekly milestone hit kar diya hai!

💪 Aapki consistency absolutely INCREDIBLE hai! Week after week, aap unwavering determination ke saath aage push kar rahi ho!
   aise hi lagatar mehnat karti raho bubu success tumhare kadam chumegi uske baad hum bhi chumegenge pair bhi kuch or bhi 😘

📚 Yeh steady progress exactly wahi hai jo aapko Dr. Misti banayega! Har week aap apni medical career ki foundation build kar rahi ho!

🌟 Main kitna proud hun ki aap learning ki itni beautiful rhythm maintain kar rahi hain. Aap sirf padh nahi rahi, master kar rahi hain!

💕 Is amazing momentum ko continue rakhiye, meri jaan! Aap NEET success ke perfect path par hain!

Aapka proud pati,
Jo aapki consistency mein believe karta hai! 💖

P.S. - Is week special celebration deserve karta hai! 🎉`
  ]

  const achievement6800Letters = [
    `Meri PHENOMENAL Misti,

🚀 INCREDIBLE! ${questionCount} questions is week! Aapne ULTIMATE 6800+ weekly target achieve kar liya hai!

👑 Aap sirf padh nahi rahi - aap DOMINATE kar rahi ho! Yeh level ki dedication absolutely LEGENDARY hai means sachi u hitting this!

⚡ 6800+ questions EK WEEK mein?! Aap human limits transcend kar gayi hain! Aap NEET GODDESS ki tarah operate kar rahi ho!

🔥 Yeh sirf achievement nahi - yeh PURE EXCELLENCE hai! Aapne ek standard set kiya hai jisse toppers bhi envy karenge!

💎 Meri diamond biwi, aap pehle se bhi zyada bright sparkle kar rahi hain! Yeh week HISTORIC remember hoga!

🏆 Future medical students aapke methods study karenge! Aapne NEET preparation mein naya chapter likh diya hai!

💕 Main pride se completely speechless hun! Aap meri SUPERHERO hain!

Aapka awestruck pati,
Jo GREATNESS witness kar raha hai! 🌟

P.S. - Yeh BIGGEST celebration ever deserve karta hai! Aap duniya deserve karti hain! 🎊`
  ]

  const getRandomLetter = (letters: string[]) => {
    const randomIndex = Math.floor(Math.random() * letters.length)
    return letters[randomIndex]
  }

  const currentLetter = achievementLevel === 2000 
    ? getRandomLetter(achievement2000Letters) 
    : getRandomLetter(achievement6800Letters)

  const bgGradient = achievementLevel === 2000 
    ? 'from-green-500/20 via-emerald-500/20 to-teal-500/20'
    : 'from-purple-500/20 via-violet-500/20 to-indigo-500/20'
  
  const borderColor = achievementLevel === 2000 ? 'border-green-400/50' : 'border-purple-400/50'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br ${bgGradient} backdrop-blur-xl border ${borderColor} rounded-2xl shadow-2xl`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>

            <div className="p-8 pb-4">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="text-6xl mb-4"
                >
                  {achievementLevel === 2000 ? '🏆' : '👑'}
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-3xl font-bold mb-2 ${
                    achievementLevel === 2000 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
                      : 'bg-gradient-to-r from-purple-400 to-violet-400'
                  } bg-clip-text text-transparent`}
                >
                  {achievementLevel === 2000 ? 'WEEKLY CHAMPION!' : 'WEEKLY LEGEND!'}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-white text-lg"
                >
                  {questionCount} Questions This Week!
                </motion.p>
              </motion.div>
            </div>

            <div className="px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                {showContent && (
                  <div className="text-white leading-relaxed whitespace-pre-line text-sm md:text-base">
                    <TypewriterText text={currentLetter} />
                  </div>
                )}
              </motion.div>
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: '100%',
                    opacity: 0
                  }}
                  animate={{
                    y: '-20%',
                    opacity: [0, 1, 0],
                    rotate: [0, 360],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut"
                  }}
                >
                  {achievementLevel === 2000 ? '🏆' : '👑'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}