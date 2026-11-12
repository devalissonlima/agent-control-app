import React from 'react'
import {
  Inbox,
  Send,
  TrendingUp,
  Percent,
} from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

interface QuotesMetricsCardsProps {
  newRequestsCount: number
  sentProposalsCount: number
  pipelineValue: number
  conversionRate: number
}

export const QuotesMetricsCards: React.FC<QuotesMetricsCardsProps> = ({
  newRequestsCount,
  sentProposalsCount,
  pipelineValue,
  conversionRate,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Novas Solicitações */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Novas Solicitações
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
            <Inbox className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {newRequestsCount}
            </span>
            <span className="text-xs font-medium text-amber-600">aguardando retorno</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Cotações recebidas pelo bot ou balcão
          </p>
        </div>
      </div>

      {/* 2. Propostas Enviadas */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Propostas Enviadas
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60">
            <Send className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {sentProposalsCount}
            </span>
            <span className="text-xs font-medium text-blue-600">em negociação ativa</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Com envio realizado ou em precificação
          </p>
        </div>
      </div>

      {/* 3. Valor em Negociação (Pipeline) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Valor em Negociação
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              {formatCurrency(pipelineValue)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Volume financeiro total em aberto
          </p>
        </div>
      </div>

      {/* 4. Taxa de Conversão */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Taxa de Conversão
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60">
            <Percent className="h-4.5 w-4.5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {conversionRate}%
            </span>
            <span className="text-xs font-medium text-emerald-600">de fechamento</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Propostas marcadas como aprovadas
          </p>
        </div>
      </div>
    </div>
  )
}
