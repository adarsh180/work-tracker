import { NextResponse } from 'next/server';
import { getStreakData, updateStreak, initDatabase } from '@/lib/database';

export async function GET() {
  try {
    await initDatabase();
    const streakData = await getStreakData(1);
    return NextResponse.json(streakData);
  } catch (error) {
    console.error('Streak API error:', error);
    return NextResponse.json({
      current_streak: 0,
      longest_streak: 0,
      last_streak_date: null,
      total_fire_days: 0
    });
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const { isFireDay } = await request.json();
    
    const result = await updateStreak(1, isFireDay);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Update streak error:', error);
    return NextResponse.json({ error: 'Failed to update streak' }, { status: 500 });
  }
}