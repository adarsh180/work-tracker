import { NextResponse } from 'next/server';
import { getAIFeedback, addAIFeedback, getStudySessions, getChapterProgress } from '@/lib/database';
import { generateAIFeedback, analyzeSubjectProgress } from '@/lib/groq';
import { SUBJECTS_DATA } from '@/lib/subjects-data';

export async function GET() {
  try {
    const feedback = await getAIFeedback();
    return NextResponse.json(feedback.map((f: any) => ({
      ...f,
      timestamp: new Date(f.timestamp)
    })));
  } catch (error) {
    console.error('AI Feedback API error:', error);
    // Return default feedback when database fails
    return NextResponse.json([
      {
        id: 1,
        message: "Great job on your NEET preparation! Keep up the consistent study schedule.",
        type: "suggestion",
        subject: null,
        timestamp: new Date()
      },
      {
        id: 2,
        message: "Focus on weak areas in Physics - mechanics and thermodynamics need attention.",
        type: "warning",
        subject: "physics",
        timestamp: new Date()
      }
    ]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // If subject analysis is provided, use it directly
    if (body.subjectAnalysis) {
      const aiMessage = await analyzeSubjectProgress(body.subjectAnalysis);
      
      const feedback = await addAIFeedback({
        message: aiMessage,
        type: 'suggestion',
        subject: body.subjectAnalysis.subject
      });

      return NextResponse.json({ feedback, success: true });
    }
    
    // If test analysis is provided
    if (body.testAnalysis) {
      const aiMessage = await generateAIFeedback(body.testAnalysis);
      
      const feedback = await addAIFeedback({
        message: aiMessage,
        type: 'suggestion',
        subject: null
      });

      return NextResponse.json({ feedback: aiMessage, success: true });
    }
    
    // Otherwise, analyze overall progress
    const sessions = await getStudySessions();
    
    // Get comprehensive progress data
    const progressData = await Promise.all(
      Object.keys(SUBJECTS_DATA).map(async (subjectId) => {
        const subjectSessions = sessions.filter((s: any) => s.subject === subjectId);
        const chapterProgress = await getChapterProgress(subjectId);
        
        return {
          subject: subjectId,
          sessions: subjectSessions.length,
          totalHours: subjectSessions.reduce((sum: number, s: any) => sum + s.duration, 0) / 60,
          avgScore: subjectSessions
            .filter((s: any) => s.score)
            .reduce((sum: number, s: any, _: any, arr: any[]) => sum + s.score / arr.length, 0) || 0,
          chaptersStarted: Array.from(new Set(chapterProgress.map((p: any) => p.chapter_name))).length,
          totalChapters: SUBJECTS_DATA[subjectId as keyof typeof SUBJECTS_DATA].chapters.length,
          lecturesCompleted: chapterProgress.filter((p: any) => p.completed).length
        };
      })
    );

    const studyData = {
      totalSessions: sessions.length,
      examDate: '2026-05-03',
      daysRemaining: Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      subjects: progressData
    };

    const aiMessage = await generateAIFeedback(studyData);
    
    // Add AI feedback to database
    const feedback = await addAIFeedback({
      message: aiMessage,
      type: 'suggestion',
      subject: null
    });

    // Generate motivational feedback if performance is good
    const overallProgress = progressData.reduce((sum, s) => sum + (s.chaptersStarted / s.totalChapters), 0) / progressData.length;
    if (overallProgress > 0.7) {
      await addAIFeedback({
        message: "Excellent progress! You're on track for NEET 2026. Keep maintaining this momentum! 🚀",
        type: 'achievement',
        subject: null
      });
    }

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error('Generate AI feedback error:', error);
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}