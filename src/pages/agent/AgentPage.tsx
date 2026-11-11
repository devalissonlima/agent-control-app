import React, { useState } from 'react'
import { AgentIdentityConfig } from './components/AgentIdentityConfig'
import { KnowledgeBaseUpload } from './components/KnowledgeBaseUpload'
import { User, FileText } from 'lucide-react'

export const AgentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'identity' | 'knowledge'>('identity')

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Configuração do Meu Agente
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          Ajuste a identidade do seu atendente e envie os materiais da sua empresa
          para respostas automáticas no WhatsApp
        </p>
      </div>

      {/* Tabs Simplificadas (Apenas 2 Abas Claras) */}
      <div className="flex rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-2xs sm:w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('identity')}
          className={`flex min-h-[40px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm ${
            activeTab === 'identity'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Identidade do Atendente</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('knowledge')}
          className={`flex min-h-[40px] flex-1 sm:flex-initial items-center justify-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:text-sm ${
            activeTab === 'knowledge'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Base de Conhecimento</span>
        </button>
      </div>

      {/* Conteúdo Dinâmico da Aba Selecionada */}
      {activeTab === 'identity' && <AgentIdentityConfig />}
      {activeTab === 'knowledge' && <KnowledgeBaseUpload />}
    </div>
  )
}

export default AgentPage
