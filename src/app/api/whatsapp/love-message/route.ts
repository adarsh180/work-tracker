import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/lib/whatsapp-service';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Message is required' 
      }, { status: 400 });
    }

    const result = await WhatsAppService.sendMotivationalMessage(7, { recent: 'good' });
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Love message sent to Misti' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to send love message' 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Love message API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}