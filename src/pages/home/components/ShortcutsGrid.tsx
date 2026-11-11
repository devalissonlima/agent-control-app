import React from 'react'
import { Link } from 'react-router-dom'
import {
  Bot,
  Activity,
  Users,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react'

interface ShortcutsGridProps {
  metrics?: {
    activeConversations: number
    conversionsToday: number
    pendingOrders: number
    totalCustomers: number
    usagePercentage: number
    agentName: string
    agentStatus: string
  }
}

export const ShortcutsGrid: React.FC<ShortcutsGridProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Meu Agente',
      description: 'Personalidade, regras da marca e base de conhecimento RAG.',
      path: '/meu-agente',
      icon: Bot,
      color: 'bg-indigo-50 text-indigo-600',
      tag: 'Configuração',
      highlight: `${metrics?.agentStatus ?? 'Ativo'} • ${metrics?.agentName ?? 'Sara'}`,
      badgeIcon: ShieldCheck,
    },
    {
      title: 'Acompanhamento',
      description: 'Funil de conversão, Kanban de pedidos e agenda de serviços.',
      path: '/acompanhamento',
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-600',
      tag: 'Operação',
      highlight: `${metrics?.conversionsToday ?? 94} conversões concluídas hoje`,
      badgeIcon: TrendingUp,
    },
    {
      title: 'Clientes',
      description: 'Mini-CRM com histórico de pedidos, contatos e preferências.',
      path: '/clientes',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      tag: 'CRM Inteligente',
      highlight: `${metrics?.totalCustomers ?? 5} contatos capturados no WhatsApp`,
      badgeIcon: Clock,
    },
    {
      title: 'Meu Plano',
      description: 'Acompanhamento de consumo 24h e limite contratado.',
      path: '/meu-plano',
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-600',
      tag: 'Capacidade',
      highlight: `${metrics?.usagePercentage ?? 85}% consumido (Soft Limit ativo)`,
      badgeIcon: Zap,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          Atalhos do Sistema & Módulos
        </h2>
        <span className="text-xs font-medium text-slate-400">
          Acesso rápido às áreas operacionais
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          const BadgeIcon = card.badgeIcon
          return (
            <Link
              key={card.path}
              to={card.path}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-all duration-150 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {card.tag}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-indigo-600">
                  {card.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {card.description}
                </p>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <BadgeIcon className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{card.highlight}</span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Acessar módulo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
