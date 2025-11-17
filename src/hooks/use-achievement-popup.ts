'use client'

import { useState, useEffect } from 'react'

export function useAchievementPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [achievementLevel, setAchievementLevel] = useState<300 | 400 | null>(null)
  const [questionCount, setQuestionCount] = useState(0)

  const checkAchievement = (totalQuestions: number) => {
    // Check if we should show popup for 400+ (higher priority)
    if (totalQuestions >= 400) {
      const hasShown400Today = localStorage.getItem(`achievement-400-${new Date().toDateString()}`)
      if (!hasShown400Today) {
        setAchievementLevel(400)
        setQuestionCount(totalQuestions)
        setShowPopup(true)
        localStorage.setItem(`achievement-400-${new Date().toDateString()}`, 'true')
        return
      }
    }
    
    // Check if we should show popup for 300+
    if (totalQuestions >= 300) {
      const hasShown300Today = localStorage.getItem(`achievement-300-${new Date().toDateString()}`)
      if (!hasShown300Today) {
        setAchievementLevel(300)
        setQuestionCount(totalQuestions)
        setShowPopup(true)
        localStorage.setItem(`achievement-300-${new Date().toDateString()}`, 'true')
        return
      }
    }
  }

  const closePopup = () => {
    setShowPopup(false)
    setAchievementLevel(null)
    setQuestionCount(0)
  }

  return {
    showPopup,
    achievementLevel,
    questionCount,
    checkAchievement,
    closePopup
  }
}