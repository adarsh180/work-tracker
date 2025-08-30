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

Write a powerful, personalized motivation message for Misti. Be encouraging, specific, and mention her progress toward becoming Dr. Misti. Use HTML formatting with <strong>, <em>, and <ul><li> tags. Keep it under 200 words.
`

    const schedulePlannerPrompt = `
Create a detailed 7-day study schedule for Misti based on:
- Current AIR Prediction: ${predictedAIR}
- Weak Subjects: ${data.weakAreas.join(', ') || 'Balanced across all'}
- Strong Subjects: ${data.strongAreas.join(', ') || 'Building foundation'}
- Daily Question Target: 300+
- Recent Performance: ${Math.round(data.averageTestScore)}/720

Provide a day-by-day breakdown with specific hours, subjects, and question targets. Use HTML formatting with <strong>, <table>, <tr>, <td> tags for better presentation. Include break times and revision slots.
`

    const weakAreaPrompt = `
Analyze Misti's weak areas and provide actionable solutions:
- Identified Weak Areas: ${data.weakAreas.join(', ') || 'Overall improvement needed'}
- Recent Test Scores: ${data.testPerformances.slice(0, 5).map(t => t.score).join(', ')}
- Subject Completion: Physics, Chemistry, Biology analysis needed

Provide specific strategies for each weak area, recommended resources, practice patterns, and timeline for improvement. Use HTML formatting with <h4>, <ul>, <li>, <strong> tags.
`

    const strategicPrompt = `
Based on Misti's comprehensive data, provide strategic suggestions for achieving AIR under 50:
- Current AIR: ${predictedAIR}
- Days to NEET: ${Math.ceil((new Date('2026-05-03').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
- Consistency Score: ${Math.round(data.consistencyScore)}%

Provide specific, actionable strategies covering study methods, test-taking, revision techniques, and performance optimization. Use HTML formatting for clarity.
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
      motivation: motivationResponse.choices[0]?.message?.content || 'Keep pushing forward, Dr. Misti! 💪',
      schedulePlanner: scheduleResponse.choices[0]?.message?.content || 'Detailed schedule coming soon...',
      weakAreaAnalysis: weakAreaResponse.choices[0]?.message?.content || 'Analysis in progress...',
      strategicSuggestions: strategicResponse.choices[0]?.message?.content || 'Strategic insights loading...',
      timelineOptimization: 'Timeline optimization based on your current progress and NEET 2026 target.'
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