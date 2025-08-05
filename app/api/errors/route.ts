import { NextResponse } from 'next/server';
import { addErrorLog, getErrorLogs, initDatabase } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId') || '1');
    
    const errors = await getErrorLogs(userId);
    return NextResponse.json(errors);
  } catch (error) {
    console.error('Errors API error:', error);
    return NextResponse.json({ error: 'Failed to fetch errors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDatabase();
    const errorData = await request.json();
    
    const result = await addErrorLog(errorData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Add error log error:', error);
    return NextResponse.json({ error: 'Failed to add error log' }, { status: 500 });
  }
}