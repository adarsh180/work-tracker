import { groqClient, GroqError, RateLimitError } from './groq-client';
import { AIPrompts, StudyPatternData } from './ai-prompts';

// Types for AI insights responses
export interface StudyInsights {
  overallAssessment: string;
  subjectAnalysis: {
    strengths: string[];
    weaknesses: string[];
    details: string;
  };
  studyPatterns: {
    consistency: 'high' | 'medium' | 'low';
    questionVolume: 'above_target' | 'on_target' | 'below_target';
    revisionQuality: 'excellent' | 'good' | 'needs_improvement';
    insights: string;
  };
  performanceTrends: {
    testTrend: 'improving' | 'stable' | 'declining';
    moodTrend: 'improving' | 'declining' | 'stable';
    correlation: string;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    timeframe: string;
    expectedImpact: string;
  }>;
  motivationalMessage: string;
}

export interface OptimalSchedule {
  dailySchedule: Array<{
    timeSlot: string;
    activity: string;
    subject: string;
    focus: 'theory' | 'practice' | 'revision' | 'test';
    duration: number;
  }>;
  weeklyFocus: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  priorityAdjustments: Array<{
    subject: string;
    reason: string;
    adjustment: string;
  }>;
  tips: string[];
}

export interface WeakAreaFocus {
  urgentActions: Array<{
    subject: string;
    chapter: string;
    issue: 'low_completion' | 'poor_revision' | 'insufficient_practice';
    action: string;
    timeRequired: string;
    priority: number;
  }>;
  weeklyTargets: {
    lectureCompletion: number;
    questionsToSolve: number;
    chaptersToRevise: number;
  };
  recoveryStrategy: string;
  riskAssessment: 'low' | 'medium' | 'high';
}

// AI Insights Service
export class AIInsightsService {
  private static instance: AIInsightsService;

  private constructor() {}

  static getInstance(): AIInsightsService {
    if (!AIInsightsService.instance) {
      AIInsightsService.instance = new AIInsightsService();
    }
    return AIInsightsService.instance;
  }

  async generateStudyInsights(data: StudyPatternData): Promise<StudyInsights> {
    try {
      const prompt = AIPrompts.generateStudyInsights(data);
      const response = await groqClient.generateCompletion(prompt, {
        model: 'llama3-8b-8192',
        maxTokens: 1500,
        temperature: 0.7,
      });

      // Parse JSON response with fallback
      try {
        const insights = this.parseJSONResponse<StudyInsights>(response);
        return insights;
      } catch (parseError) {
        // Fallback: Return default insights if parsing fails
        console.warn('AI JSON parsing failed, using fallback:', parseError);
        return this.getFallbackInsights(data);
      }
    } catch (error) {
      if (error instanceof RateLimitError || error instanceof GroqError) {
        throw error;
      }
      throw new GroqError(`Failed to generate study insights: ${error}`);
    }
  }

  async generateOptimalSchedule(data: StudyPatternData): Promise<OptimalSchedule> {
    try {
      const prompt = AIPrompts.generateOptimalSchedule(data);
      const response = await groqClient.generateCompletion(prompt, {
        model: 'llama3-8b-8192',
        maxTokens: 2000,
        temperature: 0.6,
      });

      try {
        const schedule = this.parseJSONResponse<OptimalSchedule>(response);
        return schedule;
      } catch (parseError) {
        console.warn('AI JSON parsing failed, using fallback schedule:', parseError);
        return this.getFallbackSchedule(data);
      }
    } catch (error) {
      if (error instanceof RateLimitError || error instanceof GroqError) {
        throw error;
      }
      throw new GroqError(`Failed to generate optimal schedule: ${error}`);
    }
  }

  async generateMotivationalBoost(data: StudyPatternData): Promise<string> {
    try {
      const prompt = AIPrompts.generateMotivationalBoost(data);
      const response = await groqClient.generateCompletion(prompt, {
        model: 'llama3-8b-8192',
        maxTokens: 200,
        temperature: 0.8,
      });

      return response.trim();
    } catch (error) {
      if (error instanceof RateLimitError || error instanceof GroqError) {
        throw error;
      }
      throw new GroqError(`Failed to generate motivational boost: ${error}`);
    }
  }

  async generateWeakAreaFocus(data: StudyPatternData): Promise<WeakAreaFocus> {
    try {
      const prompt = AIPrompts.generateWeakAreaFocus(data);
      const response = await groqClient.generateCompletion(prompt, {
        model: 'llama3-8b-8192',
        maxTokens: 1200,
        temperature: 0.5,
      });

      try {
        const weakAreaFocus = this.parseJSONResponse<WeakAreaFocus>(response);
        return weakAreaFocus;
      } catch (parseError) {
        console.warn('AI JSON parsing failed, using fallback weak area focus:', parseError);
        return this.getFallbackWeakAreaFocus(data);
      }
    } catch (error) {
      if (error instanceof RateLimitError || error instanceof GroqError) {
        throw error;
      }
      throw new GroqError(`Failed to generate weak area focus: ${error}`);
    }
  }

  // Health check for the AI service
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    message: string;
    timestamp: string;
  }> {
    try {
      const isHealthy = await groqClient.healthCheck();
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'AI service is operational' : 'AI service is not responding',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: `AI service error: ${error}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Helper method to parse JSON responses with error handling
  private parseJSONResponse<T>(response: string): T {
    try {
      // Clean the response - remove any markdown formatting and extract JSON
      let cleanResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      // If response starts with text before JSON, extract JSON part
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        cleanResponse = cleanResponse.substring(jsonStart, jsonEnd + 1);
      }
      
      // Try to fix common JSON issues
      cleanResponse = cleanResponse
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']')
        .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*):/g, '$1"$2":')
        .trim();

      return JSON.parse(cleanResponse);
    } catch (error) {
      throw new GroqError(
        `Failed to parse AI response as JSON: ${error}. Response: ${response.substring(0, 200)}...`
      );
    }
  }

  // Fallback methods for when AI parsing fails
  private getFallbackInsights(data: StudyPatternData): StudyInsights {
    const avgCompletion = data.subjects.reduce((sum, s) => sum + s.completionPercentage, 0) / data.subjects.length;
    const weakSubjects = data.subjects.filter(s => s.completionPercentage < 75).map(s => s.name);
    const strongSubjects = data.subjects.filter(s => s.completionPercentage >= 75).map(s => s.name);
    
    return {
      overallAssessment: `Your current preparation stands at ${Math.round(avgCompletion)}% completion with ${data.timeToExam.days} days remaining. Focus on consistent daily practice to reach your target.`,
      subjectAnalysis: {
        strengths: strongSubjects.slice(0, 2),
        weaknesses: weakSubjects.slice(0, 2),
        details: `Strong performance in ${strongSubjects.join(', ')}. Need attention in ${weakSubjects.join(', ')}.`
      },
      studyPatterns: {
        consistency: data.questionAnalytics.dailyAverage > 200 ? 'high' : data.questionAnalytics.dailyAverage > 100 ? 'medium' : 'low',
        questionVolume: data.questionAnalytics.dailyAverage >= 250 ? 'on_target' : 'below_target',
        revisionQuality: avgCompletion > 80 ? 'excellent' : avgCompletion > 60 ? 'good' : 'needs_improvement',
        insights: 'Maintain consistent daily practice and focus on weak areas for optimal results.'
      },
      performanceTrends: {
        testTrend: 'stable',
        moodTrend: data.moodData.moodTrend,
        correlation: 'Mood and performance show positive correlation. Maintain good mental health.'
      },
      recommendations: [
        {
          priority: 'high',
          action: 'Complete pending lectures in weak subjects',
          timeframe: '2 weeks',
          expectedImpact: 'Improve foundation and confidence'
        },
        {
          priority: 'medium',
          action: 'Increase daily question practice to 300+',
          timeframe: '1 week',
          expectedImpact: 'Better speed and accuracy'
        }
      ],
      motivationalMessage: `You're making great progress, Misti! With ${data.timeToExam.days} days left, stay focused and believe in yourself. Every question you solve brings you closer to your dream of becoming Dr. Misti! 💕`
    };
  }
  
  private getFallbackSchedule(data: StudyPatternData): OptimalSchedule {
    return {
      dailySchedule: [
        { timeSlot: '06:00 - 08:00', activity: 'Physics Theory', subject: 'Physics', focus: 'theory', duration: 120 },
        { timeSlot: '08:30 - 10:30', activity: 'Chemistry Practice', subject: 'Chemistry', focus: 'practice', duration: 120 },
        { timeSlot: '11:00 - 13:00', activity: 'Biology Theory', subject: 'Biology', focus: 'theory', duration: 120 },
        { timeSlot: '14:00 - 16:00', activity: 'Physics Practice', subject: 'Physics', focus: 'practice', duration: 120 },
        { timeSlot: '16:30 - 18:30', activity: 'Chemistry Theory', subject: 'Chemistry', focus: 'theory', duration: 120 },
        { timeSlot: '19:00 - 21:00', activity: 'Biology Practice', subject: 'Biology', focus: 'practice', duration: 120 },
        { timeSlot: '21:30 - 22:30', activity: 'Revision', subject: 'Mixed', focus: 'revision', duration: 60 }
      ],
      weeklyFocus: {
        monday: 'Physics',
        tuesday: 'Chemistry',
        wednesday: 'Biology',
        thursday: 'Physics',
        friday: 'Chemistry',
        saturday: 'Biology',
        sunday: 'Revision & Tests'
      },
      priorityAdjustments: [
        {
          subject: 'Weak Areas',
          reason: 'Below 75% completion',
          adjustment: 'Allocate extra 1 hour daily'
        }
      ],
      tips: [
        'Take 15-minute breaks every 2 hours',
        'Review previous day topics before starting new ones',
        'Practice mock tests weekly',
        'Maintain consistent sleep schedule'
      ]
    };
  }
  
  private getFallbackWeakAreaFocus(data: StudyPatternData): WeakAreaFocus {
    const weakSubjects = data.subjects.filter(s => s.completionPercentage < 75);
    const avgCompletion = data.subjects.reduce((sum, s) => sum + s.completionPercentage, 0) / data.subjects.length;
    
    return {
      urgentActions: weakSubjects.slice(0, 3).map((subject, index) => ({
        subject: subject.name,
        chapter: subject.chapters.find(c => c.lectureProgress < 50)?.name || 'All chapters',
        issue: 'low_completion' as const,
        action: `Complete pending lectures and increase practice questions`,
        timeRequired: '2-3 hours daily',
        priority: index + 1
      })),
      weeklyTargets: {
        lectureCompletion: Math.max(10, Math.round(20 - avgCompletion / 5)),
        questionsToSolve: 1800,
        chaptersToRevise: 5
      },
      recoveryStrategy: `Focus on completing lectures in ${weakSubjects.map(s => s.name).join(', ')} while maintaining practice in stronger subjects. Allocate 60% time to weak areas and 40% to revision.`,
      riskAssessment: avgCompletion < 50 ? 'high' : avgCompletion < 70 ? 'medium' : 'low'
    };
  }

  // Utility method to prepare study data from database entities
  static prepareStudyData(
    subjects: any[],
    testPerformances: any[],
    questionAnalytics: any,
    moodData: any
  ): StudyPatternData {
    const now = new Date();
    const examDate = new Date('2026-05-03T14:00:00+05:30'); // May 3rd, 2026, 2:00 PM IST
    const timeDiff = examDate.getTime() - now.getTime();
    const daysToExam = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return {
      subjects: subjects.map(subject => ({
        name: subject.name,
        completionPercentage: subject.completionPercentage || 0,
        totalQuestions: subject.totalQuestions || 0,
        chapters: subject.chapters?.map((chapter: any) => ({
          name: chapter.name,
          lectureProgress: chapter.lecturesCompleted 
            ? (chapter.lecturesCompleted.filter(Boolean).length / chapter.lectureCount) * 100 
            : 0,
          dppProgress: chapter.dppCompleted 
            ? (chapter.dppCompleted.filter(Boolean).length / chapter.lectureCount) * 100 
            : 0,
          revisionScore: chapter.revisionScore || 1,
          questionsCompleted: 
            (chapter.assignmentCompleted?.filter(Boolean).length || 0) +
            (chapter.kattarCompleted?.filter(Boolean).length || 0),
        })) || [],
      })),
      testPerformances: testPerformances.map(test => ({
        testType: test.testType,
        score: test.score,
        maxScore: 720,
        date: test.testDate.toISOString().split('T')[0],
      })),
      questionAnalytics: {
        dailyAverage: questionAnalytics?.dailyCount || 0,
        weeklyTotal: questionAnalytics?.weeklyCount || 0,
        monthlyTotal: questionAnalytics?.monthlyCount || 0,
        lifetimeTotal: questionAnalytics?.lifetimeCount || 0,
      },
      moodData: {
        averageMood: moodData?.averageMood || 2,
        moodTrend: moodData?.trend || 'stable',
        recentMoods: moodData?.recentMoods || [],
      },
      timeToExam: {
        days: Math.max(0, daysToExam),
        weeks: Math.max(0, Math.ceil(daysToExam / 7)),
        months: Math.max(0, Math.ceil(daysToExam / 30)),
      },
    };
  }
}

// Export singleton instance
export const aiInsightsService = AIInsightsService.getInstance();