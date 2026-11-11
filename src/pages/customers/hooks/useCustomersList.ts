import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Customer } from '@/types/customer'
import { INITIAL_CUSTOMERS } from '@/services/mockData'

export type CustomerTypeFilter = 'todos' | 'clientes' | 'leads'
export type CustomerSortField = 'name' | 'totalSpent' | 'lastContact'

export function useCustomersList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<CustomerTypeFilter>('todos')
  const [sortField, setSortField] = useState<CustomerSortField>('lastContact')
  const [sortAsc, setSortAsc] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const { data: allCustomers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['customers-list'],
    queryFn: async () => INITIAL_CUSTOMERS,
  })

  // Filtro e Ordenação
  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...allCustomers]

    // 1. Busca por Nome, Telefone ou Bairro
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase().trim()
      result = result.filter((c) => {
        const matchesName = c.name.toLowerCase().includes(lower)
        const matchesPhone =
          c.phone.includes(lower) || c.formattedPhone.includes(lower)
        const matchesAddress = c.addresses.some(
          (addr) =>
            addr.neighborhood.toLowerCase().includes(lower) ||
            addr.street.toLowerCase().includes(lower) ||
            addr.city.toLowerCase().includes(lower) ||
            addr.label.toLowerCase().includes(lower)
        )
        return matchesName || matchesPhone || matchesAddress
      })
    }

    // 2. Filtro por Tipo: Todos, Somente Clientes (compraram), Somente Leads (sem compras)
    if (typeFilter === 'clientes') {
      result = result.filter((c) => !c.isLead && (c.totalSpent > 0 || c.servicesCount > 0))
    } else if (typeFilter === 'leads') {
      result = result.filter((c) => c.isLead || (c.totalSpent === 0 && c.servicesCount === 0))
    }

    // 3. Ordenação
    result.sort((a, b) => {
      if (sortField === 'name') {
        const comp = a.name.localeCompare(b.name)
        return sortAsc ? comp : -comp
      }
      if (sortField === 'totalSpent') {
        return sortAsc ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent
      }
      // lastContact fallback
      return sortAsc
        ? a.lastContactAt.localeCompare(b.lastContactAt)
        : b.lastContactAt.localeCompare(a.lastContactAt)
    })

    return result
  }, [allCustomers, searchTerm, typeFilter, sortField, sortAsc])

  // Paginação
  const totalFilteredCount = filteredAndSortedCustomers.length
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize))

  // Garante que currentPage seja válida caso a busca reduza o total de páginas
  const validCurrentPage = Math.min(currentPage, totalPages)

  const paginatedCustomers = useMemo(() => {
    const start = (validCurrentPage - 1) * pageSize
    return filteredAndSortedCustomers.slice(start, start + pageSize)
  }, [filteredAndSortedCustomers, validCurrentPage, pageSize])

  // Cliente selecionado (mantém o último selecionado para animação de fechamento não quebrar)
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return allCustomers[0] || null
    return allCustomers.find((c) => c.id === selectedCustomerId) || null
  }, [allCustomers, selectedCustomerId])

  const openSheet = (id: string) => {
    setSelectedCustomerId(id)
    setIsSheetOpen(true)
  }

  const closeSheet = () => {
    setIsSheetOpen(false)
  }

  const toggleSort = (field: CustomerSortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  return {
    allCustomers,
    customers: paginatedCustomers,
    totalFilteredCount,
    rawTotalCount: allCustomers.length,
    isLoading,
    searchTerm,
    setSearchTerm: (t: string) => {
      setSearchTerm(t)
      setCurrentPage(1)
    },
    typeFilter,
    setTypeFilter: (f: CustomerTypeFilter) => {
      setTypeFilter(f)
      setCurrentPage(1)
    },
    sortField,
    sortAsc,
    toggleSort,
    currentPage: validCurrentPage,
    totalPages,
    pageSize,
    nextPage: () => setCurrentPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setCurrentPage((p) => Math.max(p - 1, 1)),
    goToPage: (p: number) => setCurrentPage(p),
    selectedCustomer,
    isSheetOpen,
    openSheet,
    closeSheet,
    setIsSheetOpen,
  }
}
