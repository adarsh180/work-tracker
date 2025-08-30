import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AIRPredictionEngine } from '@/lib/air-prediction-engine'
import { ComprehensiveDataFetcher } from '@/lib/comprehensive-data-fetcher'
import { generateComprehensiveAIInsights } from '@/lib/groq-air-insights'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Fetch comprehensive user data
    const comprehensiveData = await ComprehensiveDataFetcher.fetchAllUserData(session.user.email)
    
    // Generate AIR prediction
    const prediction = await AIRPredictionEngine.generatePrediction(session.user.email)
    
    // Remove AI insights from automatic generation

    // Save prediction to database
    await prisma.aIRPrediction.create({
      data: {
        userId: session.user.email,
        predictedAIR: prediction.predictedAIR,
        confidenceScore: prediction.confidence,
        currentProgress: prediction.factors.progressScore,
        requiredProgress: 90,
        timeRemaining: Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        keyFactors: prediction.factors,
        recommendations: prediction.recommendations,
        riskAssessment: prediction.riskLevel
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: {
        ...prediction,
        comprehensiveData
      }
    })
  } catch (error) {
    console.error('AIR prediction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}