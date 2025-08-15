'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ChapterUpdate = {
  chapterId: string
  field: string
  value: any
}

type SubjectChangesContextType = {
  pendingChanges: ChapterUpdate[]
  addChange: (change: ChapterUpdate) => void
  removeChange: (chapterId: string, field: string) => void
  clearChanges: () => void
  hasChanges: boolean
  saveAllChanges: () => Promise<void>
  isSaving: boolean
}

const SubjectChangesContext = createContext<SubjectChangesContextType | undefined>(undefined)

export function useSubjectChanges() {
  const context = useContext(SubjectChangesContext)
  if (!context) {
    throw new Error('useSubjectChanges must be used within a SubjectChangesProvider')
  }
  return context
}

interface SubjectChangesProviderProps {
  children: ReactNode
  onSaveComplete?: () => void
}

export function SubjectChangesProvider({ children, onSaveComplete }: SubjectChangesProviderProps) {
  const [pendingChanges, setPendingChanges] = useState<ChapterUpdate[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const addChange = useCallback((change: ChapterUpdate) => {
    setPendingChanges(prev => {
      // Remove existing change for the same field
      const filtered = prev.filter(c => !(c.chapterId === change.chapterId && c.field === change.field))
      return [...filtered, change]
    })
  }, [])

  const removeChange = useCallback((chapterId: string, field: string) => {
    setPendingChanges(prev => prev.filter(c => !(c.chapterId === chapterId && c.field === field)))
  }, [])

  const clearChanges = useCallback(() => {
    setPendingChanges([])
  }, [])

  const saveAllChanges = useCallback(async () => {
    if (pendingChanges.length === 0) return

    setIsSaving(true)
    try {
      // Group changes by chapter
      const changesByChapter = pendingChanges.reduce((acc, change) => {
        if (!acc[change.chapterId]) {
          acc[change.chapterId] = {}
        }
        acc[change.chapterId][change.field] = change.value
        return acc
      }, {} as Record<string, Record<string, any>>)

      // Save all changes in parallel
      const savePromises = Object.entries(changesByChapter).map(([chapterId, updates]) =>
        fetch(`/api/chapters/${chapterId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
      )

      const results = await Promise.all(savePromises)
      
      // Check if all saves were successful
      const failedSaves = results.filter(r => !r.ok)
      if (failedSaves.length > 0) {
        throw new Error(`Failed to save ${failedSaves.length} chapters`)
      }

      clearChanges()
      
      // Invalidate all queries for real-time updates
      const queryClient = (await import('@tanstack/react-query')).useQueryClient
      if (typeof window !== 'undefined') {
        window.location.reload() // Force refresh to show saved data
      }
      
      onSaveComplete?.()
    } catch (error) {
      console.error('Error saving changes:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [pendingChanges, clearChanges, onSaveComplete])

  const hasChanges = pendingChanges.length > 0

  return (
    <SubjectChangesContext.Provider value={{
      pendingChanges,
      addChange,
      removeChange,
      clearChanges,
      hasChanges,
      saveAllChanges,
      isSaving
    }}>
      {children}
    </SubjectChangesContext.Provider>
  )
}