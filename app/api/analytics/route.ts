import { NextResponse } from 'next/server';
import { getStudySessions, initDatabase, getChapterProgress } from '@/lib/database';
import { SUBJECTS_DATA, getEmojiForPercentage } from '@/lib/subjects-data';

export async function GET() {
  try {
    await initDatabase();
    const sessions = await getStudySessions();
    
    const subjectProgress = await Promise.all(
      Object.entries(SUBJECTS_DATA).map(async ([subjectId, subjectInfo]) => {
        const subjectSessions = sessions.filter((s: any) => s.subject === subjectId);
        const totalHours = subjectSessions.reduce((sum: number, s: any) => sum + s.duration, 0) / 60;
        const scores = subjectSessions.filter((s: any) => s.score).map((s: any) => s.score);
        const averageScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
        
        // Get chapter progress
        const chapterProgressData = await getChapterProgress(subjectId);
        const totalChapters = subjectInfo.chapters.length;
        let completedChapters = 0;
        
        // Calculate completion based on lectures completed
        subjectInfo.chapters.forEach(chapter => {
          const chapterProgress = chapterProgressData.filter((p: any) => p.chapter_name === chapter.name);
          const completedLectures = chapterProgress.filter((p: any) => p.completed).length;
          const completedDPPs = chapterProgress.filter((p: any) => p.dpp_completed).length;
          const totalProgress = (completedLectures + completedDPPs) / (chapter.lectures * 2);
          if (totalProgress >= 0.7) { // 70% completion threshold
            completedChapters++;
          }
        });
        
        const completionPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
        
        // Calculate actual progress data for charts
        const totalLectures = chapterProgressData.filter((p: any) => p.completed).length;
        const totalDPPs = chapterProgressData.filter((p: any) => p.dpp_completed).length;
        const totalAssignments = chapterProgressData.filter((p: any) => 
          p.normal_assignment_1 || p.normal_assignment_2 || p.kattar_assignment
        ).length;
        const totalQuestions = chapterProgressData.reduce((sum: number, p: any) => sum + (p.questions_solved || 0), 0);
        
        // Weekly progress based on actual data
        const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - 6 + i);
          const dayStart = new Date(date.setHours(0, 0, 0, 0));
          const dayEnd = new Date(date.setHours(23, 59, 59, 999));
          
          // Count actual progress made on this day
          const dayProgress = chapterProgressData.filter((p: any) => {
            const updateDate = new Date(p.updated_at);
            return updateDate >= dayStart && updateDate <= dayEnd;
          });
          
          const dayLectures = dayProgress.filter((p: any) => p.completed).length;
          const dayDPPs = dayProgress.filter((p: any) => p.dpp_completed).length;
          const dayAssignments = dayProgress.filter((p: any) => 
            p.normal_assignment_1 || p.normal_assignment_2 || p.kattar_assignment
          ).length;
          
          return dayLectures + dayDPPs + dayAssignments;
        });

        return {
          subject: subjectInfo.name.toLowerCase(),
          totalHours: Math.round(totalHours * 10) / 10,
          completedTopics: completedChapters,
          totalTopics: totalChapters,
          averageScore: Math.round(averageScore),
          weeklyProgress,
          completionPercentage: Math.round(completionPercentage),
          emoji: getEmojiForPercentage(completionPercentage),
          lectures: totalLectures,
          dpps: totalDPPs,
          assignments: totalAssignments,
          questions: totalQuestions
        };
      })
    );

    const totalStudyHours = sessions.reduce((sum: number, s: any) => sum + s.duration, 0) / 60;
    
    return NextResponse.json({
      totalStudyHours: Math.round(totalStudyHours * 10) / 10,
      weeklyGoal: 40,
      subjectProgress,
      recentSessions: sessions.slice(0, 10).map((s: any) => ({
        ...s,
        date: new Date(s.date)
      })),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    // Return default data when database fails
    return NextResponse.json({
      totalStudyHours: 0,
      weeklyGoal: 40,
      subjectProgress: Object.entries(SUBJECTS_DATA).map(([subjectId, subjectInfo]) => ({
        subject: subjectInfo.name.toLowerCase(),
        totalHours: 0,
        completedTopics: 0,
        totalTopics: subjectInfo.chapters.length,
        averageScore: 0,
        weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
        completionPercentage: 0,
        emoji: '📚',
        lectures: 0,
        dpps: 0,
        assignments: 0,
        questions: 0
      })),
      recentSessions: [],
      lastUpdated: new Date().toISOString()
    });
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const { addStudySession } = await import('@/lib/database');
    const session = await request.json();
    
    const newSession = await addStudySession(session);
    return NextResponse.json(newSession);
  } catch (error) {
    console.error('Add session error:', error);
    return NextResponse.json({ error: 'Failed to add session' }, { status: 500 });
  }
}