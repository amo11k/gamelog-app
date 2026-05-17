import { Star } from 'lucide-react'

interface RatingBadgeProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showEmpty?: boolean
}

export default function RatingBadge({ rating, size = 'md', showEmpty = false }: RatingBadgeProps) {
  if (!rating && !showEmpty) return null

  const sizeClasses = {
    sm: 'text-xs gap-0.5 px-1.5 py-0.5',
    md: 'text-sm gap-1 px-2 py-1',
    lg: 'text-base gap-1.5 px-3 py-1.5',
  }

  const iconSize = { sm: 12, md: 14, lg: 18 }

  const color =
    rating >= 8 ? 'text-emerald-400 bg-emerald-500/10'
    : rating >= 6 ? 'text-yellow-400 bg-yellow-500/10'
    : rating >= 4 ? 'text-orange-400 bg-orange-500/10'
    : 'text-red-400 bg-red-500/10'

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${sizeClasses[size]} ${color}`}>
      <Star size={iconSize[size]} fill="currentColor" />
      <span>{rating ? rating.toFixed(1) : '--'}</span>
    </span>
  )
}
