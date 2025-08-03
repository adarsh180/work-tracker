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
    console.log('POST /api/chapter-progress called');
    await initDatabase();
    console.log('Database initialized');
    
    const data = await request.json();
    console.log('Request data:', data);
    
    const result = await updateChapterProgress(data);
    console.log('Update result:', result);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Update progress error:', error);
    console.error('Error stack:', error.stack);
    
    if (error.message?.includes('connection lost')) {
      return NextResponse.json({ error: 'Connection lost. Please try again.' }, { status: 503 });
    }
    return NextResponse.json({ 
      error: 'Failed to update progress', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
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