import { NextResponse } from 'next/server';
import { addMockTest, getMockTests, initDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');
    
    const mockTests = await getMockTests(userId);
    return NextResponse.json(mockTests);
  } catch (error) {
    console.error('Mock tests API error:', error);
    return NextResponse.json({ error: 'Failed to fetch mock tests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const testData = await request.json();
    
    const result = await addMockTest(testData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Add mock test error:', error);
    return NextResponse.json({ error: 'Failed to add mock test' }, { status: 500 });
  }
}