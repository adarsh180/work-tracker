import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { RankingAnalyticsEngine } from '@/lib/ranking-analytics'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ranking = await RankingAnalyticsEngine.calculateRanking(session.user.email)

    return NextResponse.json({ success: true, data: ranking })
  } catch (error) {
    console.error('Ranking analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}