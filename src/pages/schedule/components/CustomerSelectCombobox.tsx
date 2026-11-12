import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Search, UserCheck, UserPlus, Phone, Check } from 'lucide-react'
import type { Customer } from '@/types/customer'
import { INITIAL_CUSTOMERS } from '@/services/mockData'
import { formatPhoneNumber } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'

interface CustomerSelectComboboxProps {
  customerName: string
  onCustomerNameChange: (name: string) => void
  customerPhone: string
  onCustomerPhoneChange: (phone: string) => void
  onSelectCustomer?: (customer: Customer) => void
}

export const CustomerSelectCombobox: React.FC<CustomerSelectComboboxProps> = ({
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  onSelectCustomer,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isNewCustomer, setIsNewCustomer] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Lista de clientes do Mini-CRM
  const customers = INITIAL_CUSTOMERS

  // Clientes filtrados conforme digitação
  const filteredCustomers = useMemo(() => {
    if (!customerName || customerName.trim().length === 0) {
      return customers.slice(0, 5)
    }

    const term = customerName.toLowerCase().trim()
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.formattedPhone.includes(term)
    )
  }, [customerName, customers])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (customer: Customer) => {
    onCustomerNameChange(customer.name)
    onCustomerPhoneChange(customer.formattedPhone || customer.phone)
    setIsNewCustomer(false)
    setIsOpen(false)
    onSelectCustomer?.(customer)
  }

  const handlePhoneInput = (val: string) => {
    const formatted = formatPhoneNumber(val)
    onCustomerPhoneChange(formatted)
  }

  return (
    <div ref={containerRef} className="space-y-2.5">
      {/* 1. Campo de Busca / Nome com Combobox */}
      <div className="relative">
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Identificação do Cliente *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            placeholder="Buscar contato no CRM ou digitar novo nome..."
            value={customerName}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              onCustomerNameChange(e.target.value)
              setIsOpen(true)
              setIsNewCustomer(true)
            }}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 pl-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
          />
          <Search className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
        </div>

        {/* Dropdown de sugestões do Mini-CRM */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl space-y-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Contatos do Mini-CRM ({filteredCustomers.length})
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500">
                <p className="font-semibold text-slate-700">Nenhum cliente encontrado no CRM</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Preencha o telefone abaixo para cadastrar como novo cliente.
                </p>
              </div>
            ) : (
              filteredCustomers.map((c) => {
                const isSelected = c.name.toLowerCase() === customerName.toLowerCase()
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`w-full text-left flex items-center justify-between p-2 rounded-lg text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[11px]">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 truncate">
                        <p className="truncate font-medium text-slate-900">{c.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5" />
                          <span>{c.formattedPhone || c.phone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <Badge
                        variant="outline"
                        className="text-[9px] py-0 px-1 border-slate-200 text-slate-600 bg-slate-50"
                      >
                        {c.isLead ? 'Lead' : 'Cliente'}
                      </Badge>
                      {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                    </div>
                  </button>
                )
              })
            )}

            {customerName.trim().length > 0 && (
              <div className="border-t border-slate-100 pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left px-2 py-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Manter como novo cliente: &ldquo;{customerName}&rdquo;</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Campo Telefone (Preenchido automaticamente ou livre para novo cliente) */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700">
            Telefone / WhatsApp: *
          </label>
          {!isNewCustomer && customerPhone && (
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <UserCheck className="h-3 w-3" /> Preenchido via CRM
            </span>
          )}
        </div>
        <div className="relative">
          <input
            type="tel"
            required
            placeholder="Ex: (11) 98765-4321"
            value={customerPhone}
            onChange={(e) => handlePhoneInput(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 pl-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
          />
          <Phone className="absolute left-2.5 top-3 h-3.5 w-3.5 text-slate-400" />
        </div>
      </div>
    </div>
  )
}
