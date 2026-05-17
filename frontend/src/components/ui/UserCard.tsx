import type { User } from '../../types'
import { Gamepad2, Clock, Star } from 'lucide-react'
import { formatHours } from '../../utils/date'

interface UserCardProps {
  user: User
  gamesCount?: number
  totalHours?: number
  averageRating?: number
  onClick?: () => void
}

export default function UserCard({ user, gamesCount, totalHours, averageRating, onClick }: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-surface-900 rounded-2xl p-5 border border-surface-800 hover:border-accent-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/5 hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xl font-bold shrink-0">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            user.username[0].toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-surface-100 truncate">{user.username}</h3>
          {user.bio && <p className="text-xs text-surface-400 truncate mt-0.5">{user.bio}</p>}
        </div>
      </div>

      {(gamesCount !== undefined || totalHours !== undefined || averageRating !== undefined) && (
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-800">
          {gamesCount !== undefined && (
            <div className="flex items-center gap-1.5 text-surface-400">
              <Gamepad2 size={14} />
              <span className="text-xs font-medium text-surface-300">{gamesCount}</span>
            </div>
          )}
          {totalHours !== undefined && (
            <div className="flex items-center gap-1.5 text-surface-400">
              <Clock size={14} />
              <span className="text-xs font-medium text-surface-300">{formatHours(totalHours)}</span>
            </div>
          )}
          {averageRating !== undefined && (
            <div className="flex items-center gap-1.5 text-surface-400">
              <Star size={14} fill="currentColor" className="text-yellow-500" />
              <span className="text-xs font-medium text-surface-300">{averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
