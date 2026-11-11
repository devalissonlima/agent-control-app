import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/layouts/AppLayout'

import { LoginPage } from '@/pages/auth/LoginPage'
import { HomePage } from '@/pages/home/HomePage'
import { AgentPage } from '@/pages/agent/AgentPage'
import { MonitoringPage } from '@/pages/monitoring/MonitoringPage'
import { OrdersPage } from '@/pages/orders/OrdersPage'
import { SchedulePage } from '@/pages/schedule/SchedulePage'
import { CustomersPage } from '@/pages/customers/CustomersPage'
import { PlanPage } from '@/pages/plan/PlanPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
})

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública de Autenticação */}
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas Protegidas sob AppLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="meu-agente" element={<AgentPage />} />
            <Route path="acompanhamento" element={<MonitoringPage />} />
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="agenda" element={<SchedulePage />} />
            <Route path="clientes" element={<CustomersPage />} />
            <Route path="meu-plano" element={<PlanPage />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Route>

          {/* Rota fallback para URLs desconhecidas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
