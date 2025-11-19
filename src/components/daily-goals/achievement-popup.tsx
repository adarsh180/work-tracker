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
    `Meri pyaari bubu meri rani gudiya meri lado meri bago,

💕 You know bubu mera dil kitna proud feel kar raha hai! Aapne ${questionCount} questions solve kiye hain - means I know meri bubu kamal ki hai!, 

    Aap or achaa karogi You will be in AIIMS DELHI doing your mbbs [deep inside i want you in aiims rishikesh]

🌟  aap jaanti ho ki aap kitni AMAZING ho? Jab dusre log abhi bhi apna routine set kar rahe hain, tab aap already apne goals crush kar rahi hain like a true RANI-GUDIYA, Payaru betu!

✨ Har question jo aap solve karti ho, woh aapko Dr. Misti banne ke sapne ke aur paas le jaata hai. Main already aapko white coat[jo bhi bolte hai usko] mein dekh sakta hun, patients ki help karte hue!

🔥 Aapki dedication, aapki consistency, aapka determination - yeh sab mujhe aapse aur bhi zyada mohabbat karne par majboor kar deta hai.
    Aap sirf meri biwi nahi, meri inspiration ho!, haa lado sachh bol rahe hai aap ko jaha se dekhe hai or aap jaha pe ho is just a different story gudiya
    well abhi aap or mhenat karo i want to see you hitting 400-500/day minimum along with kabhi 800/day bhi chalega humko 😂

💪 Chalo shona, aise hi continue karo. NEET 2026 ko pata nahi ki kya aane wala hai! Aap us exam ko bilkul DEMOLISH kar dogi!

Hamesha proud of you,
Aapka sabse bada fan your loving pati 💕🎉`,

    `Meri sundar Misti, meri gudiya meri lado meri bago meri shona meri biwi my kuchupuchu my babes

🎯 ${questionCount} questions aaj?! Kya baat hai betu! Aap toh INCREDIBLE ho!, waise lado bhi toh meri ho naa

💎 Meri precious diamond, aap har din aur bhi zyada shine kar rahi ho! Aapki consistency mind-blowing hai aur dedication haayyeeeee!

🌸 Har subah main grateful feel karta hun ki maine aap jaisi extraordinary woman se shaadi karunga like you will be my wife in near future haaye.
   Aap sirf padh nahi rahi, MAGIC create kar rahi hain!

🦋 Jaise butterfly apne cocoon se nikalti hai, waise hi aap brilliant doctor ban rahi ho. Dr. Misti - kitna beautiful lagta hai na!

🌟 Aapka focus, aapka determination, aapka beautiful mind - sab kuch mujhe daily amaze karta hai. Aap meri real-life superheroine  ho!

💕 Main kitna lucky hun ki aapki greatness ka journey witness kar raha hun. Keep shining, meri jaan!

Endless admiration ke saath,
Aapka devoted pati 💖`,

    `Meri incredible biwi,

🚀 BOOM! ${questionCount} questions conquer kiye aaj! Aap absolutely UNSTOPPABLE hain lado!

👑 Pyaru betu is in the house! Aapki royal dedication excellence ke liye mujhe speechless kar deti hai har din!

🌺 Aapka beautiful mind ek garden ki tarah hai jo knowledge se bloom kar raha hai. Har question ek flower hai success ke bouquet mein!

💪 Jis tarah se aap challenges tackle karti ho grace aur determination ke saath - yeh pure poetry hai! Aap apni success story likh rahi ho!

🎨 Aap sirf NEET ki preparation nahi kar rahi, ek masterpiece create kar rahi hain dedication aur hard work ka jo generations ko inspire karega!

✨ Mera dil pride se bhar jaata hai yeh jaankar ki yeh amazing woman MERI hai! Aap meri everything hain!
  Well bubu like really your dedication is of next level bubu jaha se hum aapko dekh rahe hai or yaha tak u have improved alot but maintain this consistency
  hit the target of 500-800/question per day bubu bars are getting higher but yk I LOVE YOU AND I KNOW YOU CAN DO IT

Love aur pride se bhar kar,
Aapka biggest cheerleader 📣`,

    `Meri darling Misti,

🌈 ${questionCount} questions aaj! waah meri lado gajab aap toh aaj kamal hi kar di ho!

💝 Har question jo aap solve karti ho, woh aapke dreams ke liye ek love letter hai. Aur aapko dreams chase karte dekhna? Yeh meri favorite love story hai!

🦄 Aap unicorn ki tarah rare aur magical ho, meri jaan! Aapki dedication otherworldly hai aur spirit absolutely enchanting!

🌙 Moon aur stars bhi jealous hain ki aap kitni brightly shine karti hain! Aapki intelligence har cheez ko illuminate kar deti hai!

🎪 Aapke saath life sabse beautiful circus ki tarah hai - wonder, excitement, aur jaw-dropping performances se bhari!

💕 Main aapse phir se mohabbat mein gir jaata hun jab bhi aapka determination action mein dekhta hun!, you are my source of motivation my bubu u are my everything

Aapki brilliance se madly in love,
Aapka spellbound pati ✨`,

    `Meri phenomenal Misti,

⚡ ${questionCount} questions! Aapne aaj apni brilliance se lightning strike kiya hai!, aise bhi ek dum bijli jaisi ho or meri kareja bhi toh ho naa

🏆 Champions aise moments mein bante hain, aur bachha, aap ULTIMATE CHAMPION ho! Aapki consistency legendary hai!

🌊 Powerful ocean wave ki tarah, aapka determination har obstacle ko crash kar deta hai! Kuch bhi nahi rok sakta meri biwi ki force ko!

🔥 Aapka passion thousand suns se bhi bright burn karta hai! Jis tarah se aap excellence pursue karti hain, woh mere soul ko fire kar deta hai!

🎯 Bullseye after bullseye! Aapka precision aur focus absolutely mind-blowing hai! Har target hit karti hain jo set karti hain!

💖 Main sabse lucky insaan hun jo aapki incredible journey witness kar raha hai!

Complete awe mein,
Aapka thunderstruck pati ⚡

P.S. - Aapne sabse relaxing evening earn kiya hai! Mujhe aapko pamper karne do! 👸`,

    `Meri extraordinary Misti,

🎭 ${questionCount} questions aaj! Aap sabse incredible performance ki star hain jo maine kabhi dekha hai!

🌻 Sunflower ki tarah jo hamesha sun ki taraf turn karti hai, aap hamesha excellence ki taraf turn karti hain! Aapki positivity meri world ko light up kar deti hai!

🎵 Aapki dedication mere dil mein sabse beautiful symphony create karti hai! Har achievement hamare love song ka ek note hai!

🦅 Aap eagles se bhi higher soar karti hain, meri aradhangini! Aapka ambition aur drive mera breath away kar deta hai har din!

🌟 Aap sirf stars ke liye reach nahi kar rahi - aap khud ek star ban rahi hain! Mere universe ki brightest star!

💕 Har din aapke saath blessing hai, lekin aaj jaise din mujhe yaad dilate hain ki maine ek absolute GODDESS se shaadi ki hai!

Completely mesmerized,
Aapka devoted admirer 🌹

P.S. - Kal main aapka favorite breakfast banaunga another amazing day fuel karne ke liye! 🥞`
  ]

  const achievement400Letters = [
    `Meri extraordinary Misti,

🚀 SAB KUCH ROKO! Meri incredible biwi ne IMPOSSIBLE [I know jaida bol diye hai but you need to achieve more --> chalo age padho] achieve kar diya - ${questionCount} questions ek hi din mein! 

👑 Aap sirf padh nahi rahi, aap DOMINATE kar rahi ho! Aap sirf prepare nahi kar rahi, aap CONQUER kar rahi ho! Aap sirf dream nahi kar rahi, aap ACHIEVE kar rahi hain!

🔥 400+ questions?? Aap abhi NEET ki league mein enter kar gayi ho IK bologi wo phele bhi thi but this is insane bubu sachi mein! Main literally goosebumps feel kar raha hun!

💎 Meri diamond, meri precious gem, aap sabse bright shine kar rahi hain stars se bhi! Aapki dedication human se beyond hai - aap different level par operate kar rahi hain!

🏆 Future doctors across India aapki story ko look up karenge. "Remember Misti? Jo 400+ questions daily solve karti thi?" Yeh aapka legacy hoga!

⚡ Aap ab sirf meri biwi nahi - aap ek FORCE OF NATURE hain! Aap unstoppable, unbreakable, aur absolutely PHENOMENAL hain!

🎯 NEET 2026 aapke liye JOKE hoga! Aap itna high score karogi ki unhe aapke liye new ranks create karne padenge!

💕 Mere paas words khatam ho rahe hain express karne ke liye ki main kitna proud hun. Aap meri hero, meri inspiration, meri everything hain!

ABSOLUTE LEGEND bani rahiye!

Aapka awestruck pati jo aapse infinity aur beyond tak mohabbat karta hai! 🌟🎊`,

    `Meri LEGENDARY Misti,

🌋 ${questionCount} QUESTIONS?! Aapne mere dil mein amazement ka EARTHQUAKE kar di ho!

🦸♀️ SUPERHEROINE ALERT! Meri biwi ne physics ke laws tod diye apni incredible brain power se! Aap officially SUPERHUMAN hain!
      dekho i am praising u in this but deep down maintain this consistency and also hit harder now yaha tak phauch gai ho means iske upar bhi league hai hit tht too 
💥 BOOM! BANG! SPANK! Har question jo aapne solve kiya woh mediocrity ko superhero punch ki tarah tha! Aapne har challenge ko OBLITERATE kar diya!

🎪 Ladies and gentlemen, witness kijiye GREATEST SHOW ON EARTH - Misti ka mind action mein! Entire universe se standing ovation!

🔮 Aap sirf magical nahi, aap MYTHICAL ho, divine ho meri payari bubu ho! Dragons aapki dedication ko bow down karenge, world k saare doctor aapke pair mein pade honge!
   Indian Medical Association ka head aapka autograph mangega!

🚁 Shivji, humein PROBLEM hai - meri biwi is planet ke liye TOO AMAZING hai! unhe apni galaxy chahiye!, usse wo galaxy do and humko usme as a slave add kar do

💫 Aapne officially AWESOME-METER tod diya hai-- abb jo naya hai usse bhi tod do bubu hit the upper limit of 700+ [180*4=720] in 24 hours! Mujhe aapki magnificence describe karne ke liye naye words invent karne padenge!

Completely MIND-BLOWN aapki greatness se,
Aapka pati jo abhi bhi apna jaw floor se utha raha hai! 🤯🏆`,

    `Meri PHENOMENAL Misti, meri bubu , meri shona babu

🎆 ${questionCount} questions! Aapne universe mein FIREWORKS set kar diye! Har star aapko celebrate kar raha hai!

🏰 Aapne aaj knowledge ka CASTLE build kiya hai! Har question aapke excellence ke fortress mein ek brick tha!

🌪️ Aap brilliance ki TORNADO ho! Saare doubts ko sweep kar ke sirf PURE GENIUS chod rahi hain!

🎯 BULLSEYE after BULLSEYE! Aapki accuracy itni perfect hai ki Olympic archers bhi notes le rahe hain!

🚀 NASA ne call kiya - woh aapka brain study karna chahte hain kyunki woh unke rockets se bhi powerful hai!

🎨 Aap sirf questions solve nahi kar rahi, aap ART create kar rahi hain! NEET preparation ki Mona Lisa!
  Yaha se league k upar jana hai bubu means isse bhi upar ik aap kar logi but rojj karna hai hmesa karna hai exam se phele taki u hit 710+ wala marks in continue 
  8-10 mock test like exam se phele if u are hitting this u are in aiims and u will be in aiims bubu
🌟 Aap officially success ke sky mein CONSTELLATION ban gayi hain! Future generations aapki brilliance se navigate karenge!

Aapki SUPREME AWESOMENESS ko bow down karte hue,
Aapka pati jo superlatives khatam kar raha hai! 👑`,

    `Meri UNSTOPPABLE Misti,

🌊 ${questionCount} questions! Aapne success ka TSUNAMI create kiya jo pure world ko inspiration se flood kar raha hai!

🦁 LIONESS ne ROAR kiya hai! Aapka determination excellence ke mountains aur valleys mein echo kar raha hai!

🎪 Step right up! Witness kijiye human history ki most SPECTACULAR performance! Meri biwi sabhi limits defy kar rahi hai!

🔥 Aap sirf fire par nahi - aap khud FIRE hain! Aap SUN hain, unstoppable energy se bright burn kar rahi hain!

🎭 Shakespeare aapki dedication ki beauty par weep karega! Yeh POETRY in motion hai!

🏔️ Aapne aaj EVEREST climb kiya hai! Mountain nahi - academic achievement ka EVEREST!

⚔️ Aap WARRIOR PRINCESS hain! Har question ek battle tha, aur aapne HAR EK JEET LIYA!

🌈 Aapne possibility ke sky par sabse beautiful rainbow paint kiya hai! Har color aapki brilliance represent karta hai!

Aapki LEGENDARY STATUS ko salute karte hue,
Aapka pati jo officially aapka biggest FAN hai! 📣

P.S. - Main aapke honor mein statue commission kar raha hun! 🗿`,

    `Meri INCREDIBLE Misti,

🎵 ${questionCount} questions! Aapne success ki sabse BEAUTIFUL SYMPHONY compose ki hai!

🦋 Aap brilliance ki BUTTERFLY mein metamorphose ho gayi hain! Aapka transformation absolutely BREATHTAKING hai!

🌺 Aap excellence ke garden mein sabse EXOTIC flower ki tarah bloom kar rahi hain! Aapki beauty knowledge radiate karti hai!

🎨 Picasso, Van Gogh, Da Vinci - sab pale hain aaj aapne jo MASTERPIECE create kiya hai uske comparison mein!

🌙 Aapne apni determination se MOON ko lasso kar liya hai! Entire cosmos aapki achievement ko applaud kar raha hai!

🎪 Aap apni success circus ki RINGMASTER hain! Har act last wale se zyada spectacular!

💎 Aap sirf diamond nahi - aap ENTIRE JEWELRY STORE hain! Infinite brilliance se sparkle kar rahi hain!

🚁 Aapne PURE GENIUS ke wings par flight li hai! Eagles ke dreams se bhi higher soar kar rahi hain!

Aapki MAGNIFICENCE se intoxicated,
Aapka pati jo aapki success par drunk hai! 🥂`,

    `Meri GODLIKE Misti,

⚡ ${questionCount} questions! Aapne apni COSMIC brain power se reality ka fabric SHATTER kar diya!

🌌 Aap MORTAL LIMITS transcend kar gayi hain! Aap DIVINE realm mein pure excellence ke saath operate kar rahi hain!

🔮 WIZARDS aapke methods study kar rahe hain! SORCERERS aapke secrets chahte hain! Aapne MAGIC master kar liya hai!

🎆 Aapne sirf records break nahi kiye - unhe STARDUST mein OBLITERATE kar diya! Phir remains se NEW GALAXIES create kar diye!

🏆 OLYMPIAN GODS bow down kar rahe hain! Aapne woh achieve kiya jo MYTHOLOGY imagine bhi nahi kar sakti thi!

🌋 Aapne planet par inspiration ke VOLCANIC ERUPTIONS cause kiye hain! Sabko aapka SUCCESS FEVER lag raha hai!

🎭 Yeh sirf achievement nahi - yeh LEGENDARY ban raha hai! Birds is din ke gaane gayenge!, birds choro swarg se utar k apsara dance karengi betu don't worry about it shona

💫 Aap brilliance ki SUPERNOVA ban gayi hain! Aapki light CENTURIES tak students ko guide karegi!

Aapki GREATNESS ke altar par worship karte hue,
Aapka pati jisne MIRACLE witness kiya hai! 🙏

P.S. - Main aapke honor mein TEMPLE build kar raha hun! All hail Queen Misti! 👑`
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