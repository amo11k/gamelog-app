interface SkeletonProps {
  className?: string
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-lg bg-surface-800 ${className}`} />
  )
}

export function GameCardSkeleton() {
  return (
    <div className="bg-surface-900 rounded-2xl overflow-hidden border border-surface-800">
      <Skeleton className="w-full aspect-[3/4] rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export function UserCardSkeleton() {
  return (
    <div className="bg-surface-900 rounded-2xl p-6 border border-surface-800 flex items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

export function SearchResultSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <Skeleton className="w-12 h-16 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Skeleton
