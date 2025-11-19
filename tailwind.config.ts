import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enhanced semantic color system
        background: {
          DEFAULT: '#0a0a0f',
          secondary: '#12121a',
          tertiary: '#1a1a27',
          glass: 'rgba(15, 15, 25, 0.8)',
          card: 'rgba(20, 20, 35, 0.9)',
        },
        foreground: {
          DEFAULT: '#ffffff',
          secondary: '#b4b4c7',
          tertiary: '#8a8aa3',
          muted: '#6b6b85',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          glass: 'rgba(59, 130, 246, 0.1)',
        },
        accent: {
          purple: {
            50: '#faf5ff',
            500: '#a855f7',
            600: '#9333ea',
            glass: 'rgba(168, 85, 247, 0.1)',
          },
          pink: {
            50: '#fdf2f8',
            500: '#ec4899',
            600: '#db2777',
            glass: 'rgba(236, 72, 153, 0.1)',
          },
          cyan: {
            50: '#ecfeff',
            500: '#06b6d4',
            600: '#0891b2',
            glass: 'rgba(6, 182, 212, 0.1)',
          },
        },
        success: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          glass: 'rgba(16, 185, 129, 0.1)',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          glass: 'rgba(245, 158, 11, 0.1)',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          glass: 'rgba(239, 68, 68, 0.1)',
        },
        // Glassmorphism colors
        glass: {
          white: 'rgba(255, 255, 255, 0.1)',
          black: 'rgba(0, 0, 0, 0.2)',
          primary: 'rgba(59, 130, 246, 0.1)',
          secondary: 'rgba(168, 85, 247, 0.1)',
        },
      },
      // Enhanced typography
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      // Enhanced spacing system (8px grid)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Advanced shadow system
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inset': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)',
        'neumorphic': '20px 20px 60px #0a0a0f, -20px -20px 60px #1a1a27',
        'neumorphic-inset': 'inset 20px 20px 60px #0a0a0f, inset -20px -20px 60px #1a1a27',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
        'elevation-3': '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
        'elevation-4': '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
        'elevation-5': '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
      },
      // Enhanced backdrop blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      // Advanced animations
      animation: {
        // Existing animations
        'kiss': 'kiss 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        
        // New premium animations
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s linear infinite',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
        'particle-float': 'particleFloat 8s ease-in-out infinite',
      },
      keyframes: {
        // Existing keyframes
        kiss: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
        },
        
        // New premium keyframes
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-30px) rotate(120deg)' },
          '66%': { transform: 'translateY(-15px) rotate(240deg)' },
        },
      },
      // Enhanced border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'primary-gradient': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'success-gradient': 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
        'warning-gradient': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
      },
    },
  },
  plugins: [],
}
export default config