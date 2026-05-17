import apiClient from './client'
import type { GameDetail, GamePrice, GameSearchResult, GameStatusUpdate, PaginatedResponse, UserGame } from '../types'

export const gamesApi = {
  search: async (query: string, page = 0): Promise<PaginatedResponse<GameSearchResult>> => {
    const { data } = await apiClient.get('/games/search', { params: { q: query, page } })
    return data
  },

  getUserGames: async (status?: string): Promise<UserGame[]> => {
    const { data } = await apiClient.get('/user-games/me', { params: { status } })
    return data
  },

  addGame: async (payload: {
    gameId?: number
    externalGameId?: string
    title?: string
    coverUrl?: string
    releaseDate?: string
    genres?: string
    platforms?: string
    status: string
    rating?: number
    hoursPlayed?: number
  }): Promise<UserGame> => {
    const { data } = await apiClient.post('/user-games', payload)
    return data
  },

  updateGame: async (gameId: number, payload: Partial<GameStatusUpdate>): Promise<UserGame> => {
    const { data } = await apiClient.put(`/user-games/${gameId}`, payload)
    return data
  },

  getDetails: async (externalId: string): Promise<GameDetail | null> => {
    const { data } = await apiClient.get(`/games/${externalId}/details`)
    return data
  },

  getPrice: async (title: string): Promise<GamePrice | null> => {
    const { data } = await apiClient.get('/games/price', { params: { q: title } })
    return data
  },

  removeGame: async (gameId: number): Promise<void> => {
    await apiClient.delete(`/user-games/${gameId}`)
  },
}
