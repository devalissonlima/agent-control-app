import { useState, useRef } from 'react'
import type FullCalendar from '@fullcalendar/react'
import type {
  Appointment,
  ScheduleViewMode,
  BlockTimeFormData,
  AppointmentFormData,
} from '@/types/schedule'
import { INITIAL_APPOINTMENTS } from '@/services/mockData'

export function useScheduleCalendar() {
  const calendarRef = useRef<FullCalendar | null>(null)
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('week')
  const [periodTitle, setPeriodTitle] = useState('Novembro de 2026')
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS)

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)

  // Estados do Modal de Criação / Edição de Agendamento
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [slotPrefill, setSlotPrefill] = useState<{ date: string; startTime: string } | null>(null)

  // Sincronização com a API do FullCalendar
  const handleViewModeChange = (mode: ScheduleViewMode) => {
    setViewMode(mode)
    const api = calendarRef.current?.getApi()
    if (!api) return

    if (mode === 'day') {
      api.changeView('timeGridDay')
    } else if (mode === 'week') {
      api.changeView('timeGridWeek')
    } else if (mode === 'month') {
      api.changeView('dayGridMonth')
    }
  }

  const goToToday = () => {
    const api = calendarRef.current?.getApi()
    if (api) {
      api.today()
    }
  }

  const goToPrevious = () => {
    const api = calendarRef.current?.getApi()
    if (api) {
      api.prev()
    }
  }

  const goToNext = () => {
    const api = calendarRef.current?.getApi()
    if (api) {
      api.next()
    }
  }

  const handleDatesSet = (arg: { view: { title: string; type: string } }) => {
    setPeriodTitle(arg.view.title)
    if (arg.view.type === 'timeGridDay') {
      setViewMode('day')
    } else if (arg.view.type === 'timeGridWeek') {
      setViewMode('week')
    } else if (arg.view.type === 'dayGridMonth') {
      setViewMode('month')
    }
  }

  // Abrir e fechar detalhes do agendamento
  const openAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsSheetOpen(true)
  }

  const closeAppointment = () => {
    setIsSheetOpen(false)
  }

  // Abertura do formulário de agendamento (Criação Manual ou Edição)
  const openCreateForm = (prefill?: { date: string; startTime: string }) => {
    setEditingAppointment(null)
    setSlotPrefill(prefill || null)
    setIsFormOpen(true)
  }

  const openEditForm = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setSlotPrefill(null)
    setIsSheetOpen(false) // Fecha o sheet de detalhes para abrir o dialog de edição
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingAppointment(null)
    setSlotPrefill(null)
  }

  // Ações no Agendamento
  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    )
    if (selectedAppointment?.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: 'cancelled' } : null))
    }
  }

  const saveAppointment = (data: AppointmentFormData) => {
    if (data.id) {
      // Atualizar existente
      setAppointments((prev) =>
        prev.map((apt) => {
          if (apt.id === data.id) {
            const updated: Appointment = {
              ...apt,
              customerName: data.customerName,
              customerPhone: data.customerPhone,
              serviceName: data.serviceName,
              price: data.price,
              date: data.date,
              startTime: data.startTime,
              endTime: data.endTime,
              durationMinutes: data.durationMinutes,
              professional: data.professional,
              notes: data.notes,
              status: data.status || apt.status,
            }
            if (selectedAppointment?.id === data.id) {
              setSelectedAppointment(updated)
            }
            return updated
          }
          return apt
        })
      )
    } else {
      // Criar novo manual
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMinutes: data.durationMinutes,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        serviceName: data.serviceName,
        price: data.price,
        status: 'confirmed',
        channel: 'manual',
        origin: 'manual',
        professional: data.professional,
        notes: data.notes,
      }
      setAppointments((prev) => [newAppointment, ...prev])
    }
  }

  const addBlockedTime = (data: BlockTimeFormData) => {
    const newBlocked: Appointment = {
      id: `block-${Date.now()}`,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      customerName: 'Bloqueio de Agenda',
      customerPhone: '-',
      serviceName: data.reason || 'Período Bloqueado',
      price: 0,
      status: 'blocked',
      blockReason: data.reason,
      channel: 'manual',
      origin: 'manual',
    }
    setAppointments((prev) => [...prev, newBlocked])
    setIsBlockModalOpen(false)
  }

  return {
    calendarRef,
    viewMode,
    handleViewModeChange,
    periodTitle,
    goToToday,
    goToPrevious,
    goToNext,
    handleDatesSet,
    appointments,
    selectedAppointment,
    isSheetOpen,
    setIsSheetOpen,
    isBlockModalOpen,
    setIsBlockModalOpen,
    openAppointment,
    closeAppointment,
    cancelAppointment,
    addBlockedTime,
    // Criação e edição
    isFormOpen,
    editingAppointment,
    slotPrefill,
    openCreateForm,
    openEditForm,
    closeForm,
    saveAppointment,
  }
}
