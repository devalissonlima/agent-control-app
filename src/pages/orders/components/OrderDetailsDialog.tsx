import React from 'react'
import {
  MessageCircle,
  MapPin,
  Store,
  CreditCard,
  Clock,
  AlertTriangle,
  Receipt,
  User,
  CheckCircle2,
  Play,
  CheckCheck,
} from 'lucide-react'
import type { Order } from '@/types/order'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'

interface OrderDetailsDialogProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
  onAccept?: (orderId: string) => void
  onMarkReady?: (orderId: string) => void
  onComplete?: (orderId: string) => void
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  isOpen,
  order,
  onClose,
  onAccept,
  onMarkReady,
  onComplete,
}) => {
  if (!order) return null

  const cleanPhone = order.customerPhone.replace(/\D/g, '')
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
  const whatsappUrl = `https://wa.me/${fullPhone}`

  const getStatusBadge = () => {
    switch (order.status) {
      case 'pending':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Novo / Pendente</Badge>
      case 'preparing':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Em Preparo</Badge>
      case 'ready':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Pronto / Despachado</Badge>
      case 'completed':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Entregue / Concluído</Badge>
      case 'cancelled':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">Recusado / Cancelado</Badge>
    }
  }

  const subtotal = order.subtotal ?? order.items.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0)
  const deliveryFee = order.deliveryFee ?? (order.deliveryType === 'delivery' ? 7.0 : 0)
  const discount = order.discount ?? 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-indigo-600" />
                <DialogTitle className="text-xl font-bold font-mono">
                  Comanda {order.orderNumber}
                </DialogTitle>
                {getStatusBadge()}
              </div>
              <DialogDescription className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                <span>Registrado em {new Date(order.createdAtTimestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • Canal {order.channel === 'whatsapp' ? 'WhatsApp (IA)' : 'Balcão Manual'}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Corpo com scroll */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* 1. Dados do Cliente e Contato */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Dados do Cliente & Entrega
            </span>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    {order.customerPhone}
                  </p>
                </div>
              </div>

              {order.customerPhone !== '-' && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>Chamar no WhatsApp</span>
                </a>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-xs">
              {order.deliveryType === 'delivery' ? (
                <div className="flex items-start gap-1.5 text-slate-700">
                  <MapPin className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Endereço de Entrega:</strong> {order.deliveryAddress || 'Endereço informado via WhatsApp'}
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-100/70 text-indigo-800 font-semibold text-xs">
                  <Store className="h-4 w-4 text-indigo-600" />
                  <span>Retirada Presencial no Balcão</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Discriminação dos Itens com Detalhes e Observações */}
          <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Itens da Comanda ({order.items.length})
            </span>

            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono">
                        {item.quantity}x
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-amber-700 font-medium italic flex items-center gap-1 pl-6">
                        <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                        <span>Obs: {item.notes}</span>
                      </p>
                    )}
                  </div>
                  {item.price && (
                    <span className="font-mono text-xs font-semibold text-slate-700 shrink-0">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {order.notes && (
              <div className="mt-3 rounded-lg bg-amber-50 p-2.5 border border-amber-200/70 text-xs text-amber-900">
                <span className="font-bold flex items-center gap-1 mb-0.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Observação Geral do Pedido:
                </span>
                <p className="italic pl-4.5">{order.notes}</p>
              </div>
            )}
          </div>

          {/* 3. Valores Financeiros e Forma de Pagamento */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Resumo Financeiro & Pagamento
            </span>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal dos Itens:</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de Entrega:</span>
                <span className="font-mono">{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Grátis'}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Desconto Aplicado:</span>
                  <span className="font-mono">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total a Pagar:</span>
                <span className="font-mono text-base text-indigo-700">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-slate-400" />
                <span>Forma de Pagamento:</span>
                <strong className="text-slate-800">{order.paymentMethod}</strong>
              </div>
              <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="h-3 w-3" /> Aprovado
              </span>
            </div>
          </div>
        </div>

        {/* Rodapé de Ações Rápidas */}
        <DialogFooter className="gap-2 sm:justify-between items-center pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
            Fechar
          </Button>

          <div className="flex items-center gap-2">
            {order.status === 'pending' && onAccept && (
              <Button
                size="sm"
                onClick={() => {
                  onAccept(order.id)
                  onClose()
                }}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 font-bold"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>Iniciar Preparo</span>
              </Button>
            )}

            {order.status === 'preparing' && onMarkReady && (
              <Button
                size="sm"
                onClick={() => {
                  onMarkReady(order.id)
                  onClose()
                }}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white gap-1.5 font-bold"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Pronto p/ Envio</span>
              </Button>
            )}

            {order.status === 'ready' && onComplete && (
              <Button
                size="sm"
                onClick={() => {
                  onComplete(order.id)
                  onClose()
                }}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-bold"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Concluir Entrega</span>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
