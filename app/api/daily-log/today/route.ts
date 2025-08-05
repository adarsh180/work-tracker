import { NextResponse } from 'next/server';
import { getTodayLog, initDatabase } from '@/lib/database';

export async function GET() {
  try {
    await initDatabase();
    const todayLog = await getTodayLog(1);
    return NextResponse.json(todayLog || {
      phy_qs: 0,
      chem_qs: 0,
      bot_qs: 0,
      zoo_qs: 0,
      total_questions: 0,
      total_lifetime_questions: 0,
      revision_done: false,
      errors_fixed: 0
    });
  } catch (error) {
    console.error('Today log API error:', error);
    return NextResponse.json({
      phy_qs: 0,
      chem_qs: 0,
      bot_qs: 0,
      zoo_qs: 0,
      total_questions: 0,
      total_lifetime_questions: 0,
      revision_done: false,
      errors_fixed: 0
    });
  }
}