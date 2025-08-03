'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, BookOpen, Target, RotateCcw, Plus } from 'lucide-react';
import { getEmojiForPercentage } from '@/lib/subjects-data';

interface ChapterTrackerProps {
  chapter: any;
  onUpdate: (chapterName: string, updates: any) => void;
}

export default function ChapterTracker({ chapter, onUpdate }: ChapterTrackerProps) {
  const [customTracker, setCustomTracker] = useState('');
  const [showAddTracker, setShowAddTracker] = useState(false);

  const lectureProgress = chapter.completedLectures?.filter(Boolean).length || 0;
  const dppProgress = chapter.dppCompleted?.filter(Boolean).length || 0;
  const overallProgress = ((lectureProgress + dppProgress) / (chapter.lectures * 2)) * 100;
  const emoji = getEmojiForPercentage(overallProgress);

  const toggleLecture = (index: number) => {
    const newCompleted = [...(chapter.completedLectures || Array(chapter.lectures).fill(false))];
    newCompleted[index] = !newCompleted[index];
    onUpdate(chapter.name, { completedLectures: newCompleted });
    
    // Trigger dashboard update with delay to ensure database update completes
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('chapterUpdate'));
    }, 500);
  };

  const toggleDPP = (index: number) => {
    const newCompleted = [...(chapter.dppCompleted || Array(chapter.lectures).fill(false))];
    newCompleted[index] = !newCompleted[index];
    onUpdate(chapter.name, { dppCompleted: newCompleted });
    
    // Trigger dashboard update with delay
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('chapterUpdate'));
    }, 500);
  };

  const updateRevision = (level: number) => {
    onUpdate(chapter.name, { revisionLevel: level });
    
    // Trigger dashboard update
    window.dispatchEvent(new CustomEvent('chapterUpdate'));
  };

  const toggleAssignment = (type: 'normal1' | 'normal2' | 'kattar') => {
    const updates: any = {};
    if (type === 'normal1') updates.normalAssignment1 = !chapter.normalAssignment1;
    if (type === 'normal2') updates.normalAssignment2 = !chapter.normalAssignment2;
    if (type === 'kattar') updates.kattarAssignment = !chapter.kattarAssignment;
    onUpdate(chapter.name, updates);
    
    // Trigger dashboard update
    window.dispatchEvent(new CustomEvent('chapterUpdate'));
  };

  const addCustomTracker = () => {
    if (customTracker.trim()) {
      const newTrackers = { ...chapter.customTrackers };
      newTrackers[customTracker] = Array(chapter.lectures).fill(false);
      onUpdate(chapter.name, { customTrackers: newTrackers });
      setCustomTracker('');
      setShowAddTracker(false);
    }
  };

  const toggleCustomTracker = (trackerName: string, index: number) => {
    const newTrackers = { ...chapter.customTrackers };
    newTrackers[trackerName][index] = !newTrackers[trackerName][index];
    onUpdate(chapter.name, { customTrackers: newTrackers });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 mb-6 hover:shadow-glow transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl animate-pulse-glow">{emoji}</div>
          <div>
            <h3 className="text-xl font-bold text-white">{chapter.name}</h3>
            <p className="text-sm text-gray-400">{chapter.lectures} lectures • {Math.round(overallProgress)}% complete</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-300">{lectureProgress}/{chapter.lectures}</span>
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full shadow-glow"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="space-y-6">
        {/* Lectures */}
        <div>
          <h4 className="font-semibold text-white mb-3">Lectures</h4>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: chapter.lectures }, (_, i) => (
              <button
                key={i}
                onClick={() => toggleLecture(i)}
                className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  chapter.completedLectures?.[i]
                    ? 'bg-green-500 text-white shadow-glow'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                L{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* DPP */}
        <div>
          <h4 className="font-semibold text-white mb-3">Daily Practice Problems</h4>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: chapter.lectures }, (_, i) => (
              <button
                key={i}
                onClick={() => toggleDPP(i)}
                className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  chapter.dppCompleted?.[i]
                    ? 'bg-blue-500 text-white shadow-glow'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                D{i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Revision Level */}
        <div>
          <h4 className="font-semibold text-white mb-3">Revision Level</h4>
          <div className="flex items-center space-x-2">
            <RotateCcw className="w-4 h-4 text-gray-400" />
            <div className="flex space-x-1">
              {Array.from({ length: 10 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => updateRevision(i + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 ${
                    (chapter.revisionLevel || 1) > i
                      ? 'bg-purple-500 text-white shadow-glow'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-300">
              {chapter.revisionLevel || 1}/10
            </span>
          </div>
        </div>

        {/* Assignments */}
        <div>
          <h4 className="font-semibold text-white mb-3">Assignments</h4>
          <div className="flex space-x-4">
            <button
              onClick={() => toggleAssignment('normal1')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                chapter.normalAssignment1
                  ? 'bg-green-500 text-white shadow-glow'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {chapter.normalAssignment1 ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span className="text-sm">Normal 1</span>
            </button>
            <button
              onClick={() => toggleAssignment('normal2')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                chapter.normalAssignment2
                  ? 'bg-green-500 text-white shadow-glow'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {chapter.normalAssignment2 ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span className="text-sm">Normal 2</span>
            </button>
            <button
              onClick={() => toggleAssignment('kattar')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                chapter.kattarAssignment
                  ? 'bg-red-500 text-white shadow-glow'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {chapter.kattarAssignment ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span className="text-sm font-bold">Kattar</span>
            </button>
          </div>
        </div>

        {/* Custom Trackers */}
        {Object.keys(chapter.customTrackers || {}).length > 0 && (
          <div>
            <h4 className="font-semibold text-white mb-3">Custom Trackers</h4>
            {Object.entries(chapter.customTrackers || {}).map(([trackerName, values]: [string, any]) => (
              <div key={trackerName} className="mb-3">
                <p className="text-sm font-medium text-gray-300 mb-2">{trackerName}</p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {values.map((completed: boolean, i: number) => (
                    <button
                      key={i}
                      onClick={() => toggleCustomTracker(trackerName, i)}
                      className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        completed
                          ? 'bg-indigo-500 text-white shadow-glow'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Tracker */}
        <div>
          {showAddTracker ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={customTracker}
                onChange={(e) => setCustomTracker(e.target.value)}
                placeholder="Enter tracker name"
                className="flex-1 p-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addCustomTracker}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-glow"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddTracker(false)}
                className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddTracker(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Custom Tracker</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}