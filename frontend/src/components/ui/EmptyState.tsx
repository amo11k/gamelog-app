import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-surface-500" />
      </div>
      <h3 className="text-lg font-semibold text-surface-300 mb-1">{title}</h3>
      {description && <p className="text-sm text-surface-500 text-center max-w-sm mb-4">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
