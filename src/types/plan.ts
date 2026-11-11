export type PlanCapacityStatus = 'normal' | 'warning' | 'soft_limit'

export interface PlanUsage {
  usedChats24h: number
  totalLimit24h: number
  percentage: number
  softLimitActive: boolean
  status: PlanCapacityStatus
  windowResetTime: string
  totalMonthlyCalls: number
  tokensConsumedK: number
}

export interface TenantDetails {
  id: string
  companyName: string
  tradingName: string
  cnpj: string
  segment: 'delivery' | 'servicos' | 'varejo'
  phone: string
  email: string
  address: string
  city: string
  state: string
}

export interface PlanDetails {
  id: string
  name: string
  tier: 'Starter' | 'Pro' | 'Enterprise'
  priceMonthly: number
  billingCycle: 'mensal' | 'anual'
  maxChats24h: number
  softLimitCeiling: number
  features: string[]
  nextBillingDate: string
  activeSince: string
}
