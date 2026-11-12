export type AppointmentStatus =
  | 'confirmed' // Confirmado pelo Bot / Confirmado
  | 'pending' // Pendente
  | 'cancelled' // Cancelado
  | 'blocked' // Bloqueado (Folga, Almoço, Consulta, etc.)

export type AppointmentOrigin = 'ai' | 'manual'

export interface Appointment {
  id: string
  date: string // Formato YYYY-MM-DD
  startTime: string // Formato HH:mm (ex: "14:30")
  endTime: string // Formato HH:mm (ex: "15:30")
  customerName: string
  customerPhone: string
  serviceName: string
  professional?: string
  employeeOrResource?: string
  price: number
  status: AppointmentStatus
  notes?: string
  channel: 'whatsapp' | 'manual'
  origin?: AppointmentOrigin
  durationMinutes?: number
  blockReason?: string
}

export type ScheduleViewMode = 'day' | 'week' | 'month'

export interface BlockTimeFormData {
  date: string
  startTime: string
  endTime: string
  reason: string
}

export interface AppointmentFormData {
  id?: string
  customerName: string
  customerPhone: string
  serviceName: string
  price: number
  date: string
  startTime: string
  endTime: string
  durationMinutes: number
  professional?: string
  notes?: string
  status?: AppointmentStatus
  origin?: AppointmentOrigin
}
