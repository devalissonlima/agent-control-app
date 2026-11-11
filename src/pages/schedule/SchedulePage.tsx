import React from 'react'
import { CalendarDays } from 'lucide-react'
import { useScheduleCalendar } from './hooks/useScheduleCalendar'
import { ScheduleHeader } from './components/ScheduleHeader'
import { FullCalendarView } from './components/FullCalendarView'
import { AppointmentSheetDetails } from './components/AppointmentSheetDetails'
import { BlockTimeDialog } from './components/BlockTimeDialog'

export const SchedulePage: React.FC = () => {
  const {
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
    cancelAppointment,
    addBlockedTime,
  } = useScheduleCalendar()

  return (
    <div className="space-y-6">
      {/* 1. Topo da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Agenda & Gestão de Horários
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Visualização de agendamentos automatizados pelo agente de IA e bloqueio de horários com FullCalendar
            </p>
          </div>
        </div>
      </div>

      {/* 2. Barra de Controle Temporal e Abas */}
      <ScheduleHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        periodTitle={periodTitle}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
        onOpenBlockModal={() => setIsBlockModalOpen(true)}
      />

      {/* 3. Visualização FullCalendar Interativa */}
      <FullCalendarView
        calendarRef={calendarRef}
        appointments={appointments}
        onSelectAppointment={openAppointment}
        onDatesSet={handleDatesSet}
      />

      {/* 4. Sheet Lateral com Detalhes do Agendamento */}
      <AppointmentSheetDetails
        isOpen={isSheetOpen}
        onClose={setIsSheetOpen}
        appointment={selectedAppointment}
        onCancelAppointment={cancelAppointment}
      />

      {/* 5. Dialog para Bloqueio de Período */}
      <BlockTimeDialog
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={addBlockedTime}
      />
    </div>
  )
}

export default SchedulePage
