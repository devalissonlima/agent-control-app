import React from 'react'
import { Check, Sparkles, CreditCard, Calendar } from 'lucide-react'
import type { PlanDetails } from '@/types/plan'

interface PlanFeaturesCardProps {
  planDetails: PlanDetails
}

export const PlanFeaturesCard: React.FC<PlanFeaturesCardProps> = ({
  planDetails,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Detalhes do Plano Atual */}
      <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-2xs lg:col-span-2 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-indigo-600 px-2.5 py-0.5 text-xs font-bold text-white uppercase">
                {planDetails.tier}
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                {planDetails.name}
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Plano empresarial sob medida para atendimento automatizado em escala
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl font-black text-slate-900">
              R$ {planDetails.priceMonthly.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500"> / mês</span>
          </div>
        </div>

        {/* Recursos Inclusos */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Recursos e Benefícios Contratados
          </h4>
          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {planDetails.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detalhes de Faturamento */}
        <div className="flex flex-col gap-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>
              Próxima renovação automática em:{' '}
              <strong className="text-slate-900">
                {planDetails.nextBillingDate}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate-400" />
            <span>Faturamento via Cartão / Boleto Bancário</span>
          </div>
        </div>
      </div>

      {/* Card de Upgrade / Suporte */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white shadow-2xs">
        <div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-bold">Precisa de Mais Cota?</h3>
          <p className="mt-1 text-xs text-indigo-200/80 leading-relaxed">
            Faça upgrade para o plano Enterprise com atendimentos ilimitados, múltiplos
            números de WhatsApp e treinamento customizado de modelos com IA dedicada.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition active:scale-98"
          >
            Falar com Consultor Enterprise
          </button>
          <p className="text-center text-[11px] text-indigo-300/70">
            Ativação imediata sem fidelidade
          </p>
        </div>
      </div>
    </div>
  )
}
