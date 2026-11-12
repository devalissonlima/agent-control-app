import { useState } from 'react'
import type { QuoteFormData, QuoteBriefingField, QuoteAdditionalItem } from '@/types/quote'

export interface UseQuoteFormParams {
  onSave: (data: QuoteFormData) => void
  onClose: () => void
}

export const COMMON_BRIEFING_TEMPLATES = [
  { label: 'Número de Pessoas / Convidados', placeholder: 'Ex: 80 convidados' },
  { label: 'Metragem ou Dimensões', placeholder: 'Ex: 4.5 metros lineares' },
  { label: 'Local / Cidade', placeholder: 'Ex: Alphaville, Barueri - SP' },
  { label: 'Duração Prevista', placeholder: 'Ex: 6 horas de festa' },
  { label: 'Material / Especificação', placeholder: 'Ex: Quartzo Branco Stellar' },
]

export function useQuoteForm({ onSave, onClose }: UseQuoteFormParams) {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [serviceName, setServiceName] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [location, setLocation] = useState('')
  const [basePrice, setBasePrice] = useState<number>(1000)
  const [notes, setNotes] = useState('')

  // Briefing dinâmico
  const [briefingFields, setBriefingFields] = useState<QuoteBriefingField[]>([
    { label: 'Detalhes Principais', value: '' },
  ])

  // Itens adicionais
  const [additionals, setAdditionals] = useState<QuoteAdditionalItem[]>([])

  // Estado para novo item adicional temporário no form
  const [newAddName, setNewAddName] = useState('')
  const [newAddQty, setNewAddQty] = useState(1)
  const [newAddPrice, setNewAddPrice] = useState(100)

  // Erros de validação
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Manipulação de Briefing
  const addBriefingRow = (label = '', value = '') => {
    setBriefingFields((prev) => [...prev, { label, value }])
  }

  const updateBriefingRow = (index: number, key: 'label' | 'value', val: string) => {
    setBriefingFields((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: val }
      return next
    })
  }

  const removeBriefingRow = (index: number) => {
    setBriefingFields((prev) => prev.filter((_, i) => i !== index))
  }

  // Manipulação de Adicionais
  const addAdditionalItem = () => {
    if (!newAddName.trim()) return
    const qty = Math.max(1, newAddQty || 1)
    const price = Math.max(0, newAddPrice || 0)

    const item: QuoteAdditionalItem = {
      id: `add-${Date.now()}`,
      name: newAddName.trim(),
      quantity: qty,
      unitPrice: price,
      totalPrice: qty * price,
    }

    setAdditionals((prev) => [...prev, item])
    setNewAddName('')
    setNewAddQty(1)
    setNewAddPrice(100)
  }

  const removeAdditionalItem = (id: string) => {
    setAdditionals((prev) => prev.filter((item) => item.id !== id))
  }

  // Validação
  const validate = (): boolean => {
    const errs: { [key: string]: string } = {}

    if (!customerName.trim()) {
      errs.customerName = 'Informe o nome do cliente'
    }

    const cleanDigits = customerPhone.replace(/\D/g, '')
    if (!customerPhone.trim() || cleanDigits.length < 10) {
      errs.customerPhone = 'Informe um WhatsApp com DDD válido'
    }

    if (!serviceName.trim()) {
      errs.serviceName = 'Informe o serviço ou pacote'
    }

    if (basePrice < 0 || isNaN(basePrice)) {
      errs.basePrice = 'Valor base inválido'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validate()) return

    const validBriefing = briefingFields
      .filter((f) => f.label.trim() && f.value.trim())
      .map((f) => ({ label: f.label.trim(), value: f.value.trim() }))

    const formData: QuoteFormData = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      serviceName: serviceName.trim(),
      targetDate: targetDate.trim() || undefined,
      location: location.trim() || undefined,
      briefing: validBriefing,
      basePrice: Number(basePrice) || 0,
      additionals,
      notes: notes.trim() || undefined,
    }

    onSave(formData)
    onClose()
  }

  return {
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
  }
}
