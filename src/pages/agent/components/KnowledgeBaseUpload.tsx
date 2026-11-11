import React, { useRef } from 'react'
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  Trash2,
  AlertCircle,
  FileCheck,
  Lightbulb,
} from 'lucide-react'
import { useKnowledgeBase } from '../hooks/useKnowledgeBase'

export const KnowledgeBaseUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    documents,
    isLoading,
    isUploading,
    isDragging,
    setIsDragging,
    handleFileDrop,
    handleFileInput,
    handleDelete,
  } = useKnowledgeBase()

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7 space-y-6">
      {/* Topo do Módulo */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Base de Conhecimento
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            Arquivos e materiais da sua empresa para consulta automática do atendente
          </p>
        </div>
      </div>

      {/* Caixa de Dica Explicativa Requisitada */}
      <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-indigo-900 sm:text-sm">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white mt-0.5">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <p className="font-bold text-indigo-950">Como funciona?</p>
          <p className="text-indigo-800/90 leading-relaxed text-xs sm:text-sm">
            Envie aqui os cardápios, tabelas de preço ou catálogos da sua empresa em
            formato PDF. O atendente vai ler esses documentos para responder preços e
            produtos automaticamente.
          </p>
        </div>
      </div>

      {/* Área de Dropzone / Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/70'
            : 'border-slate-200 bg-slate-50/60 hover:border-indigo-400 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-2xs text-indigo-600">
          {isUploading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <p className="mt-3 text-sm font-bold text-slate-900">
          {isUploading ? 'Fazendo upload e lendo documento...' : 'Clique para enviar ou arraste o arquivo PDF aqui'}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Aceita arquivos em formato PDF (cardápios, catálogos, tabelas de preço até 25MB)
        </p>
      </div>

      {/* Listagem de Arquivos Enviados */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Arquivos da Empresa ({documents.length})
          </h3>
          <span className="text-xs text-slate-400">
            Leitura e indexação instantânea ativa
          </span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Carregando lista de materiais...
          </div>
        ) : documents.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-8 text-center text-xs text-slate-500">
            Nenhum material adicionado ainda. Envie o primeiro PDF acima.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
            {documents.map((doc) => {
              const isProcessed = doc.status === 'processado'
              const isIndexing = doc.status === 'indexando'

              return (
                <div
                  key={doc.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      {isProcessed ? (
                        <FileCheck className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {doc.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{doc.sizeFormatted}</span>
                        <span>•</span>
                        <span>Enviado em {doc.uploadedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    {isProcessed && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Pronto para Uso
                      </span>
                    )}

                    {isIndexing && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                        <Clock className="h-3.5 w-3.5 animate-spin" />
                        Lendo material...
                      </span>
                    )}

                    {doc.status === 'erro' && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Erro no envio
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Remover arquivo"
                      aria-label={`Remover ${doc.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default KnowledgeBaseUpload
