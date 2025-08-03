import { NextResponse } from 'next/server';
import { getDailyQuote, saveDailyQuote, initDatabase } from '@/lib/database';
import { generateDailyQuote } from '@/lib/groq';

export async function GET() {
  try {
    await initDatabase();
    let quote = await getDailyQuote();
    
    if (!quote) {
      quote = await generateDailyQuote();
      await saveDailyQuote(quote);
    }
    
    return NextResponse.json({ quote });
  } catch (error) {
    console.error('Daily quote API error:', error);
    return NextResponse.json({ 
      quote: "Every step forward brings you closer to your medical dreams! 🩺" 
    });
  }
}

export async function POST() {
  try {
    await initDatabase();
    const newQuote = await generateDailyQuote();
    await saveDailyQuote(newQuote);
    
    return NextResponse.json({ quote: newQuote });
  } catch (error) {
    console.error('Generate quote error:', error);
    return NextResponse.json({ error: 'Failed to generate quote' }, { status: 500 });
  }
}