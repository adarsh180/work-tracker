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

      // Parse JSON response
      const insights = this.parseJSONResponse<StudyInsights>(response);
      return insights;
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

      const schedule = this.parseJSONResponse<OptimalSchedule>(response);
      return schedule;
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

      const weakAreaFocus = this.parseJSONResponse<WeakAreaFocus>(response);
      return weakAreaFocus;
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
      // Clean the response - remove any markdown formatting
      const cleanResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleanResponse);
    } catch (error) {
      throw new GroqError(
        `Failed to parse AI response as JSON: ${error}. Response: ${response.substring(0, 200)}...`
      );
    }
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