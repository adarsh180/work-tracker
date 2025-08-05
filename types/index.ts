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
  dailyLogs?: any[];
}

export interface DailyLog {
  id?: number;
  user_id: number;
  date: string;
  bot_qs: number;
  zoo_qs: number;
  phy_qs: number;
  chem_qs: number;
  bot_class: boolean;
  zoo_class: boolean;
  phy_class: boolean;
  chem_class: boolean;
  bot_dpp: boolean;
  zoo_dpp: boolean;
  phy_dpp: boolean;
  chem_dpp: boolean;
  bot_assignment: boolean;
  zoo_assignment: boolean;
  phy_assignment: boolean;
  chem_assignment: boolean;
  revision_done: boolean;
  errors_fixed: number;
  total_questions: number;
  created_at?: Date;
}

export interface CalendarEntry {
  id?: number;
  user_id: number;
  date: string;
  status: 'good' | 'average' | 'bad';
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ErrorLog {
  id?: number;
  user_id: number;
  subject: string;
  chapter: string;
  mistake: string;
  fix?: string;
  reattempted: boolean;
  fixed_date?: string;
  created_at?: Date;
}

export interface MockTest {
  id?: number;
  user_id: number;
  date: string;
  score: number;
  max_score: number;
  subject_scores: {
    physics?: number;
    chemistry?: number;
    botany?: number;
    zoology?: number;
  };
  top_mistakes: string[];
  created_at?: Date;
}

export interface User {
  id: number;
  name: string;
  target_college: string;
  created_at: Date;
}