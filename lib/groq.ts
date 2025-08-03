import Groq from 'groq-sdk';

const groq = null; // Disabled until API key is configured

export async function generateDailyQuote() {
  const quotes = [
    "Every step forward brings you closer to your medical dreams! 🩺",
    "Success is the sum of small efforts repeated day in and day out! 💪",
    "Your dedication today shapes your medical career tomorrow! 🌟",
    "NEET success requires persistence, not perfection! 📚",
    "Dream big, study hard, achieve greatness! 🎯"
  ];
  
  const today = new Date().getDate();
  return quotes[today % quotes.length];
}

export async function generateAIFeedback(studyData: any) {
  const feedback = [
    "Great progress on your NEET preparation! Focus on consistent daily practice.",
    "Your study pattern shows dedication. Consider reviewing weak topics more frequently.",
    "Excellent work! Balance your time across all four subjects for optimal results.",
    "Keep up the momentum! Regular revision will strengthen your preparation.",
    "Strong foundation building! Increase practice questions for better speed."
  ];
  
  const index = Math.floor(Math.random() * feedback.length);
  return feedback[index];
}

export async function analyzeSubjectProgress(subjectData: any) {
  const insights = [
    "Focus on consistent practice across all chapters for better retention.",
    "Strengthen your weak areas with targeted revision and more practice questions.",
    "Your progress is steady. Increase daily study hours for faster improvement.",
    "Good foundation! Work on speed and accuracy through timed practice sessions.",
    "Maintain this pace and focus on previous year questions for exam readiness."
  ];
  
  const index = Math.floor(Math.random() * insights.length);
  return insights[index];
}