import { NextResponse } from 'next/server';
import { getPredictorData, initDatabase } from '@/lib/database';
import { generateAIFeedback } from '@/lib/groq';

export async function GET() {
  try {
    await initDatabase();
    const data = await getPredictorData();
    
    // Calculate comprehensive metrics
    const totalTests = data.tests.length;
    const totalQuestions = totalTests * 180; // Each main test has 180 questions
    const practiceQuestions = data.progress.reduce((sum: number, p: any) => sum + (p.questions_solved || 0), 0);
    const subjectTestQuestions = data.subjectTests.reduce((sum: number, t: any) => sum + (t.questions_attempted || 0), 0);
    
    // Calculate DPP questions (10-15 questions per completed DPP)
    const dppQuestions = data.progress.reduce((sum: number, p: any) => {
      if (p.dpp_completed) {
        return sum + Math.floor(Math.random() * 6) + 10; // Random 10-15 questions per DPP
      }
      return sum;
    }, 0);
    
    // Calculate Assignment questions
    const assignmentQuestions = data.progress.reduce((sum: number, p: any) => {
      let total = 0;
      if (p.normal_assignment_1) total += Math.floor(Math.random() * 101) + 100; // 100-200 questions
      if (p.normal_assignment_2) total += Math.floor(Math.random() * 101) + 100; // 100-200 questions
      if (p.kattar_assignment) total += Math.floor(Math.random() * 201) + 100; // 100-300 questions
      return sum + total;
    }, 0);
    
    const totalQuestionsAttempted = totalQuestions + practiceQuestions + subjectTestQuestions + dppQuestions + assignmentQuestions;
    
    const completedLectures = data.progress.filter((p: any) => p.completed).length;
    const completedDPPs = data.progress.filter((p: any) => p.dpp_completed).length;
    const completedAssignments = data.progress.filter((p: any) => 
      p.normal_assignment_1 || p.normal_assignment_2 || p.kattar_assignment
    ).length;
    
    const averageTestScore = totalTests > 0 
      ? data.tests.reduce((sum: number, t: any) => sum + (t.score / t.max_score) * 100, 0) / totalTests 
      : 0;
    
    const averageSubjectTestScore = data.subjectTests.length > 0
      ? data.subjectTests.reduce((sum: number, t: any) => sum + (t.score / t.max_score) * 100, 0) / data.subjectTests.length
      : 0;
    
    // Question progress emoji
    const getQuestionEmoji = (questions: number) => {
      if (questions >= 200000) return '😘';
      if (questions >= 160000) return '😊';
      return '😞';
    };
    
    // Subject-wise comprehensive breakdown
    const subjects = ['physics', 'chemistry', 'botany', 'zoology'].map(subject => {
      const subjectProgress = data.progress.filter((p: any) => p.subject === subject);
      const subjectSpecificTests = data.subjectTests.filter((t: any) => t.subject === subject);
      
      const practiceQuestions = subjectProgress.reduce((sum: number, p: any) => sum + (p.questions_solved || 0), 0);
      const subjectTestQuestions = subjectSpecificTests.reduce((sum: number, t: any) => sum + (t.questions_attempted || 0), 0);
      const dppQuestions = subjectProgress.reduce((sum: number, p: any) => {
        if (p.dpp_completed) {
          return sum + Math.floor(Math.random() * 6) + 10; // Random 10-15 questions per DPP
        }
        return sum;
      }, 0);
      
      const assignmentQuestions = subjectProgress.reduce((sum: number, p: any) => {
        let total = 0;
        if (p.normal_assignment_1) total += Math.floor(Math.random() * 101) + 100; // 100-200 questions
        if (p.normal_assignment_2) total += Math.floor(Math.random() * 101) + 100; // 100-200 questions
        if (p.kattar_assignment) total += Math.floor(Math.random() * 201) + 100; // 100-300 questions
        return sum + total;
      }, 0);
      
      return {
        name: subject,
        lectures: subjectProgress.filter((p: any) => p.completed).length,
        dpps: subjectProgress.filter((p: any) => p.dpp_completed).length,
        assignments: subjectProgress.filter((p: any) => 
          p.normal_assignment_1 || p.normal_assignment_2 || p.kattar_assignment
        ).length,
        practiceQuestions,
        subjectTestQuestions,
        dppQuestions,
        totalQuestions: practiceQuestions + subjectTestQuestions + dppQuestions + assignmentQuestions,
        assignmentQuestions,
        subjectTests: subjectSpecificTests.length,
        avgSubjectScore: subjectSpecificTests.length > 0 
          ? subjectSpecificTests.reduce((sum: number, t: any) => sum + (t.score / t.max_score) * 100, 0) / subjectSpecificTests.length 
          : 0
      };
    });
    
    const predictorData = {
      totalTests,
      totalSubjectTests: data.subjectTests.length,
      totalQuestionsAttempted,
      practiceQuestions,
      subjectTestQuestions,
      dppQuestions,
      assignmentQuestions,
      completedLectures,
      completedDPPs,
      completedAssignments,
      averageTestScore,
      averageSubjectTestScore,
      questionEmoji: getQuestionEmoji(totalQuestionsAttempted),
      subjects,
      progressPercentage: Math.min((totalQuestionsAttempted / 252000) * 100, 100),
      examDate: '2026-05-03',
      daysRemaining: Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    };
    
    return NextResponse.json(predictorData);
  } catch (error) {
    console.error('Predictor API error:', error);
    // Return default predictor data when database fails
    return NextResponse.json({
      totalTests: 0,
      totalSubjectTests: 0,
      totalQuestionsAttempted: 0,
      practiceQuestions: 0,
      subjectTestQuestions: 0,
      completedLectures: 0,
      completedDPPs: 0,
      completedAssignments: 0,
      averageTestScore: 0,
      averageSubjectTestScore: 0,
      questionEmoji: '📚',
      subjects: [],
      progressPercentage: 0,
      examDate: '2026-05-03',
      daysRemaining: Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    });
  }
}

export async function POST() {
  try {
    await initDatabase();
    const data = await getPredictorData();
    
    const totalTests = data.tests.length;
    const totalQuestions = totalTests * 180;
    const practiceQuestions = data.progress.reduce((sum: number, p: any) => sum + (p.questions_solved || 0), 0);
    const subjectTestQuestions = data.subjectTests.reduce((sum: number, t: any) => sum + (t.questions_attempted || 0), 0);
    const dppQuestions = data.progress.reduce((sum: number, p: any) => {
      if (p.dpp_completed) {
        return sum + Math.floor(Math.random() * 6) + 10;
      }
      return sum;
    }, 0);
    
    const assignmentQuestions = data.progress.reduce((sum: number, p: any) => {
      let total = 0;
      if (p.normal_assignment_1) total += Math.floor(Math.random() * 101) + 100;
      if (p.normal_assignment_2) total += Math.floor(Math.random() * 101) + 100;
      if (p.kattar_assignment) total += Math.floor(Math.random() * 201) + 100;
      return sum + total;
    }, 0);
    
    const totalQuestionsAttempted = totalQuestions + practiceQuestions + subjectTestQuestions + dppQuestions + assignmentQuestions;
    
    const analysisData = {
      totalTests,
      totalSubjectTests: data.subjectTests.length,
      totalQuestionsAttempted,
      practiceQuestions,
      subjectTestQuestions,
      completedLectures: data.progress.filter((p: any) => p.completed).length,
      completedDPPs: data.progress.filter((p: any) => p.dpp_completed).length,
      completedAssignments: data.progress.filter((p: any) => 
        p.normal_assignment_1 || p.normal_assignment_2 || p.kattar_assignment
      ).length,
      averageTestScore: totalTests > 0 
        ? data.tests.reduce((sum: number, t: any) => sum + (t.score / t.max_score) * 100, 0) / totalTests 
        : 0,
      averageSubjectTestScore: data.subjectTests.length > 0
        ? data.subjectTests.reduce((sum: number, t: any) => sum + (t.score / t.max_score) * 100, 0) / data.subjectTests.length
        : 0,
      daysRemaining: Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      progressPercentage: Math.min((totalQuestionsAttempted / 252000) * 100, 100),
      subjects: ['physics', 'chemistry', 'botany', 'zoology'].map(subject => {
        const subjectProgress = data.progress.filter((p: any) => p.subject === subject);
        const subjectSpecificTests = data.subjectTests.filter((t: any) => t.subject === subject);
        
        const practiceQuestions = subjectProgress.reduce((sum: number, p: any) => sum + (p.questions_solved || 0), 0);
        const subjectTestQuestions = subjectSpecificTests.reduce((sum: number, t: any) => sum + (t.questions_attempted || 0), 0);
        const dppQuestions = subjectProgress.reduce((sum: number, p: any) => {
          if (p.dpp_completed) {
            return sum + Math.floor(Math.random() * 6) + 10;
          }
          return sum;
        }, 0);
        
        const assignmentQuestions = subjectProgress.reduce((sum: number, p: any) => {
          let total = 0;
          if (p.normal_assignment_1) total += Math.floor(Math.random() * 101) + 100;
          if (p.normal_assignment_2) total += Math.floor(Math.random() * 101) + 100;
          if (p.kattar_assignment) total += Math.floor(Math.random() * 201) + 100;
          return sum + total;
        }, 0);
        
        return {
          name: subject,
          lectures: subjectProgress.filter((p: any) => p.completed).length,
          dpps: subjectProgress.filter((p: any) => p.dpp_completed).length,
          assignments: subjectProgress.filter((p: any) => 
            p.normal_assignment_1 || p.normal_assignment_2 || p.kattar_assignment
          ).length,
          practiceQuestions,
          subjectTestQuestions,
          dppQuestions,
          subjectTests: subjectSpecificTests.length,
          avgSubjectScore: subjectSpecificTests.length > 0 
            ? subjectSpecificTests.reduce((sum: number, t: any) => sum + (t.questions_attempted || 0), 0) / subjectSpecificTests.length 
            : 0
        };
      })
    };
    
    const aiAnalysis = await generateAIFeedback(analysisData);
    
    return NextResponse.json({ analysis: aiAnalysis });
  } catch (error) {
    console.error('Predictor analysis error:', error);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}