import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Home,
  Bot,
  Activity,
  ShoppingBag,
  CalendarDays,
  ReceiptText,
  Users,
  CreditCard,
  User,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export interface NavigationMenuItem {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
}

export const NAVIGATION_ITEMS: readonly NavigationMenuItem[] = [
  { label: 'Início', path: '/', icon: Home },
  { label: 'Meu Agente', path: '/meu-agente', icon: Bot },
  { label: 'Acompanhamento', path: '/acompanhamento', icon: Activity },
  { label: 'Pedidos', path: '/pedidos', icon: ShoppingBag },
  { label: 'Agenda', path: '/agenda', icon: CalendarDays },
  { label: 'Orçamentos', path: '/orcamentos', icon: ReceiptText },
  { label: 'Clientes', path: '/clientes', icon: Users },
  { label: 'Meu Plano', path: '/meu-plano', icon: CreditCard },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore()

  return (
    <>
      {/* Backdrop Mobile/Tablet */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Fechar menu lateral"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClose()
            }
          }}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200 lg:hidden"
        />
      )}

      {/* Sidebar Container: Drawer no Mobile/Tablet, Fixo no Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out lg:z-30 lg:w-64 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
        aria-label="Navegação Principal"
      >
        {/* Topo da Sidebar: Logo + Botão Fechar no Mobile */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900">
                AgentControl
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                Portal SaaS
              </span>
            </div>
          </div>

          {/* Botão de Fechar Exclusivo para Mobile/Tablet */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu de navegação"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Centro da Sidebar: Links de Navegação */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navegação Principal
          </p>

          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    'group relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-50 font-semibold text-indigo-600'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Barra visual de item ativo */}
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-1 rounded-r-md bg-indigo-600" />
                    )}
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-indigo-600'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Rodapé da Sidebar: Usuário Conectado -> /perfil */}
        <div className="shrink-0 border-t border-slate-100 p-3">
          <Link
            to="/perfil"
            onClick={onClose}
            className="group flex min-h-[52px] items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-100"
            title="Ver meu perfil"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-2 ring-transparent transition group-hover:ring-indigo-200">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-slate-500" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                {user?.name ?? 'Usuário'}
              </p>
              <p className="truncate text-xs text-slate-400">
                {user?.email ?? 'sem email'}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
          </Link>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
