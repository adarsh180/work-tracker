import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DailyGoalsRepository } from '@/lib/repositories/daily-goals-repository'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const summary = await DailyGoalsRepository.getDailySummary(session.user.email, today)

    return NextResponse.json({
      success: true,
      data: summary
    })

  } catch (error) {
    console.error('Error fetching daily summary:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}