'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ChartBarIcon, 
  CalendarDaysIcon, 
  LightBulbIcon,
  HomeIcon,
  AcademicCapIcon,
  FlagIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    description: 'Overview and progress'
  },
  {
    name: 'Daily Goals',
    href: '/daily-goals',
    icon: FlagIcon,
    description: 'Track daily progress'
  },
  {
    name: 'Tests',
    href: '/tests',
    icon: AcademicCapIcon,
    description: 'Performance analytics'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: ChartBarIcon,
    description: 'Question insights'
  },
  {
    name: 'Mood Calendar',
    href: '/mood',
    icon: CalendarDaysIcon,
    description: 'Daily mood tracking'
  },
  {
    name: 'AI Insights',
    href: '/insights',
    icon: LightBulbIcon,
    description: 'Smart recommendations'
  },
  {
    name: 'Achievements',
    href: '/achievements',
    icon: TrophyIcon,
    description: 'Badges & rewards'
  }
]

export default function MainNavigation() {
  const pathname = usePathname()

  return (
    <nav className="glass-effect rounded-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group relative p-4 rounded-lg transition-all duration-200 hover:scale-105
                ${isActive 
                  ? 'bg-primary/20 border border-primary/50 text-primary' 
                  : 'bg-background-secondary/50 border border-gray-700 text-gray-300 hover:bg-primary/10 hover:border-primary/30 hover:text-primary'
                }
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="text-sm font-medium">
                    {item.name}
                  </div>
                  <div className="text-xs opacity-70">
                    {item.description}
                  </div>
                </div>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}