'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, AlertTriangle, Target } from 'lucide-react'

interface EnhancedMistakePopupProps {
  isOpen: boolean
  onClose: () => void
  sessionType: 'daily_study' | 'test'
  sessionData: {
    physicsQuestions?: number
    chemistryQuestions?: number
    botanyQuestions?: number
    zoologyQuestions?: number
    testScore?: number
    testType?: string
  }
  onSubmit: (mistakeData: MistakeData) => void
}

interface MistakeData {
  mistakeCategories: string[]
  specificMistakes: string[]
  improvementAreas: string[]
  timeWasted: number
  stressLevel: number
  energyLevel: number
  focusLevel: number
}

const MISTAKE_CATEGORIES = [
  { id: 'no_mistakes', label: 'Nothing - Today was Fine!', icon: '🎉', color: 'text-green-400', special: true },
  { id: 'silly_mistakes', label: 'Silly Mistakes', icon: '🤦♀️', color: 'text-red-400' },
  { id: 'conceptual_gaps', label: 'Conceptual Gaps', icon: '🧠', color: 'text-orange-400' },
  { id: 'time_management', label: 'Time Management', icon: '⏰', color: 'text-yellow-400' },
  { id: 'overthinking', label: 'Overthinking', icon: '🤔', color: 'text-purple-400' },
  { id: 'panic_response', label: 'Panic Response', icon: '😰', color: 'text-red-500' },
  { id: 'pattern_confusion', label: 'Pattern Confusion', icon: '🔄', color: 'text-blue-400' },
  { id: 'calculation_errors', label: 'Calculation Errors', icon: '🔢', color: 'text-green-400' },
  { id: 'memory_lapse', label: 'Memory Lapse', icon: '💭', color: 'text-gray-400' }
]

const IMPROVEMENT_AREAS = [
  'Speed improvement needed',
  'Better revision required',
  'Concept clarity needed',
  'Practice more questions',
  'Time management skills',
  'Stress management',
  'Focus improvement',
  'Better sleep needed',
  'Nutrition optimization',
  'Study environment'
]

export default function EnhancedMistakePopup({ 
  isOpen, 
  onClose, 
  sessionType, 
  sessionData, 
  onSubmit 
}: EnhancedMistakePopupProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [specificMistakes, setSpecificMistakes] = useState<string[]>([''])
  const [improvementAreas, setImprovementAreas] = useState<string[]>([])
  const [timeWasted, setTimeWasted] = useState(0)
  const [stressLevel, setStressLevel] = useState(5)
  const [energyLevel, setEnergyLevel] = useState(5)
  const [focusLevel, setFocusLevel] = useState(5)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    
    const mistakeData: MistakeData = {
      mistakeCategories: selectedCategories,
      specificMistakes: specificMistakes.filter(m => m.trim() !== ''),
      improvementAreas,
      timeWasted,
      stressLevel,
      energyLevel,
      focusLevel
    }

    await onSubmit(mistakeData)
    setLoading(false)
  }

  const addSpecificMistake = () => {
    setSpecificMistakes([...specificMistakes, ''])
  }

  const updateSpecificMistake = (index: number, value: string) => {
    const updated = [...specificMistakes]
    updated[index] = value
    setSpecificMistakes(updated)
  }

  const toggleCategory = (categoryId: string) => {
    if (categoryId === 'no_mistakes') {
      setSelectedCategories(['no_mistakes'])
      setSpecificMistakes(['Today was perfect! No mistakes made.'])
      setImprovementAreas([])
      setTimeWasted(0)
    } else {
      setSelectedCategories(prev => {
        const filtered = prev.filter(id => id !== 'no_mistakes')
        return filtered.includes(categoryId) 
          ? filtered.filter(id => id !== categoryId)
          : [...filtered, categoryId]
      })
      if (specificMistakes.includes('Today was perfect! No mistakes made.')) {
        setSpecificMistakes([''])
      }
    }
  }

  const toggleImprovementArea = (area: string) => {
    setImprovementAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    )
  }

  const cannotClose = selectedCategories.length === 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="glass-effect border-pink-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center">
                  <Brain className="mr-2 h-6 w-6 text-pink-400" />
                  🚨 MANDATORY: Daily Learning Analysis for Misti 💕
                </CardTitle>
                <div className="text-center text-yellow-300 text-sm font-medium">
                  ⚠️ You must complete this analysis to save your progress!
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Session Summary */}
                <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20">
                  <h3 className="text-lg font-semibold text-white mb-2">Today's Session Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {sessionType === 'daily_study' ? (
                      <>
                        <div><span className="text-gray-400">Physics:</span> <span className="text-white">{sessionData.physicsQuestions || 0} questions</span></div>
                        <div><span className="text-gray-400">Chemistry:</span> <span className="text-white">{sessionData.chemistryQuestions || 0} questions</span></div>
                        <div><span className="text-gray-400">Botany:</span> <span className="text-white">{sessionData.botanyQuestions || 0} questions</span></div>
                        <div><span className="text-gray-400">Zoology:</span> <span className="text-white">{sessionData.zoologyQuestions || 0} questions</span></div>
                      </>
                    ) : (
                      <>
                        <div><span className="text-gray-400">Test Type:</span> <span className="text-white">{sessionData.testType}</span></div>
                        <div><span className="text-gray-400">Score:</span> <span className="text-white">{sessionData.testScore}/720</span></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Mistake Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-400" />
                    What mistakes did you make today? (Select at least one)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {MISTAKE_CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedCategories.includes(category.id)
                            ? category.special 
                              ? 'border-green-400 bg-green-400/20 text-green-300'
                              : 'border-pink-400 bg-pink-400/20 text-pink-300'
                            : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'
                        } ${category.special ? 'col-span-full' : ''}`}
                      >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <div className="text-sm font-medium">{category.label}</div>
                        {category.special && (
                          <div className="text-xs text-green-400 mt-1">
                            Select this if you had a perfect study session!
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Content Based on Selection */}
                {!selectedCategories.includes('no_mistakes') && (
                  <>
                    {/* Specific Mistakes */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Describe specific mistakes:</h3>
                      <div className="space-y-3">
                        {specificMistakes.map((mistake, index) => (
                          <input
                            key={index}
                            type="text"
                            value={mistake}
                            onChange={(e) => updateSpecificMistake(index, e.target.value)}
                            placeholder={`Mistake ${index + 1}: e.g., "Forgot to convert units in physics numerical"`}
                            className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white placeholder-gray-400"
                          />
                        ))}
                        <button
                          onClick={addSpecificMistake}
                          className="text-pink-400 hover:text-pink-300 text-sm font-medium"
                        >
                          + Add another mistake
                        </button>
                      </div>
                    </div>

                    {/* Improvement Areas */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Target className="mr-2 h-5 w-5 text-green-400" />
                        Where could you improve?
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {IMPROVEMENT_AREAS.map(area => (
                          <button
                            key={area}
                            onClick={() => toggleImprovementArea(area)}
                            className={`p-2 rounded-lg border text-sm transition-all ${
                              improvementAreas.includes(area)
                                ? 'border-green-400 bg-green-400/20 text-green-300'
                                : 'border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500'
                            }`}
                          >
                            {area}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Time Wasted (minutes)</label>
                    <input
                      type="number"
                      value={timeWasted}
                      onChange={(e) => setTimeWasted(Number(e.target.value))}
                      className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                      min="0"
                      max="480"
                      disabled={selectedCategories.includes('no_mistakes')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Stress Level (1-10)</label>
                    <input
                      type="range"
                      value={stressLevel}
                      onChange={(e) => setStressLevel(Number(e.target.value))}
                      className="w-full"
                      min="1"
                      max="10"
                    />
                    <div className="text-center text-white font-bold">{stressLevel}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Energy Level (1-10)</label>
                    <input
                      type="range"
                      value={energyLevel}
                      onChange={(e) => setEnergyLevel(Number(e.target.value))}
                      className="w-full"
                      min="1"
                      max="10"
                    />
                    <div className="text-center text-white font-bold">{energyLevel}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Focus Level (1-10)</label>
                    <input
                      type="range"
                      value={focusLevel}
                      onChange={(e) => setFocusLevel(Number(e.target.value))}
                      className="w-full"
                      min="1"
                      max="10"
                    />
                    <div className="text-center text-white font-bold">{focusLevel}</div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || cannotClose}
                    className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                      cannotClose
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : selectedCategories.includes('no_mistakes')
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                    }`}
                  >
                    {loading ? 'Analyzing...' : 
                     cannotClose ? 'Select at least one option above' :
                     selectedCategories.includes('no_mistakes') ? 'Great Job! Save Perfect Day 🎉' : 
                     'Generate AI Analysis 🚀'}
                  </button>
                </div>

                {cannotClose && (
                  <div className="text-center text-yellow-300 text-sm">
                    ⚠️ You must select at least one mistake category or "Nothing - Today was Fine!" to continue
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}