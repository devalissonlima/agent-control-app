import { useState, useMemo } from 'react'
import type { Order, OrderStatus } from '@/types/order'
import { INITIAL_ORDERS } from '@/services/mockData'

export function useOrdersKanban() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [orderToReject, setOrderToReject] = useState<Order | null>(null)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  // Separar colunas ativas do Kanban
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === 'pending'),
    [orders]
  )

  const preparingOrders = useMemo(
    () => orders.filter((o) => o.status === 'preparing'),
    [orders]
  )

  const readyOrders = useMemo(
    () => orders.filter((o) => o.status === 'ready'),
    [orders]
  )

  const completedTodayOrders = useMemo(
    () => orders.filter((o) => o.status === 'completed'),
    [orders]
  )

  const cancelledTodayOrders = useMemo(
    () => orders.filter((o) => o.status === 'cancelled'),
    [orders]
  )

  // Métricas do Balcão
  const activeOrdersCount = pendingOrders.length + preparingOrders.length + readyOrders.length
  const totalRevenueToday = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, curr) => acc + curr.total, 0)
  }, [orders])

  // Transições de Status
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    )
  }

  const acceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing')
  }

  const revertToPending = (orderId: string) => {
    updateOrderStatus(orderId, 'pending')
  }

  const markAsReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready')
  }

  const revertToPreparing = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing')
  }

  const completeOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'completed')
  }

  // Diálogo de Rejeição
  const openRejectDialog = (order: Order) => {
    setOrderToReject(order)
    setIsRejectDialogOpen(true)
  }

  const closeRejectDialog = () => {
    setOrderToReject(null)
    setIsRejectDialogOpen(false)
  }

  const confirmRejectOrder = (reason?: string) => {
    if (!orderToReject) return
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderToReject.id
          ? {
              ...ord,
              status: 'cancelled',
              notes: reason ? `${ord.notes || ''} [Recusado: ${reason}]`.trim() : ord.notes,
            }
          : ord
      )
    )
    closeRejectDialog()
  }

  return {
    orders,
    pendingOrders,
    preparingOrders,
    readyOrders,
    completedTodayOrders,
    cancelledTodayOrders,
    activeOrdersCount,
    totalRevenueToday,
    acceptOrder,
    revertToPending,
    markAsReady,
    revertToPreparing,
    completeOrder,
    orderToReject,
    isRejectDialogOpen,
    openRejectDialog,
    closeRejectDialog,
    confirmRejectOrder,
    isHistoryModalOpen,
    setIsHistoryModalOpen,
  }
}
