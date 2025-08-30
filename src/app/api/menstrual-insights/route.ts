import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateMenstrualInsights } from '@/lib/groq-menstrual-insights'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const insightData = await request.json()
    const insights = await generateMenstrualInsights(insightData)

    return NextResponse.json({ success: true, data: insights })
  } catch (error) {
    console.error('Menstrual insights error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}