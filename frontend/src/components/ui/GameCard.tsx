import type { GamePrice, UserGame } from '../../types'
import { Clock, MessageSquare, DollarSign, ExternalLink } from 'lucide-react'
import StatusBadge from './StatusBadge'
import RatingBadge from './RatingBadge'
import { formatHours } from '../../utils/date'

interface GameCardProps {
  userGame: UserGame
  onClick?: () => void
  price?: GamePrice | null
}

export default function GameCard({ userGame, onClick, price }: GameCardProps) {
  const { game, status, rating, hoursPlayed, review } = userGame

  return (
    <div
      onClick={onClick}
      className="group bg-surface-900 rounded-2xl overflow-hidden border border-surface-800 hover:border-accent-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/5 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative aspect-[3/4] bg-surface-800 overflow-hidden">
        {game.coverUrl ? (
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-surface-600 text-4xl font-bold">{game.title[0]}</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} />
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <RatingBadge rating={rating} />
          {hoursPlayed > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-surface-300 bg-surface-950/80 backdrop-blur-sm rounded-full px-2 py-1">
              <Clock size={12} />
              {formatHours(hoursPlayed)}
            </span>
          )}
        </div>
        {status === 'wishlist' && price?.cheapestPrice != null && (
          <a
            href={price.dealUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 right-2 flex items-center gap-1 text-xs text-emerald-300 bg-surface-950/80 backdrop-blur-sm rounded-full px-2.5 py-1 hover:bg-surface-950 transition-colors"
          >
            <DollarSign size={12} />
            ${price.cheapestPrice.toFixed(2)}
            {price.storeName && (
              <>
                <span className="text-surface-500 mx-0.5">·</span>
                {price.storeName}
              </>
            )}
            <ExternalLink size={10} className="opacity-60" />
          </a>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-surface-100 truncate group-hover:text-accent-400 transition-colors">
          {game.title}
        </h3>

        {review && (
          <div className="flex items-start gap-1.5 text-xs text-surface-400">
            <MessageSquare size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{review}</span>
          </div>
        )}
      </div>
    </div>
  )
}
