export interface Address {
  id: string
  label: string // ex: "Casa", "Trabalho", "Mãe"
  street: string
  number: string
  neighborhood: string
  city: string
  complement?: string
  isPrimary: boolean
}

export interface CustomerHistoryItem {
  id: string
  type: 'order' | 'appointment'
  title: string
  description: string
  date: string
  amount: number
  status: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  formattedPhone: string
  deliveryAddress: string // Endereço principal textual para compatibilidade rápida
  addresses: Address[]
  totalSpent: number
  servicesCount: number
  lastContactAt: string
  avatarUrl?: string
  statusTag: 'ativo' | 'recorrente' | 'novo'
  isLead: boolean // true se nunca fechou pedido ou agendamento (0 compras)
  createdAt: string
  daysInactive: number
  history: CustomerHistoryItem[]
}

export interface CustomerAnalyticalMetrics {
  totalContacts: number
  newToday: number
  coldLeads: number
  inactive30Days: number
}
