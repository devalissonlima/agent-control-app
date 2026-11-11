import React from 'react'
import {
  MessageCircle,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Sparkles,
} from 'lucide-react'
import type { Customer } from '@/types/customer'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { CustomerAddressList } from './CustomerAddressList'
import { CustomerHistoryTimeline } from './CustomerHistoryTimeline'
import { useCustomerDetails } from '../hooks/useCustomerDetails'

interface CustomerSheetDetailsProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  customer: Customer | null
}

export const CustomerSheetDetails: React.FC<CustomerSheetDetailsProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const {
    initials,
    totalSpentFormatted,
    ticketMedioFormatted,
    servicesCount,
    whatsappUrl,
    isLead,
  } = useCustomerDetails(customer)

  if (!customer) {
    return null
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col h-full bg-white text-slate-900 border-l border-slate-200"
      >
        {/* Top Header */}
        <SheetHeader className="border-b border-slate-200/80 bg-slate-50/80 p-5 sm:p-6 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-base font-bold text-white shadow-sm ring-2 ring-indigo-200">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <SheetTitle className="text-lg font-bold text-slate-900 leading-tight truncate">
                    {customer.name}
                  </SheetTitle>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isLead
                        ? 'border-amber-300 bg-amber-50 text-amber-700'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isLead ? 'Lead / Em Potencial' : 'Cliente Ativo'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="font-mono font-medium text-slate-700">
                    {customer.formattedPhone}
                  </span>
                  <span>•</span>
                  <span>
                    Último contato {new Date(customer.lastContactAt).toLocaleDateString('pt-BR')}
                  </span>
                </p>
              </div>
            </div>

            <SheetClose className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition" />
          </div>

          {/* Botão Conversar no WhatsApp em Destaque */}
          <div className="mt-4 pt-3 border-t border-slate-200/60">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition active:scale-[0.99]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Conversar no WhatsApp</span>
            </a>
          </div>
        </SheetHeader>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* 1. Mini-Cards de Métricas do Cliente */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Métricas do Cliente
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
                <p className="text-[10px] font-medium text-slate-500">Total Gasto</p>
                <p className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {totalSpentFormatted}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <p className="text-[10px] font-medium text-slate-500">Ticket Médio</p>
                <p className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {ticketMedioFormatted}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-center">
                <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <ShoppingBag className="h-3.5 w-3.5" />
                </div>
                <p className="text-[10px] font-medium text-slate-500">Pedidos / Agend.</p>
                <p className="mt-0.5 text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {servicesCount}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Lista de Múltiplos Endereços */}
          <CustomerAddressList addresses={customer.addresses} />

          {/* 3. Histórico Cronológico e Timeline */}
          <CustomerHistoryTimeline history={customer.history} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
