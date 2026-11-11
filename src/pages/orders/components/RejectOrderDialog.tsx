import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
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

interface RejectOrderDialogProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
  onConfirm: (reason?: string) => void
}

const COMMON_REASONS = [
  'Item do cardápio esgotado',
  'Fora da área de entrega',
  'Cozinha com sobrecarga temporária',
  'Cliente solicitou cancelamento',
]

export const RejectOrderDialog: React.FC<RejectOrderDialogProps> = ({
  isOpen,
  order,
  onClose,
  onConfirm,
}) => {
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0])
  const [customReason, setCustomReason] = useState('')

  if (!order) return null

  const handleConfirm = () => {
    const finalReason = customReason.trim() ? customReason : selectedReason
    onConfirm(finalReason)
    setCustomReason('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-rose-900">
                Recusar Pedido {order.orderNumber}?
              </DialogTitle>
              <DialogDescription className="text-slate-500 mt-1">
                O cliente {order.customerName} será notificado sobre o cancelamento.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Motivo da Recusa:
          </label>
          <div className="space-y-1.5">
            {COMMON_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl border transition ${
                  selectedReason === reason && !customReason
                    ? 'border-rose-400 bg-rose-50 text-rose-800 font-medium'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {reason}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="text"
              placeholder="Ou digite outro motivo..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Voltar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium"
          >
            Confirmar Recusa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
