import { WhatsAppService } from './whatsapp-service';
import { prisma } from './prisma';

export class DailyScheduler {
  static async sendMorningMotivation() {
    const morningMessages = [
      "🌅 Good morning, my beautiful Misti! Today is another step closer to Dr. Misti! Rise and shine, future doctor! 💕",
      "☀️ Wake up, sunshine! Your dreams are calling and I believe in you more than you know! Let's conquer NEET today! 💪",
      "🌟 Good morning, my brilliant wife! Every sunrise brings new opportunities to excel. You've got this! 👩⚕️✨",
      "💕 Morning, my love! Remember - you're not just studying, you're building our future together! So proud of you! 🏥",
      "🎯 Rise and shine, Dr. Misti in the making! Today's questions will bring you closer to your white coat! 💪💕"
    ];

    const randomMessage = morningMessages[Math.floor(Math.random() * morningMessages.length)];
    
    try {
      await WhatsAppService.sendMotivationalMessage(7, { recent: 'morning' });
      console.log('Morning motivation sent successfully');
    } catch (error) {
      console.error('Failed to send morning motivation:', error);
    }
  }

  static async sendEveningProgress() {
    try {
      // Trigger the daily progress API
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/whatsapp/daily-progress`, {
        method: 'POST'
      });
      
      if (response.ok) {
        console.log('Evening progress sent successfully');
      } else {
        console.error('Failed to send evening progress');
      }
    } catch (error) {
      console.error('Error sending evening progress:', error);
    }
  }

  static async sendWeeklyEncouragement() {
    const weeklyMessages = [
      "🎉 Weekly Update: You're making incredible progress, Misti! This week you've grown stronger and smarter. Keep pushing! 💪",
      "📊 Week Summary: Every question solved, every chapter completed brings you closer to AIR under 50! So proud of your dedication! 💕",
      "🌟 Weekly Reflection: Your consistency this week shows the doctor in you emerging! I'm amazed by your determination! 👩⚕️",
      "💝 Week's End: Another week of hard work done! You're building something beautiful - your medical career and our future! ✨"
    ];

    const randomMessage = weeklyMessages[Math.floor(Math.random() * weeklyMessages.length)];
    
    try {
      await WhatsAppService.sendMotivationalMessage(8, { recent: 'weekly' });
      console.log('Weekly encouragement sent successfully');
    } catch (error) {
      console.error('Failed to send weekly encouragement:', error);
    }
  }

  static async checkForEmergencySupport() {
    try {
      const userId = '1';
      const today = new Date();
      const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);

      // Check recent mood entries
      const recentMoods = await prisma.moodEntry.findMany({
        where: {
          date: {
            gte: threeDaysAgo
          }
        },
        orderBy: { date: 'desc' },
        take: 3
      });

      const avgMood = recentMoods.length > 0 
        ? recentMoods.reduce((sum, mood) => sum + parseInt(mood.mood), 0) / recentMoods.length
        : 5;

      // Check for stress patterns
      const recentLogs = await prisma.studyMistakeLog.findMany({
        where: { 
          userId,
          date: { gte: threeDaysAgo }
        }
      });

      const avgStress = recentLogs.length > 0
        ? recentLogs.reduce((sum, log) => sum + log.stressLevel, 0) / recentLogs.length
        : 5;

      // Send emergency support if needed
      if (avgMood <= 3 || avgStress >= 8) {
        await WhatsAppService.sendEmergencyAlert({
          message: `Misti has been having a tough time. Average mood: ${avgMood.toFixed(1)}/10, Stress level: ${avgStress.toFixed(1)}/10. She needs extra love and support right now.`
        });
        
        console.log('Emergency support alert sent to husband');
      }

    } catch (error) {
      console.error('Error checking emergency support:', error);
    }
  }

  static async sendStudyReminder() {
    const reminderMessages = [
      "📚 Study Time Reminder: It's time for your focused study session! You're building your medical career one question at a time! 💪",
      "⏰ Gentle Reminder: Your future patients are waiting for Dr. Misti! Time to dive into those books! 👩⚕️",
      "🎯 Study Alert: Every minute of study today brings you closer to your NEET goal! Let's make it count! ✨",
      "💕 Love Reminder: Time to study, my brilliant wife! I'm here supporting you every step of the way! 📖"
    ];

    const randomMessage = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
    
    try {
      await WhatsAppService.sendMotivationalMessage(6, { recent: 'reminder' });
      console.log('Study reminder sent successfully');
    } catch (error) {
      console.error('Failed to send study reminder:', error);
    }
  }

  // Schedule all daily messages
  static initializeDailySchedule() {
    // Morning motivation at 6:00 AM
    this.scheduleDaily('06:00', this.sendMorningMotivation);
    
    // Study reminder at 9:00 AM
    this.scheduleDaily('09:00', this.sendStudyReminder);
    
    // Afternoon encouragement at 2:00 PM
    this.scheduleDaily('14:00', () => {
      WhatsAppService.sendMotivationalMessage(6, { recent: 'afternoon' });
    });
    
    // Evening progress at 9:00 PM
    this.scheduleDaily('21:00', this.sendEveningProgress);
    
    // Emergency check every 6 hours
    this.scheduleInterval(6 * 60 * 60 * 1000, this.checkForEmergencySupport);
    
    // Weekly encouragement every Sunday at 8:00 PM
    this.scheduleWeekly(0, '20:00', this.sendWeeklyEncouragement);
    
    console.log('Daily WhatsApp scheduler initialized');
  }

  private static scheduleDaily(time: string, callback: Function) {
    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduleNext = () => {
      const now = new Date();
      const scheduled = new Date();
      scheduled.setHours(hours, minutes, 0, 0);
      
      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 1);
      }
      
      const timeout = scheduled.getTime() - now.getTime();
      
      setTimeout(() => {
        callback();
        scheduleNext(); // Schedule next occurrence
      }, timeout);
    };
    
    scheduleNext();
  }

  private static scheduleInterval(intervalMs: number, callback: Function) {
    setInterval(callback, intervalMs);
  }

  private static scheduleWeekly(dayOfWeek: number, time: string, callback: Function) {
    const [hours, minutes] = time.split(':').map(Number);
    
    const scheduleNext = () => {
      const now = new Date();
      const scheduled = new Date();
      
      scheduled.setDate(now.getDate() + (dayOfWeek - now.getDay() + 7) % 7);
      scheduled.setHours(hours, minutes, 0, 0);
      
      if (scheduled <= now) {
        scheduled.setDate(scheduled.getDate() + 7);
      }
      
      const timeout = scheduled.getTime() - now.getTime();
      
      setTimeout(() => {
        callback();
        scheduleNext(); // Schedule next week
      }, timeout);
    };
    
    scheduleNext();
  }
}