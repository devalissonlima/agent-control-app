import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  WhatsAppConnectionState,
  LiveControlMetrics,
  LiveActivityEvent,
  EscalationTicket,
} from '@/types/monitoring'
import type { AgentConfig } from '@/types/agent'
import {
  INITIAL_WHATSAPP_STATE,
  INITIAL_LIVE_METRICS,
  INITIAL_LIVE_EVENTS,
  MORE_HISTORICAL_EVENTS,
  INITIAL_ESCALATIONS,
  MORE_ESCALATIONS,
  INITIAL_AGENT_CONFIG,
} from '@/services/mockData'

export function useMonitoringData() {
  const queryClient = useQueryClient()
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isLoadingMoreEvents, setIsLoadingMoreEvents] = useState(false)
  const [hasMoreEvents, setHasMoreEvents] = useState(true)

  const [isLoadingMoreEscalations, setIsLoadingMoreEscalations] = useState(false)
  const [hasMoreEscalations, setHasMoreEscalations] = useState(true)

  // 0. Nome do Atendente Configurado
  const { data: agentConfig = INITIAL_AGENT_CONFIG } = useQuery<AgentConfig>({
    queryKey: ['agent-config'],
    queryFn: async () => INITIAL_AGENT_CONFIG,
  })

  // 1. Estado da Conexão WhatsApp
  const { data: connection = INITIAL_WHATSAPP_STATE } = useQuery<WhatsAppConnectionState>({
    queryKey: ['whatsapp-connection'],
    queryFn: async () => INITIAL_WHATSAPP_STATE,
  })

  // 2. Métricas do Turno
  const { data: metrics = INITIAL_LIVE_METRICS } = useQuery<LiveControlMetrics>({
    queryKey: ['live-metrics'],
    queryFn: async () => INITIAL_LIVE_METRICS,
  })

  // 3. Feed de Atividade ao Vivo
  const { data: events = INITIAL_LIVE_EVENTS } = useQuery<LiveActivityEvent[]>({
    queryKey: ['live-events'],
    queryFn: async () => INITIAL_LIVE_EVENTS,
  })

  // 4. Fila de Transbordo (Atenção Humana)
  const { data: escalations = INITIAL_ESCALATIONS } = useQuery<EscalationTicket[]>({
    queryKey: ['escalation-tickets'],
    queryFn: async () => INITIAL_ESCALATIONS,
  })

  // Mutação: Alternar Interruptor de Emergência (Piloto Automático)
  const toggleAutoPilotMutation = useMutation({
    mutationFn: async (newVal: boolean) => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return newVal
    },
    onSuccess: (newVal) => {
      queryClient.setQueryData<WhatsAppConnectionState>(
        ['whatsapp-connection'],
        (prev) => (prev ? { ...prev, autoPilotActive: newVal } : INITIAL_WHATSAPP_STATE)
      )
    },
  })

  // Mutação: Simular Reconexão do WhatsApp via QR Code
  const reconnectMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200))
      return true
    },
    onSuccess: () => {
      queryClient.setQueryData<WhatsAppConnectionState>(
        ['whatsapp-connection'],
        (prev) => ({
          ...(prev || INITIAL_WHATSAPP_STATE),
          isConnected: true,
          uptime: 'Conectado há poucos instantes',
          lastPingAt: 'Agora mesmo',
        })
      )
      setIsQrModalOpen(false)
    },
  })

  // Mutação: Desconectar (para teste do lojista)
  const disconnectMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return false
    },
    onSuccess: () => {
      queryClient.setQueryData<WhatsAppConnectionState>(
        ['whatsapp-connection'],
        (prev) => ({
          ...(prev || INITIAL_WHATSAPP_STATE),
          isConnected: false,
          uptime: 'Desconectado',
        })
      )
    },
  })

  // Mutação: Resolver / Atender Ticket de Transbordo
  const resolveTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return ticketId
    },
    onSuccess: (resolvedId) => {
      queryClient.setQueryData<EscalationTicket[]>(
        ['escalation-tickets'],
        (prev = []) => prev.filter((t) => t.id !== resolvedId)
      )
      // Atualiza contador nas métricas
      queryClient.setQueryData<LiveControlMetrics>(
        ['live-metrics'],
        (prev) =>
          prev
            ? { ...prev, attentionNeededCount: Math.max(0, prev.attentionNeededCount - 1) }
            : INITIAL_LIVE_METRICS
      )
    },
  })

  // Função: Carregar Mais Atividades Anteriores
  const handleLoadMoreEvents = async () => {
    if (isLoadingMoreEvents || !hasMoreEvents) return
    setIsLoadingMoreEvents(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    queryClient.setQueryData<LiveActivityEvent[]>(['live-events'], (prev = []) => [
      ...prev,
      ...MORE_HISTORICAL_EVENTS.filter((m) => !prev.some((p) => p.id === m.id)),
    ])
    setIsLoadingMoreEvents(false)
    setHasMoreEvents(false) // Terminou o lote de histórico
  }

  // Função: Carregar Mais Tickets de Transbordo
  const handleLoadMoreEscalations = async () => {
    if (isLoadingMoreEscalations || !hasMoreEscalations) return
    setIsLoadingMoreEscalations(true)
    await new Promise((resolve) => setTimeout(resolve, 400))

    queryClient.setQueryData<EscalationTicket[]>(['escalation-tickets'], (prev = []) => [
      ...prev,
      ...MORE_ESCALATIONS.filter((m) => !prev.some((p) => p.id === m.id)),
    ])
    setIsLoadingMoreEscalations(false)
    setHasMoreEscalations(false)
  }

  return {
    agentName: agentConfig.name,
    connection,
    metrics,
    events,
    escalations,
    isQrModalOpen,
    openQrModal: () => setIsQrModalOpen(true),
    closeQrModal: () => setIsQrModalOpen(false),
    isReconnecting: reconnectMutation.isPending,
    isLoadingMoreEvents,
    hasMoreEvents,
    isLoadingMoreEscalations,
    hasMoreEscalations,
    handleReconnect: () => reconnectMutation.mutate(),
    handleDisconnect: () => disconnectMutation.mutate(),
    handleToggleAutoPilot: (active: boolean) => toggleAutoPilotMutation.mutate(active),
    handleResolveTicket: (id: string) => resolveTicketMutation.mutate(id),
    handleLoadMoreEvents,
    handleLoadMoreEscalations,
  }
}
