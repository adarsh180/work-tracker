'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Brain, Save, CheckCircle } from 'lucide-react';
import { SUBJECTS_DATA } from '@/lib/subjects-data';
import ChapterTracker from '@/components/ChapterTracker';
import SubjectTestTracker from '@/components/SubjectTestTracker';
import QuestionTracker from '@/components/QuestionTracker';
import StudyChart from '@/components/StudyChart';

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;
  
  const [chapters, setChapters] = useState<any[]>([]);
  const [subjectTests, setSubjectTests] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const subjectData = SUBJECTS_DATA[subjectId as keyof typeof SUBJECTS_DATA];

  useEffect(() => {
    if (!subjectData) return;
    
    fetchSubjectData();
  }, [subjectId]);

  const fetchSubjectData = async () => {
    try {
      const [progressRes, testsRes] = await Promise.all([
        fetch(`/api/chapter-progress?subject=${subjectId}`),
        fetch(`/api/subject-tests?subject=${subjectId}`)
      ]);
      
      const progressData = await progressRes.json();
      const testsData = await testsRes.json();
      
      // Initialize chapters with progress data
      const initializedChapters = subjectData.chapters.map(chapter => {
        const existingProgress = progressData.filter((p: any) => p.chapter_name === chapter.name);
        
        const completedLectures = Array(chapter.lectures).fill(false);
        const dppCompleted = Array(chapter.lectures).fill(false);
        let revisionLevel = 1;
        let normalAssignment1 = false;
        let normalAssignment2 = false;
        let kattarAssignment = false;
        let customTrackers: any = {};

        let questionsSolved = 0;
        
        // Get chapter-level data (assignments, revision, questions) from first record
        if (existingProgress.length > 0) {
          const firstRecord = existingProgress[0];
          revisionLevel = firstRecord.revision_level || 1;
          normalAssignment1 = firstRecord.normal_assignment_1 || false;
          normalAssignment2 = firstRecord.normal_assignment_2 || false;
          kattarAssignment = firstRecord.kattar_assignment || false;
          questionsSolved = firstRecord.questions_solved || 0;
          if (firstRecord.custom_trackers) {
            customTrackers = firstRecord.custom_trackers;
          }
        }
        
        // Get lecture-specific data
        existingProgress.forEach((p: any) => {
          if (p.lecture_index < chapter.lectures) {
            completedLectures[p.lecture_index] = p.completed;
            dppCompleted[p.lecture_index] = p.dpp_completed;
          }
        });

        return {
          ...chapter,
          completedLectures,
          dppCompleted,
          revisionLevel,
          normalAssignment1,
          normalAssignment2,
          kattarAssignment,
          questionsSolved,
          customTrackers
        };
      });
      
      setChapters(initializedChapters);
      setSubjectTests(testsData);
      
      // Generate AI insights
      generateAIInsights(initializedChapters, testsData);
    } catch (error) {
      console.error('Error fetching subject data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async (chaptersData: any[], testsData: any[]) => {
    try {
      const subjectAnalysis = {
        subject: subjectData.name,
        totalChapters: chaptersData.length,
        completedChapters: chaptersData.filter(c => 
          c.completedLectures.every((l: boolean) => l)
        ).length,
        averageRevision: chaptersData.reduce((sum, c) => sum + c.revisionLevel, 0) / chaptersData.length,
        testPerformance: testsData.length > 0 
          ? testsData.reduce((sum, t) => sum + (t.score / t.max_score) * 100, 0) / testsData.length 
          : 0,
        weakChapters: chaptersData
          .filter(c => c.completedLectures.filter(Boolean).length < c.lectures * 0.5)
          .map(c => c.name)
      };

      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectAnalysis })
      });
      
      const data = await response.json();
      setAiInsights(typeof data.feedback === 'string' ? data.feedback : 'Continue your focused preparation!');
    } catch (error) {
      console.error('Error generating AI insights:', error);
    }
  };

  const updateChapterProgress = (chapterName: string, updates: any) => {
    const chapterIndex = chapters.findIndex(c => c.name === chapterName);
    if (chapterIndex === -1) return;

    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex] = { ...updatedChapters[chapterIndex], ...updates };
    setChapters(updatedChapters);
    setHasUnsavedChanges(true);
  };

  const saveAllProgress = async () => {
    setSaving(true);
    try {
      // Save all chapter progress
      for (const chapter of chapters) {
        for (let i = 0; i < chapter.lectures; i++) {
          const response = await fetch('/api/chapter-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: subjectId,
              chapterName: chapter.name,
              lectureIndex: i,
              completed: chapter.completedLectures?.[i] || false,
              dppCompleted: chapter.dppCompleted?.[i] || false,
              revisionLevel: chapter.revisionLevel || 1,
              normalAssignment1: chapter.normalAssignment1 || false,
              normalAssignment2: chapter.normalAssignment2 || false,
              kattarAssignment: chapter.kattarAssignment || false,
              questionsSolved: chapter.questionsSolved || 0,
              customTrackers: chapter.customTrackers || {}
            })
          });
          
          if (!response.ok) {
            console.error(`Failed to save progress for ${chapter.name} lecture ${i}:`, response.status, response.statusText);
            throw new Error(`API Error: ${response.status}`);
          }
        }
      }
      
      // Generate AI insights after saving
      await generateAIInsights(chapters, subjectTests);
      
      // Trigger dashboard update
      localStorage.setItem('lastUpdate', Date.now().toString());
      window.dispatchEvent(new Event('storage'));
      
      setHasUnsavedChanges(false);
      setSaveSuccess(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateChapterQuestions = (chapterName: string, questionsSolved: number) => {
    const chapterIndex = chapters.findIndex(c => c.name === chapterName);
    if (chapterIndex === -1) return;

    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].questionsSolved = questionsSolved;
    setChapters(updatedChapters);
    setHasUnsavedChanges(true);
  };

  const addSubjectTest = async (test: any) => {
    try {
      const response = await fetch('/api/subject-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      });
      
      const newTest = await response.json();
      setSubjectTests([newTest, ...subjectTests]);
      generateAIInsights(chapters, [newTest, ...subjectTests]);
    } catch (error) {
      console.error('Error adding subject test:', error);
    }
  };

  if (!subjectData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Subject Not Found</h2>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full shadow-glow"
        />
      </div>
    );
  }

  const subjectColors = {
    physics: 'from-blue-500 to-blue-600',
    chemistry: 'from-green-500 to-green-600',
    botany: 'from-emerald-500 to-emerald-600',
    zoology: 'from-purple-500 to-purple-600',
  };

  const colorClass = subjectColors[subjectId as keyof typeof subjectColors];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <div className="flex-1">
              <h1 className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colorClass} animate-pulse-glow`}>
                {subjectData.name}
              </h1>
              <p className="text-gray-300">Detailed chapter and test tracking</p>
            </div>
            
            {/* Save Button */}
            <button
              onClick={saveAllProgress}
              disabled={!hasUnsavedChanges || saving}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                saveSuccess
                  ? 'bg-green-500 text-white shadow-glow'
                  : hasUnsavedChanges && !saving
                  ? `bg-gradient-to-r ${colorClass} text-white shadow-glow hover:shadow-lg`
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved Successfully!</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Progress</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Saved</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* AI Insights */}
        {aiInsights && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className={`bg-gradient-to-r ${colorClass} rounded-xl shadow-lg p-6 text-white border border-gray-600`}>
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 animate-pulse" />
                <h2 className="text-xl font-bold">AI Subject Analysis</h2>
              </div>
              <p className="leading-relaxed text-gray-100">{typeof aiInsights === 'string' ? aiInsights : 'Continue your focused preparation!'}</p>
            </div>
          </motion.div>
        )}

        {/* Subject Test Tracker */}
        <div className="mb-8">
          <SubjectTestTracker tests={subjectTests} onAddTest={addSubjectTest} subject={subjectId} />
        </div>

        {/* Chapters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Chapter Progress</h2>
          <div className="space-y-6">
            {chapters.map((chapter, index) => (
              <div key={chapter.name}>
                <ChapterTracker
                  chapter={chapter}
                  onUpdate={updateChapterProgress}
                />
                <QuestionTracker
                  chapter={chapter}
                  onUpdate={updateChapterQuestions}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}