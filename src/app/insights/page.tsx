import { Metadata } from 'next';
import { AIInsightsDashboard } from '@/components/ai/ai-insights-dashboard';
import DashboardLayout from '@/components/dashboard/dashboard-layout';

export const metadata: Metadata = {
  title: 'AI Insights - NEET Study Tracker',
  description: 'Get AI-powered insights and recommendations for your NEET preparation',
};

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <AIInsightsDashboard />
      </div>
    </DashboardLayout>
  );
}