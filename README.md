# Misti's NEET Preparation Dashboard

A comprehensive, real-time dashboard for NEET UG preparation with AI-powered insights and analytics.

## Features

### 📊 Real-time Analytics
- Interactive charts (Line, Bar, Pie) showing study progress
- Subject-wise performance tracking
- Weekly progress monitoring
- Live data updates every 30 seconds

### 🧠 AI-Powered Insights
- Personalized feedback using Groq AI
- Weak area analysis and suggestions
- Real-time performance evaluation
- Study pattern recommendations

### 📚 Subject Tracking
- **Physics** - Comprehensive topic coverage
- **Chemistry** - Organic, Inorganic, Physical
- **Botany** - Plant biology and systems
- **Zoology** - Animal biology and physiology

### 🎨 Modern UI/UX
- Smooth animations with Framer Motion
- Responsive design for all devices
- Glass morphism effects
- Gradient backgrounds and modern styling

### 💾 Real-time Database
- PostgreSQL with Neon.tech
- Live data synchronization
- Session tracking and analytics
- AI feedback storage

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **Database**: PostgreSQL (Neon.tech)
- **AI**: Groq SDK with Llama 3
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
DATABASE_URL=your_neon_connection_string
GROQ_API_KEY=your_groq_api_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Add Study Sessions**: Click "Add Session" to log your study time
2. **Track Progress**: View real-time analytics across all subjects
3. **Get AI Insights**: Receive personalized feedback and suggestions
4. **Monitor Performance**: Use interactive charts to analyze trends

## Database Schema

### study_sessions
- id (SERIAL PRIMARY KEY)
- subject (VARCHAR)
- topic (VARCHAR)
- duration (INTEGER) - in minutes
- score (INTEGER) - percentage
- date (TIMESTAMP)
- notes (TEXT)

### ai_feedback
- id (SERIAL PRIMARY KEY)
- message (TEXT)
- type (VARCHAR) - suggestion/warning/achievement
- subject (VARCHAR)
- timestamp (TIMESTAMP)

## AI Features

The dashboard uses Groq's Llama 3 model to:
- Analyze study patterns
- Identify weak areas
- Provide personalized recommendations
- Generate motivational feedback
- Suggest study strategies

## Contributing

This is a personalized dashboard for Misti's NEET preparation. Feel free to fork and adapt for your own use case.

## License

MIT License - Feel free to use and modify as needed.