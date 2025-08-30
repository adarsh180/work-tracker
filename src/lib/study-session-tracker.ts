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
    const sessions = await prisma.studySession.findMany({
      where: { 
        userId,
        endTime: { not: null }
      },
      orderBy: { startTime: 'desc' },
      take: 1000 // Last 1000 sessions
    })

    return {
      daily: this.calculateDailyStats(sessions),
      weekly: this.calculateWeeklyStats(sessions),
      monthly: this.calculateMonthlyStats(sessions),
      lifetime: this.calculateLifetimeStats(sessions)
    }
  }

  private static calculateDailyStats(sessions: any[]): any[] {
    const dailyMap = new Map<string, any>()

    sessions.forEach(session => {
      const date = new Date(session.startTime).toISOString().split('T')[0]
      const existing = dailyMap.get(date) || {
        date,
        totalHours: 0,
        focusSum: 0,
        productivitySum: 0,
        questionsTotal: 0,
        sessionCount: 0
      }

      existing.totalHours += session.duration / 60
      existing.focusSum += session.focusScore
      existing.productivitySum += session.productivity
      existing.questionsTotal += session.questionsAttempted
      existing.sessionCount += 1

      dailyMap.set(date, existing)
    })

    return Array.from(dailyMap.values())
      .map(day => ({
        date: day.date,
        totalHours: Math.round(day.totalHours * 100) / 100,
        focusAvg: Math.round((day.focusSum / day.sessionCount) * 100) / 100,
        productivity: Math.round((day.productivitySum / day.sessionCount) * 100) / 100,
        questionsTotal: day.questionsTotal
      }))
      .slice(0, 30) // Last 30 days
  }

  private static calculateWeeklyStats(sessions: any[]): any[] {
    const weeklyMap = new Map<string, any>()

    sessions.forEach(session => {
      const date = new Date(session.startTime)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]

      const existing = weeklyMap.get(weekKey) || {
        week: weekKey,
        totalHours: 0,
        focusSum: 0,
        productivitySum: 0,
        questionsTotal: 0,
        sessionCount: 0
      }

      existing.totalHours += session.duration / 60
      existing.focusSum += session.focusScore
      existing.productivitySum += session.productivity
      existing.questionsTotal += session.questionsAttempted
      existing.sessionCount += 1

      weeklyMap.set(weekKey, existing)
    })

    return Array.from(weeklyMap.values())
      .map(week => ({
        week: week.week,
        totalHours: Math.round(week.totalHours * 100) / 100,
        avgFocus: Math.round((week.focusSum / week.sessionCount) * 100) / 100,
        avgProductivity: Math.round((week.productivitySum / week.sessionCount) * 100) / 100,
        questionsTotal: week.questionsTotal
      }))
      .slice(0, 12) // Last 12 weeks
  }

  private static calculateMonthlyStats(sessions: any[]): any[] {
    const monthlyMap = new Map<string, any>()

    sessions.forEach(session => {
      const date = new Date(session.startTime)
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`

      const existing = monthlyMap.get(monthKey) || {
        month: monthKey,
        totalHours: 0,
        focusSum: 0,
        productivitySum: 0,
        questionsTotal: 0,
        sessionCount: 0
      }

      existing.totalHours += session.duration / 60
      existing.focusSum += session.focusScore
      existing.productivitySum += session.productivity
      existing.questionsTotal += session.questionsAttempted
      existing.sessionCount += 1

      monthlyMap.set(monthKey, existing)
    })

    return Array.from(monthlyMap.values())
      .map(month => ({
        month: month.month,
        totalHours: Math.round(month.totalHours * 100) / 100,
        avgFocus: Math.round((month.focusSum / month.sessionCount) * 100) / 100,
        avgProductivity: Math.round((month.productivitySum / month.sessionCount) * 100) / 100,
        questionsTotal: month.questionsTotal
      }))
      .slice(0, 12) // Last 12 months
  }

  private static calculateLifetimeStats(sessions: any[]): any {
    const totalHours = sessions.reduce((sum, s) => sum + (s.duration / 60), 0)
    const totalQuestions = sessions.reduce((sum, s) => sum + s.questionsAttempted, 0)
    const correctAnswers = sessions.reduce((sum, s) => sum + s.questionsCorrect, 0)
    const avgFocus = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.focusScore, 0) / sessions.length
      : 0
    const avgProductivity = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.productivity, 0) / sessions.length
      : 0

    return {
      totalHours: Math.round(totalHours * 100) / 100,
      totalSessions: sessions.length,
      avgFocus: Math.round(avgFocus * 100) / 100,
      avgProductivity: Math.round(avgProductivity * 100) / 100,
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
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