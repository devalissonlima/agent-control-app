import { useQuery } from '@tanstack/react-query'
import type { PlanUsage, PlanDetails } from '@/types/plan'
import { INITIAL_PLAN_USAGE, INITIAL_PLAN_DETAILS } from '@/services/mockData'

export function usePlanMetrics() {
  const { data: usage, isLoading: loadingUsage } = useQuery<PlanUsage>({
    queryKey: ['plan-usage'],
    queryFn: async () => INITIAL_PLAN_USAGE,
  })

  const { data: planDetails, isLoading: loadingDetails } = useQuery<PlanDetails>({
    queryKey: ['plan-details'],
    queryFn: async () => INITIAL_PLAN_DETAILS,
  })

  return {
    usage: usage || INITIAL_PLAN_USAGE,
    planDetails: planDetails || INITIAL_PLAN_DETAILS,
    isLoading: loadingUsage || loadingDetails,
  }
}
