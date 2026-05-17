import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gamepad2, Menu, X, Search, Library, User, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-accent-500/20 flex items-center justify-center group-hover:bg-accent-500/30 transition-colors">
              <Gamepad2 className="w-5 h-5 text-accent-400" />
            </div>
            <span className="text-xl font-bold text-surface-100 group-hover:text-accent-400 transition-colors">
              GameLog
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/search" icon={<Search size={18} />} label="Search" />
            {isAuthenticated && (
              <>
                <NavLink to="/library" icon={<Library size={18} />} label="Library" />
                <NavLink to={`/profile/${user!.username}`} icon={<User size={18} />} label="Profile" />
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={`/profile/${user!.username}`}
                  className="flex items-center gap-2 text-sm text-surface-300 hover:text-surface-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400 text-xs font-bold">
                    {user!.username[0].toUpperCase()}
                  </div>
                  <span className="hidden lg:inline">{user!.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-surface-400 hover:text-surface-200 hover:bg-surface-800 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-xl text-sm font-medium transition-all cursor-pointer"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-surface-400 hover:text-surface-200 rounded-xl transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-800 bg-surface-950">
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink to="/search" icon={<Search size={18} />} label="Search" onClick={() => setMobileOpen(false)} />
            {isAuthenticated ? (
              <>
                <MobileNavLink to="/library" icon={<Library size={18} />} label="Library" onClick={() => setMobileOpen(false)} />
                <MobileNavLink to={`/profile/${user!.username}`} icon={<User size={18} />} label="Profile" onClick={() => setMobileOpen(false)} />
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-surface-400 hover:text-red-400 hover:bg-surface-800 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <MobileNavLink to="/login" icon={<LogIn size={18} />} label="Sign In" onClick={() => setMobileOpen(false)} />
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 text-sm text-surface-400 hover:text-surface-100 hover:bg-surface-800 rounded-xl transition-all"
    >
      {icon}
      {label}
    </Link>
  )
}

function MobileNavLink({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 text-sm text-surface-400 hover:text-surface-100 hover:bg-surface-800 rounded-xl transition-all"
    >
      {icon}
      {label}
    </Link>
  )
}
