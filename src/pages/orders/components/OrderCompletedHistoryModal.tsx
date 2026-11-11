import React from 'react'
import { CheckCheck, XCircle, Clock, CreditCard } from 'lucide-react'
import type { Order } from '@/types/order'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'

interface OrderCompletedHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  completedOrders: Order[]
  cancelledOrders: Order[]
}

export const OrderCompletedHistoryModal: React.FC<OrderCompletedHistoryModalProps> = ({
  isOpen,
  onClose,
  completedOrders,
  cancelledOrders,
}) => {
  const [activeTab, setActiveTab] = React.useState<'completed' | 'cancelled'>('completed')

  const displayedOrders = activeTab === 'completed' ? completedOrders : cancelledOrders

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Histórico de Pedidos do Turno</DialogTitle>
              <DialogDescription className="mt-1">
                Auditoria de pedidos finalizados e recusados nas últimas 24 horas.
              </DialogDescription>
            </div>
          </div>

          {/* Abas Concluídos vs Cancelados */}
          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Concluídos ({completedOrders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cancelled')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                activeTab === 'cancelled'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Recusados ({cancelledOrders.length})</span>
            </button>
          </div>
        </DialogHeader>

        {/* Lista com scroll */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 max-h-[50vh]">
          {displayedOrders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-xs text-slate-500">
              Nenhum pedido nesta categoria no momento.
            </div>
          ) : (
            displayedOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {order.customerName}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold ${
                      activeTab === 'completed'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                        : 'border-rose-300 bg-rose-50 text-rose-700'
                    }`}
                  >
                    {activeTab === 'completed' ? 'Entregue / Concluído' : 'Recusado'}
                  </Badge>
                </div>

                <div className="text-xs text-slate-600 flex flex-wrap gap-1">
                  {order.items.map((i, idx) => (
                    <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {i.quantity}x {i.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {order.createdAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" /> {order.paymentMethod}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
