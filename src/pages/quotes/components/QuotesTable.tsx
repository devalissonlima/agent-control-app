import React from 'react'
import {
  Search,
  Sparkles,
  UserCheck,
  Calendar,
  MessageCircle,
  Eye,
  FileSpreadsheet,
} from 'lucide-react'
import type { Quote, QuoteFilterTab, QuoteStatus } from '@/types/quote'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/utils/formatters'

interface QuotesTableProps {
  quotes: Quote[]
  activeTab: QuoteFilterTab
  onTabChange: (tab: QuoteFilterTab) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  tabCounts: {
    all: number
    pending: number
    negotiating: number
    approved: number
    declined: number
  }
  onSelectQuote: (quote: Quote) => void
}

export const QuotesTable: React.FC<QuotesTableProps> = ({
  quotes,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  tabCounts,
  onSelectQuote,
}) => {
  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="border-amber-300 bg-amber-50 text-amber-700 font-semibold"
          >
            Aguardando Retorno
          </Badge>
        )
      case 'analyzing':
        return (
          <Badge
            variant="outline"
            className="border-blue-300 bg-blue-50 text-blue-700 font-semibold"
          >
            Em Precificação
          </Badge>
        )
      case 'sent':
        return (
          <Badge
            variant="outline"
            className="border-indigo-300 bg-indigo-50 text-indigo-700 font-semibold"
          >
            Proposta Enviada
          </Badge>
        )
      case 'approved':
        return (
          <Badge
            variant="outline"
            className="border-emerald-300 bg-emerald-50 text-emerald-700 font-semibold"
          >
            Aprovado
          </Badge>
        )
      case 'declined':
        return (
          <Badge
            variant="outline"
            className="border-rose-300 bg-rose-50 text-rose-700 font-semibold"
          >
            Recusado
          </Badge>
        )
    }
  }

  const tabs: { key: QuoteFilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'Todos', count: tabCounts.all },
    { key: 'pending', label: 'Aguardando Retorno', count: tabCounts.pending },
    { key: 'negotiating', label: 'Em Negociação', count: tabCounts.negotiating },
    { key: 'approved', label: 'Aprovados', count: tabCounts.approved },
    { key: 'declined', label: 'Recusados', count: tabCounts.declined },
  ]

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
      {/* 1. Barra Superior: Busca & Chips/Pills de Filtro */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/60 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Campo de Busca Rápida */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por cliente, código, serviço ou item do briefing..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
            />
          </div>

          <span className="text-xs text-slate-400 self-center sm:self-auto font-medium">
            Exibindo <strong>{quotes.length}</strong> {quotes.length === 1 ? 'proposta' : 'propostas'}
          </span>
        </div>

        {/* Chips de Filtragem Rápida */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Tabela de Orçamentos */}
      {quotes.length === 0 ? (
        <div className="p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto mb-3">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Nenhum orçamento encontrado</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Não há propostas cadastradas com os filtros ou termo de busca aplicados.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Origem</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Serviço / Pacote</th>
                <th className="py-3 px-4">Data Prevista</th>
                <th className="py-3 px-4">Destaques do Briefing</th>
                <th className="py-3 px-4 text-right">Valor Estimado</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((quote) => {
                const isAI = quote.origin === 'ai'
                const cleanPhone = quote.customerPhone.replace(/\D/g, '')
                const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
                const whatsappUrl = `https://wa.me/${fullPhone}`

                return (
                  <tr
                    key={quote.id}
                    onClick={() => onSelectQuote(quote)}
                    className="hover:bg-slate-50/80 transition cursor-pointer group"
                  >
                    {/* Código */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {quote.code}
                    </td>

                    {/* Origem */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={
                          isAI
                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-1 w-fit'
                            : 'border-slate-300 bg-slate-100 text-slate-700 font-semibold flex items-center gap-1 w-fit'
                        }
                      >
                        {isAI ? (
                          <>
                            <Sparkles className="h-3 w-3" />
                            <span>IA</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3 w-3" />
                            <span>Manual</span>
                          </>
                        )}
                      </Badge>
                    </td>

                    {/* Cliente */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {quote.customerName}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {quote.customerPhone}
                      </p>
                    </td>

                    {/* Serviço */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                        {quote.serviceName}
                      </p>
                      {quote.location && (
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                          {quote.location}
                        </p>
                      )}
                    </td>

                    {/* Data Prevista */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {quote.targetDate ? (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium">{quote.targetDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">A definir</span>
                      )}
                    </td>

                    {/* Destaque do Briefing (Tags) */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {quote.briefing.slice(0, 2).map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium border border-slate-200/80 truncate max-w-[140px]"
                            title={`${item.label}: ${item.value}`}
                          >
                            {item.value}
                          </span>
                        ))}
                        {quote.briefing.length > 2 && (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1 py-0.5 rounded">
                            +{quote.briefing.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Valor Estimado */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-sm text-slate-900">
                      {formatCurrency(quote.totalEstimatedPrice)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(quote.status)}
                    </td>

                    {/* Ações */}
                    <td
                      className="py-3.5 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition border border-emerald-200"
                          title="Enviar mensagem WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectQuote(quote)}
                          className="h-7 text-xs rounded-lg px-2 flex items-center gap-1 text-slate-700"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Ver</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
