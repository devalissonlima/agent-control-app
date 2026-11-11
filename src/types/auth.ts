export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  avatarUrl?: string
  tenantId?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password?: string) => Promise<void>
  logout: () => void
}
