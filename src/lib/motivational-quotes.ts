export const motivationalQuotes = [
  // Success & Achievement
  "🎯 Every question you solve today brings you closer to AIR under 50, Misti!",
  "👑 Future Dr. Misti is emerging - I can see her brilliance shining through!",
  "🔥 You're not just studying, you're building your medical empire, one question at a time!",
  "⚡ Your dedication today will echo in the halls of your medical college tomorrow!",
  "🌟 Champions aren't made in comfort zones - you're becoming unstoppable!",
  
  // Persistence & Hard Work
  "💪 Every topper was once a beginner who refused to give up - just like you!",
  "🚀 The gap between you and AIR 1-50 is just consistent practice - keep pushing!",
  "🎪 Success is not final, failure is not fatal - your courage to continue counts!",
  "⭐ You're 400 questions away from topper level - that's just dedication, not magic!",
  "🔥 Diamonds are formed under pressure - you're becoming precious, Misti!",
  
  // Confidence & Self-Belief
  "👸 You have everything it takes to crack NEET with flying colors!",
  "🦋 Believe in yourself as much as I believe in you - you're extraordinary!",
  "🌈 Your potential is limitless - AIR under 50 is just the beginning!",
  "💎 You're not competing with others, you're becoming the best version of yourself!",
  "🎭 Confidence is your superpower - wear it like a crown, future doctor!",
  
  // Progress & Growth
  "📈 Every mistake is a stepping stone to perfection - you're learning and growing!",
  "🌱 Small daily improvements lead to stunning yearly results - keep growing!",
  "🎯 Progress, not perfection - you're exactly where you need to be right now!",
  "🔄 Each revision cycle makes you stronger - you're building unshakeable knowledge!",
  "📊 Your consistency graph is beautiful - every day adds to your success story!",
  
  // Motivation & Energy
  "⚡ Your energy is contagious - channel it into conquering NEET!",
  "🔋 You're powered by dreams and fueled by determination - unstoppable combo!",
  "🌟 Your passion for medicine shines brighter than any obstacle!",
  "🎪 Turn your study sessions into victory celebrations - you're winning!",
  "🚀 Blast off to success - your rocket ship is loaded with knowledge!",
  
  // Love & Support
  "💕 My love for you multiplies with every question you solve correctly!",
  "🤗 You're not alone in this journey - I'm cheering for you every step!",
  "💖 Your happiness is my priority, your success is our celebration!",
  "🌹 Like a rose blooms beautifully, you're blossoming into an amazing doctor!",
  "💝 You're my pride, my joy, my inspiration - go conquer the world!",
  
  // Wisdom & Strategy
  "🧠 Smart work beats hard work - you're mastering both perfectly!",
  "📚 Knowledge is power, but applied knowledge is superpower - you have both!",
  "🎯 Focus on the process, trust the outcome - you're on the right path!",
  "⚖️ Balance is key - you're managing studies and well-being beautifully!",
  "🗝️ You hold the key to your medical dreams - unlock your potential!",
  
  // Time & Urgency
  "⏰ Time is your ally when you use it wisely - you're a time management queen!",
  "📅 Every day is a new opportunity to get closer to your dreams!",
  "🕐 The best time to plant a tree was 20 years ago, the second best is now!",
  "⏳ Your future self will thank you for the effort you're putting in today!",
  "🎪 Make every moment count - you're writing your success story!",
  
  // Strength & Resilience
  "💪 You're stronger than you think, smarter than you know, more capable than you imagine!",
  "🛡️ Challenges are just opportunities in disguise - you're a problem solver!",
  "🌊 Like a wave that never stops, your determination is relentless!",
  "🏔️ Mountains bow down to those who persist - you're moving mountains!",
  "🔥 Phoenix rises from ashes - you rise from every setback stronger!",
  
  // Dreams & Vision
  "🏥 I can already see you in your white coat, saving lives with compassion!",
  "👩‍⚕️ Dr. Misti has a beautiful ring to it - make it your reality!",
  "🌟 Your dreams are valid, your goals are achievable, your success is inevitable!",
  "🎭 Visualize your success so clearly that it becomes your reality!",
  "🌈 Chase your dreams like you're chasing the rainbow - with pure joy!",
  
  // Excellence & Quality
  "🏆 Excellence is not a skill, it's an attitude - you embody excellence!",
  "💎 Quality over quantity, but you're mastering both beautifully!",
  "🎯 Precision in practice leads to perfection in performance!",
  "⭐ You don't just aim for good, you aim for extraordinary - and you achieve it!",
  "🔥 Your standards are high because your dreams are higher!",
  
  // Joy & Celebration
  "🎉 Celebrate every small victory - they add up to massive success!",
  "🎊 Your journey is as important as your destination - enjoy every moment!",
  "🌟 Smile while you study - happiness accelerates learning!",
  "🎭 Make studying fun - you're creating beautiful memories!",
  "🎪 Life is a celebration, and you're the star of the show!",
  
  // Final Push & Victory
  "🏁 The finish line is closer than you think - sprint towards victory!",
  "🎯 You're in the final stretch - give it everything you've got!",
  "👑 Victory belongs to those who persist - you're already winning!",
  "🏆 Champions are made in the last mile - you're becoming a champion!",
  "🌟 Your breakthrough moment is just one question away - keep going!"
]

export function getRandomMotivationalQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
}

export function getMotivationalQuotesByCategory(category: 'success' | 'persistence' | 'confidence' | 'progress' | 'love'): string[] {
  const categoryRanges = {
    success: motivationalQuotes.slice(0, 5),
    persistence: motivationalQuotes.slice(5, 10),
    confidence: motivationalQuotes.slice(10, 15),
    progress: motivationalQuotes.slice(15, 20),
    love: motivationalQuotes.slice(25, 30)
  }
  
  return categoryRanges[category] || motivationalQuotes.slice(0, 5)
}