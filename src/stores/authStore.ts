import { create } from 'zustand'
import type { AuthState, User } from '@/types/auth'

const MOCK_USER: User = {
  id: 'usr_mock_001',
  name: 'Alisson Silva',
  email: 'alisson@agentcontrol.io',
  role: 'admin',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
  tenantId: 'tenant_enterprise_01',
}

const STORAGE_KEY = '@agent_control:auth'

interface PersistedAuth {
  user: User | null
  token: string | null
}

const getInitialState = (): PersistedAuth => {
  if (typeof window === 'undefined') {
    return { user: MOCK_USER, token: 'mock-jwt-token-initial' }
  }

  try {
    const item = localStorage.getItem(STORAGE_KEY)
    if (item) {
      const parsed = JSON.parse(item) as PersistedAuth
      return parsed
    }
  } catch (error) {
    console.error('Failed to parse auth from storage:', error)
  }

  // Padrão: inicializa autenticado para agilizar navegação e testes no MVP
  return {
    user: MOCK_USER,
    token: 'mock-jwt-token-initial',
  }
}

const initialState = getInitialState()

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  token: initialState.token,
  isAuthenticated: Boolean(initialState.token && initialState.user),
  isLoading: false,

  login: async (email: string) => {
    set({ isLoading: true })
    
    // Simula delay de requisição assíncrona
    await new Promise((resolve) => setTimeout(resolve, 300))

    const loggedUser: User = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
    }
    const token = `mock-token-${Date.now()}`

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ user: loggedUser, token })
      )
    } catch (e) {
      console.warn('Storage unavailable:', e)
    }

    set({
      user: loggedUser,
      token,
      isAuthenticated: true,
      isLoading: false,
    })
  },

  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Storage error during logout:', e)
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  },
}))
