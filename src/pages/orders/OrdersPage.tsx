import React from 'react'
import { Plus, ShoppingBag, BarChart3, ChefHat } from 'lucide-react'
import { useProductionLine } from './hooks/useProductionLine'
import { useOrdersMetrics } from './hooks/useOrdersMetrics'
import { useFocusMode } from './hooks/useFocusMode'
import { OrdersOverviewTab } from './components/OrdersOverviewTab'
import { ProductionLineTab } from './components/ProductionLineTab'
import { OrderDetailsDialog } from './components/OrderDetailsDialog'
import { ManualOrderDialog } from './components/ManualOrderDialog'
import { RejectOrderDialog } from './components/RejectOrderDialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

export const OrdersPage: React.FC = () => {
  const {
    orders,
    pendingOrders,
    preparingOrders,
    readyOrders,
    acceptOrder,
    markAsReady,
    completeOrder,
    revertToPending,
    revertToPreparing,
    selectedOrderForDetails,
    isDetailsOpen,
    openDetails,
    closeDetails,
    isManualOrderOpen,
    openManualOrder,
    closeManualOrder,
    addManualOrder,
    orderToReject,
    isRejectOpen,
    openReject,
    closeReject,
    confirmReject,
  } = useProductionLine()

  const { metrics, completedOrders } = useOrdersMetrics(orders)
  const { isFocusMode, toggleFocusMode } = useFocusMode()

  return (
    <div className="space-y-6">
      {/* 1. Cabeçalho Principal (Oculto no Modo Foco para blindar o operador) */}
      {!isFocusMode && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-50">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Pedidos & KDS de Cozinha
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Gestão integrada de esteira de produção, comandas digitais e métricas operacionais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={openManualOrder}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 h-9 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Novo Pedido Manual</span>
            </Button>
          </div>
        </div>
      )}

      {/* 2. Reorganização em Abas: Visão Geral vs Linha de Produção */}
      <Tabs defaultValue="production" className="w-full">
        {!isFocusMode && (
          <div className="border-b border-slate-200/80 pb-2">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="production" className="gap-1.5 py-1.5 px-3.5">
                <ChefHat className="h-4 w-4 text-amber-500" />
                <span>Linha de Produção (KDS)</span>
                <span className="ml-1 rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] font-bold text-slate-700">
                  {pendingOrders.length + preparingOrders.length + readyOrders.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="overview" className="gap-1.5 py-1.5 px-3.5">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                <span>Visão Geral</span>
              </TabsTrigger>
            </TabsList>
          </div>
        )}

        {/* Aba 1: Linha de Produção (com suporte a Modo Foco) */}
        <TabsContent value="production" className="mt-2 focus-visible:outline-none">
          <ProductionLineTab
            pendingOrders={pendingOrders}
            preparingOrders={preparingOrders}
            readyOrders={readyOrders}
            isFocusMode={isFocusMode}
            onToggleFocusMode={toggleFocusMode}
            onOpenDetails={openDetails}
            onAccept={acceptOrder}
            onReject={openReject}
            onMarkReady={markAsReady}
            onComplete={completeOrder}
            onRevertToPending={revertToPending}
            onRevertToPreparing={revertToPreparing}
          />
        </TabsContent>

        {/* Aba 2: Visão Geral (Dashboard do Turno) */}
        <TabsContent value="overview" className="mt-2 focus-visible:outline-none">
          <OrdersOverviewTab
            metrics={metrics}
            completedOrders={completedOrders}
            onOpenDetails={openDetails}
          />
        </TabsContent>
      </Tabs>

      {/* 3. Modal Central de Detalhes da Comanda */}
      <OrderDetailsDialog
        isOpen={isDetailsOpen}
        order={selectedOrderForDetails}
        onClose={closeDetails}
        onAccept={acceptOrder}
        onMarkReady={markAsReady}
        onComplete={completeOrder}
      />

      {/* 4. Modal para Lançamento de Pedido Manual (Balcão / Telefone) */}
      <ManualOrderDialog
        isOpen={isManualOrderOpen}
        onClose={closeManualOrder}
        onAddOrder={addManualOrder}
      />

      {/* 5. Diálogo de Recusa de Pedido */}
      <RejectOrderDialog
        isOpen={isRejectOpen}
        order={orderToReject}
        onClose={closeReject}
        onConfirm={confirmReject}
      />
    </div>
  )
}

export default OrdersPage
