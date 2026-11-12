import { useState, useMemo } from 'react'
import type { Quote, QuoteFilterTab, QuoteFormData, QuoteStatus } from '@/types/quote'
import { INITIAL_QUOTES } from '../mocks/quotesMock'

export function useQuotesList() {
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES)
  const [activeTab, setActiveTab] = useState<QuoteFilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // 1. Métricas Globais (Cards do Topo)
  const metrics = useMemo(() => {
    const newRequestsCount = quotes.filter((q) => q.status === 'pending').length

    const sentProposalsCount = quotes.filter(
      (q) => q.status === 'sent' || q.status === 'analyzing'
    ).length

    // Pipeline: soma dos orçamentos abertos em negociação
    const pipelineValue = quotes
      .filter((q) => ['pending', 'analyzing', 'sent'].includes(q.status))
      .reduce((acc, q) => acc + q.totalEstimatedPrice, 0)

    // Taxa de conversão: aprovados sobre o total de orçamentos decididos (aprovados + recusados)
    const approvedCount = quotes.filter((q) => q.status === 'approved').length
    const decidedCount = quotes.filter((q) => ['approved', 'declined'].includes(q.status)).length

    const conversionRate =
      decidedCount > 0 ? Math.round((approvedCount / decidedCount) * 100) : 0

    return {
      newRequestsCount,
      sentProposalsCount,
      pipelineValue,
      conversionRate,
      totalCount: quotes.length,
      approvedCount,
    }
  }, [quotes])

  // 2. Filtro e Busca
  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      // Filtro de Aba
      if (activeTab === 'pending' && quote.status !== 'pending') return false
      if (
        activeTab === 'negotiating' &&
        quote.status !== 'analyzing' &&
        quote.status !== 'sent'
      )
        return false
      if (activeTab === 'approved' && quote.status !== 'approved') return false
      if (activeTab === 'declined' && quote.status !== 'declined') return false

      // Busca por texto
      if (!searchQuery.trim()) return true
      const term = searchQuery.toLowerCase().trim()

      const matchName = quote.customerName.toLowerCase().includes(term)
      const matchCode = quote.code.toLowerCase().includes(term)
      const matchService = quote.serviceName.toLowerCase().includes(term)
      const matchLocation = quote.location?.toLowerCase().includes(term) ?? false
      const matchPhone = quote.customerPhone.includes(term)
      const matchBriefing = quote.briefing.some(
        (b) => b.label.toLowerCase().includes(term) || b.value.toLowerCase().includes(term)
      )

      return (
        matchName ||
        matchCode ||
        matchService ||
        matchLocation ||
        matchPhone ||
        matchBriefing
      )
    })
  }, [quotes, activeTab, searchQuery])

  // Contagem para as abas/chips
  const tabCounts = useMemo(() => {
    return {
      all: quotes.length,
      pending: quotes.filter((q) => q.status === 'pending').length,
      negotiating: quotes.filter((q) => ['analyzing', 'sent'].includes(q.status)).length,
      approved: quotes.filter((q) => q.status === 'approved').length,
      declined: quotes.filter((q) => q.status === 'declined').length,
    }
  }, [quotes])

  // Abertura e fechamento de painéis
  const openQuoteDetails = (quote: Quote) => {
    setSelectedQuote(quote)
    setIsSheetOpen(true)
  }

  const closeQuoteDetails = () => {
    setIsSheetOpen(false)
  }

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false)
  }

  // Manipulação de Orçamentos
  const addQuote = (data: QuoteFormData) => {
    const nextCodeNum = 1048 + quotes.length
    const totalAdditionals = data.additionals.reduce((sum, item) => sum + item.totalPrice, 0)
    const totalEstimatedPrice = Number(data.basePrice || 0) + totalAdditionals

    const newQuote: Quote = {
      id: `quote-${Date.now()}`,
      code: `ORC-${nextCodeNum}`,
      origin: 'manual',
      customerId: `cust-${Date.now()}`,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      serviceName: data.serviceName,
      targetDate: data.targetDate,
      location: data.location,
      briefing: data.briefing,
      basePrice: Number(data.basePrice || 0),
      additionals: data.additionals,
      totalEstimatedPrice,
      status: 'pending',
      notes: data.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setQuotes((prev) => [newQuote, ...prev])
  }

  const updateQuote = (updated: Quote) => {
    setQuotes((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
    if (selectedQuote?.id === updated.id) {
      setSelectedQuote(updated)
    }
  }

  const updateQuoteStatus = (id: string, status: QuoteStatus) => {
    setQuotes((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status, updatedAt: new Date().toISOString() } : q
      )
    )
    if (selectedQuote?.id === id) {
      setSelectedQuote((prev) =>
        prev ? { ...prev, status, updatedAt: new Date().toISOString() } : null
      )
    }
  }

  return {
    quotes,
    filteredQuotes,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedQuote,
    isSheetOpen,
    setIsSheetOpen,
    isCreateDialogOpen,
    metrics,
    tabCounts,
    openQuoteDetails,
    closeQuoteDetails,
    openCreateDialog,
    closeCreateDialog,
    addQuote,
    updateQuote,
    updateQuoteStatus,
  }
}
