/**
 * Real-time Data Synchronization Service
 * Ensures all data changes are immediately saved to database and reflected in UI
 */

import { prisma } from './prisma'

export class RealTimeSyncService {
  /**
   * Sync chapter progress changes immediately
   */
  static async syncChapterProgress(chapterId: string, updates: {
    lecturesCompleted?: boolean[]
    dppCompleted?: boolean[]
    assignmentCompleted?: boolean[]
    kattarCompleted?: boolean[]
    revisionScore?: number
  }) {
    try {
      const updatedChapter = await prisma.chapter.update({
        where: { id: chapterId },
        data: updates,
        include: { subject: true }
      })

      // Update subject completion percentage
      await this.updateSubjectProgress(updatedChapter.subjectId)

      return updatedChapter
    } catch (error) {
      console.error('Error syncing chapter progress:', error)
      throw error
    }
  }

  /**
   * Update subject progress based on all chapters
   */
  static async updateSubjectProgress(subjectId: string) {
    try {
      const chapters = await prisma.chapter.findMany({
        where: { subjectId }
      })

      if (chapters.length === 0) return

      let totalItems = 0
      let completedItems = 0
      let totalQuestions = 0

      chapters.forEach(chapter => {
        // Lectures
        totalItems += chapter.lectureCount
        completedItems += chapter.lecturesCompleted.filter(Boolean).length

        // DPP
        totalItems += chapter.lectureCount
        completedItems += chapter.dppCompleted.filter(Boolean).length

        // Assignments
        totalItems += chapter.assignmentQuestions
        completedItems += chapter.assignmentCompleted.filter(Boolean).length
        totalQuestions += chapter.assignmentQuestions

        // Kattar questions
        totalItems += chapter.kattarQuestions
        completedItems += chapter.kattarCompleted.filter(Boolean).length
        totalQuestions += chapter.kattarQuestions
      })

      const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

      await prisma.subject.update({
        where: { id: subjectId },
        data: {
          completionPercentage,
          totalQuestions
        }
      })

      return completionPercentage
    } catch (error) {
      console.error('Error updating subject progress:', error)
      throw error
    }
  }

  /**
   * Sync daily goals with real-time updates
   */
  static async syncDailyGoals(userId: string, date: Date, updates: {
    physicsQuestions?: number
    chemistryQuestions?: number
    botanyQuestions?: number
    zoologyQuestions?: number
    physicsDpp?: number
    chemistryDpp?: number
    botanyDpp?: number
    zoologyDpp?: number
    physicsRevision?: number
    chemistryRevision?: number
    botanyRevision?: number
    zoologyRevision?: number
  }) {
    try {
      const totalQuestions = (updates.physicsQuestions || 0) + 
                           (updates.chemistryQuestions || 0) + 
                           (updates.botanyQuestions || 0) + 
                           (updates.zoologyQuestions || 0)

      const dailyGoal = await prisma.dailyGoal.upsert({
        where: { date },
        update: {
          ...updates,
          totalQuestions,
          updatedAt: new Date()
        },
        create: {
          userId,
          date,
          physicsQuestions: updates.physicsQuestions || 0,
          chemistryQuestions: updates.chemistryQuestions || 0,
          botanyQuestions: updates.botanyQuestions || 0,
          zoologyQuestions: updates.zoologyQuestions || 0,
          physicsDpp: updates.physicsDpp || 0,
          chemistryDpp: updates.chemistryDpp || 0,
          botanyDpp: updates.botanyDpp || 0,
          zoologyDpp: updates.zoologyDpp || 0,
          physicsRevision: updates.physicsRevision || 0,
          chemistryRevision: updates.chemistryRevision || 0,
          botanyRevision: updates.botanyRevision || 0,
          zoologyRevision: updates.zoologyRevision || 0,
          totalQuestions
        }
      })

      // Update question analytics
      await this.updateQuestionAnalytics(date, totalQuestions)

      return dailyGoal
    } catch (error) {
      console.error('Error syncing daily goals:', error)
      throw error
    }
  }

  /**
   * Update question analytics for real-time tracking
   * Now just returns current stats since we pull from daily goals directly
   */
  static async updateQuestionAnalytics(date: Date, dailyCount: number) {
    try {
      // Question analytics now pulls directly from daily goals
      // No need to maintain separate analytics table
      const { QuestionAnalyticsRepository } = await import('@/lib/repositories/question-analytics-repository')
      return await QuestionAnalyticsRepository.getCurrentStats()
    } catch (error) {
      console.error('Error updating question analytics:', error)
      throw error
    }
  }

  /**
   * Sync test performance data
   */
  static async syncTestPerformance(userId: string, testData: {
    testType: string
    testNumber: string
    score: number
    testDate: Date
  }) {
    try {
      const testPerformance = await prisma.testPerformance.create({
        data: {
          userId,
          testType: testData.testType,
          testNumber: testData.testNumber,
          score: testData.score,
          testDate: testData.testDate
        }
      })

      return testPerformance
    } catch (error) {
      console.error('Error syncing test performance:', error)
      throw error
    }
  }

  /**
   * Sync mood entry
   */
  static async syncMoodEntry(date: Date, mood: string) {
    try {
      const moodEntry = await prisma.moodEntry.upsert({
        where: { date },
        update: { mood },
        create: { date, mood }
      })

      return moodEntry
    } catch (error) {
      console.error('Error syncing mood entry:', error)
      throw error
    }
  }

  /**
   * Get comprehensive dashboard data with real-time updates
   */
  static async getDashboardData(userId: string) {
    try {
      const [subjects, dailyGoals, testPerformances, moodEntries, questionAnalytics] = await Promise.all([
        prisma.subject.findMany({
          include: { chapters: true },
          orderBy: { name: 'asc' }
        }),
        prisma.dailyGoal.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 30
        }),
        prisma.testPerformance.findMany({
          where: { userId },
          orderBy: { testDate: 'desc' },
          take: 10
        }),
        prisma.moodEntry.findMany({
          orderBy: { date: 'desc' },
          take: 30
        }),
        prisma.questionAnalytics.findMany({
          orderBy: { date: 'desc' },
          take: 1
        })
      ])

      return {
        subjects,
        dailyGoals,
        testPerformances,
        moodEntries,
        questionAnalytics: questionAnalytics[0] || null
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  }
}