'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Calendar, 
  TrendingUp, 
  Heart, 
  BookOpen, 
  AlertTriangle,
  Trophy,
  Clock,
  Zap,
  Moon,
  Sun,
  Activity
} from 'lucide-react';

interface AIRPrediction {
  predictedAIR: number;
  confidenceScore: number;
  riskAssessment: 'low' | 'medium' | 'high';
  keyFactors: string[];
  recommendations: string[];
  milestones: Array<{
    date: string;
    target: string;
    description: string;
  }>;
}

interface SmartSchedule {
  dailySchedule: Array<{
    timeSlot: string;
    subject: string;
    activity: string;
    duration: number;
    intensity: 'high' | 'medium' | 'low';
    reasoning: string;
  }>;
  weeklyPlan: {
    [key: string]: {
      focus: string;
      adjustments: string[];
    };
  };
  biologicalOptimizations: string[];
  festivalAdjustments: string[];
  bscIntegration: string[];
  emergencyPlan: string;
}

interface MenstrualCycle {
  cycleStartDate: string;
  cycleLength: number;
  periodLength: number;
  energyLevel: number;
  studyCapacity: number;
  symptoms: string[];
}

export function ComprehensiveAIDashboard() {
  const [airPrediction, setAirPrediction] = useState<AIRPrediction | null>(null);
  const [smartSchedule, setSmartSchedule] = useState<SmartSchedule | null>(null);
  const [menstrualData, setMenstrualData] = useState<MenstrualCycle | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('prediction');

  const generateAIRPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/air-prediction', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        setAirPrediction(result.data);
      }
    } catch (error) {
      console.error('Error generating AIR prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSmartSchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/smart-schedule', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        setSmartSchedule(result.data);
      }
    } catch (error) {
      console.error('Error generating smart schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'high': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getCurrentCyclePhase = () => {
    if (!menstrualData) return 'Unknown';
    
    const cycleStart = new Date(menstrualData.cycleStartDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
    const cycleDay = (daysSinceStart % menstrualData.cycleLength) + 1;
    
    if (cycleDay <= menstrualData.periodLength) return 'Menstrual';
    if (cycleDay <= 13) return 'Follicular';
    if (cycleDay <= 16) return 'Ovulation';
    return 'Luteal';
  };

  useEffect(() => {
    // Load existing data on component mount
    const loadExistingData = async () => {
      try {
        const [airResponse, cycleResponse] = await Promise.all([
          fetch('/api/air-prediction'),
          fetch('/api/menstrual-cycle')
        ]);
        
        if (airResponse.ok) {
          const airResult = await airResponse.json();
          if (airResult.success) setAirPrediction(airResult.data);
        }
        
        if (cycleResponse.ok) {
          const cycleResult = await cycleResponse.json();
          if (cycleResult.data && cycleResult.data.length > 0) {
            setMenstrualData(cycleResult.data[0]);
          }
        }
      } catch (error) {
        console.error('Error loading existing data:', error);
      }
    };
    
    loadExistingData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-400" />
          Misti's AI Success Engine
        </h1>
        <p className="text-gray-400">
          Advanced AI system designed to help you achieve AIR under 50 in NEET UG 2026
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/20">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {airPrediction ? airPrediction.predictedAIR.toLocaleString() : '---'}
            </div>
            <div className="text-sm text-gray-400">Predicted AIR</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {Math.ceil((new Date('2026-05-03').getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-400">Days to NEET</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/20">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {getCurrentCyclePhase()}
            </div>
            <div className="text-sm text-gray-400">Cycle Phase</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/20">
          <CardContent className="p-4 text-center">
            <Activity className="h-8 w-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {menstrualData ? `${menstrualData.energyLevel}/10` : '---'}
            </div>
            <div className="text-sm text-gray-400">Energy Level</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="prediction" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            AIR Prediction
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Smart Schedule
          </TabsTrigger>
          <TabsTrigger value="biology" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Biology Sync
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Life Integration
          </TabsTrigger>
        </TabsList>

        {/* AIR Prediction Tab */}
        <TabsContent value="prediction" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                NEET AIR Prediction Engine
                <Button onClick={generateAIRPrediction} disabled={loading} size="sm">
                  {loading ? 'Analyzing...' : 'Generate Prediction'}
                </Button>
              </CardTitle>
              <CardDescription>
                AI-powered prediction based on current progress, biological factors, and performance trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {airPrediction ? (
                <>
                  {/* Main Prediction */}
                  <div className="text-center p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/20">
                    <div className="text-4xl font-bold text-white mb-2">
                      AIR {airPrediction.predictedAIR.toLocaleString()}
                    </div>
                    <div className="text-lg text-gray-300 mb-4">
                      Confidence: {(airPrediction.confidenceScore * 100).toFixed(1)}%
                    </div>
                    <Badge className={getRiskColor(airPrediction.riskAssessment)}>
                      {airPrediction.riskAssessment.toUpperCase()} RISK
                    </Badge>
                  </div>

                  {/* Key Factors */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Key Success Factors</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {airPrediction.keyFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-700/30 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-blue-400" />
                          <span className="text-gray-300">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
                    <div className="space-y-2">
                      {airPrediction.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                          <Zap className="h-4 w-4 text-yellow-400 mt-0.5" />
                          <span className="text-gray-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Success Milestones</h3>
                    <div className="space-y-3">
                      {airPrediction.milestones.map((milestone, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{milestone.target}</h4>
                            <Badge variant="outline" className="text-xs">
                              {new Date(milestone.date).toLocaleDateString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-300">{milestone.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Click "Generate Prediction" to get your personalized AIR forecast</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Biologically Optimized Study Schedule
                <Button onClick={generateSmartSchedule} disabled={loading} size="sm">
                  {loading ? 'Optimizing...' : 'Generate Schedule'}
                </Button>
              </CardTitle>
              <CardDescription>
                AI schedule that adapts to your menstrual cycle, energy levels, festivals, and BSc commitments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {smartSchedule ? (
                <div className="space-y-6">
                  {/* Daily Schedule */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Today's Optimized Schedule</h3>
                    <div className="space-y-2">
                      {smartSchedule.dailySchedule.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-4">
                            <span className="text-blue-400 font-mono text-sm">{slot.timeSlot}</span>
                            <span className="text-white">{slot.subject} - {slot.activity}</span>
                            <Badge className={`text-xs ${getIntensityColor(slot.intensity)}`}>
                              {slot.intensity}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-400">{slot.duration}min</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Biological Optimizations */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-400" />
                      Biological Optimizations
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      {smartSchedule.biologicalOptimizations.map((opt, index) => (
                        <div key={index} className="p-3 bg-pink-900/20 border border-pink-500/20 rounded-lg">
                          <span className="text-gray-300">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Festival & BSc Integration */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white">Festival Adjustments</h3>
                      <div className="space-y-2">
                        {smartSchedule.festivalAdjustments.map((adj, index) => (
                          <div key={index} className="p-3 bg-orange-900/20 border border-orange-500/20 rounded-lg">
                            <span className="text-gray-300">{adj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white">BSc Integration</h3>
                      <div className="space-y-2">
                        {smartSchedule.bscIntegration.map((integration, index) => (
                          <div key={index} className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                            <span className="text-gray-300">{integration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Plan */}
                  <div className="p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      Emergency Low-Energy Plan
                    </h3>
                    <p className="text-gray-300">{smartSchedule.emergencyPlan}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Click "Generate Schedule" to get your personalized study plan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Biology Sync Tab */}
        <TabsContent value="biology" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Moon className="h-5 w-5 text-purple-400" />
                  Menstrual Cycle Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {menstrualData ? (
                  <>
                    <div className="text-center p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                      <div className="text-2xl font-bold text-white mb-2">
                        {getCurrentCyclePhase()} Phase
                      </div>
                      <div className="text-sm text-gray-400">
                        Day {Math.floor((Date.now() - new Date(menstrualData.cycleStartDate).getTime()) / (1000 * 60 * 60 * 24)) % menstrualData.cycleLength + 1} of {menstrualData.cycleLength}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Energy Level</span>
                        <div className="flex items-center gap-2">
                          <Progress value={menstrualData.energyLevel * 10} className="w-20" />
                          <span className="text-white">{menstrualData.energyLevel}/10</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Study Capacity</span>
                        <div className="flex items-center gap-2">
                          <Progress value={menstrualData.studyCapacity * 10} className="w-20" />
                          <span className="text-white">{menstrualData.studyCapacity}/10</span>
                        </div>
                      </div>
                    </div>
                    
                    {menstrualData.symptoms.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-white font-medium">Current Symptoms</h4>
                        <div className="flex flex-wrap gap-2">
                          {menstrualData.symptoms.map((symptom, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400">No cycle data available</p>
                    <Button className="mt-2" size="sm">
                      Add Cycle Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-400" />
                  Circadian Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                    <h4 className="text-yellow-400 font-medium mb-1">Peak Focus Hours</h4>
                    <p className="text-gray-300 text-sm">6:00 AM - 10:00 AM</p>
                  </div>
                  
                  <div className="p-3 bg-green-900/20 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-medium mb-1">Good Study Hours</h4>
                    <p className="text-gray-300 text-sm">4:00 PM - 8:00 PM</p>
                  </div>
                  
                  <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-medium mb-1">Light Study Hours</h4>
                    <p className="text-gray-300 text-sm">8:00 PM - 10:00 PM</p>
                  </div>
                  
                  <div className="p-3 bg-red-900/20 border border-red-500/20 rounded-lg">
                    <h4 className="text-red-400 font-medium mb-1">Rest Hours</h4>
                    <p className="text-gray-300 text-sm">10:00 PM - 6:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Life Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Festivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-900/20 border border-orange-500/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Diwali</span>
                      <Badge className="bg-red-500">High Impact</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Nov 1-5, 2024</p>
                    <p className="text-sm text-gray-300 mt-1">Reduce study by 70%, focus on light revision</p>
                  </div>
                  
                  <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Holi</span>
                      <Badge className="bg-yellow-500">Medium Impact</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Mar 14-15, 2025</p>
                    <p className="text-sm text-gray-300 mt-1">Reduce study by 50%, maintain core subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">BSc Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Semester Exams</span>
                      <Badge className="bg-blue-500">High Priority</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">Dec 2024</p>
                    <p className="text-sm text-gray-300 mt-1">Allocate 30% time to BSc, 70% to NEET</p>
                  </div>
                  
                  <Button className="w-full" size="sm">
                    Add BSc Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}