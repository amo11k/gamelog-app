import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '../api/users'
import toast from 'react-hot-toast'

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: ['users', username, 'profile'],
    queryFn: () => usersApi.getProfile(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 2,
  })
}

export function useUserGames(username: string, status?: string) {
  return useQuery({
    queryKey: ['users', username, 'games', status],
    queryFn: () => usersApi.getGames(username, status),
    enabled: !!username,
    staleTime: 1000 * 30,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { bio?: string; avatarUrl?: string }) => usersApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Profile updated')
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })
}
