import React, { useState } from 'react'
import { Plus, X, Sparkles, Check } from 'lucide-react'
import type { QuoteBriefingField } from '@/types/quote'
import { Button } from '@/components/ui/button'

interface QuoteBriefingSectionProps {
  briefing: QuoteBriefingField[]
  onAddField?: (label: string, value: string) => void
  onRemoveField?: (index: number) => void
  isEditable?: boolean
}

export const QuoteBriefingSection: React.FC<QuoteBriefingSectionProps> = ({
  briefing,
  onAddField,
  onRemoveField,
  isEditable = true,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newValue, setNewValue] = useState('')

  const handleSaveField = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newLabel.trim() || !newValue.trim() || !onAddField) return

    onAddField(newLabel.trim(), newValue.trim())
    setNewLabel('')
    setNewValue('')
    setIsAdding(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Briefing Coletado & Detalhes
          </h4>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
            {briefing.length} itens
          </span>
        </div>

        {isEditable && onAddField && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar Campo</span>
          </button>
        )}
      </div>

      {/* Grid de Cards de Briefing */}
      {briefing.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
          Nenhum detalhe de briefing registrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {briefing.map((field, idx) => (
            <div
              key={`${field.label}-${idx}`}
              className="group relative rounded-xl border border-slate-200/90 bg-slate-50/70 p-3 transition hover:bg-white hover:shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 line-clamp-1">
                  {field.label}
                </span>

                {isEditable && onRemoveField && (
                  <button
                    type="button"
                    onClick={() => onRemoveField(idx)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition p-0.5 rounded cursor-pointer"
                    title="Remover campo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-800 leading-snug">
                {field.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Form Inline para Adicionar Novo Campo de Briefing */}
      {isAdding && (
        <form
          onSubmit={handleSaveField}
          className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">Novo Dado do Briefing</span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                Nome do Campo (Pergunta)
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Ex: Metragem, Restrições..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                Valor (Resposta)
              </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Ex: 50 metros, Sem glúten..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(false)}
              className="h-7 text-xs rounded-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!newLabel.trim() || !newValue.trim()}
              className="h-7 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
            >
              <Check className="h-3 w-3" />
              <span>Salvar Campo</span>
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
