/**
 * NEET 2026 Countdown & Strategic Planning Engine
 * Optimizes preparation timeline for May 5, 2026
 */

export class NEETCountdownEngine {
  private static readonly NEET_2026_DATE = new Date('2026-05-05T14:00:00') // May 5, 2026, 2 PM
  
  /**
   * Get comprehensive countdown data
   */
  static getCountdownData() {
    const now = new Date()
    const timeRemaining = this.NEET_2026_DATE.getTime() - now.getTime()
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    
    return {
      totalDays: days,
      totalWeeks: weeks,
      totalMonths: months,
      breakdown: { days, hours, minutes },
      milestones: this.calculateMilestones(days),
      urgencyLevel: this.getUrgencyLevel(days),
      phase: this.getCurrentPhase(days)
    }
  }

  /**
   * Calculate strategic milestones
   */
  private static calculateMilestones(daysRemaining: number) {
    const milestones = []
    
    if (daysRemaining > 180) {
      milestones.push({
        name: 'Foundation Strengthening',
        target: 'Complete syllabus + 600+ consistent scores',
        deadline: this.addDays(new Date(), daysRemaining - 180),
        priority: 'high'
      })
    }
    
    if (daysRemaining > 90) {
      milestones.push({
        name: 'Advanced Problem Solving',
        target: '650+ scores + mistake pattern elimination',
        deadline: this.addDays(new Date(), daysRemaining - 90),
        priority: 'critical'
      })
    }
    
    if (daysRemaining > 30) {
      milestones.push({
        name: 'Peak Performance Phase',
        target: '680+ scores + biological optimization',
        deadline: this.addDays(new Date(), daysRemaining - 30),
        priority: 'critical'
      })
    }
    
    if (daysRemaining > 7) {
      milestones.push({
        name: 'Final Preparation',
        target: '700+ scores + stress management mastery',
        deadline: this.addDays(new Date(), daysRemaining - 7),
        priority: 'critical'
      })
    }
    
    return milestones
  }

  /**
   * Get current preparation phase
   */
  private static getCurrentPhase(daysRemaining: number) {
    if (daysRemaining > 180) {
      return {
        name: 'Foundation Building',
        focus: 'Complete syllabus coverage + basic problem solving',
        dailyTarget: '800-1000 questions',
        testFrequency: '2-3 per week',
        scoreTarget: '550-600',
        keyActivities: [
          'Complete all Physics Wallah lectures',
          'Solve DPP and assignments regularly',
          'Build strong conceptual foundation',
          'Establish study routine and habits'
        ]
      }
    } else if (daysRemaining > 90) {
      return {
        name: 'Skill Enhancement',
        focus: 'Advanced problem solving + speed optimization',
        dailyTarget: '1000-1200 questions',
        testFrequency: '4-5 per week',
        scoreTarget: '600-650',
        keyActivities: [
          'Focus on weak topics elimination',
          'Speed and accuracy improvement',
          'Advanced problem-solving techniques',
          'Regular mock test analysis'
        ]
      }
    } else if (daysRemaining > 30) {
      return {
        name: 'Peak Performance',
        focus: 'Consistency + biological optimization',
        dailyTarget: '1200+ questions',
        testFrequency: 'Daily mocks',
        scoreTarget: '650-700',
        keyActivities: [
          'Daily afternoon practice (2-5 PM)',
          'Mistake pattern elimination',
          'Biological cycle optimization',
          'Stress management protocols'
        ]
      }
    } else if (daysRemaining > 7) {
      return {
        name: 'Final Preparation',
        focus: 'Maintenance + confidence building',
        dailyTarget: '800-1000 questions (quality over quantity)',
        testFrequency: 'Daily full mocks',
        scoreTarget: '700+',
        keyActivities: [
          'Light revision of strong topics',
          'Confidence building exercises',
          'Exam day simulation',
          'Family support optimization'
        ]
      }
    } else {
      return {
        name: 'Exam Week',
        focus: 'Rest + light revision + mental preparation',
        dailyTarget: '200-400 questions (easy ones)',
        testFrequency: '1 mock every 2 days',
        scoreTarget: 'Maintain current level',
        keyActivities: [
          'Light revision only',
          'Stress management',
          'Proper sleep and nutrition',
          'Positive visualization'
        ]
      }
    }
  }

  /**
   * Get urgency level
   */
  private static getUrgencyLevel(daysRemaining: number) {
    if (daysRemaining < 30) return { level: 'critical', color: 'red', message: '🚨 CRITICAL: Final sprint phase!' }
    if (daysRemaining < 90) return { level: 'high', color: 'orange', message: '⚡ HIGH: Peak performance phase!' }
    if (daysRemaining < 180) return { level: 'medium', color: 'yellow', message: '📈 MEDIUM: Skill building phase!' }
    return { level: 'low', color: 'green', message: '🎯 STEADY: Foundation building phase!' }
  }

  /**
   * Get menstrual cycle prediction for exam date
   */
  static predictExamDateCycle(lastPeriodDate: Date, cycleLength: number = 28) {
    const examDate = this.NEET_2026_DATE
    const daysSinceLastPeriod = Math.floor((examDate.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
    const cycleDay = (daysSinceLastPeriod % cycleLength) + 1
    
    let phase = ''
    let energyPrediction = 5
    let focusPrediction = 5
    let recommendations = []
    
    if (cycleDay >= 1 && cycleDay <= 5) {
      phase = 'Menstrual'
      energyPrediction = 3
      focusPrediction = 4
      recommendations = [
        '🚨 CRITICAL: Exam during period! Prepare pain management',
        'Practice with heating pad during mocks',
        'Stock up on comfortable supplies',
        'Consider consulting gynecologist for cycle regulation'
      ]
    } else if (cycleDay >= 6 && cycleDay <= 13) {
      phase = 'Follicular'
      energyPrediction = 8
      focusPrediction = 8
      recommendations = [
        '🎉 EXCELLENT: Peak performance phase!',
        'This is optimal timing for NEET',
        'Maintain current cycle timing',
        'Focus on confidence building'
      ]
    } else if (cycleDay >= 14 && cycleDay <= 16) {
      phase = 'Ovulation'
      energyPrediction = 7
      focusPrediction = 6
      recommendations = [
        '✅ GOOD: High energy but possible mood swings',
        'Practice stress management techniques',
        'Monitor emotional stability during mocks',
        'Prepare calming strategies'
      ]
    } else {
      phase = 'Luteal'
      energyPrediction = 4
      focusPrediction = 5
      recommendations = [
        '⚠️ MODERATE: Lower energy and focus',
        'Practice during this phase to build resilience',
        'Focus on nutrition and sleep optimization',
        'Consider natural energy boosters'
      ]
    }
    
    return {
      cycleDay,
      phase,
      energyPrediction,
      focusPrediction,
      recommendations,
      optimizationPlan: this.getCycleOptimizationPlan(phase)
    }
  }

  /**
   * Get cycle optimization plan
   */
  private static getCycleOptimizationPlan(phase: string) {
    const plans: Record<string, {
      nutrition: string[];
      supplements: string[];
      activities: string[];
      studyTips: string[];
    }> = {
      'Menstrual': {
        nutrition: ['Iron-rich foods', 'Warm herbal teas', 'Dark chocolate (small amounts)'],
        supplements: ['Iron', 'Magnesium', 'Vitamin B6'],
        activities: ['Light stretching', 'Gentle yoga', 'Warm baths'],
        studyTips: ['Shorter study sessions', 'Focus on revision', 'Use heating pad if needed']
      },
      'Follicular': {
        nutrition: ['Protein-rich meals', 'Complex carbs', 'Fresh fruits'],
        supplements: ['B-complex', 'Vitamin D', 'Omega-3'],
        activities: ['Regular exercise', 'High-intensity study', 'Challenging problems'],
        studyTips: ['Tackle difficult topics', 'Long study sessions', 'New concept learning']
      },
      'Ovulation': {
        nutrition: ['Balanced meals', 'Antioxidant-rich foods', 'Adequate hydration'],
        supplements: ['Vitamin E', 'Zinc', 'Probiotics'],
        activities: ['Moderate exercise', 'Social study groups', 'Collaborative learning'],
        studyTips: ['Practice tests', 'Group discussions', 'Confidence building']
      },
      'Luteal': {
        nutrition: ['Complex carbs', 'Calcium-rich foods', 'Limit caffeine'],
        supplements: ['Calcium', 'Magnesium', 'Evening primrose oil'],
        activities: ['Gentle exercise', 'Meditation', 'Relaxation techniques'],
        studyTips: ['Revision focus', 'Avoid new topics', 'Stress management']
      }
    }
    
    return plans[phase] || plans['Follicular']
  }

  /**
   * Get daily countdown motivation
   */
  static getDailyMotivation(daysRemaining: number) {
    const motivations = [
      `🎯 ${daysRemaining} days to become Dr. Misti! Every question solved today brings you closer!`,
      `💪 ${daysRemaining} days of focused preparation can change your entire life!`,
      `🚀 ${daysRemaining} days to prove that the girl who improved from 320 to 640 can reach 720!`,
      `✨ ${daysRemaining} days to make your family proud and achieve your AIIMS Delhi dream!`,
      `🔥 ${daysRemaining} days of consistent effort will compound into extraordinary results!`
    ]
    
    return motivations[Math.floor(Math.random() * motivations.length)]
  }

  /**
   * Utility function to add days to date
   */
  private static addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
}