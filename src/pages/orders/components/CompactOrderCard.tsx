import React, { useState, useEffect, useMemo } from 'react'
import {
  MessageCircle,
  Store,
  Clock,
  AlertTriangle,
  Play,
  CheckCircle2,
  CheckCheck,
  Undo2,
  XCircle,
  MapPin,
  ShoppingBag,
} from 'lucide-react'
import type { Order } from '@/types/order'
import { Badge } from '@/components/ui/badge'

interface CompactOrderCardProps {
  order: Order
  onOpenDetails: (order: Order) => void
  onAccept?: (orderId: string) => void
  onReject?: (order: Order) => void
  onMarkReady?: (orderId: string) => void
  onComplete?: (orderId: string) => void
  onRevertToPending?: (orderId: string) => void
  onRevertToPreparing?: (orderId: string) => void
}

export const CompactOrderCard: React.FC<CompactOrderCardProps> = ({
  order,
  onOpenDetails,
  onAccept,
  onReject,
  onMarkReady,
  onComplete,
  onRevertToPending,
  onRevertToPreparing,
}) => {
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now())
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  // Cálculo do tempo decorrido em minutos para a cor dinâmica
  const elapsedMinutes = useMemo(() => {
    const start = order.createdAtTimestamp || currentTime
    const diffMs = currentTime - start
    return Math.max(1, Math.floor(diffMs / (60 * 1000)))
  }, [order.createdAtTimestamp, currentTime])

  // Cor dinâmica de urgência (KDS standard)
  const timeBadgeStyles = useMemo(() => {
    if (elapsedMinutes < 15) {
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    }
    if (elapsedMinutes <= 30) {
      return 'border-amber-300 bg-amber-50 text-amber-700 font-semibold'
    }
    return 'border-rose-300 bg-rose-50 text-rose-700 font-bold animate-pulse'
  }, [elapsedMinutes])

  // Checagem se há observações críticas
  const hasCriticalObservation = useMemo(() => {
    if (order.notes && order.notes.trim().length > 0) return true
    return order.items.some((item) => item.notes && item.notes.trim().length > 0)
  }, [order.notes, order.items])

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails(order)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetails(order)
        }
      }}
      className="group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs transition-all hover:border-indigo-300 hover:shadow-md cursor-pointer select-none text-left"
    >
      {/* 1. TOPO: ID, Canal e Tempo Corrido Dinâmico */}
      <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">
            {order.orderNumber}
          </span>

          {order.channel === 'whatsapp' ? (
            <Badge
              variant="outline"
              className="border-emerald-300 bg-emerald-50 text-[10px] font-semibold text-emerald-700 flex items-center gap-1 py-0 px-1.5 h-4.5"
            >
              <MessageCircle className="h-2.5 w-2.5 text-emerald-600" />
              WhatsApp
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-indigo-300 bg-indigo-50 text-[10px] font-semibold text-indigo-700 flex items-center gap-1 py-0 px-1.5 h-4.5"
            >
              <Store className="h-2.5 w-2.5 text-indigo-600" />
              Balcão
            </Badge>
          )}
        </div>

        {/* Indicador de tempo corrido com cor dinâmica */}
        <div
          className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-mono leading-none ${timeBadgeStyles}`}
          title={`Pedido recebido há ${elapsedMinutes} minutos`}
        >
          <Clock className="h-2.5 w-2.5 shrink-0" />
          <span>{elapsedMinutes} min</span>
        </div>
      </div>

      {/* 2. CORPO: Cliente e Resumo dos Itens (Alta Densidade) */}
      <div className="py-2 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-900 truncate">
            {order.customerName}
          </span>
          <span className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1">
            {order.deliveryType === 'delivery' ? (
              <span className="inline-flex items-center gap-0.5 text-slate-600">
                <MapPin className="h-2.5 w-2.5 text-indigo-500" /> Entrega
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
                <ShoppingBag className="h-2.5 w-2.5" /> Retirada
              </span>
            )}
          </span>
        </div>

        {/* Lista resumida e enxuta */}
        <ul className="space-y-0.5 text-[11px] text-slate-700 font-medium">
          {order.items.slice(0, 3).map((item, idx) => (
            <li key={idx} className="truncate">
              <span className="font-bold text-slate-900 mr-1">{item.quantity}x</span>
              <span>{item.name}</span>
            </li>
          ))}
          {order.items.length > 3 && (
            <li className="text-[10px] font-semibold text-slate-400">
              +{order.items.length - 3} outro(s) item(ns)...
            </li>
          )}
        </ul>

        {/* Badge de Alerta se houver observação crítica */}
        {hasCriticalObservation && (
          <div className="pt-0.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200/80">
              <AlertTriangle className="h-2.5 w-2.5 text-amber-600 shrink-0" />
              <span>Observação na Comanda</span>
            </span>
          </div>
        )}
      </div>

      {/* 3. RODAPÉ: Ações Rápidas de Etapa (Sem acionar o modal) */}
      <div
        className="flex items-center gap-1.5 border-t border-slate-100 pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        {order.status === 'pending' && (
          <>
            <button
              type="button"
              onClick={() => onReject?.(order)}
              className="flex h-7 items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50/70 px-2 text-[11px] font-medium text-rose-700 hover:bg-rose-100 transition"
              title="Recusar comanda"
            >
              <XCircle className="h-3 w-3" />
              <span>Recusar</span>
            </button>
            <button
              type="button"
              onClick={() => onAccept?.(order.id)}
              className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 text-[11px] font-bold text-white shadow-2xs hover:bg-indigo-700 active:scale-[0.98] transition"
            >
              <Play className="h-3 w-3 fill-white" />
              <span>Iniciar Preparo</span>
            </button>
          </>
        )}

        {order.status === 'preparing' && (
          <>
            <button
              type="button"
              onClick={() => onRevertToPending?.(order.id)}
              className="flex h-7 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600 hover:bg-slate-100 transition"
              title="Voltar para Pendente"
            >
              <Undo2 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onMarkReady?.(order.id)}
              className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-2.5 text-[11px] font-bold text-white shadow-2xs hover:bg-amber-700 active:scale-[0.98] transition"
            >
              <CheckCircle2 className="h-3 w-3" />
              <span>Pronto p/ Envio</span>
            </button>
          </>
        )}

        {order.status === 'ready' && (
          <>
            <button
              type="button"
              onClick={() => onRevertToPreparing?.(order.id)}
              className="flex h-7 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] text-slate-600 hover:bg-slate-100 transition"
              title="Voltar para Preparo"
            >
              <Undo2 className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => onComplete?.(order.id)}
              className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-[0.98] transition"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span>Concluir Entrega</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
