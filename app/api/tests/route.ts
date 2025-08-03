import { NextResponse } from 'next/server';
import { getTests, addTest, initDatabase } from '@/lib/database';

export async function GET() {
  try {
    await initDatabase();
    const tests = await getTests();
    return NextResponse.json(tests.map((test: any) => ({
      ...test,
      date: new Date(test.date)
    })));
  } catch (error) {
    console.error('Tests API error:', error);
    // Return empty array when database fails
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const test = await request.json();
    
    const result = await addTest(test);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Add test error:', error);
    return NextResponse.json({ error: 'Failed to add test' }, { status: 500 });
  }
}