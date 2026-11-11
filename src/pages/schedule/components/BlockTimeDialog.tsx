import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { BlockTimeFormData } from '@/types/schedule'

interface BlockTimeDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (data: BlockTimeFormData) => void
  defaultDate?: string
}

const COMMON_REASONS = [
  'Intervalo de Almoço',
  'Consulta Médica',
  'Compromisso Pessoal / Folga',
  'Manutenção / Limpeza do Espaço',
]

export const BlockTimeDialog: React.FC<BlockTimeDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  defaultDate = '2026-11-11',
}) => {
  const [date, setDate] = useState(defaultDate)
  const [startTime, setStartTime] = useState('12:00')
  const [endTime, setEndTime] = useState('13:00')
  const [reason, setReason] = useState(COMMON_REASONS[0])
  const [customReason, setCustomReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm({
      date,
      startTime,
      endTime,
      reason: customReason.trim() ? customReason : reason,
    })
    setCustomReason('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle>Bloquear Horário na Agenda</DialogTitle>
                <DialogDescription className="mt-1">
                  A IA não oferecerá este período para agendamentos de clientes.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Campo Data */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Data:</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            {/* Início e Término */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Horário Início:
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Horário Fim:
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Motivo do Bloqueio */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Motivo do Bloqueio:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {COMMON_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setReason(r)
                      setCustomReason('')
                    }}
                    className={`text-left px-2.5 py-1.5 text-[11px] rounded-xl border transition ${
                      reason === r && !customReason
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Ou digite outro motivo..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 mt-1"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium"
            >
              Confirmar Bloqueio
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
