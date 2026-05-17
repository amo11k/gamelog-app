import apiClient from './client'
import type { AuthResponse, LoginCredentials, RegisterData, User } from '../types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { data: response } = await apiClient.post('/auth/register', data)
    return response
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },
}
