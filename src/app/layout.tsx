import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthSessionProvider from '@/components/providers/session-provider'
import QueryProvider from '@/components/providers/query-client-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NEET Study Tracker - Dedicated to My Beloved Wife ❤️',
  description: 'Comprehensive NEET UG preparation tracker with AI-powered insights - Made with love for my wife',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthSessionProvider>
          <QueryProvider>
            <div className="min-h-screen bg-background text-foreground">
              {children}
            </div>
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}