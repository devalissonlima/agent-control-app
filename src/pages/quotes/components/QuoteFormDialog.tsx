import React from 'react'
import {
  FileSpreadsheet,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Sparkles,
  MapPin,
  Tag,
  Check,
} from 'lucide-react'
import type { QuoteFormData } from '@/types/quote'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CustomerSelectCombobox } from '@/pages/schedule/components/CustomerSelectCombobox'
import {
  useQuoteForm,
  COMMON_BRIEFING_TEMPLATES,
} from '../hooks/useQuoteForm'
import { formatCurrency } from '@/utils/formatters'

interface QuoteFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: QuoteFormData) => void
}

interface QuoteFormInnerProps {
  onClose: () => void
  onSave: (data: QuoteFormData) => void
}

const QuoteFormInner: React.FC<QuoteFormInnerProps> = ({ onClose, onSave }) => {
  const {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    serviceName,
    setServiceName,
    targetDate,
    setTargetDate,
    location,
    setLocation,
    basePrice,
    setBasePrice,
    notes,
    setNotes,
    briefingFields,
    addBriefingRow,
    updateBriefingRow,
    removeBriefingRow,
    additionals,
    newAddName,
    setNewAddName,
    newAddQty,
    setNewAddQty,
    newAddPrice,
    setNewAddPrice,
    addAdditionalItem,
    removeAdditionalItem,
    errors,
    handleSubmit,
  } = useQuoteForm({ onSave, onClose })

  const additionalsTotal = additionals.reduce((sum, item) => sum + item.totalPrice, 0)
  const totalEstimated = (Number(basePrice) || 0) + additionalsTotal

  return (
    <>
      <DialogHeader className="p-5 sm:p-6 border-b border-slate-200/80 bg-slate-50/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-700 shadow-2xs">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Novo Orçamento Manual
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Registre uma proposta sob medida negociada no balcão, telefone ou reunião presencial.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        {/* 1. Cliente & WhatsApp */}
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

        {/* 2. Objeto Comercial: Serviço, Data Pretendida e Local */}
        <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-indigo-600" />
            <span>Serviço ou Pacote Comercial *</span>
          </label>

          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Ex: Coquetel Finger Food, Bancada Quartzo, Cobertura Casamento..."
            className={`w-full rounded-xl border p-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.serviceName
                ? 'border-rose-300 focus:border-rose-500'
                : 'border-slate-200 focus:border-indigo-500'
            }`}
          />
          {errors.serviceName && (
            <p className="text-xs text-rose-500 font-medium">{errors.serviceName}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>Data Prevista para Execução</span>
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400" />
                <span>Localização / Cidade</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Cotia - SP ou Bairro Perdizes"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Briefing Rápido (Perguntas e Respostas Dinâmicas) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Campos de Briefing & Especificações</span>
            </label>
            <button
              type="button"
              onClick={() => addBriefingRow()}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Adicionar Campo</span>
            </button>
          </div>

          {/* Sugestões Rápidas de Templates */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {COMMON_BRIEFING_TEMPLATES.map((tpl) => (
              <button
                key={tpl.label}
                type="button"
                onClick={() => addBriefingRow(tpl.label, '')}
                className="text-[11px] px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                + {tpl.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {briefingFields.map((field, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateBriefingRow(idx, 'label', e.target.value)}
                  placeholder="Pergunta (ex: Metragem)"
                  className="w-1/3 rounded-xl border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => updateBriefingRow(idx, 'value', e.target.value)}
                  placeholder="Resposta (ex: 4.8 metros)"
                  className="flex-1 rounded-xl border border-slate-200 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {briefingFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBriefingRow(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition rounded-lg cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Composição Financeira Inicial */}
        <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              <span>Valores & Itens Adicionais</span>
            </label>
            <span className="font-mono text-xs font-bold text-slate-900">
              Total: {formatCurrency(totalEstimated)}
            </span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Valor Base do Serviço (R$) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={basePrice || ''}
              onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
              className="w-full sm:w-48 rounded-xl border border-slate-200 bg-white p-2.5 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {errors.basePrice && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.basePrice}</p>
            )}
          </div>

          {/* Adicionar Opcional Rápido */}
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-600 block mb-2">
              Itens Adicionais / Opcionais:
            </span>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={newAddName}
                onChange={(e) => setNewAddName(e.target.value)}
                placeholder="Ex: Cuba esculpida, Hora extra..."
                className="w-full sm:flex-1 rounded-xl border border-slate-200 bg-white p-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  min="1"
                  value={newAddQty}
                  onChange={(e) => setNewAddQty(parseInt(e.target.value, 10) || 1)}
                  placeholder="Qtd"
                  className="w-16 rounded-xl border border-slate-200 bg-white p-2 text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newAddPrice || ''}
                  onChange={(e) => setNewAddPrice(parseFloat(e.target.value) || 0)}
                  placeholder="R$"
                  className="w-24 rounded-xl border border-slate-200 bg-white p-2 text-xs font-mono text-center font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={addAdditionalItem}
                  disabled={!newAddName.trim()}
                  className="h-8 rounded-xl text-xs bg-slate-800 hover:bg-slate-900 text-white shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Incluir
                </Button>
              </div>
            </div>

            {/* Lista dos Adicionais Inseridos */}
            {additionals.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {additionals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200"
                  >
                    <span className="font-semibold text-slate-800">
                      {item.quantity}x {item.name}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(item.totalPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAdditionalItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. Observações Internas */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Observações Internas
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: Negociado com desconto de 5% à vista; aguardando medição..."
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-700"
          />
        </div>

        {/* Rodapé de Ações */}
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
            className="rounded-xl text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-2xs flex items-center gap-1.5"
          >
            <Check className="h-4 w-4" />
            <span>Criar Orçamento</span>
          </Button>
        </DialogFooter>
      </form>
    </>
  )
}

export const QuoteFormDialog: React.FC<QuoteFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-white border border-slate-200">
        {isOpen && <QuoteFormInner onClose={onClose} onSave={onSave} />}
      </DialogContent>
    </Dialog>
  )
}
