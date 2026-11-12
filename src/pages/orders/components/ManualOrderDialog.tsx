import React, { useState } from 'react'
import { Plus, Trash2, Store, MapPin, Receipt } from 'lucide-react'
import type { Order, OrderDeliveryType, OrderItem } from '@/types/order'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ManualOrderDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddOrder: (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'createdAtTimestamp' | 'status'>
  ) => void
}

const COMMON_PAYMENTS = ['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro']

export const ManualOrderDialog: React.FC<ManualOrderDialogProps> = ({
  isOpen,
  onClose,
  onAddOrder,
}) => {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>('pickup')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Pix')
  const [generalNotes, setGeneralNotes] = useState('')
  const [deliveryFee, setDeliveryFee] = useState<number>(0)

  const [items, setItems] = useState<OrderItem[]>([
    { name: '', quantity: 1, price: 0, notes: '' },
  ])

  const handleAddItem = () => {
    setItems((prev) => [...prev, { name: '', quantity: 1, price: 0, notes: '' }])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const subtotal = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  )
  const total = subtotal + (deliveryType === 'delivery' ? Number(deliveryFee) || 0 : 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validItems = items.filter((item) => item.name.trim().length > 0)
    if (validItems.length === 0) return

    onAddOrder({
      channel: 'balcao',
      customerName: customerName.trim() || 'Cliente Balcão',
      customerPhone: customerPhone.trim() || '-',
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress.trim() : undefined,
      items: validItems,
      subtotal,
      deliveryFee: deliveryType === 'delivery' ? Number(deliveryFee) : 0,
      discount: 0,
      total,
      paymentMethod,
      notes: generalNotes.trim() || undefined,
    })

    // Reset formulário
    setCustomerName('')
    setCustomerPhone('')
    setDeliveryType('pickup')
    setDeliveryAddress('')
    setPaymentMethod('Pix')
    setGeneralNotes('')
    setDeliveryFee(0)
    setItems([{ name: '', quantity: 1, price: 0, notes: '' }])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-6">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle>Novo Pedido Manual (Balcão / Telefone)</DialogTitle>
                <DialogDescription className="mt-0.5">
                  Lança a comanda diretamente na esteira de produção.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Conteúdo com scroll */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {/* 1. Cliente & Tipo de Entrega */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Identificação & Entrega
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Nome do Cliente: *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: João da Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Telefone / WhatsApp:
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: (11) 98765-4321"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Botões Retirada vs Entrega */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-semibold text-slate-700">
                  Modalidade do Pedido:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`flex items-center justify-center gap-1.5 p-2 text-xs rounded-xl border font-semibold transition ${
                      deliveryType === 'pickup'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Store className="h-3.5 w-3.5" />
                    <span>Retirada no Balcão</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`flex items-center justify-center gap-1.5 p-2 text-xs rounded-xl border font-semibold transition ${
                      deliveryType === 'delivery'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Entrega (Delivery)</span>
                  </button>
                </div>
              </div>

              {deliveryType === 'delivery' && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Endereço Completo:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Rua, número, complemento e bairro"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Taxa (R$):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. Itens do Pedido */}
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Itens da Comanda *
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Adicionar Item</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1.5 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, 'quantity', parseInt(e.target.value, 10) || 1)
                        }
                        className="w-14 text-xs font-bold text-center rounded-lg border border-slate-200 p-1.5 bg-white font-mono"
                        title="Quantidade"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Nome do produto (ex: Pizza Calabresa)"
                        value={item.name}
                        onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                        className="flex-1 text-xs rounded-lg border border-slate-200 p-1.5 bg-white font-medium"
                      />
                      <div className="relative w-24">
                        <span className="absolute left-2 top-2 text-[10px] text-slate-400">R$</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          placeholder="Valor"
                          value={item.price || ''}
                          onChange={(e) =>
                            handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)
                          }
                          className="w-full text-xs rounded-lg border border-slate-200 p-1.5 pl-6 bg-white font-mono"
                        />
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                          title="Remover Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Observação do item (ex: Sem cebola, massa fina)"
                      value={item.notes || ''}
                      onChange={(e) => handleItemChange(idx, 'notes', e.target.value)}
                      className="text-[11px] rounded-lg border border-slate-200 p-1 bg-white text-slate-600 placeholder:text-slate-400 italic"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Pagamento & Observações Gerais */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Pagamento & Observações
              </span>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Forma de Pagamento:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {COMMON_PAYMENTS.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`text-xs p-1.5 rounded-lg border font-medium transition ${
                        paymentMethod === method
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Observações Gerais da Comanda:
                </label>
                <textarea
                  rows={2}
                  placeholder="Instruções para a cozinha ou entregador..."
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Estimado:</span>
                <span className="font-mono text-base text-indigo-700">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
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
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Enviar para a Linha de Produção</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
