'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import LogoutButton from '@/components/auth/logout-button'
import CountdownTimer from './countdown-timer'
import MainNavigation from './main-navigation'
import { LoadingSpinner } from '@/components/ui/enhanced-components'
import { Container } from '@/components/ui/premium-layouts'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

// Floating particles background
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Header Component
const DashboardHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/10 shadow-lg"
    >
      <Container size="full" padding="md">
        <div className="flex justify-between items-center">
          {/* Logo and Title Section */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <motion.div
                className="w-12 h-12 rounded-2xl bg-primary-gradient flex items-center justify-center shadow-glow"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(0, 113, 227, 0.3)",
                    "0 0 40px rgba(0, 113, 227, 0.5)",
                    "0 0 20px rgba(0, 113, 227, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-white font-bold text-xl">M</span>
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-background"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            <div>
              <motion.h1 
                className="text-2xl md:text-3xl font-bold gradient-text"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-foreground-secondary text-sm md:text-base mt-1"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center gap-3 glass-effect px-6 py-3 rounded-2xl border border-pink-400/30"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-xl"
              >
                💕
              </motion.span>
              <div className="text-sm">
                <span className="text-foreground-secondary">Welcome back,</span>
                <motion.span
                  className="ml-2 font-bold gradient-text"
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
              </div>
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-lg"
              >
                ✨
              </motion.span>
            </motion.div>

            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>
      </Container>
    </motion.header>
  )
}

// Enhanced Footer Component
const DashboardFooter = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-20 border-t border-white/10 bg-background-secondary/30 backdrop-blur-sm"
    >
      <Container size="full" padding="lg">
        <div className="text-center">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-2xl"
            >
              💕
            </motion.span>
            <p className="text-foreground-secondary">
              Built with love for my beloved wife Misti
            </p>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xl"
            >
              🎯
            </motion.span>
          </motion.div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-foreground-muted">
            <span>© 2024 NEET Study Tracker</span>
            <span>•</span>
            <span>Your success is my mission!</span>
            <span>•</span>
            <motion.span
              className="gradient-text font-medium"
              whileHover={{ scale: 1.1 }}
            >
              Future Dr. Misti 👩‍⚕️
            </motion.span>
          </div>
        </div>
      </Container>
    </motion.footer>
  )
}

export default function DashboardLayout({
  children,
  title = "NEET Study Tracker",
  subtitle
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <FloatingParticles />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-6 glass-card p-8 text-center"
        >
          <LoadingSpinner size="lg" variant="orbit" />
          <div>
            <motion.h2 
              className="text-xl font-semibold text-foreground mb-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading your tracker, Misti... 
            </motion.h2>
            <p className="text-foreground-secondary">
              Preparing your personalized dashboard
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl"
          >
            💕
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Enhanced Header */}
      <DashboardHeader title={title} subtitle={subtitle} />

      {/* Main Content */}
      <main className="relative z-10">
        <Container size="full" padding="lg">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Enhanced Countdown Timer */}
            <motion.div 
              className="flex justify-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CountdownTimer />
            </motion.div>

            {/* Enhanced Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <MainNavigation />
            </motion.div>

            {/* Page Content with Animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key="dashboard-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Container>
      </main>

      {/* Enhanced Footer */}
      <DashboardFooter />
    </div>
  )
}