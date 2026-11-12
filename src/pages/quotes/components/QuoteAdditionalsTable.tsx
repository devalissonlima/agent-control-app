import React, { useState } from 'react'
import { Plus, Trash2, DollarSign, Calculator, Check, X } from 'lucide-react'
import type { QuoteAdditionalItem } from '@/types/quote'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'

interface QuoteAdditionalsTableProps {
  basePrice: number
  additionals: QuoteAdditionalItem[]
  totalEstimatedPrice: number
  onBasePriceChange?: (price: number) => void
  onAddAdditional?: (name: string, quantity: number, unitPrice: number) => void
  onRemoveAdditional?: (id: string) => void
  isEditable?: boolean
}

export const QuoteAdditionalsTable: React.FC<QuoteAdditionalsTableProps> = ({
  basePrice,
  additionals,
  totalEstimatedPrice,
  onBasePriceChange,
  onAddAdditional,
  onRemoveAdditional,
  isEditable = true,
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQty, setNewItemQty] = useState(1)
  const [newItemPrice, setNewItemPrice] = useState<number>(100)

  const additionalsTotal = additionals.reduce((sum, item) => sum + item.totalPrice, 0)

  const handleSaveAdditional = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!newItemName.trim() || !onAddAdditional) return

    onAddAdditional(
      newItemName.trim(),
      Math.max(1, newItemQty || 1),
      Math.max(0, newItemPrice || 0)
    )

    setNewItemName('')
    setNewItemQty(1)
    setNewItemPrice(100)
    setIsAdding(false)
  }

  return (
    <div className="space-y-4">
      {/* Header da Seção Financeira */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Calculator className="h-4 w-4 text-indigo-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Composição Financeira & Adicionais
          </h4>
        </div>

        {isEditable && onAddAdditional && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Adicionar Item Extra</span>
          </button>
        )}
      </div>

      {/* 1. Valor Base do Pacote / Serviço */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-slate-900 block">
            Valor Base do Pacote / Mão de Obra
          </span>
          <span className="text-[11px] text-slate-500">
            Custo fixo principal para o serviço contratado
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isEditable && onBasePriceChange ? (
            <div className="relative w-36">
              <DollarSign className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={basePrice || ''}
                onChange={(e) => onBasePriceChange(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          ) : (
            <span className="font-mono font-bold text-sm text-slate-900">
              {formatCurrency(basePrice)}
            </span>
          )}
        </div>
      </div>

      {/* 2. Lista / Tabela de Itens Adicionais */}
      <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
        <div className="bg-slate-50/80 px-3.5 py-2 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 grid grid-cols-12 gap-2">
          <div className="col-span-6 sm:col-span-7">Item Opcional / Troca</div>
          <div className="col-span-2 text-center">Qtd</div>
          <div className="col-span-3 sm:col-span-2 text-right">Subtotal</div>
          {isEditable && <div className="col-span-1 text-center"></div>}
        </div>

        {additionals.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 italic">
            Nenhum item adicional ou opcional incluído.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {additionals.map((item) => (
              <div
                key={item.id}
                className="px-3.5 py-2.5 text-xs grid grid-cols-12 gap-2 items-center hover:bg-slate-50/50 transition"
              >
                <div className="col-span-6 sm:col-span-7">
                  <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {formatCurrency(item.unitPrice)} / un
                  </p>
                </div>
                <div className="col-span-2 text-center font-mono font-semibold text-slate-700">
                  {item.quantity}x
                </div>
                <div className="col-span-3 sm:col-span-2 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(item.totalPrice)}
                </div>
                {isEditable && onRemoveAdditional && (
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => onRemoveAdditional(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition p-1 rounded cursor-pointer"
                      title="Remover item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulário Inline para Adicionar Novo Item Extra */}
      {isAdding && (
        <form
          onSubmit={handleSaveAdditional}
          className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">
              Novo Item Adicional / Troca
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
            <div className="sm:col-span-3">
              <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                Descrição do Item
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Ex: Ilha de Caipirinhas, Rodabanca..."
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <div className="sm:col-span-1">
              <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                Qtd
              </label>
              <input
                type="number"
                min="1"
                value={newItemQty}
                onChange={(e) => setNewItemQty(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-center font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-semibold text-slate-600 block mb-0.5">
                Valor Unitário (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newItemPrice || ''}
                onChange={(e) => setNewItemPrice(parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              disabled={!newItemName.trim()}
              className="h-7 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
            >
              <Check className="h-3 w-3" />
              <span>Salvar Item</span>
            </Button>
          </div>
        </form>
      )}

      {/* 3. Card de Resumo com o Valor Total Calculado */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-slate-50 to-emerald-50/60 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
              Valor Total Estimado da Proposta
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>Base: {formatCurrency(basePrice)}</span>
              <span>+</span>
              <span>Adicionais ({additionals.length}): {formatCurrency(additionalsTotal)}</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-mono">
              {formatCurrency(totalEstimatedPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
