import React from 'react'
import {
  AlertTriangle,
  Phone,
  ExternalLink,
  Clock,
  ShieldCheck,
  Check,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import type { EscalationTicket } from '@/types/monitoring'

interface AttentionQueueProps {
  tickets: EscalationTicket[]
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
  onResolveTicket: (id: string) => void
}

export const AttentionQueue: React.FC<AttentionQueueProps> = ({
  tickets,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onResolveTicket,
}) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
      {/* Topo do Módulo de Transbordo */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Fila de Transbordo
              </h2>
              {tickets.length > 0 ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {tickets.length} aguardando
                </span>
              ) : (
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  Fila Vazia
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Clientes que solicitaram ajuda humana ou dúvidas pendentes
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo: Lista com Scroll Interno Dedicado ou Estado Vazio */}
      <div className="mt-4 flex-1 max-h-[500px] overflow-y-auto pr-2 space-y-3.5 scrollbar-thin">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 py-12 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-2xs">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-emerald-950">
              Tudo sob controle!
            </h3>
            <p className="mt-1 text-xs text-emerald-800 max-w-sm">
              Nenhuma conversa pendente de atenção humana neste instante. O atendente
              virtual está conduzindo todas as mensagens com autonomia.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/90 overflow-hidden">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col gap-3.5 p-4 sm:flex-row sm:items-center sm:justify-between bg-white hover:bg-slate-50/60 transition-colors"
                >
                  {/* Dados do Cliente e Motivo */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {ticket.customerName}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Phone className="h-3 w-3" />
                        <span>{ticket.formattedPhone}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" />
                        {ticket.requestedAt}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      <strong className="text-slate-800">Motivo:</strong>{' '}
                      {ticket.reason}
                    </p>
                  </div>

                  {/* Ações: Abrir no WhatsApp & Resolver */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                    <a
                      href={`https://wa.me/55${ticket.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-h-[38px] items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition active:scale-95"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Abrir no WhatsApp</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => onResolveTicket(ticket.id)}
                      className="flex min-h-[38px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:border-indigo-300 hover:text-indigo-600 transition active:scale-95"
                      title="Marcar como atendido/resolvido"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">Resolvido</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Ver Mais Chamados */}
            <div className="pt-2 text-center">
              {hasMore ? (
                <button
                  type="button"
                  disabled={isLoadingMore}
                  onClick={onLoadMore}
                  className="inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition active:scale-95 disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                      <span>Carregando outros chamados...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                      <span>Ver Mais Chamados Anteriores</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 py-1">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Todos os registros de transbordo foram carregados.</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AttentionQueue
