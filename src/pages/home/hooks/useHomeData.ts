import { useMemo } from 'react'
import { getHours, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuthStore } from '@/stores/authStore'
import { useQuery } from '@tanstack/react-query'
import {
  INITIAL_FUNNEL_METRICS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_PLAN_USAGE,
  INITIAL_AGENT_CONFIG,
} from '@/services/mockData'

export function useHomeData() {
  const { user } = useAuthStore()

  // Consulta das métricas resumidas para a Home via React Query
  const { data: metrics } = useQuery({
    queryKey: ['home-summary'],
    queryFn: async () => {
      // Simula fetch
      return {
        activeConversations: INITIAL_FUNNEL_METRICS.startedChats24h,
        conversionsToday: INITIAL_FUNNEL_METRICS.completedConversions,
        pendingOrders: INITIAL_ORDERS.filter((o) => o.status === 'pending').length,
        totalCustomers: INITIAL_CUSTOMERS.length,
        usagePercentage: INITIAL_PLAN_USAGE.percentage,
        agentName: INITIAL_AGENT_CONFIG.name,
        agentStatus: INITIAL_AGENT_CONFIG.isActive ? 'Ativo' : 'Pausado',
      }
    },
  })

  // Saudação calculada via date-fns
  const greetingData = useMemo(() => {
    const now = new Date()
    const currentHour = getHours(now)

    let greeting: string
    if (currentHour >= 5 && currentHour < 12) {
      greeting = 'Bom dia'
    } else if (currentHour >= 12 && currentHour < 18) {
      greeting = 'Boa tarde'
    } else {
      greeting = 'Boa noite'
    }

    const formattedDate = format(now, "EEEE, dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    })

    const capitalizedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

    return {
      greeting,
      userName: user?.name?.split(' ')[0] ?? 'Gestor',
      dateString: capitalizedDate,
    }
  }, [user?.name])

  return {
    greetingData,
    metrics,
  }
}
