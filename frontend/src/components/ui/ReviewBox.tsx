import type { Review } from '../../types'
import { formatDistanceToNow } from '../../utils/date'

interface ReviewBoxProps {
  review: Review
  compact?: boolean
}

export default function ReviewBox({ review, compact = false }: ReviewBoxProps) {
  return (
    <div className="bg-surface-900/50 rounded-xl border border-surface-700/50 p-4">
      <div className="flex items-start justify-between gap-3">
        {!compact && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-sm font-bold">
              {review.user.username[0].toUpperCase()}
            </div>
            <span className="text-sm font-medium text-surface-200">{review.user.username}</span>
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span className="text-yellow-400 text-sm font-bold">{review.rating.toFixed(1)}</span>
          <span className="text-surface-500 text-xs">{formatDistanceToNow(review.createdAt)}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-surface-300 leading-relaxed">
        {compact && review.content.length > 100
          ? `${review.content.slice(0, 100)}...`
          : review.content}
      </p>
    </div>
  )
}
