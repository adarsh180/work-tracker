import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/database';
import { createStudyPlan } from '@/lib/database-extended';

export async function POST(request: Request) {
  try {
    await initDatabase();
    const data = await request.json();
    
    const result = await createStudyPlan({
      userId: 1,
      date: data.date || new Date().toISOString().split('T')[0],
      morningFocus: data.morningFocus,
      afternoonFocus: data.afternoonFocus,
      eveningFocus: data.eveningFocus,
      targetQuestions: data.targetQuestions || 400,
      targetChapters: data.targetChapters || [],
      prioritySubjects: data.prioritySubjects || [],
      aiGenerated: data.aiGenerated || true
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Study plan API error:', error);
    return NextResponse.json({ error: 'Failed to create study plan' }, { status: 500 });
  }
}