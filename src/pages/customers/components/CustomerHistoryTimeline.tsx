import React, { useState } from 'react'
import {
  ShoppingBag,
  Calendar,
  Clock,
  ChevronDown,
  Check,
} from 'lucide-react'
import type { CustomerHistoryItem } from '@/types/customer'

interface CustomerHistoryTimelineProps {
  history: CustomerHistoryItem[]
}

export const CustomerHistoryTimeline: React.FC<CustomerHistoryTimelineProps> = ({
  history,
}) => {
  const [visibleCount, setVisibleCount] = useState(3)

  const visibleItems = history.slice(0, visibleCount)
  const hasMore = visibleCount < history.length

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 3)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-indigo-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Linha do Tempo de Pedidos & Interesses ({history.length})
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">Histórico completo</span>
      </div>

      {history.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-6 text-center text-xs text-slate-500">
          Nenhum pedido ou agendamento registrado para este contato ainda.
        </div>
      ) : (
        <div className="max-h-[340px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
          {visibleItems.map((item) => {
            const isOrder = item.type === 'order'
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5 transition hover:bg-white hover:shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isOrder ? (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-900">
                      {item.title}
                    </span>
                  </div>

                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-700 shadow-2xs border border-slate-200">
                    {item.status}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 pl-9 font-medium leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-2.5 flex items-center justify-between pl-9 border-t border-slate-200/60 pt-2 text-xs">
                  <span className="text-slate-400 font-medium">
                    {item.date}
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {item.amount > 0 ? `R$ ${item.amount.toFixed(2)}` : 'Sem cobrança'}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Botão Ver Mais Histórico */}
          <div className="pt-2 text-center">
            {hasMore ? (
              <button
                type="button"
                onClick={handleShowMore}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition shadow-2xs"
              >
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                <span>Ver mais histórico ({history.length - visibleCount} restantes)</span>
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 py-1">
                <Check className="h-3 w-3 text-emerald-500" />
                <span>Início do histórico alcançado</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerHistoryTimeline
