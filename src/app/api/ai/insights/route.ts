import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiInsightsService, AIInsightsService } from '@/lib/ai-insights';
import { SubjectRepository } from '@/lib/repositories/subject-repository';
import { TestPerformanceRepository } from '@/lib/repositories/test-performance-repository';
import { QuestionAnalyticsRepository } from '@/lib/repositories/question-analytics-repository';
import { MoodRepository } from '@/lib/repositories/mood-repository';
import { RateLimitError, GroqError } from '@/lib/groq-client';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { insightType } = await request.json();

    // Validate insight type
    const validTypes = ['study-insights', 'optimal-schedule', 'motivational-boost', 'weak-area-focus'];
    if (!validTypes.includes(insightType)) {
      return NextResponse.json(
        { error: 'Invalid insight type' },
        { status: 400 }
      );
    }

    // Gather user data
    const [subjects, testPerformances] = await Promise.all([
      SubjectRepository.getAll(),
      TestPerformanceRepository.getAllByUserId(session.user.email),
    ]);
    
    // Get basic analytics
    const questionAnalytics = { daily: 0, weekly: 0, monthly: 0, lifetime: 0 };
    const moodAnalytics = { totalEntries: 0, happyDays: 0, currentStreak: 0 };

    // Prepare data for AI analysis
    const studyData = AIInsightsService.prepareStudyData(
      subjects,
      testPerformances,
      questionAnalytics,
      moodAnalytics
    );

    // Generate insights based on type
    let result;
    switch (insightType) {
      case 'study-insights':
        result = await aiInsightsService.generateStudyInsights(studyData);
        break;
      case 'optimal-schedule':
        result = await aiInsightsService.generateOptimalSchedule(studyData);
        break;
      case 'motivational-boost':
        result = await aiInsightsService.generateMotivationalBoost(studyData);
        break;
      case 'weak-area-focus':
        result = await aiInsightsService.generateWeakAreaFocus(studyData);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid insight type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('AI insights generation error:', error);

    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: 60 
        },
        { status: 429 }
      );
    }

    if (error instanceof GroqError) {
      return NextResponse.json(
        { 
          error: 'AI service temporarily unavailable. Please try again later.',
          details: error.message 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}