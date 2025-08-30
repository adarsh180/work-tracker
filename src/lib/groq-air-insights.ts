import Groq from 'groq-sdk'
import { ComprehensiveData } from './comprehensive-data-fetcher'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export type AIInsightResponse = {
  motivation: string
  schedulePlanner: string
  weakAreaAnalysis: string
  strategicSuggestions: string
  timelineOptimization: string
}

export async function generateComprehensiveAIInsights(data: ComprehensiveData, predictedAIR: number): Promise<AIInsightResponse> {
  try {
    const motivationPrompt = `
You are Misti's personal NEET AI coach. Based on her data:
- Predicted AIR: ${predictedAIR}
- Total Questions Solved: ${data.totalQuestionsLifetime}
- Average Test Score: ${Math.round(data.averageTestScore)}/720
- Consistency: ${Math.round(data.consistencyScore)}%
- Weak Areas: ${data.weakAreas.join(', ') || 'None identified'}
- Strong Areas: ${data.strongAreas.join(', ') || 'Building momentum'}

Write a powerful, personalized motivation message for Misti. Be encouraging, specific, and mention her progress toward becoming Dr. Misti. 

Format your response with proper HTML styling:
- Use <div class="mb-4 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20"> for main container
- Use <h3 class="text-lg font-bold text-pink-300 mb-3 flex items-center"><span class="mr-2">💪</span>Personal Message for Dr. Misti</h3> for heading
- Use <p class="text-gray-300 leading-relaxed mb-3"> for paragraphs
- Use <strong class="text-white"> for emphasis
- Use <em class="text-pink-300"> for highlights
- Use <ul class="list-none space-y-2 mt-3"> and <li class="flex items-start"><span class="text-pink-400 mr-2">✨</span><span class="text-gray-300"> for lists

Keep it under 200 words but make it visually appealing.
`

    const schedulePlannerPrompt = `
Create a detailed 7-day study schedule for Misti based on:
- Current AIR Prediction: ${predictedAIR}
- Weak Subjects: ${data.weakAreas.join(', ') || 'Balanced across all'}
- Strong Subjects: ${data.strongAreas.join(', ') || 'Building foundation'}
- Daily Question Target: 300+
- Recent Performance: ${Math.round(data.averageTestScore)}/720

Format your response with beautiful HTML styling:
- Use <div class="space-y-4"> for main container
- Use <div class="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-400/20"> for each day
- Use <h4 class="text-blue-300 font-semibold mb-3 flex items-center"><span class="mr-2">📅</span>Day Name</h4> for day headers
- Use <div class="grid grid-cols-1 md:grid-cols-2 gap-3"> for time slots
- Use <div class="bg-gray-800/50 p-3 rounded border-l-4 border-green-400"> for study blocks
- Use <div class="text-sm text-gray-300"><strong class="text-white">Time:</strong> 06:00-08:00</div> for time
- Use <div class="text-sm text-green-300"><strong>Subject:</strong> Physics</div> for subjects
- Use <div class="text-xs text-gray-400 mt-1">Target: 50 questions</div> for targets

Include break times and make it visually appealing.
`

    const weakAreaPrompt = `
Analyze Misti's weak areas and provide actionable solutions:
- Identified Weak Areas: ${data.weakAreas.join(', ') || 'Overall improvement needed'}
- Recent Test Scores: ${data.testPerformances.slice(0, 5).map(t => t.score).join(', ')}
- Subject Completion: Physics, Chemistry, Biology analysis needed

Format your response with comprehensive HTML styling:
- Use <div class="space-y-6"> for main container
- Use <div class="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-400/20"> for each weak area
- Use <h4 class="text-orange-300 font-bold mb-3 flex items-center"><span class="mr-2">🎯</span>Subject Name</h4> for headers
- Use <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> for strategy layout
- Use <div class="bg-gray-800/30 p-3 rounded"> for strategy boxes
- Use <h5 class="text-white font-medium mb-2 flex items-center"><span class="mr-2">💡</span>Strategy</h5> for strategy titles
- Use <ul class="space-y-1 text-sm text-gray-300"> for action items
- Use <li class="flex items-start"><span class="text-orange-400 mr-2">•</span><span> for list items
- Use <div class="mt-3 p-2 bg-orange-500/10 rounded text-xs text-orange-200"> for timelines

Provide specific, actionable strategies.
`

    const strategicPrompt = `
Based on Misti's comprehensive data, provide strategic suggestions for achieving AIR under 50:
- Current AIR: ${predictedAIR}
- Days to NEET: ${Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
- Consistency Score: ${Math.round(data.consistencyScore)}%

Format your response with premium HTML styling:
- Use <div class="space-y-6"> for main container
- Use <div class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-5 border border-green-400/20"> for strategy sections
- Use <h3 class="text-green-300 font-bold text-lg mb-4 flex items-center"><span class="mr-2">🧠</span>Strategic Roadmap to AIR < 50</h3> for main heading
- Use <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"> for strategy grid
- Use <div class="bg-gray-800/40 p-4 rounded-lg border border-green-500/30"> for strategy cards
- Use <h4 class="text-white font-semibold mb-2 flex items-center"><span class="mr-2">🚀</span>Strategy Title</h4> for card headers
- Use <p class="text-gray-300 text-sm mb-3"> for descriptions
- Use <div class="bg-green-500/10 p-2 rounded text-xs text-green-200"> for action steps
- Use <div class="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded border border-purple-400/20"> for timeline
- Use <span class="inline-block bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs mr-2"> for tags

Provide comprehensive, actionable strategies.
`

    const [motivationResponse, scheduleResponse, weakAreaResponse, strategicResponse] = await Promise.all([
      groq.chat.completions.create({
        messages: [{ role: 'user', content: motivationPrompt }],
        model: 'llama3-8b-8192',
        temperature: 0.8,
        max_tokens: 300,
      }),
      groq.chat.completions.create({
        messages: [{ role: 'user', content: schedulePlannerPrompt }],
        model: 'llama3-8b-8192',
        temperature: 0.6,
        max_tokens: 500,
      }),
      groq.chat.completions.create({
        messages: [{ role: 'user', content: weakAreaPrompt }],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 400,
      }),
      groq.chat.completions.create({
        messages: [{ role: 'user', content: strategicPrompt }],
        model: 'llama3-8b-8192',
        temperature: 0.6,
        max_tokens: 400,
      })
    ])

    return {
      motivation: motivationResponse.choices[0]?.message?.content || 
        '<div class="mb-4 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg border border-pink-400/20"><h3 class="text-lg font-bold text-pink-300 mb-3 flex items-center"><span class="mr-2">💪</span>Personal Message for Dr. Misti</h3><p class="text-gray-300 leading-relaxed">Keep pushing forward, <strong class="text-white">Dr. Misti</strong>! Every question you solve brings you closer to your dream! 💪</p></div>',
      schedulePlanner: scheduleResponse.choices[0]?.message?.content || 
        '<div class="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-400/20"><h4 class="text-blue-300 font-semibold mb-3 flex items-center"><span class="mr-2">📅</span>AI Schedule Loading...</h4><p class="text-gray-300">Detailed schedule coming soon...</p></div>',
      weakAreaAnalysis: weakAreaResponse.choices[0]?.message?.content || 
        '<div class="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-400/20"><h4 class="text-orange-300 font-bold mb-3 flex items-center"><span class="mr-2">🎯</span>Analysis in Progress</h4><p class="text-gray-300">Weak area analysis loading...</p></div>',
      strategicSuggestions: strategicResponse.choices[0]?.message?.content || 
        '<div class="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-400/20"><h3 class="text-green-300 font-bold text-lg mb-3 flex items-center"><span class="mr-2">🧠</span>Strategic Insights Loading</h3><p class="text-gray-300">Strategic insights coming soon...</p></div>',
      timelineOptimization: '<div class="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-4 border border-purple-400/20"><h4 class="text-purple-300 font-semibold mb-3 flex items-center"><span class="mr-2">⏰</span>Timeline Optimization</h4><p class="text-gray-300">Timeline optimization based on your current progress and NEET 2026 target.</p></div>'
    }
  } catch (error) {
    console.error('GROQ AI insights error:', error)
    return {
      motivation: '<strong>Keep going, Misti!</strong> Every question solved brings you closer to your dream of becoming Dr. Misti! 🎯',
      schedulePlanner: 'AI schedule planner temporarily unavailable. Focus on consistent daily practice.',
      weakAreaAnalysis: 'Weak area analysis will be available shortly. Continue balanced preparation.',
      strategicSuggestions: 'Strategic suggestions loading. Maintain current momentum!',
      timelineOptimization: 'Timeline optimization in progress...'
    }
  }
}