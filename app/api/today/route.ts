import { NextResponse } from 'next/server';
import { getTodayLog, initDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');
    
    const todayLog = await getTodayLog(userId);
    return NextResponse.json(todayLog);
  } catch (error) {
    console.error('Today log API error:', error);
    return NextResponse.json({ error: 'Failed to fetch today log' }, { status: 500 });
  }
}