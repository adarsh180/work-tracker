import { prisma } from '../prisma'
import { DailyGoal } from '@prisma/client'
import { withRetry, handleDatabaseError } from '../error-handler'

export type DailyGoalData = {
  userId: string
  date: Date
  physicsQuestions: number
  chemistryQuestions: number
  botanyQuestions: number
  zoologyQuestions: number
  physicsDpp: number
  chemistryDpp: number
  botanyDpp: number
  zoologyDpp: number
  physicsRevision: number
  chemistryRevision: number
  botanyRevision: number
  zoologyRevision: number
}

export type DailyGoalSummary = {
  totalQuestions: number
  totalDpp: number
  totalRevision: number
  subjectBreakdown: {
    physics: { questions: number; dpp: number; revision: number }
    chemistry: { questions: number; dpp: number; revision: number }
    botany: { questions: number; dpp: number; revision: number }
    zoology: { questions: number; dpp: number; revision: number }
  }
  emoji: string
  motivationalMessage: string
}

export type QuestionStats = {
  daily: number
  weekly: number
  monthly: number
  lifetime: number
  weeklyGoal: number
  monthlyGoal: number
  dailyGoalAchieved: boolean
  weeklyProgress: number
  monthlyProgress: number
}

export class DailyGoalsRepository {
  /**
   * Create or update daily goal for a specific date
   */
  static async upsert(data: DailyGoalData): Promise<DailyGoal> {
    return withRetry(async () => {
      const totalQuestions = data.physicsQuestions + data.chemistryQuestions + 
                            data.botanyQuestions + data.zoologyQuestions

      return await prisma.dailyGoal.upsert({
      where: {
        userId_date: {
          userId: data.userId,
          date: data.date
        }
      },
      update: {
        physicsQuestions: data.physicsQuestions,
        chemistryQuestions: data.chemistryQuestions,
        botanyQuestions: data.botanyQuestions,
        zoologyQuestions: data.zoologyQuestions,
        physicsDpp: data.physicsDpp,
        chemistryDpp: data.chemistryDpp,
        botanyDpp: data.botanyDpp,
        zoologyDpp: data.zoologyDpp,
        physicsRevision: data.physicsRevision,
        chemistryRevision: data.chemistryRevision,
        botanyRevision: data.botanyRevision,
        zoologyRevision: data.zoologyRevision,
        totalQuestions,
        updatedAt: new Date()
      },
      create: {
        userId: data.userId,
        date: data.date,
        physicsQuestions: data.physicsQuestions,
        chemistryQuestions: data.chemistryQuestions,
        botanyQuestions: data.botanyQuestions,
        zoologyQuestions: data.zoologyQuestions,
        physicsDpp: data.physicsDpp,
        chemistryDpp: data.chemistryDpp,
        botanyDpp: data.botanyDpp,
        zoologyDpp: data.zoologyDpp,
        physicsRevision: data.physicsRevision,
        chemistryRevision: data.chemistryRevision,
        botanyRevision: data.botanyRevision,
        zoologyRevision: data.zoologyRevision,
        totalQuestions
      }
    })
    }).catch(handleDatabaseError)
  }

  /**
   * Get daily goal for a specific date
   */
  static async getByDate(userId: string, date: Date): Promise<DailyGoal | null> {
    return await prisma.dailyGoal.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
        }
      }
    })
  }

  /**
   * Get today's goal
   */
  static async getToday(userId: string): Promise<DailyGoal | null> {
    // Get current date in IST
    const now = new Date()
    const istNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
    const today = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate())
    
    try {
      // Use upsert with proper unique constraint handling
      const goal = await prisma.dailyGoal.upsert({
        where: {
          userId_date: {
            userId,
            date: today
          }
        },
        update: {}, // Don't update existing data
        create: {
          userId,
          date: today,
          physicsQuestions: 0,
          chemistryQuestions: 0,
          botanyQuestions: 0,
          zoologyQuestions: 0,
          physicsDpp: 0,
          chemistryDpp: 0,
          botanyDpp: 0,
          zoologyDpp: 0,
          physicsRevision: 0,
          chemistryRevision: 0,
          botanyRevision: 0,
          zoologyRevision: 0,
          totalQuestions: 0
        }
      })
      return goal
    } catch (error) {
      // Fallback to find if upsert fails
      return await prisma.dailyGoal.findFirst({
        where: { userId, date: today }
      })
    }
  }

  /**
   * Delete daily goal
   */
  static async delete(id: string): Promise<void> {
    await prisma.dailyGoal.delete({
      where: { id }
    })
  }

  /**
   * Get daily goal summary with gamification
   */
  static async getDailySummary(userId: string, date: Date): Promise<DailyGoalSummary> {
    // Convert date to IST if needed
    const istDate = new Date(date.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
    const goal = await this.getByDate(userId, istDate)
    
    if (!goal) {
      return {
        totalQuestions: 0,
        totalDpp: 0,
        totalRevision: 0,
        subjectBreakdown: {
          physics: { questions: 0, dpp: 0, revision: 0 },
          chemistry: { questions: 0, dpp: 0, revision: 0 },
          botany: { questions: 0, dpp: 0, revision: 0 },
          zoology: { questions: 0, dpp: 0, revision: 0 }
        },
        emoji: '😴',
        motivationalMessage: 'Time to start your NEET preparation journey!'
      }
    }

    const totalQuestions = goal.totalQuestions
    const totalDpp = goal.physicsDpp + goal.chemistryDpp + goal.botanyDpp + goal.zoologyDpp
    const totalRevision = goal.physicsRevision + goal.chemistryRevision + goal.botanyRevision + goal.zoologyRevision

    // Gamification logic
    let emoji = '😢'
    let motivationalMessage = 'Keep pushing forward, Misti!'

    if (totalQuestions >= 500) {
      emoji = '🔥'
      motivationalMessage = 'INCREDIBLE! You\'re on fire today! Dr. Misti in the making! 🏥✨'
    } else if (totalQuestions >= 300) {
      emoji = '😘'
      motivationalMessage = 'Amazing work, my love! You\'re crushing your goals! 💕'
    } else if (totalQuestions >= 250) {
      emoji = '😊'
      motivationalMessage = 'Great job! You\'re on track for success! 🎯'
    } else if (totalQuestions >= 150) {
      emoji = '😐'
      motivationalMessage = 'Good start! Let\'s aim higher tomorrow! 📈'
    } else if (totalQuestions > 0) {
      emoji = '😟'
      motivationalMessage = 'Every question counts! Keep going! 💪'
    }

    return {
      totalQuestions,
      totalDpp,
      totalRevision,
      subjectBreakdown: {
        physics: { 
          questions: goal.physicsQuestions, 
          dpp: goal.physicsDpp, 
          revision: goal.physicsRevision 
        },
        chemistry: { 
          questions: goal.chemistryQuestions, 
          dpp: goal.chemistryDpp, 
          revision: goal.chemistryRevision 
        },
        botany: { 
          questions: goal.botanyQuestions, 
          dpp: goal.botanyDpp, 
          revision: goal.botanyRevision 
        },
        zoology: { 
          questions: goal.zoologyQuestions, 
          dpp: goal.zoologyDpp, 
          revision: goal.zoologyRevision 
        }
      },
      emoji,
      motivationalMessage
    }
  }

  /**
   * Get question statistics (daily, weekly, monthly, lifetime)
   */
  static async getQuestionStats(userId: string): Promise<QuestionStats> {
    // Get current date in IST
    const now = new Date()
    const istNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}))
    const today = new Date(istNow.getFullYear(), istNow.getMonth(), istNow.getDate())
    
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    // Get daily total
    const dailyGoal = await this.getToday(userId)
    const daily = dailyGoal?.totalQuestions || 0

    // Get weekly total
    const weeklyGoals = await prisma.dailyGoal.findMany({
      where: {
        userId,
        date: {
          gte: weekStart,
          lte: today
        }
      }
    })
    const weekly = weeklyGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)

    // Get monthly total
    const monthlyGoals = await prisma.dailyGoal.findMany({
      where: {
        userId,
        date: {
          gte: monthStart,
          lte: today
        }
      }
    })
    const monthly = monthlyGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)

    // Get lifetime total - NEVER RESET, ALWAYS CUMULATIVE
    const allGoals = await prisma.dailyGoal.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    })
    const lifetime = allGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)

    // Calculate progress
    const weeklyGoal = 2000 // Target: 2000 questions per week
    const monthlyGoal = 7500 // Target: 7500 questions per month
    const dailyGoalAchieved = daily >= 250
    const weeklyProgress = Math.min((weekly / weeklyGoal) * 100, 100)
    const monthlyProgress = Math.min((monthly / monthlyGoal) * 100, 100)

    return {
      daily,
      weekly,
      monthly,
      lifetime,
      weeklyGoal,
      monthlyGoal,
      dailyGoalAchieved,
      weeklyProgress,
      monthlyProgress
    }
  }

  /**
   * Get recent daily goals
   */
  static async getRecentGoals(userId: string, days: number = 7): Promise<DailyGoal[]> {
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    return await prisma.dailyGoal.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'desc' }
    })
  }

  /**
   * Get weekly comparison
   */
  static async getWeeklyComparison(userId: string): Promise<{
    thisWeek: number
    lastWeek: number
    improvement: number
  }> {
    const today = new Date()
    const thisWeekStart = new Date(today)
    thisWeekStart.setDate(today.getDate() - today.getDay())
    thisWeekStart.setHours(0, 0, 0, 0)

    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(thisWeekStart.getDate() - 7)
    
    const lastWeekEnd = new Date(thisWeekStart)
    lastWeekEnd.setDate(thisWeekStart.getDate() - 1)
    lastWeekEnd.setHours(23, 59, 59, 999)

    // This week
    const thisWeekGoals = await prisma.dailyGoal.findMany({
      where: {
        userId,
        date: {
          gte: thisWeekStart,
          lte: today
        }
      }
    })
    const thisWeek = thisWeekGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)

    // Last week
    const lastWeekGoals = await prisma.dailyGoal.findMany({
      where: {
        userId,
        date: {
          gte: lastWeekStart,
          lte: lastWeekEnd
        }
      }
    })
    const lastWeek = lastWeekGoals.reduce((sum, goal) => sum + goal.totalQuestions, 0)

    const improvement = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0

    return {
      thisWeek,
      lastWeek,
      improvement: Math.round(improvement * 100) / 100
    }
  }
}