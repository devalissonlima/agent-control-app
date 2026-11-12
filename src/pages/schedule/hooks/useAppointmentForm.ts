import { useState } from 'react'
import type { Appointment, AppointmentFormData } from '@/types/schedule'

export interface UseAppointmentFormParams {
  initialAppointment?: Appointment | null
  slotPrefill?: { date: string; startTime: string } | null
  onSave: (data: AppointmentFormData) => void
  onClose: () => void
}

/**
 * Calcula o horário de término com base no horário de início e duração em minutos
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  if (!startTime || !startTime.includes(':')) return startTime
  const [hStr, mStr] = startTime.split(':')
  const hours = parseInt(hStr, 10)
  const minutes = parseInt(mStr, 10)
  if (isNaN(hours) || isNaN(minutes)) return startTime

  const totalMinutes = (hours * 60 + minutes + durationMinutes) % (24 * 60)
  const endH = Math.floor(totalMinutes / 60)
  const endM = totalMinutes % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

/**
 * Calcula a duração em minutos entre dois horários HH:mm
 */
export function calculateDuration(startTime: string, endTime: string): number {
  if (!startTime?.includes(':') || !endTime?.includes(':')) return 60
  const [sh, sm] = startTime.split(':').map((v) => parseInt(v, 10))
  const [eh, em] = endTime.split(':').map((v) => parseInt(v, 10))
  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 60

  const diff = (eh * 60 + em) - (sh * 60 + sm)
  return diff > 0 ? diff : 60
}

export const DURATION_OPTIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hora', value: 60 },
  { label: '1h 30m', value: 90 },
  { label: '2 horas', value: 120 },
]

export const COMMON_SERVICES = [
  { name: 'Corte de Cabelo', price: 45 },
  { name: 'Corte e Barba', price: 80 },
  { name: 'Barba Terapia', price: 40 },
  { name: 'Manicure e Pedicure', price: 65 },
  { name: 'Design de Sobrancelhas', price: 50 },
  { name: 'Consulta / Avaliação', price: 150 },
  { name: 'Sessão de Massoterapia', price: 120 },
]

export const TEAM_MEMBERS = [
  'Carlos Barbeiro',
  'Mariana Silva (Estética)',
  'Dr. André Oliveira',
  'Lucas Fernandes',
  'Geral / Sem preferência',
]

export function useAppointmentForm({
  initialAppointment,
  slotPrefill,
  onSave,
  onClose,
}: UseAppointmentFormParams) {
  const isEditing = Boolean(initialAppointment?.id)

  const [customerName, setCustomerName] = useState(() => initialAppointment?.customerName || '')
  const [customerPhone, setCustomerPhone] = useState(() => initialAppointment?.customerPhone || '')
  const [serviceName, setServiceName] = useState(() => initialAppointment?.serviceName || '')
  const [price, setPrice] = useState<number>(() => initialAppointment?.price ?? 60)
  const [date, setDate] = useState(() => {
    if (initialAppointment?.date) return initialAppointment.date
    if (slotPrefill?.date) return slotPrefill.date
    return new Date().toISOString().slice(0, 10)
  })
  const [startTime, setStartTime] = useState(() => {
    if (initialAppointment?.startTime) return initialAppointment.startTime
    if (slotPrefill?.startTime) return slotPrefill.startTime
    return '09:00'
  })
  const [durationMinutes, setDurationMinutes] = useState(() => {
    if (initialAppointment?.durationMinutes) return initialAppointment.durationMinutes
    if (initialAppointment?.startTime && initialAppointment?.endTime) {
      return calculateDuration(initialAppointment.startTime, initialAppointment.endTime)
    }
    return 60
  })
  const [endTime, setEndTime] = useState(() => {
    if (initialAppointment?.endTime) return initialAppointment.endTime
    const start = slotPrefill?.startTime || '09:00'
    return calculateEndTime(start, 60)
  })
  const [professional, setProfessional] = useState(() => initialAppointment?.professional || '')
  const [notes, setNotes] = useState(() => initialAppointment?.notes || '')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Ajusta o endTime quando startTime ou durationMinutes mudam
  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime)
    const newEnd = calculateEndTime(newStartTime, durationMinutes)
    setEndTime(newEnd)
  }

  const handleDurationChange = (newDuration: number) => {
    setDurationMinutes(newDuration)
    const newEnd = calculateEndTime(startTime, newDuration)
    setEndTime(newEnd)
  }

  const handleEndTimeChange = (newEndTime: string) => {
    setEndTime(newEndTime)
    const calculated = calculateDuration(startTime, newEndTime)
    if (calculated > 0) {
      setDurationMinutes(calculated)
    }
  }

  // Selecionar serviço pré-definido preenche o preço sugerido
  const handleSelectPredefinedService = (name: string) => {
    setServiceName(name)
    const found = COMMON_SERVICES.find((s) => s.name === name)
    if (found) {
      setPrice(found.price)
    }
  }

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!customerName.trim()) {
      newErrors.customerName = 'Informe o nome do cliente'
    }

    const cleanDigits = customerPhone.replace(/\D/g, '')
    if (!customerPhone.trim() || cleanDigits.length < 10) {
      newErrors.customerPhone = 'Informe um WhatsApp válido com DDD'
    }

    if (!serviceName.trim()) {
      newErrors.serviceName = 'Informe ou selecione o serviço'
    }

    if (!date) {
      newErrors.date = 'Selecione a data'
    }

    if (!startTime) {
      newErrors.startTime = 'Horário inicial obrigatório'
    }

    if (!endTime) {
      newErrors.endTime = 'Horário final obrigatório'
    }

    if (price < 0 || isNaN(price)) {
      newErrors.price = 'Preço inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validate()) return

    const data: AppointmentFormData = {
      id: initialAppointment?.id,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      serviceName: serviceName.trim(),
      price: Number(price) || 0,
      date,
      startTime,
      endTime,
      durationMinutes,
      professional: professional.trim() || undefined,
      notes: notes.trim() || undefined,
      status: initialAppointment?.status || 'confirmed',
      origin: initialAppointment?.origin || 'manual',
    }

    onSave(data)
    onClose()
  }

  return {
    isEditing,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    serviceName,
    setServiceName,
    price,
    setPrice,
    date,
    setDate,
    startTime,
    handleStartTimeChange,
    endTime,
    handleEndTimeChange,
    durationMinutes,
    handleDurationChange,
    professional,
    setProfessional,
    notes,
    setNotes,
    errors,
    handleSubmit,
    handleSelectPredefinedService,
  }
}
