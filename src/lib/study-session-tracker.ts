import { prisma } from './prisma'

export type StudySessionData = {
  id: string
  subject: string
  chapter?: string
  startTime: Date
  endTime?: Date
  duration: number
  focusScore: number
  productivity: number
  questionsAttempted: number
  questionsCorrect: number
  breaksTaken: number
  notes?: string
}

export type ProgressStats = {
  daily: {
    date: string
    totalHours: number
    focusAvg: number
    productivity: number
    questionsTotal: number
  }[]
  weekly: {
    week: string
    totalHours: number
    avgFocus: number
    avgProductivity: number
    questionsTotal: number
  }[]
  monthly: {
    month: string
    totalHours: number
    avgFocus: number
    avgProductivity: number
    questionsTotal: number
  }[]
  lifetime: {
    totalHours: number
    totalSessions: number
    avgFocus: number
    avgProductivity: number
    totalQuestions: number
    correctAnswers: number
    accuracy: number
  }
}

export class StudySessionTracker {
  static async startSession(userId: string, subject: string, chapter?: string): Promise<StudySessionData> {
    const session = await prisma.studySession.create({
      data: {
        userId,
        subject,
        chapter,
        startTime: new Date(),
        focusScore: 5,
        productivity: 5,
        questionsAttempted: 0,
        questionsCorrect: 0,
        breaksTaken: 0
      }
    })

    return this.mapToSessionData(session)
  }

  static async endSession(
    userId: string, 
    sessionId: string, 
    data: {
      focusScore: number
      productivity: number
      questionsAttempted: number
      questionsCorrect: number
      breaksTaken: number
      notes?: string
    }
  ): Promise<StudySessionData> {
    const endTime = new Date()
    
    const session = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        endTime,
        duration: 0, // Will be calculated
        focusScore: data.focusScore,
        productivity: data.productivity,
        questionsAttempted: data.questionsAttempted,
        questionsCorrect: data.questionsCorrect,
        breaksTaken: data.breaksTaken,
        notes: data.notes,
        updatedAt: new Date()
      }
    })

    // Calculate duration in minutes
    const startTime = new Date(session.startTime)
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

    await prisma.studySession.update({
      where: { id: sessionId },
      data: { duration }
    })

    return this.mapToSessionData({ ...session, duration, endTime })
  }

  static async getProgressStats(userId: string): Promise<ProgressStats> {
    const [studySessions, smartPlans, dailyGoals, testPerformances, questionAnalytics] = await Promise.all([
      prisma.studySession.findMany({
        where: { 
          userId,
          endTime: { not: null }
        },
        orderBy: { startTime: 'desc' },
        take: 1000
      }),
      prisma.smartStudyPlan.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 365 // Last year
      }),
      prisma.dailyGoal.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 365
      }),
      prisma.testPerformance.findMany({
        where: { userId },
        orderBy: { testDate: 'desc' },
        take: 100
      }),
      prisma.questionAnalytics.findMany({
        orderBy: { date: 'desc' },
        take: 365
      })
    ])

    return {
      daily: this.calculateComprehensiveDailyStats(studySessions, smartPlans, dailyGoals, testPerformances, questionAnalytics),
      weekly: this.calculateComprehensiveWeeklyStats(studySessions, smartPlans, dailyGoals, testPerformances, questionAnalytics),
      monthly: this.calculateComprehensiveMonthlyStats(studySessions, smartPlans, dailyGoals, testPerformances, questionAnalytics),
      lifetime: this.calculateComprehensiveLifetimeStats(studySessions, smartPlans, dailyGoals, testPerformances, questionAnalytics)
    }
  }

  private static calculateComprehensiveDailyStats(sessions: any[], smartPlans: any[], dailyGoals: any[], testPerformances: any[], questionAnalytics: any[]): any[] {
    const dailyMap = new Map<string, any>()

    // Process study sessions
    sessions.forEach(session => {
      const date = new Date(session.startTime).toISOString().split('T')[0]
      const existing = dailyMap.get(date) || this.getEmptyDayStats(date)
      
      existing.totalHours += session.duration / 60
      existing.focusSum += session.focusScore
      existing.productivitySum += session.productivity
      existing.questionsTotal += session.questionsAttempted
      existing.sessionCount += 1
      
      dailyMap.set(date, existing)
    })

    // Process smart study plans
    smartPlans.forEach(plan => {
      const date = new Date(plan.date).toISOString().split('T')[0]
      const existing = dailyMap.get(date) || this.getEmptyDayStats(date)
      
      const schedule = plan.schedule as any[]
      const completedStudyBlocks = schedule.filter(block => block.completed && block.type === 'study')
      const planHours = completedStudyBlocks.reduce((sum, block) => sum + (block.duration / 60), 0)
      
      existing.totalHours = Math.max(existing.totalHours, planHours)
      existing.smartPlanHours = planHours
      existing.planCompleted = schedule.filter(b => b.completed).length / schedule.length
      
      dailyMap.set(date, existing)
    })

    // Process daily goals
    dailyGoals.forEach(goal => {
      const date = new Date(goal.date).toISOString().split('T')[0]
      const existing = dailyMap.get(date) || this.getEmptyDayStats(date)
      
      existing.questionsTotal = Math.max(existing.questionsTotal, goal.totalQuestions || 0)
      existing.goalAchieved = goal.achieved || false
      
      dailyMap.set(date, existing)
    })

    // Process test performances
    testPerformances.forEach(test => {
      const date = new Date(test.testDate).toISOString().split('T')[0]
      const existing = dailyMap.get(date) || this.getEmptyDayStats(date)
      
      existing.testScore = test.score
      existing.testPercentage = (test.score / 720) * 100
      
      dailyMap.set(date, existing)
    })

    return Array.from(dailyMap.values())
      .map(day => ({
        date: day.date,
        totalHours: Math.round(day.totalHours * 100) / 100,
        focusAvg: day.sessionCount > 0 ? Math.round((day.focusSum / day.sessionCount) * 100) / 100 : 0,
        productivity: day.sessionCount > 0 ? Math.round((day.productivitySum / day.sessionCount) * 100) / 100 : 0,
        questionsTotal: day.questionsTotal,
        testScore: day.testScore || 0,
        planCompleted: Math.round((day.planCompleted || 0) * 100),
        goalAchieved: day.goalAchieved
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 30)
  }

  private static getEmptyDayStats(date: string) {
    return {
      date,
      totalHours: 0,
      focusSum: 0,
      productivitySum: 0,
      questionsTotal: 0,
      sessionCount: 0,
      smartPlanHours: 0,
      planCompleted: 0,
      goalAchieved: false,
      testScore: 0
    }
  }

  private static calculateComprehensiveWeeklyStats(sessions: any[], smartPlans: any[], dailyGoals: any[], testPerformances: any[], questionAnalytics: any[]): any[] {
    // Get daily stats first
    const dailyStats = this.calculateComprehensiveDailyStats(sessions, smartPlans, dailyGoals, testPerformances, questionAnalytics)
    const weeklyMap = new Map<string, any>()

    dailyStats.forEach(day => {
      const date = new Date(day.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]

      const existing = weeklyMap.get(weekKey) || {
        week: weekKey,
        totalHours: 0,
        questionsTotal: 0,
        focusSum: 0,
        productivitySum: 0,
        testScoreSum: 0,
        goalsAchieved: 0,
        dayCount: 0,
        testCount: 0
      }

      existing.totalHours += day.totalHours
      existing.questionsTotal += day.questionsTotal
      existing.focusSum += day.focusAvg
      existing.productivitySum += day.productivity
      if (day.testScore > 0) {
        existing.testScoreSum += day.testScore
        existing.testCount += 1
      }
      if (day.goalAchieved) existing.goalsAchieved += 1
      existing.dayCount += 1

      weeklyMap.set(weekKey, existing)
    })

    return Array.from(weeklyMap.values())
      .map(week => ({
        week: week.week,
        totalHours: Math.round(week.totalHours * 100) / 100,
        avgFocus: week.dayCount > 0 ? Math.round((week.focusSum / week.dayCount) * 100) / 100 : 0,
        avgProductivity: week.dayCount > 0 ? Math.round((week.productivitySum / week.dayCount) * 100) / 100 : 0,
        questionsTotal: week.questionsTotal,
        avgTestScore: week.testCount > 0 ? Math.round(week.testScoreSum / week.testCount) : 0,
        goalsAchieved: week.goalsAchieved
      }))
      .sort((a, b) => new Date(b.week).getTime() - new Date(a.week).getTime())
      .slice(0, 12)
  }

  private static calculateComprehensiveMonthlyStats(sessions: any[], smartPlans: any[], dailyGoals: any[], testPerformances: any[], questionAnalytics: any[]): any[] {
    const dailyStats = this.calculateComprehensiveDailyStats(sessions, smartPlans, dailyGoals, testPerformances, questionAnalytics)
    const monthlyMap = new Map<string, any>()

    dailyStats.forEach(day => {
      const date = new Date(day.date)
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`

      const existing = monthlyMap.get(monthKey) || {
        month: monthKey,
        totalHours: 0,
        questionsTotal: 0,
        focusSum: 0,
        productivitySum: 0,
        testScoreSum: 0,
        goalsAchieved: 0,
        dayCount: 0,
        testCount: 0
      }

      existing.totalHours += day.totalHours
      existing.questionsTotal += day.questionsTotal
      existing.focusSum += day.focusAvg
      existing.productivitySum += day.productivity
      if (day.testScore > 0) {
        existing.testScoreSum += day.testScore
        existing.testCount += 1
      }
      if (day.goalAchieved) existing.goalsAchieved += 1
      existing.dayCount += 1

      monthlyMap.set(monthKey, existing)
    })

    return Array.from(monthlyMap.values())
      .map(month => ({
        month: month.month,
        totalHours: Math.round(month.totalHours * 100) / 100,
        avgFocus: month.dayCount > 0 ? Math.round((month.focusSum / month.dayCount) * 100) / 100 : 0,
        avgProductivity: month.dayCount > 0 ? Math.round((month.productivitySum / month.dayCount) * 100) / 100 : 0,
        questionsTotal: month.questionsTotal,
        avgTestScore: month.testCount > 0 ? Math.round(month.testScoreSum / month.testCount) : 0,
        goalsAchieved: month.goalsAchieved
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12)
  }

  private static calculateComprehensiveLifetimeStats(sessions: any[], smartPlans: any[], dailyGoals: any[], testPerformances: any[], questionAnalytics: any[]): any {
    // Calculate from sessions
    const sessionHours = sessions.reduce((sum, s) => sum + (s.duration / 60), 0)
    const sessionQuestions = sessions.reduce((sum, s) => sum + s.questionsAttempted, 0)
    const correctAnswers = sessions.reduce((sum, s) => sum + s.questionsCorrect, 0)
    
    // Calculate from smart plans
    const planHours = smartPlans.reduce((sum, plan) => {
      const schedule = plan.schedule as any[]
      return sum + schedule
        .filter(block => block.completed && block.type === 'study')
        .reduce((blockSum, block) => blockSum + (block.duration / 60), 0)
    }, 0)
    
    // Calculate from daily goals
    const goalQuestions = dailyGoals.reduce((sum, goal) => sum + (goal.totalQuestions || 0), 0)
    const goalsAchieved = dailyGoals.filter(goal => goal.achieved).length
    
    // Calculate from test performances
    const avgTestScore = testPerformances.length > 0
      ? testPerformances.reduce((sum, test) => sum + test.score, 0) / testPerformances.length
      : 0
    
    // Use the maximum values from different sources
    const totalHours = Math.max(sessionHours, planHours)
    const totalQuestions = Math.max(sessionQuestions, goalQuestions)
    
    const avgFocus = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length
      : 0
    const avgProductivity = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.productivity, 0) / sessions.length
      : 0

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      totalSessions: sessions.length,
      totalPlans: smartPlans.length,
      avgFocus: Math.round(avgFocus * 100) / 100,
      avgProductivity: Math.round(avgProductivity * 100) / 100,
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      avgTestScore: Math.round(avgTestScore),
      goalsAchieved,
      totalGoals: dailyGoals.length,
      goalSuccessRate: dailyGoals.length > 0 ? Math.round((goalsAchieved / dailyGoals.length) * 100) : 0
    }
  }

  static async getPraiseMessage(userId: string, hoursCompleted: number, targetHours: number): Promise<string> {
    const completionPercentage = (hoursCompleted / targetHours) * 100

    if (completionPercentage >= 100) {
      return `🎉 AMAZING! You've completed ${hoursCompleted}h/${targetHours}h (${Math.round(completionPercentage)}%)! You're absolutely crushing your goals, Dr. Misti! 👩‍⚕️✨`
    } else if (completionPercentage >= 85) {
      return `🔥 EXCELLENT! You've completed ${hoursCompleted}h/${targetHours}h (${Math.round(completionPercentage)}%)! You're so close to your target - keep this momentum going! 💪`
    } else if (completionPercentage >= 70) {
      return `💪 GREAT WORK! You've completed ${hoursCompleted}h/${targetHours}h (${Math.round(completionPercentage)}%)! You're making solid progress towards becoming Dr. Misti! 🌟`
    } else if (completionPercentage >= 50) {
      return `👍 GOOD PROGRESS! You've completed ${hoursCompleted}h/${targetHours}h (${Math.round(completionPercentage)}%)! Every hour brings you closer to your NEET dreams! 📚`
    } else {
      return `🚀 KEEP GOING! You've completed ${hoursCompleted}h/${targetHours}h (${Math.round(completionPercentage)}%)! Remember, every great doctor started with a single study session! 💝`
    }
  }

  private static mapToSessionData(session: any): StudySessionData {
    return {
      id: session.id,
      subject: session.subject,
      chapter: session.chapter,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
      focusScore: session.focusScore,
      productivity: session.productivity,
      questionsAttempted: session.questionsAttempted,
      questionsCorrect: session.questionsCorrect,
      breaksTaken: session.breaksTaken,
      notes: session.notes
    }
  }
}