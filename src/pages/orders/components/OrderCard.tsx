import React from 'react'
import {
  MessageCircle,
  Clock,
  MapPin,
  Store,
  CreditCard,
  Play,
  XCircle,
  Undo2,
  CheckCircle2,
  CheckCheck,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Order } from '@/types/order'
import { formatCurrency } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'

interface OrderCardProps {
  order: Order
  onAccept?: (orderId: string) => void
  onReject?: (order: Order) => void
  onMarkReady?: (orderId: string) => void
  onRevertToPending?: (orderId: string) => void
  onRevertToPreparing?: (orderId: string) => void
  onComplete?: (orderId: string) => void
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onAccept,
  onReject,
  onMarkReady,
  onRevertToPending,
  onRevertToPreparing,
  onComplete,
}) => {
  // Cálculo do tempo decorrido
  const timeAgo = React.useMemo(() => {
    try {
      const date = order.createdAtTimestamp
        ? new Date(order.createdAtTimestamp)
        : new Date(order.createdAt)
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    } catch {
      return order.createdAt
    }
  }, [order.createdAt, order.createdAtTimestamp])

  const cleanPhone = order.customerPhone.replace(/\D/g, '')
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
  const whatsappUrl = `https://wa.me/${fullPhone}`

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between gap-3.5">
      {/* 1. Top Header: ID, Tempo e Canal WhatsApp */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-slate-900 tracking-tight">
            {order.orderNumber}
          </span>
          <Badge
            variant="outline"
            className="border-emerald-300 bg-emerald-50 text-[10px] font-semibold text-emerald-700 flex items-center gap-1 py-0.5 px-1.5"
          >
            <MessageCircle className="h-3 w-3 text-emerald-600 fill-emerald-600/20" />
            WhatsApp
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <Clock className="h-3 w-3 text-slate-400" />
          <span>{timeAgo}</span>
        </div>
      </div>

      {/* 2. Cliente e WhatsApp Rápido */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {order.customerName}
          </p>
          <p className="text-xs text-slate-500 font-mono">
            {order.customerPhone}
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition"
          title="Abrir WhatsApp do Cliente"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>

      {/* 3. Itens do Pedido */}
      <div className="rounded-xl bg-slate-50/80 p-3 space-y-1.5 border border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Itens ({order.items.length})
        </p>
        <ul className="space-y-1 text-xs text-slate-800">
          {order.items.map((item, idx) => (
            <li key={item.id || idx} className="flex items-start justify-between gap-2">
              <span className="font-medium">
                {item.quantity}x {item.name}
              </span>
              {item.price && (
                <span className="text-[11px] text-slate-500 shrink-0 font-mono">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              )}
            </li>
          ))}
        </ul>

        {order.notes && (
          <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60 italic">
            Obs: {order.notes}
          </p>
        )}
      </div>

      {/* 4. Entrega / Retirada e Pagamento */}
      <div className="space-y-1.5 text-xs text-slate-600">
        {order.deliveryType === 'delivery' ? (
          <div className="flex items-start gap-1.5 text-slate-700">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-indigo-600 mt-0.5" />
            <span className="text-[11px] leading-tight line-clamp-2">
              {order.deliveryAddress || 'Endereço informado via WhatsApp'}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
            <Store className="h-3.5 w-3.5 text-indigo-600" />
            <span>Retirada no Balcão</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <CreditCard className="h-3.5 w-3.5 text-slate-400" />
            <span>{order.paymentMethod}</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-900">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      {/* 5. Ações Operacionais por Coluna */}
      <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
        {order.status === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onReject?.(order)}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Recusar</span>
            </button>
            <button
              type="button"
              onClick={() => onAccept?.(order.id)}
              className="flex-[2] flex items-center justify-center gap-1.5 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Aceitar / Iniciar</span>
            </button>
          </div>
        )}

        {order.status === 'preparing' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRevertToPending?.(order.id)}
              className="h-9 px-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition flex items-center justify-center gap-1"
              title="Voltar para Pendente"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Voltar</span>
            </button>
            <button
              type="button"
              onClick={() => onMarkReady?.(order.id)}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition active:scale-[0.99]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Pronto p/ Envio</span>
            </button>
          </div>
        )}

        {order.status === 'ready' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRevertToPreparing?.(order.id)}
              className="h-9 px-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition flex items-center justify-center gap-1"
              title="Voltar para Preparo"
            >
              <Undo2 className="h-3.5 w-3.5" />
              <span>Voltar</span>
            </button>
            <button
              type="button"
              onClick={() => onComplete?.(order.id)}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition active:scale-[0.99]"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Finalizar / Concluir</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
