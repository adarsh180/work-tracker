import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const streak = await prisma.studyStreak.findFirst({
      where: { 
        userId: session.user.email,
        streakType: 'daily'
      }
    })

    if (!streak) {
      const newStreak = await prisma.studyStreak.create({
        data: {
          userId: session.user.email,
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: new Date(),
          totalDays: 0,
          streakType: 'daily'
        }
      })
      return NextResponse.json(newStreak)
    }

    return NextResponse.json(streak)
  } catch (error) {
    console.error('Error fetching study streak:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const streak = await prisma.studyStreak.findFirst({
      where: { 
        userId: session.user.email,
        streakType: 'daily'
      }
    })

    if (!streak) {
      const newStreak = await prisma.studyStreak.create({
        data: {
          userId: session.user.email,
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: today,
          totalDays: 1,
          streakType: 'daily'
        }
      })
      return NextResponse.json({ success: true, data: newStreak })
    }

    const lastStudyDate = new Date(streak.lastStudyDate)
    lastStudyDate.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((today.getTime() - lastStudyDate.getTime()) / (1000 * 60 * 60 * 24))

    let updatedStreak
    if (daysDiff === 0) {
      // Already studied today
      return NextResponse.json({ success: true, data: streak, message: 'Already marked for today' })
    } else if (daysDiff === 1) {
      // Consecutive day
      const newCurrentStreak = streak.currentStreak + 1
      updatedStreak = await prisma.studyStreak.update({
        where: { id: streak.id },
        data: {
          currentStreak: newCurrentStreak,
          longestStreak: Math.max(streak.longestStreak, newCurrentStreak),
          lastStudyDate: today,
          totalDays: streak.totalDays + 1
        }
      })
    } else {
      // Streak broken
      updatedStreak = await prisma.studyStreak.update({
        where: { id: streak.id },
        data: {
          currentStreak: 1,
          lastStudyDate: today,
          totalDays: streak.totalDays + 1
        }
      })
    }

    return NextResponse.json({ success: true, data: updatedStreak })
  } catch (error) {
    console.error('Error updating study streak:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}