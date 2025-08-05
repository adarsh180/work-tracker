import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/database';
import { Pool } from 'pg';

export async function POST() {
  try {
    await initDatabase();
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    const client = await pool.connect();
    
    try {
      // Clear all data tables
      await client.query('TRUNCATE TABLE daily_logs RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE streak_tracking RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE error_logs RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE mock_tests RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE calendar_entries RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE study_sessions RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE ai_feedback RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE chapter_progress RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE tests RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE subject_tests RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE daily_quotes RESTART IDENTITY CASCADE');
      
      // Reset streak data
      await client.query(`
        INSERT INTO streak_tracking (user_id, current_streak, longest_streak, total_fire_days) 
        VALUES (1, 0, 0, 0) 
        ON CONFLICT (user_id) DO UPDATE SET 
        current_streak = 0, longest_streak = 0, total_fire_days = 0
      `);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database reset successfully' 
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database reset error:', error);
    return NextResponse.json({ 
      error: 'Failed to reset database' 
    }, { status: 500 });
  }
}