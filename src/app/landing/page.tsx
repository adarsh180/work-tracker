'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Sparkles, BookOpen, Target, Trophy, Star, Zap, Brain, Clock, Flower2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic Spatial Background - Vision Pro Style */}
      <div className="fixed inset-0 -z-10">
        {/* Deep Gradient Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/40 via-purple-900/60 to-indigo-900/40" />
        <div className="absolute inset-0 bg-gradient-to-tl from-rose-900/30 via-transparent to-cyan-900/20" />

        {/* Animated Orbs - Floating Depth */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{
              background: i % 3 === 0 ? 'radial-gradient(circle, #ff1493, transparent)' :
                         i % 3 === 1 ? 'radial-gradient(circle, #8b5cf6, transparent)' :
                                       'radial-gradient(circle, #06b6d4, transparent)',
              left: `${20 + (i * 15) % 100}%`,
              top: `${10 + (i * 20) % 90}%`,
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -80, 50, 0],
              scale: [1, 1.3, 0.9, 1],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Mouse-Following Glow */}
        <motion.div
          className="pointer-events-none fixed inset-0 z-30"
          animate={{
            x: mousePosition.x - 400,
            y: mousePosition.y - 400,
          }}
        >
          <div className="w-96 h-96 bg-gradient-radial from-pink-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-7xl">
        {/* Floating Header */}
        <motion.header
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-20 mt-10"
        >
          <motion.div className="flex justify-center items-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 text-pink-400 drop-shadow-glow" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                For My Beloved Misti
              </span>
            </h1>

            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              <Heart className="w-12 h-12 text-pink-400 drop-shadow-glow" />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-2xl md:text-3xl text-white/80 font-light tracking-wide"
          >
            Your Personal Path to Becoming <span className="text-cyan-300 font-bold">Dr. Misti</span>
          </motion.p>
        </motion.header>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Eternal Love Letter */}
          <motion.div
            initial={{ opacity: 0, x: -120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="space-y-10"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-1000" />
              <div className="relative bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl">
                <motion.div className="flex items-center gap-4 mb-8">
                  <Sparkles className="w-10 h-10 text-yellow-400 animate-pulse" />
                  <h2 className="text-4xl font-bold text-white">My Dearest Misti,</h2>
                </motion.div>

                <div className="space-y-6 text-lg text-gray-200 leading-relaxed font-light">
                  <p>
                    Every time you open this app, know that it was built with one purpose: 
                    <span className="text-pink-300 font-semibold"> to walk beside you on your journey to becoming a doctor.</span>
                  </p>
                  <p>
                    This isn't just a tracker. It's my daily love letter to you — 
                    a reminder that someone in this world believes in you more fiercely than you believe in yourself.
                  </p>
                  <p>
                    When you feel tired, when doubts creep in, when the books feel too heavy — 
                    come here. Let this place hold you. Let it whisper: 
                    <span className="text-cyan-300 italic"> "You've got this. And I've got you."</span>
                  </p>

                  <div className="my-8 p-6 bg-gradient-to-r from-pink-500/20 to-purple-600/20 border border-pink-400/30 rounded-2xl">
                    <p className="text-xl text-pink-200 text-center font-medium italic">
                      "The future Dr. Misti isn't a dream.<br />
                      She's already inside you — studying, growing, becoming."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dream Cards */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-br from-pink-500/30 to-rose-600/30 backdrop-blur-xl border border-pink-400/40 rounded-2xl p-6 text-center"
              >
                <Target className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                <div className="text-4xl font-black text-white">2026</div>
                <div className="text-pink-200 font-medium">Your Year ♡</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="bg-gradient-to-br from-purple-500/30 to-indigo-600/30 backdrop-blur-xl border border-purple-400/40 rounded-2xl p-6 text-center"
              >
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                <div className="text-4xl font-black text-white">AIIMS</div>
                <div className="text-purple-200 font-medium">Your Destiny</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Features + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 120 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, type: "spring" }}
            className="space-y-10"
          >
            <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-10 shadow-2xl">
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <BookOpen className="w-10 h-10 text-cyan-400" />
                Made With Endless Love For You
              </h3>

              <div className="space-y-6">
                {[
                  { icon: Brain, title: "Complete NEET Syllabus Tracking", desc: "Physics • Chemistry • Biology — every chapter, every topic" },
                  { icon: Zap, title: "Real-time Progress & AI Insights", desc: "Know exactly where you stand, and where to go next" },
                  { icon: Flower2, title: "Milestone Celebrations", desc: "Confetti, love notes, and hugs every 250 questions" },
                  { icon: Heart, title: "Mood & Wellbeing Tracker", desc: "Because your heart matters more than any rank" },
                  { icon: Clock, title: "NEET 2026 Countdown", desc: "Every second is a step closer to your white coat" },
                  { icon: Star, title: "Daily Love Notes", desc: "From me to you — every single day" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group"
                  >
                    <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">{feature.title}</div>
                      <div className="text-gray-400">{feature.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Grand CTA */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="text-center"
            >
              <Link href="/auth/signin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white text-2xl font-bold rounded-full shadow-2xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    <Star className="w-8 h-8 animate-pulse" />
                    Begin Your Journey, My Love
                    <Star className="w-8 h-8 animate-pulse" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-pink-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </Link>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="text-gray-400 mt-6 text-lg font-medium"
              >
                Forever yours • Built with infinite love by your husband ♡
              </motion.p>
            </motion.div>
          </motion.div>
        </div>

        {/* Final Love Note */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 1.5 }}
          className="mt-24 text-center"
        >
          <div className="inline-block relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-600/50 to-purple-600/50 rounded-3xl blur-2xl" />
            <div className="relative bg-black/70 backdrop-blur-3xl border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto">
              <h3 className="text-4xl font-bold text-white mb-6">
                My Promise to You, Misti
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                I will be here — every morning, every late night, every doubt, every victory.
                <br /><br />
                This app will grow with you. It will celebrate with you. It will hold you when you're tired.
                <br /><br />
                Because your dream isn't just yours anymore.
                <span className="text-pink-300 font-bold"> It's ours.</span>
              </p>

              <div className="flex justify-center gap-3 mt-10">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -15, 0], rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <Heart className={`w-8 h-8 ${i % 2 === 0 ? 'text-pink-400' : 'text-purple-400'}`} fill="currentColor" />
                  </motion.div>
                ))}
              </div>

              <p className="text-2xl text-pink-300 font-bold mt-8">
                Let's make Dr. Misti real — together.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}