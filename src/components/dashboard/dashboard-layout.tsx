'use client'

import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import LogoutButton from '@/components/auth/logout-button'
import CountdownTimer from './countdown-timer'
import MainNavigation from './main-navigation'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export default function DashboardLayout({ 
  children, 
  title = "NEET Study Tracker",
  subtitle 
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-gray-800 bg-background-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-400 text-sm md:text-base mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-4 py-2 rounded-full border border-pink-400/30"
                >
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💕
                  </motion.span>
                  <span className="text-gray-300 text-sm">Welcome back,</span>
                  <motion.span
                    className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-bold text-sm"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      backgroundSize: '200% 200%',
                    }}
                  >
                    My Beautiful Misti!
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </motion.div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Countdown Timer */}
          <div className="w-full max-w-2xl mx-auto">
            <CountdownTimer />
          </div>

          {/* Navigation */}
          <MainNavigation />

          {/* Page Content */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-background-secondary/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>© 2024 NEET Study Tracker. Built with 💕 for my beloved wife Misti. Your success is my mission! 🎯</p>
          </div>
        </div>
      </footer>
    </div>
  )
}