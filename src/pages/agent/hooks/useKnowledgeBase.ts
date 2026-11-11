import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { KnowledgeDocument } from '@/types/agent'
import { INITIAL_KNOWLEDGE_DOCS } from '@/services/mockData'

export function useKnowledgeBase() {
  const queryClient = useQueryClient()
  const [isDragging, setIsDragging] = useState(false)

  const { data: documents = [], isLoading } = useQuery<KnowledgeDocument[]>({
    queryKey: ['knowledge-docs'],
    queryFn: async () => {
      return INITIAL_KNOWLEDGE_DOCS
    },
  })

  // Simulação de upload de arquivo PDF
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const newDoc: KnowledgeDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        sizeBytes: file.size,
        sizeFormatted: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        status: 'indexando',
        uploadedAt: 'Agora mesmo',
        fileType: file.type || 'application/pdf',
      }

      return newDoc
    },
    onSuccess: (newDoc) => {
      queryClient.setQueryData<KnowledgeDocument[]>(
        ['knowledge-docs'],
        (prev = []) => [newDoc, ...prev]
      )

      // Simula finalização da indexação após 3 segundos
      setTimeout(() => {
        queryClient.setQueryData<KnowledgeDocument[]>(
          ['knowledge-docs'],
          (prev = []) =>
            prev.map((d) =>
              d.id === newDoc.id ? { ...d, status: 'processado' as const } : d
            )
        )
      }, 3500)
    },
  })

  // Exclusão de documento
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return id
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<KnowledgeDocument[]>(
        ['knowledge-docs'],
        (prev = []) => prev.filter((d) => d.id !== deletedId)
      )
    },
  })

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      uploadMutation.mutate(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      uploadMutation.mutate(file)
    }
  }

  return {
    documents,
    isLoading,
    isUploading: uploadMutation.isPending,
    isDragging,
    setIsDragging,
    handleFileDrop,
    handleFileInput,
    handleDelete: (id: string) => deleteMutation.mutate(id),
  }
}
