import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ChapterRepository } from '@/lib/repositories/chapter-repository'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const chapterId = params.id
    const { type, questionIndex, completed } = await request.json()

    // Validate input
    if (!['assignment', 'kattar'].includes(type) || 
        typeof questionIndex !== 'number' || 
        typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }

    let updatedChapter

    // Update question completion status based on type
    if (type === 'assignment') {
      updatedChapter = await ChapterRepository.updateAssignmentCompletion(
        chapterId,
        questionIndex,
        completed
      )
    } else {
      updatedChapter = await ChapterRepository.updateKattarCompletion(
        chapterId,
        questionIndex,
        completed
      )
    }

    // Calculate progress for response
    const progress = ChapterRepository.calculateProgress(updatedChapter)

    return NextResponse.json({
      success: true,
      chapter: updatedChapter,
      progress
    })
  } catch (error) {
    console.error('Error updating question completion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}