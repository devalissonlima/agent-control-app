import React from 'react'
import {
  ShoppingBag,
  DollarSign,
  History,
  TrendingUp,
} from 'lucide-react'
import { useOrdersKanban } from './hooks/useOrdersKanban'
import { OrdersKanban } from './components/OrdersKanban'
import { RejectOrderDialog } from './components/RejectOrderDialog'
import { OrderCompletedHistoryModal } from './components/OrderCompletedHistoryModal'
import { formatCurrency } from '@/utils/formatters'
import { Button } from '@/components/ui/button'

export const OrdersPage: React.FC = () => {
  const {
    pendingOrders,
    preparingOrders,
    readyOrders,
    completedTodayOrders,
    cancelledTodayOrders,
    activeOrdersCount,
    totalRevenueToday,
    acceptOrder,
    revertToPending,
    markAsReady,
    revertToPreparing,
    completeOrder,
    orderToReject,
    isRejectDialogOpen,
    openRejectDialog,
    closeRejectDialog,
    confirmRejectOrder,
    isHistoryModalOpen,
    setIsHistoryModalOpen,
  } = useOrdersKanban()

  return (
    <div className="space-y-6">
      {/* 1. Cabeçalho Operacional & Métricas Rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Pedidos & Balcão Operacional
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Esteira Kanban em tempo real para controle de cozinha, embalagem e entregas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsHistoryModalOpen(true)}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
          >
            <History className="h-4 w-4 text-slate-500" />
            <span>Histórico do Turno ({completedTodayOrders.length})</span>
          </Button>
        </div>
      </div>

      {/* 2. Mini-Cards Métricos do Turno */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-indigo-100 bg-white p-3.5 shadow-2xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500">Pedidos na Esteira</p>
            <p className="text-lg font-bold text-slate-900">{activeOrdersCount}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-2xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500">Concluídos Hoje</p>
            <p className="text-lg font-bold text-emerald-600">{completedTodayOrders.length}</p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500">Faturado no Turno</p>
            <p className="text-lg font-bold text-slate-900 truncate">
              {formatCurrency(totalRevenueToday)}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Esteira Kanban (Sem Drag-and-Drop) */}
      <OrdersKanban
        pendingOrders={pendingOrders}
        preparingOrders={preparingOrders}
        readyOrders={readyOrders}
        onAccept={acceptOrder}
        onReject={openRejectDialog}
        onMarkReady={markAsReady}
        onRevertToPending={revertToPending}
        onRevertToPreparing={revertToPreparing}
        onComplete={completeOrder}
      />

      {/* 4. Diálogo de Confirmação de Recusa */}
      <RejectOrderDialog
        isOpen={isRejectDialogOpen}
        order={orderToReject}
        onClose={closeRejectDialog}
        onConfirm={confirmRejectOrder}
      />

      {/* 5. Modal de Histórico de Concluídos */}
      <OrderCompletedHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        completedOrders={completedTodayOrders}
        cancelledOrders={cancelledTodayOrders}
      />
    </div>
  )
}

export default OrdersPage
