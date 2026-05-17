import { Link } from 'react-router-dom'
import { Gamepad2, Star, Users, ArrowRight, Search, Library } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTrendingGames } from '../hooks/useGames'
import { GameCardSkeleton } from '../components/ui/LoadingSkeleton'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const { data: trending, isLoading } = useTrendingGames()

  return (
    <div className="min-h-screen bg-surface-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-6">
              <Star size={14} />
              Track. Rate. Share.
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-surface-100 leading-tight mb-6">
              Your Gaming Journey,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-purple-400"> Tracked</span>
            </h1>
            <p className="text-lg md:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover, track, and share your gaming adventures. Keep a record of every game you play, rate your experiences, and connect with fellow gamers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/search"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-500 text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:shadow-accent-500/25"
                  >
                    <Search size={20} />
                    Discover Games
                  </Link>
                  <Link
                    to="/library"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-surface-800 hover:bg-surface-700 text-surface-200 rounded-2xl font-semibold transition-all border border-surface-700"
                  >
                    <Library size={20} />
                    My Library
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-accent-600 hover:bg-accent-500 text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:shadow-accent-500/25"
                  >
                    Get Started Free
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-surface-800 hover:bg-surface-700 text-surface-200 rounded-2xl font-semibold transition-all border border-surface-700"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-surface-100">Trending Now</h2>
            <p className="text-surface-400 text-sm mt-1">Most popular games this week</p>
          </div>
          <Link
            to="/search"
            className="text-sm text-accent-400 hover:text-accent-300 font-medium flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {isLoading
            ? [...Array(5)].map((_, i) => <GameCardSkeleton key={i} />)
            : trending?.map((game) => (
                <Link
                  key={game.id}
                  to={`/search?game=${game.id}`}
                  className="group bg-surface-900 rounded-2xl overflow-hidden border border-surface-800 hover:border-accent-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-500/5 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] bg-surface-800 overflow-hidden">
                    {game.coverUrl ? (
                      <img
                        src={game.coverUrl}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gamepad2 className="w-10 h-10 text-surface-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-surface-100 truncate group-hover:text-accent-400 transition-colors">
                      {game.title}
                    </h3>
                    {game.genres && (
                      <p className="text-xs text-surface-500 mt-1">{game.genres}</p>
                    )}
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <section className="border-t border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-100">Why GameLog?</h2>
            <p className="text-surface-400 mt-2">Everything you need to manage your game collection</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Library,
                title: 'Track Everything',
                description: 'Keep a detailed record of every game you play, want to play, or have completed.',
              },
              {
                icon: Star,
                title: 'Rate & Review',
                description: 'Share your thoughts with ratings and reviews. Let others know what you think.',
              },
              {
                icon: Users,
                title: 'Public Profiles',
                description: 'Show off your gaming history with a shareable public profile page.',
              },
            ].map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-surface-900 rounded-2xl p-8 border border-surface-800 hover:border-accent-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 flex items-center justify-center mb-5 group-hover:bg-accent-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-accent-400" />
                </div>
                <h3 className="text-lg font-semibold text-surface-100 mb-2">{title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="border-t border-surface-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="bg-gradient-to-r from-accent-600/10 to-purple-600/10 rounded-3xl p-12 md:p-16 border border-accent-500/20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-surface-100 mb-4">
                Ready to start tracking?
              </h2>
              <p className="text-surface-400 text-lg max-w-xl mx-auto mb-8">
                Join thousands of gamers tracking their journey. It's free to get started.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-600 hover:bg-accent-500 text-white rounded-2xl font-semibold transition-all hover:shadow-lg hover:shadow-accent-500/25 text-lg"
              >
                Create Your Account
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-surface-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-accent-400" />
            <span className="text-surface-400 text-sm">GameLog</span>
          </div>
          <p className="text-surface-600 text-xs">Track your gaming journey</p>
        </div>
      </footer>
    </div>
  )
}
