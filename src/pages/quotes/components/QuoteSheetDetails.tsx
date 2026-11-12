import React, { useState } from 'react'
import {
  Calendar,
  CalendarPlus,
  MapPin,
  MessageCircle,
  Sparkles,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Check,
} from 'lucide-react'
import type { Quote, QuoteStatus } from '@/types/quote'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { QuoteBriefingSection } from './QuoteBriefingSection'
import { QuoteAdditionalsTable } from './QuoteAdditionalsTable'
import { useQuoteDetails } from '../hooks/useQuoteDetails'

interface QuoteSheetDetailsProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  quote: Quote | null
  onUpdateQuote: (quote: Quote) => void
  onReserveSchedule?: (quote: Quote, date: string, time: string) => void
}

export const QuoteSheetDetails: React.FC<QuoteSheetDetailsProps> = ({
  isOpen,
  onClose,
  quote,
  onUpdateQuote,
  onReserveSchedule,
}) => {
  const {
    handleStatusChange,
    handleBasePriceChange,
    handleAddAdditional,
    handleRemoveAdditional,
    handleAddBriefingField,
    handleRemoveBriefingField,
    handleNotesChange,
    whatsappUrl,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    scheduleSuccess,
    setScheduleSuccess,
  } = useQuoteDetails({ quote, onUpdateQuote })

  const [reserveDate, setReserveDate] = useState(quote?.targetDate || '')
  const [reserveTime, setReserveTime] = useState('14:00')

  if (!quote) return null

  const isAI = quote.origin === 'ai'

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case 'pending':
        return 'border-amber-300 bg-amber-50 text-amber-700'
      case 'analyzing':
        return 'border-blue-300 bg-blue-50 text-blue-700'
      case 'sent':
        return 'border-indigo-300 bg-indigo-50 text-indigo-700'
      case 'approved':
        return 'border-emerald-300 bg-emerald-50 text-emerald-700'
      case 'declined':
        return 'border-rose-300 bg-rose-50 text-rose-700'
    }
  }

  const handleConfirmReservation = () => {
    if (onReserveSchedule) {
      onReserveSchedule(quote, reserveDate || quote.targetDate || '', reserveTime)
    }
    setScheduleSuccess(true)
    setTimeout(() => {
      setIsScheduleModalOpen(false)
      setScheduleSuccess(false)
    }, 1800)
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-white text-slate-900 border-l border-slate-200"
        >
          {/* Header do Sheet */}
          <SheetHeader className="border-b border-slate-200/80 bg-slate-50/80 p-5 sm:p-6 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-extrabold text-slate-900">
                    {quote.code}
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      isAI
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-700 text-[11px] font-semibold flex items-center gap-1'
                        : 'border-slate-300 bg-slate-100 text-slate-700 text-[11px] font-semibold flex items-center gap-1'
                    }
                  >
                    {isAI ? (
                      <>
                        <Sparkles className="h-3 w-3" />
                        <span>IA (WhatsApp)</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-3 w-3" />
                        <span>Manual</span>
                      </>
                    )}
                  </Badge>
                </div>

                <SheetTitle className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  {quote.serviceName}
                </SheetTitle>
              </div>

              <SheetClose className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition cursor-pointer" />
            </div>

            {/* Ações Rápidas do Header: Status Select & Enviar WhatsApp */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2.5">
              {/* Select de Status */}
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-slate-500">Status:</label>
                <select
                  value={quote.status}
                  onChange={(e) => handleStatusChange(e.target.value as QuoteStatus)}
                  className={`text-xs font-bold rounded-xl border px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer ${getStatusColor(
                    quote.status
                  )}`}
                >
                  <option value="pending">Aguardando Retorno</option>
                  <option value="analyzing">Em Precificação</option>
                  <option value="sent">Proposta Enviada</option>
                  <option value="approved">Proposta Aprovada</option>
                  <option value="declined">Recusado / Não Fechou</option>
                </select>
              </div>

              {/* Botão de Destaque WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Enviar Proposta no WhatsApp</span>
              </a>
            </div>
          </SheetHeader>

          {/* Conteúdo com Scroll */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* 1. Dados do Solicitante / Contato */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Dados do Solicitante
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" /> Contato Comercial
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm">
                    {quote.customerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{quote.customerName}</p>
                    <p className="text-xs text-slate-500 font-mono">{quote.customerPhone}</p>
                  </div>
                </div>

                {quote.targetDate && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200/60">
                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Data Prevista: {quote.targetDate}</span>
                  </div>
                )}
              </div>

              {quote.location && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{quote.location}</span>
                </div>
              )}
            </div>

            {/* 2. Bloco Briefing Coletado (Universal) */}
            <QuoteBriefingSection
              briefing={quote.briefing}
              onAddField={handleAddBriefingField}
              onRemoveField={handleRemoveBriefingField}
            />

            {/* 3. Bloco Composição Financeira & Adicionais */}
            <QuoteAdditionalsTable
              basePrice={quote.basePrice}
              additionals={quote.additionals}
              totalEstimatedPrice={quote.totalEstimatedPrice}
              onBasePriceChange={handleBasePriceChange}
              onAddAdditional={handleAddAdditional}
              onRemoveAdditional={handleRemoveAdditional}
            />

            {/* 4. Observações Internas */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Observações Internas da Equipe
                </span>
              </div>
              <textarea
                rows={2}
                value={quote.notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Insira notas sobre a negociação, descontos concedidos ou prazos combinados..."
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-700"
              />
            </div>
          </div>

          {/* Rodapé de Ações com Integração de Agenda */}
          <div className="border-t border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              onClick={() => {
                setReserveDate(quote.targetDate || '')
                setIsScheduleModalOpen(true)
              }}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto rounded-xl text-xs h-9 font-semibold text-indigo-700 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1.5"
            >
              <CalendarPlus className="h-4 w-4 text-indigo-600" />
              <span>Reservar Data na Agenda</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onClose(false)}
              className="w-full sm:w-auto rounded-xl text-xs h-9 ml-auto"
            >
              Fechar Painel
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Diálogo de Confirmação: Reservar Data na Agenda */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white border border-slate-200">
          <DialogHeader>
            <div className="flex items-center gap-2 text-indigo-600">
              <CalendarPlus className="h-5 w-5" />
              <DialogTitle className="text-base font-bold text-slate-900">
                Reservar Data na Agenda
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Crie o compromisso para a execução desta proposta sem duplicidade de digitação.
            </DialogDescription>
          </DialogHeader>

          {scheduleSuccess ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">
                Data Reservada com Sucesso!
              </p>
              <p className="text-xs text-emerald-700">
                O evento para <strong>{quote.customerName}</strong> foi sincronizado na Agenda.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1 text-xs">
                <p>
                  <strong>Cliente:</strong> {quote.customerName} ({quote.customerPhone})
                </p>
                <p>
                  <strong>Serviço:</strong> {quote.serviceName}
                </p>
                <p>
                  <strong>Valor da Proposta:</strong> {quote.totalEstimatedPrice > 0 ? `R$ ${quote.totalEstimatedPrice.toFixed(2)}` : 'A definir'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Data da Execução *
                  </label>
                  <input
                    type="date"
                    value={reserveDate}
                    onChange={(e) => setReserveDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Horário de Início
                  </label>
                  <input
                    type="time"
                    value={reserveTime}
                    onChange={(e) => setReserveTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {!reserveDate && (
                <div className="flex items-center gap-1.5 text-xs text-amber-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Defina a data prevista para concluir a reserva.</span>
                </div>
              )}
            </div>
          )}

          {!scheduleSuccess && (
            <DialogFooter className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsScheduleModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                disabled={!reserveDate}
                onClick={handleConfirmReservation}
                className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 font-semibold"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Confirmar Reserva</span>
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
