import { useQuery, useMutation, useQueries, useQueryClient } from '@tanstack/react-query'
import type { GameStatus } from '../types'
import { gamesApi } from '../api/games'
import toast from 'react-hot-toast'

export function useTrendingGames() {
  return useQuery({
    queryKey: ['games', 'trending'],
    queryFn: () => Promise.resolve<import('../types').GameSearchResult[]>([]),
    staleTime: 1000 * 60 * 5,
  })
}

export function useGameSearch(query: string, page = 0) {
  return useQuery({
    queryKey: ['games', 'search', query, page],
    queryFn: () => gamesApi.search(query, page),
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 2,
  })
}

export function useGameDetails(externalId: string | undefined) {
  return useQuery({
    queryKey: ['games', 'details', externalId],
    queryFn: () => gamesApi.getDetails(externalId!),
    enabled: !!externalId,
    staleTime: 1000 * 60 * 10,
  })
}

export function useWishlistPrices(titles: string[]) {
  return useQueries({
    queries: titles.map((title) => ({
      queryKey: ['games', 'price', title],
      queryFn: () => gamesApi.getPrice(title),
      staleTime: 1000 * 60 * 5,
    })),
  })
}

export function useUserGames(status?: string) {
  return useQuery({
    queryKey: ['user', 'games', status],
    queryFn: () => gamesApi.getUserGames(status),
    staleTime: 1000 * 30,
  })
}

export function useAddGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: {
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
    }) => gamesApi.addGame(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'games'] })
      toast.success('Game added to collection')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to add game')
    },
  })
}

export function useUpdateGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ gameId, payload }: { gameId: number; payload: { status?: GameStatus; rating?: number; hoursPlayed?: number; review?: string } }) =>
      gamesApi.updateGame(gameId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'games'] })
      toast.success('Game updated')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to update game')
    },
  })
}

export function useRemoveGame() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (gameId: number) => gamesApi.removeGame(gameId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'games'] })
      toast.success('Game removed from collection')
    },
    onError: () => {
      toast.error('Failed to remove game')
    },
  })
}
