import { NextRequest, NextResponse } from 'next/server'
import { SubjectRepository } from '@/lib/repositories/subject-repository'

export async function GET(request: NextRequest) {
  try {
    const dashboardSummary = await SubjectRepository.getDashboardSummary()
    
    return NextResponse.json(dashboardSummary, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard subjects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}