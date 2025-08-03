import { NextResponse } from 'next/server';
import { getSubjectTests, addSubjectTest, initDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    
    const tests = await getSubjectTests(subject || undefined);
    return NextResponse.json(tests.map((test: any) => ({
      ...test,
      date: new Date(test.date)
    })));
  } catch (error) {
    console.error('Subject tests API error:', error);
    // Return empty array when database fails
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const test = await request.json();
    
    const result = await addSubjectTest(test);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Add subject test error:', error);
    return NextResponse.json({ error: 'Failed to add subject test' }, { status: 500 });
  }
}