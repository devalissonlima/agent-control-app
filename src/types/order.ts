export type OrderStatus =
  | 'pending' // Novos / Pendentes (Chegaram da IA ou Balcão)
  | 'preparing' // Em Preparo
  | 'ready' // Pronto / Despachado
  | 'completed' // Entregue / Concluído
  | 'cancelled' // Recusado / Cancelado

export type OrderDeliveryType = 'delivery' | 'pickup'

export type OrderChannel = 'whatsapp' | 'balcao'

export interface OrderItem {
  id?: string
  name: string
  quantity: number
  price?: number
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string // ex: '#1042'
  createdAt: string // ISO string ou relativo
  createdAtTimestamp: number // Para cálculos precisos com date-fns
  completedAtTimestamp?: number // Timestamp de quando foi concluído
  preparationTimeMinutes?: number // Tempo de preparo decorrido ou final
  channel: OrderChannel
  customerName: string
  customerPhone: string
  items: OrderItem[]
  deliveryType: OrderDeliveryType
  deliveryAddress?: string
  subtotal?: number
  deliveryFee?: number
  discount?: number
  paymentMethod: string // ex: 'Pix', 'Cartão de Crédito', 'Dinheiro'
  total: number
  status: OrderStatus
  notes?: string
}

export type KanbanColumnId = 'pending' | 'preparing' | 'ready'

export interface KanbanColumnConfig {
  id: KanbanColumnId
  title: string
  subtitle: string
  badgeColor: string
}

export interface OrdersMetrics {
  totalRevenueToday: number
  completedRevenue: number
  inProductionRevenue: number
  pendingCount: number
  preparingCount: number
  readyCount: number
  completedCount: number
  averageTicket: number
  averagePreparationTimeMinutes: number
}
