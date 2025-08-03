export interface StudySession {
  id: string;
  subject: 'physics' | 'chemistry' | 'botany' | 'zoology';
  topic: string;
  duration: number;
  score?: number;
  date: Date;
  notes?: string;
}

export interface Chapter {
  id: string;
  name: string;
  lectures: number;
  completedLectures: boolean[];
  dppCompleted: boolean[];
  revisionLevel: number;
  normalAssignments: boolean[];
  kattarAssignment: boolean;
  customTrackers: { [key: string]: boolean[] };
}

export interface Subject {
  id: 'physics' | 'chemistry' | 'botany' | 'zoology';
  name: string;
  chapters: Chapter[];
  tests: Test[];
  color: string;
}

export interface Test {
  id: string;
  type: 'weekly' | 'rank_booster' | 'full_length';
  name: string;
  score: number;
  maxScore: number;
  date: Date;
}

export interface SubjectProgress {
  subject: string;
  totalHours: number;
  completedTopics: number;
  totalTopics: number;
  averageScore: number;
  weeklyProgress: number[];
  completionPercentage: number;
  emoji: string;
}

export interface AIFeedback {
  id: string;
  message: string;
  type: 'suggestion' | 'warning' | 'achievement' | 'motivation';
  subject?: string;
  timestamp: Date;
}

export interface DashboardData {
  totalStudyHours: number;
  weeklyGoal: number;
  subjectProgress: SubjectProgress[];
  recentSessions: StudySession[];
  aiFeedback: AIFeedback[];
  examCountdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  dailyQuote: string;
}