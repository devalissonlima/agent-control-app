import React from 'react'
import {
  Maximize2,
  Minimize2,
  Sparkles,
  ChefHat,
  Bike,
  Inbox,
  Flame,
} from 'lucide-react'
import type { Order } from '@/types/order'
import { CompactOrderCard } from './CompactOrderCard'
import { Button } from '@/components/ui/button'

interface ProductionLineTabProps {
  pendingOrders: Order[]
  preparingOrders: Order[]
  readyOrders: Order[]
  isFocusMode: boolean
  onToggleFocusMode: () => void
  onOpenDetails: (order: Order) => void
  onAccept: (orderId: string) => void
  onReject: (order: Order) => void
  onMarkReady: (orderId: string) => void
  onComplete: (orderId: string) => void
  onRevertToPending: (orderId: string) => void
  onRevertToPreparing: (orderId: string) => void
}

export const ProductionLineTab: React.FC<ProductionLineTabProps> = ({
  pendingOrders,
  preparingOrders,
  readyOrders,
  isFocusMode,
  onToggleFocusMode,
  onOpenDetails,
  onAccept,
  onReject,
  onMarkReady,
  onComplete,
  onRevertToPending,
  onRevertToPreparing,
}) => {
  const totalActive = pendingOrders.length + preparingOrders.length + readyOrders.length

  const content = (
    <div className={`flex flex-col ${isFocusMode ? 'h-screen w-screen p-3 bg-slate-950 text-slate-100 select-none' : 'space-y-4'}`}>
      {/* Barra de Controle do KDS / Modo Foco */}
      <div className={`flex items-center justify-between ${isFocusMode ? 'border-b border-slate-800 pb-2.5 px-1' : 'border-b border-slate-200/80 pb-3'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${isFocusMode ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-100 text-indigo-700'}`}>
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h2 className={`text-sm font-bold tracking-tight ${isFocusMode ? 'text-white' : 'text-slate-900'}`}>
              Esteira KDS {isFocusMode && '• Modo Foco Ativo'}
            </h2>
            <p className={`text-[11px] ${isFocusMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {totalActive} {totalActive === 1 ? 'comanda ativa' : 'comandas ativas'} na esteira de produção
            </p>
          </div>
        </div>

        {/* Botão de Alternar Modo Foco */}
        <div>
          {isFocusMode ? (
            <button
              type="button"
              onClick={onToggleFocusMode}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-xs font-bold transition border border-slate-700 shadow-md cursor-pointer"
              title="Pressione ESC ou clique para sair"
            >
              <Minimize2 className="h-3.5 w-3.5 text-amber-400" />
              <span>Sair do Modo Foco (ESC)</span>
            </button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleFocusMode}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 h-8 text-xs font-semibold shadow-2xs cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5 text-indigo-600" />
              <span>Ativar Modo Foco (Tela Cheia)</span>
            </Button>
          )}
        </div>
      </div>

      {/* Grid das 3 Colunas KDS */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start ${isFocusMode ? 'flex-1 overflow-hidden pt-2' : ''}`}>
        {/* COLUNA 1: NOVOS / PENDENTES */}
        <div
          className={`flex flex-col rounded-xl border p-2.5 ${
            isFocusMode
              ? 'bg-slate-900/90 border-slate-800 h-[calc(100vh-68px)]'
              : 'bg-slate-50/80 border-indigo-100 min-h-[580px]'
          }`}
        >
          <div
            className={`rounded-lg p-2.5 mb-2.5 flex items-center justify-between border ${
              isFocusMode
                ? 'bg-indigo-950/60 border-indigo-800/60 text-indigo-200'
                : 'bg-indigo-50 border-indigo-200/80 text-indigo-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span className="text-xs font-bold tracking-tight">Novos / Pendentes</span>
            </div>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
              {pendingOrders.length}
            </span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-0.5">
            {pendingOrders.length === 0 ? (
              <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center h-48 ${isFocusMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400 bg-white/60'}`}>
                <Inbox className="h-6 w-6 mb-1 opacity-50" />
                <span className="text-xs font-medium">Nenhum pedido pendente</span>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <CompactOrderCard
                  key={order.id}
                  order={order}
                  onOpenDetails={onOpenDetails}
                  onAccept={onAccept}
                  onReject={onReject}
                />
              ))
            )}
          </div>
        </div>

        {/* COLUNA 2: EM PREPARO */}
        <div
          className={`flex flex-col rounded-xl border p-2.5 ${
            isFocusMode
              ? 'bg-slate-900/90 border-slate-800 h-[calc(100vh-68px)]'
              : 'bg-slate-50/80 border-amber-100 min-h-[580px]'
          }`}
        >
          <div
            className={`rounded-lg p-2.5 mb-2.5 flex items-center justify-between border ${
              isFocusMode
                ? 'bg-amber-950/60 border-amber-800/60 text-amber-200'
                : 'bg-amber-50 border-amber-200/80 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <ChefHat className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-bold tracking-tight">Em Preparo (Cozinha)</span>
            </div>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1.5 text-[10px] font-bold text-white">
              {preparingOrders.length}
            </span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-0.5">
            {preparingOrders.length === 0 ? (
              <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center h-48 ${isFocusMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400 bg-white/60'}`}>
                <Inbox className="h-6 w-6 mb-1 opacity-50" />
                <span className="text-xs font-medium">Cozinha livre no momento</span>
              </div>
            ) : (
              preparingOrders.map((order) => (
                <CompactOrderCard
                  key={order.id}
                  order={order}
                  onOpenDetails={onOpenDetails}
                  onMarkReady={onMarkReady}
                  onRevertToPending={onRevertToPending}
                />
              ))
            )}
          </div>
        </div>

        {/* COLUNA 3: PRONTO / DESPACHADO */}
        <div
          className={`flex flex-col rounded-xl border p-2.5 ${
            isFocusMode
              ? 'bg-slate-900/90 border-slate-800 h-[calc(100vh-68px)]'
              : 'bg-slate-50/80 border-emerald-100 min-h-[580px]'
          }`}
        >
          <div
            className={`rounded-lg p-2.5 mb-2.5 flex items-center justify-between border ${
              isFocusMode
                ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
                : 'bg-emerald-50 border-emerald-200/80 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Bike className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-xs font-bold tracking-tight">Pronto / Despachado</span>
            </div>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 text-[10px] font-bold text-white">
              {readyOrders.length}
            </span>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto pr-0.5">
            {readyOrders.length === 0 ? (
              <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center h-48 ${isFocusMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400 bg-white/60'}`}>
                <Inbox className="h-6 w-6 mb-1 opacity-50" />
                <span className="text-xs font-medium">Nenhum pedido aguardando envio</span>
              </div>
            ) : (
              readyOrders.map((order) => (
                <CompactOrderCard
                  key={order.id}
                  order={order}
                  onOpenDetails={onOpenDetails}
                  onComplete={onComplete}
                  onRevertToPreparing={onRevertToPreparing}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (isFocusMode) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950">
        {content}
      </div>
    )
  }

  return content
}
