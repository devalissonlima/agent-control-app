import React from 'react'
import { FileSpreadsheet, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuotesList } from './hooks/useQuotesList'
import { QuotesMetricsCards } from './components/QuotesMetricsCards'
import { QuotesTable } from './components/QuotesTable'
import { QuoteSheetDetails } from './components/QuoteSheetDetails'
import { QuoteFormDialog } from './components/QuoteFormDialog'

export const QuotesPage: React.FC = () => {
  const {
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
    openCreateDialog,
    closeCreateDialog,
    addQuote,
    updateQuote,
  } = useQuotesList()

  return (
    <div className="space-y-6">
      {/* 1. Topo da Página & Ação Primária */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Orçamentos & Propostas
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Gerencie cotações levantadas pelo assistente virtual e crie propostas personalizadas.
            </p>
          </div>
        </div>

        <Button
          onClick={openCreateDialog}
          size="sm"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 h-10 px-4 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Orçamento Manual</span>
        </Button>
      </div>

      {/* 2. Grid de 4 Cards Métricos */}
      <QuotesMetricsCards
        newRequestsCount={metrics.newRequestsCount}
        sentProposalsCount={metrics.sentProposalsCount}
        pipelineValue={metrics.pipelineValue}
        conversionRate={metrics.conversionRate}
      />

      {/* 3. Tabela com Busca, Abas e Ações */}
      <QuotesTable
        quotes={filteredQuotes}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tabCounts={tabCounts}
        onSelectQuote={openQuoteDetails}
      />

      {/* 4. Painel Lateral de Detalhes da Proposta */}
      <QuoteSheetDetails
        isOpen={isSheetOpen}
        onClose={setIsSheetOpen}
        quote={selectedQuote}
        onUpdateQuote={updateQuote}
      />

      {/* 5. Modal de Criação Manual de Orçamento */}
      <QuoteFormDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
        onSave={addQuote}
      />
    </div>
  )
}

export default QuotesPage
