import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  User,
  MessageCircle,
  Tag,
  DollarSign,
  FileText,
  AlertCircle,
  Edit3,
  XCircle,
  CheckCircle2,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { Appointment } from '@/types/schedule'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'

interface AppointmentSheetDetailsProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  appointment: Appointment | null
  onCancelAppointment: (id: string) => void
  onEditAppointment?: (appointment: Appointment) => void
}

export const AppointmentSheetDetails: React.FC<AppointmentSheetDetailsProps> = ({
  isOpen,
  onClose,
  appointment,
  onCancelAppointment,
  onEditAppointment,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [tempNotes, setTempNotes] = useState('')
  const [savedNotes, setSavedNotes] = useState<string | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  if (!appointment) return null

  const isBlocked = appointment.status === 'blocked'
  const isCancelled = appointment.status === 'cancelled'
  const isManual = appointment.origin === 'manual' || appointment.channel === 'manual'
  const currentNotes = savedNotes ?? appointment.notes ?? ''

  const formattedDate = (() => {
    try {
      const parsed = parseISO(appointment.date)
      const text = format(parsed, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      return text.charAt(0).toUpperCase() + text.slice(1)
    } catch {
      return appointment.date
    }
  })()

  const cleanPhone = appointment.customerPhone.replace(/\D/g, '')
  const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
  const whatsappUrl = `https://wa.me/${fullPhone}`

  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'confirmed':
        return (
          <Badge
            variant="outline"
            className="border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold"
          >
            {isManual ? 'Confirmado (Manual)' : 'Confirmado pelo Bot'}
          </Badge>
        )
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-50 text-amber-700 font-semibold"
          >
            Pendente de Confirmação
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge
            variant="outline"
            className="border-rose-300 bg-rose-50 text-rose-700 font-semibold"
          >
            Cancelado
          </Badge>
        )
      case 'blocked':
        return (
          <Badge
            variant="outline"
            className="border-slate-300 bg-slate-100 text-slate-700 font-semibold"
          >
            Período Bloqueado
          </Badge>
        )
    }
  }

  const handleEditClick = () => {
    if (onEditAppointment) {
      onEditAppointment(appointment)
    }
  }

  const handleConfirmCancel = () => {
    onCancelAppointment(appointment.id)
    setShowCancelConfirm(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full bg-white text-slate-900 border-l border-slate-200"
      >
        {/* Header do Sheet */}
        <SheetHeader className="border-b border-slate-200/80 bg-slate-50/80 p-5 sm:p-6 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-lg font-bold text-slate-900">
                  {isBlocked ? 'Período Bloqueado' : 'Detalhes do Horário'}
                </SheetTitle>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {getStatusBadge()}
                {!isBlocked && (
                  <Badge
                    variant="outline"
                    className={
                      isManual
                        ? 'border-slate-300 bg-slate-100 text-slate-700 font-semibold flex items-center gap-1'
                        : 'border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-1'
                    }
                  >
                    {isManual ? (
                      <>
                        <UserCheck className="h-3 w-3" />
                        <span>Agendado Manualmente</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3" />
                        <span>Agendado via IA (WhatsApp)</span>
                      </>
                    )}
                  </Badge>
                )}
              </div>
            </div>

            <SheetClose className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition" />
          </div>

          {/* Horário em Destaque */}
          <div className="mt-4 rounded-xl border border-indigo-100 bg-white p-3.5 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700">
              <Clock className="h-4 w-4" />
              <span className="font-bold text-sm">
                {appointment.startTime} às {appointment.endTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{appointment.date}</span>
            </div>
          </div>
        </SheetHeader>

        {/* Corpo com scroll */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* 1. Dados do Cliente (se não for bloqueio) */}
          {!isBlocked ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Dados do Cliente
                </span>
                <span className="text-[11px] font-medium flex items-center gap-1">
                  {isManual ? (
                    <span className="text-slate-600 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" /> Balcão / Manual
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Capturado via IA
                    </span>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm">
                    {appointment.customerName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {appointment.customerName}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {appointment.customerPhone}
                    </p>
                  </div>
                </div>

                {appointment.customerPhone && appointment.customerPhone !== '-' && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-100/60 p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Motivo do Bloqueio
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {appointment.blockReason || appointment.serviceName}
              </p>
              <p className="text-xs text-slate-500">
                Nenhum cliente pode agendar horários que coincidam com este intervalo.
              </p>
            </div>
          )}

          {/* 2. Serviço Agendado e Valor Estimado */}
          {!isBlocked && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Serviço e Profissional
                </span>
                {onEditAppointment && (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    <span>Editar</span>
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-900">
                    {appointment.serviceName}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{formatCurrency(appointment.price)}</span>
                </div>
              </div>

              {appointment.professional && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Profissional designado:</span>
                  <span className="font-semibold text-slate-700">
                    {appointment.professional}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 3. Observações / Informações */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Observações Internas
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditingNotes(!isEditingNotes)
                  setTempNotes(currentNotes)
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" />
                {isEditingNotes ? 'Fechar' : 'Editar'}
              </button>
            </div>

            {isEditingNotes ? (
              <div className="space-y-2 pt-1">
                <textarea
                  rows={3}
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Insira notas sobre preferências do cliente..."
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    setSavedNotes(tempNotes)
                    setIsEditingNotes(false)
                  }}
                  className="w-full h-8 text-xs rounded-xl"
                >
                  Salvar Observações
                </Button>
              </div>
            ) : (
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {currentNotes ||
                  'Nenhuma observação especial informada pelo cliente ou equipe.'}
              </p>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>Data completa: {formattedDate}</span>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="border-t border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 shrink-0 flex flex-col gap-2">
          {showCancelConfirm ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-2">
              <p className="text-xs font-semibold text-rose-800">
                Deseja realmente cancelar este horário?
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleConfirmCancel}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-7 rounded-lg"
                >
                  Sim, Cancelar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelConfirm(false)}
                  className="text-xs h-7 rounded-lg"
                >
                  Voltar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              {!isCancelled ? (
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition border border-rose-200"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancelar Horário</span>
                </button>
              ) : (
                <span className="text-xs text-rose-600 font-semibold">
                  Horário Cancelado
                </span>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {!isBlocked && onEditAppointment && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="rounded-xl text-xs h-9 flex items-center gap-1.5"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Editar</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onClose(false)}
                  className="rounded-xl text-xs h-9"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
