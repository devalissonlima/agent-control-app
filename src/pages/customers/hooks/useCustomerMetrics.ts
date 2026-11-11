import { useMemo } from 'react'
import type { Customer, CustomerAnalyticalMetrics } from '@/types/customer'

export function useCustomerMetrics(customers: Customer[]) {
  const metrics: CustomerAnalyticalMetrics = useMemo(() => {
    const totalContacts = customers.length

    // Novos hoje: contatos capturados no dia de hoje
    const newToday = customers.filter(
      (c) => c.createdAt === 'Hoje' || c.statusTag === 'novo'
    ).length

    // Leads frios / em potencial: conversaram com a IA mas nunca compraram (totalSpent === 0)
    const coldLeads = customers.filter(
      (c) => c.isLead || (c.totalSpent === 0 && c.servicesCount === 0)
    ).length

    // Clientes inativos (>30 dias): já compraram no passado, mas estão sem contato há mais de 30 dias
    const inactive30Days = customers.filter(
      (c) => !c.isLead && c.totalSpent > 0 && c.daysInactive >= 30
    ).length

    return {
      totalContacts,
      newToday,
      coldLeads,
      inactive30Days,
    }
  }, [customers])

  return metrics
}
