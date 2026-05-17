import { useState, useMemo } from 'react'
import { Gamepad2, X, Loader2, Save, Star, Globe, Tag } from 'lucide-react'
import { useUserGames, useUpdateGame, useRemoveGame, useWishlistPrices, useGameDetails } from '../hooks/useGames'
import { GameCardSkeleton } from '../components/ui/LoadingSkeleton'
import GameCard from '../components/ui/GameCard'
import EmptyState from '../components/ui/EmptyState'
import type { GamePrice, GameStatus, UserGame } from '../types'

const tabs: { label: string; status: GameStatus | 'all' }[] = [
  { label: 'All', status: 'all' },
  { label: 'Playing', status: 'playing' },
  { label: 'Completed', status: 'completed' },
  { label: 'Dropped', status: 'dropped' },
  { label: 'Wishlist', status: 'wishlist' },
]

const statusOptions: { value: GameStatus; label: string }[] = [
  { value: 'playing', label: 'Playing' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
  { value: 'wishlist', label: 'Wishlist' },
]

function getAllowedStatusTransitions(current: GameStatus): { value: GameStatus; label: string }[] {
  if (current === 'completed' || current === 'wishlist') return []
  if (current === 'playing') {
    return statusOptions.filter((s) => s.value === 'playing' || s.value === 'completed' || s.value === 'dropped')
  }
  if (current === 'dropped') {
    return statusOptions.filter((s) => s.value === 'dropped' || s.value === 'completed' || s.value === 'playing')
  }
  return statusOptions
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [editingGame, setEditingGame] = useState<UserGame | null>(null)
  const [editForm, setEditForm] = useState({ status: '' as GameStatus | '', rating: 0, hoursPlayed: 0, review: '' })

  const { data: allGames, isLoading } = useUserGames()
  const updateGame = useUpdateGame()
  const removeGame = useRemoveGame()

  const games = activeTab === 'all'
    ? allGames
    : allGames?.filter((g) => g.status === activeTab)

  const wishlistGames = useMemo(() => allGames?.filter((g) => g.status === 'wishlist') ?? [], [allGames])
  const wishlistTitles = useMemo(() => wishlistGames.map((g) => g.game.title), [wishlistGames])
  const priceResults = useWishlistPrices(activeTab === 'wishlist' ? wishlistTitles : [])
  const priceMap = useMemo(() => {
    const map = new Map<string, GamePrice | null>()
    wishlistTitles.forEach((title, i) => {
      map.set(title, priceResults[i]?.data ?? null)
    })
    return map
  }, [wishlistTitles, priceResults])

  const { data: gameDetails } = useGameDetails(editingGame?.game.externalId)

  const openEdit = (userGame: UserGame) => {
    setEditingGame(userGame)
    setEditForm({
      status: userGame.status,
      rating: userGame.rating,
      hoursPlayed: userGame.hoursPlayed,
      review: userGame.review || '',
    })
  }

  const handleSave = async () => {
    if (!editingGame) return
    const payload: Record<string, unknown> = {
      rating: editForm.rating,
      hoursPlayed: editForm.hoursPlayed,
      review: editForm.review,
    }
    if (editForm.status && editForm.status !== editingGame.status) {
      payload.status = editForm.status
    }
    await updateGame.mutateAsync({
      gameId: editingGame.id,
      payload,
    })
    setEditingGame(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">My Library</h1>
          <p className="text-surface-400 text-sm mt-1">
            {allGames?.length || 0} games in your collection
          </p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2 mb-6">
        {tabs.map(({ label, status }) => {
          const count = status === 'all'
            ? allGames?.length
            : allGames?.filter((g) => g.status === status).length
          return (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === status
                  ? 'bg-accent-500/10 text-accent-400'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              }`}
            >
              {label}
              {count !== undefined && (
                <span className="ml-1.5 text-xs opacity-60">({count})</span>
              )}
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <GameCardSkeleton key={i} />)}
        </div>
      ) : games && games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((userGame) => (
            <div key={userGame.id} className="relative group/card">
              <GameCard
                userGame={userGame}
                onClick={() => openEdit(userGame)}
                price={userGame.status === 'wishlist' ? priceMap.get(userGame.game.title) ?? null : null}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (confirm('Remove this game from your collection?')) {
                    removeGame.mutate(userGame.id)
                  }
                }}
                className="absolute top-1 right-1 p-1.5 bg-surface-950/80 rounded-lg text-surface-500 opacity-0 group-hover/card:opacity-100 hover:text-red-400 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Gamepad2}
          title="Your library is empty"
          description="Start by searching for games to add to your collection."
          action={{ label: 'Search Games', onClick: () => window.location.href = '/search' }}
        />
      )}

      {editingGame && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingGame(null)}>
          <div className="bg-surface-900 rounded-3xl border border-surface-700 w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {editingGame.game.coverUrl && (
                  <img src={editingGame.game.coverUrl} alt={editingGame.game.title} className="w-16 h-20 rounded-lg object-cover shrink-0" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-surface-100">{editingGame.game.title}</h2>
                  {gameDetails?.releaseDate && (
                    <p className="text-sm text-surface-400 mt-0.5">Released {gameDetails.releaseDate}</p>
                  )}
                </div>
              </div>
              <button onClick={() => setEditingGame(null)} className="text-surface-500 hover:text-surface-300 transition-colors cursor-pointer shrink-0">
                <X size={20} />
              </button>
            </div>

            {gameDetails && (
              <div className="flex flex-wrap gap-3 mb-6">
                {gameDetails.rawgRating != null && (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 rounded-full px-3 py-1">
                    <Star size={12} />
                    {gameDetails.rawgRating.toFixed(1)}
                  </span>
                )}
                {gameDetails.metacritic != null && (
                  <span className="inline-flex items-center gap-1 text-xs bg-surface-800 text-surface-300 rounded-full px-3 py-1">
                    Metacritic {gameDetails.metacritic}
                  </span>
                )}
                {gameDetails.genres && (
                  <span className="inline-flex items-center gap-1 text-xs bg-surface-800 text-surface-300 rounded-full px-3 py-1">
                    <Tag size={12} />
                    {gameDetails.genres}
                  </span>
                )}
                {gameDetails.platforms && (
                  <span className="inline-flex items-center gap-1 text-xs bg-surface-800 text-surface-300 rounded-full px-3 py-1">
                    <Globe size={12} />
                    {gameDetails.platforms}
                  </span>
                )}
              </div>
            )}

            {gameDetails?.description && (
              <p className="text-sm text-surface-400 leading-relaxed mb-6 line-clamp-4">{gameDetails.description}</p>
            )}

            <div className="border-t border-surface-700 pt-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Status</label>
                {editingGame.status === 'completed' || editingGame.status === 'wishlist' ? (
                  <p className="text-sm text-surface-500">Status cannot be changed for {editingGame.status} games.</p>
                ) : (
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as GameStatus })}
                    className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-surface-100 focus:border-accent-500 focus:outline-none transition-colors"
                  >
                    {getAllowedStatusTransitions(editingGame.status).map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
              </div>

              {editingGame.status !== 'wishlist' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Rating (0-10)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={editForm.rating}
                        onChange={(e) => setEditForm({ ...editForm, rating: parseFloat(e.target.value) })}
                        className="flex-1 accent-accent-500"
                      />
                      <span className="text-lg font-bold text-yellow-400 w-10 text-right">{editForm.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Hours Played</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.hoursPlayed}
                      onChange={(e) => setEditForm({ ...editForm, hoursPlayed: Math.max(0, parseInt(e.target.value) || 0) })}
                      className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-surface-100 focus:border-accent-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-2">Review</label>
                    <textarea
                      value={editForm.review}
                      onChange={(e) => setEditForm({ ...editForm, review: e.target.value })}
                      rows={3}
                      maxLength={500}
                      placeholder="Write a short review..."
                      className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-surface-100 placeholder-surface-500 focus:border-accent-500 focus:outline-none transition-colors resize-none"
                    />
                    <p className="text-xs text-surface-500 mt-1">{editForm.review.length}/500</p>
                  </div>
                </>
              )}

              {editingGame.status === 'wishlist' && (
                <p className="text-sm text-surface-500 italic">Rating, hours, and review are not applicable for wishlist games.</p>
              )}

              <button
                onClick={handleSave}
                disabled={updateGame.isPending}
                className="w-full py-3 bg-accent-600 hover:bg-accent-500 disabled:bg-accent-600/50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {updateGame.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
