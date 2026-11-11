export type AppointmentStatus =
  | 'confirmed' // Confirmado pelo Bot
  | 'pending' // Pendente
  | 'cancelled' // Cancelado
  | 'blocked' // Bloqueado (Folga, Almoço, Consulta, etc.)

export interface Appointment {
  id: string
  date: string // Formato YYYY-MM-DD
  startTime: string // Formato HH:mm (ex: "14:30")
  endTime: string // Formato HH:mm (ex: "15:30")
  customerName: string
  customerPhone: string
  serviceName: string
  professional?: string
  price: number
  status: AppointmentStatus
  notes?: string
  channel: 'whatsapp' | 'manual'
  blockReason?: string
}

export type ScheduleViewMode = 'day' | 'week' | 'month'

export interface BlockTimeFormData {
  date: string
  startTime: string
  endTime: string
  reason: string
}
