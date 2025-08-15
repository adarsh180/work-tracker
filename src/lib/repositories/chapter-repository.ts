import { prisma } from '../prisma'
import { Chapter } from '@prisma/client'
import { SubjectRepository } from './subject-repository'

export type ChapterUpdateData = {
  lecturesCompleted?: boolean[]
  dppCompleted?: boolean[]
  assignmentQuestions?: number
  assignmentCompleted?: boolean[]
  kattarQuestions?: number
  kattarCompleted?: boolean[]
  revisionScore?: number
}

export type ChapterProgress = {
  lectureProgress: number
  dppProgress: number
  assignmentProgress: number
  kattarProgress: number
  overallProgress: number
  needsImprovement: boolean
}

/**
 * Chapter Repository - CRUD operations for chapters
 */
export class ChapterRepository {
  /**
   * Get all chapters for a subject
   */
  static async getAllBySubjectId(subjectId: string): Promise<Chapter[]> {
    return await prisma.chapter.findMany({
      where: { subjectId },
      orderBy: { name: 'asc' }
    })
  }

  /**
   * Get a specific chapter by ID
   */
  static async getById(chapterId: string): Promise<Chapter | null> {
    return await prisma.chapter.findUnique({
      where: { id: chapterId }
    })
  }

  /**
   * Get a chapter by subject ID and chapter name
   */
  static async getBySubjectIdAndName(subjectId: string, name: string): Promise<Chapter | null> {
    return await prisma.chapter.findFirst({
      where: {
        subjectId,
        name
      }
    })
  }

  /**
   * Create a new chapter
   */
  static async create(data: {
    subjectId: string
    name: string
    lectureCount: number
    assignmentQuestions?: number
    kattarQuestions?: number
    revisionScore?: number
  }): Promise<Chapter> {
    const lectureCount = data.lectureCount
    
    return await prisma.chapter.create({
      data: {
        subjectId: data.subjectId,
        name: data.name,
        lectureCount,
        lecturesCompleted: new Array(lectureCount).fill(false),
        dppCompleted: new Array(lectureCount).fill(false),
        assignmentQuestions: data.assignmentQuestions ?? 0,
        assignmentCompleted: [],
        kattarQuestions: data.kattarQuestions ?? 0,
        kattarCompleted: [],
        revisionScore: data.revisionScore ?? 1
      }
    })
  }

  /**
   * Update chapter progress and data
   */
  static async update(chapterId: string, data: ChapterUpdateData): Promise<Chapter> {
    const chapter = await prisma.chapter.update({
      where: { id: chapterId },
      data
    })

    // Trigger subject progress recalculation
    await SubjectRepository.calculateAndUpdateProgress(chapter.subjectId)

    return chapter
  }

  /**
   * Update lecture completion status
   */
  static async updateLectureCompletion(chapterId: string, lectureIndex: number, completed: boolean): Promise<Chapter> {
    const chapter = await this.getById(chapterId)
    if (!chapter) throw new Error('Chapter not found')

    const updatedLectures = [...chapter.lecturesCompleted]
    updatedLectures[lectureIndex] = completed

    return await this.update(chapterId, { lecturesCompleted: updatedLectures })
  }

  /**
   * Update DPP completion status
   */
  static async updateDppCompletion(chapterId: string, dppIndex: number, completed: boolean): Promise<Chapter> {
    const chapter = await this.getById(chapterId)
    if (!chapter) throw new Error('Chapter not found')

    const updatedDpp = [...chapter.dppCompleted]
    updatedDpp[dppIndex] = completed

    return await this.update(chapterId, { dppCompleted: updatedDpp })
  }

  /**
   * Update assignment questions count and reset completion array
   */
  static async updateAssignmentQuestions(chapterId: string, count: number): Promise<Chapter> {
    const assignmentCompleted = new Array(count).fill(false)
    return await this.update(chapterId, { 
      assignmentQuestions: count,
      assignmentCompleted 
    })
  }

  /**
   * Update assignment completion status
   */
  static async updateAssignmentCompletion(chapterId: string, assignmentIndex: number, completed: boolean): Promise<Chapter> {
    const chapter = await this.getById(chapterId)
    if (!chapter) throw new Error('Chapter not found')

    const updatedAssignments = [...chapter.assignmentCompleted]
    updatedAssignments[assignmentIndex] = completed

    return await this.update(chapterId, { assignmentCompleted: updatedAssignments })
  }

  /**
   * Update kattar questions count and reset completion array
   */
  static async updateKattarQuestions(chapterId: string, count: number): Promise<Chapter> {
    const kattarCompleted = new Array(count).fill(false)
    return await this.update(chapterId, { 
      kattarQuestions: count,
      kattarCompleted 
    })
  }

  /**
   * Update kattar completion status
   */
  static async updateKattarCompletion(chapterId: string, kattarIndex: number, completed: boolean): Promise<Chapter> {
    const chapter = await this.getById(chapterId)
    if (!chapter) throw new Error('Chapter not found')

    const updatedKattar = [...chapter.kattarCompleted]
    updatedKattar[kattarIndex] = completed

    return await this.update(chapterId, { kattarCompleted: updatedKattar })
  }

  /**
   * Update revision score
   */
  static async updateRevisionScore(chapterId: string, score: number): Promise<Chapter> {
    if (score < 1 || score > 10) {
      throw new Error('Revision score must be between 1 and 10')
    }
    return await this.update(chapterId, { revisionScore: score })
  }

  /**
   * Calculate chapter progress metrics
   */
  static calculateProgress(chapter: Chapter): ChapterProgress {
    const lectureProgress = chapter.lectureCount > 0 
      ? (chapter.lecturesCompleted.filter(Boolean).length / chapter.lectureCount) * 100 
      : 0

    const dppProgress = chapter.lectureCount > 0 
      ? (chapter.dppCompleted.filter(Boolean).length / chapter.lectureCount) * 100 
      : 0

    const assignmentProgress = chapter.assignmentQuestions > 0 
      ? (chapter.assignmentCompleted.filter(Boolean).length / chapter.assignmentQuestions) * 100 
      : 0

    const kattarProgress = chapter.kattarQuestions > 0 
      ? (chapter.kattarCompleted.filter(Boolean).length / chapter.kattarQuestions) * 100 
      : 0

    // Calculate overall progress (weighted average)
    const totalItems = chapter.lectureCount + chapter.lectureCount + chapter.assignmentQuestions + chapter.kattarQuestions
    const completedItems = chapter.lecturesCompleted.filter(Boolean).length + 
                          chapter.dppCompleted.filter(Boolean).length +
                          chapter.assignmentCompleted.filter(Boolean).length +
                          chapter.kattarCompleted.filter(Boolean).length

    const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

    return {
      lectureProgress,
      dppProgress,
      assignmentProgress,
      kattarProgress,
      overallProgress,
      needsImprovement: chapter.revisionScore < 6
    }
  }

  /**
   * Get chapter with calculated progress
   */
  static async getWithProgress(chapterId: string): Promise<(Chapter & { progress: ChapterProgress }) | null> {
    const chapter = await this.getById(chapterId)
    if (!chapter) return null

    const progress = this.calculateProgress(chapter)
    return { ...chapter, progress }
  }

  /**
   * Get all chapters for a subject with progress
   */
  static async getAllWithProgressBySubjectId(subjectId: string): Promise<(Chapter & { progress: ChapterProgress })[]> {
    const chapters = await this.getAllBySubjectId(subjectId)
    
    return chapters.map(chapter => ({
      ...chapter,
      progress: this.calculateProgress(chapter)
    }))
  }

  /**
   * Delete a chapter
   */
  static async delete(chapterId: string): Promise<void> {
    const chapter = await this.getById(chapterId)
    if (!chapter) throw new Error('Chapter not found')

    await prisma.chapter.delete({
      where: { id: chapterId }
    })

    // Recalculate subject progress after deletion
    await SubjectRepository.calculateAndUpdateProgress(chapter.subjectId)
  }

  /**
   * Get chapters that need improvement (revision score < 6)
   */
  static async getChaptersNeedingImprovement(userId: string): Promise<(Chapter & { subjectName: string })[]> {
    return await prisma.chapter.findMany({
      where: {
        revisionScore: { lt: 6 }
      },
      include: {
        subject: {
          select: { name: true }
        }
      }
    }).then(chapters => 
      chapters.map(chapter => ({
        ...chapter,
        subjectName: chapter.subject.name
      }))
    )
  }

  /**
   * Get total question count for analytics
   */
  static async getTotalQuestionCount(chapterId: string): Promise<number> {
    const chapter = await this.getById(chapterId)
    if (!chapter) return 0

    return chapter.assignmentCompleted.filter(Boolean).length + 
           chapter.kattarCompleted.filter(Boolean).length
  }

  /**
   * Bulk update multiple chapters (for batch operations)
   */
  static async bulkUpdate(updates: { chapterId: string; data: ChapterUpdateData }[]): Promise<void> {
    const subjectIds = new Set<string>()

    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        const chapter = await tx.chapter.update({
          where: { id: update.chapterId },
          data: update.data
        })
        subjectIds.add(chapter.subjectId)
      }
    })

    // Recalculate progress for all affected subjects
    for (const subjectId of Array.from(subjectIds)) {
      await SubjectRepository.calculateAndUpdateProgress(subjectId)
    }
  }
}