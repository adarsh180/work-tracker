# Authentication System Documentation

## Overview

The NEET Study Tracker uses NextAuth.js v4 for authentication with a custom credentials provider and Prisma adapter for database integration.

## Features

- ✅ Custom credentials-based authentication
- ✅ Session management with JWT strategy
- ✅ Protected route middleware
- ✅ Dark theme login page
- ✅ Automatic user creation on first login
- ✅ Session persistence across browser sessions
- ✅ Proper error handling and loading states

## Components

### Core Files

- `src/lib/auth.ts` - NextAuth configuration
- `middleware.ts` - Protected route middleware
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `src/app/auth/signin/page.tsx` - Custom sign-in page

### React Components

- `src/components/providers/session-provider.tsx` - Session provider wrapper
- `src/components/auth/protected-route.tsx` - Protected route wrapper
- `src/components/auth/logout-button.tsx` - Logout functionality
- `src/components/auth/auth-status.tsx` - Authentication status display

### Hooks

- `src/hooks/use-auth.ts` - Custom authentication hook

### Types

- `src/types/next-auth.d.ts` - TypeScript definitions for NextAuth

## Usage

### Protecting Routes

Routes are automatically protected by the middleware configuration. The following paths are excluded from protection:

- `/api/auth/*` - NextAuth API routes
- `/auth/signin` - Sign-in page
- Static files and images

### Using Authentication in Components

```tsx
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, isLoading, isAuthenticated } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>
  
  return <div>Welcome, {user?.name}!</div>
}
```

### Manual Route Protection

```tsx
import ProtectedRoute from '@/components/auth/protected-route'

function MyPage() {
  return (
    <ProtectedRoute>
      <div>This content is protected</div>
    </ProtectedRoute>
  )
}
```

## Configuration

### Environment Variables

Required environment variables in `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
DATABASE_URL=your-postgresql-connection-string
```

### Database Schema

The authentication system uses the following Prisma models:

- `User` - User account information
- `Account` - OAuth account linking (if needed)
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

## Security Features

- JWT-based sessions with 30-day expiration
- Secure session storage
- CSRF protection
- Automatic session refresh
- Protected API routes

## Testing

Test pages available:

- `/protected` - Test protected route functionality
- `/auth/signin` - Test sign-in flow

## Future Enhancements

- OAuth providers (Google, GitHub)
- Email verification
- Password reset functionality
- Two-factor authentication
- Role-based access control