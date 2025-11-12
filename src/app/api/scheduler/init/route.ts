import { NextRequest, NextResponse } from 'next/server';
import { DailyScheduler } from '@/lib/daily-scheduler';

export async function POST(request: NextRequest) {
  try {
    DailyScheduler.initializeDailySchedule();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Daily WhatsApp scheduler initialized successfully',
      schedule: {
        morningMotivation: '06:00 AM',
        studyReminder: '09:00 AM', 
        afternoonEncouragement: '02:00 PM',
        eveningProgress: '09:00 PM',
        emergencyCheck: 'Every 6 hours',
        weeklyEncouragement: 'Sunday 08:00 PM'
      }
    });
    
  } catch (error) {
    console.error('Scheduler initialization error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initialize scheduler' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'WhatsApp Scheduler API',
    endpoints: {
      POST: 'Initialize daily WhatsApp message scheduler'
    },
    schedule: {
      '06:00': 'Morning motivation for Misti',
      '09:00': 'Study reminder',
      '14:00': 'Afternoon encouragement', 
      '21:00': 'Evening progress report',
      'every_6h': 'Emergency support check',
      'sunday_20:00': 'Weekly encouragement'
    }
  });
}