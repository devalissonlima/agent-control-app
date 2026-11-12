import { useState, useMemo, useCallback } from 'react'
import type { Order, OrderStatus } from '@/types/order'
import { INITIAL_ORDERS } from '@/services/mockData'

export function useProductionLine() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)

  // Diálogos e Modais
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const [isManualOrderOpen, setIsManualOrderOpen] = useState(false)

  const [orderToReject, setOrderToReject] = useState<Order | null>(null)
  const [isRejectOpen, setIsRejectOpen] = useState(false)

  // Colunas ativas da Linha de Produção
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

  // Transições de etapa
  const updateOrderStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord

        const isCompleting = newStatus === 'completed'
        const now = Date.now()
        const prepTime = isCompleting
          ? Math.max(5, Math.round((now - ord.createdAtTimestamp) / (60 * 1000)))
          : ord.preparationTimeMinutes

        return {
          ...ord,
          status: newStatus,
          completedAtTimestamp: isCompleting ? now : ord.completedAtTimestamp,
          preparationTimeMinutes: prepTime,
        }
      })
    )
  }, [])

  const acceptOrder = useCallback(
    (orderId: string) => updateOrderStatus(orderId, 'preparing'),
    [updateOrderStatus]
  )

  const markAsReady = useCallback(
    (orderId: string) => updateOrderStatus(orderId, 'ready'),
    [updateOrderStatus]
  )

  const completeOrder = useCallback(
    (orderId: string) => {
      updateOrderStatus(orderId, 'completed')
      if (selectedOrderForDetails?.id === orderId) {
        setIsDetailsOpen(false)
        setSelectedOrderForDetails(null)
      }
    },
    [updateOrderStatus, selectedOrderForDetails]
  )

  const revertToPending = useCallback(
    (orderId: string) => updateOrderStatus(orderId, 'pending'),
    [updateOrderStatus]
  )

  const revertToPreparing = useCallback(
    (orderId: string) => updateOrderStatus(orderId, 'preparing'),
    [updateOrderStatus]
  )

  // Detalhes da Comanda
  const openDetails = useCallback((order: Order) => {
    setSelectedOrderForDetails(order)
    setIsDetailsOpen(true)
  }, [])

  const closeDetails = useCallback(() => {
    setIsDetailsOpen(false)
    setSelectedOrderForDetails(null)
  }, [])

  // Criação Manual de Pedido
  const openManualOrder = useCallback(() => {
    setIsManualOrderOpen(true)
  }, [])

  const closeManualOrder = useCallback(() => {
    setIsManualOrderOpen(false)
  }, [])

  const addManualOrder = useCallback(
    (newOrderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'createdAtTimestamp' | 'status'>) => {
      const highestNum = orders.reduce((acc, curr) => {
        const num = parseInt(curr.orderNumber.replace(/\D/g, ''), 10)
        return isNaN(num) ? acc : Math.max(acc, num)
      }, 1045)

      const nextNumber = `#${highestNum + 1}`
      const now = Date.now()

      const createdOrder: Order = {
        ...newOrderData,
        id: `ord-${now}`,
        orderNumber: nextNumber,
        createdAt: 'Agora mesmo',
        createdAtTimestamp: now,
        status: 'pending',
      }

      setOrders((prev) => [createdOrder, ...prev])
      setIsManualOrderOpen(false)
    },
    [orders]
  )

  // Recusa / Cancelamento
  const openReject = useCallback((order: Order) => {
    setOrderToReject(order)
    setIsRejectOpen(true)
  }, [])

  const closeReject = useCallback(() => {
    setOrderToReject(null)
    setIsRejectOpen(false)
  }, [])

  const confirmReject = useCallback(
    (reason?: string) => {
      if (!orderToReject) return
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderToReject.id
            ? {
                ...ord,
                status: 'cancelled',
                notes: reason ? `${ord.notes ? ord.notes + ' • ' : ''}[Recusado: ${reason}]` : ord.notes,
              }
            : ord
        )
      )
      closeReject()
    },
    [orderToReject, closeReject]
  )

  return {
    orders,
    pendingOrders,
    preparingOrders,
    readyOrders,
    acceptOrder,
    markAsReady,
    completeOrder,
    revertToPending,
    revertToPreparing,
    selectedOrderForDetails,
    isDetailsOpen,
    openDetails,
    closeDetails,
    isManualOrderOpen,
    openManualOrder,
    closeManualOrder,
    addManualOrder,
    orderToReject,
    isRejectOpen,
    openReject,
    closeReject,
    confirmReject,
  }
}
