import React from 'react'
import { Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  onOpenMobileNav: () => void
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenMobileNav }) => {
  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      {/* Lado Esquerdo: Botão Mobile + Título */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Abrir menu de navegação"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
          {title}
        </h1>
      </div>

      {/* Lado Direito: Status do Agente Responsivo */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="hidden sm:inline">Agente Online</span>
          <span className="sm:hidden">Online</span>
        </span>
      </div>
    </header>
  )
}

export default Header
