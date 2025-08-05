import { NextResponse } from 'next/server';
import { getPredictorData, initDatabase, getStreakData as getStreakFromDB } from '@/lib/database';
import { getDailyLogs, getErrorLogs, getMockTests, getCalendarEntries } from '@/lib/database-extended';

// Fallback streak function
const getStreakData = async (userId: number) => {
  try {
    return await getStreakFromDB(userId);
  } catch (error) {
    return { current_streak: 0, longest_streak: 0, last_streak_date: null, total_fire_days: 0 };
  }
};

export async function GET() {
  try {
    await initDatabase();
    const [data, dailyLogs, streakData, errorLogs, mockTests, calendarEntries] = await Promise.all([
      getPredictorData(),
      getDailyLogs(1, 365), // Get full year data
      getStreakData(1),
      getErrorLogs(1),
      getMockTests(1),
      getCalendarEntries(1, '2025-01-01', '2026-12-31')
    ]);
    
    // Calculate comprehensive metrics
    // Get total questions from daily logs + chapter progress + tests
    const dailyQuestionsTotal = dailyLogs.reduce((sum: number, log: any) => {
      return sum + (log.total_questions || 0);
    }, 0);
    
    const chapterQuestionsTotal = data.progress.reduce((sum: number, p: any) => {
      return sum + (p.questions_solved || 0);
    }, 0);
    
    const testQuestionsTotal = data.tests.reduce((sum: number, t: any) => {
      return sum + 180; // Each test has 180 questions
    }, 0) + data.subjectTests.reduce((sum: number, t: any) => {
      return sum + (t.questions_attempted || 0);
    }, 0);
    
    const totalQuestionsAttempted = dailyQuestionsTotal + chapterQuestionsTotal + testQuestionsTotal;
    
    // Study consistency analysis
    const last30Days = dailyLogs.slice(0, 30);
    const studyDays = last30Days.filter((log: any) => log.total_questions > 0).length;
    const consistencyScore = (studyDays / 30) * 100;
    
    // Fire days analysis
    const fireDays = dailyLogs.filter((log: any) => log.total_questions >= 250).length;
    const superFireDays = dailyLogs.filter((log: any) => log.total_questions >= 550).length;
    
    // Average daily questions
    const avgDailyQuestions = studyDays > 0 ? totalQuestionsAttempted / studyDays : 0;
    
    // Test performance analysis
    const allTests = [...data.tests, ...data.subjectTests, ...mockTests];
    const averageScore = allTests.length > 0 
      ? allTests.reduce((sum: number, test: any) => {
          return sum + (test.score / (test.max_score || 720)) * 100;
        }, 0) / allTests.length
      : 0;
    
    // Recent performance trend (last 5 tests)
    const recentTests = allTests.slice(-5);
    const recentAverage = recentTests.length > 0
      ? recentTests.reduce((sum: number, test: any) => {
          return sum + (test.score / (test.max_score || 720)) * 100;
        }, 0) / recentTests.length
      : 0;
    
    // Chapter completion analysis
    const completedChapters = data.progress.filter((p: any) => p.completed).length;
    const totalChapters = data.progress.length;
    const progressPercentage = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
    
    // Subject-wise analysis
    const subjectAnalysis = {
      physics: {
        questions: dailyLogs.reduce((sum: number, log: any) => sum + (log.phy_qs || 0), 0),
        chapters: data.progress.filter((p: any) => p.subject === 'physics' && p.completed).length,
        totalChapters: data.progress.filter((p: any) => p.subject === 'physics').length
      },
      chemistry: {
        questions: dailyLogs.reduce((sum: number, log: any) => sum + (log.chem_qs || 0), 0),
        chapters: data.progress.filter((p: any) => p.subject === 'chemistry' && p.completed).length,
        totalChapters: data.progress.filter((p: any) => p.subject === 'chemistry').length
      },
      botany: {
        questions: dailyLogs.reduce((sum: number, log: any) => sum + (log.bot_qs || 0), 0),
        chapters: data.progress.filter((p: any) => p.subject === 'botany' && p.completed).length,
        totalChapters: data.progress.filter((p: any) => p.subject === 'botany').length
      },
      zoology: {
        questions: dailyLogs.reduce((sum: number, log: any) => sum + (log.zoo_qs || 0), 0),
        chapters: data.progress.filter((p: any) => p.subject === 'zoology' && p.completed).length,
        totalChapters: data.progress.filter((p: any) => p.subject === 'zoology').length
      }
    };
    
    // Error analysis
    const totalErrors = errorLogs.length;
    const fixedErrors = errorLogs.filter((error: any) => error.reattempted).length;
    const errorFixRate = totalErrors > 0 ? (fixedErrors / totalErrors) * 100 : 100;
    
    // Days remaining calculation
    const examDate = new Date('2026-05-03');
    const today = new Date();
    const daysRemaining = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // NEET Success Prediction Algorithm
    const predictNEETSuccess = () => {
      // Return 0 if no meaningful data exists
      if (totalQuestionsAttempted === 0 && allTests.length === 0 && completedChapters === 0) {
        return 0;
      }
      
      let successScore = 0;
      
      // 1. Question Volume (25 points)
      const questionScore = Math.min((totalQuestionsAttempted / 250000) * 25, 25);
      successScore += questionScore;
      
      // 2. Consistency (20 points)
      const consistencyPoints = (consistencyScore / 100) * 20;
      successScore += consistencyPoints;
      
      // 3. Test Performance (20 points)
      const testPoints = Math.min((averageScore / 100) * 20, 20);
      successScore += testPoints;
      
      // 4. Chapter Completion (15 points)
      const chapterPoints = (progressPercentage / 100) * 15;
      successScore += chapterPoints;
      
      // 5. Streak Performance (10 points)
      const streakPoints = Math.min((streakData.current_streak / 100) * 10, 10);
      successScore += streakPoints;
      
      // 6. Error Management (10 points)
      const errorPoints = (errorFixRate / 100) * 10;
      successScore += errorPoints;
      
      // Bonus factors
      if (superFireDays > 50) successScore += 5; // Super dedication bonus
      if (recentAverage > averageScore) successScore += 3; // Improvement trend bonus
      if (streakData.current_streak > 30) successScore += 2; // Long streak bonus
      
      return Math.min(successScore, 100);
    };
    
    const successProbability = predictNEETSuccess();
    
    // Real-time AIR prediction based on success probability
    const predictedRank = () => {
      if (successProbability === 0) return { min: 500000, max: 1000000, category: 'Not Qualified' };
      if (successProbability >= 95) return { min: 1, max: 100, category: 'AIR 1-100' };
      if (successProbability >= 90) return { min: 100, max: 500, category: 'AIR 100-500' };
      if (successProbability >= 85) return { min: 500, max: 1000, category: 'AIR 500-1000' };
      if (successProbability >= 80) return { min: 1000, max: 3000, category: 'AIR 1000-3000' };
      if (successProbability >= 75) return { min: 3000, max: 8000, category: 'AIR 3000-8000' };
      if (successProbability >= 70) return { min: 8000, max: 15000, category: 'AIR 8000-15000' };
      if (successProbability >= 60) return { min: 15000, max: 40000, category: 'AIR 15000-40000' };
      if (successProbability >= 50) return { min: 40000, max: 80000, category: 'AIR 40000-80000' };
      if (successProbability >= 40) return { min: 80000, max: 150000, category: 'AIR 80000-150000' };
      if (successProbability >= 30) return { min: 150000, max: 250000, category: 'AIR 150000-250000' };
      if (successProbability >= 20) return { min: 250000, max: 400000, category: 'AIR 250000-400000' };
      if (successProbability >= 10) return { min: 400000, max: 600000, category: 'AIR 400000-600000' };
      return { min: 600000, max: 800000, category: 'AIR 600000+' };
    };
    
    const rankPrediction = predictedRank();
    
    // Real-time AIIMS Delhi probability calculation
    const calculateAIIMSProbability = () => {
      if (successProbability === 0) return 0;
      if (successProbability < 50) return Math.max((successProbability / 50) * 2, 0); // 0-2% for 0-50%
      if (successProbability >= 85) {
        // After 85%, drastic increase: 10-20% randomly for each 1%
        const bonusPercent = successProbability - 85;
        const randomMultiplier = Math.floor(Math.random() * 11) + 10; // Random 10-20
        return Math.min(41 + (bonusPercent * randomMultiplier), 95); // 41% at 85% + drastic bonus
      } else if (successProbability >= 80) {
        // 80-85%, reward with 5% for every 1%
        const bonusPercent = successProbability - 80;
        return Math.min(16 + (bonusPercent * 5), 41); // 16% at 80% to 41% at 85%
      } else {
        // 50-80%, 0.2% for every 1%
        return Math.min(2 + ((successProbability - 50) * 0.47), 16); // 2% at 50% to 16% at 80%
      }
    };
    
    const aiimsDelhiProbability = calculateAIIMSProbability();
    
    // Recommendations based on analysis
    const getRecommendations = () => {
      const recommendations = [];
      
      if (avgDailyQuestions < 400) {
        recommendations.push('Increase daily question count to 400+ for better preparation');
      }
      
      if (consistencyScore < 80) {
        recommendations.push('Maintain more consistent study schedule - aim for 25+ study days per month');
      }
      
      if (averageScore < 70) {
        recommendations.push('Focus on improving test scores through better concept clarity');
      }
      
      if (progressPercentage < 60) {
        recommendations.push('Accelerate chapter completion - complete more topics');
      }
      
      if (errorFixRate < 80) {
        recommendations.push('Improve error analysis and reattempt rate for better learning');
      }
      
      if (streakData.current_streak < 7) {
        recommendations.push('Build a stronger study streak - consistency is key for NEET success');
      }
      
      // Subject-specific recommendations
      Object.entries(subjectAnalysis).forEach(([subject, data]: [string, any]) => {
        const completion = data.totalChapters > 0 ? (data.chapters / data.totalChapters) * 100 : 0;
        if (completion < 50) {
          recommendations.push(`Focus more on ${subject.charAt(0).toUpperCase() + subject.slice(1)} - only ${Math.round(completion)}% chapters completed`);
        }
      });
      
      return recommendations;
    };
    
    // Calendar mood analysis
    const calendarAnalysis = {
      totalEntries: calendarEntries.length,
      goodDays: calendarEntries.filter((entry: any) => entry.status === 'good').length,
      averageDays: calendarEntries.filter((entry: any) => entry.status === 'average').length,
      badDays: calendarEntries.filter((entry: any) => entry.status === 'bad').length,
      moodScore: calendarEntries.length > 0 ? 
        (calendarEntries.filter((entry: any) => entry.status === 'good').length * 3 +
         calendarEntries.filter((entry: any) => entry.status === 'average').length * 2 +
         calendarEntries.filter((entry: any) => entry.status === 'bad').length * 1) / 
        (calendarEntries.length * 3) * 100 : 0
    };
    
    // Chapter progress detailed analysis
    const chapterAnalysis = {
      totalChapters: data.progress.length,
      completedLectures: data.progress.filter((p: any) => p.completed).length,
      completedDPPs: data.progress.filter((p: any) => p.dpp_completed).length,
      normalAssignment1: data.progress.filter((p: any) => p.normal_assignment_1).length,
      normalAssignment2: data.progress.filter((p: any) => p.normal_assignment_2).length,
      kattarAssignments: data.progress.filter((p: any) => p.kattar_assignment).length,
      totalQuestionsSolved: data.progress.reduce((sum: number, p: any) => sum + (p.questions_solved || 0), 0),
      revisionLevels: data.progress.reduce((sum: number, p: any) => sum + (p.revision_level || 1), 0) / data.progress.length
    };
    
    // Weekly progress trends (last 12 weeks)
    const weeklyTrends = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6));
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      
      const weekLogs = dailyLogs.filter((log: any) => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      });
      
      const weekQuestions = weekLogs.reduce((sum: number, log: any) => sum + (log.total_questions || 0), 0);
      const weekFireDays = weekLogs.filter((log: any) => log.total_questions >= 250).length;
      const weekConsistency = weekLogs.filter((log: any) => log.total_questions > 0).length;
      
      weeklyTrends.push({
        week: `Week ${12 - i}`,
        questions: weekQuestions,
        fireDays: weekFireDays,
        consistency: weekConsistency,
        avgDaily: weekConsistency > 0 ? Math.round(weekQuestions / weekConsistency) : 0
      });
    }
    
    // Monthly performance analysis
    const monthlyAnalysis = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i, 1);
      const monthEnd = new Date();
      monthEnd.setMonth(monthEnd.getMonth() - i + 1, 0);
      
      const monthLogs = dailyLogs.filter((log: any) => {
        const logDate = new Date(log.date);
        return logDate >= monthStart && logDate <= monthEnd;
      });
      
      const monthTests = allTests.filter((test: any) => {
        const testDate = new Date(test.date);
        return testDate >= monthStart && testDate <= monthEnd;
      });
      
      monthlyAnalysis.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        questions: monthLogs.reduce((sum: number, log: any) => sum + (log.total_questions || 0), 0),
        tests: monthTests.length,
        avgScore: monthTests.length > 0 ? 
          monthTests.reduce((sum: number, test: any) => sum + (test.score / (test.max_score || 720)) * 100, 0) / monthTests.length : 0,
        studyDays: monthLogs.filter((log: any) => log.total_questions > 0).length,
        fireDays: monthLogs.filter((log: any) => log.total_questions >= 250).length
      });
    }
    
    // Subject-wise performance trends
    const subjectTrends = Object.keys(subjectAnalysis).map(subject => {
      const subjectTests = allTests.filter((test: any) => test.subject === subject);
      const recentSubjectTests = subjectTests.slice(-5);
      
      return {
        subject,
        ...subjectAnalysis[subject as keyof typeof subjectAnalysis],
        testTrend: recentSubjectTests.length > 0 ? 
          recentSubjectTests.map((test: any, index: number) => ({
            test: index + 1,
            score: (test.score / (test.max_score || 180)) * 100
          })) : [],
        weeklyQuestions: weeklyTrends.map(week => {
          const weekLogs = dailyLogs.filter((log: any) => {
            // Get logs for this week and subject
            return log[`${subject.substring(0, 3)}_qs`] || 0;
          });
          return weekLogs.reduce((sum: number, log: any) => sum + (log[`${subject.substring(0, 3)}_qs`] || 0), 0);
        })
      };
    });
    
    return NextResponse.json({
      // Basic metrics
      totalQuestionsAttempted,
      averageScore: Math.round(averageScore),
      progressPercentage: Math.round(progressPercentage),
      daysRemaining,
      
      // Advanced analytics
      consistencyScore: Math.round(consistencyScore),
      fireDays,
      superFireDays,
      avgDailyQuestions: Math.round(avgDailyQuestions),
      currentStreak: streakData.current_streak,
      longestStreak: streakData.longest_streak,
      
      // Test performance
      totalTests: allTests.length,
      recentPerformance: Math.round(recentAverage),
      performanceTrend: recentAverage > averageScore ? 'improving' : recentAverage < averageScore ? 'declining' : 'stable',
      
      // Error management
      totalErrors,
      fixedErrors,
      errorFixRate: Math.round(errorFixRate),
      
      // Subject analysis
      subjectAnalysis,
      subjectTrends,
      
      // Calendar analysis
      calendarAnalysis,
      
      // Chapter progress
      chapterAnalysis,
      
      // Trends and patterns
      weeklyTrends,
      monthlyAnalysis,
      
      // Predictions
      successProbability: Math.round(successProbability),
      rankPrediction,
      aiimsDelhiProbability: Math.round(aiimsDelhiProbability),
      
      // Recommendations
      recommendations: getRecommendations(),
      
      // Status indicators
      status: successProbability >= 80 ? 'excellent' : 
              successProbability >= 60 ? 'good' : 
              successProbability >= 40 ? 'average' : 'needs_improvement',
      
      questionEmoji: totalQuestionsAttempted >= 150000 ? '😘' : 
                    totalQuestionsAttempted >= 120000 ? '😊' : '😞'
    });
  } catch (error) {
    console.error('Predictor API error:', error);
    return NextResponse.json({ error: 'Failed to fetch predictor data' }, { status: 500 });
  }
}