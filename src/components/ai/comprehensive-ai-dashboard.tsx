'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatsCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, Progress, LoadingSpinner } from '@/components/ui/enhanced-components';
import { TabsLayout, Grid } from '@/components/ui/premium-layouts';
import { PremiumLineChart, PremiumAreaChart, ProgressRing, AnimatedCounter } from '@/components/ui/premium-charts';
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
  Activity,
  Sparkles,
  Star,
  Flame,
  BarChart3,
  Users,
  Lightbulb
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-4">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-glow">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-3 w-3 text-yellow-900" />
            </motion.div>
          </motion.div>

          <div>
            <motion.h1
              className="text-4xl md:text-5xl font-bold gradient-text"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              Misti's AI Success Engine
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center justify-center gap-2 mt-2"
            >
              {['🚀', '⭐', '💎', '🎯', '✨'].map((emoji, i) => (
                <motion.span
                  key={i}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{
                    delay: i * 0.2,
                    duration: 2,
                    repeat: Infinity
                  }}
                  className="text-xl"
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-foreground-secondary max-w-2xl mx-auto leading-relaxed"
        >
          Advanced AI system designed to help you achieve
          <motion.span
            className="font-bold text-primary mx-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            AIR under 50
          </motion.span>
          in NEET UG 2026
        </motion.p>
      </motion.div>

      {/* Enhanced Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Predicted AIR"
          value={airPrediction ? airPrediction.predictedAIR.toLocaleString() : '---'}
          description="Based on current performance"
          icon={<Trophy className="h-6 w-6 text-yellow-400" />}
          trend={airPrediction ? { value: 15, isPositive: true } : undefined}
          color="primary"
        />

        <StatsCard
          title="Days to NEET"
          value={Math.ceil((new Date('2026-05-03').getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
          description="Countdown to exam day"
          icon={<Clock className="h-6 w-6 text-blue-400" />}
          color="success"
        />

        <StatsCard
          title="Cycle Phase"
          value={getCurrentCyclePhase()}
          description="Current biological phase"
          icon={<Heart className="h-6 w-6 text-pink-400" />}
          color="warning"
        />

        <StatsCard
          title="Energy Level"
          value={menstrualData ? `${menstrualData.energyLevel}/10` : '---'}
          description="Current energy capacity"
          icon={<Activity className="h-6 w-6 text-orange-400" />}
          trend={menstrualData ? { value: 8, isPositive: true } : undefined}
          color="error"
        />
      </motion.div>

      {/* Enhanced Tabs System */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <TabsLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
          variant="pills"
          tabs={[
            {
              id: 'prediction',
              label: 'AIR Prediction',
              icon: <Target className="h-4 w-4" />,
              content: renderPredictionTab()
            },
            {
              id: 'schedule',
              label: 'Smart Schedule',
              icon: <Calendar className="h-4 w-4" />,
              content: renderScheduleTab()
            },
            {
              id: 'biology',
              label: 'Biology Sync',
              icon: <Heart className="h-4 w-4" />,
              content: renderBiologyTab()
            },
            {
              id: 'integration',
              label: 'Life Integration',
              icon: <BookOpen className="h-4 w-4" />,
              content: renderIntegrationTab()
            }
          ]}
        />
      </motion.div>
    </motion.div>
  )

  // Tab Content Renderers
  function renderPredictionTab() {
    return (

      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-xl bg-primary/20"
              >
                <Target className="h-5 w-5 text-primary" />
              </motion.div>
              <span className="gradient-text">NEET AIR Prediction Engine</span>
            </div>
            <Button
              onClick={generateAIRPrediction}
              disabled={loading}
              variant="gradient"
              leftIcon={loading ? <LoadingSpinner size="sm" /> : <Sparkles className="h-4 w-4" />}
            >
              {loading ? 'Analyzing...' : 'Generate Prediction'}
            </Button>
          </CardTitle>
          <CardDescription>
            AI-powered prediction based on current progress, biological factors, and performance trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          {airPrediction ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Enhanced Main Prediction */}
              <motion.div
                className="text-center p-8 glass-card relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10" />
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="mb-4"
                  >
                    <div className="text-5xl font-bold gradient-text mb-2">
                      AIR <AnimatedCounter value={airPrediction.predictedAIR} />
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <ProgressRing
                        progress={airPrediction.confidenceScore * 100}
                        size={80}
                        color="#3b82f6"
                      />
                      <div className="text-left">
                        <div className="text-sm text-foreground-secondary">Confidence Score</div>
                        <div className="text-lg font-bold text-foreground">
                          {(airPrediction.confidenceScore * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={airPrediction.riskAssessment === 'low' ? 'success' :
                        airPrediction.riskAssessment === 'medium' ? 'warning' : 'error'}
                      size="lg"
                      pulse={airPrediction.riskAssessment === 'high'}
                    >
                      {airPrediction.riskAssessment.toUpperCase()} RISK
                    </Badge>
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Key Factors */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Key Success Factors
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {airPrediction.keyFactors.map((factor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-effect p-4 rounded-xl hover:shadow-glow transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-success-500" />
                        <span className="text-foreground">{factor}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Enhanced Recommendations */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  AI Recommendations
                </h3>
                <div className="space-y-3">
                  {airPrediction.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-effect p-4 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground leading-relaxed">{rec}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Enhanced Milestones */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Success Milestones
                </h3>
                <div className="space-y-4">
                  {airPrediction.milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card hover:shadow-elevation-3 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-foreground">{milestone.target}</h4>
                        <Badge variant="outline">
                          {new Date(milestone.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-foreground-secondary leading-relaxed">{milestone.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <Target className="h-16 w-16 text-primary/50 mx-auto" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to predict your success?
              </h3>
              <p className="text-foreground-secondary">
                Click "Generate Prediction" to get your personalized AIR forecast
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    )
  }

  function renderScheduleTab() {
    return (
      <Card variant="premium" hover="both" asMotion>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-xl bg-success/20"
              >
                <Calendar className="h-5 w-5 text-success-500" />
              </motion.div>
              <span className="gradient-text">Biologically Optimized Schedule</span>
            </div>
            <Button
              onClick={generateSmartSchedule}
              disabled={loading}
              variant="success"
              leftIcon={loading ? <LoadingSpinner size="sm" /> : <Brain className="h-4 w-4" />}
            >
              {loading ? 'Optimizing...' : 'Generate Schedule'}
            </Button>
          </CardTitle>
          <CardDescription>
            AI schedule that adapts to your menstrual cycle, energy levels, festivals, and BSc commitments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {smartSchedule ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Today's Schedule */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Today's Optimized Schedule
                </h3>
                <div className="space-y-3">
                  {smartSchedule.dailySchedule.map((slot, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-effect p-4 rounded-xl hover:shadow-glow transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="font-mono">
                            {slot.timeSlot}
                          </Badge>
                          <div>
                            <div className="font-medium text-foreground">
                              {slot.subject} - {slot.activity}
                            </div>
                            <div className="text-sm text-foreground-secondary">
                              {slot.reasoning}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={slot.intensity === 'high' ? 'error' :
                              slot.intensity === 'medium' ? 'warning' : 'success'}
                            size="sm"
                          >
                            {slot.intensity}
                          </Badge>
                          <span className="text-sm text-foreground-secondary">
                            {slot.duration}min
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Biological Optimizations */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-400" />
                  Biological Optimizations
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {smartSchedule.biologicalOptimizations.map((opt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-effect p-4 rounded-xl border border-pink-500/20"
                    >
                      <span className="text-foreground">{opt}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Festival & BSc Integration */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Festival Adjustments</h3>
                  <div className="space-y-3">
                    {smartSchedule.festivalAdjustments.map((adj, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-effect p-3 rounded-lg border border-orange-500/20"
                      >
                        <span className="text-foreground">{adj}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">BSc Integration</h3>
                  <div className="space-y-3">
                    {smartSchedule.bscIntegration.map((integration, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-effect p-3 rounded-lg border border-blue-500/20"
                      >
                        <span className="text-foreground">{integration}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emergency Plan */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect p-6 rounded-xl border border-error-500/20 bg-error/5"
              >
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-error-500" />
                  Emergency Low-Energy Plan
                </h3>
                <p className="text-foreground leading-relaxed">{smartSchedule.emergencyPlan}</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <Calendar className="h-16 w-16 text-success-500/50 mx-auto" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to optimize your schedule?
              </h3>
              <p className="text-foreground-secondary">
                Click "Generate Schedule" to get your personalized study plan
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    )
  }

  function renderBiologyTab() {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="premium" hover="both" asMotion>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="p-2 rounded-xl bg-purple/20"
              >
                <Moon className="h-5 w-5 text-purple-400" />
              </motion.div>
              <span className="gradient-text">Menstrual Cycle Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {menstrualData ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center glass-effect p-6 rounded-xl border border-purple-500/20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mb-4"
                  >
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {getCurrentCyclePhase()} Phase
                    </div>
                    <div className="text-sm text-foreground-secondary">
                      Day {Math.floor((Date.now() - new Date(menstrualData.cycleStartDate).getTime()) / (1000 * 60 * 60 * 24)) % menstrualData.cycleLength + 1} of {menstrualData.cycleLength}
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Energy Level</span>
                    <div className="flex items-center gap-3">
                      <Progress value={menstrualData.energyLevel * 10} variant="success" animated />
                      <span className="text-foreground font-medium">{menstrualData.energyLevel}/10</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Study Capacity</span>
                    <div className="flex items-center gap-3">
                      <Progress value={menstrualData.studyCapacity * 10} variant="default" animated />
                      <span className="text-foreground font-medium">{menstrualData.studyCapacity}/10</span>
                    </div>
                  </div>
                </div>

                {menstrualData.symptoms.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-foreground font-medium">Current Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {menstrualData.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline" size="sm">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="text-center py-8">
                <p className="text-foreground-secondary mb-4">No cycle data available</p>
                <Button variant="primary" size="sm">
                  Add Cycle Data
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="premium" hover="both" asMotion>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity }
                }}
                className="p-2 rounded-xl bg-yellow/20"
              >
                <Sun className="h-5 w-5 text-yellow-400" />
              </motion.div>
              <span className="gradient-text">Circadian Optimization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Peak Focus Hours', time: '6:00 AM - 10:00 AM', color: 'warning', icon: '🌅' },
                { title: 'Good Study Hours', time: '4:00 PM - 8:00 PM', color: 'success', icon: '📚' },
                { title: 'Light Study Hours', time: '8:00 PM - 10:00 PM', color: 'info', icon: '📖' },
                { title: 'Rest Hours', time: '10:00 PM - 6:00 AM', color: 'error', icon: '😴' }
              ].map((period, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect p-4 rounded-xl hover:shadow-glow transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{period.icon}</span>
                    <div>
                      <h4 className="font-medium text-foreground">{period.title}</h4>
                      <p className="text-sm text-foreground-secondary">{period.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  function renderIntegrationTab() {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="premium" hover="both" asMotion>
          <CardHeader>
            <CardTitle className="gradient-text">Upcoming Festivals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Diwali', dates: 'Nov 1-5, 2024', impact: 'High Impact', description: 'Reduce study by 70%, focus on light revision', color: 'error' },
                { name: 'Holi', dates: 'Mar 14-15, 2025', impact: 'Medium Impact', description: 'Reduce study by 50%, maintain core subjects', color: 'warning' }
              ].map((festival, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-effect p-4 rounded-xl border border-orange-500/20"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">{festival.name}</span>
                    <Badge variant={festival.color as any}>
                      {festival.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground-secondary mb-1">{festival.dates}</p>
                  <p className="text-sm text-foreground">{festival.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="premium" hover="both" asMotion>
          <CardHeader>
            <CardTitle className="gradient-text">BSc Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-effect p-4 rounded-xl border border-blue-500/20"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-foreground">Semester Exams</span>
                  <Badge variant="info">High Priority</Badge>
                </div>
                <p className="text-sm text-foreground-secondary mb-1">Dec 2024</p>
                <p className="text-sm text-foreground">Allocate 30% time to BSc, 70% to NEET</p>
              </motion.div>

              <Button variant="primary" className="w-full">
                Add BSc Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}