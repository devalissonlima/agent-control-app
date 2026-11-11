export type OrderStatus =
  | 'pending' // Novos / Pendentes (Chegaram da IA)
  | 'preparing' // Em Preparo
  | 'ready' // Pronto / Despachado
  | 'completed' // Entregue / Concluído
  | 'cancelled' // Recusado / Cancelado

export type OrderDeliveryType = 'delivery' | 'pickup'

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
  createdAtTimestamp?: number // Para cálculos precisos com date-fns
  channel: 'whatsapp'
  customerName: string
  customerPhone: string
  items: OrderItem[]
  deliveryType: OrderDeliveryType
  deliveryAddress?: string
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
