import React from 'react'
import type { Order } from '@/types/order'
import { OrderColumn } from './OrderColumn'

interface OrdersKanbanProps {
  pendingOrders: Order[]
  preparingOrders: Order[]
  readyOrders: Order[]
  onAccept: (orderId: string) => void
  onReject: (order: Order) => void
  onMarkReady: (orderId: string) => void
  onRevertToPending: (orderId: string) => void
  onRevertToPreparing: (orderId: string) => void
  onComplete: (orderId: string) => void
}

export const OrdersKanban: React.FC<OrdersKanbanProps> = ({
  pendingOrders,
  preparingOrders,
  readyOrders,
  onAccept,
  onReject,
  onMarkReady,
  onRevertToPending,
  onRevertToPreparing,
  onComplete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
      {/* 1. Coluna Novos / Pendentes */}
      <OrderColumn
        id="pending"
        title="Novos / Pendentes"
        subtitle="Chegaram da IA no WhatsApp"
        orders={pendingOrders}
        onAccept={onAccept}
        onReject={onReject}
      />

      {/* 2. Coluna Em Preparo */}
      <OrderColumn
        id="preparing"
        title="Em Preparo"
        subtitle="Na cozinha / embalando"
        orders={preparingOrders}
        onMarkReady={onMarkReady}
        onRevertToPending={onRevertToPending}
      />

      {/* 3. Coluna Pronto / Despachado */}
      <OrderColumn
        id="ready"
        title="Pronto / Despachado"
        subtitle="Aguardando entrega ou retirada"
        orders={readyOrders}
        onComplete={onComplete}
        onRevertToPreparing={onRevertToPreparing}
      />
    </div>
  )
}
