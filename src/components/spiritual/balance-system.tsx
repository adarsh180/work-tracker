'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Sun, Moon, Flower, Star, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpiritualActivity {
  id: string;
  name: string;
  activityType: string;
  duration: number;
  completed: boolean;
  benefits: string[];
}

interface GratitudeEntry {
  id: string;
  date: string;
  content: string;
  createdAt: string;
}

interface SpiritualProgress {
  daily: number;
  weekly: number;
  monthly: number;
  streak: number;
}

export function SpiritualBalanceSystem() {
  const [dailyActivities, setDailyActivities] = useState<SpiritualActivity[]>([
    {
      id: '1',
      name: 'Morning Prayer/Meditation',
      activityType: 'prayer',
      duration: 10,
      completed: false,
      benefits: ['Mental clarity', 'Stress reduction', 'Focus enhancement']
    },
    {
      id: '2',
      name: 'Gratitude Journaling',
      activityType: 'gratitude',
      duration: 5,
      completed: false,
      benefits: ['Positive mindset', 'Emotional balance', 'Motivation boost']
    },
    {
      id: '3',
      name: 'Evening Reflection',
      activityType: 'reflection',
      duration: 10,
      completed: false,
      benefits: ['Self-awareness', 'Peace of mind', 'Better sleep']
    }
  ]);

  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [showGratitudeForm, setShowGratitudeForm] = useState(false);
  const [newGratitude, setNewGratitude] = useState('');
  const [spiritualProgress, setSpiritualProgress] = useState<SpiritualProgress>({
    daily: 0,
    weekly: 0,
    monthly: 0,
    streak: 0
  });
  const [loading, setLoading] = useState(false);

  const spiritualQuotes = [
    {
      quote: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन",
      translation: "You have the right to perform your actions, but not to the fruits of action",
      source: "Bhagavad Gita",
      relevance: "Focus on studying without attachment to results"
    },
    {
      quote: "श्रद्धावान् लभते ज्ञानं",
      translation: "The faithful one attains knowledge",
      source: "Bhagavad Gita", 
      relevance: "Faith and dedication lead to wisdom"
    },
    {
      quote: "विद्या ददाति विनयं",
      translation: "Knowledge gives humility",
      source: "Sanskrit Proverb",
      relevance: "True learning brings humility and wisdom"
    }
  ];

  const meditationTechniques = [
    {
      name: "Pranayama for Focus",
      duration: "5-10 minutes",
      steps: [
        "Sit comfortably with spine straight",
        "Inhale for 4 counts through nose",
        "Hold breath for 4 counts", 
        "Exhale for 6 counts through mouth",
        "Repeat 10-15 cycles"
      ],
      benefits: "Improves concentration and reduces study stress"
    },
    {
      name: "Mantra Meditation",
      duration: "10-15 minutes",
      steps: [
        "Choose a peaceful mantra (Om, So Hum, etc.)",
        "Sit quietly and close eyes",
        "Repeat mantra mentally with breath",
        "When mind wanders, gently return to mantra",
        "End with gratitude"
      ],
      benefits: "Calms mind and enhances memory retention"
    },
    {
      name: "Loving-Kindness for Motivation",
      duration: "5-10 minutes", 
      steps: [
        "Send love to yourself: 'May I be happy and successful'",
        "Send love to family: 'May they be proud and happy'",
        "Send love to teachers: 'May they guide me well'",
        "Send love to all students: 'May we all succeed'",
        "Feel the positive energy"
      ],
      benefits: "Builds positive emotions and reduces competition stress"
    }
  ];

  // Load data on component mount
  useEffect(() => {
    loadSpiritualData();
    loadGratitudeEntries();
  }, []);

  const loadSpiritualData = async () => {
    try {
      const response = await fetch('/api/spiritual-activities');
      const data = await response.json();
      if (data.success) {
        // Update activities completion status
        const today = new Date().toISOString().split('T')[0];
        const todayActivities = data.activities.filter((a: any) => 
          a.date === today
        );
        
        setDailyActivities(prev => prev.map(activity => {
          const completed = todayActivities.find((ta: any) => 
            ta.activityType === activity.activityType && ta.completed
          );
          return { ...activity, completed: !!completed };
        }));
        
        setSpiritualProgress(data.progress);
      }
    } catch (error) {
      console.error('Failed to load spiritual data:', error);
    }
  };

  const loadGratitudeEntries = async () => {
    try {
      const response = await fetch('/api/gratitude-entries');
      const data = await response.json();
      if (data.success) {
        setGratitudeEntries(data.entries);
      }
    } catch (error) {
      console.error('Failed to load gratitude entries:', error);
    }
  };

  const completeActivity = async (activityId: string) => {
    const activity = dailyActivities.find(a => a.id === activityId);
    if (!activity) return;

    setLoading(true);
    try {
      const response = await fetch('/api/spiritual-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityType: activity.activityType,
          duration: activity.duration,
          completed: true
        })
      });

      if (response.ok) {
        setDailyActivities(prev => prev.map(a => 
          a.id === activityId ? { ...a, completed: true } : a
        ));
        loadSpiritualData(); // Refresh progress
      }
    } catch (error) {
      console.error('Failed to complete activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGratitudeEntry = async () => {
    if (!newGratitude.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/gratitude-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newGratitude })
      });

      if (response.ok) {
        setNewGratitude('');
        setShowGratitudeForm(false);
        loadGratitudeEntries(); // Refresh entries
      }
    } catch (error) {
      console.error('Failed to add gratitude entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysQuote = () => {
    const today = new Date().getDate();
    return spiritualQuotes[today % spiritualQuotes.length];
  };

  const getCompletionPercentage = () => {
    const completed = dailyActivities.filter(activity => activity.completed).length;
    return Math.round((completed / dailyActivities.length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sun className="h-5 w-5 text-orange-400" />
            Spiritual Balance & Inner Peace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Daily Spiritual Progress */}
          {/* Progress Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{getCompletionPercentage()}%</div>
              <div className="text-xs text-gray-300">Today</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{spiritualProgress.weekly}%</div>
              <div className="text-xs text-gray-300">This Week</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{spiritualProgress.monthly}%</div>
              <div className="text-xs text-gray-300">This Month</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{spiritualProgress.streak}</div>
              <div className="text-xs text-gray-300">Day Streak</div>
            </div>
          </div>

          {/* Daily Activities */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Today's Spiritual Practice</h3>
            {dailyActivities.map((activity) => (
              <div key={activity.id} className="p-4 bg-gray-700/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4 text-pink-400" />
                    {activity.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{activity.duration} min</Badge>
                    {activity.completed ? (
                      <Badge className="bg-green-600">Completed ✓</Badge>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => completeActivity(activity.id)}
                        disabled={loading}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        {loading ? 'Saving...' : 'Complete'}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activity.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Quote */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-400" />
            Today's Spiritual Wisdom
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const quote = getTodaysQuote();
            return (
              <div className="space-y-4">
                <div className="text-center p-4 bg-purple-900/20 rounded-lg">
                  <p className="text-purple-300 text-lg font-medium mb-2">{quote.quote}</p>
                  <p className="text-gray-300 text-sm mb-2">"{quote.translation}"</p>
                  <p className="text-purple-400 text-xs">- {quote.source}</p>
                </div>
                <div className="p-3 bg-pink-900/20 border border-pink-500/20 rounded-lg">
                  <p className="text-pink-300 text-sm">
                    <strong>For Your NEET Journey:</strong> {quote.relevance}
                  </p>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Gratitude Journal */}
      <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Flower className="h-5 w-5 text-green-400" />
            Gratitude Journal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-300">What are you grateful for today?</p>
            <Button 
              onClick={() => setShowGratitudeForm(!showGratitudeForm)}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              Add Gratitude
            </Button>
          </div>

          {showGratitudeForm && (
            <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
              <textarea
                value={newGratitude}
                onChange={(e) => setNewGratitude(e.target.value)}
                placeholder="I am grateful for..."
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <Button onClick={addGratitudeEntry} disabled={loading} size="sm">
                {loading ? 'Saving...' : 'Save'}
              </Button>
                <Button onClick={() => setShowGratitudeForm(false)} variant="outline" size="sm">Cancel</Button>
              </div>
            </div>
          )}

          {gratitudeEntries.slice(0, 5).map((entry) => (
            <div key={entry.id} className="p-3 bg-gray-700/30 rounded-lg">
              <div className="text-green-400 text-sm font-medium mb-2">
                {new Date(entry.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <p className="text-gray-300 text-sm">• {entry.content}</p>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(entry.createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meditation Techniques */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Moon className="h-5 w-5 text-blue-400" />
            Meditation for NEET Success
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {meditationTechniques.map((technique, index) => (
            <div key={index} className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-blue-400 font-medium">{technique.name}</h4>
                <Badge variant="outline">{technique.duration}</Badge>
              </div>
              <div className="space-y-2 mb-3">
                {technique.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start gap-2">
                    <span className="text-blue-400 text-sm">{stepIndex + 1}.</span>
                    <span className="text-gray-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-green-900/20 border border-green-500/20 rounded">
                <p className="text-green-400 text-sm">
                  <strong>Benefits:</strong> {technique.benefits}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}