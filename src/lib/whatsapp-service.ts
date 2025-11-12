import { Twilio } from 'twilio';

// Twilio WhatsApp configuration (free tier)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const MISTI_WHATSAPP = 'whatsapp:+919341178928';
const HUSBAND_WHATSAPP = 'whatsapp:+919330644048';
const TWILIO_WHATSAPP = 'whatsapp:+14155238886'; // Twilio sandbox number

export class WhatsAppService {
  static async sendDailyProgress(progressData: any) {
    if (!accountSid || !authToken) {
      console.log('Twilio credentials not configured, skipping WhatsApp message');
      return { success: false, error: 'Twilio not configured' };
    }
    
    const message = this.formatDailyProgressMessage(progressData);
    
    try {
      const client = new Twilio(accountSid, authToken);
      await client.messages.create({
        body: message,
        from: TWILIO_WHATSAPP,
        to: MISTI_WHATSAPP
      });
      
      const husbandMessage = this.formatHusbandUpdateMessage(progressData);
      await client.messages.create({
        body: husbandMessage,
        from: TWILIO_WHATSAPP,
        to: HUSBAND_WHATSAPP
      });
      
      return { success: true };
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return { success: false, error };
    }
  }

  static async sendMotivationalMessage(mood: number, performance: any) {
    if (!accountSid || !authToken) {
      console.log('Twilio credentials not configured, skipping WhatsApp message');
      return { success: false, error: 'Twilio not configured' };
    }
    
    const message = this.getPersonalizedMotivation(mood, performance);
    
    try {
      const client = new Twilio(accountSid, authToken);
      await client.messages.create({
        body: message,
        from: TWILIO_WHATSAPP,
        to: MISTI_WHATSAPP
      });
      return { success: true };
    } catch (error) {
      console.error('Motivation message error:', error);
      return { success: false, error };
    }
  }

  static async sendEmergencyAlert(alertData: any) {
    if (!accountSid || !authToken) {
      console.log('Twilio credentials not configured, skipping WhatsApp message');
      return { success: false, error: 'Twilio not configured' };
    }
    
    const message = `🚨 URGENT: Misti needs support!\n\n${alertData.message}\n\nPlease check on her and provide encouragement. She's working so hard for her dreams! 💕`;
    
    try {
      const client = new Twilio(accountSid, authToken);
      await client.messages.create({
        body: message,
        from: TWILIO_WHATSAPP,
        to: HUSBAND_WHATSAPP
      });
      return { success: true };
    } catch (error) {
      console.error('Emergency alert error:', error);
      return { success: false, error };
    }
  }

  private static formatDailyProgressMessage(data: any): string {
    const today = new Date().toLocaleDateString('en-IN');
    
    return `🌟 Daily Progress Report - ${today}

💕 Good ${this.getTimeOfDay()}, my beautiful Misti!

📊 Today's Achievements:
• Questions solved: ${data.questionsToday || 0}
• Study hours: ${data.studyHours || 0}h
• Subjects covered: ${data.subjectsCovered || 0}

🎯 Progress Update:
• Physics: ${data.physics || 0}% complete
• Chemistry: ${data.chemistry || 0}% complete  
• Biology: ${data.biology || 0}% complete

💪 Motivation:
${this.getDailyMotivation(data.mood)}

🏆 Next Goal: ${data.nextGoal || 'Keep pushing forward!'}

Remember: Every question brings you closer to Dr. Misti! 👩‍⚕️✨

With all my love and support! 💕`;
  }

  private static formatHusbandUpdateMessage(data: any): string {
    return `💕 Misti's Progress Update

Your amazing wife studied for ${data.studyHours || 0} hours today and solved ${data.questionsToday || 0} questions!

Mood: ${this.getMoodEmoji(data.mood)} ${data.mood}/10

${data.mood < 5 ? '⚠️ She might need extra love and encouragement today!' : '🌟 She\'s doing great! Keep supporting her dreams!'}

She's working so hard to become Dr. Misti! 👩‍⚕️💪`;
  }

  private static getPersonalizedMotivation(mood: number, performance: any): string {
    if (mood <= 3) {
      return `💕 My dear Misti,

I know today feels tough, but remember - every great doctor faced moments like this. You're not just studying, you're building the foundation of your dreams.

Take a deep breath. You've got this! 🌟

Your loving husband believes in you more than you know! 💪💕`;
    } else if (mood <= 6) {
      return `🌟 Beautiful Misti!

You're doing amazing! Every chapter you complete, every question you solve is a step closer to your white coat.

Keep that beautiful smile and remember - I'm so proud of you! 💕

Dr. Misti is coming! 👩‍⚕️✨`;
    } else {
      return `🎉 My brilliant wife!

Your energy is contagious! This is the Misti who will conquer NEET! 

Keep this momentum going - you're unstoppable when you believe in yourself!

Love you to the moon and back! 💕🚀`;
    }
  }

  private static getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  private static getDailyMotivation(mood: number): string {
    const motivations = [
      "Every question you solve today is a building block for your medical career! 🏗️",
      "Your dedication today determines your success tomorrow! 💪",
      "Small consistent efforts lead to big results! Keep going! 🌟",
      "You're not just studying - you're preparing to save lives! 👩‍⚕️",
      "Every doctor started exactly where you are now! 📚"
    ];
    
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  private static getMoodEmoji(mood: number): string {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '😊';
    return '😄';
  }
}