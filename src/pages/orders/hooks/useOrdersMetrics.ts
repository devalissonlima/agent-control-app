import { useMemo } from 'react'
import type { Order, OrdersMetrics } from '@/types/order'

export function useOrdersMetrics(orders: Order[]) {
  const metrics: OrdersMetrics = useMemo(() => {
    let completedRevenue = 0
    let inProductionRevenue = 0
    let totalRevenueToday = 0

    let pendingCount = 0
    let preparingCount = 0
    let readyCount = 0
    let completedCount = 0

    let totalPrepMinutes = 0
    let countedCompletedWithTime = 0

    for (const order of orders) {
      if (order.status === 'cancelled') continue

      totalRevenueToday += order.total

      if (order.status === 'completed') {
        completedCount++
        completedRevenue += order.total
        if (order.preparationTimeMinutes && order.preparationTimeMinutes > 0) {
          totalPrepMinutes += order.preparationTimeMinutes
          countedCompletedWithTime++
        } else if (order.completedAtTimestamp && order.createdAtTimestamp) {
          const diffMinutes = Math.max(
            5,
            Math.round((order.completedAtTimestamp - order.createdAtTimestamp) / (60 * 1000))
          )
          totalPrepMinutes += diffMinutes
          countedCompletedWithTime++
        }
      } else {
        inProductionRevenue += order.total
        if (order.status === 'pending') pendingCount++
        else if (order.status === 'preparing') preparingCount++
        else if (order.status === 'ready') readyCount++
      }
    }

    const averageTicket =
      completedCount > 0
        ? completedRevenue / completedCount
        : totalRevenueToday / Math.max(1, orders.length)

    const averagePreparationTimeMinutes =
      countedCompletedWithTime > 0
        ? Math.round(totalPrepMinutes / countedCompletedWithTime)
        : 26

    return {
      totalRevenueToday,
      completedRevenue,
      inProductionRevenue,
      pendingCount,
      preparingCount,
      readyCount,
      completedCount,
      averageTicket,
      averagePreparationTimeMinutes,
    }
  }, [orders])

  const completedOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === 'completed')
      .sort((a, b) => {
        const timeB = b.completedAtTimestamp || b.createdAtTimestamp
        const timeA = a.completedAtTimestamp || a.createdAtTimestamp
        return timeB - timeA
      })
  }, [orders])

  return {
    metrics,
    completedOrders,
  }
}
