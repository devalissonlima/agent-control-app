export type QuoteStatus =
  | 'pending' // Coletado pela IA ou rascunho manual (Aguardando Análise)
  | 'analyzing' // Em elaboração / calculando custos
  | 'sent' // Proposta enviada ao cliente
  | 'approved' // Proposta aceita (pode virar evento na Agenda)
  | 'declined' // Não fechou / arquivado

export interface QuoteBriefingField {
  label: string // Ex: "Tipo de Evento", "Metragem", "Local", "Restrições"
  value: string // Ex: "Casamento", "4.2m", "Chácara em Cotia", "5 vegetarianos"
}

export interface QuoteAdditionalItem {
  id: string
  name: string // Ex: "Ilha de Caipirinhas", "Cuba esculpida", "Hora extra"
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Quote {
  id: string
  code: string // Ex: "ORC-1048"
  origin: 'ai' | 'manual' // Coletado pelo bot ou criado no painel
  customerId: string
  customerName: string
  customerPhone: string

  // Objeto Comercial Principal
  serviceName: string // Ex: "Coquetel Finger Food", "Bancada Cozinha Quartzo", "Ensaio Fotográfico"
  targetDate?: string // Data pretendida para execução do serviço/evento (YYYY-MM-DD)
  location?: string // Endereço ou cidade de execução

  // Briefing Dinâmico Coletado (Universal para qualquer nicho)
  briefing: QuoteBriefingField[]

  // Composição Financeira Modular
  basePrice: number // Valor base do pacote/serviço
  additionals: QuoteAdditionalItem[] // Itens opcionais/trocas (+ ou -)
  totalEstimatedPrice: number // basePrice + soma dos adicionais

  status: QuoteStatus
  notes?: string // Observações internas do operador
  createdAt: string
  updatedAt: string
}

export type QuoteFilterTab =
  | 'all'
  | 'pending'
  | 'negotiating'
  | 'approved'
  | 'declined'

export interface QuoteFormData {
  customerName: string
  customerPhone: string
  serviceName: string
  targetDate?: string
  location?: string
  briefing: QuoteBriefingField[]
  basePrice: number
  additionals: QuoteAdditionalItem[]
  notes?: string
}
