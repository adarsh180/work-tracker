import { NextResponse } from 'next/server';
import { saveDailyLog, getDailyLogs, getTodayLog, initDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');
    const days = parseInt(searchParams.get('days') || '30');
    
    const logs = await getDailyLogs(userId, days);
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Logs API error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const logData = await request.json();
    
    const result = await saveDailyLog(logData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Save log error:', error);
    return NextResponse.json({ error: 'Failed to save log' }, { status: 500 });
  }
}