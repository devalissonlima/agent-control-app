import React from 'react'
import { ConnectionStatusHeader } from './components/ConnectionStatusHeader'
import { LiveMetricsGrid } from './components/LiveMetricsGrid'
import { ActivityTimeline } from './components/ActivityTimeline'
import { AttentionQueue } from './components/AttentionQueue'
import { QrCodeModal } from './components/QrCodeModal'
import { useMonitoringData } from './hooks/useMonitoringData'

export const MonitoringPage: React.FC = () => {
  const {
    agentName,
    connection,
    metrics,
    events,
    escalations,
    isQrModalOpen,
    openQrModal,
    closeQrModal,
    isReconnecting,
    isLoadingMoreEvents,
    hasMoreEvents,
    isLoadingMoreEscalations,
    hasMoreEscalations,
    handleReconnect,
    handleDisconnect,
    handleToggleAutoPilot,
    handleResolveTicket,
    handleLoadMoreEvents,
    handleLoadMoreEscalations,
  } = useMonitoringData()

  return (
    <div className="space-y-6">
      {/* BLOCO 1: Identidade do Atendente & Status WhatsApp */}
      <ConnectionStatusHeader
        agentName={agentName}
        connection={connection}
        onToggleAutoPilot={handleToggleAutoPilot}
        onOpenQrModal={openQrModal}
        onDisconnectToggle={() =>
          connection.isConnected ? handleDisconnect() : openQrModal()
        }
      />

      {/* BLOCO 2: Termômetro do Dia (Grid com 5 Métricas Claramente Separadas) */}
      <LiveMetricsGrid metrics={metrics} />

      {/* BLOCO 3 & 4: Feed de Atividade ao Vivo + Fila de Transbordo (Com Scroll Interno e Ver Mais) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* BLOCO 3: Feed de Atividade ao Vivo */}
        <ActivityTimeline
          events={events}
          hasMore={hasMoreEvents}
          isLoadingMore={isLoadingMoreEvents}
          onLoadMore={handleLoadMoreEvents}
        />

        {/* BLOCO 4: Fila de Transbordo ("Conversas que Precisam de Atenção") */}
        <AttentionQueue
          tickets={escalations}
          hasMore={hasMoreEscalations}
          isLoadingMore={isLoadingMoreEscalations}
          onLoadMore={handleLoadMoreEscalations}
          onResolveTicket={handleResolveTicket}
        />
      </div>

      {/* Modal de Reconexão WhatsApp Web (QR Code) */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={closeQrModal}
        onSimulateReconnect={handleReconnect}
        isReconnecting={isReconnecting}
      />
    </div>
  )
}

export default MonitoringPage
