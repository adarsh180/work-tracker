'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, useEffect } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // Make query client globally available for cache invalidation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__reactQueryClient = queryClient
      
      // Initialize query invalidation service
      import('@/lib/query-invalidation-service').then(({ QueryInvalidationService }) => {
        QueryInvalidationService.setQueryClient(queryClient)
      })
    }
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}