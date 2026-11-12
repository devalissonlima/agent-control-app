import { useState, useMemo } from 'react'
import type { Quote, QuoteStatus, QuoteAdditionalItem, QuoteBriefingField } from '@/types/quote'
import { formatCurrency } from '@/utils/formatters'

export interface UseQuoteDetailsParams {
  quote: Quote | null
  onUpdateQuote: (updated: Quote) => void
}

export function useQuoteDetails({ quote, onUpdateQuote }: UseQuoteDetailsParams) {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  // 1. Atualização de Status
  const handleStatusChange = (newStatus: QuoteStatus) => {
    if (!quote) return
    const updated: Quote = {
      ...quote,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }
    onUpdateQuote(updated)
  }

  // 2. Atualização do Valor Base
  const handleBasePriceChange = (newBasePrice: number) => {
    if (!quote) return
    const validBase = Math.max(0, isNaN(newBasePrice) ? 0 : newBasePrice)
    const additionalsTotal = quote.additionals.reduce((sum, item) => sum + item.totalPrice, 0)
    const totalEstimatedPrice = validBase + additionalsTotal

    const updated: Quote = {
      ...quote,
      basePrice: validBase,
      totalEstimatedPrice,
      updatedAt: new Date().toISOString(),
    }
    onUpdateQuote(updated)
  }

  // 3. Adicionar Item Adicional
  const handleAddAdditional = (name: string, quantity: number, unitPrice: number) => {
    if (!quote || !name.trim()) return
    const qty = Math.max(1, quantity || 1)
    const price = Math.max(0, unitPrice || 0)
    const totalPrice = qty * price

    const newItem: QuoteAdditionalItem = {
      id: `add-${Date.now()}`,
      name: name.trim(),
      quantity: qty,
      unitPrice: price,
      totalPrice,
    }

    const newAdditionals = [...quote.additionals, newItem]
    const additionalsTotal = newAdditionals.reduce((sum, item) => sum + item.totalPrice, 0)
    const totalEstimatedPrice = quote.basePrice + additionalsTotal

    const updated: Quote = {
      ...quote,
      additionals: newAdditionals,
      totalEstimatedPrice,
      updatedAt: new Date().toISOString(),
    }
    onUpdateQuote(updated)
  }

  // 4. Remover Item Adicional
  const handleRemoveAdditional = (itemId: string) => {
    if (!quote) return
    const newAdditionals = quote.additionals.filter((item) => item.id !== itemId)
    const additionalsTotal = newAdditionals.reduce((sum, item) => sum + item.totalPrice, 0)
    const totalEstimatedPrice = quote.basePrice + additionalsTotal

    const updated: Quote = {
      ...quote,
      additionals: newAdditionals,
      totalEstimatedPrice,
      updatedAt: new Date().toISOString(),
    }
    onUpdateQuote(updated)
  }

  // 5. Adicionar Campo de Briefing
  const handleAddBriefingField = (label: string, value: string) => {
    if (!quote || !label.trim() || !value.trim()) return
    const newField: QuoteBriefingField = {
      label: label.trim(),
      value: value.trim(),
    }
    const updated: Quote = {
      ...quote,
      briefing: [...quote.briefing, newField],
      updatedAt: new Date().toISOString(),
    }
    onUpdateQuote(updated)
  }

  // 6. Remover Campo de Briefing
  const handleRemoveBriefingField = (index: number) => {
    if (!quote) return
    const newBriefing = quote.briefing.filter((_, i) => i !== index)
    const updated: Quote = {
      ...quote,
      briefing: newBriefing,
      updatedAt: new Date().toISOString(),
    }
    onUpdateQuote(updated)
  }

  // 7. Atualizar Notas
  const handleNotesChange = (notes: string) => {
    if (!quote) return
    const updated: Quote = {
      ...quote,
      notes,
      updatedAt: new Date().toISOString(),
    }
    onUpdateQuote(updated)
  }

  // 8. Gerador de Mensagem Comercial para WhatsApp
  const whatsappUrl = useMemo(() => {
    if (!quote) return ''

    const cleanPhone = quote.customerPhone.replace(/\D/g, '')
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`

    const briefingLines = quote.briefing
      .map((b) => `• *${b.label}:* ${b.value}`)
      .join('\n')

    const additionalsLines =
      quote.additionals.length > 0
        ? `\n\n*Itens Opcionais / Adicionais:*\n` +
          quote.additionals
            .map(
              (item) =>
                `• ${item.quantity}x ${item.name} (${formatCurrency(item.unitPrice)}) = *${formatCurrency(item.totalPrice)}*`
            )
            .join('\n')
        : ''

    const messageText = `Olá, *${quote.customerName}*! Tudo bem?\n\n` +
      `Aqui está o resumo da sua proposta personalizada (*${quote.code}*):\n\n` +
      `📋 *Serviço / Pacote:* ${quote.serviceName}\n` +
      (quote.targetDate ? `📅 *Data Prevista:* ${quote.targetDate}\n` : '') +
      (quote.location ? `📍 *Local:* ${quote.location}\n` : '') +
      `\n*Detalhes do Briefing:*\n${briefingLines}` +
      additionalsLines +
      `\n\n💰 *Valor Total Estimado:* ${formatCurrency(quote.totalEstimatedPrice)}\n\n` +
      `Ficamos à disposição para tirar qualquer dúvida e confirmar a sua data! Podemos avançar?`

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(messageText)}`
  }, [quote])

  return {
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
  }
}
