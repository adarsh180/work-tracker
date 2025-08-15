import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RealTimeSyncService } from '@/lib/real-time-sync'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = session.user.email

    // Get comprehensive dashboard data using real-time sync service
    const dashboardData = await RealTimeSyncService.getDashboardData(userId)
    const { subjects, dailyGoals, testPerformances, moodEntries } = dashboardData

    // Calculate subject progress
    const subjectProgress = {
      physics: 0,
      chemistry: 0,
      botany: 0,
      zoology: 0,
      overall: 0
    }

    subjects.forEach(subject => {
      const subjectName = subject.name.toLowerCase()
      if (subjectName === 'physics' || subjectName === 'chemistry' || subjectName === 'botany' || subjectName === 'zoology') {
        subjectProgress[subjectName as keyof typeof subjectProgress] = subject.completionPercentage
      }
    })

    subjectProgress.overall = (subjectProgress.physics + subjectProgress.chemistry + 
                             subjectProgress.botany + subjectProgress.zoology) / 4

    // Calculate question stats including chapter-wise questions
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - 6)
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

    const todayGoal = dailyGoals.find(g => 
      new Date(g.date).toDateString() === today.toDateString()
    )
    
    const weeklyGoals = dailyGoals.filter(g => 
      new Date(g.date) >= weekStart && new Date(g.date) <= today
    )
    
    const monthlyGoals = dailyGoals.filter(g => 
      new Date(g.date) >= monthStart && new Date(g.date) <= today
    )

    // Calculate chapter-wise questions (DPP + Assignment + Kattar)
    const chapterQuestions = chapters.reduce((total, chapter) => {
      const dppCompleted = chapter.dppCompleted.filter(Boolean).length
      const assignmentCompleted = chapter.assignmentCompleted.filter(Boolean).length
      const kattarCompleted = chapter.kattarCompleted.filter(Boolean).length
      return total + dppCompleted + assignmentCompleted + kattarCompleted
    }, 0)

    const questionStats = {
      daily: todayGoal?.totalQuestions || 0,
      weekly: weeklyGoals.reduce((sum, g) => sum + g.totalQuestions, 0),
      monthly: monthlyGoals.reduce((sum, g) => sum + g.totalQuestions, 0),
      lifetime: dailyGoals.reduce((sum, g) => sum + g.totalQuestions, 0) + chapterQuestions,
      chapterwise: chapterQuestions
    }

    // Calculate test performance
    const testPerformance = {
      totalTests: testPerformances.length,
      averageScore: testPerformances.length > 0 
        ? Math.round(testPerformances.reduce((sum, t) => sum + t.score, 0) / testPerformances.length)
        : 0,
      lastScore: testPerformances.length > 0 ? testPerformances[0].score : 0,
      improvement: testPerformances.length >= 2 
        ? testPerformances[0].score - testPerformances[1].score
        : 0
    }

    // Calculate mood insights
    const happyMoods = moodEntries.filter(m => m.mood === 'happy').length
    const currentDate = new Date()
    let currentStreak = 0
    
    for (let i = 0; i < moodEntries.length; i++) {
      const entry = moodEntries[i]
      const entryDate = new Date(entry.date)
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === i && entry.mood === 'happy') {
        currentStreak++
      } else {
        break
      }
    }

    const moodInsights = {
      happyDays: happyMoods,
      totalEntries: moodEntries.length,
      currentStreak
    }

    return NextResponse.json({
      success: true,
      data: {
        subjectProgress,
        questionStats,
        testPerformance,
        moodInsights
      }
    })

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}