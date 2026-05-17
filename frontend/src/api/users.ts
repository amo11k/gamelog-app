import apiClient from './client'
import type { UserProfile, UserGame } from '../types'

export const usersApi = {
  getProfile: async (username: string): Promise<UserProfile> => {
    const { data } = await apiClient.get(`/users/${username}`)
    return data
  },

  getGames: async (username: string, status?: string): Promise<UserGame[]> => {
    const { data } = await apiClient.get(`/users/${username}/games`, { params: { status } })
    return data
  },

  updateProfile: async (payload: { bio?: string; avatarUrl?: string }): Promise<UserProfile> => {
    const { data } = await apiClient.put('/users/me', payload)
    return data
  },
}
