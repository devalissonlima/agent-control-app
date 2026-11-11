import React from 'react'
import {
  Bot,
  QrCode,
  Power,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import type { WhatsAppConnectionState } from '@/types/monitoring'
import { FieldTooltip } from '@/components/ui/FieldTooltip'

interface ConnectionStatusHeaderProps {
  agentName: string
  connection: WhatsAppConnectionState
  onToggleAutoPilot: (active: boolean) => void
  onOpenQrModal: () => void
  onDisconnectToggle: () => void
}

export const ConnectionStatusHeader: React.FC<ConnectionStatusHeaderProps> = ({
  agentName,
  connection,
  onToggleAutoPilot,
  onOpenQrModal,
  onDisconnectToggle,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Lado Esquerdo: Identidade do Atendente & Status */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3.5">
            {/* Ícone Humanizado do Atendente com Indicador WhatsApp */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md ring-4 ring-indigo-500/15">
              <Bot className="h-6 w-6" />

              {/* Indicador de Status no Canto do Ícone */}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-xs">
                {connection.isConnected ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                )}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Nome do Atendente Configurado */}
                <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {agentName || 'Sofia da Pizzaria Bela Massa'}
                </h1>

                {/* Badge de Status no WhatsApp */}
                {connection.isConnected ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online e Atendendo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    WhatsApp Desconectado
                  </span>
                )}
              </div>

              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                  <Sparkles className="h-3 w-3" />
                  Atendente IA WhatsApp
                </span>
                <span>•</span>
                <span>{connection.phoneNumber}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  Janela: Últimas 24h
                </span>
                <span>•</span>
                <span className="font-medium text-slate-700">
                  {connection.uptime}
                </span>
                <span>•</span>
                <button
                  type="button"
                  onClick={onDisconnectToggle}
                  className="text-xs text-slate-400 underline hover:text-slate-600 transition"
                  title="Simular queda/recuperação de conexão"
                >
                  {connection.isConnected ? 'Simular Queda' : 'Restaurar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Interruptor de Emergência & Ações */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 lg:border-t-0 lg:pt-0">
          {/* Se desconectado: Botão de Reconectar QR Code */}
          {!connection.isConnected && (
            <button
              type="button"
              onClick={onOpenQrModal}
              className="flex min-h-[44px] animate-bounce items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 transition active:scale-95 sm:text-sm"
            >
              <QrCode className="h-4 w-4" />
              <span>Reconectar WhatsApp (QR Code)</span>
            </button>
          )}

          {/* Interruptor de Emergência (Switch) */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <Power
                className={`h-4 w-4 ${
                  connection.autoPilotActive
                    ? 'text-emerald-600'
                    : 'text-amber-500'
                }`}
              />
              <span className="text-xs font-bold text-slate-800">
                Atendimento Automático:
              </span>
              <span
                className={`text-xs font-extrabold ${
                  connection.autoPilotActive
                    ? 'text-emerald-600'
                    : 'text-amber-600'
                }`}
              >
                {connection.autoPilotActive ? 'Ativo' : 'Pausado'}
              </span>
              <FieldTooltip
                label="Interruptor de Emergência"
                content="Pause aqui caso queira assumir o WhatsApp manualmente ou interromper o envio de mensagens automáticas."
              />
            </div>

            {/* Switch UI Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={connection.autoPilotActive}
              onClick={() => onToggleAutoPilot(!connection.autoPilotActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600/30 ${
                connection.autoPilotActive ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  connection.autoPilotActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Botão de Verificação de Sessão */}
          {connection.isConnected && (
            <button
              type="button"
              onClick={onOpenQrModal}
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
              title="Verificar Sessão do WhatsApp"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Status da Sessão</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConnectionStatusHeader
