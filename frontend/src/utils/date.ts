export function formatDistanceToNow(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 5) return `${diffWeeks}w ago`
  return `${diffMonths}mo ago`
}

export function formatHours(hours: number): string {
  if (hours < 1) return '< 1h'
  if (hours >= 1000) return `${(hours / 1000).toFixed(1)}k`
  return `${Math.round(hours)}h`
}
