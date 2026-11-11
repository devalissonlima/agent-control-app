import React from 'react'
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  CreditCard,
} from 'lucide-react'
import type { TenantDetails, PlanDetails } from '@/types/plan'

interface TenantDetailsCardProps {
  tenant: TenantDetails
  plan: PlanDetails
}

export const TenantDetailsCard: React.FC<TenantDetailsCardProps> = ({
  tenant,
  plan,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Dados Cadastrais da Empresa */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Dados do Tenant (Empresa)
            </h3>
            <p className="text-xs text-slate-500">
              Informações vinculadas à sua instância do agente
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          <div>
            <span className="font-semibold uppercase tracking-wider text-slate-400 text-[10px]">
              Razão Social
            </span>
            <p className="text-sm font-bold text-slate-900">
              {tenant.companyName}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="font-semibold uppercase tracking-wider text-slate-400 text-[10px]">
                Nome Fantasia
              </span>
              <p className="text-sm font-semibold text-slate-800">
                {tenant.tradingName}
              </p>
            </div>

            <div>
              <span className="font-semibold uppercase tracking-wider text-slate-400 text-[10px]">
                CNPJ
              </span>
              <p className="text-sm font-semibold text-slate-800 font-mono">
                {tenant.cnpj}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" />
              <span>{tenant.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>{tenant.email}</span>
            </div>
          </div>

          <div className="flex items-start gap-1.5 pt-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {tenant.address} - {tenant.city}/{tenant.state}
            </span>
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3 w-3" /> Segmento: {tenant.segment.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Resumo do Plano Contratado */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Assinatura Vigente
            </h3>
            <p className="text-xs text-slate-500">
              Contrato de serviço e faturamento
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-600">
                Plano Atual
              </span>
              <p className="text-lg font-bold text-slate-900">{plan.name}</p>
              <p className="text-xs text-slate-400">
                Cota de {plan.maxChats24h} conversas / 24h
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold text-slate-900">
                R$ {plan.priceMonthly.toFixed(2)}
              </p>
              <span className="text-xs text-slate-400">por mês</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Data de início da assinatura</span>
              <span className="font-semibold text-slate-800">
                {plan.activeSince}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Próxima cobrança</span>
              <span className="font-semibold text-slate-800">
                {plan.nextBillingDate}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Proteção Soft Limit</span>
              <span className="font-semibold text-emerald-600">Habilitada</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
