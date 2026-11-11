import React from 'react'
import {
  Users,
  UserPlus,
  Flame,
  UserX,
} from 'lucide-react'
import type { CustomerAnalyticalMetrics } from '@/types/customer'

interface CustomerMetricsCardsProps {
  metrics: CustomerAnalyticalMetrics
}

export const CustomerMetricsCards: React.FC<CustomerMetricsCardsProps> = ({
  metrics,
}) => {
  const cards = [
    {
      title: 'Total de Contatos',
      value: metrics.totalContacts.toLocaleString('pt-BR'),
      subtitle: 'Capturados no WhatsApp',
      badge: 'Base Consolidada',
      badgeClass: 'bg-indigo-50 text-indigo-700',
      icon: Users,
      iconColor: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Novos Hoje',
      value: metrics.newToday.toLocaleString('pt-BR'),
      subtitle: 'Primeiro contato nas últimas 24h',
      badge: 'Novos Números',
      badgeClass: 'bg-emerald-50 text-emerald-700',
      icon: UserPlus,
      iconColor: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Leads Frios / Em Potencial',
      value: metrics.coldLeads.toLocaleString('pt-BR'),
      subtitle: 'Conversaram mas nunca compraram',
      badge: 'Oportunidade de Remarketing',
      badgeClass: 'bg-amber-50 text-amber-700',
      icon: Flame,
      iconColor: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Clientes Inativos (>30 dias)',
      value: metrics.inactive30Days.toLocaleString('pt-BR'),
      subtitle: 'Compraram antes, mas sumiram',
      badge: 'Ação de Reativação',
      badgeClass: 'bg-rose-50 text-rose-700',
      icon: UserX,
      iconColor: 'bg-rose-50 text-rose-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <div
            key={c.title}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {c.title}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${c.iconColor}`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {c.value}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${c.badgeClass}`}
                >
                  {c.badge}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{c.subtitle}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CustomerMetricsCards
