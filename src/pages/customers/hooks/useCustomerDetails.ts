import { useMemo } from 'react'
import type { Customer, Address } from '@/types/customer'
import { formatCurrency } from '@/utils/formatters'

export function useCustomerDetails(customer: Customer | null) {
  const details = useMemo(() => {
    if (!customer) {
      return {
        initials: '?',
        totalSpentFormatted: 'R$ 0,00',
        ticketMedioFormatted: 'R$ 0,00',
        servicesCount: 0,
        primaryAddress: null as Address | null,
        whatsappUrl: '#',
        cleanPhone: '',
        isLead: true,
      }
    }

    const nameParts = customer.name.trim().split(' ')
    const initials =
      nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : customer.name.slice(0, 2).toUpperCase()

    const cleanPhone = customer.phone.replace(/\D/g, '')
    // Default country code 55 if not present
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
    const whatsappUrl = `https://wa.me/${fullPhone}`

    const count = customer.servicesCount || 0
    const ticketMedio = count > 0 ? customer.totalSpent / count : 0

    const primaryAddress =
      customer.addresses.find((addr) => addr.isPrimary) ||
      customer.addresses[0] ||
      null

    return {
      initials,
      totalSpentFormatted: formatCurrency(customer.totalSpent),
      ticketMedioFormatted: formatCurrency(ticketMedio),
      servicesCount: count,
      primaryAddress,
      whatsappUrl,
      cleanPhone: customer.phone,
      isLead: Boolean(customer.isLead || (customer.totalSpent === 0 && count === 0)),
    }
  }, [customer])

  return details
}
