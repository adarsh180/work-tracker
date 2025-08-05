import { NextResponse } from 'next/server';
import { saveDailyLog, getDailyLogs, initDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const userId = parseInt(searchParams.get('userId') || '1');
    
    const logs = await getDailyLogs(userId, days);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Daily log API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const data = await request.json();
    
    const result = await saveDailyLog(data);
    
    // Update streak based on total questions and trigger dashboard update
    const totalQuestions = (data.phyQs || 0) + (data.chemQs || 0) + (data.botQs || 0) + (data.zooQs || 0);
    const isFireDay = totalQuestions >= 250;
    
    // Always update streak when daily task is entered
    const { updateStreak } = await import('@/lib/database');
    await updateStreak(data.userId || 1, isFireDay);
    

    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Save daily log error:', error);
    return NextResponse.json({ error: 'Failed to save daily log' }, { status: 500 });
  }
}