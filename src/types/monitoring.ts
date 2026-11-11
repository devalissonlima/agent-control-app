export interface FunnelMetrics {
  startedChats24h: number
  completedConversions: number
  conversionRate: number
  averageResponseSeconds: number
  previousPeriodGrowth: number
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  inStock: boolean
  description?: string
}

export interface Collaborator {
  id: string
  name: string
  role: string
  avatarUrl?: string
  active: boolean
  availableHours: string
}

/* ========================================================================
   NOVAS TIPAGENS: TORRE DE CONTROLE & MONITORAMENTO EM TEMPO REAL
   ======================================================================== */

export interface WhatsAppConnectionState {
  isConnected: boolean
  uptime: string
  phoneNumber: string
  autoPilotActive: boolean
  lastPingAt: string
}

export interface LiveControlMetrics {
  chatsToday: number
  activeNow: number
  ordersTodayCount: number
  ordersTodayValue: number
  appointmentsTodayCount: number
  attentionNeededCount: number
  conversionsTodayCount?: number
  conversionsTodayValue?: number
}

export type LiveEventType = 'order' | 'appointment' | 'faq' | 'escalation'

export interface LiveActivityEvent {
  id: string
  type: LiveEventType
  title: string
  detail: string
  customerName: string
  relativeTime: string
  timestamp: string
}

export type EscalationStatus = 'aguardando' | 'em_atendimento' | 'resolvido'

export interface EscalationTicket {
  id: string
  customerName: string
  phone: string
  formattedPhone: string
  reason: string
  requestedAt: string
  status: EscalationStatus
}
