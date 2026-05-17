import { useParams, Link } from 'react-router-dom'
import { Gamepad2, Clock, Star, Calendar, ArrowLeft, MessageSquare } from 'lucide-react'
import { useUserProfile, useUserGames } from '../hooks/useUsers'
import { ProfileSkeleton } from '../components/ui/LoadingSkeleton'
import EmptyState from '../components/ui/EmptyState'
import GameCard from '../components/ui/GameCard'
import ReviewBox from '../components/ui/ReviewBox'
import { formatHours } from '../utils/date'

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { data: profile, isLoading: profileLoading, error: profileError } = useUserProfile(username!)
  const { data: games, isLoading: gamesLoading } = useUserGames(username!)

  if (profileLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ProfileSkeleton />
      </div>
    )
  }

  if (profileError || !profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <EmptyState
          icon={Gamepad2}
          title="User not found"
          description="This profile doesn't exist or has been removed."
          action={{ label: 'Go Home', onClick: () => window.location.href = '/' }}
        />
      </div>
    )
  }

  const statusCounts = {
    playing: games?.filter((g) => g.status === 'playing').length || 0,
    completed: games?.filter((g) => g.status === 'completed').length || 0,
    dropped: games?.filter((g) => g.status === 'dropped').length || 0,
    wishlist: games?.filter((g) => g.status === 'wishlist').length || 0,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-200 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="bg-surface-900 rounded-3xl border border-surface-800 p-6 md:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-3xl md:text-4xl font-bold shrink-0">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              profile.username[0].toUpperCase()
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-surface-100">{profile.username}</h1>
            {profile.bio && <p className="text-surface-400 mt-1 max-w-lg">{profile.bio}</p>}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-surface-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Gamepad2, label: 'Games', value: profile.completedGames || profile.gamesCount },
            { icon: Clock, label: 'Hours', value: formatHours(profile.totalHours) },
            { icon: Star, label: 'Avg. Rating', value: profile.averageRating?.toFixed(1) || '--' },
            { icon: MessageSquare, label: 'Reviews', value: profile.recentReviews?.length || 0 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-surface-800/50 rounded-2xl p-4 text-center">
              <Icon className="w-5 h-5 text-accent-400 mx-auto mb-2" />
              <div className="text-xl font-bold text-surface-100">{value}</div>
              <div className="text-xs text-surface-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Playing', count: statusCounts.playing, color: 'text-emerald-400 bg-emerald-500/10' },
          { label: 'Completed', count: statusCounts.completed, color: 'text-blue-400 bg-blue-500/10' },
          { label: 'Dropped', count: statusCounts.dropped, color: 'text-red-400 bg-red-500/10' },
          { label: 'Wishlist', count: statusCounts.wishlist, color: 'text-purple-400 bg-purple-500/10' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-2xl p-4 text-center border border-surface-800 ${color}`}>
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-xs mt-1 opacity-80">{label}</div>
          </div>
        ))}
      </div>

      {gamesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-900 rounded-2xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : games && games.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-surface-100 mb-4">Game Collection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {games.map((userGame) => (
              <GameCard key={userGame.id} userGame={userGame} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Gamepad2}
          title="No games yet"
          description={`${profile.username} hasn't added any games to their collection yet.`}
        />
      )}

      {profile.recentReviews && profile.recentReviews.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-surface-100 mb-4">Recent Reviews</h2>
          <div className="space-y-3">
            {profile.recentReviews.slice(0, 5).map((review) => (
              <ReviewBox key={review.id} review={review} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
