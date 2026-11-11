import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar, NAVIGATION_ITEMS } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { useMobileNav } from '@/hooks/useMobileNav'

export const AppLayout: React.FC = () => {
  const { isOpen, openNav, closeNav } = useMobileNav()
  const location = useLocation()

  const currentRouteName =
    NAVIGATION_ITEMS.find((item) =>
      item.path === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(item.path)
    )?.label ?? (location.pathname === '/perfil' ? 'Perfil do Usuário' : 'Painel')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Sidebar Unificada: Drawer no Mobile/Tablet, Fixa no Desktop */}
      <Sidebar isOpen={isOpen} onClose={closeNav} />

      {/* Área Principal com espaçamento condicional apenas no Desktop */}
      <div className="flex min-h-screen flex-col transition-all duration-200 lg:pl-64">
        {/* Top Header Responsivo */}
        <Header title={currentRouteName} onOpenMobileNav={openNav} />

        {/* Conteúdo da Página com espaçamentos responsivos fluidos */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
