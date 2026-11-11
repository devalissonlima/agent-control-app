import React from 'react'
import {
  ShoppingBag,
  Calendar,
  MessageCircle,
  AlertTriangle,
  Clock,
  Activity,
  User,
  ChevronDown,
  Loader2,
  Check,
} from 'lucide-react'
import type { LiveActivityEvent, LiveEventType } from '@/types/monitoring'

interface ActivityTimelineProps {
  events: LiveActivityEvent[]
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  events,
  hasMore,
  isLoadingMore,
  onLoadMore,
}) => {
  const getEventMeta = (type: LiveEventType) => {
    switch (type) {
      case 'order':
        return {
          icon: ShoppingBag,
          bgColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          badgeText: 'Novo Pedido',
          badgeClass: 'bg-emerald-50 text-emerald-700',
        }
      case 'appointment':
        return {
          icon: Calendar,
          bgColor: 'bg-indigo-50 text-indigo-600 border-indigo-200',
          badgeText: 'Agendamento',
          badgeClass: 'bg-indigo-50 text-indigo-700',
        }
      case 'faq':
        return {
          icon: MessageCircle,
          bgColor: 'bg-blue-50 text-blue-600 border-blue-200',
          badgeText: 'Dúvida Respondida',
          badgeClass: 'bg-blue-50 text-blue-700',
        }
      case 'escalation':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-50 text-amber-600 border-amber-200',
          badgeText: 'Atenção Humana',
          badgeClass: 'bg-amber-100 text-amber-800',
        }
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
      {/* Topo do Feed com Indicador e Contagem */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Feed de Atividade ao Vivo
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {events.length} registros
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ações executadas pelo bot em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Stream Ativo</span>
        </div>
      </div>

      {/* Área com Scroll Vertical Dedicado (Não estica a tela inteira) */}
      <div className="mt-4 flex-1 max-h-[500px] overflow-y-auto pr-2 space-y-5 scrollbar-thin">
        {/* Linha do Tempo Vertical */}
        <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:bottom-3 before:left-3 before:top-2 before:w-0.5 before:bg-slate-200">
          {events.map((evt) => {
            const meta = getEventMeta(evt.type)
            const Icon = meta.icon

            return (
              <div key={evt.id} className="relative group">
                {/* Ícone na linha */}
                <div
                  className={`absolute -left-6 sm:-left-8 flex h-7 w-7 items-center justify-center rounded-full border bg-white shadow-2xs transition-transform group-hover:scale-110 ${meta.bgColor}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                {/* Card do Evento */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-slate-200 hover:bg-white hover:shadow-2xs">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.badgeClass}`}
                      >
                        {meta.badgeText}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {evt.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>{evt.relativeTime}</span>
                    </div>
                  </div>

                  <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                    {evt.detail}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between border-t border-slate-100/80 pt-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">
                        {evt.customerName}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {evt.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Botão Ver Mais / Carregar Anteriores */}
        <div className="pt-2 text-center">
          {hasMore ? (
            <button
              type="button"
              disabled={isLoadingMore}
              onClick={onLoadMore}
              className="inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition active:scale-95 disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                  <span>Buscando atividades anteriores...</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  <span>Ver Mais Atividades Anteriores</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 py-1">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Início do turno alcançado. Todas as atividades exibidas.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityTimeline
