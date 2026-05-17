import type { GameStatus } from '../../types'

interface StatusBadgeProps {
  status: GameStatus
  size?: 'sm' | 'md'
}

const statusConfig: Record<GameStatus, { label: string; classes: string }> = {
  playing: { label: 'Playing', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  completed: { label: 'Completed', classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  dropped: { label: 'Dropped', classes: 'bg-red-500/15 text-red-400 border-red-500/30' },
  wishlist: { label: 'Wishlist', classes: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span className={`inline-flex items-center rounded-full font-medium border ${sizeClasses} ${config.classes}`}>
      {config.label}
    </span>
  )
}
