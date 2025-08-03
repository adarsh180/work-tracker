import { NextResponse } from 'next/server';
import { getChapterProgress, updateChapterProgress, initDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    
    if (!subject) {
      return NextResponse.json({ error: 'Subject parameter required' }, { status: 400 });
    }
    
    const progress = await getChapterProgress(subject);
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Chapter progress API error:', error);
    // Return empty array when database fails
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const data = await request.json();
    const result = await updateChapterProgress(data);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message?.includes('connection lost')) {
      return NextResponse.json({ error: 'Connection lost. Please try again.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await initDatabase();
    const { updateChapterQuestions } = await import('@/lib/database');
    const { subject, chapterName, questionsSolved } = await request.json();
    
    await updateChapterQuestions(subject, chapterName, questionsSolved);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update questions error:', error);
    return NextResponse.json({ error: 'Failed to update questions' }, { status: 500 });
  }
}