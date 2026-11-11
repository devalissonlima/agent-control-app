import React from 'react'
import { Clock, Zap, MessageSquare } from 'lucide-react'
import type { PlanUsage } from '@/types/plan'

interface UsageProgressRadialProps {
  usage: PlanUsage
}

export const UsageProgressRadial: React.FC<UsageProgressRadialProps> = ({ usage }) => {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset =
    circumference - (usage.percentage / 100) * circumference

  // Cor do anel baseada no percentual
  const getProgressColor = () => {
    if (usage.percentage >= 95) return 'stroke-amber-600'
    if (usage.percentage >= 80) return 'stroke-amber-500'
    return 'stroke-emerald-500'
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Esquerda: Informações de Consumo */}
        <div className="space-y-4 max-w-md">
          <div>
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
              Janela Móvel de 24 Horas
            </span>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Consumo de Atendimentos
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Cada conversa iniciada por um cliente no WhatsApp consome 1 atendimento
              da sua cota diária.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {usage.usedChats24h}
              </span>
              <span className="text-base font-semibold text-slate-400">
                / {usage.totalLimit24h} conversas
              </span>
            </div>

            {/* Barra de Progresso Horizontal Auxiliar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full transition-all duration-500 ${
                  usage.percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${usage.percentage}%` }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{usage.windowResetTime}</span>
            </div>
          </div>
        </div>

        {/* Centro: Gráfico Radial SVG */}
        <div className="relative flex shrink-0 items-center justify-center">
          <svg className="h-44 w-44 -rotate-90 transform" viewBox="0 0 160 160">
            {/* Trilha de fundo */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-100"
              fill="transparent"
            />
            {/* Anel de progresso */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className={`transition-all duration-1000 ease-out ${getProgressColor()}`}
            />
          </svg>

          {/* Texto Central */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-slate-900">
              {usage.percentage}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Utilizado
            </span>
          </div>
        </div>

        {/* Direita: Métricas Rápidas Adicionais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 shrink-0">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex items-center gap-2 text-indigo-600">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Volume Mensal
              </span>
            </div>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {usage.totalMonthlyCalls.toLocaleString('pt-BR')} interações
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex items-center gap-2 text-indigo-600">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Tokens IA Processados
              </span>
            </div>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {usage.tokensConsumedK.toLocaleString('pt-BR')}k tokens
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
