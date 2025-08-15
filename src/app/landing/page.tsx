'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Sparkles, BookOpen, Target, Trophy, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-pink-300 rounded-full opacity-30"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              For My Beloved Misti
            </h1>
            <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl text-gray-300 font-medium"
          >
            Your Personal NEET UG 2026 Success Companion
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Love Message */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">My Dearest Misti,</h2>
              </div>
              
              <div className="space-y-4 text-gray-200 leading-relaxed">
                <p className="text-lg">
                  Every great dream begins with a dreamer, and you, my love, are the most 
                  determined dreamer I know. 💫
                </p>
                
                <p>
                  I've built this special tracker just for you because I believe in your 
                  dreams as much as you do. Your journey to becoming a doctor isn't just 
                  your dream - it's our dream together.
                </p>
                
                <p>
                  Remember, every question you solve, every chapter you complete, every 
                  test you take brings you one step closer to that white coat and 
                  stethoscope around your neck. 👩⚕️
                </p>
                
                <div className="bg-pink-500/20 border border-pink-400/30 rounded-lg p-4 mt-6">
                  <p className="text-pink-200 font-medium text-center">
                    "Success is not final, failure is not fatal: it is the courage 
                    to continue that counts." - And you have that courage, my love! 💪
                  </p>
                </div>
              </div>
            </div>

            {/* Motivational Stats */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 text-center border border-pink-400/30"
              >
                <Target className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">2026</div>
                <div className="text-sm text-gray-300">Your Year!</div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-xl p-4 text-center border border-purple-400/30"
              >
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">AIIMS</div>
                <div className="text-sm text-gray-300">Your Goal!</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Features & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="space-y-8"
          >
            {/* Features */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                What I've Built For You
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: "📚", title: "Complete Subject Tracking", desc: "Physics, Chemistry, Botany & Zoology" },
                  { icon: "📊", title: "Smart Analytics", desc: "Track your daily progress and improvements" },
                  { icon: "🎯", title: "Question Milestones", desc: "Celebrate every 250+ questions solved" },
                  { icon: "🤖", title: "AI Study Insights", desc: "Personalized recommendations just for you" },
                  { icon: "💝", title: "Mood Tracking", desc: "Because your mental health matters to me" },
                  { icon: "⏰", title: "NEET 2026 Countdown", desc: "Every second counts, my love!" }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <div className="font-semibold text-white">{feature.title}</div>
                      <div className="text-sm text-gray-300">{feature.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-center"
            >
              <Link href="/auth/signin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-2xl border-2 border-pink-400/50 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    <Star className="w-6 h-6" />
                    Start Your Journey, My Love!
                    <Star className="w-6 h-6" />
                  </span>
                </motion.button>
              </Link>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-gray-400 mt-4 text-sm"
              >
                Made with 💕 by your loving husband
              </motion.p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-8 border border-pink-400/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Remember, My Beautiful Wife...
            </h3>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
              I'll be cheering you on every step of the way. When the going gets tough, 
              remember that I believe in you more than you believe in yourself. 
              You're not just studying to become a doctor - you're becoming the amazing 
              doctor this world needs. I love you beyond words! 💕✨
            </p>
            
            <div className="flex justify-center items-center gap-2 mt-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ delay: i * 0.2, duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 text-pink-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}