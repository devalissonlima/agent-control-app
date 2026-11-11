import React from 'react'
import { AccountDetailsCard } from './components/AccountDetailsCard'
import { TenantDetailsCard } from './components/TenantDetailsCard'
import { useProfileDetails } from './hooks/useProfileDetails'

export const ProfilePage: React.FC = () => {
  const { user, tenant, plan, isLoading, logout } = useProfileDetails()

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-white" />
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Perfil & Dados da Conta
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          Gerencie suas credenciais de acesso e visualize os dados cadastrais da
          sua empresa
        </p>
      </div>

      {/* Dados do Usuário */}
      <AccountDetailsCard user={user} onLogout={logout} />

      {/* Dados do Tenant & Assinatura */}
      <TenantDetailsCard tenant={tenant} plan={plan} />
    </div>
  )
}

export default ProfilePage
