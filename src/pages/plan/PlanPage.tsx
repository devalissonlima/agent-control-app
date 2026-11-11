import React from 'react'
import { UsageProgressRadial } from './components/UsageProgressRadial'
import { CapacityAlertBanner } from './components/CapacityAlertBanner'
import { PlanFeaturesCard } from './components/PlanFeaturesCard'
import { usePlanMetrics } from './hooks/usePlanMetrics'

export const PlanPage: React.FC = () => {
  const { usage, planDetails, isLoading } = usePlanMetrics()

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white" />
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Meu Plano & Consumo
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          Acompanhe o consumo da janela de 24 horas, status de capacidade e detalhes
          do plano ativo
        </p>
      </div>

      {/* Alerta de Capacidade (80% ou Soft Limit) */}
      <CapacityAlertBanner
        status={usage.status}
        softLimitActive={usage.softLimitActive}
        percentage={usage.percentage}
      />

      {/* Gráfico Radial com Consumo 24h */}
      <UsageProgressRadial usage={usage} />

      {/* Detalhes do Plano Contratado e Upgrade */}
      <PlanFeaturesCard planDetails={planDetails} />
    </div>
  )
}

export default PlanPage
