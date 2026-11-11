import React from 'react'
import {
  MessageSquare,
  Radio,
  ShoppingBag,
  CalendarCheck,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import type { LiveControlMetrics } from '@/types/monitoring'

interface LiveMetricsGridProps {
  metrics: LiveControlMetrics
}

export const LiveMetricsGrid: React.FC<LiveMetricsGridProps> = ({ metrics }) => {
  return (
    <div className="space-y-3">
      {/* Indicador Explícito da Janela de 24 Horas */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            <Clock className="h-3.5 w-3.5 text-indigo-600" />
            <span>Janela de Dados: <strong>Últimas 24 Horas</strong></span>
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">•</span>
          <span className="text-xs text-slate-500">
            Métricas e conversões consolidadas do turno em tempo real
          </span>
        </div>

        <span className="text-[11px] font-medium text-slate-400">
          Atualização contínua a cada interação
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* 1. Atendimentos (Últimas 24h) */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Atendimentos (24h)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {metrics.chatsToday.toLocaleString('pt-BR')}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Sessões iniciadas nas últimas 24h
            </p>
          </div>
        </div>

        {/* 2. Conversas em Andamento */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/50 via-white to-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Em Andamento
            </span>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-2xs">
              <Radio className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-300 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-400" />
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-extrabold tracking-tight text-indigo-950 sm:text-3xl">
                {metrics.activeNow}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100/70 px-2 py-0.5 text-[11px] font-bold text-indigo-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                Ao Vivo
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Clientes interagindo agora
            </p>
          </div>
        </div>

        {/* 3. Pedidos Efetuados (Últimas 24h) */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pedidos (24h)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {metrics.ordersTodayCount}
              </p>
              <span className="text-xs font-bold text-emerald-600">
                • R$ {metrics.ordersTodayValue.toFixed(2)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Vendas fechadas nas últimas 24h
            </p>
          </div>
        </div>

        {/* 4. Agendamentos (Últimas 24h) */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Agendamentos (24h)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {metrics.appointmentsTodayCount}
              </p>
              <span className="text-xs font-bold text-blue-600">
                reservas
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Marcados nas últimas 24h
            </p>
          </div>
        </div>

        {/* 5. Precisam de Atenção */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-5 shadow-2xs transition-colors ${
            metrics.attentionNeededCount > 0
              ? 'border-amber-300 bg-amber-50/40 ring-1 ring-amber-300/30'
              : 'border-slate-200/90 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                metrics.attentionNeededCount > 0
                  ? 'text-amber-800'
                  : 'text-slate-500'
              }`}
            >
              Atenção Humana
            </span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                metrics.attentionNeededCount > 0
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <p
                className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
                  metrics.attentionNeededCount > 0
                    ? 'text-amber-950'
                    : 'text-slate-900'
                }`}
              >
                {metrics.attentionNeededCount}
              </p>
              {metrics.attentionNeededCount > 0 && (
                <span className="rounded-full bg-amber-200/70 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                  Aguardando
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {metrics.attentionNeededCount > 0
                ? 'Clientes pediram atendente'
                : 'Zero chamados pendentes'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveMetricsGrid
