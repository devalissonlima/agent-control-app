export type AgentTone = 'formal' | 'descontraido' | 'vendedor' | 'empatico'

export interface AgentConfig {
  name: string
  tone: AgentTone
  systemPrompt: string
  brandRules: string
  welcomeMessage: string
  isActive: boolean
}

export type DocumentStatus = 'processado' | 'indexando' | 'erro'

export interface KnowledgeDocument {
  id: string
  name: string
  sizeBytes: number
  sizeFormatted: string
  status: DocumentStatus
  uploadedAt: string
  fileType: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
  updatedAt: string
}
