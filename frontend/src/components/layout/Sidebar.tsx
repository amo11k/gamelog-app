import { NavLink } from 'react-router-dom'
import { Home, Search, Library, User, Gamepad2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Search' },
]

const authItems = [
  { to: '/library', icon: Library, label: 'My Library' },
]

export default function Sidebar() {
  const { user } = useAuth()

  const profileItem = user
    ? [{ to: `/profile/${user.username}`, icon: User, label: 'Profile' }]
    : []

  const allItems = [
    ...navItems,
    ...(user ? authItems : []),
    ...profileItem,
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-surface-800 bg-surface-950/50">
      <div className="flex-1 py-6 px-3 space-y-1">
        {allItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent-500/10 text-accent-400'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-surface-800">
        <div className="flex items-center gap-3 px-2">
          <Gamepad2 className="w-5 h-5 text-accent-400" />
          <span className="text-xs text-surface-500">
            Track your gaming journey
          </span>
        </div>
      </div>
    </aside>
  )
}
