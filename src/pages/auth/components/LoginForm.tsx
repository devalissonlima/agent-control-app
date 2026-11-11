import React from 'react'
import { LogIn, AlertCircle, Sparkles } from 'lucide-react'
import { useLoginForm } from '../hooks/useLoginForm'

export const LoginForm: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    handleSubmit,
    handleFillDemo,
  } = useLoginForm()

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Cabeçalho */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Portal SaaS Agente
        </h1>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Acesse a gestão do seu agente inteligente e acompanhamento em tempo real
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            E-mail Profissional
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu.email@empresa.com"
            disabled={isLoading}
            className={`mt-1.5 block min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm ${
              errors.email
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 focus:border-indigo-600'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={isLoading}
            className={`mt-1.5 block min-h-[44px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm ${
              errors.password
                ? 'border-rose-400 focus:border-rose-500'
                : 'border-slate-200 focus:border-indigo-600'
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600">{errors.password}</p>
          )}
        </div>

        {/* Demo Fast-fill Shortcut */}
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-900">
          <p className="font-semibold text-indigo-800">Acesso Rápido para Avaliação:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('alisson@agentcontrol.io')}
              className="rounded-lg bg-white px-2.5 py-1 font-medium text-indigo-700 shadow-2xs transition hover:bg-indigo-100/50"
            >
              👤 Alisson (Tech Lead)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('operador@delivery.com.br')}
              className="rounded-lg bg-white px-2.5 py-1 font-medium text-indigo-700 shadow-2xs transition hover:bg-indigo-100/50"
            >
              🍔 Operador Delivery
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Autenticando...</span>
            </div>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Acessar Painel</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
