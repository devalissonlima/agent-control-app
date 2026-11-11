import React from 'react'
import { User as UserIcon, Shield, Mail, LogOut } from 'lucide-react'
import type { User } from '@/types/auth'

interface AccountDetailsCardProps {
  user: User | null
  onLogout: () => void
}

export const AccountDetailsCard: React.FC<AccountDetailsCardProps> = ({
  user,
  onLogout,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-7 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Minha Conta de Acesso
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Credenciais do usuário conectado e permissões de acesso
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-100 transition active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          <span>Encerrar Sessão</span>
        </button>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100 font-bold text-indigo-700 text-xl ring-2 ring-indigo-200">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserIcon className="h-8 w-8" />
          )}
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">
              {user?.name ?? 'Usuário'}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
              <Shield className="h-3 w-3" />
              Nível: {user?.role.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>{user?.email ?? 'sem email'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
