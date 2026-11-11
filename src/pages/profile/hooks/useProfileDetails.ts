import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import type { TenantDetails, PlanDetails } from '@/types/plan'
import { INITIAL_TENANT, INITIAL_PLAN_DETAILS } from '@/services/mockData'

export function useProfileDetails() {
  const { user, logout } = useAuthStore()

  const { data: tenant, isLoading: loadingTenant } = useQuery<TenantDetails>({
    queryKey: ['tenant-details'],
    queryFn: async () => INITIAL_TENANT,
  })

  const { data: plan, isLoading: loadingPlan } = useQuery<PlanDetails>({
    queryKey: ['profile-plan'],
    queryFn: async () => INITIAL_PLAN_DETAILS,
  })

  return {
    user,
    tenant: tenant || INITIAL_TENANT,
    plan: plan || INITIAL_PLAN_DETAILS,
    isLoading: loadingTenant || loadingPlan,
    logout,
  }
}
