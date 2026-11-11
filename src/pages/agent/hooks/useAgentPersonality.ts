import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AgentConfig, AgentTone } from '@/types/agent'
import { INITIAL_AGENT_CONFIG } from '@/services/mockData'

export function useAgentPersonality() {
  const queryClient = useQueryClient()

  const { data: config, isLoading } = useQuery<AgentConfig>({
    queryKey: ['agent-config'],
    queryFn: async () => INITIAL_AGENT_CONFIG,
  })

  const [localUpdates, setLocalUpdates] = useState<Partial<AgentConfig>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  const formData: AgentConfig = {
    ...(config ?? INITIAL_AGENT_CONFIG),
    ...localUpdates,
  }

  const saveMutation = useMutation({
    mutationFn: async (updated: AgentConfig) => {
      await new Promise((resolve) => setTimeout(resolve, 350))
      return updated
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(['agent-config'], saved)
      setLocalUpdates({})
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    },
  })

  const handleToneChange = (tone: AgentTone) => {
    setLocalUpdates((prev) => ({ ...prev, tone }))
  }

  const handleChange = (
    field: keyof AgentConfig,
    value: string | boolean
  ) => {
    setLocalUpdates((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    saveMutation.mutate(formData)
  }

  return {
    formData,
    isLoading,
    isSaving: saveMutation.isPending,
    saveSuccess,
    handleChange,
    handleToneChange,
    handleSave,
  }
}
