import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Gamepad2, Loader2, ChevronDown } from 'lucide-react'
import SearchBar from '../components/ui/SearchBar'
import { useGameSearch, useAddGame } from '../hooks/useGames'
import { SearchResultSkeleton } from '../components/ui/LoadingSkeleton'
import EmptyState from '../components/ui/EmptyState'
import type { GameStatus, GameSearchResult } from '../types'
import { useAuth } from '../hooks/useAuth'

const statuses: GameStatus[] = ['playing', 'completed', 'dropped', 'wishlist']

export default function SearchPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [addingId, setAddingId] = useState<string | null>(null)
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null)

  const { data, isLoading, isFetching } = useGameSearch(query)
  const addGame = useAddGame()

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
  }, [])

  const handleAddGame = async (game: GameSearchResult, status: GameStatus) => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const id = game.id ?? game.externalId
    if (!id) return
    setAddingId(String(id))
    try {
      await addGame.mutateAsync({
        gameId: game.id ?? undefined,
        externalGameId: game.id ? undefined : game.externalId,
        title: game.title,
        coverUrl: game.coverUrl,
        releaseDate: game.releaseDate,
        genres: game.genres,
        platforms: game.platforms,
        status,
        rating: 0,
        hoursPlayed: 0,
      })
    } catch {
      // error handled by toast
    } finally {
      setAddingId(null)
      setShowStatusMenu(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-100 mb-1">Search Games</h1>
        <p className="text-surface-400 text-sm">Find games to add to your collection</p>
      </div>

      <SearchBar onSearch={handleSearch} autoFocus />

      <div className="mt-6">
        {isLoading && <SearchResultSkeleton />}

        {!isLoading && query && query.length >= 2 && data?.data && data.data.length === 0 && (
          <EmptyState
            icon={Gamepad2}
            title="No games found"
            description={`No results for "${query}". Try a different search term.`}
          />
        )}

        {!isLoading && data?.data && data.data.length > 0 && (
          <div className="space-y-2">
            {isFetching && (
              <div className="flex items-center gap-2 text-sm text-surface-400 mb-3">
                <Loader2 size={14} className="animate-spin" />
                Searching...
              </div>
            )}
            {data.data.map((game: GameSearchResult) => {
              const key = String(game.id ?? game.externalId ?? game.title)
              return (
              <div
                key={key}
                className="flex items-center gap-4 bg-surface-900 rounded-2xl p-3 border border-surface-800 hover:border-surface-700 transition-all group"
              >
                <div className="w-14 h-20 rounded-xl bg-surface-800 overflow-hidden shrink-0">
                  {game.coverUrl ? (
                    <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-surface-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-100 truncate">{game.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-surface-500 mt-1">
                    {game.genres && <span>{game.genres}</span>}
                    {game.platforms && <span>· {game.platforms}</span>}
                    {game.releaseDate && <span>· {game.releaseDate}</span>}
                  </div>
                </div>
                <div className="relative">
                  {addingId === key ? (
                    <button className="px-3 py-2 bg-surface-800 rounded-xl text-surface-400" disabled>
                      <Loader2 size={18} className="animate-spin" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          navigate('/login')
                          return
                        }
                        setShowStatusMenu(showStatusMenu === key ? null : key)
                      }}
                      className="px-3 py-2 bg-accent-600/10 hover:bg-accent-600/20 text-accent-400 rounded-xl transition-all flex items-center gap-1.5 text-sm font-medium cursor-pointer"
                    >
                      <Plus size={16} />
                      Add
                      <ChevronDown size={14} />
                    </button>
                  )}
                  {showStatusMenu === key && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-surface-800 rounded-2xl border border-surface-700 shadow-xl shadow-black/50 overflow-hidden z-10">
                      {statuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleAddGame(game, status)}
                          className="w-full px-4 py-2.5 text-left text-sm text-surface-300 hover:bg-surface-700 hover:text-surface-100 transition-colors first:pt-3 last:pb-3 cursor-pointer capitalize"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        )}

        {!query && !isLoading && (
          <div className="text-center py-16">
            <Gamepad2 className="w-12 h-12 text-surface-700 mx-auto mb-4" />
            <p className="text-surface-500">Search for games to add to your collection</p>
          </div>
        )}
      </div>
    </div>
  )
}
