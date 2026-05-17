import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User, LoginCredentials, RegisterData } from '../types'
import { authApi } from '../api/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoading(false)
      return
    }
    try {
      const userData = await authApi.me()
      setUser(userData)
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const response = await authApi.register(data)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // proceed with local logout even if API fails
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
