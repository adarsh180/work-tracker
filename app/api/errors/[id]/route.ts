import { NextResponse } from 'next/server';
import { updateErrorLog, deleteErrorLog, initDatabase } from '@/lib/database';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await initDatabase();
    const errorId = parseInt(params.id);
    const updateData = await request.json();
    
    const result = await updateErrorLog(errorId, updateData);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Update error log error:', error);
    return NextResponse.json({ error: 'Failed to update error log' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await initDatabase();
    const errorId = parseInt(params.id);
    
    const result = await deleteErrorLog(errorId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Delete error log error:', error);
    return NextResponse.json({ error: 'Failed to delete error log' }, { status: 500 });
  }
}