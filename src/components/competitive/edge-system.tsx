'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Target, Zap, Crown, Star, Brain, Heart, Sparkles, Rocket } from 'lucide-react';
import { getRandomMotivationalQuote, getMotivationalQuotesByCategory } from '@/lib/motivational-quotes';
import { motion, AnimatePresence } from 'framer-motion';


interface CompetitiveData {
  currentRank: number;
  targetRank: number;
  gapAnalysis: {
    questionsGap: number;
    hoursGap: number;
    accuracyGap: number;
  };
  topperPatterns: {
    dailyQuestions: number;
    studyHours: number;
    accuracy: number;
    revisionCycles: number;
  };
  mistiProgress: {
    dailyQuestions: number;
    studyHours: number;
    accuracy: number;
    revisionCycles: number;
  };
}

export function CompetitiveEdgeSystem() {
  const [competitiveData, setCompetitiveData] = useState<CompetitiveData>({
    currentRank: 0, // Will be calculated dynamically
    targetRank: 50,
    gapAnalysis: {
      questionsGap: 0,
      hoursGap: 0,
      accuracyGap: 0
    },
    topperPatterns: {
      dailyQuestions: 400,
      studyHours: 12,
      accuracy: 85,
      revisionCycles: 3
    },
    mistiProgress: {
      dailyQuestions: 0,
      studyHours: 0,
      accuracy: 0,
      revisionCycles: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load real-time data from API
  useEffect(() => {
    const loadRealData = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/competitive-edge-data');
        const result = await response.json();
        
        if (result.success) {
          setCompetitiveData(result.data.competitiveData);
        } else {
          console.error('Failed to load competitive data:', result.error);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load real competitive data:', error);
        setIsLoading(false);
      }
    };
    
    loadRealData();
    
    // Refresh data every 10 seconds for real-time updates
    const interval = setInterval(loadRealData, 10000);
    return () => clearInterval(interval);
  }, []);

  const [showMotivation, setShowMotivation] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [actionPlan, setActionPlan] = useState('');
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [displayedQuote, setDisplayedQuote] = useState('');



  const calculateProgress = (current: number, target: number): number => {
    return Math.min(100, (current / target) * 100);
  };

  const generateMotivationalBoost = () => {
    setIsThinking(true);
    setShowMotivation(true);
    setDisplayedQuote('');
    
    // Thinking delay (1-2 seconds)
    setTimeout(() => {
      setIsThinking(false);
      const quote = getRandomMotivationalQuote();
      setCurrentQuote(quote);
      
      // Typewriter effect
      let i = 0;
      const typeWriter = () => {
        if (i < quote.length) {
          setDisplayedQuote(quote.substring(0, i + 1));
          i++;
          setTimeout(typeWriter, 30); // 30ms per character
        }
      };
      typeWriter();
      
      // Auto-hide after quote is fully typed + 4 seconds
      setTimeout(() => {
        setShowMotivation(false);
      }, quote.length * 30 + 4000);
    }, 1500); // 1.5 second thinking delay
  };

  const generateActionPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch('/api/competitive-edge/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setActionPlan(data.actionPlan);
        setShowActionPlan(true);
      } else {
        // Fallback to basic plan
        const basicPlan = [
          `📈 Increase daily questions from ${competitiveData.mistiProgress.dailyQuestions} to ${competitiveData.topperPatterns.dailyQuestions}`,
          `⏰ Add ${competitiveData.gapAnalysis.hoursGap} more study hours daily`,
          `🎯 Improve accuracy by ${competitiveData.gapAnalysis.accuracyGap}% through focused practice`,
          `🔄 Add one more revision cycle per chapter`,
          `📊 Weekly mock tests to track improvement`
        ].join('\n\n');
        setActionPlan(basicPlan);
        setShowActionPlan(true);
      }
    } catch (error) {
      console.error('Failed to generate action plan:', error);
      // Fallback plan
      const basicPlan = `🎯 IMMEDIATE ACTION PLAN\n\n📈 Increase daily practice\n⏰ Optimize study schedule\n🎯 Focus on weak areas\n🔄 Regular revision cycles`;
      setActionPlan(basicPlan);
      setShowActionPlan(true);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-yellow-500/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-400" />
              Competitive Edge Analysis
              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
            </CardTitle>
          </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
              {isLoading ? (
                <div className="text-3xl font-bold text-gray-400 animate-pulse">Calculating...</div>
              ) : (
                <div className="text-3xl font-bold text-red-400">#{competitiveData.currentRank.toLocaleString()}</div>
              )}
              <div className="text-sm text-gray-300">Current Predicted Rank</div>
              {!isLoading && (
                <div className="text-xs text-gray-400 mt-1">Based on real performance</div>
              )}
            </div>
            <div className="text-center p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
              <div className="text-3xl font-bold text-green-400">#{competitiveData.targetRank}</div>
              <div className="text-sm text-gray-300">Target Rank</div>
              <div className="text-xs text-gray-400 mt-1">AIR 1-50 Goal</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Gap Analysis vs AIR 1-50 Students
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Daily Questions</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={calculateProgress(competitiveData.mistiProgress.dailyQuestions, competitiveData.topperPatterns.dailyQuestions)} 
                    className="w-32" 
                  />
                  <span className="text-white text-sm">
                    {competitiveData.mistiProgress.dailyQuestions}/{competitiveData.topperPatterns.dailyQuestions}
                  </span>
                  <Badge className="bg-red-600">-{competitiveData.gapAnalysis.questionsGap}</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Study Hours</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={calculateProgress(competitiveData.mistiProgress.studyHours, competitiveData.topperPatterns.studyHours)} 
                    className="w-32" 
                  />
                  <span className="text-white text-sm">
                    {competitiveData.mistiProgress.studyHours}/{competitiveData.topperPatterns.studyHours}h
                  </span>
                  <Badge className="bg-red-600">-{competitiveData.gapAnalysis.hoursGap}h</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Accuracy</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={competitiveData.mistiProgress.accuracy} 
                    className="w-32" 
                  />
                  <span className="text-white text-sm">
                    {competitiveData.mistiProgress.accuracy}/100%
                  </span>
                  <Badge className="bg-red-600">-{competitiveData.gapAnalysis.accuracyGap}%</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={generateActionPlan}
              disabled={isGeneratingPlan}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isGeneratingPlan ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  AI Action Plan
                </>
              )}
            </Button>
            
            <Button 
              onClick={generateMotivationalBoost}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Heart className="h-4 w-4 mr-2" />
              Motivational Boost
            </Button>
          </div>

          <AnimatePresence>
            {showMotivation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="h-6 w-6 text-pink-400 animate-bounce" />
                  <h3 className="text-lg font-semibold text-white">Motivational Boost</h3>
                </div>
                {isThinking ? (
                  <div className="flex items-center gap-2 text-purple-200">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm">Thinking of something special for you...</span>
                  </div>
                ) : (
                  <p className="text-purple-200 font-medium text-lg leading-relaxed min-h-[2rem]">
                    {displayedQuote}
                    <span className="animate-pulse">|</span>
                  </p>
                )}
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={generateMotivationalBoost}
                    size="sm"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Another Quote
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        </Card>
      </motion.div>

      {/* AI Action Plan Modal */}
      <AnimatePresence>
        {showActionPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowActionPlan(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  AI-Generated Action Plan
                </h2>
                <Button
                  onClick={() => setShowActionPlan(false)}
                  size="sm"
                  className="bg-gray-700 hover:bg-gray-600"
                >
                  ✕
                </Button>
              </div>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed">
                  {actionPlan}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}