'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface AchievementPopupProps {
  isOpen: boolean
  onClose: () => void
  achievementLevel: 300 | 400
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

export default function AchievementPopup({ isOpen, onClose, achievementLevel, questionCount }: AchievementPopupProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  const achievement300Letters = [
    `My Dearest Misti,

💕 My heart is overflowing with pride and love as I write this! You've just crossed the incredible milestone of 300+ questions today - ${questionCount} questions to be exact! 

🌟 Do you realize how AMAZING you are? While others are still figuring out their study routine, you're already crushing your goals like the absolute QUEEN you are!

✨ Every single question you solve brings you one step closer to your dream of becoming Dr. Misti. I can already see you in that white coat, helping patients with that beautiful smile of yours.

🔥 Your dedication, your consistency, your unwavering determination - it all makes me fall in love with you even more every single day. You're not just my wife, you're my inspiration!

💪 Keep going, my love. NEET 2026 doesn't know what's coming for it! You're going to absolutely DEMOLISH that exam!

Forever proud of you,
Your biggest fan and loving husband 💕

P.S. - Tonight, we celebrate! You deserve all the love and appreciation in the world! 🎉`,

    `My Beautiful Misti,

🎯 ${questionCount} questions today?! Are you kidding me?! You're absolutely INCREDIBLE!

💎 My precious diamond, you're sparkling brighter than ever! Your consistency is mind-blowing and your dedication makes my heart skip beats!

🌸 Every morning I wake up grateful that I married such an extraordinary woman. You're not just studying, you're creating MAGIC!

🦋 Like a butterfly emerging from its cocoon, you're transforming into the brilliant doctor you're destined to be. Dr. Misti has such a beautiful ring to it!

🌟 Your focus, your determination, your beautiful mind - everything about you amazes me daily. You're my real-life superhero!

💕 I'm so lucky to witness your journey to greatness. Keep shining, my love!

With endless admiration,
Your devoted husband 💖

P.S. - You deserve the biggest hug and your favorite treat tonight! 🍰`,

    `My Incredible Wife,

🚀 BOOM! ${questionCount} questions conquered today! You're absolutely UNSTOPPABLE!

👑 Queen Misti is in the house! Your royal dedication to excellence leaves me speechless every single day!

🌺 Your beautiful mind is like a garden blooming with knowledge. Every question you solve is another flower in your bouquet of success!

💪 The way you tackle challenges with such grace and determination - it's pure poetry in motion! You're writing your own success story!

🎨 You're not just preparing for NEET, you're creating a masterpiece of dedication and hard work that will inspire generations!

✨ My heart swells with pride knowing that this amazing woman is MINE! You're my everything!

Bursting with love and pride,
Your biggest cheerleader 📣

P.S. - I'm planning a surprise to match your incredible achievement! 🎁`,

    `My Darling Misti,

🌈 ${questionCount} questions today! You've painted another rainbow of success across my heart!

💝 Every question you solve is like a love letter to your dreams. And watching you chase those dreams? That's my favorite love story!

🦄 You're as rare and magical as a unicorn, my love! Your dedication is otherworldly and your spirit is absolutely enchanting!

🌙 Even the moon and stars are jealous of how brightly you shine! Your intelligence illuminates everything around you!

🎪 Life with you is like the most beautiful circus - full of wonder, excitement, and jaw-dropping performances like today's achievement!

💕 I fall in love with you all over again every time I see your determination in action!

Madly in love with your brilliance,
Your spellbound husband ✨

P.S. - Tonight, we dance to celebrate your magnificence! 💃`,

    `My Phenomenal Misti,

⚡ ${questionCount} questions! You just struck lightning with your brilliance today!

🏆 Champions are made in moments like these, and baby, you're the ULTIMATE CHAMPION! Your consistency is legendary!

🌊 Like a powerful ocean wave, your determination crashes through every obstacle! Nothing can stop the force that is my wife!

🔥 Your passion burns brighter than a thousand suns! The way you pursue excellence sets my soul on fire with admiration!

🎯 Bullseye after bullseye! Your precision and focus are absolutely mind-blowing! You hit every target you set!

💖 I'm the luckiest man alive to witness this incredible journey of yours!

In complete awe of you,
Your thunderstruck husband ⚡

P.S. - You've earned the most relaxing evening ever! Let me pamper you! 👸`,

    `My Extraordinary Misti,

🎭 ${questionCount} questions today! You're the star of the most incredible performance I've ever witnessed!

🌻 Like a sunflower always turning toward the sun, you always turn toward excellence! Your positivity lights up my world!

🎵 Your dedication creates the most beautiful symphony in my heart! Every achievement is a note in our love song!

🦅 You soar higher than eagles, my love! Your ambition and drive take my breath away every single day!

🌟 You're not just reaching for the stars - you're becoming one! The brightest star in my universe!

💕 Every day with you is a blessing, but days like today remind me I married an absolute GODDESS!

Completely mesmerized by you,
Your devoted admirer 🌹

P.S. - Tomorrow I'm making your favorite breakfast to fuel another amazing day! 🥞`
  ]

  const achievement400Letters = [
    `My Extraordinary Misti,

🚀 STOP EVERYTHING! My incredible wife just achieved the IMPOSSIBLE - ${questionCount} questions in a single day! 

👑 You're not just studying, you're DOMINATING! You're not just preparing, you're CONQUERING! You're not just dreaming, you're ACHIEVING!

🔥 400+ questions?! Do you know how INSANE that is? You've just entered the league of NEET LEGENDS! I'm literally getting goosebumps writing this!

💎 My diamond, my precious gem, you're shining brighter than all the stars combined! Your dedication is beyond human - you're operating on a different level altogether!

🏆 Future doctors across India will look up to your story. "Remember Misti? The one who used to solve 400+ questions daily?" That's going to be your legacy!

⚡ You're not just my wife anymore - you're a FORCE OF NATURE! You're unstoppable, unbreakable, and absolutely PHENOMENAL!

🎯 NEET 2026 is going to be a JOKE for you! You're going to score so high that they'll have to create new ranks just for you!

💕 I'm running out of words to express how proud I am. You're my hero, my inspiration, my everything!

Keep being the ABSOLUTE LEGEND that you are!

Your awestruck husband who loves you to infinity and beyond! 🌟

P.S. - I'm planning something VERY special to celebrate this achievement! Get ready! 🎊`,

    `My LEGENDARY Misti,

🌋 ${questionCount} QUESTIONS?! You just caused an EARTHQUAKE of amazement in my heart!

🦸‍♀️ SUPERHERO ALERT! My wife just broke the laws of physics with her incredible brain power! You're officially SUPERHUMAN!

🌌 You've transcended beyond mortal limits! You're operating in a dimension where only LEGENDS exist! Welcome to the Hall of Fame, baby!

💥 BOOM! BANG! POW! Every question you solved was like a superhero punch to mediocrity! You OBLITERATED every challenge!

🎪 Ladies and gentlemen, witness the GREATEST SHOW ON EARTH - Misti's mind in action! Standing ovation from the entire universe!

🔮 You're not just magical, you're MYTHICAL! Dragons would bow down to your dedication! Unicorns would ask for your autograph!

🚁 Houston, we have a PROBLEM - my wife is TOO AMAZING for this planet! She needs her own galaxy!

💫 You've officially broken the AWESOME-METER! I need to invent new words to describe your magnificence!

Completely MIND-BLOWN by your greatness,
Your husband who's still picking his jaw up from the floor! 🤯

P.S. - I'm declaring today a NATIONAL HOLIDAY in honor of your achievement! 🏆`,

    `My PHENOMENAL Misti,

🎆 ${questionCount} questions! You just set off FIREWORKS in the universe! Every star is celebrating YOU!

🏰 You've built a CASTLE of knowledge today! Every question was a brick in your fortress of excellence!

🌪️ You're a TORNADO of brilliance! Sweeping away all doubts and leaving only PURE GENIUS in your wake!

🎯 BULLSEYE after BULLSEYE! Your accuracy is so perfect, even Olympic archers are taking notes!

🚀 NASA called - they want to study your brain because it's more powerful than their rockets!

🎨 You're not just solving questions, you're creating ART! The Mona Lisa of NEET preparation!

⚡ Zeus is jealous of your LIGHTNING-FAST thinking! Thor wants to borrow your brain power!

🌟 You've officially become a CONSTELLATION in the sky of success! Future generations will navigate by your brilliance!

Bowing down to your SUPREME AWESOMENESS,
Your husband who's running out of superlatives! 👑

P.S. - I'm writing to Guinness World Records about your achievement! 📚`,

    `My UNSTOPPABLE Misti,

🌊 ${questionCount} questions! You just created a TSUNAMI of success that's flooding the entire world with inspiration!

🦁 The LIONESS has ROARED! Your determination echoes through the mountains and valleys of excellence!

🎪 Step right up! Witness the most SPECTACULAR performance in human history! My wife defying all limits!

🔥 You're not just on fire - you ARE the fire! You're the SUN itself, burning bright with unstoppable energy!

🎭 Shakespeare would weep at the beauty of your dedication! This is POETRY in motion!

🏔️ You've climbed EVEREST today! Not the mountain - the EVEREST of academic achievement!

⚔️ You're a WARRIOR PRINCESS! Every question was a battle, and you WON EVERY SINGLE ONE!

🌈 You've painted the most beautiful rainbow across the sky of possibility! Every color represents your brilliance!

Saluting your LEGENDARY STATUS,
Your husband who's officially your biggest FAN! 📣

P.S. - I'm commissioning a statue in your honor! 🗿`,

    `My INCREDIBLE Misti,

🎵 ${questionCount} questions! You just composed the most BEAUTIFUL SYMPHONY of success!

🦋 You've metamorphosed into a BUTTERFLY of brilliance! Your transformation is absolutely BREATHTAKING!

🌺 You're blooming like the most EXOTIC flower in the garden of excellence! Your beauty radiates knowledge!

🎨 Picasso, Van Gogh, Da Vinci - they all pale in comparison to the MASTERPIECE you created today!

🌙 You've lassoed the MOON with your determination! The entire cosmos is applauding your achievement!

🎪 You're the RINGMASTER of your own success circus! Every act more spectacular than the last!

💎 You're not just a diamond - you're the ENTIRE JEWELRY STORE! Sparkling with infinite brilliance!

🚁 You've taken flight on the wings of PURE GENIUS! Soaring higher than eagles dream!

Intoxicated by your MAGNIFICENCE,
Your husband who's drunk on your success! 🥂

P.S. - Tonight we feast like ROYALTY to celebrate your ROYAL achievement! 👸`,

    `My GODLIKE Misti,

⚡ ${questionCount} questions! You just SHATTERED the fabric of reality with your COSMIC brain power!

🌌 You've transcended MORTAL LIMITS! You're operating in the DIVINE realm of pure excellence!

🔮 WIZARDS are studying your methods! SORCERERS want your secrets! You've mastered MAGIC itself!

🎆 You didn't just break records - you OBLITERATED them into STARDUST! Then created NEW GALAXIES from the remains!

🏆 OLYMPIAN GODS are bowing down! You've achieved what even MYTHOLOGY couldn't imagine!

🌋 You've caused VOLCANIC ERUPTIONS of inspiration across the planet! Everyone's catching your SUCCESS FEVER!

🎭 This isn't just achievement - this is LEGENDARY FOLKLORE in the making! Bards will sing of this day!

💫 You've become a SUPERNOVA of brilliance! Your light will guide students for CENTURIES!

Worshipping at the altar of your GREATNESS,
Your husband who's witnessed a MIRACLE! 🙏

P.S. - I'm building a TEMPLE in your honor! All hail Queen Misti! 👑`
  ]

  const getRandomLetter = (letters: string[]) => {
    const randomIndex = Math.floor(Math.random() * letters.length)
    return letters[randomIndex]
  }

  const currentLetter = achievementLevel === 300 
    ? getRandomLetter(achievement300Letters) 
    : getRandomLetter(achievement400Letters)
  const bgGradient = achievementLevel === 300 
    ? 'from-pink-500/20 via-purple-500/20 to-indigo-500/20'
    : 'from-yellow-500/20 via-orange-500/20 to-red-500/20'
  
  const borderColor = achievementLevel === 300 ? 'border-pink-400/50' : 'border-yellow-400/50'

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
                  {achievementLevel === 300 ? '🎉' : '🚀'}
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-3xl font-bold mb-2 ${
                    achievementLevel === 300 
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400' 
                      : 'bg-gradient-to-r from-yellow-400 to-orange-400'
                  } bg-clip-text text-transparent`}
                >
                  {achievementLevel === 300 ? 'INCREDIBLE ACHIEVEMENT!' : 'LEGENDARY PERFORMANCE!'}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-white text-lg"
                >
                  {questionCount} Questions Completed Today!
                </motion.p>
              </motion.div>
            </div>

            {/* Letter content */}
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

            {/* Floating hearts animation */}
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
                  {achievementLevel === 300 ? '💕' : '⭐'}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}