import React from 'react'
import {
  DollarSign,
  TrendingUp,
  Clock,
  Sparkles,
  ChefHat,
  Bike,
  CheckCheck,
  Receipt,
  MessageCircle,
  Store,
  Eye,
} from 'lucide-react'
import type { Order, OrdersMetrics } from '@/types/order'
import { formatCurrency } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'

interface OrdersOverviewTabProps {
  metrics: OrdersMetrics
  completedOrders: Order[]
  onOpenDetails: (order: Order) => void
}

export const OrdersOverviewTab: React.FC<OrdersOverviewTabProps> = ({
  metrics,
  completedOrders,
  onOpenDetails,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Grid com os 4 Cards Analíticos do Turno */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Faturamento do Turno */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Faturamento do Turno
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {formatCurrency(metrics.totalRevenueToday)}
            </p>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span className="text-emerald-700 font-medium">
                Concluídos: {formatCurrency(metrics.completedRevenue)}
              </span>
              <span className="text-amber-700 font-medium">
                Em Fila: {formatCurrency(metrics.inProductionRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Pedidos em Andamento */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pedidos em Andamento
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ChefHat className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {metrics.pendingCount + metrics.preparingCount + metrics.readyCount}
              <span className="text-xs font-semibold text-slate-400 ml-1.5 font-sans">ativos</span>
            </p>
            <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
              <span className="inline-flex items-center gap-1 text-indigo-700 font-medium">
                <Sparkles className="h-2.5 w-2.5" /> {metrics.pendingCount} Novos
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                <ChefHat className="h-2.5 w-2.5" /> {metrics.preparingCount} Cozinha
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <Bike className="h-2.5 w-2.5" /> {metrics.readyCount} Prontos
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Ticket Médio do Dia */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Ticket Médio do Dia
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {formatCurrency(metrics.averageTicket)}
            </p>
            <p className="mt-1 text-xs text-slate-500 pt-1 border-t border-slate-100 truncate">
              Média ponderada por pedido fechado
            </p>
          </div>
        </div>

        {/* Card 4: Tempo Médio de Preparo */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Tempo Médio de Preparo
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tracking-tight">
              {metrics.averagePreparationTimeMinutes}
              <span className="text-xs font-semibold text-slate-400 ml-1 font-sans">minutos</span>
            </p>
            <p className="mt-1 text-xs text-emerald-600 font-medium pt-1 border-t border-slate-100 flex items-center gap-1">
              <CheckCheck className="h-3 w-3" /> Dentro da meta de 35 min
            </p>
          </div>
        </div>
      </div>

      {/* 2. Tabela Resumo dos Pedidos Finalizados Hoje */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Receipt className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Histórico de Pedidos Finalizados Hoje ({completedOrders.length})
              </h3>
              <p className="text-xs text-slate-500">
                Auditoria de comandas já entregues ou retiradas no turno atual
              </p>
            </div>
          </div>
        </div>

        {completedOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-1">
            <Receipt className="h-8 w-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-700">Nenhum pedido finalizado ainda hoje</p>
            <p className="text-slate-400">Os pedidos concluídos na Linha de Produção aparecerão listados aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Comanda</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Canal & Tipo</th>
                  <th className="py-3 px-4">Itens Principais</th>
                  <th className="py-3 px-4 text-right">Valor Total</th>
                  <th className="py-3 px-4 text-right">Conclusão</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {completedOrders.map((order) => {
                  const completedDate = order.completedAtTimestamp
                    ? new Date(order.completedAtTimestamp)
                    : new Date(order.createdAtTimestamp)
                  const completedHour = completedDate.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onOpenDetails(order)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{order.customerName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {order.channel === 'whatsapp' ? (
                            <Badge
                              variant="outline"
                              className="border-emerald-300 bg-emerald-50 text-[10px] text-emerald-700 font-semibold gap-1 py-0 px-1.5"
                            >
                              <MessageCircle className="h-2.5 w-2.5 text-emerald-600" /> WhatsApp
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-indigo-300 bg-indigo-50 text-[10px] text-indigo-700 font-semibold gap-1 py-0 px-1.5"
                            >
                              <Store className="h-2.5 w-2.5 text-indigo-600" /> Balcão
                            </Badge>
                          )}
                          <span className="text-[11px] text-slate-500">
                            {order.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-700 font-medium">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                        {completedHour}
                        {order.preparationTimeMinutes && (
                          <span className="block text-[10px] text-emerald-600 font-sans font-semibold">
                            {order.preparationTimeMinutes} min de preparo
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onOpenDetails(order)}
                          className="inline-flex items-center justify-center h-7 px-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 text-xs font-semibold gap-1 transition"
                        >
                          <Eye className="h-3 w-3" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
