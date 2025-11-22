import { prisma } from './prisma'

export type AIRPredictionResult = {
  predictedAIR: number
  confidence: number
  factors: {
    progressScore: number
    testTrend: number
    consistency: number
    biologicalFactor: number
    externalFactor: number
  }
  recommendations: string[]
  riskLevel: 'low' | 'medium' | 'high'
  comprehensiveData?: any
}

export class AIRPredictionEngine {
  static async generatePrediction(userId: string): Promise<AIRPredictionResult> {
    try {
      // Get user data
      const [subjects, dailyGoals, testPerformances, menstrualData, studySessions] = await Promise.all([
        prisma.subject.findMany({ include: { chapters: true } }),
        prisma.dailyGoal.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 30
        }),
        prisma.testPerformance.findMany({
          where: { userId },
          orderBy: { testDate: 'desc' },
          take: 10
        }),
        prisma.menstrualCycle.findMany({
          where: { userId },
          orderBy: { cycleStartDate: 'desc' },
          take: 7
        }),
        prisma.studySession.findMany({
          where: { userId },
          orderBy: { startTime: 'desc' },
          take: 30
        })
      ])

      // Calculate factors
      const progressScore = this.calculateProgressScore(subjects)
      const afternoonAdjustment = this.calculateAfternoonAdjustment(studySessions)
      const testTrend = this.calculateTestTrend(testPerformances, afternoonAdjustment)
      const consistency = this.calculateConsistency(dailyGoals)
      const biologicalFactor = this.calculateBiologicalFactor(menstrualData)
      const externalFactor = this.calculateExternalFactor()

      // RIGOROUS 2024-2026 NEET Weighted Prediction
      const weightedScore = (
        progressScore * 0.40 +     // Syllabus completion (increased weight)
        testTrend * 0.35 +         // Test performance (increased weight)
        consistency * 0.20 +       // Daily study consistency
        biologicalFactor * 0.03 +  // Menstrual cycle (reduced impact)
        externalFactor * 0.02      // Time remaining (reduced impact)
      )

      // RIGOROUS 2024-2026 NEET AIR Calculation - MUCH HARDER!
      const normalizedScore = Math.max(5, Math.min(95, weightedScore))
      
      // AIR calculation for 1 million NEET candidates (2026)
      let predictedAIR: number
      if (normalizedScore >= 95) {
        predictedAIR = Math.round(1 + (100 - normalizedScore) * 20) // AIR 1-100 (top 0.01%)
      } else if (normalizedScore >= 90) {
        predictedAIR = Math.round(100 + (95 - normalizedScore) * 180) // AIR 100-1000 (top 0.1%)
      } else if (normalizedScore >= 85) {
        predictedAIR = Math.round(1000 + (90 - normalizedScore) * 800) // AIR 1000-5000 (top 0.5%)
      } else if (normalizedScore >= 80) {
        predictedAIR = Math.round(5000 + (85 - normalizedScore) * 2000) // AIR 5000-15000 (top 1.5%)
      } else if (normalizedScore >= 70) {
        predictedAIR = Math.round(15000 + (80 - normalizedScore) * 3500) // AIR 15000-50000 (top 5%)
      } else if (normalizedScore >= 60) {
        predictedAIR = Math.round(50000 + (70 - normalizedScore) * 5000) // AIR 50000-100000 (top 10%)
      } else if (normalizedScore >= 50) {
        predictedAIR = Math.round(100000 + (60 - normalizedScore) * 10000) // AIR 100000-200000 (top 20%)
      } else if (normalizedScore >= 40) {
        predictedAIR = Math.round(200000 + (50 - normalizedScore) * 20000) // AIR 200000-400000 (top 40%)
      } else if (normalizedScore >= 30) {
        predictedAIR = Math.round(400000 + (40 - normalizedScore) * 30000) // AIR 400000-700000 (top 70%)
      } else {
        predictedAIR = Math.round(700000 + (30 - normalizedScore) * 10000) // AIR 700000+ (bottom 30%)
      }
      
      predictedAIR = Math.max(1, Math.min(1000000, predictedAIR)) // Cap at 1 million candidates
      
      // Confidence based on data quality and consistency
      const dataQuality = this.calculateDataQuality(subjects, dailyGoals, testPerformances)
      const confidence = Math.min(0.95, Math.max(0.05, (normalizedScore / 100) * dataQuality))

      const factors = {
        progressScore,
        testTrend,
        consistency,
        biologicalFactor,
        externalFactor
      }

      const recommendations = this.generateRecommendations(factors, predictedAIR)
      const riskLevel = this.assessRiskLevel(predictedAIR, confidence)
      
      // Calculate comprehensive data for UI
      const comprehensiveData = {
        totalQuestionsLifetime: dailyGoals.reduce((sum, g) => sum + (g.totalQuestions || 0), 0),
        consistencyScore: consistency,
        averageTestScore: testPerformances.length > 0 ? 
          testPerformances.reduce((sum, t) => sum + (t.score || 0), 0) / testPerformances.length : 0,
        studyStreak: this.calculateStudyStreak(dailyGoals),
        chaptersCompleted: subjects.reduce((sum, s) => sum + (s.chapters?.filter((ch: any) => ch.isCompleted)?.length || 0), 0),
        totalChapters: subjects.reduce((sum, s) => sum + (s.chapters?.length || 0), 0)
      }

      return {
        predictedAIR,
        confidence,
        factors,
        recommendations,
        riskLevel,
        comprehensiveData
      }
    } catch (error) {
      console.error('AIR prediction error:', error)
      return {
        predictedAIR: 800000,
        confidence: 0.05,
        factors: { progressScore: 5, testTrend: 5, consistency: 5, biologicalFactor: 50, externalFactor: 50 },
        recommendations: ['Start tracking your progress', 'Begin taking mock tests', 'Set daily study goals'],
        riskLevel: 'high'
      }
    }
  }

  private static calculateProgressScore(subjects: any[]): number {
    if (!subjects || subjects.length === 0) return 5 // Very low score for no data
    
    let totalWeightedProgress = 0
    let totalWeight = 0
    
    subjects.forEach(subject => {
      // Weight subjects based on NEET importance
      const weight = this.getSubjectWeight(subject.name)
      const completedChapters = subject.chapters?.filter((ch: any) => ch.isCompleted)?.length || 0
      const totalChapters = subject.chapters?.length || 1
      const progress = (completedChapters / totalChapters) * 100
      
      totalWeightedProgress += progress * weight
      totalWeight += weight
    })
    
    const avgProgress = totalWeight > 0 ? totalWeightedProgress / totalWeight : 0
    
    // RIGOROUS 2024-2026 NEET Scoring - Competition is INTENSE!
    if (avgProgress >= 98) return 95  // Only 98%+ gets top score
    if (avgProgress >= 95) return 88  // 95% is now just good
    if (avgProgress >= 92) return 80  // 92% is average for top ranks
    if (avgProgress >= 88) return 70  // 88% is below average
    if (avgProgress >= 85) return 60  // 85% is concerning
    if (avgProgress >= 80) return 45  // 80% is poor for NEET 2026
    if (avgProgress >= 75) return 30  // 75% is very poor
    return Math.max(10, avgProgress * 0.25) // Harsh reality for <75%
  }
  
  private static getSubjectWeight(subjectName: string): number {
    const weights = {
      Physics: 1.0,
      Chemistry: 1.0,
      Botany: 2.0,
      Zoology: 2.0,
    }
    return weights[subjectName as keyof typeof weights] ?? 1.0
  }

  private static calculateTestTrend(tests: any[], afternoonAdj: number = 0): number {
    if (!tests || tests.length === 0) return 15 // Very low score for no test data
    if (tests.length === 1) {
      const base = Math.min(70, Math.max(15, (tests[0].score / 720) * 100))
      return Math.max(10, base + afternoonAdj)
    }
    // Exponential time-decay weighted average over recent tests
    const k = 0.25 // decay factor
    let weightedSum = 0
    let weightTotal = 0
    const n = Math.min(10, tests.length)
    for (let i = 0; i < n; i++) {
      const w = Math.exp(-k * i)
      weightedSum += ((tests[i].score || 0)) * w
      weightTotal += w
    }
    const recentAvg = weightedSum / Math.max(1e-6, weightTotal)
    
    // Calculate trend if we have enough data
    // Trend bonus comparing older cohort
    let trendBonus = 0
    if (tests.length >= 4) {
      const olderSliceStart = Math.min(n, 4)
      const olderSliceEnd = Math.min(n, 8)
      const olderTests = tests.slice(olderSliceStart, olderSliceEnd)
      if (olderTests.length > 0) {
        const olderAvg = olderTests.reduce((sum, t) => sum + (t.score || 0), 0) / olderTests.length
        trendBonus = Math.max(-20, Math.min(10, (recentAvg - olderAvg) / 25))
      }
    }
    // Volatility penalty (higher stddev → lower score)
    const vols = tests.slice(0, n).map(t => t.score || 0)
    const mean = recentAvg
    const variance = vols.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / Math.max(1, vols.length)
    const stddev = Math.sqrt(variance)
    const volatilityPenalty = Math.min(15, Math.max(0, (stddev - 20) / 4))
    
    // RIGOROUS 2024-2026 Test Scoring - 650+ needed for AIR 50!
    const baseScore = (recentAvg / 720) * 100
    let rigorousScore = baseScore + trendBonus - volatilityPenalty + afternoonAdj
    
    // Apply NEET 2026 reality check
    if (recentAvg >= 680) rigorousScore = Math.min(95, rigorousScore) // 680+ is excellent
    else if (recentAvg >= 650) rigorousScore = Math.min(85, rigorousScore * 0.9) // 650+ is good
    else if (recentAvg >= 600) rigorousScore = Math.min(75, rigorousScore * 0.8) // 600+ is average
    else if (recentAvg >= 550) rigorousScore = Math.min(60, rigorousScore * 0.7) // 550+ is below average
    else if (recentAvg >= 500) rigorousScore = Math.min(45, rigorousScore * 0.6) // 500+ is poor
    else rigorousScore = Math.min(30, rigorousScore * 0.4) // <500 is very poor
    
    return Math.max(10, rigorousScore)
  }

  private static calculateConsistency(dailyGoals: any[]): number {
    if (dailyGoals.length === 0) return 5
    
    const activeDays = dailyGoals.filter(g => g.totalQuestions > 0).length
    const avgQuestions = dailyGoals.reduce((sum, g) => sum + g.totalQuestions, 0) / dailyGoals.length
    const consistencyRate = activeDays / dailyGoals.length
    
    if (consistencyRate >= 0.95 && avgQuestions >= 300) return 95
    if (consistencyRate >= 0.90 && avgQuestions >= 250) return 85
    if (consistencyRate >= 0.85 && avgQuestions >= 200) return 75
    if (consistencyRate >= 0.80 && avgQuestions >= 150) return 60
    if (consistencyRate >= 0.70 && avgQuestions >= 100) return 45
    if (consistencyRate >= 0.60) return 30
    return Math.max(5, consistencyRate * 25)
  }

  private static calculateBiologicalFactor(menstrualData: any[]): number {
    if (menstrualData.length === 0) return 75
    
    const avgEnergy = menstrualData.reduce((sum, m) => sum + m.energyLevel, 0) / menstrualData.length
    const avgStudyCapacity = menstrualData.reduce((sum, m) => sum + m.studyCapacity, 0) / menstrualData.length
    
    const energyScore = (avgEnergy / 10) * 100
    const capacityScore = (avgStudyCapacity / 10) * 100
    
    return Math.min(100, (energyScore * 0.5 + capacityScore * 0.5))
  }

  private static calculateExternalFactor(): number {
    const now = new Date()
    const neetDate = new Date('2026-05-03')
    const daysLeft = Math.ceil((neetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysLeft > 500) return 85
    if (daysLeft > 300) return 75
    if (daysLeft > 100) return 65
    return 50
  }

  private static generateRecommendations(factors: any, predictedAIR: number): string[] {
    const recommendations = []
    
    if (factors.progressScore < 80) {
      recommendations.push('🚨 URGENT: Complete 98%+ syllabus - NEET 2026 demands perfection!')
    }
    
    if (factors.testTrend < 70) {
      recommendations.push('🎯 CRITICAL: Score 650+ in mocks - anything less won\'t cut it in 2026!')
    }
    
    if (factors.consistency < 80) {
      recommendations.push('⚡ MANDATORY: Study 300+ questions daily - competition is BRUTAL!')
    }
    
    if (predictedAIR > 5000) {
      recommendations.push('🔥 REALITY CHECK: You need 85%+ weighted score for top 0.5% in 2026!')
    }
    
    return recommendations.slice(0, 5)
  }

  private static calculateDataQuality(subjects: any[], dailyGoals: any[], testPerformances: any[]): number {
    let qualityScore = 0.1
    
    if (subjects && subjects.length >= 4) qualityScore += 0.2
    
    const activeGoals = dailyGoals?.filter(g => g.totalQuestions > 0) || []
    if (activeGoals.length >= 15) qualityScore += 0.15
    if (activeGoals.length >= 25) qualityScore += 0.1
    
    if (testPerformances && testPerformances.length >= 3) qualityScore += 0.15
    if (testPerformances && testPerformances.length >= 6) qualityScore += 0.1
    
    const completedChapters = subjects?.reduce((sum, s) => sum + (s.chapters?.filter((ch: any) => ch.isCompleted)?.length || 0), 0) || 0
    if (completedChapters >= 50) qualityScore += 0.2
    if (completedChapters >= 100) qualityScore += 0.1
    
    return Math.min(1.0, qualityScore)
  }

  private static assessRiskLevel(predictedAIR: number, confidence: number): 'low' | 'medium' | 'high' {
    if (predictedAIR <= 1000 && confidence > 0.85) return 'low'
    if (predictedAIR <= 5000 && confidence > 0.80) return 'medium'
    if (predictedAIR <= 15000 && confidence > 0.70) return 'medium'
    return 'high'
  }
  
  private static calculateStudyStreak(dailyGoals: any[]): number {
    if (!dailyGoals || dailyGoals.length === 0) return 0
    
    let currentStreak = 0
    const sortedGoals = dailyGoals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    for (const goal of sortedGoals) {
      if (goal.totalQuestions > 0) {
        currentStreak++
      } else {
        break
      }
    }
    
    return currentStreak
  }
  
  private static calculateAfternoonAdjustment(studySessions: any[]): number {
    if (!studySessions || studySessions.length === 0) return 0
    return 0 // Simplified for now
  }
}