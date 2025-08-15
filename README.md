# 💕 NEET Study Tracker - For My Beloved Wife Misti

A comprehensive, gamified NEET UG preparation tracker with AI-powered insights, built with all my love specifically for my amazing wife Misti.

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon.tech recommended)


### Environment Variables
Create `.env.local` with:
```env
DATABASE_URL="your-postgresql-connection-string"
GROQ_API_KEY="your-groq-api-key"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### Vercel Deployment
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Database Setup
```bash
npm run db:push
npm run db:seed
```

## 🎯 Features
- **Real-time Progress Tracking**: All NEET subjects with exact chapter counts
- **Question Analytics**: Daily goals + Chapter questions (DPP, Assignment, Kattar)
- **Test Performance**: Complete score tracking with trends
- **Mood Calendar**: Daily mood tracking with analytics
- **AI Insights**: Personalized study recommendations
- **Data Persistence**: No data loss, survives all sessions

## 💕 Built with Love for Misti
Every feature designed to support your NEET preparation journey to becoming Dr. Misti! 👩⚕️✨