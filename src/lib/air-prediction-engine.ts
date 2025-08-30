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
}

export class AIRPredictionEngine {
  static async generatePrediction(userId: string): Promise<AIRPredictionResult> {
    try {
      // Get user data
      const [subjects, dailyGoals, testPerformances, menstrualData] = await Promise.all([
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
        })
      ])

      // Calculate factors
      const progressScore = this.calculateProgressScore(subjects)
      const testTrend = this.calculateTestTrend(testPerformances)
      const consistency = this.calculateConsistency(dailyGoals)
      const biologicalFactor = this.calculateBiologicalFactor(menstrualData)
      const externalFactor = this.calculateExternalFactor()

      // Weighted AIR prediction
      const weightedScore = (
        progressScore * 0.4 +
        testTrend * 0.25 +
        consistency * 0.15 +
        biologicalFactor * 0.1 +
        externalFactor * 0.1
      )

      // Convert to AIR (inverse relationship)
      const predictedAIR = Math.max(1, Math.round(2000 - (weightedScore * 19)))
      const confidence = Math.min(0.95, Math.max(0.3, weightedScore / 100))

      const factors = {
        progressScore,
        testTrend,
        consistency,
        biologicalFactor,
        externalFactor
      }

      const recommendations = this.generateRecommendations(factors, predictedAIR)
      const riskLevel = this.assessRiskLevel(predictedAIR, confidence)

      return {
        predictedAIR,
        confidence,
        factors,
        recommendations,
        riskLevel
      }
    } catch (error) {
      console.error('AIR prediction error:', error)
      return {
        predictedAIR: 1500,
        confidence: 0.5,
        factors: { progressScore: 50, testTrend: 50, consistency: 50, biologicalFactor: 50, externalFactor: 50 },
        recommendations: ['Continue consistent study', 'Focus on weak areas'],
        riskLevel: 'medium'
      }
    }
  }

  private static calculateProgressScore(subjects: any[]): number {
    const totalProgress = subjects.reduce((sum, subject) => sum + subject.completionPercentage, 0)
    const avgProgress = totalProgress / subjects.length
    
    // Rigorous scoring: 97%+ syllabus completion required for top AIR
    if (avgProgress >= 97) return 100
    if (avgProgress >= 95) return 95
    if (avgProgress >= 90) return 85
    if (avgProgress >= 85) return 75
    if (avgProgress >= 80) return 65
    return Math.max(0, avgProgress * 0.6) // Harsh penalty below 80%
  }

  private static calculateTestTrend(tests: any[]): number {
    if (tests.length < 2) return 50
    
    const recent = tests.slice(0, 3).reduce((sum, t) => sum + t.score, 0) / Math.min(3, tests.length)
    const older = tests.slice(3, 6).reduce((sum, t) => sum + t.score, 0) / Math.max(1, tests.slice(3, 6).length)
    
    return Math.min(100, Math.max(0, (recent / 720) * 100 + (recent - older) / 7.2))
  }

  private static calculateConsistency(dailyGoals: any[]): number {
    if (dailyGoals.length === 0) return 0
    
    const activeDays = dailyGoals.filter(g => g.totalQuestions > 0).length
    const avgQuestions = dailyGoals.reduce((sum, g) => sum + g.totalQuestions, 0) / dailyGoals.length
    
    return Math.min(100, (activeDays / dailyGoals.length) * 50 + Math.min(50, avgQuestions / 5))
  }

  private static calculateBiologicalFactor(menstrualData: any[]): number {
    if (menstrualData.length === 0) return 75
    
    const avgEnergy = menstrualData.reduce((sum, m) => sum + m.energyLevel, 0) / menstrualData.length
    const avgStudyCapacity = menstrualData.reduce((sum, m) => sum + m.studyCapacity, 0) / menstrualData.length
    
    // Enhanced biological impact analysis
    const energyScore = (avgEnergy / 10) * 100
    const capacityScore = (avgStudyCapacity / 10) * 100
    const cyclicImpact = this.calculateCyclicImpact(menstrualData)
    
    return Math.min(100, (energyScore * 0.4 + capacityScore * 0.4 + cyclicImpact * 0.2))
  }
  
  private static calculateCyclicImpact(menstrualData: any[]): number {
    // Analyze how menstrual phases affect study performance
    let impactScore = 100
    
    menstrualData.forEach(cycle => {
      const daysSinceStart = Math.floor((new Date().getTime() - new Date(cycle.cycleStartDate).getTime()) / (1000 * 60 * 60 * 24))
      const cycleDay = daysSinceStart % cycle.cycleLength
      
      // Phase-based impact calculation
      if (cycleDay <= cycle.periodLength) {
        // Menstrual phase - reduced capacity
        impactScore -= (cycle.periodLength - cycleDay + 1) * 2
      } else if (cycleDay <= 14) {
        // Follicular phase - optimal learning
        impactScore += 5
      } else if (cycleDay <= 16) {
        // Ovulation - peak performance
        impactScore += 10
      } else {
        // Luteal phase - declining energy
        impactScore -= (cycleDay - 16) * 1.5
      }
    })
    
    return Math.max(0, Math.min(100, impactScore))
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
    
    if (factors.progressScore < 60) {
      recommendations.push('Focus on completing more chapters - aim for 80%+ completion')
    }
    
    if (factors.testTrend < 50) {
      recommendations.push('Improve test performance - practice more mock tests')
    }
    
    if (factors.consistency < 70) {
      recommendations.push('Maintain daily study routine - consistency is key for AIR under 50')
    }
    
    if (factors.biologicalFactor < 60) {
      recommendations.push('Optimize study schedule based on energy levels')
    }
    
    if (predictedAIR > 50) {
      recommendations.push('Increase daily question count to 400+ for AIR under 50')
      recommendations.push('Focus on high-weightage topics in Physics and Chemistry')
    }
    
    return recommendations.slice(0, 4)
  }

  private static assessRiskLevel(predictedAIR: number, confidence: number): 'low' | 'medium' | 'high' {
    if (predictedAIR <= 50 && confidence > 0.8) return 'low'
    if (predictedAIR <= 100 && confidence > 0.6) return 'medium'
    return 'high'
  }
}