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

      // RIGOROUS 2024-2026 NEET Weighted Prediction
      const weightedScore = (
        progressScore * 0.40 +     // Syllabus completion (increased weight)
        testTrend * 0.35 +         // Test performance (increased weight)
        consistency * 0.20 +       // Daily study consistency
        biologicalFactor * 0.03 +  // Menstrual cycle (reduced impact)
        externalFactor * 0.02      // Time remaining (reduced impact)
      )

      // RIGOROUS 2024-2026 NEET AIR Calculation - MUCH HARDER!
      const normalizedScore = Math.max(10, Math.min(95, weightedScore))
      
      // AIR calculation reflecting NEET 2026 brutal competition
      let predictedAIR: number
      if (normalizedScore >= 92) {
        predictedAIR = Math.round(1 + (95 - normalizedScore) * 16) // AIR 1-50 (need 92%+ score!)
      } else if (normalizedScore >= 85) {
        predictedAIR = Math.round(50 + (92 - normalizedScore) * 25) // AIR 50-225
      } else if (normalizedScore >= 75) {
        predictedAIR = Math.round(225 + (85 - normalizedScore) * 40) // AIR 225-625
      } else if (normalizedScore >= 65) {
        predictedAIR = Math.round(625 + (75 - normalizedScore) * 60) // AIR 625-1225
      } else if (normalizedScore >= 50) {
        predictedAIR = Math.round(1225 + (65 - normalizedScore) * 80) // AIR 1225-2425
      } else {
        predictedAIR = Math.round(2425 + (50 - normalizedScore) * 100) // AIR 2425+
      }
      
      predictedAIR = Math.max(1, Math.min(5000, predictedAIR)) // Extended range for reality
      
      // Confidence based on data quality and consistency
      const dataQuality = this.calculateDataQuality(subjects, dailyGoals, testPerformances)
      const confidence = Math.min(0.95, Math.max(0.4, (normalizedScore / 100) * dataQuality))

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
    if (!subjects || subjects.length === 0) return 0
    
    let totalWeightedProgress = 0
    let totalWeight = 0
    
    subjects.forEach(subject => {
      // Weight subjects based on NEET importance
      const weight = this.getSubjectWeight(subject.name)
      const progress = subject.completionPercentage || 0
      
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
      'Physics': 1.2,    // Higher weightage in NEET
      'Chemistry': 1.2,  // Higher weightage in NEET
      'Botany': 1.0,
      'Zoology': 1.0
    }
    return weights[subjectName as keyof typeof weights] || 1.0
  }

  private static calculateTestTrend(tests: any[]): number {
    if (!tests || tests.length === 0) return 25 // Harsh default for no test practice
    if (tests.length === 1) return Math.min(70, Math.max(15, (tests[0].score / 720) * 100))
    
    // Calculate recent performance (last 3 tests)
    const recentTests = tests.slice(0, Math.min(3, tests.length))
    const recentAvg = recentTests.reduce((sum, t) => sum + (t.score || 0), 0) / recentTests.length
    
    // Calculate trend if we have enough data
    let trendBonus = 0
    if (tests.length >= 3) {
      const olderTests = tests.slice(3, Math.min(6, tests.length))
      if (olderTests.length > 0) {
        const olderAvg = olderTests.reduce((sum, t) => sum + (t.score || 0), 0) / olderTests.length
        trendBonus = Math.max(-20, Math.min(10, (recentAvg - olderAvg) / 25)) // Stricter trend impact
      }
    }
    
    // RIGOROUS 2024-2026 Test Scoring - 650+ needed for AIR 50!
    const baseScore = (recentAvg / 720) * 100
    let rigorousScore = baseScore + trendBonus
    
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
    if (dailyGoals.length === 0) return 0
    
    const activeDays = dailyGoals.filter(g => g.totalQuestions > 0).length
    const avgQuestions = dailyGoals.reduce((sum, g) => sum + g.totalQuestions, 0) / dailyGoals.length
    const consistencyRate = activeDays / dailyGoals.length
    
    // RIGOROUS 2024-2026 Consistency Requirements
    let consistencyScore = 0
    
    // Daily study is MANDATORY for NEET 2026
    if (consistencyRate >= 0.95 && avgQuestions >= 300) consistencyScore = 95 // 95%+ days, 300+ questions
    else if (consistencyRate >= 0.90 && avgQuestions >= 250) consistencyScore = 85 // 90%+ days, 250+ questions
    else if (consistencyRate >= 0.85 && avgQuestions >= 200) consistencyScore = 75 // 85%+ days, 200+ questions
    else if (consistencyRate >= 0.80 && avgQuestions >= 150) consistencyScore = 60 // 80%+ days, 150+ questions
    else if (consistencyRate >= 0.70 && avgQuestions >= 100) consistencyScore = 45 // 70%+ days, 100+ questions
    else if (consistencyRate >= 0.60) consistencyScore = 30 // 60%+ days
    else consistencyScore = Math.max(5, consistencyRate * 25) // <60% is very poor
    
    return consistencyScore
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
    
    // RIGOROUS 2024-2026 NEET Recommendations
    if (factors.progressScore < 80) {
      recommendations.push('🚨 URGENT: Complete 98%+ syllabus - NEET 2026 demands perfection!')
    }
    
    if (factors.testTrend < 70) {
      recommendations.push('🎯 CRITICAL: Score 650+ in mocks - anything less won\'t cut it in 2026!')
    }
    
    if (factors.consistency < 80) {
      recommendations.push('⚡ MANDATORY: Study 300+ questions daily - competition is BRUTAL!')
    }
    
    if (predictedAIR > 50) {
      recommendations.push('🔥 REALITY CHECK: You need 92%+ weighted score for AIR 50 in 2026!')
      recommendations.push('💪 STEP UP: Current preparation insufficient for medical college admission')
      recommendations.push('📈 INTENSIFY: Double your effort - NEET 2026 is the toughest yet!')
    }
    
    if (predictedAIR > 200) {
      recommendations.push('⚠️ WARNING: At this pace, medical college admission is at serious risk!')
    }
    
    return recommendations.slice(0, 5)
  }

  private static calculateDataQuality(subjects: any[], dailyGoals: any[], testPerformances: any[]): number {
    let qualityScore = 0.5 // Base score
    
    // Subject data quality
    if (subjects && subjects.length >= 4) qualityScore += 0.2
    
    // Daily goals data quality
    if (dailyGoals && dailyGoals.length >= 15) qualityScore += 0.15
    if (dailyGoals && dailyGoals.length >= 25) qualityScore += 0.1
    
    // Test performance data quality
    if (testPerformances && testPerformances.length >= 3) qualityScore += 0.15
    if (testPerformances && testPerformances.length >= 6) qualityScore += 0.1
    
    return Math.min(1.0, qualityScore)
  }

  private static assessRiskLevel(predictedAIR: number, confidence: number): 'low' | 'medium' | 'high' {
    // RIGOROUS 2024-2026 Risk Assessment - Much stricter!
    if (predictedAIR <= 25 && confidence > 0.85) return 'low'    // Only top 25 AIR is truly safe
    if (predictedAIR <= 50 && confidence > 0.80) return 'medium' // AIR 50 is now medium risk
    if (predictedAIR <= 100 && confidence > 0.70) return 'medium' // AIR 100 is risky
    return 'high' // Everything else is high risk in NEET 2026
  }
}