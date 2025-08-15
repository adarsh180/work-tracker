'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface DppQuestionInputProps {
  chapterId: string
  dppIndex: number
  currentCount: number
  isCompleted: boolean
}

export default function DppQuestionInput({ 
  chapterId, 
  dppIndex, 
  currentCount, 
  isCompleted 
}: DppQuestionInputProps) {
  const [questionCount, setQuestionCount] = useState(currentCount || 0)
  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: async (count: number) => {
      const response = await fetch(`/api/chapters/${chapterId}/dpp-questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dppIndex, questionCount: count })
      })
      if (!response.ok) throw new Error('Failed to update')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question-analytics'] })
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      queryClient.invalidateQueries({ queryKey: ['subjects-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-analytics'] })
    }
  })

  const handleUpdate = (count: number) => {
    setQuestionCount(count)
    updateMutation.mutate(count)
  }

  if (!isCompleted) {
    return <span className="text-gray-500 text-xs">Complete DPP first</span>
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        max="100"
        value={questionCount}
        onChange={(e) => handleUpdate(parseInt(e.target.value) || 0)}
        className="w-16 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white"
        placeholder="0"
      />
      <span className="text-xs text-gray-400">questions</span>
    </div>
  )
}