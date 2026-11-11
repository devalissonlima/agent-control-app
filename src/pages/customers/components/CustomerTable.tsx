import React from 'react'
import {
  Search,
  ArrowUpDown,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  UserCheck,
} from 'lucide-react'
import type { Customer } from '@/types/customer'
import type { CustomerSortField, CustomerTypeFilter } from '../hooks/useCustomersList'

interface CustomerTableProps {
  customers: Customer[]
  rawTotalCount: number
  totalFilteredCount: number
  searchTerm: string
  setSearchTerm: (term: string) => void
  typeFilter: CustomerTypeFilter
  setTypeFilter: (filter: CustomerTypeFilter) => void
  sortField: CustomerSortField
  sortAsc: boolean
  toggleSort: (field: CustomerSortField) => void
  currentPage: number
  totalPages: number
  pageSize: number
  nextPage: () => void
  prevPage: () => void
  onSelectCustomer: (id: string) => void
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  rawTotalCount,
  totalFilteredCount,
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  sortField,
  toggleSort,
  currentPage,
  totalPages,
  pageSize,
  nextPage,
  prevPage,
  onSelectCustomer,
}) => {
  const getPrimaryAddress = (customer: Customer) => {
    const primary = customer.addresses.find((a) => a.isPrimary) || customer.addresses[0]
    if (!primary) return customer.deliveryAddress
    return `${primary.street}, ${primary.number}${primary.complement ? ` (${primary.complement})` : ''} - ${primary.neighborhood}`
  }

  const getExtraAddressesCount = (customer: Customer) => {
    return Math.max(0, customer.addresses.length - 1)
  }

  const getStatusBadge = (customer: Customer) => {
    if (customer.isLead || (customer.totalSpent === 0 && customer.servicesCount === 0)) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
          <Sparkles className="h-3 w-3" />
          Lead (Sem compras)
        </span>
      )
    }

    if (customer.statusTag === 'recorrente') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200">
          <UserCheck className="h-3 w-3" />
          Cliente VIP
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
        <ShoppingBag className="h-3 w-3" />
        Cliente Ativo
      </span>
    )
  }

  const startRecord = (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalFilteredCount)

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 sm:p-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, telefone ou bairro..."
            className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Chips de Segmentação Requisitados */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 hidden lg:inline">
            Segmentar:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setTypeFilter('todos')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                typeFilter === 'todos'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Todos ({rawTotalCount})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('clientes')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                typeFilter === 'clientes'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Somente Clientes (Compraram)
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('leads')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                typeFilter === 'leads'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              Somente Leads (Sem compras)
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Contatos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSort('name')}
                  className={`flex items-center gap-1 hover:text-slate-900 ${
                    sortField === 'name' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <span>Cliente</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-5 py-3.5">
                WhatsApp
              </th>
              <th scope="col" className="px-5 py-3.5">
                Endereço Principal
              </th>
              <th scope="col" className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => toggleSort('totalSpent')}
                  className={`flex items-center gap-1 hover:text-slate-900 ${
                    sortField === 'totalSpent' ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <span>Total Gasto</span>
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th scope="col" className="px-5 py-3.5">
                Última Interação
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-slate-400">
                  Nenhum contato encontrado para os filtros selecionados.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const extraCount = getExtraAddressesCount(customer)
                return (
                  <tr
                    key={customer.id}
                    onClick={() => onSelectCustomer(customer.id)}
                    className="cursor-pointer transition hover:bg-indigo-50/30"
                  >
                    {/* Nome & Status */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100/70 font-bold text-indigo-700">
                          {customer.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {customer.name}
                          </p>
                          <div className="mt-1">
                            {getStatusBadge(customer)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Telefone */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{customer.formattedPhone}</span>
                      </div>
                    </td>

                    {/* Endereço Principal + Badge Compacto de Múltiplos */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 text-xs text-slate-700 font-medium">
                          {getPrimaryAddress(customer)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-600">
                          <Sparkles className="h-2.5 w-2.5" /> IA Extracted
                        </span>

                        {extraCount > 0 && (
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                            +{extraCount} {extraCount === 1 ? 'endereço' : 'endereços'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Gasto / Pedidos */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {customer.totalSpent > 0 ? (
                        <>
                          <p className="font-extrabold text-slate-900">
                            R$ {customer.totalSpent.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {customer.servicesCount} pedidos/reservas
                          </p>
                        </>
                      ) : (
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                          R$ 0,00 (Lead)
                        </span>
                      )}
                    </td>

                    {/* Último Contato */}
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{customer.lastContactAt}</span>
                      </div>
                      {customer.daysInactive > 0 && (
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Sem contato há {customer.daysInactive}d
                        </span>
                      )}
                    </td>

                    {/* Ação */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectCustomer(customer.id)
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-600 shadow-2xs transition"
                      >
                        <span>Ver Perfil</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação Limpa no Rodapé */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 bg-slate-50/50">
        <p className="text-xs text-slate-500">
          Mostrando <strong className="text-slate-900">{totalFilteredCount > 0 ? startRecord : 0}</strong> a{' '}
          <strong className="text-slate-900">{endRecord}</strong> de{' '}
          <strong className="text-slate-900">{totalFilteredCount}</strong> contatos
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={prevPage}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Anterior</span>
          </button>

          <span className="text-xs font-semibold text-slate-600 px-2">
            Página {currentPage} de {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={nextPage}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <span>Próxima</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomerTable
