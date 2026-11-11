import React from 'react'
import { CustomerMetricsCards } from './components/CustomerMetricsCards'
import { CustomerTable } from './components/CustomerTable'
import { CustomerSheetDetails } from './components/CustomerSheetDetails'
import { useCustomersList } from './hooks/useCustomersList'
import { useCustomerMetrics } from './hooks/useCustomerMetrics'

export const CustomersPage: React.FC = () => {
  const {
    allCustomers,
    customers,
    rawTotalCount,
    totalFilteredCount,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    sortField,
    sortAsc,
    toggleSort,
    currentPage,
    totalPages,
    pageSize,
    nextPage,
    prevPage,
    selectedCustomer,
    isSheetOpen,
    openSheet,
    setIsSheetOpen,
  } = useCustomersList()

  const metrics = useCustomerMetrics(allCustomers)

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Clientes & Mini-CRM
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Base inteligente de contatos capturados no WhatsApp, histórico de consumo e endereços
          </p>
        </div>
      </div>

      {/* 1. Cabeçalho com Indicadores de Negócio (Cards Métricos) */}
      <CustomerMetricsCards metrics={metrics} />

      {/* 2. Tabela de Clientes & Filtros */}
      <CustomerTable
        customers={customers}
        rawTotalCount={rawTotalCount}
        totalFilteredCount={totalFilteredCount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortField={sortField}
        sortAsc={sortAsc}
        toggleSort={toggleSort}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        nextPage={nextPage}
        prevPage={prevPage}
        onSelectCustomer={openSheet}
      />

      {/* 3. Painel Lateral de Detalhes (Sheet Shadcn/ui) */}
      <CustomerSheetDetails
        isOpen={isSheetOpen}
        onClose={setIsSheetOpen}
        customer={selectedCustomer}
      />
    </div>
  )
}

export default CustomersPage
