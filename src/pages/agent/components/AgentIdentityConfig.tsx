import React from 'react'
import { Save, CheckCircle2, User } from 'lucide-react'
import type { AgentTone } from '@/types/agent'
import { useAgentPersonality } from '../hooks/useAgentPersonality'
import { FieldTooltip } from '@/components/ui/FieldTooltip'

interface StyleOption {
  id: AgentTone
  title: string
  description: string
  emoji: string
}

const ATTENDANCE_STYLES: StyleOption[] = [
  {
    id: 'empatico',
    title: 'Simpático e Acolhedor',
    description: 'Conversa calorosa, usa alguns emojis com moderação.',
    emoji: '😊',
  },
  {
    id: 'descontraido',
    title: 'Rápido e Prático',
    description: 'Direto ao ponto, focado em agilidade nas respostas.',
    emoji: '⚡',
  },
  {
    id: 'formal',
    title: 'Formal e Profissional',
    description: 'Mais sóbrio e polido, sem gírias ou excesso de emojis.',
    emoji: '👔',
  },
  {
    id: 'vendedor',
    title: 'Vendedor e Persuasivo',
    description: 'Atencioso e sempre oferecendo adicionais e sugestões.',
    emoji: '🚀',
  },
]

export const AgentIdentityConfig: React.FC = () => {
  const {
    formData,
    isLoading,
    isSaving,
    saveSuccess,
    handleChange,
    handleToneChange,
    handleSave,
  } = useAgentPersonality()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7">
      {/* Topo do Formulário */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Identidade do Atendente
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Personalize o jeito de falar e as orientações do seu atendente no WhatsApp
          </p>
        </div>

        {/* Status Operacional no WhatsApp */}
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Status do Atendente:</span>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="h-4 w-4 rounded accent-indigo-600 cursor-pointer"
            />
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                formData.isActive
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {formData.isActive ? 'Ativo no WhatsApp' : 'Atendimento Pausado'}
            </span>
          </label>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Campo 1: Nome do Atendente */}
        <div>
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="agent-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Nome do Atendente
            </label>
            <FieldTooltip
              label="Nome do Atendente"
              content="Como o seu assistente vai se apresentar para o cliente. Exemplo: Sofia da Pizzaria Bela Massa."
            />
          </div>
          <input
            id="agent-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ex: Sofia"
            className="mt-1.5 block min-h-[44px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Campo 2: Primeira Mensagem (Boas-Vindas) */}
        <div>
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="welcome-message"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Primeira Mensagem (Boas-Vindas)
            </label>
            <FieldTooltip
              label="Primeira Mensagem"
              content="Quando um cliente manda um 'olá' ou 'boa noite', esta é a primeira resposta automática que ele recebe antes de começar o pedido ou tirar dúvidas."
            />
          </div>
          <textarea
            id="welcome-message"
            rows={3}
            value={formData.welcomeMessage}
            onChange={(e) => handleChange('welcomeMessage', e.target.value)}
            placeholder="Ex: Olá! Sou a Sofia da Pizzaria Bela Massa. Como posso te ajudar hoje?"
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
          />
        </div>

        {/* Campo 3: Estilo de Atendimento (Tom de Voz) */}
        <div>
          <div className="flex items-center gap-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Estilo de Atendimento (Tom de Voz)
            </label>
            <FieldTooltip
              label="Estilo de Atendimento"
              content="Define o jeito como seu assistente fala com as pessoas nas mensagens."
            />
          </div>

          <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ATTENDANCE_STYLES.map((style) => {
              const isSelected = formData.tone === style.id
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleToneChange(style.id)}
                  className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs ring-1 ring-indigo-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{style.emoji}</span>
                      <span
                        className={`h-3 w-3 rounded-full border ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 ring-2 ring-indigo-200'
                            : 'border-slate-300 bg-transparent'
                        }`}
                      />
                    </div>
                    <p className="mt-2.5 text-sm font-bold text-slate-900">
                      {style.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 leading-normal">
                      {style.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Campo 4: Regras e Detalhes da sua Loja */}
        <div>
          <div className="flex items-center gap-1.5">
            <label
              htmlFor="store-rules"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Regras e Detalhes da sua Loja
            </label>
            <FieldTooltip
              label="Regras da Loja"
              content="Orientações importantes para o assistente não errar. Coloque aqui horários, formas de pagamento aceitas ou taxa de entrega."
            />
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Dica: Escreva em linhas separadas para facilitar o entendimento do atendente.
          </p>
          <textarea
            id="store-rules"
            rows={4}
            value={formData.brandRules}
            onChange={(e) => handleChange('brandRules', e.target.value)}
            placeholder="Ex: Não entregamos após as 23h. Aceitamos apenas Pix e Cartão na entrega. Tempo de preparo médio de 40 minutos."
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 leading-relaxed"
          />
        </div>

        {/* Botão de Salvar com Feedback */}
        <div className="flex flex-col items-stretch sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-slate-100">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Configurações salvas com sucesso!
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50"
          >
            {isSaving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AgentIdentityConfig
