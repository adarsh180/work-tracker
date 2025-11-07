'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

export default function MistiDataCollectionForm() {
  const [formData, setFormData] = useState({
    // Personal Profile
    category: '',
    homeState: '',
    coachingInstitute: '',
    preparationStartDate: '',
    
    // Academic Performance
    class12Percentage: '',
    board: '',
    schoolRank: '',
    foundationStrength: '',
    
    // Current Performance
    latestMockScore: '',
    averageMockScore: '',
    bestMockScore: '',
    physicsAccuracy: '',
    chemistryAccuracy: '',
    botanyAccuracy: '',
    zoologyAccuracy: '',
    
    // Study Patterns
    dailyStudyHours: '',
    physicsHours: '',
    chemistryHours: '',
    botanyHours: '',
    zoologyHours: '',
    questionSolvingSpeed: '',
    
    // Biological Factors
    sleepHours: '',
    sleepQuality: '',
    cycleLength: '',
    energyLevel: '',
    stressLevel: '',
    
    // Learning Analytics
    retentionRate: '',
    revisionEffectiveness: '',
    weakAreas: '',
    strongAreas: '',
    improvementRate: ''
  })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-effect border-pink-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <span className="mr-2">🎯</span>
            Misti's Comprehensive Data Collection for AI Rank Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Personal Profile */}
          <motion.div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300">Personal Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Category</label>
                <select className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white">
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Home State</label>
                <input 
                  type="text" 
                  placeholder="e.g., Uttar Pradesh"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Coaching Institute</label>
                <input 
                  type="text" 
                  placeholder="e.g., Allen, Aakash, FIITJEE"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">NEET Prep Start Date</label>
                <input 
                  type="date"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Academic Performance */}
          <motion.div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300">Academic Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Class 12th PCB %</label>
                <input 
                  type="number" 
                  placeholder="e.g., 85"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Board</label>
                <select className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white">
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="State Board">State Board</option>
                  <option value="ICSE">ICSE</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Mock Test Performance */}
          <motion.div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300">Mock Test Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Latest Mock Score (/720)</label>
                <input 
                  type="number" 
                  placeholder="e.g., 580"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Average Mock Score (/720)</label>
                <input 
                  type="number" 
                  placeholder="e.g., 560"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Best Mock Score (/720)</label>
                <input 
                  type="number" 
                  placeholder="e.g., 620"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Physics Accuracy %</label>
                <input 
                  type="number" 
                  placeholder="e.g., 75"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Chemistry Accuracy %</label>
                <input 
                  type="number" 
                  placeholder="e.g., 80"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Botany Accuracy %</label>
                <input 
                  type="number" 
                  placeholder="e.g., 85"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Zoology Accuracy %</label>
                <input 
                  type="number" 
                  placeholder="e.g., 78"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Study Patterns */}
          <motion.div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300">Daily Study Patterns</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Total Study Hours/Day</label>
                <input 
                  type="number" 
                  placeholder="e.g., 8"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Physics Hours/Day</label>
                <input 
                  type="number" 
                  placeholder="e.g., 2.5"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Chemistry Hours/Day</label>
                <input 
                  type="number" 
                  placeholder="e.g., 2.5"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Botany Hours/Day</label>
                <input 
                  type="number" 
                  placeholder="e.g., 1.5"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Zoology Hours/Day</label>
                <input 
                  type="number" 
                  placeholder="e.g., 1.5"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Biological Factors */}
          <motion.div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300">Biological & Lifestyle Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Sleep Hours/Night</label>
                <input 
                  type="number" 
                  placeholder="e.g., 7"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Sleep Quality (1-10)</label>
                <input 
                  type="number" 
                  min="1" max="10"
                  placeholder="e.g., 8"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Cycle Length (days)</label>
                <input 
                  type="number" 
                  placeholder="e.g., 28"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Learning Analytics */}
          <motion.div className="space-y-4">
            <h3 className="text-lg font-semibold text-pink-300">Learning Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Weak Areas (comma separated)</label>
                <textarea 
                  placeholder="e.g., Organic Chemistry, Rotational Motion, Plant Physiology"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white h-20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Strong Areas (comma separated)</label>
                <textarea 
                  placeholder="e.g., Inorganic Chemistry, Mechanics, Human Physiology"
                  className="w-full p-3 bg-background-secondary border border-gray-600 rounded-lg text-white h-20"
                />
              </div>
            </div>
          </motion.div>

          <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all">
            🚀 Generate AI Rank Prediction for Misti
          </button>
        </CardContent>
      </Card>
    </div>
  )
}