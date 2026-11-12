import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Plus,
} from 'lucide-react'
import type { ScheduleViewMode } from '@/types/schedule'
import { Button } from '@/components/ui/button'

interface ScheduleHeaderProps {
  viewMode: ScheduleViewMode
  onViewModeChange: (mode: ScheduleViewMode) => void
  periodTitle: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onOpenBlockModal: () => void
  onOpenNewAppointment: () => void
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  viewMode,
  onViewModeChange,
  periodTitle,
  onPrevious,
  onNext,
  onToday,
  onOpenBlockModal,
  onOpenNewAppointment,
}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs">
      {/* 1. Controles Temporais e Título */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5">
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 transition shadow-2xs cursor-pointer"
            aria-label="Período Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-white hover:text-slate-900 transition rounded-lg cursor-pointer"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-white hover:text-slate-900 transition shadow-2xs cursor-pointer"
            aria-label="Próximo Período"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {periodTitle}
        </h2>
      </div>

      {/* 2. Seletor de Abas (Tabs) e Botões de Ação */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5">
        {/* Abas Dia / Semana / Mês */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-1">
          <button
            type="button"
            onClick={() => onViewModeChange('day')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              viewMode === 'day'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dia
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('week')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              viewMode === 'week'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semana
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('month')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              viewMode === 'month'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mês
          </button>
        </div>

        {/* Ação Rápida Bloquear Período */}
        <Button
          onClick={onOpenBlockModal}
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs flex items-center gap-1.5 h-9"
        >
          <Lock className="h-3.5 w-3.5 text-slate-500" />
          <span>Bloquear Período</span>
        </Button>

        {/* Ação Primária Global: Novo Agendamento */}
        <Button
          onClick={onOpenNewAppointment}
          size="sm"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 h-9"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </Button>
      </div>
    </div>
  )
}
