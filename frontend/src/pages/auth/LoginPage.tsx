import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Gamepad2, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ email: '', password: '' })

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err: { response?: { data?: { message?: string } } } | unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid credentials'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group mb-6">
            <div className="w-12 h-12 rounded-2xl bg-accent-500/20 flex items-center justify-center group-hover:bg-accent-500/30 transition-colors">
              <Gamepad2 className="w-7 h-7 text-accent-400" />
            </div>
            <span className="text-2xl font-bold text-surface-100">GameLog</span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-100">Welcome back</h1>
          <p className="text-surface-400 mt-1">Sign in to continue your gaming journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-surface-900 border-2 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none transition-all ${
                  errors.email ? 'border-red-500' : 'border-surface-700 focus:border-accent-500'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full pl-10 pr-12 py-3 bg-surface-900 border-2 rounded-xl text-surface-100 placeholder-surface-500 focus:outline-none transition-all ${
                  errors.password ? 'border-red-500' : 'border-surface-700 focus:border-accent-500'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-600 hover:bg-accent-500 disabled:bg-accent-600/50 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="text-center text-surface-400 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
