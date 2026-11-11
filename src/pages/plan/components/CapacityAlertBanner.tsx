import React from 'react'
import { AlertTriangle, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react'
import type { PlanCapacityStatus } from '@/types/plan'

interface CapacityAlertBannerProps {
  status: PlanCapacityStatus
  softLimitActive: boolean
  percentage: number
}

export const CapacityAlertBanner: React.FC<CapacityAlertBannerProps> = ({
  status,
  softLimitActive,
  percentage,
}) => {
  return (
    <div className="space-y-4">
      {/* Alerta Visual de Capacidade */}
      {status === 'warning' && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-900 text-sm">
                  Alerta de Capacidade: {percentage}% Atingido
                </span>
                <span className="rounded-md bg-amber-200/60 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                  Aviso Preventivo
                </span>
              </div>
              <p className="mt-0.5 text-xs text-amber-800">
                Você atingiu 80% do limite diário contratado. O{' '}
                <strong className="font-semibold">Soft Limit Pro</strong> está
                ativo, garantindo que nenhum cliente fique sem resposta.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="flex min-h-[40px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-amber-700"
          >
            <span>Fazer Upgrade de Cota</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Destaque do Soft Limit */}
      {softLimitActive && (
        <div className="flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-indigo-950">
                Proteção Soft Limit Ativa
              </p>
              <p className="text-xs text-indigo-700">
                Seu atendimento WhatsApp continua respondendo normalmente mesmo se o
                limite de 1.000 chamadas for ultrapassado no pico.
              </p>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            <Zap className="h-3 w-3" />
            Zero Quedas
          </span>
        </div>
      )}
    </div>
  )
}
