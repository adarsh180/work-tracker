import { NextResponse } from 'next/server';
import { saveCalendarEntry, getCalendarEntries, deleteCalendarEntry, initDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const entries = await getCalendarEntries(userId, startDate || undefined, endDate || undefined);
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json({ error: 'Failed to fetch calendar entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const entryData = await request.json();
    
    const result = await saveCalendarEntry(entryData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Save calendar entry error:', error);
    return NextResponse.json({ error: 'Failed to save calendar entry' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');
    const date = searchParams.get('date');
    
    if (!date) {
      return NextResponse.json({ error: 'Date parameter required' }, { status: 400 });
    }
    
    const result = await deleteCalendarEntry(userId, date);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete calendar entry error:', error);
    return NextResponse.json({ error: 'Failed to delete calendar entry' }, { status: 500 });
  }
}