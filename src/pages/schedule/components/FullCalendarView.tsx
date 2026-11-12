import React, { useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventContentArg, EventClickArg } from '@fullcalendar/core'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import { Lock, Clock, MessageCircle, UserCheck } from 'lucide-react'
import type { Appointment } from '@/types/schedule'
import { formatCurrency } from '@/utils/formatters'
import './fullcalendar.css'

interface FullCalendarViewProps {
  calendarRef: React.RefObject<FullCalendar | null>
  appointments: Appointment[]
  onSelectAppointment: (appointment: Appointment) => void
  onDatesSet?: (arg: { view: { title: string; type: string } }) => void
  onSlotClick?: (date: string, startTime: string) => void
}

export const FullCalendarView: React.FC<FullCalendarViewProps> = ({
  calendarRef,
  appointments,
  onSelectAppointment,
  onDatesSet,
  onSlotClick,
}) => {
  // Converte a lista de Appointment para o formato do FullCalendar
  const events = useMemo(() => {
    return appointments.map((apt) => ({
      id: apt.id,
      title: apt.serviceName,
      start: `${apt.date}T${apt.startTime}:00`,
      end: `${apt.date}T${apt.endTime}:00`,
      extendedProps: {
        appointment: apt,
      },
    }))
  }, [appointments])

  const handleEventClick = (info: EventClickArg) => {
    info.jsEvent.preventDefault()
    const apt = info.event.extendedProps.appointment as Appointment
    if (apt) {
      onSelectAppointment(apt)
    }
  }

  const handleDateClick = (info: { dateStr: string }) => {
    const date = info.dateStr.slice(0, 10)
    let startTime = '09:00'
    if (info.dateStr.includes('T')) {
      startTime = info.dateStr.slice(11, 16)
    }
    if (onSlotClick) {
      onSlotClick(date, startTime)
    }
  }

  // Renderização customizada dos cards de eventos do FullCalendar
  const renderEventContent = (eventInfo: EventContentArg) => {
    const apt = eventInfo.event.extendedProps.appointment as Appointment
    if (!apt) return null

    const isBlocked = apt.status === 'blocked'
    const isMonthView = eventInfo.view.type === 'dayGridMonth'
    const isManual = apt.origin === 'manual' || apt.channel === 'manual'

    // Estilos visuais por status
    const getStatusStyles = () => {
      switch (apt.status) {
        case 'confirmed':
          return {
            month: isManual
              ? 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200'
              : 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200',
            time: isManual
              ? 'bg-slate-50/95 text-slate-900 border-slate-300 hover:bg-slate-100/90 hover:border-slate-400'
              : 'bg-blue-50/95 text-blue-950 border-blue-200 hover:bg-blue-100/90 hover:border-blue-300',
          }
        case 'pending':
          return {
            month: 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200',
            time: 'bg-amber-50/95 text-amber-950 border-amber-200 hover:bg-amber-100/90 hover:border-amber-300',
          }
        case 'blocked':
          return {
            month: 'bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300',
            time: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200/90',
          }
        case 'cancelled':
          return {
            month: 'bg-rose-100 text-rose-800 border-rose-200 line-through opacity-60',
            time: 'bg-rose-50/80 text-rose-800 border-rose-200 line-through opacity-60',
          }
      }
    }

    const styles = getStatusStyles()

    // 1. Renderização Compacta na Visão Mensal (Pílulas estilo Apple Calendar / Outlook)
    if (isMonthView) {
      return (
        <div
          className={`w-full truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium border flex items-center gap-1 transition shadow-2xs cursor-pointer ${styles.month}`}
        >
          {isBlocked ? (
            <Lock className="h-2.5 w-2.5 shrink-0" />
          ) : (
            <span className="font-bold shrink-0">{apt.startTime}</span>
          )}
          <span className="truncate">
            {apt.serviceName}
            {!isBlocked && ` - ${apt.customerName.split(' ')[0]}`}
          </span>
        </div>
      )
    }

    // 2. Renderização Rica na Visão Semanal e Diária (Cards com detalhes operacionais)
    return (
      <div
        className={`h-full w-full rounded-xl border p-2 flex flex-col justify-between overflow-hidden shadow-2xs transition cursor-pointer ${styles.time}`}
      >
        {/* Header do Card */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 font-bold text-xs">
            {isBlocked ? (
              <Lock className="h-3 w-3 shrink-0" />
            ) : (
              <Clock className="h-3 w-3 shrink-0" />
            )}
            <span>
              {apt.startTime} - {apt.endTime}
            </span>
          </div>

          {!isBlocked && (
            <span className="font-mono text-[10px] font-bold shrink-0">
              {formatCurrency(apt.price)}
            </span>
          )}
        </div>

        {/* Informações Centrais */}
        <div className="min-w-0 my-0.5">
          <p className="font-semibold text-xs truncate leading-tight">
            {apt.serviceName}
          </p>
          {!isBlocked && (
            <p className="text-[11px] opacity-80 truncate">
              {apt.customerName}
            </p>
          )}
        </div>

        {/* Rodapé Operacional */}
        {!isBlocked && (
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60 opacity-80">
            <span className="truncate">{apt.professional || 'Profissional IA'}</span>
            {isManual ? (
              <span className="flex items-center gap-0.5 font-semibold text-slate-700 shrink-0">
                <UserCheck className="h-2.5 w-2.5" /> Manual
              </span>
            ) : (
              <span className="flex items-center gap-0.5 font-semibold text-emerald-700 shrink-0">
                <MessageCircle className="h-2.5 w-2.5" /> WhatsApp
              </span>
            )}
          </div>
        )}

        {isBlocked && (
          <p className="text-[10px] text-slate-500 truncate italic">
            {apt.blockReason || 'Período indisponível'}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs p-3 sm:p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate="2026-11-11"
        headerToolbar={false} // Controlado pelo nosso ScheduleHeader
        locale={ptBrLocale}
        events={events}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
        scrollTime="07:00:00"
        allDaySlot={false}
        nowIndicator={true}
        height="700px"
        expandRows={true}
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
        datesSet={onDatesSet}
      />
    </div>
  )
}
