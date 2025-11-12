import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp-service';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const userId = '1'; // Misti's user ID
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const [dailyGoal, subjects, testPerformance, moodEntry] = await Promise.all([
      prisma.dailyGoal.findFirst({
        where: { 
          userId,
          date: new Date(todayStr)
        }
      }),
      prisma.subject.findMany({
        include: { chapters: true }
      }),
      prisma.testPerformance.findFirst({
        where: { userId },
        orderBy: { testDate: 'desc' }
      }),
      prisma.moodEntry.findFirst({
        where: { date: new Date(todayStr) }
      })
    ]);

    // Calculate real study hours from study sessions
    const studySessions = await prisma.studySession.findMany({
      where: {
        userId,
        startTime: {
          gte: new Date(todayStr + 'T00:00:00.000Z'),
          lt: new Date(new Date(todayStr).getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    const totalStudyMinutes = studySessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const studyHours = Math.round(totalStudyMinutes / 60 * 10) / 10; // Round to 1 decimal

    // Get recent test performance for next goal
    const recentTest = await prisma.testPerformance.findFirst({
      where: { userId },
      orderBy: { testDate: 'desc' }
    });

    const nextGoal = recentTest && recentTest.score < 600 
      ? `Improve test score from ${recentTest.score} to 600+`
      : 'Complete 300+ questions tomorrow';

    const progressData = {
      questionsToday: dailyGoal?.totalQuestions || 0,
      studyHours: studyHours || 0,
      subjectsCovered: subjects.filter(s => s.completionPercentage > 0).length,
      physics: subjects.find(s => s.name === 'Physics')?.completionPercentage || 0,
      chemistry: subjects.find(s => s.name === 'Chemistry')?.completionPercentage || 0,
      biology: ((subjects.find(s => s.name === 'Botany')?.completionPercentage || 0) + 
                (subjects.find(s => s.name === 'Zoology')?.completionPercentage || 0)) / 2,
      mood: moodEntry ? parseInt(moodEntry.mood) : 5,
      nextGoal
    };

    const result = await WhatsAppService.sendDailyProgress(progressData);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Daily progress sent to WhatsApp' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send WhatsApp message' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Daily progress API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'WhatsApp Daily Progress API',
    endpoints: {
      POST: 'Send daily progress to WhatsApp'
    }
  });
}