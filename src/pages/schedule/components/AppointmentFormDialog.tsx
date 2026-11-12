import React from 'react'
import {
  Calendar,
  Clock,
  DollarSign,
  Tag,
  User,
  FileText,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import type { Appointment, AppointmentFormData } from '@/types/schedule'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CustomerSelectCombobox } from './CustomerSelectCombobox'
import {
  useAppointmentForm,
  DURATION_OPTIONS,
  COMMON_SERVICES,
  TEAM_MEMBERS,
} from '../hooks/useAppointmentForm'

interface AppointmentFormDialogProps {
  isOpen: boolean
  onClose: () => void
  initialAppointment?: Appointment | null
  slotPrefill?: { date: string; startTime: string } | null
  onSave: (data: AppointmentFormData) => void
}

interface AppointmentFormInnerProps {
  onClose: () => void
  initialAppointment?: Appointment | null
  slotPrefill?: { date: string; startTime: string } | null
  onSave: (data: AppointmentFormData) => void
}

const AppointmentFormInner: React.FC<AppointmentFormInnerProps> = ({
  onClose,
  initialAppointment,
  slotPrefill,
  onSave,
}) => {
  const {
    isEditing,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    serviceName,
    setServiceName,
    price,
    setPrice,
    date,
    setDate,
    startTime,
    handleStartTimeChange,
    endTime,
    handleEndTimeChange,
    durationMinutes,
    handleDurationChange,
    professional,
    setProfessional,
    notes,
    setNotes,
    errors,
    handleSubmit,
    handleSelectPredefinedService,
  } = useAppointmentForm({
    initialAppointment,
    slotPrefill,
    onSave,
    onClose,
  })

  return (
    <>
      <DialogHeader className="p-5 sm:p-6 border-b border-slate-200/80 bg-slate-50/80">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-700 shadow-2xs">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {isEditing ? 'Editar Agendamento' : 'Novo Agendamento Manual'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {isEditing
                  ? 'Atualize os dados e horários do compromisso.'
                  : 'Cadastre um agendamento diretamente no balcão ou por telefone.'}
              </DialogDescription>
            </div>
          </div>

          <Badge
            variant="outline"
            className={
              isEditing && initialAppointment?.origin === 'ai'
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-1 shrink-0'
                : 'border-slate-300 bg-slate-100 text-slate-700 font-semibold flex items-center gap-1 shrink-0'
            }
          >
            {isEditing && initialAppointment?.origin === 'ai' ? (
              <>
                <Sparkles className="h-3 w-3" />
                <span>Origem IA</span>
              </>
            ) : (
              <>
                <UserCheck className="h-3 w-3" />
                <span>Manual</span>
              </>
            )}
          </Badge>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        {/* 1. Identificação do Cliente (com autocomplete do CRM) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Cliente & Contato WhatsApp *
          </label>
          <CustomerSelectCombobox
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            customerPhone={customerPhone}
            onCustomerPhoneChange={setCustomerPhone}
          />
          {errors.customerName && (
            <p className="text-xs text-rose-500 font-medium">{errors.customerName}</p>
          )}
          {errors.customerPhone && (
            <p className="text-xs text-rose-500 font-medium">{errors.customerPhone}</p>
          )}
        </div>

        {/* 2. Procedimento / Serviço e Preço Estimado */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-indigo-600" />
              <span>Procedimento / Serviço *</span>
            </label>
            <span className="text-[11px] text-slate-400">Sugestões rápidas</span>
          </div>

          {/* Pílulas de serviços comuns */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {COMMON_SERVICES.slice(0, 5).map((srv) => (
              <button
                key={srv.name}
                type="button"
                onClick={() => handleSelectPredefinedService(srv.name)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  serviceName === srv.name
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                    : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {srv.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Nome do serviço ou procedimento..."
                className={`w-full rounded-xl border p-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                  errors.serviceName
                    ? 'border-rose-300 focus:border-rose-500'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {errors.serviceName && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.serviceName}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price || ''}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  placeholder="0,00"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.price}</p>
              )}
            </div>
          </div>
        </div>

        {/* 3. Data e Intervalo de Horário */}
        <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-indigo-600" />
              <span>Data & Horário *</span>
            </label>
            <span className="text-[11px] text-indigo-700 font-semibold">
              Duração: {durationMinutes} min
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {errors.date && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Início
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {errors.startTime && (
                <p className="text-xs text-rose-500 font-medium mt-1">
                  {errors.startTime}
                </p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Término
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => handleEndTimeChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {errors.endTime && (
                <p className="text-xs text-rose-500 font-medium mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Duração com botões de atalho */}
          <div>
            <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
              Duração estimada:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleDurationChange(opt.value)}
                  className={`py-1 px-2 text-xs rounded-lg font-semibold border transition text-center cursor-pointer ${
                    durationMinutes === opt.value
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Profissional / Recurso Designado */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-indigo-600" />
            <span>Profissional / Atendente Responsável</span>
          </label>
          <div className="flex gap-2">
            <select
              value={professional}
              onChange={(e) => setProfessional(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Selecione um profissional da equipe...</option>
              {TEAM_MEMBERS.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Observações Internas */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
            <FileText className="h-3.5 w-3.5 text-indigo-600" />
            <span>Observações / Recomendações Internas</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Cliente tem preferência por café; procedimento precisa de preparação prévia..."
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Rodapé / Botões */}
        <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs h-9 px-4"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            className="rounded-xl text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-2xs"
          >
            {isEditing ? 'Salvar Alterações' : 'Salvar Agendamento'}
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  isOpen,
  onClose,
  initialAppointment,
  slotPrefill,
  onSave,
}) => {
  // Gera uma key única para recriar o formulário com estado fresco quando os alvos mudam
  const formKey = isOpen
    ? `${initialAppointment?.id || 'new'}-${slotPrefill?.date || ''}-${slotPrefill?.startTime || ''}`
    : 'closed'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-white border border-slate-200">
        {isOpen && (
          <AppointmentFormInner
            key={formKey}
            onClose={onClose}
            initialAppointment={initialAppointment}
            slotPrefill={slotPrefill}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
