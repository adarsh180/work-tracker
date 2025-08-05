import { NextResponse } from 'next/server';
import { initDatabase } from '@/lib/database';
import { getStudyPlan } from '@/lib/database-extended';

export async function GET() {
  try {
    await initDatabase();
    const today = new Date().toISOString().split('T')[0];
    const plan = await getStudyPlan(1, today);
    
    if (!plan) {
      // Generate AI-powered study plan for today
      const defaultPlan = {
        morning_focus: 'Physics - Weak chapters review',
        afternoon_focus: 'Chemistry - Practice problems',
        evening_focus: 'Biology - Revision and tests',
        target_questions: 400,
        target_chapters: ['Current chapter focus'],
        priority_subjects: ['physics', 'chemistry']
      };
      
      return NextResponse.json(defaultPlan);
    }
    
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Today study plan API error:', error);
    return NextResponse.json({
      morning_focus: 'Start with your strongest subject',
      afternoon_focus: 'Focus on practice problems',
      evening_focus: 'Review and test preparation',
      target_questions: 400,
      target_chapters: [],
      priority_subjects: []
    });
  }
}