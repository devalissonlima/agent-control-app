import React from 'react'
import { Calendar } from 'lucide-react'

interface WelcomeBannerProps {
  greeting: string
  userName: string
  dateString: string
  agentName?: string
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  greeting,
  userName,
  dateString,
  agentName,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 text-white shadow-md sm:p-8">
      {/* Detalhe de fundo decorativo */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-indigo-400/20 blur-xl" />

      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-indigo-100 backdrop-blur-xs">
            <Calendar className="h-3.5 w-3.5" />
            <span>{dateString}</span>
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {greeting}, {userName}! 👋
          </h1>
          <p className="mt-1 text-sm text-indigo-100/90 sm:text-base">
            Seu assistente inteligente{' '}
            <span className="font-semibold text-white underline decoration-indigo-300">
              {agentName ?? 'Sara'}
            </span>{' '}
            está operando com taxa de conversão em 27% hoje.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-xs">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
            <div className="text-left">
              <p className="text-[11px] uppercase tracking-wider text-indigo-200">
                Status Operacional
              </p>
              <p className="text-sm font-semibold text-white">IA Conectada 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
