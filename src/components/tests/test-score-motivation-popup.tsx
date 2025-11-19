'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface TestScoreMotivationPopupProps {
  isOpen: boolean
  onClose: () => void
  score: number
}

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 30)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayText}</span>
}

export default function TestScoreMotivationPopup({ isOpen, onClose, score }: TestScoreMotivationPopupProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  const getMotivationData = (score: number) => {
    if (score >= 715) {
      return {
        type: 'aiims-delhi',
        bgGradient: 'from-yellow-500/30 via-orange-500/30 to-red-500/30',
        borderColor: 'border-yellow-400/60',
        emoji: '👑',
        title: 'AIIMS DELHI BOUND!',
        college: 'AIIMS DELHI',
        message: `Meri AIIMS ki RANI Misti! 

🏆 ${score}/720 - YEH TOH KAMAAL HAI BACHHA! Aap AIIMS DELHI mein MBBS kar rahi hongi!

👑 Aap sirf student nahi, aap LEGEND ban gayi hain! AIIMS Delhi ka white coat aapka intezaar kar raha hai!

🌟 Is score se toh pure India mein aapka naam hoga! Dr. Misti from AIIMS Delhi - kitna proud feel kar raha hun!

💎 Meri diamond biwi, aap ne prove kar diya ki aap NEET ki GODDESS hain! Continue this legacy, shona!

🚀 Aise hi consistency maintain karo, meri jaan! AIIMS Delhi mein aapka admission pakka hai!

Aapka proud pati,
Jo aapse infinity tak mohabbat karta hai! 💕

P.S. - AIIMS Delhi ki preparation kar lo, aap wahi ja rahi hain! 🎉`
      }
    }
    
    if (score >= 710) {
      const colleges = [
        { name: 'MAMC DELHI', range: '714-713' },
        { name: 'SAFDARGUNJ', range: '712-711' },
        { name: 'JIPMER', range: '710' }
      ]
      const college = score >= 713 ? colleges[0] : score >= 711 ? colleges[1] : colleges[2]
      
      return {
        type: 'top-medical',
        bgGradient: 'from-green-500/30 via-emerald-500/30 to-teal-500/30',
        borderColor: 'border-green-400/60',
        emoji: '🏥',
        title: 'TOP MEDICAL COLLEGE!',
        college: college.name,
        message: `Meri brilliant Misti!

🏥 ${score}/720 - ${college.name} mein aapka seat confirm hai bachha!

🌟 Yeh score dekh kar mera dil garden garden ho gaya! Aap top medical colleges mein ja rahi hain!

💪 ${college.name} ki white coat aapko suit karegi, meri rani gudiya! Keep pushing for even higher!

🔥 Aise performance se toh AIIMS Delhi bhi possible hai! Thoda aur mehnat, shona!

✨ Meri aradhangini, aap medical field mein revolution laane wali hain!

Aapka excited pati,
Jo aapki success par dance kar raha hai! 💃

P.S. - ${college.name} ki preparation start kar do! 🎊`
      }
    }
    
    if (score >= 695) {
      const colleges = [
        { name: 'AIIMS RISHIKESH', range: '705-690' },
        { name: 'AIIMS JODHPUR', range: '704-700' },
        { name: 'AIIMS BHOPAL', range: '699-697' },
        { name: 'Lady Hardinge Medical College DELHI', range: '696-695' }
      ]
      const college = score >= 700 ? colleges[1] : score >= 697 ? colleges[2] : score >= 695 ? colleges[3] : colleges[0]
      
      return {
        type: 'aiims-level',
        bgGradient: 'from-blue-500/30 via-indigo-500/30 to-purple-500/30',
        borderColor: 'border-blue-400/60',
        emoji: '🎯',
        title: 'AIIMS LEVEL PERFORMANCE!',
        college: college.name,
        message: `Meri talented Misti!

🎯 ${score}/720 - ${college.name} mein aapka chance hai, betu!

🚀 Yeh excellent score hai! Lekin aap aur bhi upar ja sakti hain! Push more, lado!

💎 ${college.name} achha college hai, but AIIMS Delhi ka dream alive rakho!

🔥 Thoda aur consistency aur aap 710+ hit kar sakti hain! Main believe karta hun!

⭐ Meri shona, aap capable hain 720 tak jaane ki! Don't settle, keep climbing!

Aapka motivating pati,
Jo aapko aur heights par dekhna chahta hai! 🌟

P.S. - Next target: 710+! Aap kar sakti hain! 💪`
      }
    }
    
    if (score >= 660) {
      const colleges = [
        { name: 'AIIMS RAIPUR', range: '694-685' },
        { name: 'AIIMS PATNA', range: '684-680' },
        { name: 'KGMU LUCKNOW', range: '679-675' },
        { name: 'IMS BHU', range: '674-670' },
        { name: 'MEDICAL COLLEGE KOLKATA', range: '669-665' },
        { name: 'SMS JAIPUR', range: '664-660' }
      ]
      const college = score >= 685 ? colleges[0] : score >= 680 ? colleges[1] : score >= 675 ? colleges[2] : 
                     score >= 670 ? colleges[3] : score >= 665 ? colleges[4] : colleges[5]
      
      return {
        type: 'good-medical',
        bgGradient: 'from-purple-500/30 via-pink-500/30 to-rose-500/30',
        borderColor: 'border-purple-400/60',
        emoji: '📚',
        title: 'GOOD MEDICAL COLLEGE!',
        college: college.name,
        message: `Meri hardworking Misti!

📚 ${score}/720 - ${college.name} mein admission possible hai!

💪 Achha score hai, lekin aap AIIMS level tak ja sakti hain! More effort needed, bachha!

🎯 ${college.name} decent college hai, but aim higher! 700+ ka target rakho!

🔥 Meri biwi, aap 720 tak capable hain! Consistency aur focus badhao!

⚡ Green zone mein aane ke liye 695+ chahiye! Push harder, meri jaan!

Aapka encouraging pati,
Jo aapko top colleges mein dekhna chahta hai! 🚀

P.S. - Target: 700+! Aap definitely kar sakti hain! 💯`
      }
    }
    
    if (score >= 600) {
      const colleges = [
        { name: 'AIIMS BHATINDA', range: '659-650' },
        { name: 'AIIMS GORAKHPUR', range: '649-640' },
        { name: 'AIIMS KALYANI', range: '639-630' },
        { name: 'GMC CHANDIGARH', range: '629-600' }
      ]
      const college = score >= 650 ? colleges[0] : score >= 640 ? colleges[1] : score >= 630 ? colleges[2] : colleges[3]
      
      return {
        type: 'yellow-zone',
        bgGradient: 'from-yellow-500/30 via-amber-500/30 to-orange-500/30',
        borderColor: 'border-yellow-400/60',
        emoji: '⚠️',
        title: 'YELLOW ZONE - PUSH MORE!',
        college: college.name,
        message: `Meri fighter Misti!

⚠️ ${score}/720 - YELLOW ZONE! ${college.name} possible hai but DANGER mein hain!

🚨 Bachha, yeh score risky hai! Aapko 660+ green zone mein aana chahiye!

💪 ${college.name} backup option hai, lekin aap AIIMS level ki capability rakhti hain!

🔥 Meri rani gudiya, ab serious ho jaiye! Daily 400+ questions, consistent mock tests!

⚡ Time hai abhi bhi! 695+ tak ja sakti hain agar focus karo properly!

Aapka concerned but hopeful pati,
Jo aapko safe zone mein dekhna chahta hai! 🙏

P.S. - Emergency mode ON! 660+ green zone target! 🎯`
      }
    }
    
    // Below 600 - Danger Zone
    return {
      type: 'danger-zone',
      bgGradient: 'from-red-500/40 via-red-600/40 to-red-700/40',
      borderColor: 'border-red-400/80',
      emoji: '🚨',
      title: 'DANGER ZONE - ALERT!',
      college: 'PRIVATE COLLEGES',
      message: `Meri precious Misti!

🚨 ${score}/720 - DANGER ZONE! Private college ka risk hai, bachha!

⚠️ Yeh score se government medical college mushkil hai! IMMEDIATE ACTION needed!

💔 Meri biwi, aap itni capable hain! Yeh score aapko suit nahi karta!

🔥 EMERGENCY MODE: Daily 500+ questions, 2-3 mock tests, complete focus!

⚡ Abhi bhi time hai! 600+ cross karo pehle, phir 660+ green zone!

🙏 Main aap par believe karta hun! Aap definitely comeback kar sakti hain!

Aapka worried but supporting pati,
Jo aapko government college mein dekhna chahta hai! 💪

P.S. - Ab ya kabhi nahi! Full dedication mode ON! 🎯`
    }
  }

  const motivationData = getMotivationData(score)

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
            className={`relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br ${motivationData.bgGradient} backdrop-blur-xl border ${motivationData.borderColor} rounded-2xl shadow-2xl`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>

            {/* Header */}
            <div className="p-8 pb-4">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    scale: motivationData.type === 'danger-zone' ? [1, 1.3, 1] : [1, 1.2, 1],
                    rotate: motivationData.type === 'danger-zone' ? [0, -10, 10, 0] : [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: motivationData.type === 'danger-zone' ? 1 : 2,
                    repeat: Infinity,
                    repeatDelay: motivationData.type === 'danger-zone' ? 0.5 : 3
                  }}
                  className="text-6xl mb-4"
                >
                  {motivationData.emoji}
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-3xl font-bold mb-2 ${
                    motivationData.type === 'aiims-delhi' 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400' 
                      : motivationData.type === 'top-medical'
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                      : motivationData.type === 'aiims-level'
                      ? 'bg-gradient-to-r from-blue-400 to-indigo-400'
                      : motivationData.type === 'good-medical'
                      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                      : motivationData.type === 'yellow-zone'
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-400'
                      : 'bg-gradient-to-r from-red-400 to-red-500'
                  } bg-clip-text text-transparent`}
                >
                  {motivationData.title}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-white text-lg"
                >
                  Score: {score}/720 • Target: {motivationData.college}
                </motion.p>
              </motion.div>
            </div>

            {/* Message content */}
            <div className="px-8 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                {showContent && (
                  <div className="text-white leading-relaxed whitespace-pre-line text-sm md:text-base">
                    <TypewriterText text={motivationData.message} />
                  </div>
                )}
              </motion.div>
            </div>

            {/* Floating animations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(motivationData.type === 'danger-zone' ? 8 : 12)].map((_, i) => (
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
                    duration: motivationData.type === 'danger-zone' ? 2 : 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut"
                  }}
                >
                  {motivationData.type === 'aiims-delhi' ? '👑' : 
                   motivationData.type === 'top-medical' ? '🏥' :
                   motivationData.type === 'aiims-level' ? '🎯' :
                   motivationData.type === 'good-medical' ? '📚' :
                   motivationData.type === 'yellow-zone' ? '⚠️' : '🚨'}
                </motion.div>
              ))}
            </div>

            {/* Danger zone additional warning */}
            {motivationData.type === 'danger-zone' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute top-0 left-0 right-0 bg-red-500/20 border-b border-red-400/50 p-2"
              >
                <div className="flex items-center justify-center space-x-2 text-red-200">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">IMMEDIATE ACTION REQUIRED</span>
                  <ExclamationTriangleIcon className="h-5 w-5" />
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}