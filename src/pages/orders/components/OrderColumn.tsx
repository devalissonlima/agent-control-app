import React from 'react'
import type { Order, KanbanColumnId } from '@/types/order'
import { OrderCard } from './OrderCard'
import { Sparkles, ChefHat, Bike, Inbox } from 'lucide-react'

interface OrderColumnProps {
  id: KanbanColumnId
  title: string
  subtitle: string
  orders: Order[]
  onAccept?: (orderId: string) => void
  onReject?: (order: Order) => void
  onMarkReady?: (orderId: string) => void
  onRevertToPending?: (orderId: string) => void
  onRevertToPreparing?: (orderId: string) => void
  onComplete?: (orderId: string) => void
}

export const OrderColumn: React.FC<OrderColumnProps> = ({
  id,
  title,
  subtitle,
  orders,
  onAccept,
  onReject,
  onMarkReady,
  onRevertToPending,
  onRevertToPreparing,
  onComplete,
}) => {
  const getColumnStyles = () => {
    switch (id) {
      case 'pending':
        return {
          icon: Sparkles,
          headerBg: 'bg-indigo-50/70 border-indigo-200/80',
          badgeBg: 'bg-indigo-600 text-white',
          iconColor: 'text-indigo-600',
          containerBorder: 'border-indigo-100',
        }
      case 'preparing':
        return {
          icon: ChefHat,
          headerBg: 'bg-amber-50/70 border-amber-200/80',
          badgeBg: 'bg-amber-600 text-white',
          iconColor: 'text-amber-600',
          containerBorder: 'border-amber-100',
        }
      case 'ready':
        return {
          icon: Bike,
          headerBg: 'bg-emerald-50/70 border-emerald-200/80',
          badgeBg: 'bg-emerald-600 text-white',
          iconColor: 'text-emerald-600',
          containerBorder: 'border-emerald-100',
        }
    }
  }

  const styles = getColumnStyles()
  const Icon = styles.icon

  return (
    <div className={`flex flex-col rounded-2xl border ${styles.containerBorder} bg-slate-50/70 p-3 sm:p-4 min-h-[500px]`}>
      {/* Cabeçalho da Coluna */}
      <div className={`rounded-xl border p-3 mb-3.5 ${styles.headerBg} flex items-center justify-between`}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-2xs">
            <Icon className={`h-4 w-4 ${styles.iconColor}`} />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
        </div>

        <span className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold ${styles.badgeBg} shadow-2xs`}>
          {orders.length}
        </span>
      </div>

      {/* Lista de Pedidos na Coluna */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/60 p-8 text-center min-h-[220px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-2">
              <Inbox className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-600">Nenhum pedido aqui</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              A esteira está livre nesta etapa
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={onAccept}
              onReject={onReject}
              onMarkReady={onMarkReady}
              onRevertToPending={onRevertToPending}
              onRevertToPreparing={onRevertToPreparing}
              onComplete={onComplete}
            />
          ))
        )}
      </div>
    </div>
  )
}
